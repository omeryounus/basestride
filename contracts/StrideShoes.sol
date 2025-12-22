// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title StrideShoes
 * @dev ERC721 NFT for BaseStride move-to-earn application.
 * Shoes have rarity and levels which affect STRIDE token earnings.
 */
contract StrideShoes is ERC721, ERC721Enumerable, Ownable {
    uint256 private _nextTokenId;

    enum Rarity { Common, Uncommon, Rare, Epic, Legendary }

    struct Shoe {
        Rarity rarity;
        uint8 level;
        uint256 efficiency; // Affects token multiplier
        uint256 lastActivityTimestamp;
    }

    mapping(uint256 => Shoe) public shoes;
    
    // Multipliers (basis points, 10000 = 1x)
    mapping(Rarity => uint256) public rarityMultipliers;

    event ShoeMinted(address indexed owner, uint256 tokenId, Rarity rarity);
    event ShoeUpgraded(uint256 indexed tokenId, uint8 newLevel, uint256 newEfficiency);

    constructor() ERC721("StrideShoes", "SHOE") Ownable(msg.sender) {
        _nextTokenId = 1;
        
        // Initialize Multipliers
        rarityMultipliers[Rarity.Common] = 10000;    // 1x
        rarityMultipliers[Rarity.Uncommon] = 15000;  // 1.5x
        rarityMultipliers[Rarity.Rare] = 30000;      // 3x
        rarityMultipliers[Rarity.Epic] = 60000;      // 6x
        rarityMultipliers[Rarity.Legendary] = 120000; // 12x
    }

    /**
     * @dev Admin/Marketplace minting function
     */
    function mint(address to, Rarity rarity) external onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);

        shoes[tokenId] = Shoe({
            rarity: rarity,
            level: 1,
            efficiency: 100, // Base efficiency
            lastActivityTimestamp: block.timestamp
        });

        emit ShoeMinted(to, tokenId, rarity);
        return tokenId;
    }

    /**
     * @dev Upgrade shoe level (can be called by a Marketplace or Controller contract)
     */
    function upgrade(uint256 tokenId, uint256 efficiencyIncrease) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Shoe does not exist");
        
        shoes[tokenId].level += 1;
        shoes[tokenId].efficiency += efficiencyIncrease;

        emit ShoeUpgraded(tokenId, shoes[tokenId].level, shoes[tokenId].efficiency);
    }

    function getShoeDetails(uint256 tokenId) external view returns (
        Rarity rarity,
        uint8 level,
        uint256 efficiency,
        uint256 multiplier
    ) {
        Shoe storage shoe = shoes[tokenId];
        return (
            shoe.rarity,
            shoe.level,
            shoe.efficiency,
            rarityMultipliers[shoe.rarity]
        );
    }

    // Required overrides for ERC721Enumerable
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
