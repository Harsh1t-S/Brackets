import { Outlet } from "react-router-dom";

import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      {/* Keyboard users can jump past the nav straight to page content. */}
      <a
        href="#main"
        className="sr-only rounded-lg bg-brand px-4 py-2 text-sm font-medium text-on-brand focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100]"
      >
        Skip to content
      </a>

      <Navbar />

      <main id="main" className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
