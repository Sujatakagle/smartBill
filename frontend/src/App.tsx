import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { useContext } from "react";
import type { ReactNode } from "react";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Upload from "./pages/Upload";
import History from "./pages/History";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const authContext = useContext(AuthContext);

  if (!authContext || authContext.loading) {
    return null;
  }

  return authContext.token ? children : <Navigate to="/Expenzoir/signin" replace />;
}

function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const authContext = useContext(AuthContext);

  if (!authContext || authContext.loading) {
    return null;
  }

  return authContext.token ? <Navigate to="/Expenzoir/" replace /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
<<<<<<< HEAD
          {/* Vercel root routes */}
          <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<Home />} />
            <Route path="upload" element={<Upload />} />
            <Route path="history" element={<History />} />
            <Route path="profile" element={<UserProfiles />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="blank" element={<Blank />} />
            <Route path="form-elements" element={<FormElements />} />
            <Route path="basic-tables" element={<BasicTables />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="avatars" element={<Avatars />} />
            <Route path="badge" element={<Badges />} />
            <Route path="buttons" element={<Buttons />} />
            <Route path="images" element={<Images />} />
            <Route path="videos" element={<Videos />} />
            <Route path="line-chart" element={<LineChart />} />
            <Route path="bar-chart" element={<BarChart />} />
          </Route>

=======
>>>>>>> 3c63753f807681cadcf3218491ef96754b0a5fb3
          {/* Dashboard Layout */}
          <Route path="/Expenzoir/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<Home />} />
            <Route path="upload" element={<Upload />} />
            <Route path="history" element={<History />} />

            {/* Others Page */}
            <Route path="profile" element={<UserProfiles />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="blank" element={<Blank />} />

            {/* Forms */}
            <Route path="form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="alerts" element={<Alerts />} />
            <Route path="avatars" element={<Avatars />} />
            <Route path="badge" element={<Badges />} />
            <Route path="buttons" element={<Buttons />} />
            <Route path="images" element={<Images />} />
            <Route path="videos" element={<Videos />} />

            {/* Charts */}
            <Route path="line-chart" element={<LineChart />} />
            <Route path="bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
<<<<<<< HEAD
          <Route path="/signin" element={<PublicOnlyRoute><SignIn /></PublicOnlyRoute>} />
          <Route path="/signup" element={<PublicOnlyRoute><SignUp /></PublicOnlyRoute>} />
=======
>>>>>>> 3c63753f807681cadcf3218491ef96754b0a5fb3
          <Route path="/Expenzoir/signin" element={<PublicOnlyRoute><SignIn /></PublicOnlyRoute>} />
          <Route path="/Expenzoir/signup" element={<PublicOnlyRoute><SignUp /></PublicOnlyRoute>} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
