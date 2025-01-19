// app/page.tsx
"use client";

import ConnectButton from "./components/AppWalletProvider";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <ConnectButton />
    </main>
  );
}
