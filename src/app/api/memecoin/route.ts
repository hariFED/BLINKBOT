import { NextResponse } from "next/server";

const DEXSCREENER_API = process.env.PROVIDER_URL;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const contractAddress = searchParams.get("ca");

  const chainId = "solana";

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

  if (!contractAddress) {
    return NextResponse.json(
      { error: "Contract address (ca) is required." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${DEXSCREENER_API}/${chainId}/${contractAddress}`
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch token data: ${response.statusText}` },

        { status: response.status }
      );
    }

    const data = (await response.json())[0];

    if (!data) {
      return NextResponse.json(
        { error: "Failed to fetch token data." },
        { status: 500 }
      );
    }

    const result = {
      name: data.baseToken.name,
      symbol: data.baseToken.symbol,
      address: data.baseToken.address,
      marketCap:formatNumber(data.marketCap),
      price: data.priceUsd,
      image:data.info.imageUrl,
      priceChanges:data.priceChange,
      dexscrennerUrl:data.url,
      website:data.info.websites[0].url,
      twitter:data.info.socials[0].type == "twitter" ? data.info.socials[0].url:"No Twitter",
    };



    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching meme coin info:", error);

    return NextResponse.json(
      { error: "Internal server error. Please try again later." },

      { status: 500 }
    );
  }
}
