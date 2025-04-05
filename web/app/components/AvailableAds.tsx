"use client";

import { useEffect, useState } from "react";
import { useSnapAds } from "../../hooks/useSnapAds";

interface Ad {
  id: string;
  adSpotContract: string;
  name: string;
  description: string;
  ipfsVideoCID: string;
  totalFunded: string;
}

export default function AvailableAds() {
  const [ads, setAds] = useState<Ad[]>([]);
  const { isLoading, error, getAvailableAds, getAdInteractions } = useSnapAds();
  const [interactions, setInteractions] = useState<{ [key: string]: number }>(
    {}
  );

  useEffect(() => {
    const loadAds = async () => {
      const availableAds = await getAvailableAds();
      setAds(availableAds);

      // Load interactions for each ad
      const interactionCounts: { [key: string]: number } = {};
      for (const ad of availableAds) {
        const count = await getAdInteractions(ad.id);
        interactionCounts[ad.id] = count;
      }
      setInteractions(interactionCounts);
    };

    loadAds();
  }, [getAvailableAds, getAdInteractions]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {ads.map((ad) => (
        <div
          key={ad.id}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <video
            src={`https://gateway.pinata.cloud/ipfs/${ad.ipfsVideoCID}`}
            className="w-full h-48 object-cover"
            controls
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{ad.name}</h3>
            <p className="text-gray-600 text-sm mb-3">{ad.description}</p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-blue-600">{ad.totalFunded} ETH funded</span>
              <span className="text-gray-500">
                {interactions[ad.id] || 0} views
              </span>
            </div>
          </div>
        </div>
      ))}
      {ads.length === 0 && (
        <div className="col-span-full text-center text-gray-500 py-8">
          No ads available
        </div>
      )}
    </div>
  );
}
