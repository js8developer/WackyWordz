import '../styles/App.css';
import twitterLogo from '../assets/twitter-logo.svg';
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import myEpicNft from '../utils/MyEpicNFT.json';
import { Stack, CircularProgress } from '@mui/material';
import EthersAPI from '../api/ethersAPI';
import { MintingView } from './minting';


const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;
// I moved the contract address to the top for easy access.
const CONTRACT_ADDRESS = "0x846eD3A13Fb1A980140A1095255AE19688fe9077";


export const HomeView = () => {

    const [currentAccount, setCurrentAccount] = useState("");
    const [currentMintCount, setCurrentMintCount] = useState(0);
    const [minting, setMinting] = useState(false);
  

    const checkIfWalletIsConnected = async () => {
        const accounts = await EthersAPI.getAccounts();
  
        if (accounts.length !== 0) {
            console.log("Found an authorized account:", accounts[0]);
            setCurrentAccount(accounts[0])
            await EthersAPI.ensureRinkeby();
           
            setupEventListener()
        } else {
            console.log("No authorized account found")
        }
    }

    const connectWallet = async () => {
      try {
        const accounts = await EthersAPI.getAccounts();
        setCurrentAccount(accounts[0]);
        console.log("Connected", accounts[0]);

        await EthersAPI.ensureRinkeby();

        setupEventListener() 
      } catch (error) {
        console.log(error)
      }
    }

    const getTotalNFTsMintedSoFar = async () => {
      const mintCount = await EthersAPI.getTotalNFTsMintedSoFar();
      setCurrentMintCount(mintCount);
  }


   


    // Setup our listener.
    const setupEventListener = async () => {
      // Most of this looks the same as our function askContractToMintNft
      try {
        const { ethereum } = window;
  
        if (ethereum) {
          // Same stuff again
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);
  
          // THIS IS THE MAGIC SAUCE.
          // This will essentially "capture" our event when our contract throws it.
          // If you're familiar with webhooks, it's very similar to that!
          connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
            console.log(from, tokenId.toNumber())
            alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
          });
  
          console.log("Setup event listener!")
  
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
        console.log(error)
      }
    }




  
    // const askContractToMintNft = async () => {
    //   try {
    //     const { ethereum } = window;
  
    //     if (ethereum) {
    //       const provider = new ethers.providers.Web3Provider(ethereum);
    //       const signer = provider.getSigner();
    //       const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);
  
    //       console.log("Going to pop wallet now to pay gas...")
    //       let nftTxn = await connectedContract.makeAnEpicNFT();
    //       // setMinting(true);
  
    //       console.log("Mining...please wait.")
    //       await nftTxn.wait();
    //       console.log(nftTxn);
    //       console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
  
    //       // setMinting(false)
    //     } else {
    //       console.log("Ethereum object doesn't exist!");
    //     }
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }
    
    const askContractToMintNft = async () => {
        const mintingContract = await EthersAPI.getMintingContract();
  
        console.log("Going to pop wallet now to pay gas...")
        setMinting(true);

        let nftTxn = await mintingContract.makeAnEpicNFT();
        console.log("Mining...please wait.")
        await nftTxn.wait();
        console.log(nftTxn);
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

        setMinting(false)
    }
  

   
  
  
    useEffect(() => {
      getTotalNFTsMintedSoFar();
      checkIfWalletIsConnected();
    }, [])
  

    const renderNotConnectedContainer = () => (
        <button onClick={connectWallet} className="cta-button connect-wallet-button">
          Connect to Wallet
        </button>
    );
    const renderMintUI = () => (
        <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
          Mint NFT
        </button>
    )
    const renderViewOnOpenSeaUI = () => (
        <button onClick={handleOpenSeaClick} className="opensea-button cta-button">
          🌊 View Collection on OpenSea 🌊
        </button>
    )
    const handleOpenSeaClick = () => {
        window.open("https://testnets.opensea.io/collection/squarenft-o8ihmhpsml");
    };




    const mainView = () => {
      return (
          <Stack className='header-container' direction='column' spacing={5}>
            <Stack className='header-container' direction='column' spacing={1}>
              <p className="header gradient-text">WackyWordz</p>
              <p className="sub-header gradient-text">NFT Collection</p>
            </Stack>
            <p className="sub-text">Mint your very own WackyWordz NFT!</p>
            <p className="count-text">{currentMintCount} / {TOTAL_MINT_COUNT} NFTs minted 🕺🏼</p>

            <Stack
              className='buttons-group'
              direction='column'
              spacing={2}
            >
              {currentAccount === "" ? renderNotConnectedContainer() : renderMintUI()}
              {currentAccount === "" ? renderNotConnectedContainer() : renderViewOnOpenSeaUI()}
            </Stack>
          </Stack>
      );
    };


    return (
      <>
        { minting === true ? MintingView() : mainView() }
      </>
    );
  }