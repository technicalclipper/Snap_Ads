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

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    mapping(address => AdSpot) public adSpots; // contractAddress => AdSpot details
    mapping(uint256 => Ad) public ads; // adId => Ad details

    mapping(address => uint256[]) public advertiserAds; // advertiser address => list of adIds
    mapping(address => uint256) public advertiserBalances; // address -> balance

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

    event AdPublished(
        uint256 indexed adId,
        address indexed advertiser,
        string name,
        string ipfsVideoLink,
        uint256 amount
    );
}
