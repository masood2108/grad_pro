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
  getDoc,
  query,
  where,
  getDocs
} from "firebase/firestore"

import {
  db,
  auth
} from "../firebase/firebase"

import {
  useNavigate
} from "react-router-dom"

import MainLayout from "../layouts/MainLayout"

import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaUsers,
  FaDollarSign,
  FaLayerGroup,
  FaPlayCircle,
  FaCheckCircle,
  FaCloudUploadAlt,
  FaClock
} from "react-icons/fa"

function Courses() {

  const navigate = useNavigate()

  const [courses, setCourses] =
  useState([])

  const [loading, setLoading] =
  useState(true)

  const [search, setSearch] =
  useState("")

  const [showModal, setShowModal] =
  useState(false)

  const [editingCourse, setEditingCourse] =
  useState(null)

  const [userRole, setUserRole] =
  useState("student")

  const [enrolledCourses, setEnrolledCourses] =
  useState([])

  const [title, setTitle] =
  useState("")

  const [description, setDescription] =
  useState("")

  const [instructor, setInstructor] =
  useState("")

  const [category, setCategory] =
  useState("")

  const [price, setPrice] =
  useState("")

  const [thumbnail, setThumbnail] =
  useState("")

  const [status, setStatus] =
  useState("Published")

  const [uploading, setUploading] =
  useState(false)

 

  const [showBatchModal, setShowBatchModal] =
  useState(false)

  const [selectedCourse, setSelectedCourse] =
  useState(null)

  const [courseBatches, setCourseBatches] =
  useState([])

 

  useEffect(() => {

    const getUserRole = async() => {

      const user = auth.currentUser

      if(user){

        const userRef = doc(
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

    const unsubscribe = onSnapshot(

      collection(db, "courses"),

      (snapshot) => {

        const data = []

        snapshot.forEach((docItem) => {

          data.push({

            id: docItem.id,
            ...docItem.data()

          })

        })

        setCourses(data)

        setLoading(false)

      }

    )

    return () => unsubscribe()

  }, [])

 

  useEffect(() => {

    const getEnrollments = async() => {

      const user = auth.currentUser

      if(!user) return

      try{

        const enrollQuery = query(

          collection(db, "enrollments"),

          where(
            "studentId",
            "==",
            user.uid
          )

        )

        const enrollSnap =
        await getDocs(enrollQuery)

        const enrolled = []

        enrollSnap.forEach((docItem)=>{

          enrolled.push(
            docItem.data().courseId
          )

        })

        setEnrolledCourses(
          enrolled
        )

      }

      catch(error){

        console.log(error)

      }

    }

    getEnrollments()

  }, [])

  const resetForm = () => {

    setTitle("")
    setDescription("")
    setInstructor("")
    setCategory("")
    setPrice("")
    setThumbnail("")
    setStatus("Published")
    setEditingCourse(null)

  }

 

  const uploadImage = async(file) => {

    setUploading(true)

    try{

      const formData = new FormData()

      formData.append("file", file)

      formData.append(
        "upload_preset",
        "99dxxxx"
      )

      const response = await fetch(

        "https://api.cloudinary.com/v1_1/dvic2uies/image/upload",

        {
          method:"POST",
          body:formData
        }

      )

      const data = await response.json()

      if(data.secure_url){

        setThumbnail(
          data.secure_url
        )

      }

    }

    catch(error){

      console.log(error)

    }

    setUploading(false)

  }

 
  const openBatchModal = async(course) => {

    try{

      setSelectedCourse(course)

      const batchesQuery = query(

        collection(db, "batches"),

        where(
          "courseId",
          "==",
          course.id
        )

      )

      const batchSnap =
      await getDocs(batchesQuery)

      const batchData = []

      batchSnap.forEach((docItem)=>{

        batchData.push({

          id:docItem.id,
          ...docItem.data()

        })

      })

      setCourseBatches(batchData)

      setShowBatchModal(true)

    }

    catch(error){

      console.log(error)

    }

  }

 

 const enrollCourse = async(
  course,
  batch
) => {

  try{

    const user = auth.currentUser

    if(!user){

      return alert(
        "Login Required"
      )

    }

    if(

      enrolledCourses.includes(
        course.id
      )

    ){

      return alert(
        "Already Enrolled"
      )

    }

    const userRef = doc(
      db,
      "users",
      user.uid
    )

    const userSnap =
    await getDoc(userRef)

    if(!userSnap.exists()) return

    const userData =
    userSnap.data()

    

    await addDoc(

      collection(
        db,
        "enrollments"
      ),

      {

        studentName:
        userData.name,

        studentEmail:
        userData.email,

        studentId:
        user.uid,

        courseId:
        course.id,

        courseTitle:
        course.title,

        instructor:
        course.instructor,

        batchId:
        batch.id,

        batchName:
        batch.batchName,

        batchTiming:
        batch.timing,

        faculty:
        batch.faculty,

        createdAt:
        serverTimestamp()

      }

    )

    

    await addDoc(

      collection(
        db,
        "fees"
      ),

      {

        studentId:
        user.uid,

        studentName:
        userData.name,

        courseId:
        course.id,

        course:
        course.title,

        amount:
        Number(course.price),

        dueDate:
        "2026-12-31",

        status:
        "Pending",

        createdAt:
        serverTimestamp()

      }

    )

   
    await updateDoc(

      doc(
        db,
        "courses",
        course.id
      ),

      {

        students:
        (course.students || 0) + 1

      }

    )


    setEnrolledCourses([

      ...enrolledCourses,
      course.id

    ])

    setShowBatchModal(false)

    alert(
      "Enrolled Successfully"
    )

  }

  catch(error){

    console.log(error)

  }

}


const createCourse = async () => {

  if(!title || !instructor){

    return alert(
      "Fill required fields"
    )

  }

  try{


    const courseRef = await addDoc(

      collection(
        db,
        "courses"
      ),

      {

        title,
        description,
        instructor,
        category,
        price:Number(price),
        thumbnail,
        status,

        students:0,

        createdAt:
        serverTimestamp()

      }

    )


    await addDoc(

      collection(
        db,
        "batches"
      ),

      {

        courseId:
        courseRef.id,

        batchName:
        "Morning Batch",

        faculty:
        instructor,

        timing:
        "9AM - 11AM",

        status:
        "Active",

        createdAt:
        serverTimestamp()

      }

    )

    await addDoc(

      collection(
        db,
        "batches"
      ),

      {

        courseId:
        courseRef.id,

        batchName:
        "Evening Batch",

        faculty:
        instructor,

        timing:
        "6PM - 8PM",

        status:
        "Active",

        createdAt:
        serverTimestamp()

      }

    )

    alert(
      "Course & Batches Created"
    )

    resetForm()

    setShowModal(false)

  }

  catch(error){

    console.log(error)

  }

}

 

  const updateCourse = async () => {

    try{

      await updateDoc(

        doc(
          db,
          "courses",
          editingCourse.id
        ),

        {

          title,
          description,
          instructor,
          category,
          price:Number(price),
          thumbnail,
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

 

  const editCourse = (course) => {

    setEditingCourse(course)

    setTitle(course.title || "")

    setDescription(
      course.description || ""
    )

    setInstructor(
      course.instructor || ""
    )

    setCategory(
      course.category || ""
    )

    setPrice(course.price || "")

    setThumbnail(
      course.thumbnail || ""
    )

    setStatus(
      course.status || "Published"
    )

    setShowModal(true)

  }

  
  const deleteCourse = async(id) => {

    const confirmDelete =
    window.confirm(
      "Delete this course?"
    )

    if(!confirmDelete) return

    try{

      await deleteDoc(

        doc(
          db,
          "courses",
          id
        )

      )

    }

    catch(error){

      console.log(error)

    }

  }

 
  const filteredCourses =
  courses.filter((course)=>

    course.title
    ?.toLowerCase()
    .includes(
      search.toLowerCase()
    )

  )

  return (

<MainLayout>

      <div className="flex-1 overflow-y-auto p-8">


        <div className="flex items-center justify-between mb-5">

          <div className="mb-10 mt-8">

            <p className="uppercase tracking-[0.3em] text-orange-500 text-xs font-black mb-4">

              LMS PLATFORM

            </p>

            <h1 className="text-[70px] leading-[0.85] tracking-[-0.08em] font-black text-black">

              COURSES

            </h1>

          </div>

          {

            (
              userRole === "admin" ||

              userRole === "faculty"

            ) &&

            <motion.button

              whileHover={{
                scale:1.04,
                y:-2
              }}

              whileTap={{
                scale:0.96
              }}

              onClick={()=>{

                resetForm()

                setShowModal(true)

              }}

              className="px-8 py-5 rounded-[28px] bg-black text-white font-black text-lg flex items-center gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.12)]"

            >

              <FaPlus />

              Add Course

            </motion.button>

          }

        </div>


        <div className="relative mb-10">

          <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-black/40 text-lg" />

          <input

            value={search}

            onChange={(e)=>
              setSearch(e.target.value)
            }

            placeholder="Search courses..."

            className="w-full pl-16 pr-6 py-6 rounded-[32px] bg-white border border-black/5 outline-none text-black text-lg shadow-[0_15px_40px_rgba(0,0,0,0.04)]"

          />

        </div>


        {

          loading

          ?

          <div className="h-[400px] flex items-center justify-center">

            <h1 className="text-4xl font-black text-black">

              Loading Courses...

            </h1>

          </div>

          :

          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">

            {

              filteredCourses.map((course, index)=>(

                <motion.div

                  key={course.id}

                  initial={{
                    opacity:0,
                    y:40
                  }}

                  animate={{
                    opacity:1,
                    y:0
                  }}

                  transition={{
                    delay:index * 0.08
                  }}

                  whileHover={{
                    y:-12
                  }}

                  onClick={() =>
                    navigate(`/course/${course.id}`)
                  }

                  className="group relative overflow-hidden rounded-[42px] bg-white border border-black/5 shadow-[0_30px_80px_rgba(0,0,0,0.08)] hover:shadow-[0_40px_100px_rgba(124,58,237,0.12)] transition-all duration-500 cursor-pointer"

                >

                  <div className="absolute top-0 left-0 w-full h-[7px] bg-gradient-to-r from-violet-500 via-orange-400 to-cyan-400 z-20" />

                  <div className="relative h-[240px] overflow-hidden">

                    <img

                      src={

                        course.thumbnail ||

                        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"

                      }

                      alt=""

                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"

                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                    <div className="absolute top-5 left-5 px-5 py-2 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 text-white text-[10px] uppercase tracking-[0.25em] font-black">

                      {course.category || "Development"}

                    </div>

                    <div className="absolute bottom-5 right-5 w-20 h-20 rounded-full bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex items-center justify-center">

                      <FaPlayCircle className="text-black text-3xl ml-1" />

                    </div>

                  </div>


                  <div className="p-7">

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex-1">

                        <h1 className="text-[44px] leading-[0.9] tracking-[-0.08em] font-black text-black">

                          {course.title}

                        </h1>

                        <div className="flex items-center gap-3 mt-5">

                          <div className="w-11 h-11 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center font-black text-lg">

                            {

                              course.instructor
                              ?.charAt(0)
                              ?.toUpperCase()

                            }

                          </div>

                          <div>

                            <p className="text-black font-bold text-[15px]">

                              {course.instructor}

                            </p>

                            <p className="text-black/40 text-sm">

                              Course Instructor

                            </p>

                          </div>

                        </div>

                      </div>

                      <div className={`

                        px-5 py-3 rounded-full
                        text-[10px]
                        uppercase
                        tracking-[0.25em]
                        font-black whitespace-nowrap

                        ${

                          course.status === "Published"

                          ?

                          "bg-emerald-100 text-emerald-600"

                          :

                          "bg-orange-100 text-orange-500"

                        }

                      `}>

                        {course.status}

                      </div>

                    </div>

                    <p className="mt-7 text-black/50 leading-relaxed text-[15px] line-clamp-3">

                      {course.description}

                    </p>


                    <div className="grid grid-cols-3 gap-4 mt-8">

                      <div className="rounded-[28px] bg-[#faf7f3] border border-black/5 p-5">

                        <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center text-lg">

                          <FaLayerGroup />

                        </div>

                        <p className="text-[10px] uppercase tracking-[0.22em] text-black/35 font-black mt-4">

                          Category

                        </p>

                        <h1 className="text-black font-black text-[17px] mt-2 leading-tight">

                          {course.category}

                        </h1>

                      </div>

                      <div className="rounded-[28px] bg-[#faf7f3] border border-black/5 p-5">

                        <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-600 flex items-center justify-center text-lg">

                          <FaUsers />

                        </div>

                        <p className="text-[10px] uppercase tracking-[0.22em] text-black/35 font-black mt-4">

                          Students

                        </p>

                        <h1 className="text-black font-black text-[26px] mt-2">

                          {course.students || 0}

                        </h1>

                      </div>

                      <div className="rounded-[28px] bg-[#faf7f3] border border-black/5 p-5">

                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg">

                          <FaDollarSign />

                        </div>

                        <p className="text-[10px] uppercase tracking-[0.22em] text-black/35 font-black mt-4">

                          Price

                        </p>

                        <h1 className="text-black font-black text-[26px] mt-2">

                          ₹{course.price}

                        </h1>

                      </div>

                    </div>


                    {

                      userRole === "student"

                      ?

                      enrolledCourses.includes(
                        course.id
                      )

                      ?

                      <button

                        disabled

                        className="w-full mt-8 py-5 rounded-[28px] bg-emerald-100 text-emerald-600 font-black flex items-center justify-center gap-3 text-lg"

                      >

                        <FaCheckCircle />

                        Enrolled Successfully

                      </button>

                      :

                      <button

                        onClick={(e)=>{

                          e.stopPropagation()

                          openBatchModal(course)

                        }}

                        className="w-full mt-8 py-5 rounded-[28px] bg-black text-white font-black text-lg"

                      >

                        Select Batch

                      </button>

                      :

                      <div

                        onClick={(e)=>
                          e.stopPropagation()
                        }

                        className="grid grid-cols-2 gap-4 mt-8"

                      >

                        <button

                          onClick={() =>
                            editCourse(course)
                          }

                          className="py-5 rounded-[28px] bg-violet-100 text-violet-700 font-black flex items-center justify-center gap-3 text-lg"

                        >

                          <FaEdit />

                          Edit

                        </button>

                        <button

                          onClick={() =>
                            deleteCourse(course.id)
                          }

                          className="py-5 rounded-[28px] bg-rose-100 text-rose-600 font-black flex items-center justify-center gap-3 text-lg"

                        >

                          <FaTrash />

                          Delete

                        </button>

                      </div>

                    }

                  </div>

                </motion.div>

              ))

            }

          </div>

        }

      </div>

     

      {

        showBatchModal &&

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

            className="w-full max-w-[700px] rounded-[40px] bg-white shadow-[0_40px_120px_rgba(0,0,0,0.15)] border border-black/5 overflow-hidden"

          >


            <div className="px-8 pt-8 pb-6 border-b border-black/5 flex items-start justify-between">

              <div>

                <p className="uppercase tracking-[0.28em] text-orange-500 text-[10px] font-black mb-3">

                  BATCH ENROLLMENT

                </p>

                <h1 className="text-[52px] leading-[0.9] tracking-[-0.08em] font-black text-black">

                  Select Batch

                </h1>

                <p className="mt-4 text-black/45 text-lg">

                  {selectedCourse?.title}

                </p>

              </div>

              <button

                onClick={() =>
                  setShowBatchModal(false)
                }

                className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center"

              >

                <FaTimes />

              </button>

            </div>


            <div className="p-8">

              {

                courseBatches.length === 0

                ?

                <div className="h-[250px] flex flex-col items-center justify-center text-center">

                  <FaUsers className="text-6xl text-black/20 mb-5" />

                  <h1 className="text-4xl font-black">

                    No Batches Found

                  </h1>

                  <p className="text-black/40 mt-4">

                    Faculty has not created
                    batches yet.

                  </p>

                </div>

                :

                <div className="space-y-5">

                  {

                    courseBatches.map((batch)=>(

                      <motion.div

                        whileHover={{
                          y:-5
                        }}

                        key={batch.id}

                        className="rounded-[30px] border border-black/5 bg-[#faf7f3] p-6"

                      >

                        <div className="flex items-start justify-between gap-5 flex-wrap">

                          <div>

                            <h1 className="text-4xl leading-none tracking-[-0.06em] font-black">

                              {batch.batchName}

                            </h1>

                            <div className="flex flex-wrap gap-4 mt-5">

                              <div className="px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-black">

                                {batch.faculty}
                              </div>

                              <div className="px-4 py-2 rounded-full bg-orange-100 text-orange-600 text-sm font-black flex items-center gap-2">

                                <FaClock />

                                {batch.timing}
                              </div>

                              <div className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-black">

                                {batch.status}
                              </div>

                            </div>

                          </div>

                          <button

                            onClick={() =>
                              enrollCourse(
                                selectedCourse,
                                batch
                              )
                            }

                            className="px-7 h-[60px] rounded-[22px] bg-black text-white font-black text-lg"

                          >

                            Join Batch

                          </button>

                        </div>

                      </motion.div>

                    ))

                  }

                </div>

              }

            </div>

          </motion.div>

        </div>

      }


{

  showModal &&

  <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[99999] flex items-center justify-center p-4 overflow-y-auto">

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

      transition={{
        duration:0.35
      }}

      className="w-full max-w-[650px] rounded-[40px] bg-white shadow-[0_40px_120px_rgba(0,0,0,0.15)] border border-black/5 overflow-hidden"

    >


      <div className="px-8 pt-8 pb-6 border-b border-black/5 flex items-start justify-between">

        <div>

          <p className="uppercase tracking-[0.28em] text-orange-500 text-[10px] font-black mb-3">

            COURSE MANAGEMENT

          </p>

          <h1 className="text-[52px] leading-[0.9] tracking-[-0.08em] font-black text-black">

            {

              editingCourse

              ?

              "Edit Course"

              :

              "Add Course"

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

          value={title}

          onChange={(e)=>
            setTitle(e.target.value)
          }

          placeholder="Course Title"

          className="w-full h-[60px] px-5 rounded-[20px] bg-[#f7f4f1] border border-black/5 outline-none text-black"

        />

        <textarea

          value={description}

          onChange={(e)=>
            setDescription(e.target.value)
          }

          placeholder="Course Description"

          rows="4"

          className="w-full px-5 py-4 rounded-[20px] bg-[#f7f4f1] border border-black/5 outline-none text-black resize-none"

        />

        <div className="grid md:grid-cols-2 gap-5">

          <input

            value={instructor}

            onChange={(e)=>
              setInstructor(e.target.value)
            }

            placeholder="Instructor"

            className="w-full h-[60px] px-5 rounded-[20px] bg-[#f7f4f1] border border-black/5 outline-none text-black"

          />

          <input

            value={category}

            onChange={(e)=>
              setCategory(e.target.value)
            }

            placeholder="Category"

            className="w-full h-[60px] px-5 rounded-[20px] bg-[#f7f4f1] border border-black/5 outline-none text-black"

          />

        </div>

        <input

          value={price}

          onChange={(e)=>
            setPrice(e.target.value)
          }

          placeholder="Price"

          type="number"

          className="w-full h-[60px] px-5 rounded-[20px] bg-[#f7f4f1] border border-black/5 outline-none text-black"

        />


        <label className="relative w-full h-[180px] rounded-[28px] border-2 border-dashed border-black/10 bg-[#faf7f3] overflow-hidden cursor-pointer flex items-center justify-center group">

          {

            thumbnail

            ?

            <>

              <img

                src={thumbnail}

                alt=""

                className="w-full h-full object-cover"

              />

              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">

                <div className="px-5 py-3 rounded-full bg-white text-black font-black text-sm">

                  Change Thumbnail

                </div>

              </div>

            </>

            :

            <div className="flex flex-col items-center justify-center text-center">

              <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-2xl mb-5">

                <FaCloudUploadAlt />

              </div>

              <h1 className="text-3xl font-black">

                Upload Thumbnail

              </h1>

              <p className="text-black/40 mt-3">

                PNG JPG WEBP

              </p>

            </div>

          }

          <input

            type="file"

            hidden

            onChange={(e)=>
              uploadImage(
                e.target.files[0]
              )
            }

          />

        </label>

        {

          uploading &&

          <div className="rounded-2xl bg-violet-100 text-violet-700 py-4 text-center font-black">

            Uploading Image...

          </div>

        }

        <select

          value={status}

          onChange={(e)=>
            setStatus(e.target.value)
          }

          className="w-full h-[60px] px-5 rounded-[20px] bg-[#f7f4f1] border border-black/5 outline-none text-black"

        >

          <option>
            Published
          </option>

          <option>
            Draft
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

            editingCourse

            ?

            updateCourse

            :

            createCourse

          }

          className="w-full h-[64px] rounded-[22px] bg-black text-white font-black text-lg shadow-[0_20px_50px_rgba(0,0,0,0.12)]"

        >

          {

            editingCourse

            ?

            "Update Course"

            :

            "Create Course"

          }

        </motion.button>

      </div>

    </motion.div>

  </div>

}
</MainLayout>

  )

}

export default Courses