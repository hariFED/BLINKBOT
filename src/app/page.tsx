// app/page.tsx
"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import ConnectButton from "./components/AppWalletProvider";
import BlinkProvider from "./components/BlinkProvider";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <div>
        <WalletMultiButton/>
      </div>
      <div>
        <BlinkProvider />
      </div>
    </main>
  );
}
