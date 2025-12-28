import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function HomePage() {
  return (
    <div className="app-container">
      <Header />
      <main className="app-content">
        <h1>Hello, World!</h1>
      </main>
      <Footer />
    </div>
  );
}