"use client";

import "@reown/appkit";
import { useEffect, useRef } from "react";
import { createAppKit } from "@reown/appkit/react";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import { solana, solanaTestnet, solanaDevnet } from "@reown/appkit/networks";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

const ConnectButton = () => {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (buttonRef.current) {
      const button = document.createElement("appkit-button");
      buttonRef.current.appendChild(button);
    }
  }, []);

  useEffect(() => {
    const solanaWeb3JsAdapter = new SolanaAdapter({
      wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    });

    const projectId = "8c91b676dd8de161a3521fd5fd292271";

    const metadata = {
      name: "AppKit",
      description: "AppKit Solana Example",
      url: "https://example.com",
      icons: ["https://avatars.githubusercontent.com/u/179229932"],
    };

    createAppKit({

      adapters: [solanaWeb3JsAdapter],
      networks: [solana, solanaTestnet, solanaDevnet],
      metadata: metadata,
      projectId,
      features: {
        analytics: true,
      },
    });
  }, []);

  return <div ref={buttonRef}></div>;
};

export default ConnectButton;
