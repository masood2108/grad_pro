import { useEffect, useState } from "react"

import { motion } from "framer-motion"

import {

collection,
addDoc,
onSnapshot,
serverTimestamp,
deleteDoc,
doc,
updateDoc

} from "firebase/firestore"

import {

db,
auth

} from "../firebase/firebase"

import MainLayout from "../layouts/MainLayout"

import {

FaVideo,
FaTrash,
FaCalendarAlt,
FaClock,
FaUserGraduate,
FaCheckCircle,
FaPlay,
FaPlus,
FaTimes

} from "react-icons/fa"

function OnlineClasses(){

const [classes,setClasses] =
useState([])

const [showModal,setShowModal] =
useState(false)

const [title,setTitle] =
useState("")

const [subject,setSubject] =
useState("")

const [faculty,setFaculty] =
useState("")

const [date,setDate] =
useState("")

const [time,setTime] =
useState("")

const [meetingLink,setMeetingLink] =
useState("")

const [userRole,setUserRole] =
useState("student")

useEffect(()=>{

const unsubscribe =

onSnapshot(

collection(db,"onlineClasses"),

(snapshot)=>{

const data = []

snapshot.forEach((docItem)=>{

data.push({

id:docItem.id,
...docItem.data()

})

})

setClasses(data)

}

)

return ()=>unsubscribe()

},[])

useEffect(()=>{

const getUser = async()=>{

const user = auth.currentUser

if(user){

const role =
localStorage.getItem("role")

if(role){

setUserRole(role)

}

}

}

getUser()

},[])

const resetForm = ()=>{

setTitle("")
setSubject("")
setFaculty("")
setDate("")
setTime("")
setMeetingLink("")

}

const createClass = async()=>{

if(

!title ||
!subject ||
!faculty ||
!date ||
!time ||
!meetingLink

){

return alert("Fill all fields")

}

try{

await addDoc(

collection(db,"onlineClasses"),

{

title,
subject,
faculty,
date,
time,
meetingLink,

status:"Upcoming",

createdAt:
serverTimestamp()

}

)

alert("Online Class Created")

resetForm()

setShowModal(false)

}

catch(error){

console.log(error)

}

}

const deleteClass = async(id)=>{

const confirmDelete =
window.confirm("Delete class?")

if(!confirmDelete) return

try{

await deleteDoc(

doc(
db,
"onlineClasses",
id
)

)

}

catch(error){

console.log(error)

}

}

const markCompleted = async(id)=>{

try{

await updateDoc(

doc(
db,
"onlineClasses",
id
),

{

status:"Completed"

}

)

}

catch(error){

console.log(error)

}

}

return(

<MainLayout>

<div className="flex-1 overflow-y-auto p-8">

<div className="flex items-center justify-between mb-12">

<div>

<p className="uppercase tracking-[0.3em] text-orange-500 text-xs font-black mb-4">

LMS ERP SYSTEM

</p>

<h1 className="text-[72px] leading-[0.85] tracking-[-0.08em] font-black">

Online
<br />
Classes

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
scale:0.97
}}

onClick={()=>
setShowModal(true)
}

className="px-8 py-5 rounded-[28px] bg-black text-white font-black text-lg flex items-center gap-4"

>

<FaPlus />

Create Class

</motion.button>

}

</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-12">

<StatCard
title="Total Classes"
value={classes.length}
icon={<FaVideo />}
color="violet"
/>

<StatCard
title="Upcoming"
value={
classes.filter(
(item)=>
item.status === "Upcoming"
).length
}
icon={<FaClock />}
color="orange"
/>

<StatCard
title="Completed"
value={
classes.filter(
(item)=>
item.status === "Completed"
).length
}
icon={<FaCheckCircle />}
color="emerald"
/>

</div>

<div className="space-y-7">

