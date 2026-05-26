import {
  FaHome,
  FaCalendarAlt,
  FaUsers,
  FaHandshake,
  FaChartPie,
  FaCertificate,
  FaCog,
  FaSignOutAlt,
  FaChevronRight,
  FaBolt,
  FaBook,
  FaChartLine,
  FaChalkboardTeacher,
  FaBell,
  FaUserGraduate,
  FaUserFriends,
  FaTasks,
  FaClipboardCheck,
  FaUserCheck,
  FaLayerGroup,
  FaQrcode,
  FaUserTie
} from "react-icons/fa"

import {
  useNavigate,
  useLocation
} from "react-router-dom"

import {
  signOut,
  onAuthStateChanged
} from "firebase/auth"

import {
  auth,
  db
} from "../firebase/firebase"

import {
  collection,
  onSnapshot,
  doc,
  getDoc
} from "firebase/firestore"

import {
  useEffect,
  useState
} from "react"

import {
  motion
} from "framer-motion"

function Sidebar() {

  const navigate =
  useNavigate()

  const location =
  useLocation()

  const [eventsCount, setEventsCount] =
  useState(0)

  const [volunteersCount, setVolunteersCount] =
  useState(0)

  const [sponsorsCount, setSponsorsCount] =
  useState(0)

  const [coursesCount, setCoursesCount] =
  useState(0)

  const [userName, setUserName] =
  useState("User")

  const [userRole, setUserRole] =
  useState("student")

  useEffect(() => {

    const unsubEvents =

    onSnapshot(

      collection(db, "events"),

      (snapshot) => {

        setEventsCount(snapshot.size)

      }

    )

    const unsubCourses =

    onSnapshot(

      collection(db, "courses"),

      (snapshot) => {

        setCoursesCount(snapshot.size)

      }

    )

    const unsubVolunteers =

    onSnapshot(

      collection(db, "volunteers"),

      (snapshot) => {

        setVolunteersCount(snapshot.size)

      }

    )

    const unsubSponsors =

    onSnapshot(

      collection(db, "sponsors"),

      (snapshot) => {

        setSponsorsCount(snapshot.size)

      }

    )

    const unsubscribeAuth =

    onAuthStateChanged(

      auth,

      async(user) => {

        if(user){

          try{

            const userRef =

            doc(
              db,
              "users",
              user.uid
            )

            const userSnap =

            await getDoc(userRef)

            if(userSnap.exists()){

              const data =
              userSnap.data()

              setUserName(

                data.name ||

                user.email
                ?.split("@")[0]

              )

              setUserRole(

                data.role ||

                "student"

              )

            }

          }

          catch(error){

            console.log(error)

          }

        }

      }

    )

    return () => {

      unsubEvents()
      unsubVolunteers()
      unsubSponsors()
      unsubCourses()
      unsubscribeAuth()

    }

  }, [])

  let navItems = []

  /* ========================= */
  /* ADMIN */
  /* ========================= */

  if(userRole === "admin"){

    navItems = [

      {
        title:"Dashboard",
        icon:<FaHome />,
        path:"/dashboard",
        sub:"Admin control"
      },

      {
        title:"Courses",
        icon:<FaBook />,
        path:"/courses",
        sub:`${coursesCount} courses`
      },

      {
        title:"Assignments",
        icon:<FaTasks />,
        path:"/assignments",
        sub:"Manage tasks"
      },

      {
        title:"Progress",
        icon:<FaChartLine />,
        path:"/progress",
        sub:"Realtime analytics"
      },

      {
        title:"Attendance",
        icon:<FaClipboardCheck />,
        path:"/attendance",
        sub:"Track records"
      },

      {
        title:"Manage Attendance",
        icon:<FaUserCheck />,
        path:"/manage-attendance",
        sub:"Faculty controls"
      },

      {
        title:"Certificates",
        icon:<FaCertificate />,
        path:"/certificates",
        sub:"Issue certificates"
      },

      {
        title:"Events",
        icon:<FaCalendarAlt />,
        path:"/events",
        sub:`${eventsCount} events`
      },

      {
        title:"Volunteers",
        icon:<FaUserTie />,
        path:"/volunteers",
        sub:`${volunteersCount} volunteers`
      },

      {
        title:"Sponsors",
        icon:<FaHandshake />,
        path:"/sponsors",
        sub:`${sponsorsCount} sponsors`
      },

      {
        title:"Analytics",
        icon:<FaChartPie />,
        path:"/analytics",
        sub:"Platform insights"
      },

      {
        title:"QR Ticketing",
        icon:<FaQrcode />,
        path:"/qr-ticketing",
        sub:"Event access"
      },
        {
  title:"Attendance Scanner",
  icon:<FaQrcode />,
  path:"/attendance-scanner",
  sub:"Scan event QR"
},
{
  title:"Notifications",
  icon:<FaBell />,
  path:"/notifications",
  sub:"Realtime alerts"
},
      {
        title:"Settings",
        icon:<FaCog />,
        path:"/settings",
        sub:"Platform settings"
      }

    ]

  }

  /* ========================= */
  /* FACULTY */
  /* ========================= */

  else if(userRole === "faculty"){

    navItems = [

      {
        title:"Dashboard",
        icon:<FaChalkboardTeacher />,
        path:"/dashboard",
        sub:"Faculty panel"
      },

      {
        title:"Courses",
        icon:<FaBook />,
        path:"/courses",
        sub:`${coursesCount} courses`
      },

      {
        title:"Assignments",
        icon:<FaTasks />,
        path:"/assignments",
        sub:"Create tasks"
      },

      {
        title:"Attendance",
        icon:<FaClipboardCheck />,
        path:"/attendance",
        sub:"Attendance system"
      },

      {
        title:"Manage Attendance",
        icon:<FaUserCheck />,
        path:"/manage-attendance",
        sub:"Manage students"
      },

      {
        title:"Progress",
        icon:<FaChartLine />,
        path:"/progress",
        sub:"Student tracking"
      },
{
  title:"Attendance Scanner",
  icon:<FaQrcode />,
  path:"/attendance-scanner",
  sub:"Scan event QR"
},
{
  title:"Notifications",
  icon:<FaBell />,
  path:"/notifications",
  sub:"Realtime alerts"
},
      {
        title:"Certificates",
        icon:<FaCertificate />,
        path:"/certificates",
        sub:"Issue certificates"
      },

      {
        title:"Settings",
        icon:<FaCog />,
        path:"/settings",
        sub:"Faculty settings"
      }

    ]

  }

  /* ========================= */
  /* STUDENT */
  /* ========================= */

else if(userRole === "student"){

  navItems = [

    {
      title: "Dashboard",
      icon: <FaUserGraduate />,
      path: "/dashboard",
      sub: "Student portal"
    },

    {
      title: "Courses",
      icon: <FaBook />,
      path: "/courses",
      sub: `${coursesCount} courses`
    },

    {
      title: "Assignments",
      icon: <FaTasks />,
      path: "/assignments",
      sub: "Submit tasks"
    },

    {
      title: "Attendance",
      icon: <FaUserCheck />,
      path: "/my-attendance",
      sub: "Track attendance"
    },

    {
      title: "Progress",
      icon: <FaChartLine />,
      path: "/progress",
      sub: "Performance tracking"
    },

    {
      title: "Events",
      icon: <FaCalendarAlt />,
      path: "/events",
      sub: `${eventsCount} live events`
    },

    {
      title: "QR Tickets",
      icon: <FaQrcode />,
      path: "/qr-ticketing",
      sub: "My event passes"
    },

    {
      title: "Certificates",
      icon: <FaCertificate />,
      path: "/certificates",
      sub: "Achievements"
    },
{
  title:"Notifications",
  icon:<FaBell />,
  path:"/notifications",
  sub:"Realtime alerts"
},
    {
      title: "Settings",
      icon: <FaCog />,
      path: "/settings",
      sub: "Account settings"
    }

  ]

}

  /* ========================= */
  /* PARENT */
  /* ========================= */

  else if(userRole === "parent"){

    navItems = [

      {
        title:"Dashboard",
        icon:<FaUserFriends />,
        path:"/dashboard",
        sub:"Parent dashboard"
      },

      {
        title:"Courses",
        icon:<FaBook />,
        path:"/courses",
        sub:"Child courses"
      },

      {
        title:"Progress",
        icon:<FaChartLine />,
        path:"/progress",
        sub:"Performance tracking"
      },

      {
        title:"Settings",
        icon:<FaCog />,
        path:"/settings",
        sub:"Parent settings"
      }

    ]

  }

  /* ========================= */
  /* ORGANIZER */
  /* ========================= */

  else if(userRole === "organizer"){

    navItems = [

      {
        title:"Dashboard",
        icon:<FaLayerGroup />,
        path:"/dashboard",
        sub:"Organizer panel"
      },

      {
        title:"Events",
        icon:<FaCalendarAlt />,
        path:"/events",
        sub:`${eventsCount} events`
      },

      {
        title:"Volunteers",
        icon:<FaUsers />,
        path:"/volunteers",
        sub:`${volunteersCount} members`
      },

      {
        title:"Sponsors",
        icon:<FaHandshake />,
        path:"/sponsors",
        sub:`${sponsorsCount} sponsors`
      },

      {
        title:"Analytics",
        icon:<FaChartPie />,
        path:"/analytics",
        sub:"Event analytics"
      },

      {
        title:"QR Ticketing",
        icon:<FaQrcode />,
        path:"/qr-ticketing",
        sub:"Smart access"
      },
{
  title:"Attendance Scanner",
  icon:<FaQrcode />,
  path:"/attendance-scanner",
  sub:"Scan event QR"
},
{
  title:"Notifications",
  icon:<FaBell />,
  path:"/notifications",
  sub:"Realtime alerts"
},
      {
        title:"Settings",
        icon:<FaCog />,
        path:"/settings",
        sub:"Organizer settings"
      }

    ]

  }

  /* FALLBACK */

  else{

    navItems = [

      {
        title:"Dashboard",
        icon:<FaLayerGroup />,
        path:"/dashboard",
        sub:"Overview"
      }

    ]

  }

  const handleLogout = async() => {

    try{

      await signOut(auth)

      navigate("/")

    }

    catch(error){

      console.log(error)

    }

  }

  return (

    <motion.div

      initial={{
        x:-100,
        opacity:0
      }}

      animate={{
        x:0,
        opacity:1
      }}

      transition={{
        duration:0.5
      }}

className="w-full lg:w-[290px] lg:min-w-[290px] lg:max-w-[290px] h-screen bg-[#f8f4ef] border-r border-black/5 flex flex-col justify-between px-3 lg:px-5 py-6 relative overflow-y-auto overflow-x-hidden flex-shrink-0"
    >

      {/* BG */}

      <div className="absolute top-[-10%] left-[-20%] w-[240px] h-[240px] bg-violet-300/20 blur-[90px] rounded-full pointer-events-none" />

      <div className="absolute bottom-[-10%] right-[-20%] w-[240px] h-[240px] bg-orange-300/20 blur-[90px] rounded-full pointer-events-none" />

      {/* TOP */}

      <div className="relative z-10">

        {/* LOGO */}

        <button

          onClick={() =>
            navigate("/dashboard")
          }

          className="flex items-center gap-3 w-full text-left"

        >

          <motion.div

            whileHover={{
              rotate:8,
              scale:1.05
            }}

            className="w-16 h-16 rounded-[24px] bg-black text-white flex items-center justify-center shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex-shrink-0"

          >

            <FaBolt className="text-2xl" />

          </motion.div>

          <div>

            <h1 className="text-[30px] leading-none font-black tracking-[-0.06em] text-black">

              EventSphere

            </h1>

            <p className="mt-2 text-[9px] uppercase tracking-[0.35em] text-violet-500 font-black">

              LMS PLATFORM

            </p>

          </div>

        </button>

        {/* NAV */}

<div className="mt-10 grid grid-cols-2 gap-4 lg:flex lg:flex-col">  {

            navItems.map((item,index)=>(

              <motion.button

                key={index}

                onClick={() =>
                  navigate(item.path)
                }

                whileHover={{
                  y:-2,
                  scale:1.01
                }}

                whileTap={{
                  scale:0.98
                }}

                className={`

  flex flex-col items-center justify-center
  text-center
  rounded-[26px]
  px-3 py-5
  border
  transition-all duration-300
  min-h-[145px]

  lg:flex-row
  lg:justify-between
  lg:text-left
  lg:min-h-0
  lg:px-4

                  ${

                    location.pathname === item.path

                    ?

                    "bg-black text-white border-black shadow-[0_15px_40px_rgba(0,0,0,0.15)]"

                    :

                    "bg-white/70 border-white hover:bg-white text-black"

                  }

                `}

              >

<div className="flex flex-col lg:flex-row items-center gap-3 min-w-0 w-full">
                  <div className={`

                    w-10 h-10 lg:w-12 lg:h-12 rounded-[18px]
                    flex items-center justify-center
                    text-lg flex-shrink-0

                    ${

                      location.pathname === item.path

                      ?

                      "bg-white/10 text-orange-300"

                      :

                      "bg-[#f5efe7] text-violet-500"

                    }

                  `}>

                    {item.icon}

                  </div>

<div className="text-center lg:text-left min-w-0 w-full">
                    <h1 className={`

text-[15px] lg:text-[15px]                      
font-black truncate

                      ${

                        location.pathname === item.path

                        ?

                        "text-white"

                        :

                        "text-black"

                      }

                    `}>

                      {item.title}

                    </h1>

                    <p className={`

text-[10px] lg:text-[11px]                  
    mt-1 truncate

                      ${

                        location.pathname === item.path

                        ?

                        "text-white/50"

                        :

                        "text-black/40"

                      }

                    `}>

                      {item.sub}

                    </p>

                  </div>

                </div>

                <FaChevronRight className={`

                  text-[10px]
                  flex-shrink-0

                  ${

                    location.pathname === item.path

                    ?

                    "text-white/40"

                    :

                    "text-black/30"

                  }

                `} />

              </motion.button>

            ))

          }

        </div>

      </div>

      {/* PROFILE */}

      <div className="relative z-10 mt-6">

        <div className="rounded-[30px] bg-black text-white p-5 shadow-[0_25px_80px_rgba(0,0,0,0.18)]">

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-2xl font-black shadow-xl flex-shrink-0">

              {

                userName
                ?.charAt(0)
                ?.toUpperCase()

              }

            </div>

            <div className="min-w-0">

              <h1 className="text-xl font-black truncate">

                {userName}

              </h1>

              <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-orange-300 font-black truncate">

                {userRole}

              </p>

            </div>

          </div>

          <motion.button

            onClick={handleLogout}

            whileHover={{
              scale:1.02
            }}

            whileTap={{
              scale:0.97
            }}

            className="mt-5 w-full rounded-[20px] bg-white text-black py-4 font-black flex items-center justify-center gap-3 text-sm shadow-lg"

          >

            <FaSignOutAlt />

            Logout

          </motion.button>

        </div>

      </div>

    </motion.div>

  )

}

export default Sidebar