import React, { useState, useEffect } from "react";
import { Modal, Input, useNotification } from "web3uikit";
import { useWeb3Contract, useMoralis } from "react-moralis";
import NftMarketplaceAbi from "../constants/NftMarketplace.json";
import InfinityNFTAbi from "../constants/InfinityNFT.json";
import networkMapping from "../constants/networkMapping.json";
import { ethers } from "ethers";

const BidAuctionModal = ({
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


    async function bidAuction() {
        console.log("Ok! let's bid!");
        const listOptions = {
            abi: NftMarketplaceAbi,
            contractAddress: nftMarketPlaceAddress,
            functionName: "bidAuction",
            params: {
                nftAddress: token_address,
                tokenId: token_id,
            },
            msgValue: ethers.utils.parseEther(price || "0")
        };

        await runContractFunction({
            params: listOptions,
            onSuccess: handleListSuccess,
            onError: (error) => alert(error.message),
        });
    }

    async function handleListSuccess(tx) {
        visibilityFunc(false);
        await tx.wait(1);
        dispatch({
            type: "success",
            message: "Auction Bid Successfully",
            title: "Bidded Auction",
            position: "topR",
        });
    }

    return (
        <div>
            <Modal
                id="regular"
                isVisible={isVisible}
                okText={"Bid Auction"}
                hasCancel={false}
                onCloseButtonPressed={() => visibilityFunc(false)}
                onOk={() => {
                    bidAuction()
                }}
                title={
                    <div style={{ display: "flex", gap: 10 }}>Bid Auction</div>
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
                            label="New Bid(ETH)"
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

export default BidAuctionModal;
