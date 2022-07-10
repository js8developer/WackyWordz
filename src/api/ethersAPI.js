import { ethers } from "ethers";
import myEpicNft from '../utils/MyEpicNFT.json';
import { Dispatch, SetStateAction } from 'react';

// I moved the contract address to the top for easy access.
const CONTRACT_ADDRESS = "0x846eD3A13Fb1A980140A1095255AE19688fe9077";



export default class EthersAPI {

    
    static getAccounts = async () => {
        const { ethereum } = window;
        if (!ethereum) {
            console.log("Make sure you have metamask!");
            return;
        } else {
            console.log("We have the ethereum object", ethereum);
        }
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        return accounts;
    }

    static ensureRinkeby = async () => {
        const { ethereum } = window;
        let chainId = await ethereum.request({ method: 'eth_chainId' });
        console.log("Connected to chain " + chainId);
        // String, hex code of the chainId of the Rinkebey test network
        const rinkebyChainId = "0x4"; 
        if (chainId !== rinkebyChainId) {
            alert("You are not connected to the Rinkeby Test Network!");
        }
    }
 

    static getTotalNFTsMintedSoFar = async () => {
      try {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);
  
          console.log("Getting current mints count...🥁")
          let currentMintCountTxn = await connectedContract.getTotalNFTsMintedSoFar();
          console.log(currentMintCountTxn);
         
          const currentMintCount = currentMintCountTxn.toNumber();
          return currentMintCount;
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } 
      catch (error) {
        console.log(error)
      }
    }


    static getMintingContract = async (minting, setMinting) => {
      try {
        const { ethereum } = window;
  
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);
          return connectedContract;
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
        console.log(error)
      }
    }
}

