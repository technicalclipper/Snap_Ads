// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SnapAds {
    address public owner;

    // Struct for ad details
    struct Ad {
        address advertiser;
        string name;
        string description;
        string ipfsVideoCID;
        uint256 totalFunded;
        uint256 spent;
        bool isActive;
        address adSpotContract;
    }
    struct AdSpot {
        address contractAddress;
        string spotName;
        bool isAvailable;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    mapping(address => AdSpot) public adSpots; // contractAddress => AdSpot details
    address[] public adSpotList;

    // ===============================
    // Ad Spot Registration (Contract Owners)
    // ===============================

    function registerAdSpot(
        address contractAddress,
        string calldata spotName
    ) external onlyOwner {
        require(!adSpots[contractAddress].isAvailable, "Already registered");

        adSpots[contractAddress] = AdSpot({
            contractAddress: contractAddress,
            spotName: spotName,
            isAvailable: true
        });

        adSpotList.push(contractAddress);
    }

    function updateAdSpotAvailability(
        address contractAddress,
        bool availability
    ) external onlyOwner {
        adSpots[contractAddress].isAvailable = availability;
    }

    function isAdSpotAvailable(
        address contractAddress
    ) external view returns (bool) {
        return adSpots[contractAddress].isAvailable;
    }

    function getAvailableAdSpots()
        external
        view
        returns (address[] memory, string[] memory)
    {
        uint256 count = 0;

        for (uint256 i = 0; i < adSpotList.length; i++) {
            if (adSpots[adSpotList[i]].isAvailable) {
                count++;
            }
        }

        address[] memory addresses = new address[](count);
        string[] memory names = new string[](count);

        uint256 index = 0;
        for (uint256 i = 0; i < adSpotList.length; i++) {
            if (adSpots[adSpotList[i]].isAvailable) {
                addresses[index] = adSpots[adSpotList[i]].contractAddress;
                names[index] = adSpots[adSpotList[i]].spotName;
                index++;
            }
        }

        return (addresses, names);
    }
}
