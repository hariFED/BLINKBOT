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

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const headers = createActionHeaders({
  chainId: "devnet",
  actionVersion: "2.2.1",
});



export const GET = async (req:Request) => {
  const payload : ActionGetResponse ={
    title: "BLINKBOT : A blink bonk bot",
    icon: `${process.env.BASE_URL}/logo.png`,
    description:"Enter the CA(Contract Address) of the memecoin you want to buy",
    label: "Search",
    links:{
      actions:[
        {
          label: "Search",
          href: `/api/actions/contract-address?ca={ca}`,
          type: "post",
          parameters:[
            {
              name:"ca",
              type:"text",
              label:"Enter the CA"
            }
          ]
            
        }
      ]
    }
  };

  return  Response.json(payload, {
    headers,
  });
};

export const OPTIONS = GET;

export const POST = async (req: NextRequest) => {
  try {

    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const contractAddress = searchParams.get("ca") ?? "";
    const orgKey = body.account;

    const memedetails = await fetch(`http://localhost:3000/api/memecoin?ca=${contractAddress}`)

    const data = await memedetails.json();

    return Response.json({
      type:"action",
      title:`${data.name} (${data.symbol})`,
      label:"BUY",
      icon:`${data.image}`,
      description:`
      Price : $${data.price}
      5m : ${data.priceChanges.m5}%, 1hr : ${data.priceChanges.h1}%, 6hr : ${data.priceChanges.h6}%, 24hr : ${data.priceChanges.h24}%
      Market Cap : ${data.marketCap}
      `,
      links:{
        actions:[
          {
            type:"external-link",
            label:"Dexscreener",
            href:`${data.dexscrennerUrl}`,
          },
          {
            type:"external-link",
            label:"Website",
            href:`${data.website}`,
          },
          {
            type:"external-link",
            label:"Twitter",
            href:`${data.twitter}`,
          },
        ]

      }

    }satisfies Action);

    

    

    
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