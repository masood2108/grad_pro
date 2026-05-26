/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import MainLayout from "../layouts/MainLayout"
import { useNavigate } from "react-router-dom"
import { QRCodeCanvas } from "qrcode.react"
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  addDoc,
  query,
  where,
  getDocs
} from "firebase/firestore"

import {
  db,
  auth
} from "../firebase/firebase"

import {

  FaSearch,
  FaEdit,
  FaTrash,
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaCircle,
  FaFire,
  FaRocket,
  FaTicketAlt,
  FaCheckCircle,
  FaTimes,
  FaUserTie,
  FaCalendarAlt,
  FaBolt,
  FaStar

} from "react-icons/fa"

function Events() {

  const [events, setEvents] =
  useState([])
const navigate = useNavigate()
  const [loading, setLoading] =
  useState(true)

  const [search, setSearch] =
  useState("")

  const [userRole, setUserRole] =
  useState("student")

  const [userData, setUserData] =
  useState(null)

  const [registeredEvents, setRegisteredEvents] =
  useState([])

  const [registering, setRegistering] =
  useState("")

  const [eventParticipants, setEventParticipants] =
  useState({})

  const [volunteers, setVolunteers] =
  useState([])

  /* EDIT */

  const [showEditModal, setShowEditModal] =
  useState(false)

  const [editingEvent, setEditingEvent] =
  useState(null)

  const [title, setTitle] =
  useState("")

  const [description, setDescription] =
  useState("")

  const [venue, setVenue] =
  useState("")

  const [date, setDate] =
  useState("")

  const [image, setImage] =
  useState("")

  const [status, setStatus] =
  useState("Upcoming")

  const [maxParticipants, setMaxParticipants] =
  useState("")

  const [assignedVolunteers, setAssignedVolunteers] =
  useState([])

  /* USER */

  useEffect(() => {

    const unsubscribe =

    auth.onAuthStateChanged(

      async(user)=>{

        if(user){

          const userQuery =

          await getDocs(

            query(

              collection(db,"users"),

              where(
                "email",
                "==",
                user.email
              )

            )

          )

          userQuery.forEach((doc)=>{

            setUserData(doc.data())

            setUserRole(
              doc.data().role
            )

          })

          const regQuery =

          await getDocs(

            query(

              collection(
                db,
                "eventRegistrations"
              ),

              where(
                "email",
                "==",
                user.email
              )

            )

          )

          const registered = []

          regQuery.forEach((doc)=>{

            registered.push(
              doc.data().eventId
            )

          })

          setRegisteredEvents(
            registered
          )

        }

      }

    )

    return ()=>unsubscribe()

  }, [])

  /* EVENTS */

  useEffect(() => {

    const unsub = onSnapshot(

      collection(db,"events"),

      (snapshot)=>{

        const data = []

        snapshot.forEach((doc)=>{

          data.push({

            id:doc.id,
            ...doc.data()

          })

        })

        setEvents(data)

        setLoading(false)

      }

    )

    return ()=>unsub()

  }, [])

  /* VOLUNTEERS */

  useEffect(() => {

    const unsub = onSnapshot(

      collection(db,"volunteers"),

      (snapshot)=>{

        const data = []

        snapshot.forEach((doc)=>{

          data.push({

            id:doc.id,
            ...doc.data()

          })

        })

        setVolunteers(data)

      }

    )

    return ()=>unsub()

  }, [])

  /* PARTICIPANTS */

  useEffect(() => {

    if(

      userRole !== "admin" &&
      userRole !== "organizer"

    ){

      return

    }

    const unsub = onSnapshot(

      collection(
        db,
        "eventRegistrations"
      ),

      (snapshot)=>{

        const groupedData = {}

        snapshot.forEach((doc)=>{

          const data = doc.data()

          if(

            !groupedData[data.eventId]

          ){

            groupedData[data.eventId] = []

          }

          groupedData[data.eventId].push({

            id:doc.id,
            ...data

          })

        })

        setEventParticipants(
          groupedData
        )

      }

    )

    return ()=>unsub()

  }, [userRole])

  /* EDIT EVENT */

  const editEvent = (event) => {

    setEditingEvent(event)

    setTitle(event.title || "")

    setDescription(
      event.description || ""
    )

    setVenue(event.venue || "")

    setDate(event.date || "")

    setImage(event.image || "")

    setStatus(
      event.status || "Upcoming"
    )

    setMaxParticipants(
      event.maxParticipants || ""
    )

    setAssignedVolunteers(
      event.assignedVolunteers || []
    )

    setShowEditModal(true)

  }

  /* UPDATE */

  const updateEvent = async () => {

    try {

      await updateDoc(

        doc(
          db,
          "events",
          editingEvent.id
        ),

        {

          title,
          description,
          venue,
          date,
          image,
          status,

          maxParticipants:
          Number(maxParticipants),

          assignedVolunteers

        }

      )

      setShowEditModal(false)

      showNotification(
        "✅ Event Updated Successfully"
      )

    }

    catch(error){

      console.log(error)

    }

  }

  /* DELETE */

  const deleteEvent = async(id)=>{

    const confirmDelete =
    window.confirm(
      "Delete this event?"
    )

    if(!confirmDelete) return

    try{

      await deleteDoc(

        doc(
          db,
          "events",
          id
        )

      )

      showNotification(
        "🗑 Event Deleted"
      )

    }

    catch(error){

      console.log(error)

    }

  }

  /* REGISTER */

  const registerEvent = async(event)=>{

    try{

      setRegistering(event.id)

      await addDoc(

        collection(
          db,
          "eventRegistrations"
        ),

        {

  eventId:event.id,

  eventTitle:
  event.title || "",

  name:
  userData?.name || "",

  email:
  userData?.email || "",

  attendance:false,

  qrId:
  `${event.id}_${userData?.email}`

}

      )

      await updateDoc(

        doc(
          db,
          "events",
          event.id
        ),

        {

          registrations:

          Number(
            event.registrations || 0
          ) + 1

        }

      )

      setRegisteredEvents([

        ...registeredEvents,
        event.id

      ])

      showNotification(
        "🎟 Registered Successfully"
      )

    }

    catch(error){

      console.log(error)

    }

    finally{

      setRegistering("")

    }

  }

  /* CANCEL */

  const cancelRegistration = async(event)=>{

    try{

      setRegistering(event.id)

      const regQuery = await getDocs(

        query(

          collection(
            db,
            "eventRegistrations"
          ),

          where(
            "eventId",
            "==",
            event.id
          ),

          where(
            "email",
            "==",
            userData?.email
          )

        )

      )

      regQuery.forEach(async(regDoc)=>{

        await deleteDoc(

          doc(
            db,
            "eventRegistrations",
            regDoc.id
          )

        )

      })

      await updateDoc(

        doc(
          db,
          "events",
          event.id
        ),

        {

          registrations:

          Math.max(

            Number(
              event.registrations || 1
            ) - 1,

            0

          )

        }

      )

      setRegisteredEvents(

        registeredEvents.filter(

          (id)=>id !== event.id

        )

      )

      showNotification(
        "❌ Registration Cancelled"
      )

    }

    catch(error){

      console.log(error)

    }

    finally{

      setRegistering("")

    }

  }

  /* REMOVE STUDENT */

  const adminRemoveRegistration = async(

    eventId,
    studentEmail

  ) => {

    try{

      const regQuery = await getDocs(

        query(

          collection(
            db,
            "eventRegistrations"
          ),

          where(
            "eventId",
            "==",
            eventId
          ),

          where(
            "email",
            "==",
            studentEmail
          )

        )

      )

      regQuery.forEach(async(regDoc)=>{

        await deleteDoc(

          doc(
            db,
            "eventRegistrations",
            regDoc.id
          )

        )

      })

      const selectedEvent =
      events.find(
        (e)=>e.id === eventId
      )

      await updateDoc(

        doc(
          db,
          "events",
          eventId
        ),

        {

          registrations:

          Math.max(

            Number(
              selectedEvent
              ?.registrations || 1
            ) - 1,

            0

          )

        }

      )

      showNotification(
        "❌ Student Removed"
      )

    }

    catch(error){

      console.log(error)

    }

  }

  /* NOTIFICATION */

  const showNotification = (
    message
  ) => {

    const notification =
    document.createElement("div")

    notification.innerHTML =
    message

    notification.className = `

      fixed top-6 right-6 z-[99999]
      bg-black text-white
      px-8 py-5 rounded-[24px]
      font-black shadow-[0_20px_80px_rgba(0,0,0,0.15)]

    `

    document.body.appendChild(
      notification
    )

    setTimeout(()=>{

      notification.remove()

    },2500)

  }

  /* FILTER */

  const filteredEvents =
  events.filter((event)=>{

    return event.title
    ?.toLowerCase()
    .includes(
      search.toLowerCase()
    )

  })

  return (
<MainLayout>

      <div className="flex-1 min-w-0 overflow-hidden relative">

        {/* BG */}

        <div className="absolute top-[-200px] right-[-100px] w-[500px] h-[500px] bg-violet-300/20 blur-[140px] rounded-full pointer-events-none" />

        <div className="absolute bottom-[-200px] left-[-100px] w-[500px] h-[500px] bg-orange-300/20 blur-[140px] rounded-full pointer-events-none" />

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

            className="mt-6 rounded-[45px] bg-white/75 backdrop-blur-3xl border border-white shadow-[0_20px_80px_rgba(0,0,0,0.05)] overflow-hidden relative"

          >

            <div className="absolute top-[-120px] right-[-100px] w-[320px] h-[320px] bg-violet-300/20 blur-[120px] rounded-full" />

            <div className="absolute bottom-[-120px] left-[-100px] w-[320px] h-[320px] bg-orange-300/20 blur-[120px] rounded-full" />

            <div className="relative z-10 p-10 md:p-14 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">

              <div>

                <p className="uppercase tracking-[0.3em] text-orange-500 text-xs font-black mb-5">

                  DIGITAL EVENT MANAGEMENT

                </p>

                <h1 className="text-6xl md:text-8xl leading-[0.9] tracking-[-0.08em] font-black">

                  Events
                  <br />

                  Portal

                </h1>

                <p className="mt-8 text-2xl text-black/45 leading-relaxed max-w-3xl">

                  Manage events, volunteers,
                  registrations and realtime
                  participation workflows.

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

                <FaRocket className="text-6xl" />

              </motion.div>

            </div>

          </motion.div>

          {/* SEARCH */}

          <div className="mt-8 relative">

            <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-black/35 text-lg" />

            <input

              value={search}

              onChange={(e)=>
                setSearch(
                  e.target.value
                )
              }

              placeholder="Search events..."

              className="w-full h-[72px] pl-16 pr-6 rounded-[28px] bg-white border border-black/5 outline-none text-lg font-semibold shadow-[0_15px_40px_rgba(0,0,0,0.04)]"

            />

          </div>

          {/* EVENTS */}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-10">

            {

              loading

              ?

              <div className="h-[400px] flex items-center justify-center">

                <h1 className="text-5xl font-black">

                  Loading Events...

                </h1>

              </div>

              :

              filteredEvents.map((event,index)=>(

                <motion.div

  key={event.id}

  onClick={()=>
    navigate(`/event/${event.id}`)
  }

  initial={{
    opacity:0,
    y:30
  }}

  animate={{
    opacity:1,
    y:0
  }}

  transition={{
    delay:index * 0.05
  }}

  whileHover={{
    y:-10
  }}

  className="rounded-[40px] overflow-hidden bg-white border border-black/5 shadow-[0_25px_80px_rgba(0,0,0,0.05)] cursor-pointer"

>

                  {/* IMAGE */}

                  <div className="relative h-[300px] overflow-hidden">

                    <img

                      src={event.image}

                      alt=""

                      className="w-full h-full object-cover"

                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                    {/* STATUS */}

                    <div className="absolute top-6 left-6">

                      <div className={`

                        px-5 py-3 rounded-full
                        text-xs uppercase tracking-[0.22em]
                        font-black backdrop-blur-xl

                        ${

                          event.status === "Live"

                          ?

                          "bg-emerald-500 text-white"

                          :

                          event.status === "Completed"

                          ?

                          "bg-rose-500 text-white"

                          :

                          "bg-yellow-400 text-black"

                        }

                      `}>

                        {event.status}
                      </div>

                    </div>

                    {/* ACTIONS */}

                    {

                      (

                        userRole === "admin" ||

                        userRole === "organizer"

                      ) &&

                      <div className="absolute top-6 right-6 flex gap-3">

                        <button

  onClick={(e) => {

    e.stopPropagation()

    editEvent(event)

  }}

                          className="w-14 h-14 rounded-[20px] bg-white/20 text-white flex items-center justify-center backdrop-blur-xl"

                        >

                          <FaEdit />

                        </button>

                        <button

  onClick={(e)=>{

    e.stopPropagation()

    deleteEvent(
      event.id
    )

  }}

                          className="w-14 h-14 rounded-[20px] bg-white/20 text-white flex items-center justify-center backdrop-blur-xl"

                        >

                          <FaTrash />

                        </button>

                      </div>

                    }

                    <div className="absolute bottom-8 left-8">

                      <h1 className="text-5xl leading-[0.9] tracking-[-0.08em] font-black text-white">

                        {event.title}

                      </h1>

                    </div>

                  </div>

                  {/* CONTENT */}

                  <div className="p-8">

                    <p className="text-black/45 text-lg leading-relaxed">

                      {event.description}
                    </p>

                    <div className="space-y-5 mt-8">

                      <InfoRow
                        icon={<FaMapMarkerAlt />}
                        text={event.venue}
                      />

                      <InfoRow
                        icon={<FaCalendarAlt />}
                        text={event.date}
                      />

                      <InfoRow
                        icon={<FaUsers />}
                        text={`${event.registrations || 0} Registered`}
                      />

                    </div>

                    {/* VOLUNTEERS */}

                    {

                      event.assignedVolunteers
                      ?.length > 0 &&

                      <div className="mt-10">

                        <h1 className="text-2xl font-black mb-5">

                          Assigned Volunteers

                        </h1>

                        <div className="flex flex-wrap gap-4">

                          {

                            event.assignedVolunteers.map((volunteer,index)=>(

                              <div

                                key={index}

                                className="px-6 py-4 rounded-[22px] bg-[#f8f4ef] border border-black/5 font-bold flex items-center gap-3 shadow-sm"

                              >

                                <FaUserTie className="text-violet-600" />

                                {volunteer}

                              </div>

                            ))

                          }

                        </div>

                      </div>

                    }

                    {/* PARTICIPANTS */}

                    {

                      (

                        userRole === "admin" ||

                        userRole === "organizer"

                      ) &&

                      <div className="mt-10">

                        <h1 className="text-2xl font-black mb-5">

                          Registered Students

                        </h1>

                        <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2">

                          {

                            eventParticipants[event.id]
                            ?.length > 0

                            ?

                            eventParticipants[event.id]
                            .map((student)=>(

                              <div

                                key={student.id}

                                className="rounded-[26px] bg-[#f8f4ef] border border-black/5 px-6 py-5 flex items-center justify-between gap-5"

                              >

                                <div className="flex items-center gap-5">

                                  <div className="w-14 h-14 rounded-[18px] bg-black text-white flex items-center justify-center font-black">

                                    {

                                      student.name
                                      ?.charAt(0)
                                      ?.toUpperCase()

                                    }

                                  </div>

                                  <div>

                                    <h1 className="font-black text-lg">

                                      {student.name}

                                    </h1>

                                    <p className="text-black/40 mt-1">

                                      {student.email}

                                    </p>

                                  </div>

                                </div>

                                <button

                                  onClick={()=>

                                    adminRemoveRegistration(

                                      event.id,
                                      student.email

                                    )

                                  }

                                  className="px-6 h-[54px] rounded-[18px] bg-rose-100 text-rose-700 font-black flex items-center gap-3"

                                >

                                  <FaTrash />

                                  Remove

                                </button>

                              </div>

                            ))

                            :

                            <div className="rounded-[26px] bg-[#f8f4ef] border border-black/5 p-8 text-black/40 font-semibold">

                              No registrations yet.

                            </div>

                          }

                        </div>

                      </div>

                    }

                    {/* BUTTON */}

          {
  userRole === "student" &&

  <div className="mt-10">

    {

      registeredEvents.includes(
        event.id
      )

      ?

      <div>

        <button

          onClick={(e)=>{

            e.stopPropagation()

            cancelRegistration(event)

          }}

          className="w-full h-[68px] rounded-[24px] bg-rose-100 text-rose-700 font-black text-lg"

        >

          Cancel Registration

        </button>

        <div className="mt-6 flex justify-center">

          <div className="bg-white p-4 rounded-[24px] border border-black/5 shadow-sm">

            <QRCodeCanvas

              value={
                `${event.id}_${userData?.email}`
              }

              size={170}

            />

          </div>

        </div>

      </div>

      :

      <button

        onClick={(e)=>{

          e.stopPropagation()

          registerEvent(event)

        }}

        className="w-full h-[68px] rounded-[24px] bg-black text-white font-black text-lg"

      >

        Register Now

      </button>

    }

  </div>
}

                  </div>

                </motion.div>

              ))

            }

          </div>

        </div>

      </div>

      {/* PREMIUM EDIT MODAL */}

      <AnimatePresence>

        {

          showEditModal &&

          <motion.div

            initial={{
              opacity:0
            }}

            animate={{
              opacity:1
            }}

            exit={{
              opacity:0
            }}

            className="fixed inset-0 bg-black/70 backdrop-blur-2xl z-[99999] flex items-center justify-center p-5 overflow-y-auto"

          >

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

className="w-full max-w-[980px] max-h-[92vh] overflow-y-auto rounded-[42px] bg-white border border-black/5 shadow-[0_40px_120px_rgba(0,0,0,0.18)] relative"
            >

              <div className="absolute top-[-120px] right-[-120px] w-[320px] h-[320px] bg-violet-300/20 blur-[120px] rounded-full" />

              <div className="absolute bottom-[-120px] left-[-120px] w-[320px] h-[320px] bg-orange-300/20 blur-[120px] rounded-full" />

              <div className="relative z-10">

                {/* TOP */}

                <div className="px-10 md:px-14 pt-12 pb-8 border-b border-black/5 flex items-start justify-between gap-6">

                  <div>

                    <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-orange-100 text-orange-600 text-[11px] uppercase tracking-[0.28em] font-black">

                      <FaRocket />

                      EVENT MANAGEMENT

                    </div>

                    <h1 className="text-6xl leading-[0.9] tracking-[-0.08em] font-black mt-7">

                      Edit Event

                    </h1>

                    <p className="text-black/40 text-xl mt-5 max-w-2xl leading-relaxed">

                      Update event details,
                      volunteer assignments
                      and registrations.

                    </p>

                  </div>

                  <button

                    onClick={() =>
                      setShowEditModal(false)
                    }

                    className="w-16 h-16 rounded-[24px] bg-black text-white flex items-center justify-center text-xl"

                  >

                    <FaTimes />

                  </button>

                </div>

                {/* BODY */}

                <div className="p-8 md:p-10">

                  {/* PREVIEW */}

                  <div className="rounded-[40px] overflow-hidden border border-black/5 shadow-[0_20px_80px_rgba(0,0,0,0.06)]">

                    <div className="relative h-[220px]">

                      <img

                        src={image}

                        alt=""

                        className="w-full h-full object-cover"

                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                      <div className="absolute bottom-8 left-8">

                        <h1 className="text-5xl font-black text-white leading-[0.9] tracking-[-0.08em]">

                          {title || "Event Name"}

                        </h1>

                        <p className="text-white/60 text-xl mt-4">

                          {venue || "Venue"}

                        </p>

                      </div>

                    </div>

                  </div>

                  {/* FORM */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">

                    <PremiumInput
                      label="Title"
                      value={title}
                      setValue={setTitle}
                    />

                    <PremiumInput
                      label="Venue"
                      value={venue}
                      setValue={setVenue}
                    />

                    <PremiumInput
                      label="Date"
                      value={date}
                      setValue={setDate}
                    />

                    <PremiumInput
                      label="Image URL"
                      value={image}
                      setValue={setImage}
                    />

                    <PremiumInput
                      label="Max Participants"
                      value={maxParticipants}
                      setValue={setMaxParticipants}
                      type="number"
                    />

                  </div>

                  {/* DESCRIPTION */}

                  <div className="mt-8">

                    <p className="uppercase tracking-[0.25em] text-xs font-black text-black/35 mb-5">

                      Description

                    </p>

                    <textarea

                      value={description}

                      onChange={(e)=>
                        setDescription(
                          e.target.value
                        )
                      }

                      className="w-full h-[220px] rounded-[30px] bg-[#f8f4ef] border border-black/5 p-8 outline-none resize-none text-lg"

                    />

                  </div>

                  {/* STATUS */}

                  <div className="mt-8">

                    <p className="uppercase tracking-[0.25em] text-xs font-black text-black/35 mb-5">

                      Event Status

                    </p>

                    <select

                      value={status}

                      onChange={(e)=>
                        setStatus(e.target.value)
                      }

                      className="w-full h-[78px] rounded-[28px] bg-[#f8f4ef] border border-black/5 px-7 outline-none text-lg font-semibold"

                    >

                      <option>
                        Upcoming
                      </option>

                      <option>
                        Live
                      </option>

                      <option>
                        Completed
                      </option>

                    </select>

                  </div>

                  {/* VOLUNTEERS */}

                  <div className="mt-12">

                    <div className="flex items-center justify-between mb-8">

                      <div>

                        <p className="uppercase tracking-[0.25em] text-xs font-black text-orange-500 mb-3">

                          VOLUNTEER MANAGEMENT

                        </p>

                        <h1 className="text-4xl font-black">

                          Assign Volunteers

                        </h1>

                      </div>

                      <div className="w-16 h-16 rounded-[24px] bg-black text-white flex items-center justify-center text-2xl">

                        <FaUserTie />

                      </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                      {

                        volunteers.map((volunteer)=>(

                          <motion.button

                            whileHover={{
                              y:-5
                            }}

                            key={volunteer.id}

                            onClick={() => {

                              if(

                                assignedVolunteers.includes(
                                  volunteer.name
                                )

                              ){

                                setAssignedVolunteers(

                                  assignedVolunteers.filter(

                                    (v)=>
                                    v !== volunteer.name

                                  )

                                )

                              }

                              else{

                                setAssignedVolunteers([

                                  ...assignedVolunteers,
                                  volunteer.name

                                ])

                              }

                            }}

                            className={`

                              rounded-[24px]
                              p-5 border text-left

                              ${

                                assignedVolunteers.includes(
                                  volunteer.name
                                )

                                ?

                                "bg-black text-white border-black"

                                :

                                "bg-[#f8f4ef] border-black/5"

                              }

                            `}

                          >

                            <div className="flex items-center justify-between">

                              <div className={`

                                w-16 h-16 rounded-[22px]
                                flex items-center justify-center
                                text-xl font-black

                                ${

                                  assignedVolunteers.includes(
                                    volunteer.name
                                  )

                                  ?

                                  "bg-white text-black"

                                  :

                                  "bg-black text-white"

                                }

                              `}>

                                {

                                  volunteer.name
                                  ?.charAt(0)
                                  ?.toUpperCase()

                                }

                              </div>

                              {

                                assignedVolunteers.includes(
                                  volunteer.name
                                ) &&

                                <div className="w-12 h-12 rounded-[18px] bg-emerald-500 text-white flex items-center justify-center">

                                  <FaCheckCircle />

                                </div>

                              }

                            </div>

                            <h1 className="text-2xl font-black mt-5">

                              {volunteer.name}

                            </h1>

                            <p className={`

                              mt-3 text-lg

                              ${

                                assignedVolunteers.includes(
                                  volunteer.name
                                )

                                ?

                                "text-white/60"

                                :

                                "text-black/45"

                              }

                            `}>

                              {volunteer.role || "Coordinator"}

                            </p>

                          </motion.button>

                        ))

                      }

                    </div>

                  </div>

                  {/* REGISTERED STUDENTS */}

                  <div className="mt-14">

                    <div className="flex items-center justify-between mb-8">

                      <div>

                        <p className="uppercase tracking-[0.25em] text-xs font-black text-violet-500 mb-3">

                          EVENT REGISTRATIONS

                        </p>

                        <h1 className="text-4xl font-black">

                          Registered Students

                        </h1>

                      </div>

                      <div className="w-16 h-16 rounded-[24px] bg-black text-white flex items-center justify-center text-2xl">

                        <FaUsers />

                      </div>

                    </div>

                    {

                      eventParticipants[
                        editingEvent?.id
                      ]?.length > 0

                      ?

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {

                          eventParticipants[
                            editingEvent?.id
                          ]?.map((student)=>(

                            <div

                              key={student.id}

                              className="rounded-[24px] bg-[#f8f4ef] border border-black/5 p-5 flex items-center justify-between gap-5"

                            >

                              <div className="flex items-center gap-5">

                                <div className="w-12 h-12 rounded-[22px] bg-black text-white flex items-center justify-center text-xl font-black">

                                  {

                                    student.name
                                    ?.charAt(0)
                                    ?.toUpperCase()

                                  }

                                </div>

                                <div>

                                  <h1 className="text-2xl font-black">

                                    {student.name}

                                  </h1>

                                  <p className="text-black/40 mt-2">

                                    {student.email}

                                  </p>

                                </div>

                              </div>

                              <button

                                onClick={()=>

                                  adminRemoveRegistration(

                                    editingEvent.id,
                                    student.email

                                  )

                                }

                                className="px-6 h-[56px] rounded-[20px] bg-rose-100 text-rose-700 font-black flex items-center gap-3"

                              >

                                <FaTrash />

                                Remove

                              </button>

                            </div>

                          ))

                        }

                      </div>

                      :

                      <div className="h-[240px] rounded-[36px] bg-[#f8f4ef] border border-black/5 flex flex-col items-center justify-center">

                        <div className="w-24 h-24 rounded-[28px] bg-violet-100 text-violet-600 flex items-center justify-center text-4xl mb-6">

                          <FaUsers />

                        </div>

                        <h1 className="text-4xl font-black">

                          No Registrations Yet

                        </h1>

                      </div>

                    }

                  </div>

                  {/* SAVE */}

                  <button

                    onClick={updateEvent}

                    className="w-full h-[64px] rounded-[30px] bg-black text-white font-black text-2xl mt-14 shadow-[0_30px_80px_rgba(0,0,0,0.18)]"

                  >

                    Save Event Changes

                  </button>

                </div>

              </div>

            </motion.div>

          </motion.div>

        }

      </AnimatePresence>

</MainLayout>
  )

}

function InfoRow({
  icon,
  text
}) {

  return (

    <div className="flex items-center gap-4 text-black/55 font-semibold text-lg">

      <div className="w-14 h-14 rounded-[20px] bg-[#f8f4ef] border border-black/5 flex items-center justify-center text-violet-600">

        {icon}

      </div>

      {text}

    </div>

  )

}

function PremiumInput({

  label,
  value,
  setValue,
  type="text"

}) {

  return (

    <div>

      <p className="uppercase tracking-[0.25em] text-xs font-black text-black/35 mb-5">

        {label}

      </p>

      <input

        type={type}

        value={value}

        onChange={(e)=>
          setValue(e.target.value)
        }

        className="w-full h-[78px] rounded-[28px] bg-[#f8f4ef] border border-black/5 px-8 outline-none text-lg font-semibold"

      />

    </div>

  )

}

export default Events