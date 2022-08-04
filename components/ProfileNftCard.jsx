import React, { useState } from "react";
import { Loading, useNotification } from "web3uikit";
import Image from "next/image";
import { useMoralis, useWeb3Contract } from "react-moralis";
import ListingModal from "./ListingModal";
import AuctionModal from "./AuctionModal";
import NftMarketplaceAbi from "../constants/NftMarketplace.json";
import networkMapping from "../constants/networkMapping.json";
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

const ProfileNftCard = ({
  name,
  owner_of,
  token_address,
  token_id,
  token_uri,
  buttonLA,
}) => {
  const { account } = useMoralis();
  const [listingModal, setListingModal] = useState(false);
  const [auctionModal, setAuctionModal] = useState(false);
  const nftMarketPlaceAddress = networkMapping["4"].NftMarketplace[0];

  const dispatch = useNotification();

  const { runContractFunction } = useWeb3Contract();
  const isOwnedByUser = owner_of === account || seller === undefined;
  const formattedSellerAddress = isOwnedByUser
    ? "you"
    : truncateStr(seller || "", 15);

  async function cancelListing() {
    const cancelListingOptions = {
      abi: NftMarketplaceAbi,
      contractAddress: nftMarketPlaceAddress,
      functionName: "cancelListing",
      params: {
        nftAddress: token_address,
        tokenId: token_id,
      },
    };

    await runContractFunction({
      params: cancelListingOptions,
      onSuccess: () => handleCancelListingSuccess(token_address, token_id),
      onError: (error) => {
        alert(error);
      },
    });
  }

  async function handleCancelListingSuccess(tx) {
    dispatch({
      type: "success",
      message: "Cancel Listing Successfull",
      title: "Cancel Listing",
      position: "topR",
    });
  }

  const actionButtons = () => {
    if (buttonLA) {
      return (
        <div className="nft_listing_auction_button_div">
          <button
            className="Auction_button button2"
            onClick={() => {
              setListingModal(true);
            }}
          >
            Update
          </button>
          <button
            className="Listing_button button2"
            onClick={() => cancelListing()}
          >
            Cancel
          </button>
        </div>
      );
    } else {
      return (
        <div className="nft_listing_auction_button_div">
          <button
            className="Auction_button button2"
            onClick={() => {
              setAuctionModal(true);
            }}
          >
            Auction
          </button>
          <button
            className="Listing_button button2"
            onClick={() => setListingModal(true)}
          >
            Listing
          </button>
        </div>
      );
    }
  };
  return (
    <div>
      {token_uri ? (
        <div className="card_main_div">
          <ListingModal
            name={buttonLA ? "Update NFT" : "List NFT"}
            isVisible={listingModal}
            visibilityFunc={setListingModal}
            token_address={token_address}
            token_id={token_id}
          />
          <AuctionModal
            name={"Create Auction"}
            isVisible={auctionModal}
            visibilityFunc={setAuctionModal}
            token_address={token_address}
            token_id={token_id}
          />

          <div className="card">
            <div className="thumbnail">
              <Image
                loader={() => token_uri}
                src={token_uri}
                width={250}
                height={250}
                unoptimized
              />
            </div>
            <div className="card-body">
              <h1>{name} </h1>
              <div className="card_body_div">
                <div className="time">
                  <div className="type">
                    <p>Token id #{truncateStr(token_id || "", 15)}</p>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="nft_listing_auction_button_div">
              <button
                className="Auction_button button2"
                onClick={() => {
                  setAuctionModal(true);
                }}
              >
                Auction
              </button>
              <button
                className="Listing_button button2"
                onClick={() => setListingModal(true)}
              >
                Listing
              </button>
            </div> */}
            {actionButtons()}
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

export default ProfileNftCard;
