import { useState, useCallback } from "react";
import { ethers } from "ethers";
import {
  registerAdSpot,
  publishAd,
  getAvailableAdSpots,
  getAvailableAds,
  getAdInteractionsCount,
} from "../utils/contractInteractions";

export const useSnapAds = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSigner = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("Please install MetaMask to use this feature");
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    return provider.getSigner();
  };

  const handleRegisterAdSpot = async (
    contractAddress: string,
    spotName: string,
    description: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const signer = await getSigner();
      await registerAdSpot(signer, contractAddress, spotName, description);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishAd = async (
    adSpotContract: string,
    name: string,
    description: string,
    ipfsVideoCID: string,
    fundAmount: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const signer = await getSigner();
      await publishAd(
        signer,
        adSpotContract,
        name,
        description,
        ipfsVideoCID,
        fundAmount
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetAvailableAdSpots = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const signer = await getSigner();
      return await getAvailableAdSpots(signer);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetAvailableAds = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const signer = await getSigner();
      return await getAvailableAds(signer);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetAdInteractions = async (adId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const signer = await getSigner();
      return await getAdInteractionsCount(signer, adId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return 0;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    registerAdSpot: handleRegisterAdSpot,
    publishAd: handlePublishAd,
    getAvailableAdSpots: handleGetAvailableAdSpots,
    getAvailableAds: handleGetAvailableAds,
    getAdInteractions: handleGetAdInteractions,
  };
};
