import { ConnectButton } from 'web3uikit';
import Link from "next/link";
// import styles from "../styles/Header.module.css"
export default function Header() {
    return (
        // <div className={styles.container}>
        <div className="fc_header">
            <div className="fc_header_logo">
                <a href="#">
                    <img className="header_img" src="/logo.jpg" alt="LOGO" />
                </a>
            </div>

            <div className="fc_header_menu showMenu">
                <div className="fc_header_menu_item topBotomBordersOut">
                    <a href="#">Home</a>
                    <a href="#">Marketplace</a>
                    <a href="#">Explore</a>
                    <a href="#">Purchase</a>
                    <a href="#">Dashboard</a>
                    <a href="#">Create NFT</a>
                </div>
            </div>
            <ConnectButton moralisAuth={false} />
        </div>
        // </div>
    );
};

