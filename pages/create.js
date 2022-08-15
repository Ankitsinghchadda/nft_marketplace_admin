import React, { useState } from "react";
// import image from "../public/NFTNature.jpg";
import { BsFillCameraFill } from "react-icons/bs";
import Image from "next/image";
import Moralis from "moralis";
import { useWeb3ExecuteFunction, useWeb3Contract, useMoralis, useMoralisWeb3Api } from "react-moralis";
import InfinityNFTAbi from "../constants/InfinityNFT.json";
import networkMapping from "../constants/networkMapping.json";



const create = () => {
  const [uploaded, setUploaded] = useState("Click To Upload");
  const [image, setImage] = useState("");
  const [file, setfile] = useState(null);
  const [nftDetail, setNftDetail] = useState({
    name: "",
    description: "",

  });
  const { chainId } = useMoralis()
  const Chain_id = "4"

  const InfinityNFTAddress = networkMapping[Chain_id].InfinityNFT[0];
  const Web3Api = useMoralisWeb3Api()
  // const contractProcessor = useWeb3ExecuteFunction()


  const onChangeFile = (event) => {
    if (!event.target.files[0]) {
      return;
    }
    const file_l = event.target.files;

    setfile(file_l[0])
    setUploaded(file_l[0].name);
    setImage(URL.createObjectURL(file_l[0]));
  };
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload an image");
      return
    }
    try {

      const options = {
        abi: [
          {
            path: uploaded,
            content:
              await convertBase64(file),
          },
        ],
      };
      const path = await Web3Api.storage.uploadFolder(options);
      console.log(path);
      // Generate metadata and save to IPFS
      const metadata = {
        name: nftDetail.name,
        description: nftDetail.description,
        image: path[0].path,
      };


      const options2 = {
        abi: [
          {
            path: `${nftDetail.name}metadata.json`,
            content:
              Buffer.from(JSON.stringify(metadata)).toString("base64"),
          },
        ],
      };
      const metadataurl = await Web3Api.storage.uploadFolder(options2);
      console.log(typeof (metadataurl[0].path));


      // Interact with smart contract
      // const contract = new web3.eth.Contract(contractABI, contractAddress);
      console.log(InfinityNFTAbi[12])
      console.log(nftDetail.name);
      let contractOptions = {
        abi: InfinityNFTAbi,
        contractAddress: InfinityNFTAddress,
        functionName: "mint",
        params: {
          tokenURI: metadataurl[0].path,
          _name: nftDetail.name,
        },
      };

      const response = await Moralis.executeFunction(contractOptions);
      console.log(response);

      alert(
        `NFT successfully minted. Contract address - ${InfinityNFTAddress} and Token ID - ${"tokenId"}`
      );
    } catch (err) {
      console.error(err);
      alert("An error occured!");
    }

  }

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };
  return (
    <div className="create_Nft_div">
      <span className="create_heading heading2">Create your NFT</span>

      <div className="create_upload_detail_div">
        <div className="uploadItem_div">
          <label htmlFor="upload_input">
            {image == "" ? (
              <div className="drag_drop_area">
                <h2>Drag and drop your file</h2>
                <p>PNG, WEBP, JPG, JPEG</p>
                <p>or Choose a file</p>
                <p>{uploaded}</p>
                <p className="browseButton">Browse file</p>
              </div>
            ) : (
              <div className="drag_drop_area">
                <Image src={image} width={500} height={400} />
                <p>{uploaded}</p>
              </div>
            )}
            <input
              id="upload_input"
              type="file"
              accept="image/*"
              onChange={(event) => {
                onChangeFile(event);
              }}
            />
          </label>
        </div>
        <div className="uploadItem_details_div">
          <form className="itemUpload_form">
            <label htmlFor="item_title">Title*</label>
            <input
              type="text"
              className="item_title"
              name="item_title"
              placeholder="Ex: Liquid Forest Princess"
              onChange={(event) => { setNftDetail({ ...nftDetail, name: event.target.value }) }}
            />
            <label htmlFor="item_description">
              Description <span style={{ color: "grey" }}>(optional)</span>{" "}
            </label>
            <input
              type="text"
              className="item_description"
              name="item_description"
              placeholder="Ex: This is a beautiful painting by a famous artist"
              onChange={(event) => { setNftDetail({ ...nftDetail, description: event.target.value }) }}
            />
            {/* <label htmlFor="item_price">Price</label>
            <input
              type="number"
              className="item_price"
              name="item_price"
              min={0}
              step={0.01}
              placeholder="Ex: 1.5 ETH"
            /> */}
          </form>
          <button className="createItem button2" onClick={handleCreate}>Create</button>
        </div>
      </div>
    </div>
  );
};

export default create;
