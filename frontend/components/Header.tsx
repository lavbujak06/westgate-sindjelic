import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="site-header">
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

      <nav className="header-nav">
        <Link href="/mens">Men</Link>
        <Link href="/women">Women</Link>
        <Link href="/juniors">Juniors</Link>
      </nav>
    </header>
  );
};