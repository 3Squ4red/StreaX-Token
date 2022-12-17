# StreaX (STRX)
Minimalistic and sleek website for an ERC-20 token on Goerli testnet

## Tokenomics 💵
- Max supply of StreaX will never exceed 100,000,000
- There's no monetary value of a StreaX token i.e. it's free
- The person to deploy this contract will be considered the `creator` of StreaX And he will also get 70% of the total supply of StreaX as a reward i.e. 70,000,000 StreaX(s)
- One StreaX can be divided into 18 smaller values
- The miner/validator who includes a transaction of this contract will also receive some StreaX(s) as *block reward*, which can be updated by the creator whenever he wants. The `blockReward` is initially set to 50 tokens
- The creator will also have the option to 'destroy' the StreaX contract
  - Doing this will remove all the STRX tokens from existence
  
## How to run 💨 and test 🧪
1. Clone the repo
```
git clone https://github.com/bytecode-velocity/StreaX-Token.git
```
2. Change directory
```
cd StreaX-Token
```
3. Install the packages
```
npm i
```
4. Start the server
```
npm start
```

Now, if you want to test the smart contract, follow the below steps
1. Change directory
```
cd streax-token
```
2. Install the packages
```
npm i
```
3. Run the test
```
npx hardhat test
```

## Demo 🚀
- **StreaXToken** contract: [StreaXToken](https://goerli.etherscan.io/token/0x346461C71eaEf9cAfEAfF461aFDD61055AED4d3d)
- **StreaXFaucet** contract: [StreaXFaucet](https://goerli.etherscan.io/address/0x4E292289F8b76B731c9C92B6234fEf684C215f7D)
- IPFS website link: [click here](https://calm-forest-3278.on.fleek.co/) or [here](https://ipfs.fleek.co/ipfs/QmcyqG7zsZo16qWwAsjVxTKcZURzqNtLsCJ7WtamnU9c41)

