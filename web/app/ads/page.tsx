"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useSmartAccount } from "@/hooks/useSmartAccount";
import { getContracts } from "@/lib/contracts";

interface Ad {
  advertiser: string;
  title: string;
  description: string;
  videoUrl: string;
  adSpot: string;
  fundedAmount: bigint;
  totalViews: bigint;
}

export default function AdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const {
    provider,
    smartAccountAddress,
    error: accountError,
    deploySmartAccount,
    watchAd,
  } = useSmartAccount();

  useEffect(() => {
    const loadAds = async () => {
      if (!provider) return;

      try {
        const contracts = getContracts(provider);
        const availableAds = await contracts.snapAds.getAvailableAds();
        setAds(availableAds);
      } catch (err) {
        console.error("Failed to load ads:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAds();
  }, [provider]);

  const handleWatchAd = async (ad: Ad) => {
    try {
      if (!smartAccountAddress) {
        await deploySmartAccount();
      }

      await watchAd(ad.adSpot, ad.advertiser);
      // Refresh ads list after watching
      const contracts = getContracts(provider!);
      const availableAds = await contracts.snapAds.getAvailableAds();
      setAds(availableAds);
    } catch (err) {
      console.error("Failed to watch ad:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Loading ads...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Available Ads</h2>
          <p className="mt-3 text-xl text-gray-500">
            Watch ads to earn rewards - no gas fees required!
          </p>
        </div>

        {accountError && (
          <div className="mt-8 max-w-xl mx-auto bg-red-50 p-4 rounded-md">
            <p className="text-red-700">{accountError}</p>
          </div>
        )}

        {!smartAccountAddress && (
          <div className="mt-8 max-w-xl mx-auto">
            <button
              onClick={deploySmartAccount}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Connect Smart Account
            </button>
          </div>
        )}

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {ads.map((ad, index) => (
            <div
              key={index}
              className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
            >
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {ad.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{ad.description}</p>
                <div className="mt-4">
                  <span className="text-sm font-medium text-gray-500">
                    Views: {ad.totalViews.toString()}
                  </span>
                  <span className="mx-2">•</span>
                  <span className="text-sm font-medium text-gray-500">
                    Funded: {ethers.formatEther(ad.fundedAmount)} ETH
                  </span>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50">
                <button
                  onClick={() => handleWatchAd(ad)}
                  disabled={!smartAccountAddress}
                  className={`w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                    ${
                      smartAccountAddress
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                >
                  Watch Ad
                </button>
              </div>
            </div>
          ))}
        </div>

        {ads.length === 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-500 text-lg">
              No ads available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
