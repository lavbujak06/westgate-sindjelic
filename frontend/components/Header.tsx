import Image from "next/image";
import Link from "next/link";
import AccountMenu from "./AccountMenu";

export const Header = () => {
  return (
    <header className="site-header">
      {/* Logo */}
      <div className="logo-container">
        <Link href="/">
          <Image
            src="/westgateLogo.png"
            alt="Westgate Sindjelic Logo"
            width={55}
            height={55}
            priority
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="header-nav">
        {/* News */}
        <Link className="nav-link" href="/pages/news">
          News
        </Link>

        {/* MEN */}
        <div className="dropdown">
          <button className="nav-button">Men ▼</button>
          <div className="dropdown-content">
            <Link href="/pages/men/seniors">Seniors</Link>
            <Link href="/pages/men/reserves">Reserves</Link>
          </div>
        </div>

        {/* WOMEN */}
        <div className="dropdown">
          <button className="nav-button">Women ▼</button>
          <div className="dropdown-content">
            <Link href="/pages/women/seniors">Seniors</Link>
            <Link href="/pages/women/reserves">Reserves</Link>
          </div>
        </div>

        {/* JUNIORS */}
        <Link className="nav-link" href="/pages/juniors">
          Juniors
        </Link>
      </nav>

      {/* Account */}
      <AccountMenu />
    </header>
  );
};

export default Header;