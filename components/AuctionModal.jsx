import React, { useState } from "react";
import { Modal, Input, useNotification } from "web3uikit";
import { useWeb3Contract, useMoralis } from "react-moralis";
import InfinityNFTAbi from "../constants/InfinityNFT.json";
import NftMarketplaceAbi from "../constants/NftMarketplace.json";
import networkMapping from "../constants/networkMapping.json";
import { ethers } from "ethers";

const AuctionModal = ({
  name,
  isVisible,
  visibilityFunc,
  token_address,
  token_id,
}) => {
  const [price, setPrice] = useState(0);
  const [interval, setInterval] = useState(0);
  const nftMarketPlaceAddress = networkMapping["4"].NftMarketplace[0];
  const { runContractFunction } = useWeb3Contract();
  const dispatch = useNotification();

  async function approveAndAuction() {
    console.log("Approving...");
    const nftAddress = token_address;
    const tokenId = token_id;
    const R_price = ethers.utils.parseUnits(price, "ether").toString();
    const auctionInterval = interval * 60 * 60;

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
      onSuccess: () =>
        handleApproveSuccess(nftAddress, tokenId, auctionInterval, R_price),
      onError: (error) => {
        alert(error);
      },
    });
  }

  async function handleApproveSuccess(nftAddress, tokenId, interval, price) {
    console.log("Ok! Now time to Auction");
    const AuctionOption = {
      abi: NftMarketplaceAbi,
      contractAddress: nftMarketPlaceAddress,
      functionName: "createAuction",
      params: {
        nftAddress: nftAddress,
        tokenID: tokenId,
        timeInterval: interval,
        reservedPrice: price,
      },
      msgValue: ethers.utils.parseUnits("0.01", "ether").toString(),
    };

    await runContractFunction({
      params: AuctionOption,
      onSuccess: handleListSuccess,
      onError: (error) => alert(error.message),
    });
  }
  async function handleListSuccess(tx) {
    visibilityFunc(false);
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "NFT Auctioned",
      title: "NFT Auctioned",
      position: "topR",
    });
  }

  // {
  //   abi: NftMarketplaceAbi,
  //   contractAddress: nftMarketPlaceAddress,
  //   functionName: "createAuction",
  //   params: {
  //     nftAddress: token_address,
  //     tokenID: token_id,
  //     timeInterval: interval * 60 * 60,
  //     reservedPrice: ethers.utils.parseEther(price || "0"),
  //   },
  // }

  return (
    <div>
      <Modal
        id="regular"
        isVisible={isVisible}
        okText={name}
        hasCancel={false}
        onCloseButtonPressed={() => visibilityFunc(false)}
        onOk={() => {
          approveAndAuction();
        }}
        title={<div style={{ display: "flex", gap: 10 }}>{name} of NFT</div>}
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
              label="Reserved Price(ETH)"
              width="100%"
              type="number"
              autoFocus={true}
              onChange={(e) => setPrice(e.target.value)}
              min={0}
              step={0.01}
              placeholder="Ex : 0.1"
            />
          </div>
          <div
            style={{
              padding: "20px 0 20px 0",
            }}
          >
            <Input
              label="Auction Interval(hours)"
              width="100%"
              type="number"
              autoFocus={true}
              onChange={(e) => setInterval(e.target.value)}
              min={0}
              placeholder="Ex : 12"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AuctionModal;
