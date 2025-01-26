import { Action, createActionHeaders } from "@solana/actions";
import { NextRequest } from "next/server";
import sharp from "sharp";
import fetch from "node-fetch";


const headers = createActionHeaders({
  chainId: "devnet",
  actionVersion: "2.2.1",
});

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
    const { pathname } = new URL(req.url);
    const pathSegments = pathname.split("/");
    const ca = pathSegments[4];

    const memedetails = await fetch(
      `http://localhost:3000/api/memecoin?ca=${ca}`
    );

    const data = await memedetails.json();    


    const imageUrl = data.image;
    const response = await fetch(imageUrl);
    const buffer = await response.buffer();

    // Use Sharp to get metadata
    const metadata = await sharp(buffer).metadata();
    const originalWidth = metadata.width; // Get the actual width of the image

    if (!originalWidth) {
      throw new Error("Unable to determine image width from metadata");
    }

    // Upscale the image by 3x and apply sharpening
    const upscaledBuffer = await sharp(buffer)
      .resize({ width: Math.ceil(originalWidth*3) }) // Upscale by 3x
      .sharpen(10)
      .toBuffer();

    // Encode the upscaled image to a Base64 URL
    const upscaledImageBase64 = `data:image/png;base64,${upscaledBuffer.toString("base64")}`;
    const dxscreen = data.dexscreenerUrl == null ? `${process.env.BASE_URL}/404pagenotfind` : data.dexscreenerUrl;
    const tweet = data.twitter == null ? `${process.env.BASE_URL}/404pagenotfind` : data.twitter;
    const webpage = data.website == null ? `${process.env.BASE_URL}/404pagenotfind` : data.dexscreenerUrl;

    const dexscreenerUrl = new URL(dxscreen);
    const Website = new URL(webpage);
    const twitter = new URL(tweet);

    const payload = {
      type: "action",
      title: `${data.name} (${data.symbol})`,
      label: "BUY",
      icon: upscaledImageBase64,
      description: `
      Price : $${data.price}
      5m : ${data.priceChanges.m5}%, 1hr : ${data.priceChanges.h1}%, 6hr : ${data.priceChanges.h6}%, 24hr : ${data.priceChanges.h24}%
      Market Cap : ${data.marketCap}
        `,
      links: {
        actions: [
          {
            type: "external-link",
            label: "Dexscreener",
            href: `/api/actions/links/dexscreener?dexScreener=${dexscreenerUrl}&ca=${ca}`,
          },
          {
            type: "external-link",
            label: "Website",
            href: `/api/actions/links/website?website=${Website}&ca=${ca}`,
          },
          {
            type: "external-link",
            label: "Twitter",
            href: `/api/actions/links/twitter?twitter=${twitter}&ca=${ca}`,
          },
          {
            type: "post",
            label: "0.1 SOL", 
            href: `/api/actions/swapConfirmation?amount=0.1&contractAddress=${ca}&tokenName=${data.name}&img=${data.image}&price=${data.price}`,
          },
          {
            type: "post",
            label: "0.5 SOL",
            href: `/api/actions/swapConfirmation?amount=0.5&contractAddress=${ca}&tokenName=${data.name}&img=${data.image}&price=${data.price}`,
          },
          {
            type: "post",
            label: "1 SOL", // button text
            href: `/api/actions/swapConfirmation?amount=1&contractAddress=${ca}&tokenName=${data.name}&img=${data.image}&price=${data.price}`,
          },
          {
            type: "post",
            label: "Swap", // button text
            href: `/api/actions/swapConfirmation?amount={amount}&contractAddress=${ca}&tokenName=${data.name}&img=${data.image}&price=${data.price}`,
            parameters: [
              {
                name: "amount",
                label: "Enter a custom SOL amount",
              },
            ],
          },
        ],
      },
    } satisfies Action;

    return Response.json(payload, {
      headers,
    });
  } catch (error) {
    console.error("Error processing POST request:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      {
        status: 500,
        headers,
      }
    );
  }
};
