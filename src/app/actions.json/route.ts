import { ActionsJson, createActionHeaders } from "@solana/actions";
const headers = createActionHeaders({
  chainId: "devnet",
  actionVersion: "2.2.1",
});

export const GET = async () => {
  const payload: ActionsJson = {
    rules: [
      {
        pathPattern: "http://localhost:3000/contract-address",
        apiPath: "http://localhost:3000/api/actions/contract-address",
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
