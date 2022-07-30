import NatureNFT from "../public/NFTNature.jpg";
import Image from "next/image";
import NftCard from "../components/NftCard";

export default function Home() {
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
            <button className="view_market button">View Market</button>
            <button className="upload_item button">Upload Your Item</button>
          </div>
        </div>
        <div className="home_image_div">
          <Image src={NatureNFT} layout="responsive" />
        </div>
      </div>
      <div className="marketOverview">
        <h2 className="heading2">Explore</h2>
        <div className="nftsGrid">
          <NftCard />
          <NftCard />
          <NftCard />
          <NftCard />
          <NftCard />
        </div>
      </div>
    </div>
  );
}
