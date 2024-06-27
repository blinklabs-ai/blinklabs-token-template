// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";

contract MyNFT is ERC721URIStorage, IERC2981, Ownable(msg.sender) {
    // Base URI
    string private _baseTokenURI;

    // Royalties
    struct RoyaltyInfo {
        address recipient;
        uint256 percentage;
    }
    RoyaltyInfo private _royalties;
    event Minted(uint256 tokenId, address to);
    event RoyaltySet(address recipient, uint256 percentage);
    event BaseURIChanged(string newBaseURI);

    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {}

    /**
     * @dev Mints a token to an address with a tokenURI.
     * @param to the address of the future owner of the token.
     * @param tokenId the token id to mint.
     * @param tokenURI the token URI of the minted token.
     */
    function mint(address to, uint256 tokenId, string memory tokenURI) public onlyOwner {
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        emit Minted(tokenId, to);
    }

    /**
     * @dev Sets the royalties information.
     * @param recipient the recipient of the royalties.
     * @param percentage the percentage (using two decimals e.g., 100 = 1%).
     */
    function setRoyalties(address recipient, uint256 percentage) public onlyOwner {
        require(percentage <= 10000, "Percentage too high");
        _royalties = RoyaltyInfo(recipient, percentage);
        emit RoyaltySet(recipient, percentage);
    }

    /**
     * @dev Sets the base URI for computing {tokenURI}. 
     * @param baseURI the base URI to set.
     */
    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
        emit BaseURIChanged(baseURI);
    }

    /**
     * @dev Returns the royalties information for a given token.
     * @param tokenId the token id querying the royalty of.
     * @param salePrice the sale price to calculate the royalty fee.
     */
    function royaltyInfo(uint256 tokenId, uint256 salePrice) external view override returns (address, uint256) {
        uint256 royaltyAmount = (salePrice * _royalties.percentage) / 10000;
        return (_royalties.recipient, royaltyAmount);
    }

    /**
     * @dev Override the base URI used by ERC721URIStorage.
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    // Ensures only EOA or specified contracts can call functions marked by this modifier.
    modifier onlyEOA() {
        require(msg.sender == tx.origin, "Caller must be an EOA");
        _;
    }
}