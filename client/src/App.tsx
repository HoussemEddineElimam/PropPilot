import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import OwnerLayout from "./components/layouts/OwnerLayout";
import OwnerClients from "./pages/OwnerClients";
import { OwnerProperties } from "./pages/OwnerProperties";
import OwnerDashboard from "./pages/OwnerDashboard";
import OwnerAnalytics from "./pages/OwnerAnalytics";
import OwnerFinancialManagment from "./pages/OwnerFinancialManagment";
import { useEffect, useState } from "react";
import ClientLayout from "./components/layouts/ClientLayout";
import LoadingScreen from "./components/LoadingScreen";
import AdminLayout from "./components/layouts/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminNotificationsPage from "./pages/AdminNotificationsPage";
import AdminUsersManagment from "./pages/AdminUsersManagment";
import AdminPropertyManagment from "./pages/AdminPropertyManagment";
import AdminSecurity from "./pages/AdminSecurity";
import AdminReports from "./pages/AdminReports";
import AdminTransactionsManagment from "./pages/AdminTransactionsManagment";
import MessagesPage from "./pages/MessagesPage";
import OwnerNotificationsPage from "./pages/OwnerNotificationsPage";
import ProfilePage from "./pages/ProfilePage";
import AuthenticationPage from "./pages/Authentication/AuthenticationPage";
import CheckoutPage from "./pages/CheckoutPage";
import HomePage from "./pages/HomePage";
import useClientMode from "./hooks/useClientMode";
import ClientProfile from "./pages/ClientProfile";
import WishlistPage from "./pages/WishlistPage";
import ClientDashboard from "./pages/ClientDashboard";
import useAuthStore from "./hooks/useAuthStore";
import { useTheme } from "./hooks/useTheme";
import PropertyPage from "./pages/PropertyPage";
function App() {
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const { isClientMode } = useClientMode();
  const {theme , toggleTheme} = useTheme()
  useEffect(() => {
    const timer = setTimeout(() => {
      if((!isAuthenticated || user?.role == "client" || isClientMode) && theme == "dark" ){
        toggleTheme()
    }
      setIsLoading(false);
    }, 500);
   
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated && 
    !["/auth", "/", "/wishlist"].includes(location.pathname) && 
    !location.pathname.match(/^\/property\/[^/]+$/)) {
    return <Navigate to="/auth" replace />;
  }
  if (isAuthenticated && ["/auth", "/"].includes(location.pathname) && !(isClientMode || user?.role == "client") ) {
    return <Navigate to="/dashboard" replace />;
  }
  if (isAuthenticated && ["/auth"].includes(location.pathname) && (isClientMode || user?.role == "client")   ) {
    return <Navigate to="/" replace />;
  }

  const getLayout = () => {
    if (!user) return <ClientLayout home/>;
    switch (user.role) {
      case "owner":
        return isClientMode? <ClientLayout home/> :<OwnerLayout />;
      case "admin":
        return isClientMode? <ClientLayout home /> :<AdminLayout />;
      default:
        return <ClientLayout />;
    }
  };

  return (
    <div className="app">
      <Routes>
        <Route path="/auth" element={<ClientLayout home />}>
          <Route index element={<AuthenticationPage />} />
        </Route>
        <Route path="/" element={<ClientLayout home />}>
          <Route index element={<HomePage />} />
          <Route path="property/:id" element={<PropertyPage />} />
          <Route path="profile" element={<ClientProfile />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
        </Route>

        <Route path="/dashboard" element={getLayout()}>
          {user?.role === "owner" && !isClientMode && (
            <>
              <Route index element={<OwnerDashboard />} />
              <Route path="clients" element={<OwnerClients />} />
              <Route path="properties" element={<OwnerProperties />} />
              <Route path="financials" element={<OwnerFinancialManagment />} />
              <Route path="analytics" element={<OwnerAnalytics />} />
              <Route path="notifications" element={<OwnerNotificationsPage />} />
              <Route path="profile" element={<ProfilePage role={user.role} />} />
              <Route path="messages" element={<MessagesPage />} />
            </>
          )}
          {(user?.role === "client" || isClientMode) && (
            <>
              <Route index element={<ClientDashboard />} />
              
            </>
          )}
          {user?.role === "admin" && !isClientMode && (
            <>
              <Route index element={<AdminDashboard />} />
              <Route path="profile" element={<ProfilePage role={user.role} />} />
              <Route path="users" element={<AdminUsersManagment />} />
              <Route path="properties" element={<AdminPropertyManagment />} />
              <Route path="payment" element={<AdminTransactionsManagment />} />
              <Route path="security" element={<AdminSecurity />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="notifications" element={<AdminNotificationsPage />} />
              <Route path="messages" element={<MessagesPage />} />
            </>
          )}
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
export default App;