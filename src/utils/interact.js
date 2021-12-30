
const alchemyKey = "https://polygon-mumbai.g.alchemy.com/v2/rLb-balPS3b9L8ySwhVqeRISGrUz2Jb1";
const { createAlchemyWeb3 } = require('@alch/alchemy-web3');


const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require('../write_stone_abi.json');
const contractAddress = '0x41c0aCA5f76C0D028199c5068aD002E90af9e4f9';
export const connectWallet = async () => {
  // Function to connect wallet to dApp
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      const obj = {
        status: '👆🏽 Write a message in the text-field above.',
        address: addressArray[0],
      };
      return obj;
    } catch (err) {
      return {
        address: '',
        status: '😥 ' + err.message,
      };
    }
  } else {
    return {
      address: '',
      status: (
        <span>
          <p>
            {' '}
            🦊{' '}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: 'eth_accounts',
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: '👆🏽 Write a message in the text-field above.',
        };
      } else {
        return {
          address: '',
          status: '🦊 Connect to Metamask using the top right button.',
        };
      }
    } catch (err) {
      return {
        address: '',
        status: '😥 ' + err.message,
      };
    }
  } else {
    return {
      address: '',
      status: (
        <span>
          <p>
            {' '}
            🦊{' '}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};


export const mintNFT = async(description) => {

  //error handling
  if (description.trim() == "") { 
      return {
          success: false,
          status: "❗Please make sure all fields are completed before minting.",
      }
  }

  //make metadata



  //load smart contract
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);//loadContract();

  //set up your Ethereum transaction
  const transactionParameters = {
      to: contractAddress, // Required except during contract publications.
      from: window.ethereum.selectedAddress, // must match user's active address.
      'data': window.contract.methods.write(description).encodeABI() //make call to NFT smart contract 
  };

  //sign transaction via Metamask
  try {
      const txHash = await window.ethereum
          .request({
              method: 'eth_sendTransaction',
              params: [transactionParameters],
          });
      return {
          success: true,
          status: "✅ Check out your transaction on Etherscan: https://mumbai.polygonscan.com/tx/" + txHash
      }
  } catch (error) {
      return {
          success: false,
          status: "😥 Something went wrong: " + error.message
      }
  }
}