import { useState, useEffect } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import nftMarketplaceAbi from "../constants/NftMarketplace.json";
import nftAbi from "../constants/InfinityNFT.json";
import Image from "next/image";
import Countdown from "react-countdown";
import { Card, useNotification } from "web3uikit";
import BidAuctionModal from "./ListingModal";
import { ethers } from "ethers";
import { Loading } from "web3uikit";

const truncateStr = (fullStr, strLen) => {
  if (fullStr.length <= strLen) return fullStr;

  const separator = "...";
  const seperatorLength = separator.length;
  const charsToShow = strLen - seperatorLength;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  return (
    fullStr.substring(0, frontChars) +
    separator +
    fullStr.substring(fullStr.length - backChars)
  );
};

const AuctionCard = ({
  price,
  nftAddress,
  tokenId,
  marketplaceAddress,
  endTime,
}) => {
  const { isWeb3Enabled, account } = useMoralis();
  const [listingModal, setListingModal] = useState(false);

  const [imageURI, setImageURI] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [auctionEnded, setAuctionEnded] = useState(false);
  // const dispatch = useNotification()

  const { runContractFunction: getTokenURI } = useWeb3Contract({
    abi: nftAbi,
    contractAddress: nftAddress,
    functionName: "tokenURI",
    params: {
      tokenId: tokenId,
    },
  });

  const { runContractFunction: endAuction } = useWeb3Contract({
    abi: nftMarketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "endAuction",
    params: {
      nftAddress: nftAddress,
      tokenId: tokenId,
    }

  });



  async function updateUI() {
    const tokenURI = await getTokenURI();
    console.log(`The TokenURI is ${tokenURI}`);
    // We are going to cheat a little here...
    if (tokenURI) {
      // IPFS Gateway: A server that will return IPFS files from a "normal" URL.
      const requestURL = tokenURI.replace("https://gateway.moralisipfs.com/ipfs/", "https://ipfs.io/ipfs/");
      const tokenURIResponse = await (await fetch(requestURL)).json();
      const imageURI = tokenURIResponse.image;
      const imageURIURL = imageURI.replace("https://gateway.moralisipfs.com/ipfs/", "https://ipfs.io/ipfs/");
      setImageURI(imageURIURL);
      setTokenName(tokenURIResponse.name);
      setTokenDescription(tokenURIResponse.description);
      // We could render the Image on our sever, and just call our sever.
      // For testnets & mainnet -> use moralis server hooks
      // Have the world adopt IPFS
      // Build our own IPFS gateway
    }
    // get the tokenURI
    // using the image tag from the tokenURI, get the image
  }


  const Completionist = () => {
    setAuctionEnded(true);
    return <button className=" AuctionEnd button" onClick={() => endAuction()}>Auction Ended</button>;
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);
  return (
    <div>
      {imageURI ? (
        <div className="card_main_div">
          <BidAuctionModal
            isVisible={listingModal}
            visibilityFunc={setListingModal}
            token_address={nftAddress}
            token_id={tokenId}
          />
          <div className="card">
            <div className="thumbnail">
              <Image
                loader={() => imageURI}
                src={imageURI}
                width={250}
                height={250}
              />
            </div>
            <div className="card-body">
              <h1>{tokenName} </h1>
              {tokenDescription ? (
                <span style={{ color: "grey", fontSize: "1rem" }}>
                  {tokenDescription}
                </span>
              ) : null}
              <div className="card_body_div">
                <div className="time">
                  <div className="type">
                    <p>Token id #{tokenId}</p>
                  </div>
                </div>
                <div className="details">
                  <div className="type">
                    {/* <p>Price :</p> */}
                    <p className="Nftprice">
                      Last Bid:{" "}
                      <span style={{ fontWeight: "800" }}>
                        {ethers.utils.formatUnits(price, "ether")} ETH
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="auction_card_counter">
                <span>Auction ends in : </span>
                <Countdown date={endTime * 1000}>
                  <Completionist />
                </Countdown>
              </div>
              <div className="creator">
                <button className="placebid button2" onClick={() => setListingModal(true)}>Bid</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            // backgroundColor: '#ECECFE',
            borderRadius: "8px",
            padding: "20px",
          }}
        >
          <Loading
            fontSize={12}
            size={12}
            spinnerColor="#2E7DAF"
            spinnerType="wave"
            text="Loading..."
          />
        </div>
      )}
    </div>
  );
};

export default AuctionCard;
