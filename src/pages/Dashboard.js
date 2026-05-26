/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react"

import {
  motion
} from "framer-motion"

import {
  useNavigate
} from "react-router-dom"

import {
  auth,
  db
} from "../firebase/firebase"

import {
  doc,
  getDoc,
  collection,
  onSnapshot
} from "firebase/firestore"
import MainLayout from "../layouts/MainLayout"

import {
  FaUsers,
  FaBook,
  FaMoneyBillWave,
  FaClipboardList,
  FaChartLine,
  FaBolt,
  FaArrowUp,
  FaBell,
  FaFire,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserFriends,
  FaShieldAlt
} from "react-icons/fa"

function Dashboard() {

  const navigate = useNavigate()

  const [loading, setLoading] =
  useState(true)

  const [userData, setUserData] =
  useState(null)

  const [role, setRole] =
  useState("")

  const [stats, setStats] =
  useState({

    students: 0,
    courses: 0,
    assignments: 0,
    revenue: 0

  })

  const [activities, setActivities] =
  useState([])

  useEffect(() => {

    const unsubscribe =

    auth.onAuthStateChanged(

      async(user) => {

        if(!user){

          navigate("/login")

          return

        }

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

            setUserData(data)

            setRole(data.role)

            /* USERS */

            onSnapshot(

              collection(db, "users"),

              (snapshot) => {

                setStats((prev)=>({

                  ...prev,
                  students:snapshot.size

                }))

              }

            )

            /* COURSES */

            onSnapshot(

              collection(db, "courses"),

              (snapshot) => {

                setStats((prev)=>({

                  ...prev,
                  courses:snapshot.size

                }))

              }

            )

            /* ASSIGNMENTS */

            onSnapshot(

              collection(db, "assignments"),

              (snapshot) => {

                setStats((prev)=>({

                  ...prev,
                  assignments:snapshot.size

                }))

              }

            )

            /* REVENUE ONLY FOR ADMIN */

            if(data.role === "admin"){

              onSnapshot(

                collection(db, "payments"),

                (snapshot) => {

                  let total = 0

                  snapshot.forEach((doc)=>{

                    total +=
                    doc.data().amount || 0

                  })

                  setStats((prev)=>({

                    ...prev,
                    revenue:total

                  }))

                }

              )

            }

            /* ACTIVITY */

            onSnapshot(

              collection(db, "activity"),

              (snapshot) => {

                const realtimeActivity = []

                snapshot.forEach((doc)=>{

                  realtimeActivity.push(
                    doc.data()
                  )

                })

                setActivities(

                  realtimeActivity.slice(0,5)

                )

              }

            )

          }

        }

        catch(error){

          console.log(error)

        }

        finally{

          setLoading(false)

        }

      }

    )

    return () => unsubscribe()

  }, [navigate])

  /* ROLE BASED ICON */

  const getRoleIcon = () => {

    if(role === "admin"){

      return <FaShieldAlt />

    }

    if(role === "faculty"){

      return <FaChalkboardTeacher />

    }

    if(role === "parent"){

      return <FaUserFriends />

    }

    return <FaUserGraduate />

  }

  /* ROLE DESCRIPTION */

  const getRoleDescription = () => {

    if(role === "admin"){

      return "Manage complete LMS ecosystem, analytics and realtime platform controls."

    }

    if(role === "faculty"){

      return "Track student learning, assignments, attendance and classroom analytics."

    }

    if(role === "parent"){

      return "Monitor your child's academic growth, courses and learning performance."

    }

    return "Track your assignments, courses, attendance and academic growth."

  }

  /* ROLE BASED CARDS */

  let dashboardCards = [

    {
      title:"Courses",
      value:stats.courses,
      icon:<FaBook />,
      color:"from-[#7f5af0] to-[#6246ea]"
    },

    {
      title:"Assignments",
      value:stats.assignments,
      icon:<FaClipboardList />,
      color:"from-[#f857a6] to-[#ff5858]"
    }

  ]

  if(role === "admin"){

    dashboardCards.unshift({

      title:"Students",
      value:stats.students,
      icon:<FaUsers />,
      color:"from-[#ff9966] to-[#ff5e62]"

    })

    dashboardCards.push({

      title:"Revenue",
      value:`₹${stats.revenue}`,
      icon:<FaMoneyBillWave />,
      color:"from-[#00c6ff] to-[#0072ff]"

    })

  }

  if(loading){

    return (

      <div className="w-screen h-screen bg-[#f5efe7] flex items-center justify-center overflow-hidden">

        <motion.div

          animate={{
            scale:[1,1.08,1]
          }}

          transition={{
            duration:1.5,
            repeat:Infinity
          }}

          className="flex flex-col items-center"

        >

          <div className="w-28 h-28 rounded-[35px] bg-black text-white flex items-center justify-center shadow-[0_25px_90px_rgba(0,0,0,0.18)]">

            <FaBolt className="text-5xl" />

          </div>

          <h1 className="mt-8 text-5xl font-black tracking-tight">

            Loading Dashboard...

          </h1>

        </motion.div>

      </div>

    )

  }

  return (

    <MainLayout>

      <div className="flex-1 min-w-0 h-screen overflow-hidden relative">

        {/* BG */}

        <div className="absolute top-[-15%] right-[-10%] w-[450px] h-[450px] bg-violet-300/20 blur-[140px] rounded-full pointer-events-none" />

        <div className="absolute bottom-[-15%] left-[-10%] w-[450px] h-[450px] bg-orange-300/20 blur-[140px] rounded-full pointer-events-none" />

        <div className="h-full overflow-y-auto overflow-x-hidden p-6 relative z-10">


          {/* HERO */}

          <motion.div

            initial={{
              opacity:0,
              y:30
            }}

            animate={{
              opacity:1,
              y:0
            }}

            transition={{
              duration:0.6
            }}

            className="mt-6 rounded-[45px] bg-white/80 backdrop-blur-3xl border border-black/5 shadow-[0_25px_80px_rgba(0,0,0,0.05)] overflow-hidden relative"

          >

            <div className="absolute top-[-20%] right-[-10%] w-[320px] h-[320px] bg-violet-300/20 blur-[120px] rounded-full" />

            <div className="absolute bottom-[-20%] left-[-10%] w-[320px] h-[320px] bg-orange-300/20 blur-[120px] rounded-full" />

            <div className="relative z-10 p-10 md:p-14">

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">

                <div>

                  <p className="uppercase tracking-[0.3em] text-orange-500 text-xs font-black mb-5">

                    EVENTSPHERE LMS

                  </p>

                  <h1 className="text-6xl md:text-8xl font-black tracking-[-0.08em] leading-[0.9] text-black">

                    Welcome,
                    <br />

                    {userData?.name}

                  </h1>

                  <p className="mt-8 text-black/45 text-2xl leading-relaxed max-w-3xl font-medium">

                    {getRoleDescription()}

                  </p>

                </div>

                <motion.div

                  animate={{
                    rotate:[0,8,-8,0],
                    y:[0,-12,0]
                  }}

                  transition={{
                    duration:5,
                    repeat:Infinity
                  }}

                  className="hidden lg:flex w-44 h-44 rounded-[45px] bg-black text-white items-center justify-center shadow-[0_35px_100px_rgba(0,0,0,0.18)]"

                >

                  <div className="text-7xl">

                    {getRoleIcon()}

                  </div>

                </motion.div>

              </div>

            </div>

          </motion.div>

          {/* STATS */}

          <div className={`

            grid gap-6 mt-8

            ${

              role === "admin"

              ?

              "grid-cols-1 md:grid-cols-2 xl:grid-cols-4"

              :

              "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"

            }

          `}>

            {

              dashboardCards.map((card,index)=>(

                <DashboardCard

                  key={index}

                  title={card.title}

                  value={card.value}

                  icon={card.icon}

                  color={card.color}

                />

              ))

            }

          </div>

          {/* LOWER */}

          <div className={`

            grid gap-8 mt-8

            ${

              role === "student" ||
              role === "parent"

              ?

              "grid-cols-1"

              :

              "lg:grid-cols-[1.3fr_0.7fr]"

            }

          `}>

            {/* PERFORMANCE */}

            {

              role !== "student" &&
              role !== "parent" &&

              <motion.div

                whileHover={{
                  y:-6
                }}

                className="rounded-[40px] bg-white border border-black/5 shadow-[0_20px_60px_rgba(0,0,0,0.05)] p-8 overflow-hidden"

              >

                <div className="flex items-center justify-between mb-10">

                  <div>

                    <p className="uppercase tracking-[0.25em] text-xs font-black text-orange-500 mb-3">

                      ANALYTICS OVERVIEW

                    </p>

                    <h1 className="text-5xl font-black">

                      Performance

                    </h1>

                  </div>

                  <div className="w-16 h-16 rounded-[24px] bg-black text-white flex items-center justify-center text-2xl">

                    <FaChartLine />

                  </div>

                </div>

                {/* REAL GRAPH */}

                <div className="h-[340px] flex items-end gap-5 overflow-hidden">

                  {

                    [

                      {
                        label: "Students",
                        value: Math.min(
                          (stats.students / 100) * 100,
                          100
                        )
                      },

                      {
                        label: "Courses",
                        value: Math.min(
                          (stats.courses / 20) * 100,
                          100
                        )
                      },

                      {
                        label: "Assignments",
                        value: Math.min(
                          (stats.assignments / 50) * 100,
                          100
                        )
                      },

                      {
                        label: "Revenue",

                        value:

                        role === "admin"

                        ?

                        Math.min(
                          (stats.revenue / 100000) * 100,
                          100
                        )

                        :

                        0
                      },

                      {
                        label: "Activity",
                        value: Math.min(
                          (activities.length / 5) * 100,
                          100
                        )
                      }

                    ]

                    .filter((item) => item.value > 0)

                    .map((item, i) => (

                      <div
                        key={i}
                        className="flex-1 flex flex-col items-center justify-end h-full"
                      >

                        <motion.div

                          initial={{
                            height: 0,
                            opacity: 0
                          }}

                          animate={{
                            height: `${item.value}%`,
                            opacity: 1
                          }}

                          transition={{
                            duration: 1,
                            delay: i * 0.12
                          }}

                          whileHover={{
                            scale: 1.04
                          }}

                          className="w-full rounded-t-[35px] bg-gradient-to-t from-[#7f5af0] via-[#6246ea] to-[#00c6ff] relative group cursor-pointer shadow-[0_20px_50px_rgba(98,70,234,0.25)]"

                        >

                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 px-4 py-2 rounded-full bg-black text-white text-sm font-black whitespace-nowrap">

                            {Math.round(item.value)}%

                          </div>

                        </motion.div>

                        <p className="mt-4 text-xs uppercase tracking-[0.2em] text-black/40 font-black">

                          {item.label}

                        </p>

                      </div>

                    ))

                  }

                </div>

              </motion.div>

            }

            {/* ACTIVITY */}

            {

              role !== "parent" &&

              <motion.div

                whileHover={{
                  y:-6
                }}

                className="rounded-[40px] bg-black text-white p-8 shadow-[0_30px_80px_rgba(0,0,0,0.15)] overflow-hidden"

              >

                <div className="flex items-center justify-between">

                  <div>

                    <p className="uppercase tracking-[0.25em] text-xs text-white/40 font-black mb-3">

                      RECENT ACTIVITY

                    </p>

                    <h1 className="text-5xl font-black">

                      Updates

                    </h1>

                  </div>

                  <div className="w-16 h-16 rounded-[24px] bg-white/10 flex items-center justify-center text-2xl">

                    <FaBell />

                  </div>

                </div>

              </motion.div>

            }

          </div>

        </div>

      </div>

</MainLayout>
  )

}

function DashboardCard({

  title,
  value,
  icon,
  color

}) {

  return (

    <motion.div

      initial={{
        opacity:0,
        y:20
      }}

      animate={{
        opacity:1,
        y:0
      }}

      whileHover={{
        y:-8,
        scale:1.02
      }}

      className="rounded-[36px] bg-white border border-black/5 shadow-[0_20px_60px_rgba(0,0,0,0.06)] p-8 relative overflow-hidden"

    >

      <div className={`

        absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${color}

      `} />

      <div className={`

        w-16 h-16 rounded-[24px]
        bg-gradient-to-r ${color}
        text-white flex items-center justify-center text-3xl shadow-xl

      `}>

        {icon}

      </div>

      <p className="mt-8 uppercase tracking-[0.25em] text-xs font-black text-black/35">

        {title}

      </p>

      <h1 className="mt-4 text-6xl font-black tracking-tight text-black">

        {value}

      </h1>

      <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-600 font-bold text-sm">

        <FaArrowUp />

        Live Data

      </div>

    </motion.div>

  )

}

export default Dashboard