import React, { useEffect, useState } from "react";
// import image from "../public/NFTNature.jpg";
import { BsFillCameraFill } from "react-icons/bs";
import Image from "next/image";
import Moralis from "moralis";
import { useWeb3ExecuteFunction, useWeb3Contract, useMoralis, useMoralisWeb3Api } from "react-moralis";
import CreateCollectionABI from "../constants/CreateCollection.json";
import networkMapping from "../constants/networkMapping.json";



const create = () => {
    const [uploaded, setUploaded] = useState("Click To Upload");
    const [folder, setfolder] = useState(null);
    const [idCount, setIdCount] = useState(0);
    const [nftDetail, setNftDetail] = useState({
        name: "",
        description: "",

    });
    const { runContractFunction } = useWeb3Contract();
    const { chainId } = useMoralis()
    const Chain_id = "4"

    const CreateCollectionAddress = networkMapping[Chain_id].CreateCollection[0];
    const Web3Api = useMoralisWeb3Api()

    async function get_id_count() {
        const id_count = await runContractFunction({
            params: {
                abi: CreateCollectionABI,
                contractAddress: CreateCollectionAddress,
                functionName: "getIdCount",
            },
            onError: (error) => console.log(error),
        });
        if (id_count) {
            console.log(id_count.toNumber());
            setIdCount(
                id_count.toNumber()
            );
        }
    }


    const onChangeFile = (event) => {
        if (!event.target.files[0]) {
            return;
        }
        const files = event.target.files;
        setfolder(files)
        console.log(files)
        setUploaded((files[0].webkitRelativePath).split("/")[0]);
    };
    const handleCreate = async (e) => {
        e.preventDefault();
        await get_id_count();

        if (!folder) {
            alert("Please upload folder");
            return
        }
        try {
            const nftOptions = { abi: [] }
            const nftMetadataOptions = { abi: [] }

            for (let file_number = 0; file_number < folder.length; file_number++) {

                const file = folder[file_number]
                console.log(file);
                nftOptions.abi.push(
                    {
                        path: `images/${file.name}`,
                        content:
                            await convertBase64(file),
                    })
            }
            console.log(nftOptions);
            console.log("Uploading NFT Images to IPFS");
            const path = await Web3Api.storage.uploadFolder(nftOptions);
            console.log(path);

            // Generate metadata and save to IPFS
            console.log(
                "Generating NFT Metadata and saving to IPFS"
            );
            const idCountCopy = idCount;
            for (let file_number = 0; file_number < folder.length; file_number++) {
                let paddedHex = ("0000000000000000000000000000000000000000000000000000000000000000" + idCountCopy.toString(16)).slice("-64");
                idCountCopy = idCountCopy + 1;
                const file = folder[file_number]
                console.log(file.name);
                console.log(file.name.split(".")[0]);
                const metadata = {
                    name: (file.name).split(".")[0],
                    description: nftDetail.description,
                    image: path[file_number].path,
                };
                nftMetadataOptions.abi.push(
                    {
                        path: `metadata/${(nftDetail.name).split(" ").join("")}/${paddedHex}.json`,
                        content:
                            Buffer.from(JSON.stringify(metadata)).toString("base64"),
                    })
            }
            console.log(nftMetadataOptions);
            console.log("Uploading NFT Metadata to IPFS");

            const metadataurl = await Web3Api.storage.uploadFolder(nftMetadataOptions);
            console.log(metadataurl);

            let metadata_zero = metadataurl[0].path;
            let paddedHex = ("0000000000000000000000000000000000000000000000000000000000000000" + idCount.toString(16)).slice("-64");
            const standard_metadata = metadata_zero.replace(paddedHex, "{id}");
            console.log(standard_metadata);

            // https://ipfs.moralis.io:2053/ipfs/QmUojsV815qYV6YVgRNPjoCAG53azGed44SNc8hMyc4Y5s/metadata/NFT Magic/0000000000000000000000000000000000000000000000000000000000000000.json

            let contractOptions = {
                abi: CreateCollectionABI,
                contractAddress: CreateCollectionAddress,
                functionName: "createCollectionMint",
                params: {
                    numberOfNfts: folder.length,
                    metadataURL: standard_metadata,
                },
            };

            const response = await Moralis.executeFunction(contractOptions);
            console.log(response);

            alert(
                `NFT Collection Successfully Minted`
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
            <span className="create_heading heading2">Create your NFT Collection</span>

            <div className="create_upload_detail_div">
                <div className="uploadItem_div">
                    <label htmlFor="upload_input">
                        {!folder ? (
                            <div className="drag_drop_area">
                                <h2>Drag and drop your folder</h2>
                                <p>or Choose a folder</p>
                                <p>{uploaded}</p>
                                <p className="browseButton">Browse folder</p>
                            </div>
                        ) : (
                            <div className="drag_drop_area">
                                <h2>Folder : {uploaded} is Selected</h2>
                                <p>{uploaded}</p>
                            </div>
                        )}
                        <input
                            id="upload_input"
                            type="file"
                            onChange={(event) => {
                                onChangeFile(event);
                            }}
                            directory="" webkitdirectory=""

                        />
                    </label>
                </div>
                <div className="uploadItem_details_div">
                    <form className="itemUpload_form">
                        <label htmlFor="item_title">
                            Collection Title*</label>
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
                    </form>
                    <button className="createItem button2" onClick={handleCreate}>Create</button>
                </div>
            </div>
        </div>
    );
};

export default create;
