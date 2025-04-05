// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SnapAds {
    address public owner;
    uint256 public adIdCounter;

    struct AdSpot {
        address contractAddress;
        string spotName;
        string description;
        bool isAvailable;
    }

    struct Ad {
        address advertiser;
        string name;
        string description;
        string ipfsVideoLink;
        uint256 totalFunded;
        uint256 spent;
        bool isActive;
        address adSpotContract;
    }

    struct Interaction {
        address user;
        uint256 adId;
        uint256 timestamp;
    }

    mapping(address => AdSpot) public adSpots;
    mapping(uint256 => Ad) public ads;
    mapping(address => uint256[]) public advertiserAds;
    mapping(address => uint256) public advertiserBalances;
    mapping(uint256 => Interaction[]) public adInteractions;

    address[] public adSpotList;

    constructor() {
        owner = msg.sender;
        adIdCounter = 0;
    }

    // =========================
    // Ad Spot Registration
    // =========================

    function registerAdSpot(
        address contractAddress,
        string calldata spotName,
        string calldata description
    ) external {
        require(!adSpots[contractAddress].isAvailable, "Already registered");

        adSpots[contractAddress] = AdSpot({
            contractAddress: contractAddress,
            spotName: spotName,
            description: description,
            isAvailable: true
        });

        adSpotList.push(contractAddress);
    }

    function updateAdSpotAvailability(address contractAddress, bool availability) external {
        require(msg.sender == owner, "Only owner can update availability");
        adSpots[contractAddress].isAvailable = availability;
    }

    function isAdSpotAvailable(address contractAddress) external view returns (bool) {
        return adSpots[contractAddress].isAvailable;
    }

    function getAvailableAdSpots() external view returns (
        address[] memory,
        string[] memory,
        string[] memory
    ) {
        uint256 count = 0;
        for (uint256 i = 0; i < adSpotList.length; i++) {
            if (adSpots[adSpotList[i]].isAvailable) {
                count++;
            }
        }

        address[] memory addresses = new address[](count);
        string[] memory names = new string[](count);
        string[] memory descriptions = new string[](count);

        uint256 index = 0;
        for (uint256 i = 0; i < adSpotList.length; i++) {
            if (adSpots[adSpotList[i]].isAvailable) {
                addresses[index] = adSpots[adSpotList[i]].contractAddress;
                names[index] = adSpots[adSpotList[i]].spotName;
                descriptions[index] = adSpots[adSpotList[i]].description;
                index++;
            }
        }

        return (addresses, names, descriptions);
    }

    // =========================
    // Ad Publishing
    // =========================

    function publishAd(
        address adSpotContract,
        string calldata name,
        string calldata description,
        string calldata ipfsVideoLink
    ) external payable {
        require(adSpots[adSpotContract].isAvailable, "Ad spot not available");
        require(msg.value > 0, "Must send funds to publish ad");

        adIdCounter++;
        uint256 newAdId = adIdCounter;

        ads[newAdId] = Ad({
            advertiser: msg.sender,
            name: name,
            description: description,
            ipfsVideoLink: ipfsVideoLink,
            totalFunded: msg.value,
            spent: 0,
            isActive: true,
            adSpotContract: adSpotContract
        });

        advertiserAds[msg.sender].push(newAdId);
        advertiserBalances[msg.sender] += msg.value;

        emit AdPublished(newAdId, msg.sender, name, ipfsVideoLink, msg.value);
    }

    event AdPublished(
        uint256 indexed adId,
        address indexed advertiser,
        string name,
        string ipfsVideoLink,
        uint256 amount
    );

    // =========================
    // Ad Interaction Tracking
    // =========================

    function watchAd(uint256 adId,address watcher) external {
        require(ads[adId].isActive, "Ad not active");

         adInteractions[adId].push(
            Interaction({user: watcher, adId: adId, timestamp: block.timestamp})
        );

        emit AdWatched(msg.sender, adId, block.timestamp);
    }

    event AdWatched(address indexed user, uint256 indexed adId, uint256 timestamp);

    // =========================
    // Getters
    // =========================

    function getAvailableAds() external view returns (
        uint256[] memory, 
        address[] memory, 
        string[] memory, 
        string[] memory, 
        string[] memory, 
        uint256[] memory
    ) {
        uint256 count = 0;
        for (uint256 i = 1; i <= adIdCounter; i++) {
            if (ads[i].isActive) {
                count++;
            }
        }

        uint256[] memory ids = new uint256[](count);
        address[] memory adSpotContract = new address[](count);
        string[] memory names = new string[](count);
        string[] memory descriptions = new string[](count);
        string[] memory videoLinks = new string[](count);
        uint256[] memory funds = new uint256[](count);

        uint256 index = 0;
        for (uint256 i = 1; i <= adIdCounter; i++) {
            if (ads[i].isActive) {
                ids[index] = i;
                adSpotContract[index] = ads[i].adSpotContract;
                names[index] = ads[i].name;
                descriptions[index] = ads[i].description;
                videoLinks[index] = ads[i].ipfsVideoLink;
                funds[index] = ads[i].totalFunded;
                index++;
            }
        }

        return (ids, adSpotContract, names, descriptions, videoLinks, funds);
    }
}
