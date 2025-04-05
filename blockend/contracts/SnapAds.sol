// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SnapAds {
    address public owner;
    uint256 public adIdCounter;

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

    // Struct to store user interaction details
    struct Interaction {
        address user;
        uint256 adId;
        uint256 timestamp;
    }

    // Mappings to store data
    mapping(address => AdSpot) public adSpots; // contractAddress => AdSpot details
    mapping(uint256 => Ad) public ads; // adId => Ad details
    mapping(address => uint256[]) public advertiserAds; // advertiser address => list of adIds
    mapping(address => uint256) public advertiserBalances; // address -> balance
    mapping(uint256 => Interaction[]) public adInteractions; // adId => list of user interactions

    address[] public adSpotList;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // ===============================
    // Events
    // ===============================
    
    event AdWatched(
        address indexed user,
        uint256 indexed adId,
        uint256 timestamp
    );

    event AdPublished(
        uint256 indexed adId,
        address indexed advertiser,
        string name,
        string ipfsVideoLink,
        uint256 amount
    );

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

    // ================================
    // Ad Publishing (Advertisers)
    // ================================

    function publishAd(
        address adSpotContract,
        string calldata name,
        string calldata description,
        string calldata ipfsVideoCID
    ) external payable {
        require(adSpots[adSpotContract].isAvailable, "Ad spot not available");
        require(msg.value > 0, "Must send funds to publish ad");

        adIdCounter++;
        uint256 newAdId = adIdCounter;

        ads[newAdId] = Ad({
            advertiser: msg.sender,
            name: name,
            description: description,
            ipfsVideoCID: ipfsVideoCID,
            totalFunded: msg.value,
            spent: 0,
            isActive: true,
            adSpotContract: adSpotContract
        });

        advertiserAds[msg.sender].push(newAdId);
        advertiserBalances[msg.sender] += msg.value;

        emit AdPublished(newAdId, msg.sender, name, ipfsVideoCID, msg.value);
    }

    // ================================
    // Ad Interaction Tracking (Users)
    // ================================

    function watchAd(uint256 adId) external {
        require(ads[adId].isActive, "Ad not active");

        adInteractions[adId].push(
            Interaction({
                user: msg.sender,
                adId: adId,
                timestamp: block.timestamp
            })
        );

        emit AdWatched(msg.sender, adId, block.timestamp);
    }

    // ================================
    // Getters
    // ================================

    function getAvailableAds()
        external
        view
        returns (
            uint256[] memory,
            address[] memory,
            string[] memory,
            string[] memory,
            string[] memory,
            uint256[] memory
        )
    {
        uint256 count = 0;

        for (uint256 i = 1; i <= adIdCounter; i++) {
            if (ads[i].isActive) {
                count++;
            }
        }

        uint256[] memory ids = new uint256[](count);
        address[] memory advertisers = new address[](count);
        string[] memory names = new string[](count);
        string[] memory descriptions = new string[](count);
        string[] memory videoLinks = new string[](count);
        uint256[] memory funds = new uint256[](count);

        uint256 index = 0;
        for (uint256 i = 1; i <= adIdCounter; i++) {
            if (ads[i].isActive) {
                ids[index] = i;
                advertisers[index] = ads[i].advertiser;
                names[index] = ads[i].name;
                descriptions[index] = ads[i].description;
                videoLinks[index] = ads[i].ipfsVideoCID;
                funds[index] = ads[i].totalFunded;
                index++;
            }
        }

        return (ids, advertisers, names, descriptions, videoLinks, funds);
    }
}
