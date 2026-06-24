import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import MobileBottomNav from "./components/layout/MobileBottomNav";
import Home from "./pages/Home";
import PropertyDetails from "./pages/PropertyDetails";
import SearchResults from "./pages/SearchResults";
import Dashboard from "./pages/Dashboard";
import Destinations from "./pages/Destinations";
import PremiumStays from "./pages/PremiumStays";
import CompareResorts from "./pages/CompareResorts";
import Support from "./pages/Support";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import Blogs from "./pages/Blogs";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";

function AppContent() {
  const location = useLocation();
  const showFooter = location.pathname !== "/search";

  return (
    <div className="min-h-screen flex flex-col font-sans relative overflow-hidden bg-[#f4f7f5] pb-16 md:pb-0">
      {/* Decorative Light Effects */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#FF385C]/10 blur-[120px] rounded-full z-0 pointer-events-none"></div>
      <div className="absolute top-1/4 -right-24 w-96 h-96 bg-green-500/10 blur-[120px] rounded-full z-0 pointer-events-none"></div>
      
      <Navbar />
      <main className="flex-grow z-10 relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/premium-stays" element={<PremiumStays />} />
          <Route path="/compare" element={<CompareResorts />} />
          <Route path="/support" element={<Support />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/blogs" element={<Blogs />} />
        </Routes>
      </main>
      {showFooter && <Footer />}
      <MobileBottomNav />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          <ScrollToTop />
          <AppContent />
        </Router>
      </UserProvider>
    </AuthProvider>
  );
}
