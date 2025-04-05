import { BaseContract, BigNumberish } from "ethers";

export interface SnapAdsContract extends BaseContract {
  registerAdSpot(
    contractAddress: string,
    spotName: string,
    description: string
  ): Promise<any>;
  getAvailableAdSpots(): Promise<[string[], string[], string[]]>;
  publishAd(
    adSpotContract: string,
    name: string,
    description: string,
    ipfsVideoCID: string,
    overrides?: { value: BigNumberish }
  ): Promise<any>;
  watchAd(adId: string, watcher: string): Promise<any>;
  getAvailableAds(): Promise<
    [string[], string[], string[], string[], string[], BigNumberish[]]
  >;
  adInteractionsLength(adId: string): Promise<BigNumberish>;
  getAdDetails(adId: string): Promise<[string, string, string, string, BigNumberish, BigNumberish, boolean]>;
}
