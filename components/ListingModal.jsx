import React, { useState, useEffect } from "react";
import { Modal, Input, useNotification } from "web3uikit";
import { useWeb3Contract, useMoralis } from "react-moralis";
import NftMarketplaceAbi from "../constants/NftMarketplace.json";
import InfinityNFTAbi from "../constants/InfinityNFT.json";
import networkMapping from "../constants/networkMapping.json";
import { ethers } from "ethers";

const ListingModal = ({
  name,
  isVisible,
  visibilityFunc,
  token_address,
  token_id,
}) => {
  // const { chainId, account, isWeb3Enabled } = useMoralis();
  const [price, setPrice] = useState(0);
  const nftMarketPlaceAddress = networkMapping["4"].NftMarketplace[0];

  const { runContractFunction } = useWeb3Contract();
  const dispatch = useNotification();
  async function approveAndList() {
    console.log("Approving...");
    const nftAddress = token_address;
    const tokenId = token_id;
    const N_price = ethers.utils.parseUnits(price, "ether").toString();

    const approveOptions = {
      abi: InfinityNFTAbi,
      contractAddress: nftAddress,
      functionName: "approve",
      params: {
        to: nftMarketPlaceAddress,
        tokenId: tokenId,
      },
    };

    await runContractFunction({
      params: approveOptions,
      onSuccess: () => handleApproveSuccess(nftAddress, tokenId, N_price),
      onError: (error) => {
        alert(error);
      },
    });
  }

  async function handleApproveSuccess(nftAddress, tokenId, price) {
    console.log("Ok! Now time to list");
    const listOptions = {
      abi: NftMarketplaceAbi,
      contractAddress: nftMarketPlaceAddress,
      functionName: "listItem",
      params: {
        nftAddress: nftAddress,
        tokenId: tokenId,
        price: price,
      },
    };

    await runContractFunction({
      params: listOptions,
      onSuccess: handleListSuccess,
      onError: (error) => alert(error.message),
    });
  }
  async function updateListing() {
    console.log("Ok! Now time to update list");
    const updateListOptions = {
      abi: NftMarketplaceAbi,
      contractAddress: nftMarketPlaceAddress,
      functionName: "updateListing",
      params: {
        nftAddress: token_address,
        tokenId: token_id,
        newPrice: ethers.utils.parseUnits(price, "ether").toString(),
      },
    };

    await runContractFunction({
      params: updateListOptions,
      onSuccess: handleListSuccess,
      onError: (error) => alert(error.message),
    });
  }

  async function handleListSuccess(tx) {
    visibilityFunc(false);
    await tx.wait(1);
    dispatch({
      type: "success",
      message: name,
      title: name,
      position: "topR",
    });
  }

  return (
    <div>
      <Modal
        id="regular"
        isVisible={isVisible}
        okText={name}
        hasCancel={false}
        onCloseButtonPressed={() => visibilityFunc(false)}
        onOk={() => {
          if (name === "List NFT") {
            approveAndList();
          } else {
            updateListing();
          }
        }}
        title={
          <div style={{ display: "flex", gap: 10 }}>{name} to Marketplace</div>
        }
      >
        <div>
          <div
            style={{
              padding: "20px 0 20px 0",
            }}
          >
            <Input
              value={token_address}
              label="NFT Address"
              width="100%"
              disabled
              hasCopyButton={true}
            />
          </div>
          <div
            style={{
              padding: "20px 0 20px 0",
            }}
          >
            <Input
              value={`#${token_id}`}
              label="Token Id"
              width="100%"
              disabled
              hasCopyButton={true}
            />
          </div>
          <div
            style={{
              padding: "20px 0 20px 0",
            }}
          >
            <Input
              label="New Price(ETH)"
              width="100%"
              type="number"
              autoFocus={true}
              onChange={(e) => {
                setPrice(e.target.value);
              }}
              min={0}
              step={0.01}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ListingModal;
