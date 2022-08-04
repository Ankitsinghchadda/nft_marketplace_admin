const Moralis = require("moralis/node")
require("dotenv").config()
const contractAddresses = require("./constants/networkMapping.json")

let chainId = process.env.chainId || 31337
const moralisChainId = chainId == "31337" ? "1337" : chainId

// NFT Marketplace Contract Address
const marketplaceContractAddressArray = contractAddresses[chainId]["NftMarketplace"]
const marketplaceContractAddress = marketplaceContractAddressArray[marketplaceContractAddressArray.length - 1]
// Infinity NFT Contract Address
const infinityNFTContractAddressArray = contractAddresses[chainId]["InfinityNFT"]
const infinityNFTContractAddress = infinityNFTContractAddressArray[infinityNFTContractAddressArray.length - 1]

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
const appId = process.env.NEXT_PUBLIC_APP_ID
const masterKey = process.env.NEXT_PUBLIC_MASTER_KEY

async function main() {
    await Moralis.start({ serverUrl, appId, masterKey })

    console.log(`Working with contrat address ${marketplaceContractAddress}`)
    console.log(`Working with contrat address ${infinityNFTContractAddress}`)

    let itemListedOptions = {
        // Moralis understands a local chain is 1337
        chainId: moralisChainId,
        sync_historical: true,
        topic: "ItemListed(address,address,uint256,uint256)",
        address: marketplaceContractAddress,
        abi: {
            "type": "event",
            "anonymous": false,
            "name": "ItemListed",
            "inputs": [
                { "type": "address", "name": "seller", "indexed": true },
                { "type": "address", "name": "nftAddress", "indexed": true },
                { "type": "uint256", "name": "tokenId", "indexed": true },
                { "type": "uint256", "name": "price", "indexed": false }
            ]
        },
        tableName: "ItemListed",
    }
    let itemBoughtOptions = {
        chainId: moralisChainId,
        address: marketplaceContractAddress,
        sync_historical: true,
        topic: "ItemBought(address,address,uint256,uint256)",
        abi:
        {
            "type": "event",
            "anonymous": false,
            "name": "ItemBought",
            "inputs": [
                { "type": "address", "name": "buyer", "indexed": true },
                { "type": "address", "name": "nftAddress", "indexed": true },
                { "type": "uint256", "name": "tokenId", "indexed": true },
                { "type": "uint256", "name": "price", "indexed": false }
            ]
        },
        tableName: "ItemBought",
    }
    let itemCanceledOptions = {
        chainId: moralisChainId,
        address: marketplaceContractAddress,
        topic: "ItemCanceled(address,address,uint256)",
        sync_historical: true,
        abi: {
            "type": "event",
            "anonymous": false,
            "name": "ItemCanceled",
            "inputs": [
                { "type": "address", "name": "seller", "indexed": true },
                { "type": "address", "name": "nftAddress", "indexed": true },
                { "type": "uint256", "name": "tokenId", "indexed": true }
            ]
        },
        tableName: "ItemCanceled",
    }
    let itemAuctionCreatedOption = {
        chainId: moralisChainId,
        address: marketplaceContractAddress,
        topic: "AuctionCreated(uint256,address,uint256,uint256)",
        sync_historical: true,
        abi: {
            "type": "event",
            "anonymous": false,
            "name": "AuctionCreated",
            "inputs": [
                { "type": "uint256", "name": "endTime", "indexed": true },
                { "type": "address", "name": "nftAddress", "indexed": true },
                { "type": "uint256", "name": "tokenId", "indexed": true },
                { "type": "uint256", "name": "reservedPrice", "indexed": false }
            ]
        },
        tableName: "AuctionCreated",
    }
    let itemAuctionBiddedOption = {
        chainId: moralisChainId,
        address: marketplaceContractAddress,
        topic: "AuctionBiddedSuccessfully(address,uint256, address, uint256)",
        sync_historical: true,
        abi: {
            "type": "event",
            "anonymous": false,
            "name": "AuctionBiddedSuccessfully",
            "inputs": [
                { "type": "address", "name": "nftAddress", "indexed": true },
                { "type": "uint256", "name": "tokenId", "indexed": true },
                { "type": "address", "name": "bidder", "indexed": true },
                { "type": "uint256", "name": "bid", "indexed": false }
            ]
        },
        tableName: "AuctionBiddedSuccessfully",
    }
    let itemAuctionEndedSuccessfullyOption = {
        chainId: moralisChainId,
        address: marketplaceContractAddress,
        topic: "AuctionEndedSuccessfully(address,uint256,address, uint256)",
        sync_historical: true,
        abi: {
            "type": "event",
            "anonymous": false,
            "name": "AuctionEndedSuccessfully",
            "inputs": [
                { "type": "address", "name": "nftAddress", "indexed": true },
                { "type": "uint256", "name": "tokenId", "indexed": true },
                { "type": "address", "name": "bidder", "indexed": true },
                { "type": "uint256", "name": "bid", "indexed": false }
            ]
        },
        tableName: "AuctionEndedSuccessfully",
    }
    let itemAuctionEnded_Un_SuccessfullyOption = {
        chainId: moralisChainId,
        address: marketplaceContractAddress,
        topic: "AuctionEndedUnSuccessfully(address,uint256)",
        sync_historical: true,
        abi: {
            "type": "event",
            "anonymous": false,
            "name": "AuctionEndedUnSuccessfully",
            "inputs": [
                { "type": "address", "name": "nftAddress", "indexed": true },
                { "type": "uint256", "name": "tokenId", "indexed": true }
            ]
        },
        tableName: "AuctionEndedUnSuccessfully",
    }
    let NFTMinted = {
        chainId: moralisChainId,
        address: infinityNFTContractAddress,
        topic: "NFTMinted(address,uint256,string)",
        sync_historical: true,
        abi: {
            "type": "event",
            "anonymous": false,
            "name": "NFTMinted",
            "inputs": [
                { "type": "address", "name": "owner", "indexed": true },
                { "type": "uint256", "name": "tokenId", "indexed": true },
                { "type": "string", "name": "uri", "indexed": true }
            ]
        },
        tableName: "NFTMinted",
    }

    const listedResponse = await Moralis.Cloud.run("watchContractEvent", itemListedOptions, {
        useMasterKey: true,
    })
    const boughtResponse = await Moralis.Cloud.run("watchContractEvent", itemBoughtOptions, {
        useMasterKey: true,
    })
    const canceledResponse = await Moralis.Cloud.run("watchContractEvent", itemCanceledOptions, {
        useMasterKey: true,
    })

    const auctionCreatedResponse = await Moralis.Cloud.run("watchContractEvent", itemAuctionCreatedOption, {
        useMasterKey: true,
    })

    const auctionBiddedResponse = await Moralis.Cloud.run("watchContractEvent", itemAuctionBiddedOption, {
        useMasterKey: true,
    })

    const auctionEndedSuccessfullyResponse = await Moralis.Cloud.run("watchContractEvent", itemAuctionEndedSuccessfullyOption, {
        useMasterKey: true,
    })

    const auctionEndedUnSuccessfullyResponse = await Moralis.Cloud.run("watchContractEvent", itemAuctionEnded_Un_SuccessfullyOption, {
        useMasterKey: true,
    })

    const nftMintedResponse = await Moralis.Cloud.run("watchContractEvent", NFTMinted, {
        useMasterKey: true,
    })


    if (listedResponse.success && canceledResponse.success && boughtResponse.success && auctionCreatedResponse.success && auctionBiddedResponse.success && auctionEndedSuccessfullyResponse.success && auctionEndedUnSuccessfullyResponse.success && nftMintedResponse.success) {
        console.log("Success! Database Updated with watching events")
    } else {
        console.log("Something went wrong...")
    }

}

main().then(() => process.exit(0)).catch((error) => {
    console.error(error)
    process.exit(1)
})