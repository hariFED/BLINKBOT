import {
  Action,
  createActionHeaders,
  ACTIONS_CORS_HEADERS,
  ActionPostResponse,
} from "@solana/actions";
import { NextRequest } from "next/server";
import { LAMPORTS_PER_SOL, Connection, PublicKey } from "@solana/web3.js";
import fetch from "cross-fetch";

const headers = {
    chainId: "devnet",
    actionVersion: "2.2.1",
};

const getTokenDecimals = async (mintAddress: string) => {
  try {
    const url = `https://tokens.jup.ag/token/${mintAddress}`;
    const response = await fetch(url);

    const json = await response.json();
    const decimals = json.decimals;

    return decimals;
  } catch (error) {
    console.error("Error fetching token decimals:", error);
    throw new Error("Failed to fetch token decimals");
  }
};

function formatNumber(num: number) {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(2) + "B"; // Billions
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + "M"; // Millions
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(2) + "k"; // Thousands
  }
  return num.toFixed(2); // Return as-is for smaller numbers
}


export const GET = async () => {
  return Response.json(
    { message: "Method not supported" },
    {
      headers,
    }
  );
};

export const OPTIONS = GET;

export const POST = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const contractAddress = searchParams.get("contractAddress") ?? "";
    const imageUrl = searchParams.get("img") ?? "";
    const price = searchParams.get("price") ?? "";
    const tokenName = searchParams.get("tokenName") ?? "";
    const amount = searchParams.get("amount") ?? "";
    const amountInLamports = Number(amount) * LAMPORTS_PER_SOL;

    const decimals = await getTokenDecimals(contractAddress);

    const quoteResponse = await fetch(
      `https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112` +
        `&outputMint=${contractAddress}` +
        `&amount=${amountInLamports}` +
        `&slippageBps=50`
    ).then((res) => res.json());

    if (quoteResponse.error) {
      throw new Error(`Jupiter API error: ${quoteResponse.error}`);
    }

    const rawOutAmount = quoteResponse.outAmount ?? 0;
    const tokenAmount = formatNumber(rawOutAmount / Math.pow(10, decimals));

    const payload = {
      type: "action",
      title: `Swap ${amount} SOL for ${tokenAmount} ${tokenName}`,
      label: "BUY",
      icon: imageUrl,
      description: `You will get ${tokenAmount} ${tokenName} for ${amount} SOL at the rate of $${price} per ${tokenName}`,
      links: {
        actions: [
          {
            type: "transaction",
            label: "Confirm",
            href: `/api/swap/confirm?contractAddress=${contractAddress}&amount=${amount}`,
          },
        ],
      },
    };

    return Response.json(payload, {
      headers,
    });
    } catch (error: any) {
    console.error("Error processing POST request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers,
      }
    );
  }
};
