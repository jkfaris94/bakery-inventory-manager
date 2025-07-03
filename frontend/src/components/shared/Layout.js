import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function Layout() {
  return (
    <>
      <Header />
      
      <main style={{ padding: "2rem 1rem" }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default Layout;