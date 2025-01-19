import { ActionsJson, createActionHeaders } from "@solana/actions";
const headers = createActionHeaders({
  chainId: "devnet",
  actionVersion: "2.2.1",
});

export const GET = async () => {
  const payload: ActionsJson = {
    rules: [
      {
        pathPattern: "/contract-address",
        apiPath: "/api/actions/contract-address",
      },
      {
        pathPattern: "/memecoin/*",
        apiPath: "/api/actions/memecoin/*",
      },
    ],
  };

  return Response.json(payload, {
    headers,
  });
};

export const OPTIONS = GET;