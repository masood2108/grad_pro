import { Routes, Route, Navigate } from "react-router-dom"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"

import Dashboard from "./pages/Dashboard"

import Events from "./pages/Events"
import EventDetails from "./pages/EventDetails"

import Volunteers from "./pages/Volunteers"
import Sponsors from "./pages/Sponsors"
import Analytics from "./pages/Analytics"

import Certificates from "./pages/Certificates"
import Notifications from "./pages/Notifications"
import Settings from "./pages/Settings"

import QRTicketing from "./pages/QRTicketing"
import AttendanceScanner from "./pages/AttendanceScanner"
import CertificatePreview from "./pages/CertificatePreview"

import CloudinaryUpload from "./components/CloudinaryUpload"

import ProtectedRoute from "./context/ProtectedRoute"

function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute
            allowedRoles={[
              "admin",
              "organizer",
              "student"
            ]}
          >
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/events"
        element={
          <ProtectedRoute
            allowedRoles={[
              "admin",
              "organizer",
              "student"
            ]}
          >
            <Events />
          </ProtectedRoute>
        }
      />

      <Route
        path="/event/:id"
        element={
          <ProtectedRoute
            allowedRoles={[
              "admin",
              "organizer",
              "student"
            ]}
          >
            <EventDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/volunteers"
        element={
          <ProtectedRoute
            allowedRoles={[
              "admin",
              "organizer"
            ]}
          >
            <Volunteers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sponsors"
        element={
          <ProtectedRoute
            allowedRoles={[
              "admin",
              "organizer"
            ]}
          >
            <Sponsors />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute
            allowedRoles={[
              "admin",
              "organizer"
            ]}
          >
            <Analytics />
          </ProtectedRoute>
        }
      />

      <Route
        path="/qr-ticketing"
        element={
          <ProtectedRoute
            allowedRoles={[
              "admin",
              "organizer",
              "student"
            ]}
          >
            <QRTicketing />
          </ProtectedRoute>
        }
      />

      <Route
        path="/attendance-scanner"
        element={
          <ProtectedRoute
            allowedRoles={[
              "admin",
              "organizer"
            ]}
          >
            <AttendanceScanner />
          </ProtectedRoute>
        }
      />

      <Route
        path="/certificates"
        element={
          <ProtectedRoute
            allowedRoles={[
              "admin",
              "organizer",
              "student"
            ]}
          >
            <Certificates />
          </ProtectedRoute>
        }
      />

      <Route
        path="/certificate-preview"
        element={<CertificatePreview />}
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute
            allowedRoles={[
              "admin",
              "organizer",
              "student"
            ]}
          >
            <Notifications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute
            allowedRoles={[
              "admin",
              "organizer",
              "student"
            ]}
          >
            <Settings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/upload"
        element={
          <ProtectedRoute
            allowedRoles={[
              "admin",
              "organizer"
            ]}
          >
            <CloudinaryUpload />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />

    </Routes>
  )
}

export default App