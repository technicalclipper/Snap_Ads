import { ethers } from "ethers";

// Contract ABIs
export const SNAP_ADS_ABI = [
  "function getAvailableAds() external view returns (tuple(address advertiser, string title, string description, string videoUrl, address adSpot, uint256 fundedAmount, uint256 totalViews)[] memory)",
  "function watchAd(address adSpot, address ad) external",
  "function registerAdSpot(string name, string description) external returns (address)",
  "function publishAd(string title, string description, string videoUrl, address adSpot) external payable",
  "event AdWatched(address indexed user, address indexed ad, address indexed adSpot, uint256 timestamp)",
  "event AdPublished(address indexed advertiser, address indexed ad, address indexed adSpot, string title, uint256 fundedAmount)",
  "event AdSpotRegistered(address indexed owner, address indexed adSpot, string name)",
];

export const PAYMASTER_ABI = [
  "function validatePaymasterUserOp(tuple(address sender, uint256 nonce, bytes initCode, bytes callData, uint256 callGasLimit, uint256 verificationGasLimit, uint256 preVerificationGas, uint256 maxFeePerGas, uint256 maxPriorityFeePerGas, bytes paymasterAndData) calldata userOp, bytes32 userOpHash, uint256 maxCost) external returns (bytes memory context, uint256 validationData)",
  "function postOp(uint8 mode, bytes calldata context, uint256 actualGasCost) external",
];

export const ENTRY_POINT_ABI = [
  "function handleOps(tuple(address sender, uint256 nonce, bytes initCode, bytes callData, uint256 callGasLimit, uint256 verificationGasLimit, uint256 preVerificationGas, uint256 maxFeePerGas, uint256 maxPriorityFeePerGas, bytes paymasterAndData)[] calldata ops, address beneficiary) external",
  "function getUserOpHash(tuple(address sender, uint256 nonce, bytes initCode, bytes callData, uint256 callGasLimit, uint256 verificationGasLimit, uint256 preVerificationGas, uint256 maxFeePerGas, uint256 maxPriorityFeePerGas, bytes paymasterAndData) calldata userOp) external view returns (bytes32)",
];

// Contract addresses (replace with actual deployed addresses)
export const CONTRACT_ADDRESSES = {
  SNAP_ADS: "0x...", // Replace with actual address
  PAYMASTER: "0x...", // Replace with actual address
  ENTRY_POINT: "0x...", // Replace with actual address
} as const;

// Contract instances
export const getContracts = (provider: ethers.Provider) => {
  const snapAds = new ethers.Contract(
    CONTRACT_ADDRESSES.SNAP_ADS,
    SNAP_ADS_ABI,
    provider
  );

  const paymaster = new ethers.Contract(
    CONTRACT_ADDRESSES.PAYMASTER,
    PAYMASTER_ABI,
    provider
  );

  const entryPoint = new ethers.Contract(
    CONTRACT_ADDRESSES.ENTRY_POINT,
    ENTRY_POINT_ABI,
    provider
  );

  return {
    snapAds,
    paymaster,
    entryPoint,
  };
};
