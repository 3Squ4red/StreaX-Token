import React, { useEffect, useState } from "react";
import "./App.scss";
import { BigNumber, ethers, FixedNumber } from "ethers";
import streaxToken from "./streaxToken";
import streaxFaucetContract from "./streaxFaucet";
import { RandomReveal } from "react-random-reveal";

function App() {
  // const [signer, setSigner] = useState();
  const [streaxContract, setStreaxContract] = useState();
  const [streaxFaucet, setStreaxFaucet] = useState();
  const [totalSupply, setTotalSupply] = useState("00000000");
  const [cappedAt, setCap] = useState("000000000");
  const [blockReward, setBlockReward] = useState("00");
  const [creator, setCreator] = useState("0x00000000000");
  const [userAddress, setUserAddress] = useState("");
  const [userBalance, setUserBalance] = useState("0");
  const [addressInput, setAddressInput] = useState("");
  const [amountInput, setAmountInput] = useState("");

  useEffect(() => {
    initWallet();
  }, [userAddress]);

  const toWei = (eth) => ethers.utils.parseEther(eth);
  const toEth = (wei) => ethers.utils.formatEther(wei);
  const initWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        // setting the on change listener
        window.ethereum.on("accountsChanged", (accounts) => {
          setUserAddress(accounts[0]);
        });
        // Get provider, signer and the contract
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // requesting a connection to MetaMask
        const accounts = await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contract = streaxToken(signer);
        const faucet = streaxFaucetContract(signer);
        console.log("user address:", accounts[0]);

        // Getting and Setting token info
        const totalSupply = await contract.totalSupply();
        const cappedAt = await contract.cap();
        const blockReward = await contract.blockReward();
        let creator = await contract.creator();
        creator = `0x${creator[2]}${creator[3]}${creator[4]}....${creator.slice(
          -4
        )}`;

        // setTotalSupply(Number(toEth(totalSupply)).toLocaleString());
        setTotalSupply(toEth(totalSupply));
        setCap(toEth(cappedAt));
        setBlockReward(toEth(blockReward));
        setCreator(creator);

        setStreaxContract(contract);
        setUserAddress(accounts[0]);
        setStreaxFaucet(faucet);
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      alert("Please install MetaMask");
    }
  };

  const addStrx = async () => {
    if (streaxContract) {
      const tokenAddress = "0x346461C71eaEf9cAfEAfF461aFDD61055AED4d3d";
      const tokenSymbol = "STRX";
      const tokenDecimals = 18;
      const tokenImage =
        "https://img.freepik.com/free-vector/vector-graphic-design-element-x-letter_460848-6935.jpg?w=900&t=st=1671294885~exp=1671295485~hmac=a20db9ea93fe23597b94bdeadbdceabbc058d6524ab410a7c7a7199c35852658";

      try {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        const wasAdded = await window.ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20", // Initially only supports ERC20, but eventually more!
            options: {
              address: tokenAddress, // The address that the token is at.
              symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
              decimals: tokenDecimals, // The number of decimals in the token
              image: tokenImage, // A string url of the token logo
            },
          },
        });

        if (wasAdded) {
          alert("Thanks for adding STRX!");
        } else {
          alert("Something went wrong");
        }
      } catch (err) {
        console.error(err.message);
        alert(err.message);
      }
    } else {
      alert("Please connect to MetaMask");
    }
  };

  const getStrx = async () => {
    if (streaxFaucet && userAddress) {
      try {
        const tx = await streaxFaucet.sendTokens(
          "0xD1B9C015FBA1D7B631791A2201411a378fd562e7", // creator
          userAddress,
          "20000000000000000000"
        );
        alert("Now please wait for the tx to complete");
        await tx.wait();
        alert("Tx successful! Check your balance now");
      } catch (err) {
        console.error(err.message);
        alert(err.message);
      }
    } else {
      alert("Please connect to MetaMask wallet");
    }
  };

  const checkBalance = async () => {
    if (streaxContract) {
      try {
        const balance = await streaxContract.balanceOf(userAddress);

        setUserBalance(toEth(balance));
      } catch (err) {
        alert(err.message);
        console.error(err.message);
      }
    } else {
      /* MetaMask is not connected */
      alert("Please connect to MetaMask");
    }
  };

  const sendStrx = async () => {
    if (streaxContract) {
      try {
        const tx = await streaxContract.transfer(addressInput, amountInput);
        alert("Now please wait for the tx to complete");
        await tx.wait();
        alert("Tx successful!");
      } catch (err) {
        console.error(err.message);
        alert(err.message);
      }
    } else {
      alert("Please connect to MetaMask first");
    }
  };

  const randNums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  return (
    <div className="App">
      <div className="front">
        {/* header */}
        <div className="header">
          <h1>Introducing StreaX (STRX)</h1>
        </div>
        <div className="tokenInfo">
          <div className="row1">
            {/* current supply */}
            <div
              className="totalSupply"
              title="Total number of tokens currently in circulation"
            >
              <h1 className="totalSupply_heading">Current Supply</h1>
              <h1 className="totalSupply_text">
                <RandomReveal
                  isPlaying
                  duration={4}
                  // revealDuration={1.6}
                  characters={totalSupply}
                  characterSet={randNums}
                  ignoreCharacterSet={["."]}
                  revealEasing="easeInQuad"
                />
              </h1>
            </div>
            {/* capped at */}
            <div
              className="cappedAt"
              title="Total no. of tokens in circulation will never exceed this limit"
            >
              <h1 className="cappedAt_heading">Capped At</h1>
              <h1 className="cappedAt_text">
                <RandomReveal
                  isPlaying
                  duration={5}
                  // revealDuration={1.6}
                  characters={cappedAt}
                  characterSet={randNums}
                  ignoreCharacterSet={["."]}
                  revealEasing="easeInQuad"
                />
              </h1>
            </div>
          </div>
          <br></br>
          <div className="row2">
            {/* block reward */}
            <div
              className="blockreward"
              title="Number of tokens given to the miner/validator for including a transaction of STRX in their block"
            >
              <h1 className="blockreward_heading">Block Reward</h1>
              <h1 className="blockreward_text">
                <RandomReveal
                  isPlaying
                  duration={6}
                  // revealDuration={1.6}
                  characters={blockReward}
                  characterSet={randNums}
                  ignoreCharacterSet={["."]}
                  revealEasing="easeInQuad"
                />
              </h1>
            </div>

            {/* creator */}
            <div
              className="creator"
              title="The address which deployed the STRX smart contract"
            >
              <h1 className="creator_heading">Creator</h1>
              <h1 className="creator_text">
                <RandomReveal
                  isPlaying
                  duration={6}
                  // revealDuration={1.6}
                  characters={creator}
                  characterSet={randNums}
                  revealEasing="easeInQuad"
                />
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="back">
        {/* add and get tokens */}
        <div className="addGet">
          <button title="Add STRX token to your wallet" onClick={addStrx}>
            Add STRX
          </button>
          <button title="Get 20 STRX tokens for free" onClick={getStrx}>
            Get STRX
          </button>
        </div>
        {/* get balance and transfer tokens */}
        <div className="balanceTransfer">
          {/* get balance */}
          <div className="balance">
            <div className="common_header">
              <button
                onClick={checkBalance}
                title="Check out your STRX token balance"
              >
                Check
              </button>
              <span>your balance</span>
            </div>
            <h1>{userBalance}</h1>
          </div>
          {/* transfer */}
          <div className="transfer">
            <div className="common_header">
              <button
                title="Send STRX tokens to anyone you want!"
                onClick={sendStrx}
              >
                Send
              </button>
              <span>tokens</span>
            </div>
            <div className="transfer_input">
              <input
                onChange={(e) => {
                  setAddressInput(e.target.value);
                }}
                className="transfer_input_to"
                placeholder="to"
                value={addressInput}
              />
              <input
                onChange={(e) => {
                  setAmountInput(e.target.value);
                }}
                className="transfer_input_amount"
                placeholder="amount"
                value={amountInput}
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
