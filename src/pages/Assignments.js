/* eslint-disable no-unused-vars */
import {
  useEffect,
  useState
} from "react"

import {
  motion
} from "framer-motion"

import {
  useNavigate
} from "react-router-dom"

import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  getDoc,
  doc,
  deleteDoc,
  updateDoc
} from "firebase/firestore"

import {
  db,
  auth
} from "../firebase/firebase"

import axios from "axios"

import MainLayout from "../layouts/MainLayout"
import Navbar from "../components/Navbar"

import {
  FaTasks,
  FaPlus,
  FaTimes,
  FaLock,
  FaCalendarAlt,
  FaUpload,
  FaFilePdf,
  FaArrowRight,
  FaBookOpen,
  FaEdit,
  FaTrash
} from "react-icons/fa"

function Assignments() {

  const navigate = useNavigate()

  const [assignments, setAssignments] =
  useState([])

  const [loading, setLoading] =
  useState(true)

  const [showModal, setShowModal] =
  useState(false)

  const [editingAssignment, setEditingAssignment] =
  useState(null)

  const [userRole, setUserRole] =
  useState("student")

  const [userName, setUserName] =
  useState("")

  const [title, setTitle] =
  useState("")

  const [description, setDescription] =
  useState("")

  const [deadline, setDeadline] =
  useState("")

  const [submissionFile, setSubmissionFile] =
  useState(null)

  const [uploading, setUploading] =
  useState(false)

  useEffect(() => {

    const getRole = async() => {

      const user =
      auth.currentUser

      if(user){

        const userRef =
        doc(db, "users", user.uid)

        const userSnap =
        await getDoc(userRef)

        if(userSnap.exists()){

          setUserRole(
            userSnap.data().role
          )

          setUserName(
            userSnap.data().name
          )

        }

      }

    }

    getRole()

  }, [])

  useEffect(() => {

    const unsubscribe =

      onSnapshot(

        collection(db, "assignments"),

        (snapshot) => {

          const data = []

          snapshot.forEach((doc) => {

            data.push({

              id:doc.id,
              ...doc.data()

            })

          })

          setAssignments(data)

          setLoading(false)

        }

      )

    return () => unsubscribe()

  }, [])

  const resetForm = () => {

    setTitle("")
    setDescription("")
    setDeadline("")
    setEditingAssignment(null)

  }

  const createAssignment = async() => {

    if(
      userRole !== "admin" &&
      userRole !== "faculty"
    ){

      return alert(
        "Access Denied"
      )

    }

    if(
      !title ||
      !deadline
    ){

      return alert(
        "Fill all fields"
      )

    }

    try{

      await addDoc(

        collection(
          db,
          "assignments"
        ),

        {
          title,
          description,
          deadline,
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

  const updateAssignment = async() => {

    try{

      await updateDoc(

        doc(
          db,
          "assignments",
          editingAssignment.id
        ),

        {
          title,
          description,
          deadline
        }

      )

      resetForm()

      setShowModal(false)

    }

    catch(error){

      console.log(error)

    }

  }

  const editAssignment = (
    assignment
  ) => {

    setEditingAssignment(
      assignment
    )

    setTitle(
      assignment.title
    )

    setDescription(
      assignment.description
    )

    setDeadline(
      assignment.deadline
    )

    setShowModal(true)

  }

  const deleteAssignment = async(id) => {

    const confirmDelete =
    window.confirm(
      "Delete Assignment?"
    )

    if(!confirmDelete){

      return
    }

    try{

      await deleteDoc(

        doc(
          db,
          "assignments",
          id
        )

      )

    }

    catch(error){

      console.log(error)

    }

  }

  const uploadSubmission = async(
    assignmentId
  ) => {

    if(!submissionFile){

      return alert(
        "Select PDF File"
      )

    }

    try{

      setUploading(true)

      const formData =
      new FormData()

      formData.append(
        "file",
        submissionFile
      )

      formData.append(
        "upload_preset",
        "99dxxxx"
      )

      const response =
      await axios.post(

        "https://api.cloudinary.com/v1_1/dvic2uies/auto/upload",

        formData

      )

      const fileUrl =
      response.data.secure_url

      await addDoc(

        collection(
          db,
          "submissions"
        ),

        {
          assignmentId,
          studentName:userName,
          studentId:
          auth.currentUser.uid,
          fileUrl,
          submittedAt:
          serverTimestamp(),
          marks:null,
          feedback:"Pending Review"
        }

      )

      alert(
        "Assignment Submitted Successfully"
      )

      setSubmissionFile(null)

    }

    catch(error){

      console.log(error)

      alert(
        "Upload Failed"
      )

    }

    finally{

      setUploading(false)

    }

  }

  const isDeadlinePassed = (
    deadlineDate
  ) => {

    const today =
    new Date()

    const deadlineObj =
    new Date(deadlineDate)

    return today > deadlineObj

  }

  return (

<MainLayout>


        <div className="absolute top-[-200px] right-[-120px] w-[500px] h-[500px] bg-violet-300/20 blur-[140px] rounded-full pointer-events-none" />

        <div className="absolute bottom-[-200px] left-[-120px] w-[500px] h-[500px] bg-orange-300/20 blur-[140px] rounded-full pointer-events-none" />

        <div className="h-full overflow-y-auto overflow-x-hidden p-6 relative z-10">



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

                  LMS ASSIGNMENT PORTAL

                </p>

                <h1 className="text-6xl md:text-8xl leading-[0.9] tracking-[-0.08em] font-black">

                  Assignments

                </h1>

                <p className="mt-8 text-2xl text-black/45 leading-relaxed max-w-3xl">

                  Submit assignments,
                  manage coursework,
                  review submissions
                  and track deadlines
                  in realtime.

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

                <FaBookOpen className="text-6xl" />

              </motion.div>

            </div>

          </motion.div>


          <div className="flex items-center justify-between mt-8 mb-8 flex-wrap gap-5">

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

                className="ml-auto px-8 py-5 rounded-[28px] bg-black text-white font-black flex items-center gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.12)]"

              >

                <FaPlus />

                Create Assignment

              </motion.button>

            }

          </div>


          {

            loading

            ?

            <div className="h-[400px] flex items-center justify-center">

              <h1 className="text-5xl font-black">

                Loading...

              </h1>

            </div>

            :

            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">

              {

                assignments.map((assignment,index)=>(

                  <motion.div

                    key={assignment.id}

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

                    className="rounded-[38px] bg-white border border-black/5 overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.05)]"

                  >

                    <div className="relative p-7 overflow-hidden">

                      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 via-cyan-400 to-orange-400" />

                      <div className="flex items-center justify-between">

                        <div className="w-20 h-20 rounded-[28px] bg-violet-100 text-violet-700 flex items-center justify-center text-3xl">

                          <FaTasks />

                        </div>

                        {

                          isDeadlinePassed(
                            assignment.deadline
                          )

                          ?

                          <div className="px-5 py-3 rounded-full bg-rose-100 text-rose-600 text-[11px] uppercase tracking-[0.25em] font-black">

                            Closed

                          </div>

                          :

                          <div className="px-5 py-3 rounded-full bg-emerald-100 text-emerald-600 text-[11px] uppercase tracking-[0.25em] font-black">

                            Active

                          </div>

                        }

                      </div>

                      <h1 className="mt-8 text-[52px] leading-[0.9] tracking-[-0.08em] font-black text-black">

                        {assignment.title}

                      </h1>

                      <p className="mt-6 text-black/45 text-[17px] leading-relaxed">

                        {assignment.description}

                      </p>

                    </div>

                    <div className="px-7 pb-7">

                      <div className="rounded-[28px] bg-[#f8f4ef] border border-black/5 p-5 flex items-center gap-4">

                        <div className="w-14 h-14 rounded-[22px] bg-orange-100 text-orange-600 flex items-center justify-center text-xl">

                          <FaCalendarAlt />

                        </div>

                        <div>

                          <p className="uppercase tracking-[0.22em] text-xs font-black text-black/35">

                            Deadline

                          </p>

                          <h1 className="text-xl font-black mt-1">

                            {assignment.deadline}

                          </h1>

                        </div>

                      </div>

                      {

                        userRole === "student" &&

                        !isDeadlinePassed(
                          assignment.deadline
                        ) &&

                        <div className="mt-6">

                          <label className="w-full h-[90px] rounded-[28px] border-2 border-dashed border-black/10 bg-[#faf7f3] flex items-center justify-center cursor-pointer group transition-all hover:border-violet-400">

                            <div className="flex items-center gap-4">

                              <div className="w-14 h-14 rounded-[20px] bg-black text-white flex items-center justify-center text-xl group-hover:scale-110 transition-all">

                                <FaUpload />

                              </div>

                              <div>

                                <h1 className="font-black text-lg">

                                  Upload PDF

                                </h1>

                                <p className="text-black/40 text-sm">

                                  Select assignment file

                                </p>

                              </div>

                            </div>

                            <input

                              type="file"

                              hidden

                              accept=".pdf"

                              onChange={(e)=>
                                setSubmissionFile(
                                  e.target.files[0]
                                )
                              }

                            />

                          </label>

                          {

                            submissionFile &&

                            <div className="mt-4 rounded-[22px] bg-emerald-100 text-emerald-700 p-4 flex items-center gap-3 font-bold">

                              <FaFilePdf />

                              {submissionFile.name}

                            </div>

                          }

                          <motion.button

                            whileHover={{
                              scale:1.02
                            }}

                            whileTap={{
                              scale:0.98
                            }}

                            onClick={()=>
                              uploadSubmission(
                                assignment.id
                              )
                            }

                            disabled={uploading}

                            className="w-full h-[62px] mt-5 rounded-[24px] bg-black text-white font-black text-lg shadow-[0_20px_50px_rgba(0,0,0,0.12)]"

                          >

                            {

                              uploading

                              ?

                              "Submitting..."

                              :

                              "Submit Assignment"

                            }

                          </motion.button>

                        </div>

                      }

                      {

                        (
                          userRole === "admin" ||

                          userRole === "faculty"
                        ) &&

                        <div className="grid grid-cols-2 gap-4 mt-6">

                          <motion.button

                            whileHover={{
                              scale:1.02
                            }}

                            whileTap={{
                              scale:0.98
                            }}

                            onClick={()=>
                              navigate(
                                `/assignment/${assignment.id}`
                              )
                            }

                            className="h-[62px] rounded-[24px] bg-black text-white font-black text-lg flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.12)]"

                          >

                            View

                            <FaArrowRight />

                          </motion.button>

                          <motion.button

                            whileHover={{
                              scale:1.02
                            }}

                            whileTap={{
                              scale:0.98
                            }}

                            onClick={()=>
                              editAssignment(
                                assignment
                              )
                            }

                            className="h-[62px] rounded-[24px] bg-violet-100 text-violet-700 font-black text-lg flex items-center justify-center gap-3"

                          >

                            <FaEdit />

                            Edit

                          </motion.button>

                        </div>

                      }

                      {

                        (
                          userRole === "admin" ||

                          userRole === "faculty"
                        ) &&

                        <motion.button

                          whileHover={{
                            scale:1.02
                          }}

                          whileTap={{
                            scale:0.98
                          }}

                          onClick={()=>
                            deleteAssignment(
                              assignment.id
                            )
                          }

                          className="w-full h-[62px] mt-4 rounded-[24px] bg-rose-100 text-rose-600 font-black text-lg flex items-center justify-center gap-3"

                        >

                          <FaTrash />

                          Delete Assignment

                        </motion.button>

                      }

                    </div>

                  </motion.div>

                ))

              }

            </div>

          }

        </div>



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

              <div className="px-8 pt-8 pb-6 border-b border-black/5 flex items-start justify-between">

                <div>

                  <p className="uppercase tracking-[0.28em] text-orange-500 text-[10px] font-black mb-3">

                    ASSIGNMENT MANAGEMENT

                  </p>

                  <h1 className="text-[48px] leading-[0.9] tracking-[-0.08em] font-black text-black">

                    {

                      editingAssignment

                      ?

                      "Edit Assignment"

                      :

                      "Create Assignment"

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

              <div className="p-8 space-y-5">

                <input

                  value={title}

                  onChange={(e)=>
                    setTitle(e.target.value)
                  }

                  placeholder="Assignment Title"

                  className="w-full h-[58px] px-5 rounded-[20px] bg-[#f7f4f1] border border-black/5 outline-none text-black"

                />

                <textarea

                  value={description}

                  onChange={(e)=>
                    setDescription(e.target.value)
                  }

                  placeholder="Description"

                  rows="4"

                  className="w-full px-5 py-4 rounded-[20px] bg-[#f7f4f1] border border-black/5 outline-none text-black resize-none"

                />

                <input

                  type="date"

                  value={deadline}

                  onChange={(e)=>
                    setDeadline(e.target.value)
                  }

                  className="w-full h-[58px] px-5 rounded-[20px] bg-[#f7f4f1] border border-black/5 outline-none text-black"

                />

                <motion.button

                  whileHover={{
                    scale:1.02
                  }}

                  whileTap={{
                    scale:0.98
                  }}

                  onClick={

                    editingAssignment

                    ?

                    updateAssignment

                    :

                    createAssignment

                  }

                  className="w-full h-[62px] rounded-[22px] bg-black text-white font-black text-lg shadow-[0_20px_50px_rgba(0,0,0,0.12)]"

                >

                  {

                    editingAssignment

                    ?

                    "Update Assignment"

                    :

                    "Create Assignment"

                  }

                </motion.button>

              </div>

            </motion.div>

          </div>

        }

      </MainLayout>

  )

}

export default Assignments