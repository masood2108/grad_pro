import { Routes, Route, Navigate } from "react-router-dom"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import FeeManagement from "./pages/FeeManagement"
import Dashboard from "./pages/Dashboard"
import Notifications from "./pages/Notifications"
import Courses from "./pages/Courses"
import CoursePlayer from "./pages/CoursePlayer"
import AttendanceScanner from "./pages/AttendanceScanner"
import Assignments from "./pages/Assignments"
import AssignmentSubmissions from "./pages/AssignmentSubmissions"
import CertificatePreview from "./pages/CertificatePreview"
import StudentProgress from "./pages/StudentProgress"
import OnlineClasses from "./pages/OnlineClasses"
import Attendance from "./pages/Attendance"
import StudentAttendance from "./pages/StudentAttendance"
import ManageAttendance from "./pages/ManageAttendance"

import Events from "./pages/Events"
import EventDetails from "./pages/EventDetails"

import Volunteers from "./pages/Volunteers"
import Sponsors from "./pages/Sponsors"
import Analytics from "./pages/Analytics"

import Certificates from "./pages/Certificates"
import Settings from "./pages/Settings"

import QRTicketing from "./pages/QRTicketing"

import CloudinaryUpload from "./components/CloudinaryUpload"

import ProtectedRoute from "./context/ProtectedRoute"

function App() {

  return (

    <Routes>

      {/* ================================================= */}
      {/* PUBLIC ROUTES */}
      {/* ================================================= */}

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
  path="/event/:id"
  element={<EventDetails />}
/>
<Route
  path="/attendance-scanner"
  element={<AttendanceScanner />}
/>
<Route
  path="/certificate-preview"
  element={<CertificatePreview />}
/>
<Route
  path="/notifications"
  element={<Notifications />}
/>
<Route
path="/online-classes"
element={<OnlineClasses />}
/>
<Route

  path="/fees"

  element={

    <ProtectedRoute

      allowedRoles={[

        "admin",
        "faculty",
        "student",
        "parent"

      ]}

    >

      <FeeManagement />

    </ProtectedRoute>

  }

/>
      {/* ================================================= */}
      {/* DASHBOARD */}
      {/* ================================================= */}

      <Route

        path="/dashboard"

        element={

          <ProtectedRoute

            allowedRoles={[

              "admin",
              "faculty",
              "student",
              "parent",
              "organizer"

            ]}

          >

            <Dashboard />

          </ProtectedRoute>

        }

      />

      {/* ================================================= */}
      {/* COURSES */}
      {/* ================================================= */}

      <Route

        path="/courses"

        element={

          <ProtectedRoute

            allowedRoles={[

              "admin",
              "faculty",
              "student",
              "parent"

            ]}

          >

            <Courses />

          </ProtectedRoute>

        }

      />

      {/* ================================================= */}
      {/* COURSE PLAYER */}
      {/* ================================================= */}

      <Route

        path="/course/:id"

        element={

          <ProtectedRoute

            allowedRoles={[

              "admin",
              "faculty",
              "student",
              "parent"

            ]}

          >

            <CoursePlayer />

          </ProtectedRoute>

        }

      />

      {/* ================================================= */}
      {/* ASSIGNMENTS */}
      {/* ================================================= */}

      <Route

        path="/assignments"

        element={

          <ProtectedRoute

            allowedRoles={[

              "admin",
              "faculty",
              "student"

            ]}

          >

            <Assignments />

          </ProtectedRoute>

        }

      />

      {/* ================================================= */}
      {/* ASSIGNMENT SUBMISSIONS */}
      {/* ================================================= */}

      <Route

        path="/assignment/:id"

        element={

          <ProtectedRoute

            allowedRoles={[

              "admin",
              "faculty"

            ]}

          >

            <AssignmentSubmissions />

          </ProtectedRoute>

        }

      />

      {/* ================================================= */}
      {/* STUDENT PROGRESS */}
      {/* ================================================= */}

      <Route

        path="/progress"

        element={

          <ProtectedRoute

            allowedRoles={[

              "admin",
              "faculty",
              "student",
              "parent"

            ]}

          >

            <StudentProgress />

          </ProtectedRoute>

        }

      />

      {/* ================================================= */}
      {/* FACULTY / ADMIN ATTENDANCE */}
      {/* ================================================= */}

      <Route

        path="/attendance"

        element={

          <ProtectedRoute

            allowedRoles={[

              "admin",
              "faculty"

            ]}

          >

            <Attendance />

          </ProtectedRoute>

        }

      />

      {/* ================================================= */}
      {/* STUDENT ATTENDANCE */}
      {/* ================================================= */}

      <Route

        path="/my-attendance"

        element={

          <ProtectedRoute

            allowedRoles={[

              "student",
              "parent"

            ]}

          >

            <StudentAttendance />

          </ProtectedRoute>

        }

      />

      {/* ================================================= */}
      {/* MANAGE ATTENDANCE */}
      {/* ================================================= */}

      <Route

        path="/manage-attendance"

        element={

          <ProtectedRoute

            allowedRoles={[

              "admin",
              "faculty"

            ]}

          >

            <ManageAttendance />

          </ProtectedRoute>

        }

      />

      {/* ================================================= */}
      {/* EVENTS */}
      {/* ================================================= */}

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

      {/* ================================================= */}
      {/* EVENT DETAILS */}
      {/* ================================================= */}

      <Route

        path="/event/:id"

        element={

          <ProtectedRoute

            allowedRoles={[

              "admin",
              "organizer"

            ]}

          >

            <EventDetails />

          </ProtectedRoute>

        }

      />

      {/* ================================================= */}
      {/* VOLUNTEERS */}
      {/* ================================================= */}

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

      {/* ================================================= */}
      {/* SPONSORS */}
      {/* ================================================= */}

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

      {/* ================================================= */}
      {/* ANALYTICS */}
      {/* ================================================= */}

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

      {/* ================================================= */}
      {/* CERTIFICATES */}
      {/* ================================================= */}

      <Route

        path="/certificates"

        element={

          <ProtectedRoute

            allowedRoles={[

              "admin",
              "faculty",
              "student",
              "parent"

            ]}

          >

            <Certificates />

          </ProtectedRoute>

        }

      />

      {/* ================================================= */}
      {/* SETTINGS */}
      {/* ================================================= */}

      <Route

        path="/settings"

        element={

          <ProtectedRoute

            allowedRoles={[

              "admin",
              "faculty",
              "student",
              "parent",
              "organizer"

            ]}

          >

            <Settings />

          </ProtectedRoute>

        }

      />

      {/* ================================================= */}
      {/* QR TICKETING */}
      {/* ================================================= */}

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

      {/* ================================================= */}
      {/* CLOUDINARY */}
      {/* ================================================= */}

      <Route

        path="/upload"

        element={

          <ProtectedRoute

            allowedRoles={[

              "admin",
              "faculty",
              "organizer"

            ]}

          >

            <CloudinaryUpload />

          </ProtectedRoute>

        }

      />

      {/* ================================================= */}
      {/* FALLBACK */}
      {/* ================================================= */}

      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />

    </Routes>

  )

}

export default App