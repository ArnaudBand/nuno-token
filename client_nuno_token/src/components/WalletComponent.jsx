/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import {abi} from "../../../NunoToken.abi"

const contract_address = "0x83595a293426Cc9c49F8C13aFaa55e166433fbCB";

const WalletComponent = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  
  // Token info states
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [totalSupply, setTotalSupply] = useState("0");
  const [balance, setBalance] = useState("0");
  
  // Transaction states
  const [transferAmount, setTransferAmount] = useState("");
  const [transferReceiver, setTransferReceiver] = useState("");
  const [approveAmount, setApproveAmount] = useState("");
  const [approveSpender, setApproveSpender] = useState("");
  const [transferFromAmount, setTransferFromAmount] = useState("");
  const [transferFromSender, setTransferFromSender] = useState("");
  const [transferFromReceiver, setTransferFromReceiver] = useState("");
  const [burnAmount, setBurnAmount] = useState("");
  
  // Airdrop states
  const [recipients, setRecipients] = useState("");
  const [airdropAmounts, setAirdropAmounts] = useState("");
  
  // Status states
  const [error, setError] = useState("");
  const [txStatus, setTxStatus] = useState("");

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
          setError(error.message);
        }
      }
    };

    checkConnection();
  }, []);

  const connectWallet = useCallback(async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      
      const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
      const ethersSigner = ethersProvider.getSigner();
      const tokenContract = new ethers.Contract(
        contract_address,
        abi,
        ethersSigner
      );

      setProvider(ethersProvider);
      setSigner(ethersSigner);
      setContract(tokenContract);
      setWalletAddress(accounts[0]);
      setIsConnected(true);

      await updateTokenInfo(tokenContract, accounts[0]);
    } catch (error) {
      setError(error.message);
    }
  }, []);

  const updateTokenInfo = async (tokenContract, address) => {
    const name = await tokenContract.getName();
    const symbol = await tokenContract.getSymbol();
    const supply = await tokenContract.getTotalSupply();
    const userBalance = await tokenContract.getBalance(address);

    setTokenName(name);
    setTokenSymbol(symbol);
    setTotalSupply(ethers.utils.formatUnits(supply, 18));
    setBalance(ethers.utils.formatUnits(userBalance, 18));
  };

  const disconnect = () => {
    setProvider(null);
    setSigner(null);
    setContract(null);
    setWalletAddress("");
    setIsConnected(false);
    resetStates();
  };

  const resetStates = () => {
    setTransferAmount("");
    setTransferReceiver("");
    setApproveAmount("");
    setApproveSpender("");
    setTransferFromAmount("");
    setTransferFromSender("");
    setTransferFromReceiver("");
    setBurnAmount("");
    setRecipients("");
    setAirdropAmounts("");
    setTxStatus("");
    setError("");
  };

  const handleTransfer = async () => {
    try {
      setTxStatus("Processing transfer...");
      const amountToSend = ethers.utils.parseUnits(transferAmount, 18);
      const tx = await contract.transfer(transferReceiver, amountToSend);
      await tx.wait();
      await updateTokenInfo(contract, walletAddress);
      setTxStatus("Transfer successful!");
      setTransferAmount("");
      setTransferReceiver("");
    } catch (error) {
      setError(error.message);
      setTxStatus("");
    }
  };

  const handleApprove = async () => {
    try {
      setTxStatus("Processing approval...");
      const amountToApprove = ethers.utils.parseUnits(approveAmount, 18);
      const tx = await contract.approve(approveSpender, amountToApprove);
      await tx.wait();
      setTxStatus("Approval successful!");
      setApproveAmount("");
      setApproveSpender("");
    } catch (error) {
      setError(error.message);
      setTxStatus("");
    }
  };

  const handleTransferFrom = async () => {
    try {
      setTxStatus("Processing transfer from...");
      const amountToSend = ethers.utils.parseUnits(transferFromAmount, 18);
      const tx = await contract.transferFrom(
        transferFromSender,
        transferFromReceiver,
        amountToSend
      );
      await tx.wait();
      await updateTokenInfo(contract, walletAddress);
      setTxStatus("Transfer from successful!");
      setTransferFromAmount("");
      setTransferFromSender("");
      setTransferFromReceiver("");
    } catch (error) {
      setError(error.message);
      setTxStatus("");
    }
  };

  const handleAirdrop = async () => {
    try {
      setTxStatus("Processing airdrop...");
      const recipientList = recipients.split(',').map(addr => addr.trim());
      const amountList = airdropAmounts.split(',').map(amount => 
        ethers.utils.parseUnits(amount.trim(), 18)
      );
      
      const tx = await contract.airdrop(recipientList, amountList);
      await tx.wait();
      await updateTokenInfo(contract, walletAddress);
      setTxStatus("Airdrop successful!");
      setRecipients("");
      setAirdropAmounts("");
    } catch (error) {
      setError(error.message);
      setTxStatus("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="border border-black/10 rounded-lg shadow-sm p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{tokenName || "NunoToken"} Dashboard</h1>
          <div className="flex items-center gap-4">
            {isConnected ? (
              <>
                <span className="text-sm text-gray-600 truncate w-40">{walletAddress}</span>
                <button
                  onClick={disconnect}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={connectWallet}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
  
        {/* Main Content */}
        {isConnected ? (
          <div className="space-y-6">
            {/* Token Info Section */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-700">Your Balance</h3>
                <p className="text-lg font-semibold text-gray-900">
                  {parseFloat(balance).toFixed(3)} {tokenSymbol}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-700">Total Supply</h3>
                <p className="text-lg font-semibold text-gray-900">
                  {parseFloat(totalSupply).toFixed(3)} {tokenSymbol}
                </p>
              </div>
            </div>
  
            {/* Transfer Section */}
            <div className="space-y-2">
              <h3 className="font-medium text-gray-700">Transfer Tokens</h3>
              <div className="flex gap-2">
                <input
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Recipient address"
                  value={transferReceiver}
                  onChange={(e) => setTransferReceiver(e.target.value)}
                />
                <input
                  className="w-32 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Amount"
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                />
                <button
                  onClick={handleTransfer}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Transfer
                </button>
              </div>
            </div>
  
            {/* Approve Section */}
            <div className="space-y-2">
              <h3 className="font-medium text-gray-700">Approve Spender</h3>
              <div className="flex gap-2">
                <input
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Spender address"
                  value={approveSpender}
                  onChange={(e) => setApproveSpender(e.target.value)}
                />
                <input
                  className="w-32 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Amount"
                  type="number"
                  value={approveAmount}
                  onChange={(e) => setApproveAmount(e.target.value)}
                />
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Approve
                </button>
              </div>
            </div>
  
            {/* TransferFrom Section */}
            <div className="space-y-2">
              <h3 className="font-medium text-gray-700">Transfer From</h3>
              <div className="grid grid-cols-3 gap-2">
                <input
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="From address"
                  value={transferFromSender}
                  onChange={(e) => setTransferFromSender(e.target.value)}
                />
                <input
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="To address"
                  value={transferFromReceiver}
                  onChange={(e) => setTransferFromReceiver(e.target.value)}
                />
                <input
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Amount"
                  type="number"
                  value={transferFromAmount}
                  onChange={(e) => setTransferFromAmount(e.target.value)}
                />
              </div>
              <button
                onClick={handleTransferFrom}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Transfer From
              </button>
            </div>
  
            {/* Airdrop Section */}
            <div className="space-y-2">
              <h3 className="font-medium text-gray-700">Airdrop Tokens</h3>
              <div className="space-y-2">
                <input
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Recipient addresses (comma-separated)"
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value)}
                />
                <input
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Amounts (comma-separated)"
                  value={airdropAmounts}
                  onChange={(e) => setAirdropAmounts(e.target.value)}
                />
                <button
                  onClick={handleAirdrop}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Send Airdrop
                </button>
              </div>
            </div>
  
            {/* Status Messages */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md">
                {error}
              </div>
            )}
            {txStatus && (
              <div className="mt-4 p-3 bg-green-50 text-green-600 rounded-md">
                {txStatus}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-600">Please connect your wallet to interact with the token</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletComponent;