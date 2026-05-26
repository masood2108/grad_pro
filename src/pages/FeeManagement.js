/* eslint-disable no-unused-vars */
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

import MainLayout from "../layouts/MainLayout"

import {
  FaPlus,
  FaTimes,
  FaTrash,
  FaEdit,
  FaCheckCircle,
  FaClock,
  FaSearch,
  FaUserGraduate,
  FaWallet,
  FaExclamationTriangle
} from "react-icons/fa"

function FeeManagement() {

  const [fees, setFees] =
  useState([])

  const [loading, setLoading] =
  useState(true)

  const [userRole, setUserRole] =
  useState("student")

  const [userName, setUserName] =
  useState("")

  const [showModal, setShowModal] =
  useState(false)

  const [editingFee, setEditingFee] =
  useState(null)

  const [search, setSearch] =
  useState("")

  const [coursesData, setCoursesData] =
  useState([])

  const [studentsData, setStudentsData] =
  useState([])

  const [selectedCourse, setSelectedCourse] =
  useState("")

  const [selectedStudent, setSelectedStudent] =
  useState("")

  const [amount, setAmount] =
  useState("")

  const [dueDate, setDueDate] =
  useState("")

  const [status, setStatus] =
  useState("Pending")

 

  useEffect(() => {

    const getUser = async() => {

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

          const data =
          userSnap.data()

          setUserRole(
            data.role
          )

          setUserName(
            data.name
          )

        }

      }

    }

    getUser()

  }, [])

  

  useEffect(() => {

    const unsubscribe = onSnapshot(

      collection(db, "fees"),

      (snapshot) => {

        const data = []

        snapshot.forEach((docItem)=>{

          data.push({

            id:docItem.id,
            ...docItem.data()

          })

        })

        setFees(data)

        setLoading(false)

      }

    )

    return () => unsubscribe()

  }, [])

  

  useEffect(() => {

    const unsubscribe = onSnapshot(

      collection(db, "courses"),

      (snapshot) => {

        const data = []

        snapshot.forEach((docItem)=>{

          data.push({

            id:docItem.id,
            ...docItem.data()

          })

        })

        setCoursesData(data)

      }

    )

    return () => unsubscribe()

  }, [])

  

  useEffect(() => {

    const fetchStudents = async() => {

      if(!selectedCourse) return

      try{

        const selectedCourseData =

        coursesData.find(

          (item)=>

            item.id === selectedCourse

        )

        if(selectedCourseData){

          setAmount(
            selectedCourseData.price || 0
          )

        }

        const enrollQuery = query(

          collection(
            db,
            "enrollments"
          ),

          where(
            "courseId",
            "==",
            selectedCourse
          )

        )

        const enrollSnap =
        await getDocs(enrollQuery)

        const students = []

        enrollSnap.forEach((docItem)=>{

          students.push({

            id:docItem.id,
            ...docItem.data()

          })

        })

        setStudentsData(students)

      }

      catch(error){

        console.log(error)

      }

    }

    fetchStudents()

  }, [selectedCourse, coursesData])

  

  const resetForm = () => {

    setSelectedStudent("")
    setSelectedCourse("")
    setAmount("")
    setDueDate("")
    setStatus("Pending")
    setEditingFee(null)

  }

  
  const createFee = async() => {

    if(

      !selectedCourse ||
      !selectedStudent ||
      !amount

    ){

      return alert(
        "Fill all fields"
      )

    }

    try{

      const courseData =

      coursesData.find(

        (item)=>

          item.id === selectedCourse

      )

      const studentData =

      studentsData.find(

        (item)=>

          item.studentId === selectedStudent

      )

      await addDoc(

        collection(
          db,
          "fees"
        ),

        {

          studentId:
          studentData.studentId,

          studentName:
          studentData.studentName,

          courseId:
          selectedCourse,

          course:
          courseData.title,

          amount:Number(amount),

          dueDate,

          status,

          createdAt:
          serverTimestamp()

        }

      )

      alert(
        "Fee Created Successfully"
      )

      resetForm()

      setShowModal(false)

    }

    catch(error){

      console.log(error)

    }

  }

 
  const updateFee = async() => {

    try{

      const courseData =

      coursesData.find(

        (item)=>

          item.id === selectedCourse

      )

      const studentData =

      studentsData.find(

        (item)=>

          item.studentId === selectedStudent

      )

      await updateDoc(

        doc(
          db,
          "fees",
          editingFee.id
        ),

        {

          studentId:
          studentData.studentId,

          studentName:
          studentData.studentName,

          courseId:
          selectedCourse,

          course:
          courseData.title,

          amount:Number(amount),

          dueDate,

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

  
  const editFee = (fee) => {

    setEditingFee(fee)

    setSelectedCourse(
      fee.courseId
    )

    setSelectedStudent(
      fee.studentId
    )

    setAmount(
      fee.amount
    )

    setDueDate(
      fee.dueDate
    )

    setStatus(
      fee.status
    )

    setShowModal(true)

  }

 

  const deleteFee = async(id) => {

    const confirmDelete =
    window.confirm(
      "Delete Fee?"
    )

    if(!confirmDelete) return

    try{

      await deleteDoc(

        doc(
          db,
          "fees",
          id
        )

      )

    }

    catch(error){

      console.log(error)

    }

  }

 

  const filteredFees =

  fees.filter((fee)=>{

    if(
      userRole === "student" ||
      userRole === "parent"
    ){

      return (

        fee.studentName ===
        userName

      )

    }

    return fee.studentName
    ?.toLowerCase()
    .includes(
      search.toLowerCase()
    )

  })

 

  const totalFees =

  filteredFees.reduce(

    (acc,curr)=>

      acc + curr.amount,

    0

  )

  const paidFees =

  filteredFees
  .filter(
    (item)=>
    item.status === "Paid"
  )
  .reduce(

    (acc,curr)=>

      acc + curr.amount,

    0

  )

  const pendingFees =

  filteredFees
  .filter(
    (item)=>
    item.status === "Pending"
  )
  .reduce(

    (acc,curr)=>

      acc + curr.amount,

    0

  )
  const openRazorpay = async (fee) => {

  const options = {

    key: "rzp_test_Su0csRRzeeIKTl",

    amount: fee.amount * 100,

    currency: "INR",

    name: "LMS ERP",

    description: fee.course,

    image:
    "https://cdn-icons-png.flaticon.com/512/3135/3135755.png",

    handler: async function (response) {

      try {

        await updateDoc(

          doc(db, "fees", fee.id),

          {

            status: "Paid",

            paymentId:
            response.razorpay_payment_id,

            paidAt:
            serverTimestamp()

          }

        )

        alert("Payment Successful")

      }

      catch(error){

        console.log(error)

      }

    },

    prefill: {

      name:
      fee.studentName

    },

    theme: {

      color: "#000000"

    }

  }

  const razorpay =
  new window.Razorpay(options)

  razorpay.open()

}

  return (

<MainLayout>

<div className="flex-1 overflow-y-auto p-8">

<div className="flex items-center justify-between mb-10">

<div>

<p className="uppercase tracking-[0.3em] text-orange-500 text-xs font-black mb-4">

LMS ERP SYSTEM

</p>

<h1 className="text-[72px] leading-[0.85] tracking-[-0.08em] font-black text-black">

Fee
<br />
Management

</h1>

</div>

{

(
userRole === "admin" ||
userRole === "faculty"
) &&

<motion.button

whileHover={{
scale:1.03
}}

whileTap={{
scale:0.96
}}

onClick={()=>{

resetForm()
setShowModal(true)

}}

className="px-8 py-5 rounded-[28px] bg-black text-white font-black text-lg flex items-center gap-4"

>

<FaPlus />

Add Fee

</motion.button>

}

</div>

{

(
userRole === "admin" ||
userRole === "faculty"
) &&

<div className="relative mb-10">

<FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-black/30" />

<input

value={search}

onChange={(e)=>
setSearch(
e.target.value
)
}

placeholder="Search Student..."

className="w-full pl-14 pr-6 py-5 rounded-[30px] bg-white border border-black/5 outline-none"

/>

</div>

}

<div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-10">

<StatCard
title="Total Fees"
value={`₹${totalFees}`}
icon={<FaWallet />}
color="violet"
/>

<StatCard
title="Paid Fees"
value={`₹${paidFees}`}
icon={<FaCheckCircle />}
color="emerald"
/>

<StatCard
title="Pending Fees"
value={`₹${pendingFees}`}
icon={<FaExclamationTriangle />}
color="orange"
/>

</div>


<div className="rounded-[40px] overflow-hidden bg-white border border-black/5 shadow-[0_20px_60px_rgba(0,0,0,0.05)]">

<div className="p-8 border-b border-black/5">

<h1 className="text-5xl leading-none tracking-[-0.08em] font-black">

Student Fees

</h1>

</div>

<div className="overflow-x-auto">

<table className="w-full min-w-[900px]">

<thead>

<tr className="bg-[#faf7f3]">

<th className="text-left px-8 py-6 text-xs uppercase tracking-[0.25em] text-black/40 font-black">

Student

</th>

<th className="text-left px-8 py-6 text-xs uppercase tracking-[0.25em] text-black/40 font-black">

Course

</th>

<th className="text-left px-8 py-6 text-xs uppercase tracking-[0.25em] text-black/40 font-black">

Amount

</th>

<th className="text-left px-8 py-6 text-xs uppercase tracking-[0.25em] text-black/40 font-black">

Due Date

</th>

<th className="text-left px-8 py-6 text-xs uppercase tracking-[0.25em] text-black/40 font-black">

Status

</th>

<th className="text-left px-8 py-6 text-xs uppercase tracking-[0.25em] text-black/40 font-black">

Actions

</th>

</tr>

</thead>

<tbody>

{

filteredFees.map((fee,index)=>(

<motion.tr

key={fee.id}

initial={{
opacity:0,
y:10
}}

animate={{
opacity:1,
y:0
}}

transition={{
delay:index * 0.04
}}

className="border-t border-black/5 hover:bg-[#faf7f3] transition-all"

>

<td className="px-8 py-6">

<div className="flex items-center gap-4">

<div className="w-14 h-14 rounded-[20px] bg-violet-100 text-violet-700 flex items-center justify-center text-xl">

<FaUserGraduate />

</div>

<h1 className="font-black text-lg">

{fee.studentName}

</h1>

</div>

</td>

<td className="px-8 py-6 font-bold">

{fee.course}

</td>

<td className="px-8 py-6">

<div className="inline-flex px-5 py-3 rounded-full bg-black text-white font-black">

₹{fee.amount}

</div>

</td>

<td className="px-8 py-6 font-bold">

{fee.dueDate}

</td>

<td className="px-8 py-6">

{

fee.status === "Paid"

?

<div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-emerald-100 text-emerald-700 font-black">

<FaCheckCircle />

Paid

</div>

:

<div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-orange-100 text-orange-700 font-black">

<FaClock />

Pending

</div>

}

</td>
<td className="px-8 py-6">

<div className="flex gap-3 flex-wrap">

{

userRole === "student"

?

<>

{

fee.status === "Pending"

?

<button

onClick={() =>
openRazorpay(fee)
}

className="px-6 py-3 rounded-2xl bg-black text-white font-black hover:scale-105 transition-all"

>

Pay Now

</button>

:

<div className="px-6 py-3 rounded-2xl bg-emerald-100 text-emerald-700 font-black flex items-center gap-2">

<FaCheckCircle />

Paid

</div>

}

</>

:

<>

<button

onClick={() =>
editFee(fee)
}

className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center hover:scale-105 transition-all"

>

<FaEdit />

</button>

<button

onClick={() =>
deleteFee(fee.id)
}

className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center hover:scale-105 transition-all"

>

<FaTrash />

</button>

{

fee.status === "Pending"

&&

<button

onClick={async()=>{

try{

await updateDoc(

doc(db,"fees",fee.id),

{

status:"Paid",

paidAt:
serverTimestamp()

}

)

alert("Fee Marked Paid")

}

catch(error){

console.log(error)

}

}}

className="px-5 py-3 rounded-2xl bg-emerald-100 text-emerald-700 font-black hover:scale-105 transition-all"

>

Mark Paid

</button>

}

</>

}

</div>

</td>

</motion.tr>

))

}

</tbody>

</table>

</div>

</div>

</div>


{

showModal &&

<div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[99999] flex items-center justify-center p-4">

<motion.div

initial={{
opacity:0,
scale:0.9
}}

animate={{
opacity:1,
scale:1
}}

className="w-full max-w-[600px] rounded-[40px] bg-white overflow-hidden"

>

<div className="p-8 border-b border-black/5 flex items-start justify-between">

<div>

<p className="uppercase tracking-[0.28em] text-orange-500 text-[10px] font-black mb-3">

FEE MANAGEMENT

</p>

<h1 className="text-[52px] leading-[0.9] tracking-[-0.08em] font-black">

{

editingFee

?

"Edit Fee"

:

"Add Fee"

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

<select

value={selectedCourse}

onChange={(e)=>
setSelectedCourse(
e.target.value
)
}

className="w-full h-[60px] px-5 rounded-[20px] bg-[#f7f4f1] border border-black/5 outline-none"

>

<option value="">
Select Course
</option>

{

coursesData.map((course)=>(

<option
key={course.id}
value={course.id}
>

{course.title}

</option>

))

}

</select>

<select

value={selectedStudent}

onChange={(e)=>
setSelectedStudent(
e.target.value
)
}

className="w-full h-[60px] px-5 rounded-[20px] bg-[#f7f4f1] border border-black/5 outline-none"

>

<option value="">
Select Student
</option>

{

studentsData.map((student)=>(

<option
key={student.studentId}
value={student.studentId}
>

{student.studentName}

</option>

))

}

</select>

<input

value={amount}

onChange={(e)=>
setAmount(
e.target.value
)
}

placeholder="Amount"

type="number"

className="w-full h-[60px] px-5 rounded-[20px] bg-[#f7f4f1] border border-black/5 outline-none"

/>

<input

value={dueDate}

onChange={(e)=>
setDueDate(
e.target.value
)
}

type="date"

className="w-full h-[60px] px-5 rounded-[20px] bg-[#f7f4f1] border border-black/5 outline-none"

/>

<select

value={status}

onChange={(e)=>
setStatus(
e.target.value
)
}

className="w-full h-[60px] px-5 rounded-[20px] bg-[#f7f4f1] border border-black/5 outline-none"

>

<option>
Pending
</option>

<option>
Paid
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

editingFee

?

updateFee

:

createFee

}

className="w-full h-[64px] rounded-[22px] bg-black text-white font-black text-lg"

>

{

editingFee

?

"Update Fee"

:

"Create Fee"

}

</motion.button>

</div>

</motion.div>

</div>

}

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
y:-6
}}

className="rounded-[36px] bg-white border border-black/5 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)]"

>

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

${color === "violet" && "bg-violet-100 text-violet-700"}
${color === "emerald" && "bg-emerald-100 text-emerald-700"}
${color === "orange" && "bg-orange-100 text-orange-700"}

`}>

{icon}

</div>

</div>

</motion.div>

  )

}

export default FeeManagement