// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@account-abstraction/contracts/interfaces/IPaymaster.sol";

interface ISnapAds {
    function adInteractions(
        string calldata adId,
        uint256 index
    )
        external
        view
        returns (address user, string memory adId_, uint256 timestamp);

    function adInteractionsLength(
        string calldata adId
    ) external view returns (uint256);
}

contract Paymaster is IPaymaster {
    address public snapAdsContract;

    constructor(address _snapAdsContract) {
        snapAdsContract = _snapAdsContract;
    }

    function validatePaymasterUserOp(
        UserOperation calldata userOp,
        bytes32,
        uint256
    ) external view returns (bytes memory context, uint256 validationData) {
        // Extract the paymasterAndData field
        bytes calldata paymasterAndData = userOp.paymasterAndData;

        // Decode the interactionData from paymasterAndData
        // The first 20 bytes are the paymaster address, so skip them
        bytes memory interactionData = paymasterAndData[20:];

        // Decode the interactionData (assuming it contains an address and a uint256)
        (address sender, string memory adId) = abi.decode(
            interactionData,
            (address, string)
        );

        // Check if the sender has watched the ad
        bool hasWatched = _hasUserWatchedAd(sender, adId);

        if (!hasWatched) {
            validationData = uint256(1) << 160; // Mark as invalid
        } else {
            validationData = 0; // Mark as valid
        }

        context = new bytes(0);
    }

    function _hasUserWatchedAd(
        address user,
        string memory adId
    ) internal view returns (bool) {
        ISnapAds snapAds = ISnapAds(snapAdsContract);
        uint256 interactionsLength = snapAds.adInteractionsLength(adId);

        for (uint256 i = 0; i < interactionsLength; i++) {
            (address interactionUser, , ) = snapAds.adInteractions(adId, i);
            if (interactionUser == user) {
                return true;
            }
        }
        return false;
    }

    function postOp(
        PostOpMode mode,
        bytes calldata context,
        uint256 actualGasCost
    ) external {}
}
