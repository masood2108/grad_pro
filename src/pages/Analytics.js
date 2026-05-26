/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

import MainLayout from "../layouts/MainLayout"
import Navbar from "../components/Navbar"

import {
  collection,
  onSnapshot
} from "firebase/firestore"

import { db } from "../firebase/firebase"

import {
  FaChartLine,
  FaUsers,
  FaCalendarAlt,
  FaHandshake,
  FaArrowUp,
  FaBolt,
  FaFire,
  FaStar,
  FaChartPie,
  FaGlobe,
  FaCoins
} from "react-icons/fa"

function Analytics() {

  const [events,setEvents] =
  useState([])

  const [volunteers,setVolunteers] =
  useState([])

  const [sponsors,setSponsors] =
  useState([])

  useEffect(()=>{

    const unsubEvents =
    onSnapshot(

      collection(db,"events"),

      (snapshot)=>{

        const data=[]

        snapshot.forEach((doc)=>{

          data.push(doc.data())

        })

        setEvents(data)

      }

    )

    const unsubVolunteers =
    onSnapshot(

      collection(db,"volunteers"),

      (snapshot)=>{

        setVolunteers(snapshot.docs)

      }

    )

    const unsubSponsors =
    onSnapshot(

      collection(db,"sponsors"),

      (snapshot)=>{

        const data=[]

        snapshot.forEach((doc)=>{

          data.push(doc.data())

        })

        setSponsors(data)

      }

    )

    return ()=>{

      unsubEvents()
      unsubVolunteers()
      unsubSponsors()

    }

  },[])

  const totalRegistrations =
  events.reduce(

    (acc,event)=>

      acc + Number(event.registrations || 0),

    0

  )

  const totalSponsors =
  sponsors.reduce(

    (acc,s)=>

      acc + Number(s.amount || 0),

    0

  )

  return (

 <MainLayout>


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

            className="mt-6 rounded-[45px] bg-white/75 backdrop-blur-3xl border border-white shadow-[0_20px_80px_rgba(0,0,0,0.05)] overflow-hidden relative"

          >

            <div className="absolute top-[-120px] right-[-100px] w-[320px] h-[320px] bg-violet-300/20 blur-[120px] rounded-full" />

            <div className="absolute bottom-[-120px] left-[-100px] w-[320px] h-[320px] bg-orange-300/20 blur-[120px] rounded-full" />

            <div className="relative z-10 p-10 md:p-14 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">

              <div>

                <p className="uppercase tracking-[0.3em] text-orange-500 text-xs font-black mb-5">

                  REALTIME PLATFORM INSIGHTS

                </p>

                <h1 className="text-6xl md:text-8xl leading-[0.9] tracking-[-0.08em] font-black">

                  Analytics
                  <br />

                  Dashboard

                </h1>

                <p className="mt-8 text-2xl text-black/45 leading-relaxed max-w-3xl">

                  Monitor registrations,
                  sponsorships, volunteers,
                  funding and realtime
                  platform growth analytics.

                </p>

                <div className="flex flex-wrap gap-5 mt-10">

                  <div className="px-7 py-5 rounded-[28px] bg-white border border-black/5 shadow-xl">

                    <p className="uppercase tracking-[0.25em] text-xs text-black/35 font-black">

                      Total Events

                    </p>

                    <h1 className="text-3xl font-black mt-3">

                      {events.length}

                    </h1>

                  </div>

                  <div className="px-7 py-5 rounded-[28px] bg-black text-white shadow-xl">

                    <p className="uppercase tracking-[0.25em] text-xs text-white/35 font-black">

                      Platform Status

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

                <FaChartPie className="text-6xl" />

              </motion.div>

            </div>

          </motion.div>


          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-8 mt-8">

            <Card
              title="Events"
              value={events.length}
              icon={<FaCalendarAlt />}
              color="violet"
              growth="+18%"
            />

            <Card
              title="Registrations"
              value={totalRegistrations}
              icon={<FaUsers />}
              color="orange"
              growth="+32%"
            />

            <Card
              title="Sponsors"
              value={sponsors.length}
              icon={<FaHandshake />}
              color="emerald"
              growth="+12%"
            />

            <Card
              title="Funding"
              value={`₹ ${totalSponsors}`}
              icon={<FaCoins />}
              color="cyan"
              growth="+44%"
            />

          </div>


          <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-8 mt-8">


            <motion.div

              whileHover={{
                y:-6
              }}

              className="rounded-[40px] bg-white border border-black/5 shadow-[0_20px_80px_rgba(0,0,0,0.05)] p-8 overflow-hidden relative"

            >

              <div className="absolute top-[-100px] right-[-80px] w-[240px] h-[240px] bg-violet-300/20 blur-[100px] rounded-full" />

              <div className="flex items-center justify-between mb-10 relative z-10">

                <div>

                  <p className="uppercase tracking-[0.25em] text-xs font-black text-orange-500 mb-3">

                    Performance Overview

                  </p>

                  <h1 className="text-5xl font-black">

                    Platform Growth

                  </h1>

                </div>

                <div className="w-16 h-16 rounded-[24px] bg-black text-white flex items-center justify-center text-2xl">

                  <FaChartLine />

                </div>

              </div>


              <div className="h-[340px] flex items-end gap-5 relative z-10">

                {[35,55,70,48,85,95,65,100].map((h,i)=>(

                  <motion.div

                    key={i}

                    initial={{
                      height:0
                    }}

                    animate={{
                      height:`${h}%`
                    }}

                    transition={{
                      duration:1,
                      delay:i * 0.08
                    }}

                    className="flex-1 rounded-t-[35px] bg-gradient-to-t from-violet-500 via-fuchsia-500 to-orange-300 shadow-[0_20px_40px_rgba(139,92,246,0.25)]"

                  />

                ))}

              </div>

            </motion.div>


            <motion.div

              whileHover={{
                y:-6
              }}

              className="rounded-[40px] bg-black text-white p-8 relative overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.15)]"

            >

              <div className="absolute top-[-120px] right-[-100px] w-[260px] h-[260px] bg-violet-500/30 blur-[120px] rounded-full" />

              <div className="relative z-10">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="uppercase tracking-[0.25em] text-xs text-white/40 font-black mb-3">

                      Live Activity

                    </p>

                    <h1 className="text-5xl font-black">

                      Insights

                    </h1>

                  </div>

                  <div className="w-16 h-16 rounded-[24px] bg-white/10 flex items-center justify-center text-2xl">

                    <FaBolt />

                  </div>

                </div>

                <div className="space-y-5 mt-10">

                  <InsightCard
                    icon={<FaCalendarAlt />}
                    title={`${events.length} Active Events`}
                    subtitle="Realtime event tracking"
                  />

                  <InsightCard
                    icon={<FaUsers />}
                    title={`${totalRegistrations} Registrations`}
                    subtitle="Students joined events"
                  />

                  <InsightCard
                    icon={<FaHandshake />}
                    title={`${sponsors.length} Sponsors`}
                    subtitle="Partnership growth"
                  />

                  <InsightCard
                    icon={<FaGlobe />}
                    title="Platform Expanding"
                    subtitle="Realtime analytics active"
                  />

                </div>

              </div>

            </motion.div>

          </div>

        </div>

</MainLayout>


  )

}

