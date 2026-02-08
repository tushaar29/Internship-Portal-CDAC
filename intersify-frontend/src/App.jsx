import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import StudentApplications from "./pages/student/StudentApplications";
import './app.css'

// Public
import Home from "./pages/public/Home";
import Internships from "./pages/public/Internships";
import InternshipDetail from "./pages/public/InternshipDetail";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Dashboards
import StudentDashboard from "./pages/student/StudentDashboard";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";


import Unauthorized from "./pages/Unauthorized";
import CompanyProfile from "./pages/company/CompanyProfile";
import Navbar from "./components/Navbar";
import CreateInternship from "./pages/company/CreateInternship";
import CompanyInternships from "./pages/company/CompanyInternships";
import AdminCompanies from "./pages/admin/AdminCompanies";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminCompanyDetails from "./pages/admin/AdminCompanyDetails";
import EditInternship from "./pages/company/EditInternship";
import InternshipApplicants from "./pages/company/InternshipApplicants";
import ApplicationDetails from "./pages/company/ApplicationDetails";
import StudentProfile from "./pages/student/StudentProfile";
import StudentCertificates from "./pages/student/StudentCertificates";
import OAuthSuccess from "./pages/auth/OAuthSuccess";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/internships" element={<Internships />} />
          <Route path="/internships/:id" element={<InternshipDetail />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Student */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={["STUDENT"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/applications"
            element={
              <ProtectedRoute allowedRoles={["STUDENT"]}>
                <StudentApplications />
              </ProtectedRoute>
            }
          />

          {/* Student Routes */}
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute allowedRoles={["STUDENT"]}>
                <StudentProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/certificates"
            element={
              <ProtectedRoute allowedRoles={["STUDENT"]}>
                <StudentCertificates />
              </ProtectedRoute>
            }
          />

          {/* Company */}
          <Route
            path="/company/dashboard"
            element={
              <ProtectedRoute allowedRoles={["COMPANY"]}>
                <CompanyDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/company/profile"
            element={
              <ProtectedRoute allowedRoles={["COMPANY"]}>
                <CompanyProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/company/internships"
            element={
              <ProtectedRoute allowedRoles={["COMPANY"]}>
                <CompanyInternships />
              </ProtectedRoute>
            }
          />

          <Route
            path="/company/internships/new"
            element={
              <ProtectedRoute allowedRoles={["COMPANY"]}>
                <CreateInternship />
              </ProtectedRoute>
            }
          />

          <Route
            path="/company/applications/:applicationId"
            element={
              <ProtectedRoute allowedRoles={["COMPANY"]}>
                <ApplicationDetails />
              </ProtectedRoute>
            }
          />

          {/* Company Routes */}
          <Route path="/company/internships" element={<ProtectedRoute allowedRoles={["COMPANY"]}><CompanyInternships /></ProtectedRoute>} />
          <Route path="/company/internships/new" element={<ProtectedRoute allowedRoles={["COMPANY"]}><CreateInternship /></ProtectedRoute>} />
          <Route path="/company/internships/:id/edit" element={<ProtectedRoute allowedRoles={["COMPANY"]}><EditInternship /></ProtectedRoute>} />
          <Route path="/company/internships/:id/applications" element={<ProtectedRoute allowedRoles={["COMPANY"]}><InternshipApplicants /></ProtectedRoute>} />

          {/* Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/companies"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminCompanies />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/company/:id"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminCompanyDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/students"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminStudents />
              </ProtectedRoute>
            }
          />

          <Route path="/oauth-success" element={<OAuthSuccess />} />

          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
