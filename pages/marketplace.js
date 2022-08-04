import React from "react";
import NftCard from "../components/NftCard";
import { Loading } from "web3uikit";
import { useMoralisQuery, useMoralis } from "react-moralis";
const Marketplace = () => {
  let chainId = process.env.chainId || 31337;
  const { isWeb3Enabled } = useMoralis();
  const { data: listedNfts, isFetching: fetchingListedNfts } = useMoralisQuery(
    "ActiveItem",
    (query) => query.limit(10).descending("tokenId")
  );
  return (
    <div className="marketplace_main_div">
      <h1 className="marketplace_heading heading">NFT Marketplace</h1>
      <div className="marketplace_artwork">
        <h3 className="marketplace_artwork_heading heading2">Artworks</h3>
        <div className="marketplace_artwork_grid">
          <div className="nftsGrid">
            {isWeb3Enabled ? (
              fetchingListedNfts ? (
                <div
                  style={{
                    backgroundColor: "#ECECFE",
                    borderRadius: "8px",
                    padding: "20px",
                  }}
                >
                  <Loading size={40} spinnerColor="#2E7DAF" />
                </div>
              ) : (
                listedNfts.map((nft) => {
                  const {
                    price,
                    nftAddress,
                    tokenId,
                    marketplaceAddress,
                    seller,
                  } = nft.attributes;
                  return (
                    <NftCard
                      price={price}
                      nftAddress={nftAddress}
                      tokenId={tokenId}
                      marketplaceAddress={marketplaceAddress}
                      seller={seller}
                      key={`${nftAddress}${tokenId}`}
                    />
                  );
                })
              )
            ) : (
              <div>Web3 Currently Not Enabled</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
