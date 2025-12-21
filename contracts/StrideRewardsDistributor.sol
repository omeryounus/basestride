// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title StrideRewardsDistributor
 * @dev Distributes STRIDE tokens based on Merkle proofs of activity data.
 */
contract StrideRewardsDistributor is Ownable, ReentrancyGuard {
    IERC20 public strideToken;
    
    // Epoch => Merkle Root
    // Each root represents the total cumulative tokens a user has earned/is eligible to claim for that epoch.
    mapping(uint256 => bytes32) public merkleRoots;
    
    // User => Epoch => Claimed
    mapping(address => mapping(uint256 => bool)) public hasClaimed;
    
    event MerkleRootSet(uint256 indexed epoch, bytes32 root);
    event RewardsClaimed(address indexed user, uint256 indexed epoch, uint256 amount);

    constructor(address _strideToken) Ownable(msg.sender) {
        strideToken = IERC20(_strideToken);
    }

    /**
     * @dev Set the Merkle Root for a specific epoch (e.g., weekly).
     * @param epoch The epoch number.
     * @param root The Merkle root of (userAddress, amount) pairs.
     */
    function setMerkleRoot(uint256 epoch, bytes32 root) external onlyOwner {
        merkleRoots[epoch] = root;
        emit MerkleRootSet(epoch, root);
    }

    /**
     * @dev Claim rewards for a specific epoch.
     * @param epoch The epoch number.
     * @param amount The amount of tokens the user is claiming.
     * @param proof The Merkle proof for the user's eligibility.
     */
    function claimRewards(
        uint256 epoch,
        uint256 amount,
        bytes32[] calldata proof
    ) external nonReentrant {
        require(!hasClaimed[msg.sender][epoch], "Already claimed for this epoch");
        require(merkleRoots[epoch] != bytes32(0), "Merkle root not set");

        // Compute leaf node
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, amount));
        
        // Verify the Merkle proof
        require(MerkleProof.verify(proof, merkleRoots[epoch], leaf), "Invalid Merkle proof");

        hasClaimed[msg.sender][epoch] = true;

        // Transfer tokens to the user
        require(strideToken.transfer(msg.sender, amount), "Token transfer failed");

        emit RewardsClaimed(msg.sender, epoch, amount);
    }

    /**
     * @dev Withdraw tokens from the contract (emergency/liquidity management).
     */
    function withdraw(uint256 amount) external onlyOwner {
        require(strideToken.transfer(msg.sender, amount), "Withdrawal failed");
    }
}
