import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../../contracts/SnapAds";
import { SnapAdsContract } from "../../contracts/types";

// Get contract instance
const getContract = async (signer: ethers.Signer): Promise<SnapAdsContract> => {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer).connect(
    signer
  ) as SnapAdsContract;
};

// Register an ad spot
export const registerAdSpot = async (
  signer: ethers.Signer,
  contractAddress: string,
  spotName: string,
  description: string
) => {
  try {
    const contract = await getContract(signer);
    const tx = await contract.registerAdSpot(
      contractAddress,
      spotName,
      description
    );
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Error registering ad spot:", error);
    throw error;
  }
};

// Get available ad spots
export const getAvailableAdSpots = async (signer: ethers.Signer) => {
  try {
    const contract = await getContract(signer);
    const [addresses, names, descriptions] =
      await contract.getAvailableAdSpots();
    console.log(addresses, names, descriptions);
    return addresses.map((address: string, index: number) => ({
      contractAddress: address,
      spotName: names[index],
      description: descriptions[index],
      isAvailable: true, // We'll assume available since they're returned by getAvailableAdSpots
    }));
  } catch (error) {
    console.error("Error getting available ad spots:", error);
    throw error;
  }
};

// Publish an ad
export const publishAd = async (
  signer: ethers.Signer,
  adSpotContract: string,
  name: string,
  description: string,
  ipfsVideoCID: string,
  fundAmount: string
) => {
  try {
    const contract = await getContract(signer);
    const valueInWei = ethers.parseEther(fundAmount);
    const tx = await contract.publishAd(
      adSpotContract,
      name,
      description,
      ipfsVideoCID,
      valueInWei.toString()
    );
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Error publishing ad:", error);
    throw error;
  }
};

// Get available ads
export const getAvailableAds = async (signer: ethers.Signer) => {
  try {
    const contract = await getContract(signer);
    const [ids, adSpotAddresses, names, descriptions, videoLinks, funds] =
      await contract.getAvailableAds();

    return ids.map((id: string, index: number) => ({
      id,
      adSpotContract: adSpotAddresses[index],
      name: names[index],
      description: descriptions[index],
      ipfsVideoCID: videoLinks[index],
      totalFunded: ethers.formatEther(funds[index]),
    }));
  } catch (error) {
    console.error("Error getting available ads:", error);
    throw error;
  }
};

// Get ad interactions count
export const getAdInteractionsCount = async (
  signer: ethers.Signer,
  adId: string
) => {
  try {
    const contract = await getContract(signer);
    const count = await contract.adInteractionsLength(adId);
    return count;
  } catch (error) {
    console.error("Error getting ad interactions count:", error);
    throw error;
  }
};
