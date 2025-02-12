/* eslint-disable no-unused-vars */
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { abi } from "../../../NunoToken.abi";

const contract_address = "0x83595a293426Cc9c49F8C13aFaa55e166433fbCB";

const WalletComponent = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [contract, setContract] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("0");
  const [totalSupply, setTotalSupply] = useState("0");
  const [balance, setBalance] = useState("");
  const [error, setError] = useState("");
  const [amount, setAmount] = useState("");
  const [receiver, setReceiver] = useState("");

  console.log("Wallet Add", String(walletAddress));

  // console.log("balance", balance);

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          if (accounts.length > 0) {
            await connectWallet();
          }
        } catch (error) {
          setError(error);
        }
      }
    };
    checkConnection();
  }, []);

  const connectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("account", accounts);

      const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
      console.log("ether Pr", ethersProvider);

      const ethersSigner = ethersProvider.getSigner();
      console.log("ether Signer", ethersSigner);
      const tokenContract = new ethers.Contract(
        contract_address,
        abi,
        ethersSigner
      );
      console.log("Contract", await tokenContract.getBalance(accounts[0]));

      setProvider(ethersProvider);
      setSigner(ethersSigner);
      setContract(tokenContract);
      setWalletAddress(accounts[0]);
      setIsConnected(true);

      // Fetch the details of the token
      const name = await tokenContract.getName();
      console.log("Name", name);
      const symbol = await tokenContract.getSymbol();
      console.log("Symbol", symbol);
      const supply = await tokenContract.getTotalSupply();
      console.log("supply", supply);
      const userBalance = await tokenContract.getBalance(accounts[0]);
      console.log("user Balance", userBalance);

      setTokenName(name);
      setTokenSymbol(symbol);
      setTotalSupply(ethers.utils.formatUnits(supply, 18));
      console.log("Supply in number", ethers.utils.formatUnits(supply, 18));
      setBalance(ethers.utils.formatUnits(userBalance, 18));
      console.log(ethers.utils.formatUnits(userBalance, 18));
    } catch (error) {
      setError(error);
    }
  };

  const disconnect = () => {
    setProvider(null);
    setSigner(null);
    setContract(null);
    setWalletAddress("");
    setIsConnected(false);
  };

  const handleTransfer = async () => {
    try {
      if (!contract) return;
      const amountToSend = ethers.utils.parseUnits(amount, 18);
      console.log("amount to sender", amountToSend);
      setAmount(amountToSend);
      const transferData = await contract.transfer(receiver, amountToSend);
      console.log("Transfer", transferData);
      await contract.wait();

      const updatedBalance = await contract.getBalance(walletAddress);
      setBalance(ethers.utils.formatUnits(updatedBalance, 18));
    } catch (error) {
      console.log("error transfer", error);
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold">{tokenName} Token Dashboard</h2>
        <div className="flex items-center gap-4">
          {isConnected ? (
            <>
              <span className="text-sm">{walletAddress}</span>
              <button onClick={disconnect}>Disconnect</button>
            </>
          ) : (
            <button onClick={connectWallet}>
              {isConnected
                ? "Connecting .."
                : isConnected
                ? "Disconnect"
                : "Connect wallet"}
            </button>
          )}
        </div>
      </div>
      {!isConnected ? (
        <>
          <div className="flex flex-col justify-between">
            <button onClick={disconnect}>Disconnect</button>
            <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
            <p className="">
              Please Connect to interact with the Token smart Contract
            </p>
          </div>
        </>
      ) : (
        <div className="flex flex-col space-y-6">
          <h1>Token Information</h1>
          <div className="flex justify-between items-center">
            <p>Your Balance</p>
            <p>
              {parseFloat(balance).toFixed(3)} {tokenSymbol}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p>Total Supply</p>
            <p>
              {parseFloat(totalSupply).toFixed(3)} {tokenSymbol}
            </p>
          </div>
          <div>
            <input
              type="text"
              name="receiver"
              // value={receiver}
              onChange={() => setReceiver(receiver)}
              className="border border-amber-100 p-2 mr-4"
            />
            <input
              type="text"
              name="amount"
              // value={receiver}
              onChange={() => setAmount(amount)}
              className="border border-amber-100 p-2 mr-4"
            />

            <button onClick={handleTransfer} className="bg-black text-white">
              Transfer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletComponent;
