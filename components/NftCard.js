import React from 'react'
import Image from "next/image"
import NatureNFT from "../public/NFTNature.jpg"
import EthIcon from "../public/ethIcon.png"
import { AiFillClockCircle } from 'react-icons/ai'
import { FaEthereum } from 'react-icons/fa'

const NftCard = () => {
    return (
        <div className='card_main_div'>

            <div className="card">
                <p className='ownedBy'>Owned by : 0x4531346354......32645415</p>
                <div className="thumbnail">
                    <Image src={NatureNFT} layout="responsive" />

                </div>
                <div className="card-body">
                    <h1>Colorful Abstract Painting </h1>
                    <div className='card_body_div'>
                        <div className="time">
                            <div className="type">
                                <p>#3429</p>
                            </div>
                        </div>
                        <div className="details">
                            <div className="type">
                                {/* <p>Price :</p> */}
                                <FaEthereum className='icon' />
                                <p className='Nftprice'>0.041 ETH</p>
                            </div>

                        </div>
                    </div>
                    <div className="creator">
                        <button className='placebid button2'> Buy NFT</button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default NftCard