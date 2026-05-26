import {
  useEffect,
  useState
} from "react"

import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc
} from "firebase/firestore"

import {
  db,
  auth
} from "../firebase/firebase"

import MainLayout from "../layouts/MainLayout"

import {
  FaBell,
  FaCheckCircle,
  FaBook,
  FaCertificate,
  FaClipboardCheck,
  FaBolt,
  FaEnvelopeOpenText
} from "react-icons/fa"

import {
  motion
} from "framer-motion"

function Notifications(){

  const [notifications,setNotifications] =
  useState([])

  const [loading,setLoading] =
  useState(true)

  useEffect(()=>{

    const user =
    auth.currentUser

    if(!user) return

    const q = query(

      collection(db,"notifications"),

      where(
        "userId",
        "in",
        [
          user.uid,
          "all"
        ]
      ),

      orderBy(
        "createdAt",
        "desc"
      )

    )

    const unsubscribe =
    onSnapshot(q,(snapshot)=>{

      const data = []

      snapshot.forEach((doc)=>{

        data.push({

          id:doc.id,
          ...doc.data()

        })

      })

      setNotifications(data)

      setLoading(false)

    })

    return ()=>unsubscribe()

  },[])

  const markAsRead = async(id) => {

    try{

      await updateDoc(

        doc(
          db,
          "notifications",
          id
        ),

        {
          read:true
        }

      )

    }

    catch(error){

      console.log(error)

    }

  }

  const getIcon = (type) => {

    if(type === "assignment"){

      return <FaBook />

    }

    if(type === "certificate"){

      return <FaCertificate />

    }

    if(type === "attendance"){

      return <FaClipboardCheck />

    }

    return <FaBell />

  }

  return (

<MainLayout>

<div className="flex-1 min-w-0 overflow-hidden relative">

{/* BG */}

<div className="absolute top-[-180px] right-[-100px] w-[500px] h-[500px] bg-violet-300/20 blur-[140px] rounded-full pointer-events-none" />

<div className="absolute bottom-[-180px] left-[-100px] w-[500px] h-[500px] bg-orange-300/20 blur-[140px] rounded-full pointer-events-none" />

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

className="mt-6 rounded-[45px] bg-white/75 backdrop-blur-3xl border border-white shadow-[0_20px_80px_rgba(0,0,0,0.05)] overflow-hidden relative"

>

<div className="absolute top-[-120px] right-[-100px] w-[300px] h-[300px] bg-violet-300/20 blur-[120px] rounded-full" />

<div className="absolute bottom-[-120px] left-[-100px] w-[300px] h-[300px] bg-orange-300/20 blur-[120px] rounded-full" />

<div className="relative z-10 p-10 md:p-14 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">

<div>

<p className="uppercase tracking-[0.3em] text-orange-500 text-xs font-black mb-5">

REALTIME LMS ALERTS

</p>

<h1 className="text-6xl md:text-8xl leading-[0.9] tracking-[-0.08em] font-black">

Notifications
<br />
Center

</h1>

<p className="mt-8 text-2xl text-black/45 leading-relaxed max-w-3xl">

Get realtime alerts for
assignments, attendance,
certificates and platform
activities instantly.

</p>

<div className="flex flex-wrap gap-5 mt-10">

<div className="px-7 py-5 rounded-[28px] bg-white border border-black/5 shadow-xl">

<p className="uppercase tracking-[0.22em] text-xs text-black/35 font-black">

Total Alerts

</p>

<h1 className="text-3xl font-black mt-3">

{notifications.length}

</h1>

</div>

<div className="px-7 py-5 rounded-[28px] bg-black text-white shadow-xl">

<p className="uppercase tracking-[0.22em] text-xs text-white/35 font-black">

Unread

</p>

<h1 className="text-3xl font-black mt-3">

{

notifications.filter(
(item)=>!item.read
).length

}

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

<FaBell className="text-6xl" />

</motion.div>

</div>

</motion.div>

{/* NOTIFICATIONS */}

<div className="mt-10 space-y-6">

{

loading

?

<div className="h-[400px] flex flex-col items-center justify-center">

<div className="w-24 h-24 rounded-[30px] bg-black text-white flex items-center justify-center text-4xl animate-pulse">

<FaBolt />

</div>

<h1 className="text-5xl font-black mt-8">

Loading Notifications...

</h1>

</div>

:

notifications.length === 0

?

<div className="h-[400px] flex flex-col items-center justify-center">

<div className="w-28 h-28 rounded-[30px] bg-violet-100 text-violet-700 flex items-center justify-center text-5xl">

<FaEnvelopeOpenText />

</div>

<h1 className="text-5xl font-black mt-8">

No Notifications Yet

</h1>

<p className="text-black/40 mt-4 text-lg">

Realtime alerts will appear here.

</p>

</div>

:

notifications.map((item,index)=>(

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

className={`

rounded-[38px]
border
p-8
shadow-[0_20px_60px_rgba(0,0,0,0.05)]
transition-all

${

item.read

?

"bg-white border-black/5"

:

"bg-violet-50 border-violet-200"

}

`}

>

<div className="flex items-start gap-5">

<div className={`

w-20 h-20 rounded-[28px]
flex items-center justify-center
text-3xl

${

item.read

?

"bg-black text-white"

:

"bg-violet-600 text-white"

}

`}>

{getIcon(item.type)}

</div>

<div className="flex-1">

<div className="flex flex-wrap items-center justify-between gap-4">

<div>

<h1 className="text-3xl font-black">

{item.title}

</h1>

<p className="mt-4 text-black/50 text-lg leading-relaxed">

{item.message}

</p>

</div>

{

!item.read &&

<button

onClick={()=>
markAsRead(item.id)
}

className="px-6 py-4 rounded-full bg-black text-white font-black text-sm shadow-lg"

>

Mark Read

</button>

}

</div>

<div className="mt-6 inline-flex items-center gap-3 px-5 py-3 rounded-full bg-emerald-100 text-emerald-700 font-black text-sm">

<FaCheckCircle />

Realtime Notification

</div>

</div>

</div>

</motion.div>

))

}

</div>

</div>

</div>

</MainLayout>

  )

}

export default Notifications