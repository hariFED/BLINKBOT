import { NextResponse } from "next/server";

const COINGECKO_API = process.env.PROVIDER_URL;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const contractAddress = searchParams.get("ca");
  const platform = "solana";

  if (!contractAddress) {
    return NextResponse.json(
      { error: "Contract address (ca) is required." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/${platform}/contract/${contractAddress}`,
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch token data: ${response.statusText}` },
        { status: response.status },
      );
    }

    const data = await response.json();

    const result = {
      name: data.name,
      symbol: data.symbol,
      marketCap: data.market_data.market_cap.usd,
      price: data.market_data.current_price.usd,
      circulatingSupply: data.market_data.circulating_supply,
      totalSupply: data.market_data.total_supply,
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