function Card({

  title,
  value,
  icon,
  color,
  growth

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

        ${color === "violet" && "bg-gradient-to-r from-violet-500 to-fuchsia-500"}
        ${color === "orange" && "bg-gradient-to-r from-orange-400 to-yellow-300"}
        ${color === "emerald" && "bg-gradient-to-r from-emerald-500 to-green-400"}
        ${color === "cyan" && "bg-gradient-to-r from-cyan-500 to-blue-500"}

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

          ${color === "violet" && "bg-violet-100 text-violet-700"}
          ${color === "orange" && "bg-orange-100 text-orange-700"}
          ${color === "emerald" && "bg-emerald-100 text-emerald-700"}
          ${color === "cyan" && "bg-cyan-100 text-cyan-700"}

        `}>

          {icon}

        </div>

      </div>

      <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-black">

        <FaArrowUp />

        {growth}

      </div>

    </motion.div>

  )

}

function InsightCard({

  icon,
  title,
  subtitle

}) {

  return (

    <motion.div

      whileHover={{
        x:8
      }}

      className="rounded-[24px] bg-white/5 border border-white/5 p-5 flex items-center gap-4"

    >

      <div className="w-14 h-14 rounded-[20px] bg-gradient-to-r from-violet-500 to-orange-400 flex items-center justify-center text-xl">

        {icon}

      </div>

      <div>

        <h1 className="font-black text-lg">

          {title}

        </h1>

        <p className="text-white/40 text-sm mt-1">

          {subtitle}

        </p>

      </div>
    </motion.div>

  )

}

export default Analytics