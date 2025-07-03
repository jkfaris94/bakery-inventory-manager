import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <Outlet />
      <main style={{ padding: "2rem 1rem" }}>{children}</main>
      <Footer />
    </>
  );
}