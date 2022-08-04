import React, { useEffect, useState } from "react";
import {
  useMoralis,
  useMoralisWeb3Api,
  useWeb3Contract,
  useMoralisQuery,
} from "react-moralis";
import { useNotification } from "web3uikit";

import Image from "next/image";
import AvatarImage from "../public/Avatar.png";
import ProfileNftCard from "../components/ProfileNftCard";
import Link from "next/link";
import NftMarketplaceAbi from "../constants/NftMarketplace.json";
import networkMapping from "../constants/networkMapping.json";
import { ethers } from "ethers";

const profile = () => {
  const [userNfts, setUserNfts] = useState([]);
  const [proceeds, setProceeds] = useState("0");
  const [listedNftMapping, setListedNFTMapping] = useState({});
  const { runContractFunction } = useWeb3Contract();
  const { account, isWeb3Enabled } = useMoralis();
  const Web3Api = useMoralisWeb3Api();
  const nftMarketPlaceAddress = networkMapping["4"].NftMarketplace[0];
  const { dispatch } = useNotification();
  const { data: listedNfts, isFetching: fetchingListedNfts } = useMoralisQuery(
    "ActiveItem",
    (query) => query.limit(10).descending("tokenId")
  );

  const fetch = async () => {
    if (isWeb3Enabled) {
      const userEthNFTs = await Web3Api.account.getNFTs({ chain: "rinkeby" });
      setUserNfts(userEthNFTs.result);
    }
  };

  async function setupUI() {
    const returnedProceeds = await runContractFunction({
      params: {
        abi: NftMarketplaceAbi,
        contractAddress: nftMarketPlaceAddress,
        functionName: "getProceeds",
        params: {
          seller: account,
        },
      },
      onError: (error) => console.log(error),
    });
    if (returnedProceeds) {
      setProceeds(
        ethers.utils.formatEther(returnedProceeds, "ethers").toString()
      );
    }
  }

  async function withdrawProceeds() {
    const withdrawProceedsOptions = {
      abi: NftMarketplaceAbi,
      contractAddress: nftMarketPlaceAddress,
      functionName: "withdrawProceeds",
    };

    await runContractFunction({
      params: withdrawProceedsOptions,
      onSuccess: () => handleWithdrawProceedsSuccess(),
      onError: (error) => {
        alert("Error withdrawing proceeds, Check If you have any funds");
      },
    });
  }
  async function handleWithdrawProceedsSuccess(tx) {
    dispatch({
      type: "success",
      message: "Withdrawal Successfull, please check your wallet",
      title: "Withdrawal",
      position: "topR",
    });
  }

  useEffect(() => {
    if (listedNfts) {
      const mappedNfts = {};
      listedNfts.map((nft) => {
        if (mappedNfts[nft.attributes.nftAddress] === undefined) {
          mappedNfts = {
            [nft.attributes.nftAddress]: [nft.attributes.tokenId],
          };
        } else {
          mappedNfts[nft.attributes.nftAddress].push(nft.attributes.tokenId);
        }
      });
      setListedNFTMapping(mappedNfts);
    }
  }, [listedNfts]);

  useEffect(() => {
    if (isWeb3Enabled) {
      fetch();
      setupUI();
    }
  }, [isWeb3Enabled, account, proceeds]);
  return (
    <div className="profile_main_div">
      <div className="profile_details">
        <div className="profile_image_div">
          <Image
            className="avatar_i"
            src={AvatarImage}
            width={100}
            height={100}
          />
        </div>
        <span
          style={{
            color: "#183b56",
            letterSpacing: "0.05rem",
            fontSize: "1.2rem",
            fontWeight: "600",
          }}
        >
          @{account}
        </span>
        <div className="withdrawalProceeds">
          <span
            style={{
              color: "#183b56",
              letterSpacing: "0.05rem",
              fontSize: "1.2rem",
              fontWeight: "600",
            }}
          >
            Balance : {proceeds} ETH
          </span>
          <button
            className="withdraw_proceed button"
            onClick={() => withdrawProceeds()}
          >
            Withdraw
          </button>
        </div>
      </div>
      <div className="profile_nfts">
        <h3 className="heading2"> Your NFTs</h3>

        <div className="profile_nft_grid">
          {userNfts.length ? (
            userNfts.map((nft) => {
              let metadata = "";
              let metadataJson = {};
              if (nft.metadata !== null) {
                metadata = nft.metadata?.replace("\\", "");
                metadataJson = JSON.parse(metadata);
              }

              const { name, owner_of, token_address, token_id, token_uri } =
                nft;
              const image = metadataJson?.image
                ? metadataJson.image
                : token_uri;

              const nft_name = metadataJson?.name || name;

              if (!image) {
                return null;
              }

              return (
                <ProfileNftCard
                  name={nft_name}
                  owner_of={owner_of}
                  token_address={token_address}
                  token_id={token_id}
                  token_uri={image}
                  buttonLA={
                    listedNftMapping[token_address]?.includes(token_id) || false
                  }
                  key={`${token_address}${token_id}`}
                />
              );
            })
          ) : (
            <div className="noNft_div">
              <span className="noNft" style={{ textAlign: "center" }}>
                You don't have any NFTs yet.{" "}
              </span>
              <Link href="/create">Create One Now!</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default profile;
