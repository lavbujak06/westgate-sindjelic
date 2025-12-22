import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="site-header">
      <div className="header-left">
        <div className="logo-container">
          <Link href="/">
            <Image
              src="/westgateLogo.png"
              alt="Westgate Sindjelic Logo"
              width={50}
              height={50}
              priority
            />
          </Link>
        </div>
      </div>

      <nav className="header-nav">
        <Link href="/men">Men</Link>
        <Link href="/women">Women</Link>
        <Link href="/juniors">Juniors</Link>
      </nav>
    </header>
  );
};
