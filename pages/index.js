import NatureNFT from "../public/NFTNature.jpg";
import { useEffect } from "react";
import Image from "next/image";
import NftCard from "../components/NftCard";
import { useMoralisQuery, useMoralis } from "react-moralis"
import { useChain } from "react-moralis"
import Link from "next/link"
import { useRouter } from 'next/router'
// import { useMoralisWeb3Api } from "react-moralis";

export default function Home() {
  const { isWeb3Enabled, chainId, enableWeb3 } = useMoralis()
  const { switchNetwork } = useChain()
  const router = useRouter()
  const { data: listedNfts, isFetching: fetchingListedNfts } = useMoralisQuery(
    "ActiveItem",
    (query) => query.limit(3).descending("tokenId")
  )
  console.log(listedNfts)
  // const Web3Api = useMoralisWeb3Api();
  // const fetch = async () => {
  //   const userEthNFTs = await Web3Api.account.getNFTs();
  //   console.log(userEthNFTs.result);
  // };
  // fetch();
  const enable_Web3 = async () => {
    await enableWeb3();
  }
  console.log(typeof (chainId));

  useEffect(() => {
    if (isWeb3Enabled && chainId != "0x4") {
      alert("Please switch to the rinkeby network");
      switchNetwork("0x4")
    }
    else {
      console.log("not connected to rinkeby")
      if (!isWeb3Enabled) {
        enable_Web3()
      }
    }

  }, [chainId, isWeb3Enabled])



  return (
    <div className="home_container">
      <div className="home_div">
        <div className="home_start_div">
          <span className="home_heading heading">
            Discover digital art and collect NFTs
          </span>
          <p className="home_des description">
            Infinity NFT is a shared liquidity NFT market smart contract which
            is used by multiple websites to provide the users the best possible
            experience.
          </p>
          <div className="home_start_button">
            <button className="view_market button3" onClick={() => router.push("/marketplace")}>View Market</button>
            <button className="upload_item button3" onClick={() => router.push("/create")}>Upload Your Item</button>
          </div>
        </div>
        <div className="home_image_div">
          <Image src={NatureNFT} layout="responsive" />
        </div>
      </div>
      <div className="marketOverview">
        <h2 className="heading2">Explore</h2>
        <div className="nftsGrid">
          {isWeb3Enabled ? (
            fetchingListedNfts ? (
              <div>Loading...</div>
            ) : (
              listedNfts.map((nft) => {
                console.log(nft.attributes)
                const { price, nftAddress, tokenId, marketplaceAddress, seller } =
                  nft.attributes
                return (
                  <NftCard
                    price={price}
                    nftAddress={nftAddress}
                    tokenId={tokenId}
                    marketplaceAddress={marketplaceAddress}
                    seller={seller}
                    key={`${nftAddress}${tokenId}`}
                  />
                )
              })
            )
          ) : (
            <div>Web3 Currently Not Enabled</div>
          )}
        </div>
      </div>
    </div>
  );
}
