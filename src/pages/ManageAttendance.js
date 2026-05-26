/* eslint-disable no-unused-vars */
import {
  useEffect,
  useState
} from "react"

import { motion } from "framer-motion"

import {
  collection,
  onSnapshot,
  query,
  where,
  addDoc,
  serverTimestamp,
  getDoc,
  doc
} from "firebase/firestore"

import {
  db,
  auth
} from "../firebase/firebase"

import MainLayout from "../layouts/MainLayout"

import {

  FaClipboardCheck,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaBookOpen,
  FaBolt,
  FaCalendarAlt,
  FaUserGraduate,
  FaArrowRight,
  FaLayerGroup,
  FaFire

} from "react-icons/fa"

function ManageAttendance() {

  const [courses, setCourses] =
  useState([])

  const [selectedCourse, setSelectedCourse] =
  useState("")

  const [students, setStudents] =
  useState([])

  const [attendanceData, setAttendanceData] =
  useState({})

  const [userRole, setUserRole] =
  useState("student")

  const [loading, setLoading] =
  useState(true)

  // GET USER ROLE

  useEffect(() => {

    const getUserRole = async() => {

      const user =
      auth.currentUser

      if(user){

        const userRef =
        doc(
          db,
          "users",
          user.uid
        )

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

  // GET COURSES

  useEffect(() => {

    const unsubscribe = onSnapshot(

      collection(db, "courses"),

      (snapshot) => {

        const data = []

        snapshot.forEach((docItem) => {

          data.push({

            id:docItem.id,
            ...docItem.data()

          })

        })

        setCourses(data)

        setLoading(false)

      }

    )

    return () => unsubscribe()

  }, [])

  // GET ENROLLED STUDENTS

  useEffect(() => {

    if(!selectedCourse) return

    const q = query(

      collection(db, "enrollments"),

      where(
        "courseId",
        "==",
        selectedCourse
      )

    )

    const unsubscribe = onSnapshot(

      q,

      (snapshot) => {

        const data = []

        snapshot.forEach((docItem) => {

          data.push({

            id:docItem.id,
            ...docItem.data()

          })

        })

        setStudents(data)

      }

    )

    return () => unsubscribe()

  }, [selectedCourse])

  // MARK ATTENDANCE

  const markAttendance = (

    studentId,
    status

  ) => {

    setAttendanceData({

      ...attendanceData,

      [studentId]:status

    })

  }

  // SAVE ATTENDANCE

  const saveAttendance = async() => {

    if(!selectedCourse){

      return alert(
        "Select Course"
      )

    }

    try{

      for(

        let i = 0;

        i < students.length;

        i++

      ){

        const student =
        students[i]

        await addDoc(

          collection(
            db,
            "attendance"
          ),

          {
            studentName:
            student.studentName,

            studentEmail:
            student.studentEmail,

            studentId:
            student.studentId,

            courseId:
            student.courseId,

            courseTitle:
            student.courseTitle,

            status:

            attendanceData[
              student.id
            ] || "Absent",

            date:
            new Date()
            .toLocaleDateString(),

            createdAt:
            serverTimestamp()
          }

        )

      }

      alert(
        "Attendance Saved Successfully"
      )

      setAttendanceData({})

    }

    catch(error){

      console.log(error)

    }

  }

  const presentCount =

  Object.values(
    attendanceData
  ).filter(
    (status)=>
    status === "Present"
  ).length

  const absentCount =

  Object.values(
    attendanceData
  ).filter(
    (status)=>
    status === "Absent"
  ).length

  // ACCESS DENIED

  if(

    userRole !== "admin" &&

    userRole !== "faculty"

  ){

    return (

      <div className="h-screen bg-[#f6efe7] flex items-center justify-center">

        <div className="text-center">

          <div className="w-28 h-28 rounded-[32px] bg-black text-white flex items-center justify-center text-4xl mx-auto shadow-[0_20px_60px_rgba(0,0,0,0.15)]">

            <FaTimesCircle />

          </div>

          <h1 className="text-6xl font-black mt-8 text-black">

            Access Denied

          </h1>

          <p className="text-black/40 mt-4 text-xl">

            Only faculty/admin can manage attendance.

          </p>

        </div>

      </div>

    )

  }

  return (

    <MainLayout>

      <div className="flex-1 min-w-0 overflow-hidden relative">

        {/* BACKGROUND */}

        <div className="absolute top-[-220px] right-[-120px] w-[500px] h-[500px] bg-violet-300/20 blur-[140px] rounded-full pointer-events-none" />

        <div className="absolute bottom-[-220px] left-[-120px] w-[500px] h-[500px] bg-orange-300/20 blur-[140px] rounded-full pointer-events-none" />

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

            className="mt-6 rounded-[45px] bg-white border border-black/5 shadow-[0_20px_80px_rgba(0,0,0,0.05)] overflow-hidden relative"

          >

            <div className="absolute top-[-120px] right-[-100px] w-[320px] h-[320px] bg-violet-300/20 blur-[120px] rounded-full" />

            <div className="absolute bottom-[-120px] left-[-100px] w-[320px] h-[320px] bg-orange-300/20 blur-[120px] rounded-full" />

            <div className="relative z-10 p-10 md:p-14">

              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">

                <div>

                  <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-orange-100 text-orange-600 text-xs font-black uppercase tracking-[0.28em]">

                    <FaFire />

                    ATTENDANCE MANAGEMENT

                  </div>

                  <h1 className="text-6xl md:text-8xl leading-[0.9] tracking-[-0.08em] font-black mt-8">

                    Attendance
                  </h1>

                  <p className="mt-8 text-black/45 text-2xl max-w-3xl leading-relaxed">

                    Smart realtime attendance
                    system for faculty,
                    student tracking
                    and performance monitoring.

                  </p>

                  <div className="flex flex-wrap gap-5 mt-10">

                    <TopCard
                      title="Courses"
                      value={courses.length}
                      icon={<FaBookOpen />}
                    />

                    <TopCard
                      title="Students"
                      value={students.length}
                      icon={<FaUsers />}
                    />

                    <TopCard
                      title="Present"
                      value={presentCount}
                      icon={<FaCheckCircle />}
                    />

                  </div>

                </div>

                {/* RIGHT */}

                <motion.div

                  animate={{
                    rotate:[0,8,-8,0],
                    y:[0,-10,0]
                  }}

                  transition={{
                    duration:5,
                    repeat:Infinity
                  }}

                  className="hidden xl:flex w-44 h-44 rounded-[40px] bg-black text-white items-center justify-center shadow-[0_30px_90px_rgba(0,0,0,0.15)]"

                >

                  <FaClipboardCheck className="text-6xl" />

                </motion.div>

              </div>

            </div>

          </motion.div>

          {/* COURSE SELECT */}

          <div className="mt-8 rounded-[40px] bg-white border border-black/5 shadow-[0_20px_80px_rgba(0,0,0,0.05)] p-8">

            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

              <div>

                <p className="uppercase tracking-[0.24em] text-xs text-orange-500 font-black">

                  COURSE MANAGEMENT

                </p>

                <h1 className="text-4xl font-black mt-4">

                  Select Course
                </h1>

                <p className="text-black/40 mt-3 text-lg">

                  Choose course to manage student attendance.

                </p>

              </div>

              <div className="w-full xl:w-[450px]">

                <select

                  value={selectedCourse}

                  onChange={(e)=>
                    setSelectedCourse(
                      e.target.value
                    )
                  }

                  className="w-full h-[72px] px-6 rounded-[28px] bg-[#f8f4ef] border border-black/5 outline-none text-lg font-semibold shadow-lg"

                >

                  <option value="">

                    Choose Course

                  </option>

                  {

                    courses.map((course)=>(

                      <option

                        key={course.id}

                        value={course.id}

                      >

                        {course.title}

                      </option>

                    ))

                  }

                </select>

              </div>

            </div>

          </div>

          {/* STUDENTS */}

          {

            selectedCourse &&

            <div className="mt-8 rounded-[40px] bg-white border border-black/5 overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.05)]">

              {/* HEADER */}

              <div className="p-8 border-b border-black/5 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

                <div>

                  <p className="uppercase tracking-[0.24em] text-xs text-violet-600 font-black">

                    ATTENDANCE PANEL

                  </p>

                  <h1 className="text-4xl font-black mt-4">

                    Enrolled Students
                  </h1>

                  <p className="text-black/40 mt-3 text-lg">

                    Mark attendance realtime.

                  </p>

                </div>

                <div className="flex gap-4 flex-wrap">

                  <SmallCard
                    title="Present"
                    value={presentCount}
                    color="emerald"
                  />

                  <SmallCard
                    title="Absent"
                    value={absentCount}
                    color="rose"
                  />

                  <SmallCard
                    title="Total"
                    value={students.length}
                    color="violet"
                  />

                </div>

              </div>

              {

                students.length === 0

                ?

                <div className="h-[350px] flex flex-col items-center justify-center text-center">

                  <div className="w-24 h-24 rounded-[30px] bg-violet-100 text-violet-600 flex items-center justify-center text-4xl mb-6">

                    <FaBookOpen />

                  </div>

                  <h1 className="text-5xl font-black">

                    No Students Enrolled

                  </h1>

                  <p className="text-black/40 mt-4 text-xl">

                    Students will appear here after enrollment.

                  </p>

                </div>

                :

                <div className="p-8 grid grid-cols-1 xl:grid-cols-2 gap-6">

                  {

                    students.map((student,index)=>(

                      <motion.div

                        key={student.id}

                        initial={{
                          opacity:0,
                          y:20
                        }}

                        animate={{
                          opacity:1,
                          y:0
                        }}

                        transition={{
                          delay:index * 0.04
                        }}

                        whileHover={{
                          y:-5
                        }}

                        className="rounded-[32px] border border-black/5 bg-[#faf7f3] p-6"

                      >

                        <div className="flex items-center justify-between gap-5">

                          {/* LEFT */}

                          <div className="flex items-center gap-5">

                            <div className="w-20 h-20 rounded-[26px] bg-black text-white flex items-center justify-center text-2xl font-black shadow-xl">

                              {

                                student.studentName
                                ?.charAt(0)
                                ?.toUpperCase()

                              }

                            </div>

                            <div>

                              <h1 className="text-2xl font-black">

                                {student.studentName}

                              </h1>

                              <p className="text-black/40 mt-2">

                                {student.studentEmail}

                              </p>

                            </div>

                          </div>

                          {/* STATUS */}

                          {

                            attendanceData[
                              student.id
                            ] === "Present"

                            ?

                            <div className="px-5 py-3 rounded-full bg-emerald-100 text-emerald-700 text-xs uppercase tracking-[0.22em] font-black">

                              Present
                            </div>

                            :

                            attendanceData[
                              student.id
                            ] === "Absent"

                            ?

                            <div className="px-5 py-3 rounded-full bg-rose-100 text-rose-700 text-xs uppercase tracking-[0.22em] font-black">

                              Absent
                            </div>

                            :

                            <div className="px-5 py-3 rounded-full bg-yellow-100 text-yellow-700 text-xs uppercase tracking-[0.22em] font-black">

                              Pending
                            </div>

                          }

                        </div>

                        {/* BUTTONS */}

                        <div className="grid grid-cols-2 gap-4 mt-7">

                          <motion.button

                            whileHover={{
                              scale:1.02
                            }}

                            whileTap={{
                              scale:0.98
                            }}

                            onClick={() =>
                              markAttendance(
                                student.id,
                                "Present"
                              )
                            }

                            className={`

                              h-[62px]
                              rounded-[24px]
                              font-black
                              flex items-center justify-center gap-3
                              transition-all

                              ${

                                attendanceData[
                                  student.id
                                ] === "Present"

                                ?

                                "bg-emerald-500 text-white shadow-[0_20px_40px_rgba(16,185,129,0.25)]"

                                :

                                "bg-emerald-100 text-emerald-700"

                              }

                            `}

                          >

                            <FaCheckCircle />

                            Present

                          </motion.button>

                          <motion.button

                            whileHover={{
                              scale:1.02
                            }}

                            whileTap={{
                              scale:0.98
                            }}

                            onClick={() =>
                              markAttendance(
                                student.id,
                                "Absent"
                              )
                            }

                            className={`

                              h-[62px]
                              rounded-[24px]
                              font-black
                              flex items-center justify-center gap-3
                              transition-all

                              ${

                                attendanceData[
                                  student.id
                                ] === "Absent"

                                ?

                                "bg-rose-500 text-white shadow-[0_20px_40px_rgba(244,63,94,0.25)]"

                                :

                                "bg-rose-100 text-rose-700"

                              }

                            `}

                          >

                            <FaTimesCircle />

                            Absent

                          </motion.button>

                        </div>

                      </motion.div>

                    ))

                  }

                </div>

              }

              {/* SAVE */}

              {

                students.length > 0 &&

                <div className="p-8 border-t border-black/5 bg-white">

                  <motion.button

                    whileHover={{
                      scale:1.01
                    }}

                    whileTap={{
                      scale:0.99
                    }}

                    onClick={saveAttendance}

                    className="w-full h-[74px] rounded-[30px] bg-black text-white font-black text-xl flex items-center justify-center gap-4 shadow-[0_20px_60px_rgba(0,0,0,0.12)]"

                  >

                    <FaClipboardCheck />

                    Save Attendance

                    <FaArrowRight />

                  </motion.button>

                </div>

              }

            </div>

          }

        </div>

      </div>

</MainLayout>
  )

}

function TopCard({

  title,
  value,
  icon

}) {

  return (

    <motion.div

      whileHover={{
        y:-4
      }}

      className="px-7 py-6 rounded-[28px] bg-[#f8f4ef] border border-black/5"

    >

      <div className="flex items-center gap-5">

        <div className="w-14 h-14 rounded-[20px] bg-black text-white flex items-center justify-center text-xl">

          {icon}

        </div>

        <div>

          <p className="uppercase tracking-[0.22em] text-xs font-black text-black/35">

            {title}

          </p>

          <h1 className="text-3xl font-black mt-2">

            {value}

          </h1>

        </div>

      </div>

    </motion.div>

  )

}

function SmallCard({

  title,
  value,
  color

}) {

  return (

    <div className={`

      px-6 py-5 rounded-[24px] border font-black

      ${color === "emerald" && "bg-emerald-100 text-emerald-700 border-emerald-200"}
      ${color === "rose" && "bg-rose-100 text-rose-700 border-rose-200"}
      ${color === "violet" && "bg-violet-100 text-violet-700 border-violet-200"}

    `}>

      <p className="uppercase tracking-[0.22em] text-[10px]">

        {title}

      </p>

      <h1 className="text-3xl mt-2">

        {value}

      </h1>

    </div>

  )

}

export default ManageAttendance