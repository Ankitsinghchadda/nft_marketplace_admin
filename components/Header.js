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
                    <Link href="/">Home</Link>
                    <Link href="/marketplace">Marketplace</Link>
                    <Link href="/auction">Auction</Link>
                    <Link href="/profile">Profile</Link>
                    {/* <Link href="/startAuction">Start Auction</Link> */}
                    <Link href="/create">Create NFT</Link>
                    {/* <Link href="/createCollection">Create NFT Collection</Link> */}
                </div>
            </div>
            <ConnectButton moralisAuth={false} />
        </div>
        // </div>
    );
};