{

classes.map((item,index)=>(

<motion.div

key={item.id}

initial={{
opacity:0,
y:20
}}

animate={{
opacity:1,
y:0
}}

transition={{
delay:index * 0.05
}}

className="rounded-[40px] bg-white border border-black/5 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)]"

>

<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">

<div>

<div className="flex items-center gap-4 mb-5">

<div className="w-16 h-16 rounded-[24px] bg-violet-100 text-violet-700 flex items-center justify-center text-2xl">

<FaVideo />

</div>

<div>

<h1 className="text-4xl font-black tracking-[-0.06em]">

{item.title}

</h1>

<p className="text-black/50 font-bold mt-1">

{item.subject}

</p>

</div>

</div>

<div className="flex flex-wrap gap-4">

<div className="px-5 py-3 rounded-2xl bg-[#f5f5f5] flex items-center gap-3 font-bold">

<FaUserGraduate />

{item.faculty}

</div>

<div className="px-5 py-3 rounded-2xl bg-[#f5f5f5] flex items-center gap-3 font-bold">

<FaCalendarAlt />

{item.date}

</div>

<div className="px-5 py-3 rounded-2xl bg-[#f5f5f5] flex items-center gap-3 font-bold">

<FaClock />

{item.time}

</div>

</div>

</div>

<div className="flex flex-wrap gap-4">

{

item.status === "Upcoming"

?

<div className="px-6 py-4 rounded-2xl bg-orange-100 text-orange-700 font-black">

LIVE SOON

</div>

:

<div className="px-6 py-4 rounded-2xl bg-emerald-100 text-emerald-700 font-black">

COMPLETED

</div>

}

<a

href={item.meetingLink}

target="_blank"

rel="noreferrer"

className="px-8 py-4 rounded-2xl bg-black text-white font-black flex items-center gap-3"

>

<FaPlay />

Join Class

</a>

{

(
userRole === "admin" ||
userRole === "faculty"
) &&

<>

<button

onClick={()=>
markCompleted(item.id)
}

className="px-8 py-4 rounded-2xl bg-emerald-100 text-emerald-700 font-black"

>

Complete

</button>

<button

onClick={()=>
deleteClass(item.id)
}

className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl"

>

<FaTrash />

</button>

</>

}

</div>

</div>

</motion.div>

))

}

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

className="w-full max-w-[700px] rounded-[40px] bg-white overflow-hidden"

>

<div className="p-8 border-b border-black/5 flex items-center justify-between">

<div>

<p className="uppercase tracking-[0.25em] text-orange-500 text-xs font-black mb-4">

ONLINE CLASS MANAGEMENT

</p>

<h1 className="text-[52px] leading-[0.9] tracking-[-0.08em] font-black">

Create
<br />
Online Class

</h1>

</div>

<button

onClick={()=>
setShowModal(false)
}

className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center"

>

<FaTimes />

</button>

</div>

<div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-5">

<input

placeholder="Class Title"

value={title}

onChange={(e)=>
setTitle(e.target.value)
}

className="h-[64px] px-5 rounded-[20px] bg-[#f5f5f5] outline-none"

/>

<input

placeholder="Subject"

value={subject}

onChange={(e)=>
setSubject(e.target.value)
}

className="h-[64px] px-5 rounded-[20px] bg-[#f5f5f5] outline-none"

/>

<input

placeholder="Faculty Name"

value={faculty}

onChange={(e)=>
setFaculty(e.target.value)
}

className="h-[64px] px-5 rounded-[20px] bg-[#f5f5f5] outline-none"

/>

<input

type="date"

value={date}

onChange={(e)=>
setDate(e.target.value)
}

className="h-[64px] px-5 rounded-[20px] bg-[#f5f5f5] outline-none"

/>

<input

type="time"

value={time}

onChange={(e)=>
setTime(e.target.value)
}

className="h-[64px] px-5 rounded-[20px] bg-[#f5f5f5] outline-none"

/>

<input

placeholder="Google Meet / Zoom Link"

value={meetingLink}

onChange={(e)=>
setMeetingLink(e.target.value)
}

className="h-[64px] px-5 rounded-[20px] bg-[#f5f5f5] outline-none"

/>

<div className="md:col-span-2">

<button

onClick={createClass}

className="w-full h-[70px] rounded-[24px] bg-black text-white font-black text-lg"

>

Create Online Class

</button>

</div>

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

}){

return(

<motion.div

whileHover={{
y:-5
}}

className="rounded-[36px] bg-white border border-black/5 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)]"

>

<div className="flex items-center justify-between">

<div>

<p className="uppercase tracking-[0.25em] text-xs text-black/40 font-black">

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

export default OnlineClasses