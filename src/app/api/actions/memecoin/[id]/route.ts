import { Action, ActionError, ACTIONS_CORS_HEADERS, createActionHeaders } from "@solana/actions";
import { NextRequest } from "next/server";

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

    console.log(data)

    const payload = ({
      type: "action",
      title: `${data.name} (${data.symbol})`,
      label: "BUY",
      icon: `${data.image}`,
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
            href: `${data.dexscrennerUrl}`,
          },
          {
            type: "external-link",
            label: "Website",
            href: `${data.website}`,
          },
          {
            type: "external-link",
            label: "Twitter",
            href: `${data.twitter}`,
          },
        ],
      },
    } satisfies Action);

    return Response.json(payload,{
        headers},
    )
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
