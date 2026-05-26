/* eslint-disable no-unused-vars */
import {
  useEffect,
  useState
} from "react"

import {
  collection,
  onSnapshot,
  getDoc,
  doc
} from "firebase/firestore"

import {
  db,
  auth
} from "../firebase/firebase"

import MainLayout from "../layouts/MainLayout"

import {
  FaChartLine,
  FaCheckCircle,
  FaClock,
  FaBook,
  FaFileExcel,
  FaFilePdf,
  FaUserGraduate,
  FaArrowUp,
  FaBolt,
  FaDownload,
  FaMedal,
  FaFire,
  FaTrophy,
  FaLayerGroup,
  FaStar,
  FaAward
} from "react-icons/fa"

import * as XLSX from "xlsx"

import jsPDF from "jspdf"

import autoTable from "jspdf-autotable"

import {
  motion
} from "framer-motion"

import {

  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  BarChart,
  Bar

} from "recharts"

function StudentProgress() {

  const [submissions, setSubmissions] =
  useState([])

  const [userRole, setUserRole] =
  useState("student")

  const [userName, setUserName] =
  useState("")

  const [loading, setLoading] =
  useState(true)

  useEffect(() => {

    const getRole = async () => {

      const user =
      auth.currentUser

      if (user) {

        const userRef =
        doc(db, "users", user.uid)

        const userSnap =
        await getDoc(userRef)

        if (userSnap.exists()) {

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

      collection(db, "submissions"),

      (snapshot) => {

        const data = []

        snapshot.forEach((doc) => {

          data.push({

            id: doc.id,
            ...doc.data()

          })

        })

        setSubmissions(data)

        setLoading(false)

      }

    )

    return () => unsubscribe()

  }, [])

  const filteredData =

  userRole === "student"

  ?

  submissions.filter(

    (submission) =>

      submission.studentName ===
      userName

  )

  :

  submissions

  const totalAssignments =
  filteredData.length

  const completedAssignments =
  filteredData.filter(

    (submission) =>

      submission.marks !== null

  ).length

  const pendingAssignments =
  totalAssignments -
  completedAssignments

  const averageMarks =

  filteredData.length > 0

  ?

  Math.round(

    filteredData.reduce(

      (acc, curr) =>

        acc + (curr.marks || 0),

      0

    ) / filteredData.length

  )

  :

  0

  const progressPercentage =

  totalAssignments > 0

  ?

  Math.round(

    (
      completedAssignments /

      totalAssignments
    ) * 100

  )

  :

  0

  const topperScore =

  filteredData.length > 0

  ?

  Math.max(

    ...filteredData.map(

      (item) => item.marks || 0
    )

  )

  :

  0

  const chartData = [

    {
      name:"Assignments",
      value:totalAssignments
    },

    {
      name:"Completed",
      value:completedAssignments
    },

    {
      name:"Pending",
      value:pendingAssignments
    }

  ]

  const marksData =

  filteredData.map((item,index)=>({

    name:`A${index + 1}`,
    marks:item.marks || 0

  }))

  const downloadExcel = () => {

    const worksheet =

    XLSX.utils.json_to_sheet(

      filteredData.map((item) => ({

        Student: item.studentName,
        Marks: item.marks,
        Feedback: item.feedback

      }))

    )

    const workbook =
    XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(

      workbook,
      worksheet,
      "Progress"

    )

    XLSX.writeFile(

      workbook,
      "student_progress.xlsx"

    )

  }

  const downloadPDF = () => {

    const pdf =
    new jsPDF()

    pdf.text(

      "Student Progress Report",

      14,
      20

    )

    autoTable(pdf, {

      startY: 30,

      head: [

        [

          "Student",

          "Marks",

          "Feedback"

        ]

      ],

      body:

      filteredData.map((item) => ([

        item.studentName,

        item.marks ?? "Pending",

        item.feedback

      ]))

    })

    pdf.save(
      "student_progress.pdf"
    )

  }

  return (

<MainLayout>

<div className="flex-1 min-w-0 overflow-hidden relative">


<div className="absolute top-[-180px] right-[-100px] w-[500px] h-[500px] bg-violet-300/20 blur-[140px] rounded-full pointer-events-none" />

<div className="absolute bottom-[-180px] left-[-100px] w-[500px] h-[500px] bg-orange-300/20 blur-[140px] rounded-full pointer-events-none" />

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

ADVANCED LMS ANALYTICS

</p>

<h1 className="text-6xl md:text-8xl leading-[0.9] tracking-[-0.08em] font-black">

Progress
<br />
Dashboard

</h1>

<p className="mt-8 text-2xl text-black/45 leading-relaxed max-w-3xl">

Track student performance,
assignment completion,
marks analytics and realtime
academic insights.

</p>

<div className="flex flex-wrap gap-5 mt-10">

<div className="px-7 py-5 rounded-[28px] bg-white shadow-xl border border-black/5">

<p className="uppercase tracking-[0.22em] text-xs text-black/35 font-black">

Logged In

</p>

<h1 className="text-3xl font-black mt-3 capitalize">

{userRole}

</h1>

</div>

<div className="px-7 py-5 rounded-[28px] bg-black text-white shadow-xl">

<p className="uppercase tracking-[0.22em] text-xs text-white/35 font-black">

Overall Progress

</p>

<h1 className="text-3xl font-black mt-3">

{progressPercentage}%

</h1>

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

<FaChartLine className="text-6xl" />

</motion.div>

</div>

</motion.div>


{

(
  userRole === "admin" ||

  userRole === "faculty"
) &&

<div className="flex gap-5 mt-8 mb-8 flex-wrap">

<motion.button

whileHover={{
  scale:1.03
}}

whileTap={{
  scale:0.97
}}

onClick={downloadExcel}

className="px-8 py-5 rounded-[28px] bg-emerald-100 text-emerald-700 font-black flex items-center gap-4 shadow-lg"

>

<FaFileExcel />

Export Excel

</motion.button>

<motion.button

whileHover={{
  scale:1.03
}}

whileTap={{
  scale:0.97
}}

onClick={downloadPDF}

className="px-8 py-5 rounded-[28px] bg-rose-100 text-rose-700 font-black flex items-center gap-4 shadow-lg"

>

<FaFilePdf />

Export PDF

</motion.button>

</div>

}


<div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-5 gap-8 mb-10">

<StatCard
title="Assignments"
value={totalAssignments}
icon={<FaBook />}
color="purple"
/>

<StatCard
title="Completed"
value={completedAssignments}
icon={<FaCheckCircle />}
color="emerald"
/>

<StatCard
title="Average"
value={`${averageMarks}%`}
icon={<FaMedal />}
color="orange"
/>

<StatCard
title="Top Score"
value={`${topperScore}%`}
icon={<FaTrophy />}
color="yellow"
/>

<StatCard
title="Progress"
value={`${progressPercentage}%`}
icon={<FaFire />}
color="cyan"
/>

</div>


<div className="rounded-[40px] bg-white border border-black/5 shadow-[0_25px_80px_rgba(0,0,0,0.05)] p-8 mb-10">

<div className="flex items-center justify-between mb-6">

<div>

<p className="uppercase tracking-[0.22em] text-xs text-orange-500 font-black mb-2">

Realtime Completion

</p>

<h1 className="text-4xl font-black">

Academic Progress

</h1>

</div>

<div className="w-20 h-20 rounded-[28px] bg-black text-white flex items-center justify-center text-3xl">

<FaBolt />

</div>

</div>

<div className="w-full h-[22px] rounded-full bg-[#f2ede8] overflow-hidden">

<motion.div

initial={{
  width:0
}}

animate={{
  width:`${progressPercentage}%`
}}

transition={{
  duration:1.2
}}

className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-400"

 />

</div>

<div className="flex justify-between mt-5">

<p className="font-black text-black/45">

Completed {completedAssignments} Tasks

</p>

<p className="font-black text-violet-700">

{progressPercentage}% Finished

</p>

</div>

</div>


<div className="grid grid-cols-1 2xl:grid-cols-2 gap-8 mb-10">


<div className="rounded-[40px] bg-white border border-black/5 shadow-[0_25px_80px_rgba(0,0,0,0.05)] p-8">

<div className="flex items-center justify-between mb-8">

<div>

<p className="uppercase tracking-[0.22em] text-xs text-orange-500 font-black mb-2">

Activity Analytics

</p>

<h1 className="text-4xl font-black">

Assignment Stats

</h1>

</div>

<div className="w-16 h-16 rounded-[24px] bg-violet-100 text-violet-700 flex items-center justify-center text-2xl">

<FaLayerGroup />

</div>

</div>

<div className="h-[320px]">

<ResponsiveContainer width="100%" height="100%">

<AreaChart data={chartData}>

<XAxis dataKey="name" />

<Tooltip />

<Area
type="monotone"
dataKey="value"
stroke="#7c3aed"
fill="#c4b5fd"
/>

</AreaChart>

</ResponsiveContainer>

</div>

</div>


<div className="rounded-[40px] bg-white border border-black/5 shadow-[0_25px_80px_rgba(0,0,0,0.05)] p-8">

<div className="flex items-center justify-between mb-8">

<div>

<p className="uppercase tracking-[0.22em] text-xs text-orange-500 font-black mb-2">

Performance Analytics

</p>

<h1 className="text-4xl font-black">

Marks Overview

</h1>

</div>

<div className="w-16 h-16 rounded-[24px] bg-orange-100 text-orange-700 flex items-center justify-center text-2xl">

<FaAward />

</div>

</div>

<div className="h-[320px]">

<ResponsiveContainer width="100%" height="100%">

<BarChart data={marksData}>

<XAxis dataKey="name" />

<Tooltip />

<Bar
dataKey="marks"
radius={[12,12,0,0]}
fill="#fb923c"
/>

</BarChart>

</ResponsiveContainer>

</div>

</div>

</div>


{

loading

?

<div className="h-[400px] flex items-center justify-center">

<h1 className="text-5xl font-black">

Loading Progress...

</h1>

</div>

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

className="rounded-[40px] overflow-hidden bg-white border border-black/5 shadow-[0_25px_80px_rgba(0,0,0,0.05)]"

>

<div className="p-8 border-b border-black/5 flex items-center justify-between flex-wrap gap-5">

<div>

<p className="uppercase tracking-[0.25em] text-xs text-orange-500 font-black mb-3">

PERFORMANCE REPORTS

</p>

<h1 className="text-5xl leading-none tracking-[-0.08em] font-black">

Student Reports

</h1>

</div>

<div className="w-20 h-20 rounded-[28px] bg-black text-white flex items-center justify-center text-3xl shadow-xl">

<FaUserGraduate />

</div>

</div>

<div className="overflow-x-auto">

<table className="w-full min-w-[900px]">

<thead>

<tr className="bg-[#faf7f3]">

<th className="text-left px-8 py-6 text-xs uppercase tracking-[0.25em] text-black/40 font-black">

Student

</th>

<th className="text-left px-8 py-6 text-xs uppercase tracking-[0.25em] text-black/40 font-black">

Marks

</th>

<th className="text-left px-8 py-6 text-xs uppercase tracking-[0.25em] text-black/40 font-black">

Feedback

</th>

<th className="text-left px-8 py-6 text-xs uppercase tracking-[0.25em] text-black/40 font-black">

Status

</th>

</tr>

</thead>

<tbody>

{

filteredData.map((item,index) => (

<motion.tr

initial={{
  opacity:0,
  y:10
}}

animate={{
  opacity:1,
  y:0
}}

transition={{
  delay:index * 0.05
}}

key={item.id}

className="border-t border-black/5 hover:bg-[#faf7f3] transition-all"

>

<td className="px-8 py-6">

<div className="flex items-center gap-4">

<div className="w-14 h-14 rounded-[20px] bg-violet-100 flex items-center justify-center text-violet-700 text-xl">

<FaUserGraduate />

</div>

<div>

<h1 className="font-black text-lg">

{item.studentName}

</h1>

<p className="text-black/35 text-sm mt-1">

LMS Student

</p>

</div>

</div>

</td>

<td className="px-8 py-6">

{

item.marks !== null

?

<div className="inline-flex px-5 py-3 rounded-full bg-emerald-100 text-emerald-700 font-black text-lg">

{item.marks}%

</div>

:

<div className="inline-flex px-5 py-3 rounded-full bg-yellow-100 text-yellow-700 font-black text-sm">

Pending

</div>

}

</td>

<td className="px-8 py-6 text-black/50 leading-relaxed font-medium">

{item.feedback}

</td>

<td className="px-8 py-6">

{

item.marks !== null

?

<div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-emerald-100 text-emerald-700 font-black">

<FaCheckCircle />

Reviewed

</div>

:

<div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-orange-100 text-orange-700 font-black">

<FaClock />

Pending

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
${color === "orange" && "bg-gradient-to-r from-orange-500 to-yellow-400"}
${color === "cyan" && "bg-gradient-to-r from-cyan-500 to-blue-500"}
${color === "yellow" && "bg-gradient-to-r from-yellow-400 to-orange-400"}

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
${color === "orange" && "bg-orange-100 text-orange-700"}
${color === "cyan" && "bg-cyan-100 text-cyan-700"}
${color === "yellow" && "bg-yellow-100 text-yellow-700"}

`}>

{icon}

</div>

</div>

<div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-sm font-black">

<FaArrowUp />

Live Analytics

</div>

</motion.div>

)

}

export default StudentProgress