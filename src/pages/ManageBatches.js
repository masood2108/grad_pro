import {
  useEffect,
  useState
} from "react"

import {
  motion
} from "framer-motion"

import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from "firebase/firestore"

import {
  db
} from "../firebase/firebase"

import MainLayout from "../layouts/MainLayout"

import {
  FaUsers,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaClock,
  FaBook,
  FaCheckCircle,
  FaLayerGroup,
  FaBolt
} from "react-icons/fa"

function ManageBatches() {

  const [batches, setBatches] =
  useState([])

  const [courses, setCourses] =
  useState([])

  const [loading, setLoading] =
  useState(true)

  const [showModal, setShowModal] =
  useState(false)

  const [editingBatch, setEditingBatch] =
  useState(null)

  const [batchName, setBatchName] =
  useState("")

  const [courseId, setCourseId] =
  useState("")

  const [courseTitle, setCourseTitle] =
  useState("")

  const [faculty, setFaculty] =
  useState("")

  const [timing, setTiming] =
  useState("")

  const [status, setStatus] =
  useState("Active")

  /* FETCH COURSES */

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

      }

    )

    return () => unsubscribe()

  }, [])

  /* FETCH BATCHES */

  useEffect(() => {

    const unsubscribe = onSnapshot(

      collection(db, "batches"),

      (snapshot) => {

        const data = []

        snapshot.forEach((docItem) => {

          data.push({

            id:docItem.id,
            ...docItem.data()

          })

        })

        setBatches(data)

        setLoading(false)

      }

    )

    return () => unsubscribe()

  }, [])

  /* RESET */

  const resetForm = () => {

    setBatchName("")
    setCourseId("")
    setCourseTitle("")
    setFaculty("")
    setTiming("")
    setStatus("Active")
    setEditingBatch(null)

  }

  /* CREATE */

  const createBatch = async() => {

    if(
      !batchName ||
      !courseId ||
      !faculty ||
      !timing
    ){

      return alert(
        "Fill all fields"
      )

    }

    try{

      await addDoc(

        collection(
          db,
          "batches"
        ),

        {

          batchName,
          courseId,
          courseTitle,
          faculty,
          timing,
          status,

          students:0,

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

  /* UPDATE */

  const updateBatch = async() => {

    try{

      await updateDoc(

        doc(
          db,
          "batches",
          editingBatch.id
        ),

        {

          batchName,
          courseId,
          courseTitle,
          faculty,
          timing,
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

  /* EDIT */

  const editBatch = (batch) => {

    setEditingBatch(batch)

    setBatchName(
      batch.batchName
    )

    setCourseId(
      batch.courseId
    )

    setCourseTitle(
      batch.courseTitle
    )

    setFaculty(
      batch.faculty
    )

    setTiming(
      batch.timing
    )

    setStatus(
      batch.status
    )

    setShowModal(true)

  }

  /* DELETE */

  const deleteBatch = async(id) => {

    const confirmDelete =
    window.confirm(
      "Delete this batch?"
    )

    if(!confirmDelete) return

    try{

      await deleteDoc(

        doc(
          db,
          "batches",
          id
        )

      )

    }

    catch(error){

      console.log(error)

    }

  }

  return (

<MainLayout>

      <div className="flex-1 overflow-y-auto p-8 relative">

        {/* BG */}

        <div className="absolute top-[-180px] right-[-120px] w-[500px] h-[500px] bg-violet-300/20 blur-[140px] rounded-full pointer-events-none" />

        <div className="absolute bottom-[-180px] left-[-120px] w-[500px] h-[500px] bg-orange-300/20 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative z-10">

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

            className="rounded-[45px] bg-white/70 backdrop-blur-3xl border border-white shadow-[0_20px_80px_rgba(0,0,0,0.05)] overflow-hidden relative"

          >

            <div className="relative z-10 p-10 md:p-14 flex items-center justify-between gap-10 flex-wrap">

              <div>

                <p className="uppercase tracking-[0.3em] text-orange-500 text-xs font-black mb-5">

                  BATCH MANAGEMENT SYSTEM

                </p>

                <h1 className="text-6xl md:text-8xl leading-[0.9] tracking-[-0.08em] font-black">

                  Manage
                  <br />
                  Batches

                </h1>

                <p className="mt-8 text-2xl text-black/45 leading-relaxed max-w-3xl">

                  Organize course batches,
                  faculty schedules,
                  timings and students
                  in realtime.

                </p>

                <div className="flex gap-5 mt-10 flex-wrap">

                  <div className="px-7 py-5 rounded-[28px] bg-white border border-black/5 shadow-xl">

                    <p className="uppercase tracking-[0.22em] text-xs text-black/35 font-black">

                      Total Batches

                    </p>

                    <h1 className="text-3xl font-black mt-3">

                      {batches.length}

                    </h1>

                  </div>

                  <div className="px-7 py-5 rounded-[28px] bg-black text-white shadow-xl">

                    <p className="uppercase tracking-[0.22em] text-xs text-white/35 font-black">

                      Active Status

                    </p>

                    <div className="flex items-center gap-3 mt-3">

                      <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />

                      <h1 className="text-3xl font-black">

                        Live

                      </h1>

                    </div>

                  </div>

                </div>

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

                <FaUsers className="text-6xl" />

              </motion.div>

            </div>

          </motion.div>

          {/* ADD BUTTON */}

          <div className="flex justify-end mt-8">

            <motion.button

              whileHover={{
                scale:1.03,
                y:-2
              }}

              whileTap={{
                scale:0.97
              }}

              onClick={() => {

                resetForm()

                setShowModal(true)

              }}

              className="px-8 py-5 rounded-[28px] bg-black text-white font-black text-lg flex items-center gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.12)]"

            >

              <FaPlus />

              Create Batch

            </motion.button>

          </div>

          {/* BATCHES */}

          {

            loading

            ?

            <div className="h-[400px] flex items-center justify-center">

              <h1 className="text-5xl font-black">

                Loading Batches...

              </h1>

            </div>

            :

            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8 mt-8">

              {

                batches.map((batch,index)=>(

                  <motion.div

                    key={batch.id}

                    initial={{
                      opacity:0,
                      y:30
                    }}

                    animate={{
                      opacity:1,
                      y:0
                    }}

                    transition={{
                      delay:index * 0.08
                    }}

                    whileHover={{
                      y:-10
                    }}

                    className="rounded-[40px] overflow-hidden bg-white border border-black/5 shadow-[0_25px_80px_rgba(0,0,0,0.05)]"

                  >

                    <div className="h-2 bg-gradient-to-r from-violet-500 via-orange-400 to-cyan-400" />

                    <div className="p-7">

                      <div className="flex items-center justify-between">

                        <div className="w-20 h-20 rounded-[28px] bg-violet-100 text-violet-700 flex items-center justify-center text-3xl">

                          <FaLayerGroup />

                        </div>

                        <div className={`

                          px-5 py-3 rounded-full text-[10px]
                          uppercase tracking-[0.25em]
                          font-black

                          ${

                            batch.status === "Active"

                            ?

                            "bg-emerald-100 text-emerald-700"

                            :

                            "bg-orange-100 text-orange-600"

                          }

                        `}>

                          {batch.status}

                        </div>

                      </div>

                      <h1 className="mt-8 text-[42px] leading-[0.9] tracking-[-0.08em] font-black">

                        {batch.batchName}
                      </h1>

                      <p className="mt-4 text-orange-500 font-black uppercase tracking-[0.2em] text-xs">

                        {batch.courseTitle}
                      </p>

                      <div className="mt-8 space-y-5">

                        <div className="flex items-center gap-4 text-black/50 font-bold">

                          <FaBook className="text-violet-600" />

                          {batch.faculty}
                        </div>

                        <div className="flex items-center gap-4 text-black/50 font-bold">

                          <FaClock className="text-orange-500" />

                          {batch.timing}
                        </div>

                        <div className="flex items-center gap-4 text-black/50 font-bold">

                          <FaUsers className="text-cyan-500" />

                          {batch.students || 0}
                          {" "}
                          Students
                        </div>

                      </div>

                      {/* ACTIONS */}

                      <div className="grid grid-cols-2 gap-4 mt-8">

                        <button

                          onClick={() =>
                            editBatch(batch)
                          }

                          className="h-[58px] rounded-[22px] bg-violet-100 text-violet-700 font-black flex items-center justify-center gap-3"

                        >

                          <FaEdit />

                          Edit

                        </button>

                        <button

                          onClick={() =>
                            deleteBatch(batch.id)
                          }

                          className="h-[58px] rounded-[22px] bg-rose-100 text-rose-600 font-black flex items-center justify-center gap-3"

                        >

                          <FaTrash />

                          Delete

                        </button>

                      </div>

                    </div>

                  </motion.div>

                ))

              }

            </div>

          }

        </div>

      </div>

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

            className="w-full max-w-[550px] rounded-[38px] bg-white shadow-[0_40px_120px_rgba(0,0,0,0.12)] border border-black/5 overflow-hidden"

          >

            {/* TOP */}

            <div className="px-8 pt-8 pb-6 border-b border-black/5 flex items-start justify-between">

              <div>

                <p className="uppercase tracking-[0.28em] text-orange-500 text-[10px] font-black mb-3">

                  BATCH MANAGEMENT

                </p>

                <h1 className="text-[48px] leading-[0.9] tracking-[-0.08em] font-black">

                  {

                    editingBatch

                    ?

                    "Edit Batch"

                    :

                    "Create Batch"

                  }

                </h1>

              </div>

              <button

                onClick={() =>
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

                value={batchName}

                onChange={(e)=>
                  setBatchName(e.target.value)
                }

                placeholder="Batch Name"

                className="w-full h-[60px] px-5 rounded-[20px] bg-[#f7f4f1] border border-black/5 outline-none"

              />

              <select

                value={courseId}

                onChange={(e)=>{

                  setCourseId(
                    e.target.value
                  )

                  const selectedCourse =
                  courses.find(

                    (course)=>

                      course.id ===
                      e.target.value

                  )

                  setCourseTitle(

                    selectedCourse?.title || ""

                  )

                }}

                className="w-full h-[60px] px-5 rounded-[20px] bg-[#f7f4f1] border border-black/5 outline-none"

              >

                <option value="">
                  Select Course
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

              <input

                value={faculty}

                onChange={(e)=>
                  setFaculty(e.target.value)
                }

                placeholder="Faculty Name"

                className="w-full h-[60px] px-5 rounded-[20px] bg-[#f7f4f1] border border-black/5 outline-none"

              />

              <input

                value={timing}

                onChange={(e)=>
                  setTiming(e.target.value)
                }

                placeholder="Batch Timing"

                className="w-full h-[60px] px-5 rounded-[20px] bg-[#f7f4f1] border border-black/5 outline-none"

              />

              <select

                value={status}

                onChange={(e)=>
                  setStatus(e.target.value)
                }

                className="w-full h-[60px] px-5 rounded-[20px] bg-[#f7f4f1] border border-black/5 outline-none"

              >

                <option>
                  Active
                </option>

                <option>
                  Upcoming
                </option>

                <option>
                  Completed
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

                  editingBatch

                  ?

                  updateBatch

                  :

                  createBatch

                }

                className="w-full h-[64px] rounded-[22px] bg-black text-white font-black text-lg shadow-[0_20px_50px_rgba(0,0,0,0.12)] flex items-center justify-center gap-3"

              >

                {

                  editingBatch

                  ?

                  "Update Batch"

                  :

                  "Create Batch"

                }

                <FaBolt />

              </motion.button>

            </div>

          </motion.div>

        </div>

      }

</MainLayout>

  )

}

export default ManageBatches