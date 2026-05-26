import {
  useEffect,
  useState
} from "react"

import { motion } from "framer-motion"

import {
  collection,
  onSnapshot,
  doc,
  getDoc
} from "firebase/firestore"

import {
  db,
  auth
} from "../firebase/firebase"
import MainLayout from "../layouts/MainLayout"

import {

  FaCheckCircle,
  FaTimesCircle,
  FaPercentage,
  FaCalendarAlt,
  FaChartLine,
  FaBookOpen,
  FaArrowUp,
  FaFire,
  FaClock

} from "react-icons/fa"

function StudentAttendance() {

  const [attendance, setAttendance] =
  useState([])

  const [userName, setUserName] =
  useState("")

  const [loading, setLoading] =
  useState(true)


  const formatDate = (timestamp) => {

    if (!timestamp) {

      return "No Date"

    }

    try {

      if (timestamp?.toDate) {

        return timestamp
          .toDate()
          .toLocaleString()

      }

      return new Date(timestamp)
        .toLocaleString()

    }

    catch (error) {

      return "Invalid Date"

    }

  }


  useEffect(() => {

    const getUser = async() => {

      const user =
      auth.currentUser

      if(user){

        const userRef =
        doc(db, "users", user.uid)

        const userSnap =
        await getDoc(userRef)

        if(userSnap.exists()){

          setUserName(
            userSnap.data().name
          )

        }

      }

    }

    getUser()

  }, [])


  useEffect(() => {

    const unsubscribe =

      onSnapshot(

        collection(db, "attendance"),

        (snapshot) => {

          const data = []

          snapshot.forEach((doc)=>{

            data.push({

              id:doc.id,
              ...doc.data()

            })

          })

          setAttendance(data)

          setLoading(false)

        }

      )

    return () => unsubscribe()

  }, [])


  const studentAttendance =

    attendance.filter(

      (item)=>

        item.studentName ===
        userName

    )


  const presentCount =

    studentAttendance.filter(

      (item)=>

        item.status ===
        "Present"

    ).length


  const absentCount =

    studentAttendance.filter(

      (item)=>

        item.status ===
        "Absent"

    ).length


  const percentage =

    studentAttendance.length > 0

    ?

    Math.round(

      (
        presentCount /

        studentAttendance.length
      ) * 100

    )

    :

    0

  return (

    <MainLayout>
      <div className="flex-1 min-w-0 relative overflow-hidden">


        <div className="absolute top-[-150px] right-[-120px] w-[420px] h-[420px] bg-purple-200/40 blur-[120px] rounded-full" />

        <div className="absolute bottom-[-150px] left-[-120px] w-[420px] h-[420px] bg-cyan-200/40 blur-[120px] rounded-full" />

        <div className="h-full overflow-y-auto p-6 relative z-10">



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

            className="relative overflow-hidden rounded-[45px] bg-black text-white p-10 md:p-14"

          >


            <div className="absolute top-[-20%] right-[-10%] w-[320px] h-[320px] bg-purple-500/20 blur-[120px] rounded-full" />

            <div className="absolute bottom-[-20%] left-[-10%] w-[320px] h-[320px] bg-cyan-500/20 blur-[120px] rounded-full" />

            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">


              <div>

                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-black uppercase tracking-[0.25em]">

                  <FaChartLine />

                  Attendance Dashboard

                </div>

                <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-[-0.08em] mt-8">

                  My
                  <br />
                  Attendance
                </h1>

                <p className="text-white/55 text-2xl mt-8 max-w-3xl leading-relaxed">

                  Track your realtime attendance,
                  performance insights,
                  attendance percentage
                  and course activity.

                </p>


                <div className="flex flex-wrap gap-5 mt-10">

                  <HeroCard

                    title="Present"
                    value={presentCount}
                    icon={<FaCheckCircle />}
                    bg="bg-emerald-500"

                  />

                  <HeroCard

                    title="Absent"
                    value={absentCount}
                    icon={<FaTimesCircle />}
                    bg="bg-rose-500"

                  />

                  <HeroCard

                    title="Percentage"
                    value={`${percentage}%`}
                    icon={<FaPercentage />}
                    bg="bg-purple-500"

                  />

                </div>

              </div>


              <motion.div

                animate={{
                  y:[0,-15,0],
                  rotate:[0,5,-5,0]
                }}

                transition={{
                  duration:6,
                  repeat:Infinity
                }}

                className="hidden xl:flex w-48 h-48 rounded-[40px] bg-white text-black items-center justify-center shadow-2xl"

              >

                <FaCalendarAlt className="text-7xl" />

              </motion.div>

            </div>

          </motion.div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

            <StatCard

              title="Attendance Score"
              value={`${percentage}%`}
              icon={<FaPercentage />}
              color="purple"

            />

            <StatCard

              title="Classes Present"
              value={presentCount}
              icon={<FaCheckCircle />}
              color="emerald"

            />

            <StatCard

              title="Classes Missed"
              value={absentCount}
              icon={<FaTimesCircle />}
              color="rose"

            />

          </div>


          {

            loading

            ?

            <div className="h-[400px] flex items-center justify-center text-5xl font-black">

              Loading Attendance...

            </div>

            :

            studentAttendance.length === 0

            ?

            <motion.div

              initial={{
                opacity:0,
                y:20
              }}

              animate={{
                opacity:1,
                y:0
              }}

              className="mt-8 rounded-[40px] bg-white border border-black/5 h-[420px] flex flex-col items-center justify-center shadow-[0_20px_80px_rgba(0,0,0,0.04)]"

            >

              <div className="w-28 h-28 rounded-[32px] bg-black text-white flex items-center justify-center text-5xl mb-8">

                <FaCalendarAlt />

              </div>

              <h1 className="text-5xl font-black">

                No Attendance Found

              </h1>

              <p className="text-black/45 mt-5 text-xl">

                Your attendance records will appear here.

              </p>

            </motion.div>

            :

            <motion.div

              initial={{
                opacity:0,
                y:20
              }}

              animate={{
                opacity:1,
                y:0
              }}

              className="mt-8 rounded-[40px] overflow-hidden bg-white border border-black/5 shadow-[0_20px_80px_rgba(0,0,0,0.04)]"

            >


              <div className="p-8 border-b border-black/5 flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                <div>

                  <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-purple-100 text-purple-700 text-xs font-black uppercase tracking-[0.25em]">

                    <FaBookOpen />

                    Attendance Records
                  </div>

                  <h1 className="text-4xl font-black mt-6">

                    Course Attendance
                  </h1>

                  <p className="text-black/45 text-lg mt-3">

                    Realtime attendance tracking
                    and history overview.

                  </p>

                </div>

                <div className="flex gap-5">

                  <MiniStat

                    label="Present"
                    value={presentCount}
                    icon={<FaFire />}

                  />

                  <MiniStat

                    label="Attendance"
                    value={`${percentage}%`}
                    icon={<FaArrowUp />}

                  />

                </div>

              </div>


              <div className="overflow-x-auto">

                <table className="w-full min-w-[850px]">

                  <thead>

                    <tr className="border-b border-black/5 bg-[#faf7f2]">

                      <th className="text-left p-6 uppercase tracking-[0.2em] text-xs font-black text-black/35">

                        Course
                      </th>

                      <th className="text-left p-6 uppercase tracking-[0.2em] text-xs font-black text-black/35">

                        Date
                      </th>

                      <th className="text-left p-6 uppercase tracking-[0.2em] text-xs font-black text-black/35">

                        Time
                      </th>

                      <th className="text-left p-6 uppercase tracking-[0.2em] text-xs font-black text-black/35">

                        Status
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {

                      studentAttendance.map((item,index)=>(

                        <motion.tr

                          initial={{
                            opacity:0,
                            y:15
                          }}

                          animate={{
                            opacity:1,
                            y:0
                          }}

                          transition={{
                            delay:index * 0.05
                          }}

                          key={item.id}

                          className="border-b border-black/5 hover:bg-[#faf7f2] transition-all"

                        >


                          <td className="p-6">

                            <div className="flex items-center gap-4">

                              <div className="w-14 h-14 rounded-[18px] bg-black text-white flex items-center justify-center text-lg font-black">

                                {

                                  (
                                    item.courseName ||

                                    item.course ||

                                    "C"

                                  )
                                  .charAt(0)
                                  .toUpperCase()

                                }

                              </div>

                              <div>

                                <h1 className="text-xl font-black">

                                  {

                                    item.courseName ||

                                    item.course ||

                                    "No Course"

                                  }

                                </h1>

                                <p className="text-black/40 text-sm mt-1">

                                  Attendance Record
                                </p>

                              </div>

                            </div>

                          </td>


                          <td className="p-6">

                            <div className="flex items-center gap-3 font-semibold">

                              <FaCalendarAlt className="text-cyan-500" />

                              {

                                formatDate(

                                  item.createdAt ||

                                  item.date

                                )

                              }

                            </div>

                          </td>


                          <td className="p-6">

                            <div className="flex items-center gap-3 text-black/50 font-semibold">

                              <FaClock className="text-purple-500" />

                              Live Synced
                            </div>

                          </td>


                          <td className="p-6">

                            {

                              item.status ===
                              "Present"

                              ?

                              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-emerald-100 text-emerald-700 text-sm font-black">

                                <FaCheckCircle />

                                Present
                              </div>

                              :

                              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-rose-100 text-rose-700 text-sm font-black">

                                <FaTimesCircle />

                                Absent
                              </div>

                            }

                          </td>

                        </motion.tr>

                      ))

                    }

                  </tbody>

                </table>

              </div>

            </motion.div>

          }

        </div>

      </div>

</MainLayout>

  )

}

