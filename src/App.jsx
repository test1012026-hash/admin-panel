import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./lib/auth.jsx";
import Layout from "./components/Layout.jsx";
import PublicLayout from "./components/PublicLayout.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Onboarding from "./pages/Onboarding.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Invitations from "./pages/Invitations.jsx";
import Settings from "./pages/Settings.jsx";
import Activity from "./pages/Activity.jsx";
import AcceptInvite from "./pages/AcceptInvite.jsx";
import Profile from "./pages/Profile.jsx";
import Subscribers from "./pages/Subscribers.jsx";
import Groups from "./pages/Groups.jsx";
import Resellers from "./pages/Resellers.jsx";
import MarketingHome from "./pages/marketing/Home.jsx";
import MarketingTerms from "./pages/marketing/Terms.jsx";
import MarketingSecurity from "./pages/marketing/Security.jsx";
import MarketingSolutions from "./pages/marketing/Solutions.jsx";
import MarketingPricing from "./pages/marketing/Pricing.jsx";

function PrivateRoute({ children }) {
  const { isAuthenticated, bootstrapping, user } = useAuth();
  if (bootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-ink-500">
        Loading…
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.needsOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }
  return children;
}

function SuperAdminOnly({ children }) {
  const { user } = useAuth();
  if (user?.role !== "super_admin") {
    return (
      <Navigate
        to={user?.role === "subscriber" ? "/profile" : "/dashboard"}
        replace
      />
    );
  }
  return children;
}

/** Subscribers may only use Profile; all other console tabs redirect. */
function StaffOnly({ children }) {
  const { user } = useAuth();
  if (user?.role === "subscriber") {
    return <Navigate to="/profile" replace />;
  }
  return children;
}

function homeForUser(user) {
  if (!user) return "/";
  if (user.needsOnboarding) return "/onboarding";
  if (user.role === "subscriber") return "/profile";
  return "/dashboard";
}

function PublicHome() {
  const { isAuthenticated, bootstrapping, user } = useAuth();
  if (bootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-ink-500">
        Loading…
      </div>
    );
  }
  if (isAuthenticated) {
    return <Navigate to={homeForUser(user)} replace />;
  }
  return <MarketingHome />;
}

export { homeForUser };

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<PublicHome />} />
        <Route path="/overview" element={<Navigate to="/" replace />} />
        <Route path="/solutions" element={<MarketingSolutions />} />
        <Route path="/security" element={<MarketingSecurity />} />
        <Route path="/pricing" element={<MarketingPricing />} />
        <Route path="/terms" element={<MarketingTerms />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/accept-invite" element={<AcceptInvite />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route
          path="/dashboard"
          element={
            <StaffOnly>
              <Dashboard />
            </StaffOnly>
          }
        />
        <Route
          path="/subscribers"
          element={
            <StaffOnly>
              <Subscribers />
            </StaffOnly>
          }
        />
        <Route
          path="/resellers"
          element={
            <SuperAdminOnly>
              <Resellers />
            </SuperAdminOnly>
          }
        />
        <Route
          path="/groups"
          element={
            <StaffOnly>
              <Groups />
            </StaffOnly>
          }
        />
        <Route
          path="/invitations"
          element={
            <StaffOnly>
              <Invitations />
            </StaffOnly>
          }
        />
        <Route
          path="/activity"
          element={
            <StaffOnly>
              <Activity />
            </StaffOnly>
          }
        />
        <Route
          path="/settings"
          element={
            <SuperAdminOnly>
              <Settings />
            </SuperAdminOnly>
          }
        />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
