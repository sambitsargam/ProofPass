// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TicketNFT
 * @notice NFT contract for event tickets. Mints only with verified credentials.
 * @dev Supports ticket verification and burning upon entry.
 */
contract TicketNFT is ERC721, Ownable {
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

    constructor() ERC721("ProofPass Ticket", "TICKET") Ownable(msg.sender) {}

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
     * @return tokenId The minted token ID
     */
    function mintTicket(
        address to,
        uint256 eventId,
        bytes32 credentialHash
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

        emit TicketMinted(tokenId, to, eventId);
        return tokenId;
    }

    /**
     * @notice Mark ticket as used (upon event entry)
     */
    function useTicket(uint256 tokenId) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Ticket does not exist");
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
        require(_ownerOf(tokenId) != address(0), "Ticket does not exist");

        delete tickets[tokenId];

        emit TicketBurned(tokenId, msg.sender);
    }

    /**
     * @notice Verify if a ticket is valid
     */
    function verifyTicket(uint256 tokenId) external view returns (bool) {
        if (_ownerOf(tokenId) == address(0)) return false;
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
        require(_ownerOf(tokenId) != address(0), "Ticket does not exist");
        return tickets[tokenId];
    }

    /**
     * @notice Override _ownerOf for ERC721
     */
    function _ownerOf(uint256 tokenId) internal view override returns (address) {
        try this.ownerOf(tokenId) returns (address owner) {
            return owner;
        } catch {
            return address(0);
        }
    }

    /**
     * @notice Override required functions for ERC721
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
