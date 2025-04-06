"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSnapAds } from "@/hooks/useSnapAds";
import { Button } from "@/app/components/Button";
import { Card } from "@/app/components/Card";
import { ethers } from "ethers";
import { usePathname } from "next/navigation";
import { getAdDetails } from "@/app/utils/contractInteractions";
import WorldIDVerification from "@/app/components/WorldIDVerification";
import { watchAd } from "@/app/utils/contractInteractions";

import AdVideoPlayer from "@/app/components/AdVideoPlayer";

interface Ad {
  id: string;
  adSpotContract?: string;
  advertiser?: string;
  name: string;
  description: string;
  ipfsVideoCID: string;
  totalFunded: string;
}

export default function WatchAdPage() {
  const pathname = usePathname();
  const adId = pathname.split("/")[2];

  const [address, setAddress] = useState<string | null>(null);
  const [hasWatched, setHasWatched] = useState(false);
  //   const [currentAd, setCurrentAd] = useState<Ad | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  const ipfsGateway = "https://white-official-scallop-559.mypinata.cloud/ipfs/";

  useEffect(() => {
    const fetchAd = async () => {
      if (adId) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAddress(address);
        const ad = await getAdDetails(signer, adId);
        console.log(ad);
        // setCurrentAd(ad);
      }
    };
    fetchAd();
  }, []);

  const handleVideoComplete = async () => {
    if (!address || !adId || hasWatched) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const success = await watchAd(signer, adId, address);
      if (success) {
        setHasWatched(true);
      }
    } catch (err) {
      console.error("Error recording watch:", err);
    }
  };

  if (!currentAd) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Ad not found</h1>
      </div>
    );
  }

  if (!address) {
    return (
      <div className="container mx-auto p-4">
        <Card className="max-w-md mx-auto p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600">
            Please connect your wallet to watch ads and earn rewards.
          </p>
        </Card>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="container mx-auto p-4">
        <WorldIDVerification
          onVerificationSuccess={() => setIsVerified(true)}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">{currentAd.name}</h1>
        <p className="text-gray-600 mb-6">{currentAd.description}</p>

        <AdVideoPlayer
          videoUrl={`${ipfsGateway}${currentAd.ipfsVideoCID}`}
          onWatchComplete={handleVideoComplete}
        />

        <div className="mt-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Funded Amount: {currentAd.totalFunded} ETH
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
