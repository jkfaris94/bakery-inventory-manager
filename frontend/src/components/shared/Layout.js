import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main style={{ padding: "2rem 1rem" }}>{children}</main>
      <Footer />
    </>
  );
}