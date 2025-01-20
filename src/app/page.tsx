// app/page.tsx
"use client";

import ConnectButton from "./components/AppWalletProvider";
import BlinkProvider from "./components/BlinkProvider";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <div>
        <ConnectButton />
      </div>
      <div>
        <BlinkProvider />
      </div>
    </main>
  );
}
