/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

import { useParams } from "react-router-dom"
import MainLayout from "../layouts/MainLayout"

import {

  doc,
  onSnapshot,
  collection

} from "firebase/firestore"

import { db } from "../firebase/firebase"

import {

  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaCircle,
  FaChartLine,
  FaUserTie,
  FaQrcode,
  FaArrowUp,
  FaBolt,
  FaClock,
  FaTicketAlt,
  FaVideo,
  FaMoneyBillWave,
  FaCheckCircle,
  FaRobot,
  FaFire,
  FaStar,
  FaTrophy,
  FaRocket

} from "react-icons/fa"

function EventDetails() {

  const { id } = useParams()

  const [event, setEvent] =
  useState(null)

  const [volunteers, setVolunteers] =
  useState([])

  const [loading, setLoading] =
  useState(true)

  useEffect(() => {

    const unsubEvent =

      onSnapshot(

        doc(db, "events", id),

        (snapshot) => {

          if (snapshot.exists()) {

            setEvent({

              id: snapshot.id,
              ...snapshot.data()

            })

          }

          setLoading(false)

        }

      )

    const unsubVolunteers =

      onSnapshot(

        collection(db, "volunteers"),

        (snapshot) => {

          const data = []

          snapshot.forEach((doc) => {

            data.push({

              id: doc.id,
              ...doc.data()

            })

          })

          setVolunteers(data)

        }

      )

    return () => {

      unsubEvent()
      unsubVolunteers()

    }

  }, [id])

  if (loading) {

    return (

      <div className="min-h-screen bg-[#f6efe7] flex items-center justify-center">

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

          <div className="w-24 h-24 rounded-[30px] bg-black text-white flex items-center justify-center shadow-[0_20px_80px_rgba(0,0,0,0.15)]">

            <FaRocket className="text-4xl" />

          </div>

          <h1 className="mt-6 text-4xl font-black text-black">

            Loading Event...

          </h1>

        </motion.div>

      </div>

    )

  }

  if (!event) {

    return (

      <div className="min-h-screen bg-[#f6efe7] flex items-center justify-center">

        <h1 className="text-5xl font-black text-black">

          Event Not Found

        </h1>

      </div>

    )

  }

  return (

    <MainLayout>

      <div className="flex-1 min-w-0 overflow-hidden relative">

        <div className="absolute top-[-200px] right-[-100px] w-[500px] h-[500px] bg-violet-300/20 blur-[140px] rounded-full pointer-events-none" />

        <div className="absolute bottom-[-200px] left-[-100px] w-[500px] h-[500px] bg-orange-300/20 blur-[140px] rounded-full pointer-events-none" />

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

            className="mt-6 relative overflow-hidden rounded-[45px] bg-white border border-black/5 shadow-[0_20px_80px_rgba(0,0,0,0.05)]"

          >


            <div className="h-[520px] relative overflow-hidden">

              <img

                src={event.image}

                alt=""

                className="w-full h-full object-cover scale-[1.02]"

              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#f6efe7] via-[#f6efe7]/20 to-transparent" />

              <div className="absolute top-8 right-8 flex gap-4">

                <div className={`

                  px-6 py-3 rounded-full text-xs font-black uppercase tracking-[0.25em] backdrop-blur-xl border

                  ${

                    event.status === "Live"

                      ?

                      "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"

                      :

                      event.status === "Upcoming"

                        ?

                        "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"

                        :

                        "bg-rose-500/10 text-rose-600 border-rose-500/20"

                  }

                `}>

                  <div className="flex items-center gap-3">

                    <FaCircle className="text-[10px]" />

                    {event.status}

                  </div>

                </div>

              </div>

            </div>


            <div className="relative px-10 md:px-14 pb-14 -mt-28 z-10">

              <div className="rounded-[40px] bg-white/80 backdrop-blur-3xl border border-white shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-10">

                <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-10">

                  <div className="max-w-4xl">

                    <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-orange-100 text-orange-600 text-xs font-black uppercase tracking-[0.3em]">

                      <FaFire />

                      Smart Event Experience
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-[-0.08em] leading-[0.9] mt-8">

                      {event.title}
                    </h1>

                    <p className="text-black/45 text-xl leading-relaxed mt-8 max-w-3xl">

                      {

                        event.description ||

                        "Realtime immersive event experience powered by smart analytics, AI automation, volunteer management and modern engagement tools."

                      }

                    </p>


                    <div className="flex flex-wrap gap-5 mt-10">

                      <InfoPill

                        icon={<FaMapMarkerAlt />}

                        text={event.venue || "Venue"}

                      />

                      <InfoPill

                        icon={<FaCalendarAlt />}

                        text={event.date || "Date"}

                      />

                      <InfoPill

                        icon={<FaUsers />}

                        text={`${event.registrations || 0} Registrations`}

                      />

                    </div>

                  </div>


                  <div className="grid grid-cols-2 gap-5 min-w-[320px]">

                    <QuickCard

                      title="Participants"

                      value={event.registrations || 0}

                      icon={<FaUsers />}

                    />

                    <QuickCard

                      title="Volunteers"

                      value={volunteers.length}

                      icon={<FaUserTie />}

                    />

                    <QuickCard

                      title="Capacity"

                      value={event.maxParticipants || 0}

                      icon={<FaTicketAlt />}

                    />

                    <QuickCard

                      title="Status"

                      value={event.status}

                      icon={<FaCheckCircle />}

                    />

                  </div>

                </div>

              </div>

            </div>

          </motion.div>


          <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.7fr] gap-8 mt-8">


            <div className="space-y-8">


              <motion.div

                initial={{
                  opacity:0,
                  y:20
                }}

                animate={{
                  opacity:1,
                  y:0
                }}

                className="rounded-[40px] bg-white border border-black/5 shadow-[0_20px_80px_rgba(0,0,0,0.05)] p-8"

              >

                <div className="flex items-center justify-between mb-10">

                  <div>

                    <p className="uppercase tracking-[0.3em] text-orange-500 text-xs font-black mb-4">

                      ANALYTICS OVERVIEW

                    </p>

                    <h1 className="text-5xl font-black">

                      Event Performance

                    </h1>

                  </div>

                  <div className="w-16 h-16 rounded-[24px] bg-black text-white flex items-center justify-center text-2xl">

                    <FaChartLine />

                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <AnalyticsCard

                    title="Registrations"

                    value={event.registrations || 0}

                    color="purple"

                  />

                  <AnalyticsCard

                    title="Max Capacity"

                    value={event.maxParticipants || 0}

                    color="cyan"

                  />

                  <AnalyticsCard

                    title="Volunteer Team"

                    value={volunteers.length}

                    color="emerald"

                  />

                  <AnalyticsCard

                    title="Event Status"

                    value={event.status}

                    color="yellow"

                  />

                </div>

              </motion.div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <FeatureCard

                  icon={<FaQrcode />}

                  title="QR Ticketing"

                  desc="Realtime QR-based ticket validation and smart entry access."

                />

                <FeatureCard

                  icon={<FaVideo />}

                  title="Live Streaming"

                  desc="Broadcast workshops and events for remote participants."

                />

                <FeatureCard

                  icon={<FaMoneyBillWave />}

                  title="Sponsor Management"

                  desc="Track sponsors, deals and funding in realtime dashboards."

                />

                <FeatureCard

                  icon={<FaRobot />}

                  title="AI Automation"

                  desc="AI powered recommendations, analytics and automation."

                />

              </div>

            </div>

            <div className="space-y-8">


              <motion.div

                whileHover={{
                  y:-6
                }}

                className="rounded-[40px] bg-black text-white p-8 relative overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.12)]"

              >

                <div className="absolute top-[-100px] right-[-100px] w-[240px] h-[240px] bg-violet-500/20 blur-[120px] rounded-full" />

                <div className="relative z-10">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="uppercase tracking-[0.25em] text-xs text-white/40 font-black mb-3">

                        LIVE STATUS

                      </p>

                      <h1 className="text-6xl font-black">

                        Active
                      </h1>

                    </div>

                    <div className="w-16 h-16 rounded-[24px] bg-white/10 flex items-center justify-center text-2xl">

                      <FaArrowUp />

                    </div>

                  </div>

                  <div className="mt-10 h-[200px] flex items-end gap-4">

                    {[45,60,75,55,80,95,70].map((h,i)=>(

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

                        className="flex-1 rounded-t-[28px] bg-gradient-to-t from-violet-500 via-purple-500 to-cyan-400"

                      />

                    ))}

                  </div>

                </div>

              </motion.div>


              <div className="rounded-[40px] bg-white border border-black/5 shadow-[0_20px_80px_rgba(0,0,0,0.05)] p-8">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="uppercase tracking-[0.25em] text-xs text-orange-500 font-black mb-3">

                      EVENT DETAILS

                    </p>

                    <h1 className="text-4xl font-black">

                      Information
                    </h1>

                  </div>

                  <div className="w-14 h-14 rounded-[20px] bg-orange-100 text-orange-600 flex items-center justify-center text-xl">

                    <FaStar />

                  </div>

                </div>

                <div className="space-y-5 mt-10">

                  <DetailRow

                    icon={<FaCalendarAlt />}

                    label="Date"

                    value={event.date || "Not Added"}

                  />

                  <DetailRow

                    icon={<FaMapMarkerAlt />}

                    label="Venue"

                    value={event.venue || "Not Added"}

                  />

                  <DetailRow

                    icon={<FaClock />}

                    label="Category"

                    value={event.type || "General"}

                  />

                  <DetailRow

                    icon={<FaUsers />}

                    label="Participants"

                    value={`${event.registrations || 0}/${event.maxParticipants || 0}`}

                  />

                </div>

              </div>

            </div>

          </div>


          <motion.div

            initial={{
              opacity:0,
              y:20
            }}

            animate={{
              opacity:1,
              y:0
            }}

            className="mt-8 rounded-[40px] bg-white border border-black/5 shadow-[0_20px_80px_rgba(0,0,0,0.05)] p-8"

          >

            <div className="flex items-center justify-between mb-10">

              <div>

                <p className="uppercase tracking-[0.25em] text-xs text-orange-500 font-black mb-3">

                  VOLUNTEER MANAGEMENT

                </p>

                <h1 className="text-5xl font-black">

                  Event Volunteers

                </h1>

                <p className="text-black/40 mt-3 text-lg">

                  Realtime volunteer coordination and performance.

                </p>

              </div>

              <div className="w-16 h-16 rounded-[24px] bg-black text-white flex items-center justify-center text-2xl">

                <FaUserTie />

              </div>

            </div>

            {

              volunteers.length === 0

                ?

                <div className="h-[260px] flex flex-col items-center justify-center text-center">

                  <div className="w-24 h-24 rounded-[30px] bg-violet-100 text-violet-600 flex items-center justify-center text-4xl mb-6">

                    <FaUserTie />

                  </div>

                  <h1 className="text-4xl font-black">

                    No Volunteers Yet

                  </h1>

                  <p className="text-black/40 mt-4 text-lg">

                    Volunteers will appear here automatically.

                  </p>

                </div>

                :

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                  {

                    volunteers.map((volunteer) => (

                      <motion.div

                        key={volunteer.id}

                        whileHover={{
                          y:-8
                        }}

                        className="rounded-[32px] bg-[#f8f4ef] border border-black/5 p-7 shadow-lg"

                      >

                        <div className="flex items-center justify-between">

                          <div className="w-16 h-16 rounded-[22px] bg-black text-white flex items-center justify-center text-xl font-black">

                            {

                              volunteer.name
                                ?.charAt(0)
                                ?.toUpperCase()

                            }

                          </div>

                          <div className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-600 text-xs font-black uppercase tracking-[0.22em]">

                            {volunteer.points || 0} pts
                          </div>

                        </div>

                        <h1 className="text-3xl font-black mt-7">

                          {volunteer.name}
                        </h1>

                        <p className="text-black/45 mt-3 text-lg">

                          {volunteer.role || "Coordinator"}
                        </p>

                        <div className="mt-8 flex items-center gap-3">

                          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">

                            <FaTrophy />
                          </div>

                          <span className="font-bold text-black/70">

                            Smart Volunteer System
                          </span>

                        </div>

                      </motion.div>

                    ))

                  }

                </div>

            }

          </motion.div>

        </div>

      </div>

</MainLayout>
  )

}

