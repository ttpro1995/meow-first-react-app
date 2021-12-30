import React from 'react';
import { useEffect, useState } from 'react';
import {
  connectWallet,
  getCurrentWalletConnected,
  mintNFT
} from './utils/interact.js';



const ContractInteract = (props) => {
  //State variables
  const [walletAddress, setWallet] = useState('');
  const [status, setStatus] = useState('');
  const [description, setDescription] = useState('');


  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus(" Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus(" Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          {" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  useEffect(async () => {
    const { address, status } = await getCurrentWalletConnected();
    setWallet(address);
    setStatus(status);

    addWalletListener();
  }, []);

  const connectWalletPressed = async () => {

    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onMintPressed = async () => {
    const { status } = await mintNFT(description);
    setStatus(status);
  };


  return (
    <div className="ContractInteract">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          'Connected: ' +
          String(walletAddress).substring(0, 6) +
          '...' +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <form>

        <h2>✍️ Message: </h2>
        <input
          type="text"
          placeholder="e.g. Even cooler than cryptokitties ;)"
          onChange={(event) => setDescription(event.target.value)}
        />
      </form>
      <button id="mintButton" onClick={onMintPressed}>
        Mint NFT
      </button>
      <p id="status">{status}</p>

      <p id="status">{status}</p>
    </div>
  );
};




export default ContractInteract;
