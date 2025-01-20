import { NextRequest } from "next/server";
import {
  Transaction,
  PublicKey,
  SystemProgram,
  Connection,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  ActionPostResponse,
  createActionHeaders,
  createPostResponse,
  ActionGetResponse,
  ActionPostRequest,
  Action,
  ACTIONS_CORS_HEADERS,
} from "@solana/actions";
const headers = createActionHeaders({
  chainId: "devnet",
  actionVersion: "2.2.1",
});

export const GET = async (req: Request) => {
  const payload: ActionGetResponse = {
    title: "BLINKBOT : A blink bonk bot",
    icon: `http://localhost:3000/logo.png`,
    description:
      "Enter the CA(Contract Address) of the memecoin you want to buy",
    label: "Search",
    links: {
      actions: [
        {
          label: "Search",
          href: `/api/actions/contract-address?ca={ca}`,
          type: "post",
          parameters: [
            {
              name: "ca",
              type: "text",
              label: "Enter the CA",
            },
          ],
        },
      ],
    },
  };

  return Response.json(payload, {
    headers,
  });
};

export const OPTIONS = GET;

export const POST = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const contractAddress = searchParams.get("ca") ?? "";

  const payload =  ({
    type: "post",
    links: {
      next: {
        type: "post",
        href: `/api/actions/memecoin/${contractAddress}`,
      },
    },
  } satisfies ActionPostResponse);
  return Response.json(payload, {
    headers:ACTIONS_CORS_HEADERS,
  });
};
