"use client";

import { WalletProvider } from "@solana/wallet-adapter-react";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { createAppKit } from "@reown/appkit/react";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import { solana, solanaDevnet, solanaTestnet } from "@reown/appkit/networks";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

const WalletProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()];

  const projectId = "8c91b676dd8de161a3521fd5fd292271";
  const metadata = {
    name: "Reown AppKit Example",
    description: "Reown wallet integration with Solana",
    url: "https://example.com",
    icons: ["https://avatars.githubusercontent.com/u/179229932"],
  };

  const solanaAdapter = new SolanaAdapter({ wallets });
  createAppKit({
    adapters: [solanaAdapter],
    networks: [solana, solanaDevnet, solanaTestnet],
    metadata,
    projectId,
    features: {
      analytics: true,
    },
  });

  return (
    <ConnectionProvider endpoint={clusterApiUrl("devnet")}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletProviderWrapper;
