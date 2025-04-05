"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESSES, getContracts } from "@/lib/contracts";

interface UserOperation {
  sender: string;
  nonce: string;
  initCode: string;
  callData: string;
  callGasLimit: string;
  verificationGasLimit: string;
  preVerificationGas: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  paymasterAndData: string;
}

export const useSmartAccount = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [smartAccountAddress, setSmartAccountAddress] = useState<string | null>(
    null
  );
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initProvider = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(provider);
        } catch (err) {
          setError("Failed to initialize provider");
          console.error(err);
        }
      }
    };

    initProvider();
  }, []);

  const createUserOp = async (
    functionName: string,
    args: any[],
    value: bigint = BigInt(0)
  ): Promise<UserOperation> => {
    if (!provider || !smartAccountAddress)
      throw new Error("Provider or account not initialized");

    const contracts = getContracts(provider);
    const nonce = await contracts.entryPoint.getNonce(smartAccountAddress, 0);

    // Create calldata for the function call
    const snapAdsInterface = new ethers.Interface(
      contracts.snapAds.interface.fragments
    );
    const callData = snapAdsInterface.encodeFunctionData(functionName, args);

    // Estimate gas limits (these would need to be properly calculated)
    const callGasLimit = BigInt(100000);
    const verificationGasLimit = BigInt(100000);
    const preVerificationGas = BigInt(50000);

    // Get current gas prices
    const feeData = await provider.getFeeData();
    const maxFeePerGas = feeData.maxFeePerGas || BigInt(1000000000);
    const maxPriorityFeePerGas =
      feeData.maxPriorityFeePerGas || BigInt(1000000000);

    // Create UserOperation
    const userOp: UserOperation = {
      sender: smartAccountAddress,
      nonce: nonce.toString(),
      initCode: "0x",
      callData,
      callGasLimit: callGasLimit.toString(),
      verificationGasLimit: verificationGasLimit.toString(),
      preVerificationGas: preVerificationGas.toString(),
      maxFeePerGas: maxFeePerGas.toString(),
      maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
      paymasterAndData: CONTRACT_ADDRESSES.PAYMASTER + "0x",
    };

    return userOp;
  };

  const sendUserOp = async (userOp: UserOperation) => {
    if (!provider) throw new Error("Provider not initialized");

    const contracts = getContracts(provider);

    try {
      // Get beneficiary address (this could be configurable)
      const accounts = await provider.listAccounts();
      const beneficiary = accounts[0]?.address || ethers.ZeroAddress;

      // Send the UserOperation through EntryPoint
      const tx = await contracts.entryPoint.handleOps([userOp], beneficiary);
      await tx.wait();

      return tx;
    } catch (err) {
      console.error("Failed to send UserOperation:", err);
      throw err;
    }
  };

  const deploySmartAccount = async () => {
    if (!provider) throw new Error("Provider not initialized");

    try {
      setIsDeploying(true);
      setError(null);

      // This is a simplified version. In a real implementation, you would:
      // 1. Deploy the smart account contract
      // 2. Initialize it with the owner's address
      // 3. Set up the EntryPoint connection
      // For now, we'll just simulate with a random address
      const mockAddress = ethers.Wallet.createRandom().address;
      setSmartAccountAddress(mockAddress);
    } catch (err) {
      setError("Failed to deploy smart account");
      console.error(err);
    } finally {
      setIsDeploying(false);
    }
  };

  const watchAd = async (adSpotAddress: string, adAddress: string) => {
    try {
      const userOp = await createUserOp("watchAd", [adSpotAddress, adAddress]);
      return await sendUserOp(userOp);
    } catch (err) {
      console.error("Failed to watch ad:", err);
      throw err;
    }
  };

  return {
    provider,
    smartAccountAddress,
    isDeploying,
    error,
    deploySmartAccount,
    watchAd,
  };
};
