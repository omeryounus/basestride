// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title StrideToken
 * @dev ERC20 token for the BaseStride move-to-earn ecosystem.
 */
contract StrideToken is ERC20, Ownable {
    constructor() ERC20("Stride Token", "STRIDE") Ownable(msg.sender) {
        // Initial supply for liquidity and initial ecosystem needs
        _mint(msg.sender, 1_000_000_000 * 10**18); // 1 billion tokens
    }

    /**
     * @dev Function to mint new tokens. Only callable by owner (e.g., the Distributor contract).
     * @param to The address that will receive the minted tokens.
     * @param amount The amount of tokens to mint.
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
