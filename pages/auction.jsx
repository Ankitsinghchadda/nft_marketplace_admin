import React from "react";
import AuctionCard from "../components/AuctionCard";
import { useMoralisQuery, useMoralis } from "react-moralis";
import Link from "next/link";
const Auction = () => {
  let chainId = process.env.chainId || 31337;
  const { isWeb3Enabled } = useMoralis();
  const { data: listedNfts, isFetching: fetchingListedNfts } = useMoralisQuery(
    "AuctionCreated",
    (query) => query.limit(10).descending("tokenId")
  );
  console.log(listedNfts);
  return (
    <div className="marketplace_main_div">
      <h1 className="marketplace_heading heading">NFT Auction</h1>

      <div className="marketplace_artwork">
        <h3 className="marketplace_artwork_heading heading2">Auctions</h3>
        <div className="marketplace_artwork_grid">
          <div className="nftsGrid">
            {isWeb3Enabled ? (
              fetchingListedNfts ? (
                <div>Loading...</div>
              ) : (
                listedNfts.map((nft) => {
                  console.log(nft.attributes);
                  const {
                    reservedPrice,
                    nftAddress,
                    tokenId,
                    address,
                    endTime,
                  } = nft.attributes;
                  return (
                    <AuctionCard
                      price={reservedPrice}
                      nftAddress={nftAddress}
                      tokenId={tokenId}
                      marketplaceAddress={address}
                      endTime={endTime}
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
      <div className="start_auction_div noNft_div">
        <span className="noNft">Want to start your own Auction? </span>
        <Link href="/profile">Click here</Link>
      </div>
    </div>
  );
};

export default Auction;
