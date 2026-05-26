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
              "organizer"

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

      

      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />

    </Routes>

  )

}

export default App