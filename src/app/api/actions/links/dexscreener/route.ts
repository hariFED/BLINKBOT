import {
 
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createActionHeaders,
} from "@solana/actions";
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
  const { searchParams } = new URL(req.url);
  const dexScreenerLink = searchParams.get("dexScreener") ?? "";
  const ca = searchParams.get("ca") ?? "";

  const payload =  ({
    type: "external-link",
    externalLink:`${dexScreenerLink}`,
    links: {
      next: {
        type: "post",
        href: `/api/actions/memecoin/${ca}`,
      },
    },
    
  } satisfies ActionPostResponse);
  return Response.json(payload, {
    headers:ACTIONS_CORS_HEADERS,
  });
};
