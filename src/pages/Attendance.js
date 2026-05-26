import { useEffect, useState } from "react"
import { motion } from "framer-motion"

import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getDoc
} from "firebase/firestore"

import {
  db,
  auth
} from "../firebase/firebase"

import MainLayout from "../layouts/MainLayout"

import {
  FaUserCheck,
  FaSearch,
  FaPlus,
  FaTrash,
  FaEdit,
  FaTimes,
  FaChartLine,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaBolt,
  FaUserGraduate,
  FaBookOpen
} from "react-icons/fa"

function Attendance() {

  const [attendance, setAttendance] =
  useState([])

  const [filteredAttendance,
  setFilteredAttendance] =
  useState([])

  const [loading, setLoading] =
  useState(true)

  const [search, setSearch] =
  useState("")

  const [showModal, setShowModal] =
  useState(false)

  const [editingAttendance,
  setEditingAttendance] =
  useState(null)

  const [userRole, setUserRole] =
  useState("student")

  const [studentName,
  setStudentName] =
  useState("")

  const [courseName,
  setCourseName] =
  useState("")

  const [status,
  setStatus] =
  useState("Present")

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

    catch {

      return "Invalid Date"

    }

  }

  useEffect(() => {

    const getUserRole = async() => {

      const user = auth.currentUser

      if(user){

        const userRef =
        doc(db, "users", user.uid)

        const userSnap =
        await getDoc(userRef)

        if(userSnap.exists()){

          setUserRole(
            userSnap.data().role
          )

        }

      }

    }

    getUserRole()

  }, [])

  useEffect(() => {

    const unsubscribe = onSnapshot(

      collection(db, "attendance"),

      (snapshot) => {

        const data = []

        snapshot.forEach((doc) => {

          data.push({

            id: doc.id,
            ...doc.data()

          })

        })

        setAttendance(data)

        setLoading(false)

      }

    )

    return () => unsubscribe()

  }, [])

  useEffect(() => {

    let updated = [...attendance]

    if(search){

      updated = updated.filter(

        (item)=>

          item.studentName
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )

      )

    }

    setFilteredAttendance(updated)

  }, [attendance, search])

  const resetForm = () => {

    setStudentName("")
    setCourseName("")
    setStatus("Present")
    setEditingAttendance(null)

  }

  const createAttendance = async() => {

    if(
      userRole !== "admin" &&
      userRole !== "faculty"
    ){

      return alert(
        "Access Denied"
      )

    }

    if(
      !studentName ||
      !courseName
    ){

      return alert(
        "Fill all fields"
      )

    }

    try {

      await addDoc(

        collection(db, "attendance"),

        {
          studentName,
          courseName,
          status,
          createdAt:
          serverTimestamp()
        }

      )

      resetForm()

      setShowModal(false)

    }

    catch(error){

      console.log(error)

    }

  }

  const updateAttendance = async() => {

    try {

      await updateDoc(

        doc(
          db,
          "attendance",
          editingAttendance.id
        ),

        {
          studentName,
          courseName,
          status
        }

      )

      resetForm()

      setShowModal(false)

    }

    catch(error){

      console.log(error)

    }

  }

  const editAttendance = (item) => {

    setEditingAttendance(item)

    setStudentName(
      item.studentName
    )

    setCourseName(
      item.courseName
    )

    setStatus(
      item.status
    )

    setShowModal(true)

  }

  const deleteAttendance = async(id) => {

    const confirmDelete =
    window.confirm(
      "Delete attendance?"
    )

    if(!confirmDelete) return

    try{

      await deleteDoc(

        doc(
          db,
          "attendance",
          id
        )

      )

    }

    catch(error){

      console.log(error)

    }

  }

  const presentCount =

  attendance.filter(

    item => item.status === "Present"

  ).length

  const absentCount =

  attendance.filter(

    item => item.status === "Absent"

  ).length

  return (

<MainLayout>
<div className="flex-1 min-w-0 overflow-hidden relative">
        {/* BG */}

        <div className="absolute top-[-200px] right-[-120px] w-[500px] h-[500px] bg-violet-300/20 blur-[140px] rounded-full pointer-events-none" />

        <div className="absolute bottom-[-200px] left-[-120px] w-[500px] h-[500px] bg-orange-300/20 blur-[140px] rounded-full pointer-events-none" />

        <div className="h-full overflow-y-auto overflow-x-hidden p-6 relative z-10">


          {/* HERO */}

          <motion.div

            initial={{
              opacity:0,
              y:20
            }}

            animate={{
              opacity:1,
              y:0
            }}

            transition={{
              duration:0.5
            }}

            className="mt-6 rounded-[45px] bg-white/70 backdrop-blur-3xl border border-white shadow-[0_20px_80px_rgba(0,0,0,0.05)] overflow-hidden relative"

          >

            <div className="absolute top-[-120px] right-[-100px] w-[300px] h-[300px] bg-violet-300/20 blur-[120px] rounded-full" />

            <div className="absolute bottom-[-120px] left-[-100px] w-[300px] h-[300px] bg-orange-300/20 blur-[120px] rounded-full" />

            <div className="relative z-10 p-10 md:p-14 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">

              <div>

                <p className="uppercase tracking-[0.3em] text-orange-500 text-xs font-black mb-5">

                  STUDENT ATTENDANCE PORTAL

                </p>

                <h1 className="text-6xl md:text-8xl leading-[0.9] tracking-[-0.08em] font-black">

                  Attendance
                  <br />
                  Tracker

                </h1>

                <p className="mt-8 text-2xl text-black/45 leading-relaxed max-w-3xl">

                  Monitor student attendance,
                  manage course presence
                  and track realtime attendance analytics.

                </p>

              </div>

              <motion.div

                animate={{
                  rotate:[0,8,-8,0],
                  y:[0,-10,0]
                }}

                transition={{
                  duration:5,
                  repeat:Infinity
                }}

                className="hidden lg:flex w-40 h-40 rounded-[40px] bg-black text-white items-center justify-center shadow-[0_30px_80px_rgba(0,0,0,0.15)]"

              >

                <FaUserCheck className="text-6xl" />

              </motion.div>

            </div>

          </motion.div>

          {/* STATS */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 mb-8">

            <StatCard
              title="Total Records"
              value={attendance.length}
              icon={<FaChartLine />}
              color="purple"
            />

            <StatCard
              title="Present"
              value={presentCount}
              icon={<FaCheckCircle />}
              color="emerald"
            />

            <StatCard
              title="Absent"
              value={absentCount}
              icon={<FaTimesCircle />}
              color="rose"
            />

          </div>

          {/* TOP BAR */}

          <div className="flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between mb-8">

            {/* SEARCH */}

            <div className="relative flex-1">

              <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-black/35 text-lg" />

              <input

                type="text"

                value={search}

                onChange={(e)=>
                  setSearch(e.target.value)
                }

                placeholder="Search student..."

                className="w-full pl-16 pr-6 h-[68px] rounded-[28px] bg-white border border-black/5 outline-none text-black text-lg shadow-[0_15px_40px_rgba(0,0,0,0.04)]"

              />

            </div>

            {/* BUTTON */}

            {

              (
                userRole === "admin" ||

                userRole === "faculty"

              ) &&

              <motion.button

                whileHover={{
                  scale:1.03,
                  y:-2
                }}

                whileTap={{
                  scale:0.97
                }}

                onClick={()=>{

                  resetForm()
                  setShowModal(true)

                }}

                className="px-8 h-[68px] rounded-[28px] bg-black text-white font-black flex items-center gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.12)]"

              >

                <FaPlus />

                Add Attendance

              </motion.button>

            }

          </div>

          {/* TABLE */}

          {

            loading

            ?

            <div className="h-[400px] flex items-center justify-center">

              <h1 className="text-5xl font-black">

                Loading Attendance...

              </h1>

            </div>

            :

            <div className="rounded-[40px] bg-white border border-black/5 shadow-[0_25px_80px_rgba(0,0,0,0.05)] overflow-hidden">

              {/* HEADER */}

              <div className="grid grid-cols-5 gap-5 px-8 py-6 border-b border-black/5 bg-[#faf7f3]">

                <h1 className="font-black text-black/45 uppercase tracking-[0.2em] text-xs">

                  Student

                </h1>

                <h1 className="font-black text-black/45 uppercase tracking-[0.2em] text-xs">

                  Course

                </h1>

                <h1 className="font-black text-black/45 uppercase tracking-[0.2em] text-xs">

                  Status

                </h1>

                <h1 className="font-black text-black/45 uppercase tracking-[0.2em] text-xs">

                  Date

                </h1>

                <h1 className="font-black text-black/45 uppercase tracking-[0.2em] text-xs">

                  Actions

                </h1>

              </div>

              {/* BODY */}

              <div>

                {

                  filteredAttendance.map((item,index)=>(

                    <motion.div

                      key={item.id}

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

                      whileHover={{
                        backgroundColor:"rgba(0,0,0,0.015)"
                      }}

                      className="grid grid-cols-5 gap-5 px-8 py-6 border-b border-black/5 items-center"

                    >

                      {/* STUDENT */}

                      <div className="flex items-center gap-4">

                        <div className="w-14 h-14 rounded-[20px] bg-violet-100 text-violet-700 flex items-center justify-center text-xl">

                          <FaUserGraduate />

                        </div>

                        <div>

                          <h1 className="font-black text-lg">

                            {item.studentName}

                          </h1>

                          <p className="text-black/35 text-sm">

                            Student Record

                          </p>

                        </div>

                      </div>

                      {/* COURSE */}

                      <div>

                        <div className="inline-flex items-center gap-3 px-4 py-3 rounded-[18px] bg-[#faf7f3] border border-black/5">

                          <FaBookOpen className="text-orange-500" />

                          <span className="font-bold">

                            {item.courseName}

                          </span>

                        </div>

                      </div>

                      {/* STATUS */}

                      <div>

                        {

                          item.status === "Present"

                          ?

                          <div className="inline-flex px-5 py-3 rounded-full bg-emerald-100 text-emerald-700 text-xs uppercase tracking-[0.25em] font-black">

                            Present

                          </div>

                          :

                          <div className="inline-flex px-5 py-3 rounded-full bg-rose-100 text-rose-700 text-xs uppercase tracking-[0.25em] font-black">

                            Absent

                          </div>

                        }

                      </div>

                      {/* DATE */}

                      <div className="flex items-center gap-3">

                        <div className="w-12 h-12 rounded-[18px] bg-cyan-100 text-cyan-700 flex items-center justify-center">

                          <FaCalendarAlt />

                        </div>

                        <div>

                          <h1 className="font-bold">

                            {

                              formatDate(
                                item.createdAt
                              )

                            }

                          </h1>

                        </div>

                      </div>

                      {/* ACTIONS */}

                      {

                        (
                          userRole === "admin" ||

                          userRole === "faculty"

                        ) &&

                        <div className="flex gap-4">

                          <motion.button

                            whileHover={{
                              scale:1.08
                            }}

                            whileTap={{
                              scale:0.95
                            }}

                            onClick={()=>
                              editAttendance(item)
                            }

                            className="w-14 h-14 rounded-[20px] bg-violet-100 text-violet-700 flex items-center justify-center text-lg"

                          >

                            <FaEdit />

                          </motion.button>

                          <motion.button

                            whileHover={{
                              scale:1.08
                            }}

                            whileTap={{
                              scale:0.95
                            }}

                            onClick={()=>
                              deleteAttendance(item.id)
                            }

                            className="w-14 h-14 rounded-[20px] bg-rose-100 text-rose-700 flex items-center justify-center text-lg"

                          >

                            <FaTrash />

                          </motion.button>

                        </div>

                      }

                    </motion.div>

                  ))

                }

              </div>

            </div>

          }



      {/* MODAL */}

      {

        showModal &&

        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[9999] flex items-center justify-center p-4">

          <motion.div

            initial={{
              opacity:0,
              scale:0.9,
              y:40
            }}

            animate={{
              opacity:1,
              scale:1,
              y:0
            }}

            className="w-full max-w-[520px] rounded-[38px] bg-white shadow-[0_40px_120px_rgba(0,0,0,0.12)] border border-black/5 overflow-hidden"

          >

            {/* TOP */}

            <div className="px-8 pt-8 pb-6 border-b border-black/5 flex items-start justify-between">

              <div>

                <p className="uppercase tracking-[0.28em] text-orange-500 text-[10px] font-black mb-3">

                  ATTENDANCE MANAGEMENT

                </p>

                <h1 className="text-[48px] leading-[0.9] tracking-[-0.08em] font-black text-black">

                  {

                    editingAttendance

                    ?

                    "Edit Attendance"

                    :

                    "Add Attendance"

                  }

                </h1>

              </div>

              <button

                onClick={()=>
                  setShowModal(false)
                }

                className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center"

              >

                <FaTimes />

              </button>

            </div>

            {/* FORM */}

            <div className="p-8 space-y-5">

              <input

                value={studentName}

                onChange={(e)=>
                  setStudentName(e.target.value)
                }

                placeholder="Student Name"

                className="w-full h-[58px] px-5 rounded-[20px] bg-[#f7f4f1] border border-black/5 outline-none text-black"

              />

              <input

                value={courseName}

                onChange={(e)=>
                  setCourseName(e.target.value)
                }

                placeholder="Course Name"

                className="w-full h-[58px] px-5 rounded-[20px] bg-[#f7f4f1] border border-black/5 outline-none text-black"

              />

              <select

                value={status}

                onChange={(e)=>
                  setStatus(e.target.value)
                }

                className="w-full h-[58px] px-5 rounded-[20px] bg-[#f7f4f1] border border-black/5 outline-none text-black"

              >

                <option>
                  Present
                </option>

                <option>
                  Absent
                </option>

              </select>

              <motion.button

                whileHover={{
                  scale:1.02
                }}

                whileTap={{
                  scale:0.98
                }}

                onClick={

                  editingAttendance

                  ?

                  updateAttendance

                  :

                  createAttendance

                }

                className="w-full h-[62px] rounded-[22px] bg-black text-white font-black text-lg shadow-[0_20px_50px_rgba(0,0,0,0.12)]"

              >

                {

                  editingAttendance

                  ?

                  "Update Attendance"

                  :

                  "Add Attendance"

                }

              </motion.button>

            </div>

          </motion.div>

        </div>

      }
</div>

    </div>
    </MainLayout>


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
        y:-8,
        scale:1.02
      }}

      className="rounded-[36px] bg-white border border-black/5 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] overflow-hidden relative"

    >

      <div className={`

        absolute top-0 left-0 w-full h-2

        ${color === "purple" && "bg-gradient-to-r from-violet-500 to-fuchsia-500"}
        ${color === "emerald" && "bg-gradient-to-r from-emerald-500 to-green-400"}
        ${color === "rose" && "bg-gradient-to-r from-rose-500 to-red-400"}

      `} />

      <div className="flex items-center justify-between">

        <div>

          <p className="uppercase tracking-[0.25em] text-xs text-black/35 font-black">

            {title}

          </p>

          <h1 className="text-6xl font-black tracking-[-0.06em] mt-6">

            {value}

          </h1>

        </div>

        <div className={`

          w-20 h-20 rounded-[28px]
          flex items-center justify-center
          text-3xl

          ${color === "purple" && "bg-violet-100 text-violet-700"}
          ${color === "emerald" && "bg-emerald-100 text-emerald-700"}
          ${color === "rose" && "bg-rose-100 text-rose-700"}

        `}>

          {icon}

        </div>

      </div>

      <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-sm font-black">

        <FaBolt />

        Live Analytics

      </div>
    </motion.div>

  )

}

export default Attendance