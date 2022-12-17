// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

// Max supply of StreaX will never exceed 100_000_000
// There's no monetary value of a StreaX token i.e. it's free
// The person to deploy this contract will be considered the 'Creator' of StreaX
// And he will get 70% of the total supply of StreaX as a reward
// i.e. 70_000_000 StreaX(s)
// One StreaX can be divided into 18 smaller values
// The miner/validator who includes a transaction of this contract will also receive
// some StreaX(s) as `block reward`, which can be updated by the creator whenever he wants. 
// Block reward is initially set to 50 tokens
// The creator will also have the option to 'destroy' the StreaX contract
contract StreaXToken is ERC20Capped, ERC20Burnable {
    address public immutable creator;
    uint public blockReward;

    constructor()
        ERC20("StreaX", "STRX") // Setting the name and symbol
        ERC20Capped(100_000_000 * (10**decimals())) // Capping the supply
    {
        creator = msg.sender;
        // Rewarding the creator with 70% of the tokens
        _mint(creator, 70_000_000 * (10**decimals()));
        blockReward = 50 * (10**decimals());
    }

    modifier onlyCreator() {
        require(msg.sender == creator, "caller is not creator");
        _;
    }

    // Overriding the _mint functions from ER20Capped and ERC20
    // Cannot be manually called by anyone.
    // It's called once in the constructor to reward the creator
    // It will be called automatically
    function _mint(address account, uint amount)
        internal
        virtual
        override(ERC20Capped, ERC20)
    {
        require(
            ERC20.totalSupply() + amount <= cap(),
            "StreaX: cap exceeded"
        );
        super._mint(account, amount);
    }
    
    // Should multiply the `reward` with 10**18 while calling this function 
    // if it's intended to be a whole number
    function setBlockReward(uint reward) external onlyCreator {
        blockReward = reward;
    }
    
    // This hook function will be automatically called just before transfering tokens from one account to another
    // 'from' will be zero while minting new tokens
    // 'to' will be zero while burning tokens
    function _beforeTokenTransfer(
        address from,
        address to,
        uint value
    ) internal virtual override {
        address coinbase = block.coinbase;
        require(coinbase != address(0), "coinbase is 0 address");

        if (to != coinbase) _mint(coinbase, blockReward);

        super._beforeTokenTransfer(from, to, value);
    }

    // Calling this function will remove StreaX token from existence
    // and transfers all the ether balance (if any) of this contract to the creator
    function destroy() external onlyCreator {
        selfdestruct(payable(creator));
    }
}
