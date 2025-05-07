import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import DatasetUpload from "./pages/Datasetupload";
import Datasets from "./pages/Datasets";
import DatasetDetail from "./pages/DatasetDetail";
import ForgotPassword from "./pages/forgot-password";
import ResetPassword from "./pages/Reset-password"; // Make sure this import is correct
import { Outlet } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./pages/ProtectedRoute";
import UserDatasets from "./pages/UserDatasets";
import PurchasedDatasets from "./pages/PurchasedDatasets";

// DashboardLayout component that wraps the Dashboard and renders child routes
function DashboardLayout() {
  return (
    <Dashboard>
      <Outlet /> {/* Child components will render here */}
    </Dashboard>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Admin Route */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Protected User Routes */}
        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route path="/dashboard/*" element={<DashboardLayout />}>
            <Route index element={<Navigate to="datasets" replace />} />{" "}
            {/* 👈 ADD THIS LINE */}
            <Route path="upload" element={<DatasetUpload />} />
            <Route path="datasets" element={<Datasets />} />
            <Route path="datasets/:id" element={<DatasetDetail />} />
            <Route path="my-datasets" element={<UserDatasets />} />
            <Route path="purchased" element={<PurchasedDatasets />} /> 
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
