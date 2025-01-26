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

    type Social = {
      type: string;
      url: string;
    };


    const result = {
      name: data.baseToken.name,
      symbol: data.baseToken.symbol,
      address: data.baseToken.address,
      marketCap: formatNumber(data.marketCap),
      price: data.priceUsd,
      image: data.info && data.info.imageUrl ? data.info.imageUrl : `${process.env.BASE_URL}/pagenotfound.png`,
      priceChanges: data.priceChange,
      dexscreenerUrl: data.url || null,
      website:
        data.info &&
        data.info.websites &&
        data.info.websites.length > 0 &&
        data.info.websites[0].url
          ? data.info.websites[0].url
          : null,
      twitter:
        data.info &&
        data.info.socials &&
        data.info.socials.length > 0 &&
        data.info.socials.find((social: Social) => social.type === "twitter")
          ? data.info.socials.find(
              (social: Social) => social.type === "twitter"
            ).url
          : null,
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
