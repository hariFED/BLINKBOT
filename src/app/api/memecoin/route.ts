import { NextResponse } from "next/server";

const DEXSCREENER_API = process.env.PROVIDER_URL;

export async function GET(request: Request) {

  const { searchParams } = new URL(request.url);

  const contractAddress = searchParams.get("ca");

  const chainId = "solana";

  if (!contractAddress) {

    return NextResponse.json(
      { error: "Contract address (ca) is required." },
      { status: 400 },
    );

  }

  try {

    const response = await fetch(

      `${DEXSCREENER_API}/${chainId}/${contractAddress}`,

    );

    if (!response.ok) {
      
      return NextResponse.json(
      
        { error: `Failed to fetch token data: ${response.statusText}` },
      
        { status: response.status },
        
      );

    }

    const data = await response.json();

    const result = {

      name: data.basetoken.name,
      symbol: data.basetoken.symbol,
      marketCap: data.marketCap,
      price: data.priceUsd,
      circulatingSupply: data.marketCap / data.priceUsd,
      totalSupply: data.fdv / data.priceUsd,

    };

    return NextResponse.json(result, { status: 200 });

  } catch (error) {

    console.error("Error fetching meme coin info:", error);

    return NextResponse.json(

      { error: "Internal server error. Please try again later." },

      { status: 500 },
      
    );
  }
}
