import {
  useEffect,
  useState,
  useRef
} from "react"

import {
  motion,
  AnimatePresence
} from "framer-motion"

import {
  auth,
  db
} from "../firebase/firebase"

import {
  doc,
  getDoc,
  collection,
  onSnapshot,
  query,
  where
} from "firebase/firestore"

import {
  signOut
} from "firebase/auth"

import {
  useNavigate,
  useLocation
} from "react-router-dom"

import {

  FaSearch,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
  FaUserShield,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaUsers,
  FaBell,
  FaMoon,
  FaRocket,
  FaLayerGroup

} from "react-icons/fa"

function Navbar() {

  const navigate = useNavigate()

  const location = useLocation()

  const dropdownRef = useRef()

  const [userName, setUserName] =
  useState("User")

  const [userRole, setUserRole] =
  useState("student")

  const [greeting, setGreeting] =
  useState("Welcome Back")

  const [profileOpen, setProfileOpen] =
  useState(false)

  const [searchFocused, setSearchFocused] =
  useState(false)

  const [unreadCount, setUnreadCount] =
  useState(0)

  useEffect(() => {

    const unsubscribe =

    auth.onAuthStateChanged(

      async(user) => {

        if(user){

          try{

            const docRef = doc(
              db,
              "users",
              user.uid
            )

            const docSnap =
            await getDoc(docRef)

            if(docSnap.exists()){

              const data =
              docSnap.data()

              setUserName(

                data.name ||

                user.email.split("@")[0]

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

    const hour =
    new Date().getHours()

    if(hour < 12){

      setGreeting(
        "Good Morning"
      )

    }

    else if(hour < 18){

      setGreeting(
        "Good Afternoon"
      )

    }

    else{

      setGreeting(
        "Good Evening"
      )

    }

    const handleClickOutside =
    (event) => {

      if(

        dropdownRef.current &&

        !dropdownRef.current.contains(
          event.target
        )

      ){

        setProfileOpen(false)

      }

    }

    document.addEventListener(

      "mousedown",

      handleClickOutside

    )

    return () => {

      unsubscribe()

      document.removeEventListener(

        "mousedown",

        handleClickOutside

      )

    }

  }, [])

  /* REALTIME NOTIFICATIONS */

  useEffect(() => {

    const user =
    auth.currentUser

    if(!user) return

    const notificationsQuery = query(

      collection(
        db,
        "notifications"
      ),

      where(
        "read",
        "==",
        false
      )

    )

    const unsubscribe = onSnapshot(

      notificationsQuery,

      (snapshot) => {

        setUnreadCount(
          snapshot.size
        )

      }

    )

    return () => unsubscribe()

  }, [])

  const handleLogout = async() => {

    try{

      await signOut(auth)

      navigate("/login")

    }

    catch(error){

      console.log(error)

    }

  }

  const getRoleIcon = () => {

    if(userRole === "admin"){

      return <FaUserShield />

    }

    if(userRole === "faculty"){

      return <FaChalkboardTeacher />

    }

    if(userRole === "student"){

      return <FaUserGraduate />

    }

    if(userRole === "parent"){

      return <FaUsers />

    }

    return <FaLayerGroup />

  }

  const getRoleBadge = () => {

    if(userRole === "admin"){

      return "bg-gradient-to-r from-rose-500 to-pink-500 text-white"

    }

    if(userRole === "faculty"){

      return "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"

    }

    if(userRole === "student"){

      return "bg-gradient-to-r from-emerald-500 to-green-500 text-white"

    }

    if(userRole === "parent"){

      return "bg-gradient-to-r from-orange-500 to-yellow-500 text-white"

    }

    return "bg-black text-white"

  }

  const getPageTitle = () => {

    if(location.pathname === "/dashboard"){

      return "Dashboard"

    }

    if(location.pathname === "/courses"){

      return "Courses"

    }

    if(location.pathname === "/assignments"){

      return "Assignments"

    }

    if(location.pathname === "/progress"){

      return "Progress"

    }

    if(location.pathname === "/settings"){

      return "Settings"

    }

    if(location.pathname === "/notifications"){

      return "Notifications"

    }

    return "LMS Portal"

  }

  return (

    <motion.div

      initial={{
        opacity:0,
        y:-30
      }}

      animate={{
        opacity:1,
        y:0
      }}

      transition={{
        duration:0.5
      }}

      className="relative z-50"

    >

      <div className="relative overflow-visible rounded-[38px] border border-white/40 bg-white/70 backdrop-blur-3xl px-7 py-5 shadow-[0_25px_80px_rgba(0,0,0,0.08)]">

        <div className="relative z-10 flex items-center justify-between gap-6 flex-wrap">


          <div className="flex-1 min-w-[280px]">

            <div className="flex items-center gap-5 flex-wrap">

              <motion.div

                whileHover={{
                  rotate:10,
                  scale:1.06
                }}

                className="w-16 h-16 rounded-[24px] bg-black text-white flex items-center justify-center"

              >

                <FaRocket className="text-2xl" />

              </motion.div>

              <div>

                <div className="flex items-center gap-3 flex-wrap">

                  <h1 className="text-[42px] leading-none font-black tracking-[-0.06em] text-black">

                    {getPageTitle()}

                  </h1>

                  <div className={`

                    px-4 py-2 rounded-full
                    text-[10px]
                    uppercase tracking-[0.25em]
                    font-black flex items-center gap-2

                    ${getRoleBadge()}

                  `}>

                    {getRoleIcon()}

                    {userRole}

                  </div>

                </div>

                <div className="flex items-center gap-3 mt-4 flex-wrap">

                  <p className="text-black/45 text-[15px] font-semibold">

                    {greeting},

                    <span className="ml-2 text-black font-black">

                      {userName}

                    </span>

                    👋

                  </p>

                  <span className="text-black/20">

                    •

                  </span>

                  <div className="flex items-center gap-2 text-violet-600 font-bold text-sm">

                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />

                    System Online

                  </div>

                </div>

              </div>

            </div>

          </div>


          <div className="flex items-center gap-4 ml-auto flex-wrap">


            <motion.div

              animate={{
                width: searchFocused
                ? 360
                : 320
              }}

              className="relative hidden lg:block"

            >

              <FaSearch className={`

                absolute left-5 top-1/2 -translate-y-1/2 text-sm

                ${

                  searchFocused

                  ?

                  "text-violet-500"

                  :

                  "text-black/30"

                }

              `} />

              <input

                type="text"

                placeholder="Search anything..."

                onFocus={() =>
                  setSearchFocused(true)
                }

                onBlur={() =>
                  setSearchFocused(false)
                }

                className={`

                  w-full pl-12 pr-5 py-4 rounded-[24px]
                  border outline-none text-sm font-semibold

                  ${

                    searchFocused

                    ?

                    "bg-white border-violet-300"

                    :

                    "bg-[#f6f1eb] border-black/5"

                  }

                `}

              />

            </motion.div>


            <motion.button

              whileHover={{
                scale:1.05,
                y:-2
              }}

              whileTap={{
                scale:0.95
              }}

              onClick={() =>
                navigate("/notifications")
              }

              className="relative w-14 h-14 rounded-[22px] bg-white border border-black/5 flex items-center justify-center text-xl text-violet-600 shadow-lg"

            >

              <FaBell />

              {

                unreadCount > 0 &&

                <motion.div

                  initial={{
                    scale:0
                  }}

                  animate={{
                    scale:1
                  }}

                  className="absolute -top-1 -right-1 min-w-[24px] h-[24px] px-1 rounded-full bg-rose-500 text-white text-[11px] font-black flex items-center justify-center border-2 border-white"

                >

                  {

                    unreadCount > 9

                    ?

                    "9+"

                    :

                    unreadCount

                  }

                </motion.div>

              }

            </motion.button>


            <motion.button

              whileHover={{
                scale:1.05,
                rotate:12
              }}

              whileTap={{
                scale:0.95
              }}

              className="w-14 h-14 rounded-[22px] bg-black text-white flex items-center justify-center text-lg"

            >

              <FaMoon />

            </motion.button>


            <div
              className="relative"
              ref={dropdownRef}
            >

              <motion.button

                whileHover={{
                  scale:1.02
                }}

                whileTap={{
                  scale:0.98
                }}

                onClick={() =>
                  setProfileOpen(
                    !profileOpen
                  )
                }

                className="flex items-center gap-4 rounded-[26px] bg-black text-white px-4 py-3"

              >

                <div className="hidden md:block text-right">

                  <h1 className="text-sm font-black leading-none">

                    {userName}

                  </h1>

                  <p className="mt-2 text-[9px] uppercase tracking-[0.28em] text-orange-300 font-black">

                    {userRole}

                  </p>

                </div>

                <div className="relative">

                  <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center text-white font-black text-lg">

                    {

                      userName
                      ?.charAt(0)
                      ?.toUpperCase()

                    }

                  </div>

                </div>

                <FaChevronDown />

              </motion.button>

              <AnimatePresence>

                {

                  profileOpen &&

                  <motion.div

                    initial={{
                      opacity:0,
                      y:10
                    }}

                    animate={{
                      opacity:1,
                      y:0
                    }}

                    exit={{
                      opacity:0,
                      y:10
                    }}

                    className="absolute right-0 top-[84px] w-[300px] rounded-[32px] bg-white border border-black/5 shadow-[0_35px_100px_rgba(0,0,0,0.14)] overflow-hidden"

                  >

                    <div className="p-4">

                      <motion.button

                        whileHover={{
                          x:5
                        }}

                        onClick={() => {

                          navigate("/settings")

                          setProfileOpen(false)

                        }}

                        className="w-full flex items-center gap-4 px-5 py-4 rounded-[20px] hover:bg-[#f6f1eb]"

                      >

                        <div className="w-11 h-11 rounded-[16px] bg-violet-100 text-violet-600 flex items-center justify-center">

                          <FaCog />

                        </div>

                        Settings

                      </motion.button>

                      <motion.button

                        whileHover={{
                          x:5
                        }}

                        onClick={handleLogout}

                        className="w-full mt-3 flex items-center gap-4 px-5 py-4 rounded-[20px] bg-rose-50 hover:bg-rose-100 text-rose-500 font-black"

                      >

                        <div className="w-11 h-11 rounded-[16px] bg-rose-100 text-rose-500 flex items-center justify-center">

                          <FaSignOutAlt />

                        </div>

                        Logout

                      </motion.button>

                    </div>

                  </motion.div>

                }

              </AnimatePresence>

            </div>

          </div>

        </div>

      </div>

    </motion.div>

  )

}

export default Navbar