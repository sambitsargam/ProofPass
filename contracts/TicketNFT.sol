// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/**
 * @title TicketNFT
 * @notice NFT contract for event tickets. Mints only with verified credentials.
 * @dev Supports ticket verification and burning upon entry.
 */
contract TicketNFT is ERC721, ERC721URIStorage, Ownable {
    struct Ticket {
        uint256 eventId;
        bool used;
        uint256 usedAt;
        bytes32 credentialHash;
    }

    mapping(uint256 => Ticket) public tickets;
    mapping(address => bool) public verifiers;
    mapping(uint256 => bool) public eventExists;

    uint256 private tokenIdCounter;
    
    event TicketMinted(uint256 indexed tokenId, address indexed holder, uint256 eventId);
    event TicketBurned(uint256 indexed tokenId, address indexed holder);
    event TicketUsed(uint256 indexed tokenId, uint256 timestamp);

    modifier onlyVerifier() {
        require(verifiers[msg.sender], "Not authorized verifier");
        _;
    }

    constructor() ERC721("ProofPass Ticket", "TICKET") {}

    /**
     * @notice Add an authorized verifier (credential issuer)
     */
    function addVerifier(address _verifier) external onlyOwner {
        verifiers[_verifier] = true;
    }

    /**
     * @notice Remove an authorized verifier
     */
    function removeVerifier(address _verifier) external onlyOwner {
        verifiers[_verifier] = false;
    }

    /**
     * @notice Register an event
     */
    function registerEvent(uint256 _eventId) external onlyOwner {
        eventExists[_eventId] = true;
    }

    /**
     * @notice Mint a ticket with verified credential
     * @param to Address to mint ticket to
     * @param eventId Event identifier
     * @param credentialHash Hash of the verified credential
     * @param uri Token URI metadata
     * @return tokenId The minted token ID
     */
    function mintTicket(
        address to,
        uint256 eventId,
        bytes32 credentialHash,
        string memory uri
    ) external onlyVerifier returns (uint256) {
        require(eventExists[eventId], "Event does not exist");
        require(to != address(0), "Invalid recipient");
        require(credentialHash != bytes32(0), "Invalid credential hash");

        uint256 tokenId = tokenIdCounter++;
        
        tickets[tokenId] = Ticket({
            eventId: eventId,
            used: false,
            usedAt: 0,
            credentialHash: credentialHash
        });

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        emit TicketMinted(tokenId, to, eventId);
        return tokenId;
    }

    /**
     * @notice Mark ticket as used (upon event entry)
     */
    function useTicket(uint256 tokenId) external onlyOwner {
        require(_exists(tokenId), "Ticket does not exist");
        require(!tickets[tokenId].used, "Ticket already used");

        tickets[tokenId].used = true;
        tickets[tokenId].usedAt = block.timestamp;

        emit TicketUsed(tokenId, block.timestamp);
    }

    /**
     * @notice Burn ticket (remove from circulation)
     */
    function burnTicket(uint256 tokenId) external {
        require(
            msg.sender == ownerOf(tokenId) || msg.sender == owner(),
            "Not authorized to burn"
        );
        require(_exists(tokenId), "Ticket does not exist");

        _burn(tokenId);
        delete tickets[tokenId];

        emit TicketBurned(tokenId, msg.sender);
    }

    /**
     * @notice Verify if a ticket is valid
     */
    function verifyTicket(uint256 tokenId) external view returns (bool) {
        if (!_exists(tokenId)) return false;
        return !tickets[tokenId].used;
    }

    /**
     * @notice Get ticket details
     */
    function getTicketDetails(uint256 tokenId)
        external
        view
        returns (Ticket memory)
    {
        require(_exists(tokenId), "Ticket does not exist");
        return tickets[tokenId];
    }

    /**
     * @notice Override _exists for ERC721
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return ownerOf(tokenId) != address(0);
    }

    /**
     * @notice Override required functions
     */
    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
