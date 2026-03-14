import { BrowserRouter, Navigate, Route, Routes, Link, useLocation } from "react-router-dom";
import { ProviderPage } from "../pages/ProviderPage";
import { ProductPage } from "../pages/ProductPage";

const Navigation = () => {
  const location = useLocation();

  return (
    <div className="navbar bg-base-100 shadow-sm border-b border-base-200">
      <div className="container mx-auto px-4">
        <div className="flex-1">
          <span className="text-xl font-bold text-primary">TestCommunity CRUD</span>
        </div>
        <div className="join">
          <Link
            to="/products"
            className={`join-item btn btn-sm ${location.pathname.startsWith("/products") ? "btn-primary" : "btn-ghost"}`}
          >
            Products
          </Link>
          <Link
            to="/providers"
            className={`join-item btn btn-sm ${location.pathname.startsWith("/providers") ? "btn-primary" : "btn-ghost"}`}
          >
            Providers
          </Link>
        </div>
      </div>
    </div>
  );
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/providers" element={<ProviderPage />} />
      </Routes>
    </BrowserRouter>
  );
};
