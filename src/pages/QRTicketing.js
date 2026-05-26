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
  getDoc
} from "firebase/firestore"

import {
  db,
  auth
} from "../firebase/firebase"

import MainLayout from "../layouts/MainLayout"

import QRCode from "react-qr-code"

import {
  FaQrcode,
  FaTicketAlt,
  FaUsers,
  FaDownload,
  FaCheckCircle,
  FaSearch,
  FaPlus,
  FaTrash,
  FaEdit,
  FaTimes,
  FaCalendarAlt,
  FaArrowRight,
  FaFire,
  FaEnvelope,
  FaCrown,
  FaEye,
  FaMagic
} from "react-icons/fa"

function QRTicketing() {

  const [events, setEvents] =
  useState([])

  const [tickets, setTickets] =
  useState([])

  const [registrations, setRegistrations] =
  useState([])

  const [search, setSearch] =
  useState("")

  const [loading, setLoading] =
  useState(true)

  const [userRole, setUserRole] =
  useState("student")

  const [creatingTicketId, setCreatingTicketId] =
  useState("")

  useEffect(() => {

    const getRole = async() => {

      const user = auth.currentUser

      if(user){

        const userRef =
        doc(db, "users", user.uid)

        const userSnap =
        await getDoc(userRef)

        if(userSnap.exists()){

          setUserRole(
            userSnap.data().role
          )

        }

      }

    }

    getRole()

  }, [])

  useEffect(() => {

    const unsubEvents =

      onSnapshot(

        collection(db, "events"),

        (snapshot) => {

          const data = []

          snapshot.forEach((doc) => {

            data.push({

              id: doc.id,
              ...doc.data()

            })

          })

          setEvents(data)

        }

      )

    /* REGISTERED USERS */

    const unsubRegistrations =

      onSnapshot(

        collection(db, "eventRegistrations"),

        (snapshot) => {

          const data = []

          snapshot.forEach((doc) => {

            data.push({

              id: doc.id,
              ...doc.data()

            })

          })

          setRegistrations(data)

        }

      )

    const unsubTickets =

      onSnapshot(

        collection(db, "tickets"),

        (snapshot) => {

          const data = []

          snapshot.forEach((doc) => {

            data.push({

              id: doc.id,
              ...doc.data()

            })

          })

          setTickets(data)

          setLoading(false)

        }

      )

    return () => {

      unsubEvents()
      unsubTickets()
      unsubRegistrations()

    }

  }, [])

  const canManage =

    userRole === "admin" ||

    userRole === "organizer"

  /* AUTO GENERATE TICKET */

  const generateTicket = async(registration) => {

    try{

      setCreatingTicketId(
        registration.id
      )

      /* CHECK EXISTING */

      const alreadyExists =

        tickets.find(

          (ticket) =>

            ticket.registrationId ===
            registration.id

        )

      if(alreadyExists){

        alert("Ticket already generated")

        return

      }

      const ticketId =
      `EVT-${Date.now()}`

      await addDoc(

        collection(db, "tickets"),

        {

          registrationId:
            registration.id,

          ticketId,

          participantName:
            registration.name,

          participantEmail:
            registration.email,

          eventId:
            registration.eventId,

          eventTitle:
            registration.eventTitle,

          eventImage:
            registration.eventImage || "",

          eventDate:
            registration.eventDate || "",

          status:"Valid",

          createdAt:
            serverTimestamp()

        }

      )

      alert("E-Ticket Generated")

    }

    catch(error){

      console.log(error)

    }

    finally{

      setCreatingTicketId("")

    }

  }

  const deleteTicket = async(id) => {

    const confirmDelete =
    window.confirm(
      "Delete this ticket?"
    )

    if(!confirmDelete) return

    try{

      await deleteDoc(
        doc(db,"tickets",id)
      )

    }

    catch(error){

      console.log(error)

    }

  }

  const filteredTickets = tickets.filter(

    (ticket)=>

      ticket.participantName
      ?.toLowerCase()
      .includes(search.toLowerCase())

  )

  return (
<MainLayout>

      <div className="flex-1 min-w-0 overflow-hidden relative">

        <div className="absolute top-[-220px] right-[-120px] w-[520px] h-[520px] bg-cyan-300/20 blur-[140px] rounded-full pointer-events-none" />

        <div className="absolute bottom-[-220px] left-[-120px] w-[520px] h-[520px] bg-violet-300/20 blur-[140px] rounded-full pointer-events-none" />

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

            className="mt-6 rounded-[45px] bg-white border border-black/5 overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.05)]"

          >

            <div className="p-10 md:p-14 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">

              <div>

                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-cyan-100 text-cyan-700 text-xs font-black uppercase tracking-[0.28em]">

                  <FaFire />

                  SMART EVENT ACCESS

                </div>

                <h1 className="text-6xl md:text-8xl leading-[0.9] tracking-[-0.08em] font-black mt-8">

                  QR
                  <br />
                  Ticketing
                </h1>

                <p className="mt-8 text-black/45 text-2xl max-w-3xl leading-relaxed">

                  Auto generate E-Tickets
                  from registered event
                  participants instantly.

                </p>

                <div className="flex flex-wrap gap-5 mt-10">

                  <TopCard
                    title="Tickets"
                    value={tickets.length}
                    icon={<FaTicketAlt />}
                  />

                  <TopCard
                    title="Registrations"
                    value={registrations.length}
                    icon={<FaUsers />}
                  />

                  <TopCard
                    title="Events"
                    value={events.length}
                    icon={<FaCalendarAlt />}
                  />

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

                className="hidden xl:flex w-44 h-44 rounded-[40px] bg-black text-white items-center justify-center shadow-[0_30px_90px_rgba(0,0,0,0.15)]"

              >

                <FaQrcode className="text-6xl" />

              </motion.div>

            </div>

          </motion.div>

          {/* SEARCH */}

          <div className="mt-8 relative max-w-[420px]">

            <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-black/30" />

            <input

              type="text"

              placeholder="Search participant..."

              value={search}

              onChange={(e)=>
                setSearch(e.target.value)
              }

              className="w-full h-[70px] pl-16 pr-6 rounded-[28px] bg-white border border-black/5 outline-none shadow-lg text-lg"

            />

          </div>

          {/* REGISTERED USERS */}

          {

            canManage &&

            <div className="mt-10">

              <div className="flex items-center gap-4 mb-8">

                <div className="w-16 h-16 rounded-[24px] bg-black text-white flex items-center justify-center text-2xl">

                  <FaMagic />

                </div>

                <div>

                  <p className="uppercase tracking-[0.25em] text-xs text-black/35 font-black">

                    AUTOMATIC E-TICKET GENERATION
                  </p>

                  <h1 className="text-5xl font-black mt-2">

                    Registered Participants
                  </h1>

                </div>

              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {

                  registrations.map((registration)=>(

                    <div

                      key={registration.id}

                      className="rounded-[35px] bg-white border border-black/5 p-7 shadow-[0_20px_60px_rgba(0,0,0,0.05)]"

                    >

                      <div className="flex items-center justify-between gap-5">

                        <div>

                          <h1 className="text-3xl font-black">

                            {registration.name}
                          </h1>

                          <p className="text-black/40 mt-2">

                            {registration.email}
                          </p>

                          <div className="mt-5 inline-flex px-5 py-3 rounded-full bg-cyan-100 text-cyan-700 text-xs uppercase tracking-[0.22em] font-black">

                            {registration.eventTitle}
                          </div>

                        </div>

                        <motion.button

                          whileHover={{
                            scale:1.03
                          }}

                          whileTap={{
                            scale:0.97
                          }}

                          onClick={() =>
                            generateTicket(
                              registration
                            )
                          }

                          disabled={
                            creatingTicketId ===
                            registration.id
                          }

                          className="h-[64px] px-8 rounded-[24px] bg-black text-white font-black flex items-center gap-4 shadow-xl"

                        >

                          <FaQrcode />

                          {

                            creatingTicketId ===
                            registration.id

                            ?

                            "Generating..."

                            :

                            "Generate"

                          }

                        </motion.button>

                      </div>

                    </div>

                  ))

                }

              </div>

            </div>

          }

          {/* TICKETS */}

          <div className="mt-12">

            <div className="flex items-center gap-4 mb-8">

              <div className="w-16 h-16 rounded-[24px] bg-black text-white flex items-center justify-center text-2xl">

                <FaTicketAlt />

              </div>

              <div>

                <p className="uppercase tracking-[0.25em] text-xs text-black/35 font-black">

                  GENERATED E-TICKETS
                </p>

                <h1 className="text-5xl font-black mt-2">

                  Smart Passes
                </h1>

              </div>

            </div>

            {

              loading

              ?

              <div className="h-[300px] flex items-center justify-center text-5xl font-black">

                Loading...

              </div>

              :

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-7">

                {

                  filteredTickets.map((ticket,index)=>(

                    <motion.div

                      key={ticket.id}

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

                      className="rounded-[40px] overflow-hidden bg-white border border-black/5 shadow-[0_20px_80px_rgba(0,0,0,0.05)]"

                    >

                      <div className="p-7">

                        <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">

                          <div className="flex-1">

                            <div className="inline-flex px-5 py-3 rounded-full bg-emerald-100 text-emerald-700 text-xs uppercase tracking-[0.22em] font-black">

                              <FaCheckCircle className="mr-2" />

                              {ticket.status}
                            </div>

                            <h1 className="text-4xl font-black mt-6">

                              {ticket.participantName}
                            </h1>

                            <p className="text-black/40 mt-3">

                              {ticket.eventTitle}
                            </p>

                            <div className="mt-7 px-5 py-4 rounded-[22px] bg-[#f8f4ef] border border-black/5">

                              <p className="uppercase tracking-[0.22em] text-[10px] text-black/35 font-black">

                                TICKET ID
                              </p>

                              <h1 className="text-2xl font-black mt-2">

                                {ticket.ticketId}
                              </h1>

                            </div>

                            <div className={`

                              grid gap-3 mt-7

                              ${

                                canManage

                                ?

                                "grid-cols-2"

                                :

                                "grid-cols-1"

                              }

                            `}>

                              <button

                                className="h-[58px] rounded-[22px] bg-black text-white font-black flex items-center justify-center gap-3"

                              >

                                <FaDownload />

                                Download
                              </button>

                              {

                                canManage &&

                                <button

                                  onClick={() =>
                                    deleteTicket(ticket.id)
                                  }

                                  className="h-[58px] rounded-[22px] bg-rose-100 text-rose-700 font-black flex items-center justify-center gap-3"

                                >

                                  <FaTrash />

                                  Delete
                                </button>

                              }

                            </div>

                          </div>

                          <div className="bg-white p-5 rounded-[30px] border border-black/5 shadow-xl">

                            <QRCode

                              value={JSON.stringify({

                                ticketId:
                                  ticket.ticketId,

                                participant:
                                  ticket.participantName,

                                event:
                                  ticket.eventTitle

                              })}

                              size={180}

                            />

                          </div>

                        </div>

                      </div>

                    </motion.div>

                  ))

                }

              </div>

            }

          </div>

        </div>

      </div>

</MainLayout>
  )

}

function TopCard({

  title,
  value,
  icon

}) {

  return (

    <motion.div

      whileHover={{
        y:-4
      }}

      className="px-7 py-6 rounded-[28px] bg-[#f8f4ef] border border-black/5"

    >

      <div className="flex items-center gap-5">

        <div className="w-14 h-14 rounded-[20px] bg-black text-white flex items-center justify-center text-xl">

          {icon}

        </div>

        <div>

          <p className="uppercase tracking-[0.22em] text-xs font-black text-black/35">

            {title}

          </p>

          <h1 className="text-3xl font-black mt-2">

            {value}

          </h1>

        </div>

      </div>

    </motion.div>

  )

}

export default QRTicketing