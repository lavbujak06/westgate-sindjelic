import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-left">
        <div className="footer-logo">
          <Image
            src="/westgateLogo.png"
            alt="Westgate Sindjelic Logo"
            width={50}
            height={50}
          />
        </div>
        <p>© 2025 Westgate Sindjelic. All rights reserved.</p>
      </div>

      <div className="footer-nav">
        <Link href="/men">Men</Link>
        <Link href="/women">Women</Link>
        <Link href="/juniors">Juniors</Link>
      </div>
    </footer>
  );
};