function HeroCard({

  title,
  value,
  icon,
  bg

}) {

  return (

    <div className="px-6 py-5 rounded-[28px] bg-white/10 backdrop-blur-md border border-white/10">

      <div className="flex items-center gap-5">

        <div className={`

          w-14 h-14 rounded-[18px]
          flex items-center justify-center
          text-white text-xl

          ${bg}

        `}>

          {icon}

        </div>

        <div>

          <p className="uppercase tracking-[0.22em] text-[10px] font-black text-white/40">

            {title}
          </p>

          <h1 className="text-3xl font-black mt-2">

            {value}
          </h1>

        </div>

      </div>

    </div>

  )

}

function StatCard({

  title,
  value,
  icon,
  color

}) {

  return (

    <motion.div

      whileHover={{
        y:-5
      }}

      className="rounded-[36px] bg-white border border-black/5 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.04)]"

    >

      <div className="flex items-center justify-between">

        <div>

          <p className="uppercase tracking-[0.22em] text-xs font-black text-black/35">

            {title}
          </p>

          <h1 className="text-5xl font-black mt-5">

            {value}
          </h1>

        </div>

        <div className={`

          w-20 h-20 rounded-[28px]
          flex items-center justify-center
          text-3xl

          ${color === "purple" && "bg-purple-100 text-purple-700"}
          ${color === "emerald" && "bg-emerald-100 text-emerald-700"}
          ${color === "rose" && "bg-rose-100 text-rose-700"}

        `}>

          {icon}

        </div>

      </div>

    </motion.div>

  )

}

function MiniStat({

  label,
  value,
  icon

}) {

  return (

    <div className="px-6 py-5 rounded-[24px] bg-[#faf7f2] border border-black/5 min-w-[150px]">

      <div className="flex items-center justify-between">

        <div>

          <p className="uppercase tracking-[0.2em] text-[10px] font-black text-black/35">

            {label}
          </p>

          <h1 className="text-3xl font-black mt-3">

            {value}
          </h1>

        </div>

        <div className="w-12 h-12 rounded-[16px] bg-black text-white flex items-center justify-center">

          {icon}
        </div>

      </div>

    </div>

  )

}

export default StudentAttendance