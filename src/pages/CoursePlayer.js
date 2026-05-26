/* eslint-disable no-unused-vars */

import { useEffect, useState } from "react"

import { motion } from "framer-motion"

import {
  useParams
} from "react-router-dom"

import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  getDocs
} from "firebase/firestore"

import {
  db,
  auth
} from "../firebase/firebase"

import MainLayout from "../layouts/MainLayout"

import {
  FaPlayCircle,
  FaClock,
  FaCheckCircle,
  FaLock,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaGraduationCap,
  FaLayerGroup,
  FaArrowRight,
  FaBolt
} from "react-icons/fa"

function CoursePlayer() {

  const { id } = useParams()

  const [course, setCourse] =
  useState(null)

  const [lessons, setLessons] =
  useState([])

  const [selectedLesson, setSelectedLesson] =
  useState(null)

  const [loading, setLoading] =
  useState(true)

  const [userRole, setUserRole] =
  useState("student")

  const [showModal, setShowModal] =
  useState(false)

  const [editingLesson, setEditingLesson] =
  useState(null)

  const [lessonTitle, setLessonTitle] =
  useState("")

  const [lessonDuration, setLessonDuration] =
  useState("")

  const [videoUrl, setVideoUrl] =
  useState("")

  const [lessonOrder, setLessonOrder] =
  useState("")

  const [completedLessons, setCompletedLessons] =
  useState([])

  const [progressPercentage, setProgressPercentage] =
  useState(0)


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


  useEffect(() => {

    const getCourse = async() => {

      try{

        const courseRef =
        doc(
          db,
          "courses",
          id
        )

        const courseSnap =
        await getDoc(courseRef)

        if(courseSnap.exists()){

          setCourse({

            id:courseSnap.id,
            ...courseSnap.data()

          })

        }

      }

      catch(error){

        console.log(error)

      }

    }

    getCourse()

  }, [id])


  useEffect(() => {

    const lessonsQuery = query(

      collection(db, "lessons"),

      where(
        "courseId",
        "==",
        id
      ),

      orderBy("order")

    )

    const unsubscribe = onSnapshot(

      lessonsQuery,

      (snapshot) => {

        const data = []

        snapshot.forEach((docItem) => {

          data.push({

            id:docItem.id,
            ...docItem.data()

          })

        })

        setLessons(data)

        if(data.length > 0){

          setSelectedLesson(data[0])

        }

        setLoading(false)

      }

    )

    return () => unsubscribe()

  }, [id])


  useEffect(() => {

    const getProgress = async() => {

      const user =
      auth.currentUser

      if(!user) return

      try{

        const progressQuery = query(

          collection(
            db,
            "lessonProgress"
          ),

          where(
            "studentId",
            "==",
            user.uid
          ),

          where(
            "courseId",
            "==",
            id
          )

        )

        const progressSnap =
        await getDocs(
          progressQuery
        )

        const completed = []

        progressSnap.forEach((docItem)=>{

          completed.push(
            docItem.data().lessonId
          )

        })

        setCompletedLessons(
          completed
        )

      }

      catch(error){

        console.log(error)

      }

    }

    getProgress()

  }, [id])


  useEffect(() => {

    if(lessons.length > 0){

      const percentage = Math.round(

        (
          completedLessons.length /
          lessons.length
        ) * 100

      )

      setProgressPercentage(
        percentage
      )

    }

  }, [completedLessons, lessons])


  const resetForm = () => {

    setLessonTitle("")
    setLessonDuration("")
    setVideoUrl("")
    setLessonOrder("")
    setEditingLesson(null)

  }


  const completeLesson = async(lesson) => {
  console.log("RUNNING COMPLETE")
    try{

      const user =
      auth.currentUser

      if(!user) return

      if(

        completedLessons.includes(
          lesson.id
        )

      ){

        return
      }

      await addDoc(

        collection(
          db,
          "lessonProgress"
        ),

        {

          studentId:user.uid,

          courseId:id,

          lessonId:lesson.id,

          completed:true,

          completedAt:
          serverTimestamp()

        }

      )

      setCompletedLessons([

        ...completedLessons,
        lesson.id

      ])

    }

    catch(error){

      console.log(error)

    }

  }


  const createLesson = async() => {

    if(
      userRole !== "admin" &&
      userRole !== "faculty"
    ){

      return alert(
        "Access Denied"
      )

    }

    if(
      !lessonTitle ||
      !videoUrl
    ){

      return alert(
        "Fill all fields"
      )

    }

    try{

      await addDoc(

        collection(
          db,
          "lessons"
        ),

        {

          courseId:id,

          title:lessonTitle,

          duration:lessonDuration,

          videoUrl:videoUrl,

          order:Number(
            lessonOrder
          ),

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


  const updateLesson = async() => {

    try{

      await updateDoc(

        doc(
          db,
          "lessons",
          editingLesson.id
        ),

        {

          title:lessonTitle,

          duration:lessonDuration,

          videoUrl:videoUrl,

          order:Number(
            lessonOrder
          )

        }

      )

      resetForm()

      setShowModal(false)

    }

    catch(error){

      console.log(error)

    }

  }


  const editLesson = (lesson) => {

    setEditingLesson(lesson)

    setLessonTitle(
      lesson.title
    )

    setLessonDuration(
      lesson.duration
    )

    setVideoUrl(
      lesson.videoUrl
    )

    setLessonOrder(
      lesson.order
    )

    setShowModal(true)

  }


  const deleteLesson = async(id) => {

    const confirmDelete =
    window.confirm(
      "Delete this lesson?"
    )

    if(!confirmDelete) return

    try{

      await deleteDoc(

        doc(
          db,
          "lessons",
          id
        )

      )

    }

    catch(error){

      console.log(error)

    }

  }

  if(loading){

    return (

      <div className="h-screen bg-[#f6efe7] flex items-center justify-center">

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

          <div className="w-24 h-24 rounded-[30px] bg-black text-white flex items-center justify-center">

            <FaBolt className="text-4xl" />

          </div>

          <h1 className="mt-6 text-4xl font-black">

            Loading Course...

          </h1>

        </motion.div>

      </div>

    )

  }

  return (

    <MainLayout>

      <div className="relative">


        <motion.div

          initial={{
            opacity:0,
            y:20
          }}

          animate={{
            opacity:1,
            y:0
          }}

          className="rounded-[45px] bg-white border border-black/5 overflow-hidden relative"

        >

          <div className="p-10 md:p-14">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">

              <div>

                <p className="uppercase tracking-[0.3em] text-orange-500 text-xs font-black mb-5">

                  IMMERSIVE COURSE EXPERIENCE

                </p>

                <h1 className="text-6xl md:text-8xl leading-[0.9] tracking-[-0.08em] font-black">

                  {course?.title}
                </h1>

                <p className="mt-8 text-2xl text-black/45 max-w-3xl">

                  Watch lectures,
                  complete lessons
                  and track learning progress.

                </p>

              </div>

              <div className="hidden lg:flex w-40 h-40 rounded-[40px] bg-black text-white items-center justify-center">

                <FaGraduationCap className="text-6xl" />

              </div>

            </div>


            <div className="mt-12">

              <div className="flex items-center justify-between mb-4">

                <h1 className="text-2xl font-black">

                  Course Progress
                </h1>

                <h1 className="text-3xl font-black text-violet-700">

                  {progressPercentage}%
                </h1>

              </div>

              <div className="w-full h-5 rounded-full bg-black/10 overflow-hidden">

  <motion.div

    initial={{
      width:"0%"
    }}

    animate={{
      width:`${progressPercentage}%`
    }}

    transition={{
      duration:0.8
    }}

    style={{
      width:`${progressPercentage}%`
    }}

    className="h-full rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-400"

  />

</div>

            </div>

          </div>

        </motion.div>


        <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.6fr] gap-8 mt-8">


          <div className="rounded-[40px] bg-white border border-black/5 overflow-hidden">

            <div className="aspect-video bg-black">

              {

                selectedLesson

                ?

                <iframe

                  src={selectedLesson.videoUrl}

                  title="Course Video"

                  className="w-full h-full"

                  allowFullScreen

                />

                :

                <div className="h-full flex items-center justify-center text-white">

                  No Lesson Selected

                </div>

              }

            </div>

            <div className="p-8">

              <h1 className="text-5xl font-black tracking-[-0.06em]">

                {

                  selectedLesson?.title ||

                  course?.title

                }

              </h1>

              <p className="mt-6 text-black/45 text-lg">

                {course?.description}
              </p>

            </div>

          </div>


          <div className="rounded-[40px] bg-white border border-black/5 overflow-hidden">

            <div className="p-7 border-b border-black/5 flex items-center justify-between">

              <div>

                <p className="uppercase tracking-[0.22em] text-xs font-black text-orange-500 mb-2">

                  COURSE CONTENT

                </p>

                <h1 className="text-3xl font-black">

                  Lessons
                </h1>

              </div>

              {

                (
                  userRole === "admin" ||

                  userRole === "faculty"

                ) &&

                <button

                  onClick={() => {

                    resetForm()
                    setShowModal(true)

                  }}

                  className="w-14 h-14 rounded-[20px] bg-black text-white flex items-center justify-center"

                >

                  <FaPlus />

                </button>

              }

            </div>

            <div>

              {

                lessons.map((lesson,index)=>(

                  <div

                    key={lesson.id}

                    className={`

                      border-b border-black/5

                      ${

                        selectedLesson?.id === lesson.id

                        ?

                        "bg-violet-50"

                        :

                        "bg-white"

                      }

                    `}

                  >

                    <button

                      onClick={() =>
                        setSelectedLesson(
                          lesson
                        )
                      }

                      className="w-full p-6 text-left"

                    >

                      <div className="flex items-start gap-4">

                        <div className={`

                          w-14 h-14 rounded-[20px]
                          flex items-center justify-center

                          ${

                            selectedLesson?.id === lesson.id

                            ?

                            "bg-black text-white"

                            :

                            "bg-[#f8f4ef] text-black/40"

                          }

                        `}>

                          <FaPlayCircle />

                        </div>

                        <div className="flex-1">

                          <div className="flex items-center justify-between">

                            <h1 className="font-black text-lg">

                              {index + 1}.
                              {" "}
                              {lesson.title}
                            </h1>

                            {

                              completedLessons.includes(
                                lesson.id
                              )

                              ?

                              <FaCheckCircle className="text-emerald-500 text-sm" />

                              :

                              <div className="w-4 h-4 rounded-full border-2 border-black/20" />

                            }

                          </div>

                          <div className="flex items-center gap-2 mt-3 text-sm text-black/40">

                            <FaClock />

                            {lesson.duration}

                          </div>

                          {

                            userRole === "student" &&

                            !completedLessons.includes(
                              lesson.id
                            ) &&

                            <div className="mt-4">

  <button

    type="button"

    onClick={async(e)=>{

      e.preventDefault()

      e.stopPropagation()

      console.log("CLICKED")

      await completeLesson(lesson)

    }}

    className="px-4 py-2 rounded-full bg-black text-white text-xs font-black"

  >

    Mark Complete

  </button>

</div>

                          }

                        </div>

                      </div>

                    </button>

                    {

                      (
                        userRole === "admin" ||

                        userRole === "faculty"

                      ) &&

                      <div className="px-6 pb-6 flex gap-3">

                        <button

                          onClick={() =>
                            editLesson(
                              lesson
                            )
                          }

                          className="flex-1 h-[52px] rounded-[18px] bg-violet-100 text-violet-700 font-black flex items-center justify-center gap-2"

                        >

                          <FaEdit />

                          Edit

                        </button>

                        <button

                          onClick={() =>
                            deleteLesson(
                              lesson.id
                            )
                          }

                          className="flex-1 h-[52px] rounded-[18px] bg-rose-100 text-rose-600 font-black flex items-center justify-center gap-2"

                        >

                          <FaTrash />

                          Delete

                        </button>

                      </div>

                    }

                  </div>

                ))

              }

            </div>

          </div>

        </div>

      </div>


      {

        showModal &&

        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[99999] flex items-center justify-center p-4">

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

            className="w-full max-w-[600px] rounded-[40px] bg-white overflow-hidden"

          >

            <div className="px-8 pt-8 pb-6 border-b border-black/5 flex items-start justify-between">

              <div>

                <p className="uppercase tracking-[0.28em] text-orange-500 text-[10px] font-black mb-3">

                  COURSE MANAGEMENT

                </p>

                <h1 className="text-[52px] leading-[0.9] tracking-[-0.08em] font-black">

                  {

                    editingLesson

                    ?

                    "Edit Lesson"

                    :

                    "Add Lesson"

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

            <div className="p-8 space-y-5">

              <input

                value={lessonTitle}

                onChange={(e)=>
                  setLessonTitle(
                    e.target.value
                  )
                }

                placeholder="Lesson Title"

                className="w-full h-[60px] px-5 rounded-[20px] bg-[#f7f4f1] border border-black/5 outline-none"

              />

              <input

                value={lessonDuration}

                onChange={(e)=>
                  setLessonDuration(
                    e.target.value
                  )
                }

                placeholder="Lesson Duration"

                className="w-full h-[60px] px-5 rounded-[20px] bg-[#f7f4f1] border border-black/5 outline-none"

              />

              <input

                value={videoUrl}

                onChange={(e)=>
                  setVideoUrl(
                    e.target.value
                  )
                }

                placeholder="Youtube Embed URL"

                className="w-full h-[60px] px-5 rounded-[20px] bg-[#f7f4f1] border border-black/5 outline-none"

              />

              <input

                value={lessonOrder}

                onChange={(e)=>
                  setLessonOrder(
                    e.target.value
                  )
                }

                placeholder="Lesson Order"

                type="number"

                className="w-full h-[60px] px-5 rounded-[20px] bg-[#f7f4f1] border border-black/5 outline-none"

              />

              <button

                onClick={

                  editingLesson

                  ?

                  updateLesson

                  :

                  createLesson

                }

                className="w-full h-[64px] rounded-[22px] bg-black text-white font-black text-lg flex items-center justify-center gap-3"

              >

                {

                  editingLesson

                  ?

                  "Update Lesson"

                  :

                  "Create Lesson"

                }

                <FaArrowRight />

              </button>

            </div>

          </motion.div>

        </div>

      }

    </MainLayout>

  )

}

export default CoursePlayer