function InfoPill({

  icon,
  text

}) {

  return (

    <div className="flex items-center gap-3 px-6 py-4 rounded-[24px] bg-[#f8f4ef] border border-black/5 shadow-sm">

      <div className="text-violet-600 text-lg">

        {icon}

      </div>

      <span className="font-bold text-black/70">

        {text}

      </span>

    </div>

  )

}

function QuickCard({

  title,
  value,
  icon

}) {

  return (

    <motion.div

      whileHover={{
        y:-5
      }}

      className="rounded-[28px] bg-[#f8f4ef] border border-black/5 p-6 min-w-[150px]"

    >

      <div className="w-14 h-14 rounded-[20px] bg-black text-white flex items-center justify-center text-xl">

        {icon}

      </div>

      <span className="text-black/35 text-xs uppercase tracking-[0.22em] mt-5 block font-black">

        {title}

      </span>

      <h1 className="text-4xl font-black mt-2">

        {value}

      </h1>

    </motion.div>

  )

}

function AnalyticsCard({

  title,
  value,
  color

}) {

  return (

    <motion.div

      whileHover={{
        y:-5
      }}

      className="rounded-[30px] bg-[#f8f4ef] border border-black/5 p-7"

    >

      <span className="text-black/35 text-xs uppercase tracking-[0.22em] font-black">

        {title}

      </span>

      <h1 className={`

        text-6xl font-black mt-5

        ${color === "purple" && "text-violet-600"}
        ${color === "cyan" && "text-cyan-600"}
        ${color === "emerald" && "text-emerald-600"}
        ${color === "yellow" && "text-orange-500"}

      `}>

        {value}

      </h1>

    </motion.div>

  )

}

function FeatureCard({

  icon,
  title,
  desc

}) {

  return (

    <motion.div

      whileHover={{
        y:-8
      }}

      className="rounded-[36px] bg-white border border-black/5 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)]"

    >

      <div className="w-16 h-16 rounded-[22px] bg-black text-white flex items-center justify-center text-2xl">

        {icon}

      </div>

      <h1 className="text-3xl font-black mt-7">

        {title}

      </h1>

      <p className="text-black/45 leading-relaxed mt-5 text-lg">

        {desc}

      </p>

    </motion.div>

  )

}

function DetailRow({

  icon,
  label,
  value

}) {

  return (

    <div className="flex items-center justify-between border-b border-black/5 pb-5">

      <div className="flex items-center gap-4 text-black/45">

        <div className="w-12 h-12 rounded-[18px] bg-[#f8f4ef] border border-black/5 flex items-center justify-center text-violet-600">

          {icon}

        </div>

        <span className="font-bold">

          {label}

        </span>

      </div>

      <span className="font-black text-lg">

        {value}

      </span>

    </div>

  )

}

export default EventDetails