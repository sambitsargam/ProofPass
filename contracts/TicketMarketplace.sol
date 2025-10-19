// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./TicketNFT.sol";

/**
 * @title TicketMarketplace
 * @notice Marketplace for buying and selling tickets with credential verification
 */
contract TicketMarketplace {
    struct Event {
        uint256 id;
        address organizer;
        uint256 totalTickets;
        uint256 soldTickets;
        uint256 pricePerTicket;
        bool active;
        uint256 createdAt;
    }

    struct Listing {
        uint256 tokenId;
        address seller;
        uint256 price;
        bool active;
    }

    TicketNFT public ticketNFT;
    mapping(uint256 => Event) public events;
    mapping(uint256 => Listing) public listings;
    
    address public owner;
    uint256 public platformFeePercentage = 2;

    uint256 private eventIdCounter = 1;

    event EventCreated(uint256 indexed eventId, address organizer, uint256 ticketCount);
    event TicketPurchased(uint256 indexed eventId, address buyer, uint256 quantity);
    event ListingCreated(uint256 indexed tokenId, address seller, uint256 price);
    event TicketSold(uint256 indexed tokenId, address from, address to, uint256 price);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier eventExists(uint256 _eventId) {
        require(events[_eventId].active, "Event does not exist");
        _;
    }

    constructor(address _ticketNFT) {
        ticketNFT = TicketNFT(_ticketNFT);
        owner = msg.sender;
    }

    /**
     * @notice Create a new event
     */
    function createEvent(
        uint256 _totalTickets,
        uint256 _pricePerTicket
    ) external returns (uint256) {
        uint256 eventId = eventIdCounter++;
        
        events[eventId] = Event({
            id: eventId,
            organizer: msg.sender,
            totalTickets: _totalTickets,
            soldTickets: 0,
            pricePerTicket: _pricePerTicket,
            active: true,
            createdAt: block.timestamp
        });

        ticketNFT.registerEvent(eventId);
        emit EventCreated(eventId, msg.sender, _totalTickets);

        return eventId;
    }

    /**
     * @notice Purchase tickets with credential verification
     * Requires credential hash as proof
     */
    function purchaseTickets(
        uint256 _eventId,
        uint256 _quantity,
        bytes32 _credentialHash,
        string[] calldata _uris
    ) external payable eventExists(_eventId) returns (uint256[] memory) {
        Event storage evt = events[_eventId];
        
        require(
            evt.soldTickets + _quantity <= evt.totalTickets,
            "Not enough tickets available"
        );
        require(
            msg.value >= evt.pricePerTicket * _quantity,
            "Insufficient payment"
        );
        require(_quantity == _uris.length, "URI count mismatch");

        uint256[] memory tokenIds = new uint256[](_quantity);

        for (uint256 i = 0; i < _quantity; i++) {
            uint256 tokenId = ticketNFT.mintTicket(
                msg.sender,
                _eventId,
                _credentialHash,
                _uris[i]
            );
            tokenIds[i] = tokenId;
        }

        evt.soldTickets += _quantity;

        // Send funds to organizer (minus platform fee)
        uint256 platformFee = (msg.value * platformFeePercentage) / 100;
        uint256 organizerAmount = msg.value - platformFee;
        
        (bool success, ) = evt.organizer.call{value: organizerAmount}("");
        require(success, "Payment to organizer failed");

        emit TicketPurchased(_eventId, msg.sender, _quantity);
        return tokenIds;
    }

    /**
     * @notice List ticket for resale
     */
    function listTicket(uint256 _tokenId, uint256 _price) external {
        require(ticketNFT.ownerOf(_tokenId) == msg.sender, "Not ticket owner");
        require(_price > 0, "Invalid price");

        listings[_tokenId] = Listing({
            tokenId: _tokenId,
            seller: msg.sender,
            price: _price,
            active: true
        });

        emit ListingCreated(_tokenId, msg.sender, _price);
    }

    /**
     * @notice Buy listed ticket from secondary market
     */
    function buyListedTicket(uint256 _tokenId) external payable {
        Listing storage listing = listings[_tokenId];
        require(listing.active, "Listing not active");
        require(msg.value >= listing.price, "Insufficient payment");

        address seller = listing.seller;
        listing.active = false;

        // Transfer ticket to buyer
        ticketNFT.safeTransferFrom(seller, msg.sender, _tokenId);

        // Pay seller (minus platform fee)
        uint256 platformFee = (msg.value * platformFeePercentage) / 100;
        uint256 sellerAmount = msg.value - platformFee;

        (bool success, ) = seller.call{value: sellerAmount}("");
        require(success, "Payment to seller failed");

        emit TicketSold(_tokenId, seller, msg.sender, listing.price);
    }

    /**
     * @notice Get event details
     */
    function getEventDetails(uint256 _eventId)
        external
        view
        returns (Event memory)
    {
        require(events[_eventId].active, "Event does not exist");
        return events[_eventId];
    }

    /**
     * @notice Get available tickets count
     */
    function getAvailableTickets(uint256 _eventId)
        external
        view
        eventExists(_eventId)
        returns (uint256)
    {
        Event storage evt = events[_eventId];
        return evt.totalTickets - evt.soldTickets;
    }

    /**
     * @notice Set platform fee (owner only)
     */
    function setPlatformFee(uint256 _percentage) external onlyOwner {
        require(_percentage <= 5, "Fee too high");
        platformFeePercentage = _percentage;
    }

    /**
     * @notice Withdraw platform fees
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    receive() external payable {}
}
