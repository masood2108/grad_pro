/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import MainLayout from "../layouts/MainLayout"

import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from "firebase/firestore"

import { db } from "../firebase/firebase"

import {
  FaUsers,
  FaPlus,
  FaTimes,
  FaUserTie,
  FaSearch,
  FaEdit,
  FaTrash,
  FaMedal,
  FaCircle,
  FaEnvelope,
  FaBolt,
  FaTrophy,
  FaCrown,
  FaCalendarAlt,
  FaCheckCircle,
  FaRocket,
  FaStar
} from "react-icons/fa"

function Volunteers() {

  const [volunteers, setVolunteers] =
  useState([])

  const [events, setEvents] =
  useState([])

  const [loading, setLoading] =
  useState(true)

  const [search, setSearch] =
  useState("")

  const [showModal, setShowModal] =
  useState(false)

  const [editingVolunteer, setEditingVolunteer] =
  useState(null)

  const [creating, setCreating] =
  useState(false)

  const [name, setName] =
  useState("")

  const [email, setEmail] =
  useState("")

  const [role, setRole] =
  useState("Coordinator")

  const [points, setPoints] =
  useState("")

  const [assignedEvent, setAssignedEvent] =
  useState("")

  const [status, setStatus] =
  useState("Active")

  useEffect(() => {

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

        data.sort(

          (a,b)=>

            (b.points || 0) -
            (a.points || 0)

        )

        setVolunteers(data)

        setLoading(false)

      }

    )

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

    return () => {

      unsubVolunteers()
      unsubEvents()

    }

  }, [])

  const resetForm = () => {

    setName("")
    setEmail("")
    setRole("Coordinator")
    setPoints("")
    setAssignedEvent("")
    setStatus("Active")
    setEditingVolunteer(null)

  }

  const createVolunteer = async () => {

    if(
      !name ||
      !email ||
      !assignedEvent
    ){

      return alert(
        "Fill all fields"
      )

    }

    try{

      setCreating(true)

      await addDoc(

        collection(db,"volunteers"),

        {

          name,
          email,
          role,

          points:
          Number(points || 0),

          assignedEvent,

          status,

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

    finally{

      setCreating(false)

    }

  }

  const updateVolunteer = async () => {

    try{

      setCreating(true)

      await updateDoc(

        doc(
          db,
          "volunteers",
          editingVolunteer.id
        ),

        {

          name,
          email,
          role,

          points:
          Number(points || 0),

          assignedEvent,

          status

        }

      )

      resetForm()

      setShowModal(false)

    }

    catch(error){

      console.log(error)

    }

    finally{

      setCreating(false)

    }

  }

  const editVolunteer = (volunteer) => {

    setEditingVolunteer(volunteer)

    setName(volunteer.name || "")

    setEmail(volunteer.email || "")

    setRole(
      volunteer.role ||
      "Coordinator"
    )

    setPoints(
      volunteer.points || ""
    )

    setAssignedEvent(
      volunteer.assignedEvent || ""
    )

    setStatus(
      volunteer.status || "Active"
    )

    setShowModal(true)

  }

  const deleteVolunteer = async(id)=>{

    const confirmDelete =
    window.confirm(
      "Delete volunteer?"
    )

    if(!confirmDelete) return

    try{

      await deleteDoc(

        doc(
          db,
          "volunteers",
          id
        )

      )

    }

    catch(error){

      console.log(error)

    }

  }

  const filteredVolunteers =
  volunteers.filter((volunteer)=>

    volunteer.name
    ?.toLowerCase()
    .includes(
      search.toLowerCase()
    )

  )

  const totalPoints =
  volunteers.reduce(

    (acc,item)=>

      acc + Number(
        item.points || 0
      ),

    0

  )

  const activeVolunteers =
  volunteers.filter(

    (v)=>
      v.status === "Active"

  ).length

  return (

    <MainLayout>
      <div className="flex-1 min-w-0 relative overflow-hidden">


        <div className="absolute top-[-200px] right-[-100px] w-[450px] h-[450px] bg-violet-300/20 blur-[120px] rounded-full" />

        <div className="absolute bottom-[-200px] left-[-100px] w-[450px] h-[450px] bg-emerald-300/20 blur-[120px] rounded-full" />

        <div className="h-full overflow-y-auto p-6 relative z-10">



          <motion.div

            initial={{
              opacity:0,
              y:30
            }}

            animate={{
              opacity:1,
              y:0
            }}

            transition={{
              duration:0.6
            }}

            className="relative overflow-hidden rounded-[45px] bg-black text-white p-10 md:p-14 mt-6"

          >

            <div className="absolute top-[-20%] right-[-10%] w-[320px] h-[320px] bg-violet-500/20 blur-[100px] rounded-full" />

            <div className="absolute bottom-[-20%] left-[-10%] w-[320px] h-[320px] bg-emerald-500/20 blur-[100px] rounded-full" />

            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">

              <div>

                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-black tracking-[0.25em] uppercase">

                  <FaBolt />

Volunteer Management
                </div>

                <h1 className="text-6xl md:text-8xl leading-[0.9] tracking-[-0.08em] font-black mt-8">

                  Volunteer
                  <br />
 Management System
                </h1>

                <p className="text-white/55 text-2xl mt-8 max-w-3xl leading-relaxed">

                 Manage volunteer recruitment,
event assignments,
performance tracking
and volunteer operations.

                </p>


                <div className="flex flex-wrap gap-5 mt-10">

                  <HeroMiniCard

                    title="Volunteers"
                    value={volunteers.length}
                    icon={<FaUsers />}

                  />

                  <HeroMiniCard

                    title="Active"
                    value={activeVolunteers}
                    icon={<FaCheckCircle />}

                  />

                  <HeroMiniCard

title="Performance Score"                    value={totalPoints}
                    icon={<FaTrophy />}

                  />

                </div>

              </div>


              <motion.div

                animate={{
                  rotate:[0,10,-10,0],
                  y:[0,-15,0]
                }}

                transition={{
                  duration:6,
                  repeat:Infinity
                }}

                className="hidden xl:flex w-48 h-48 rounded-[40px] bg-white text-black items-center justify-center shadow-2xl"

              >

                <FaRocket className="text-7xl" />

              </motion.div>

            </div>

          </motion.div>


          <div className="flex flex-col xl:flex-row gap-5 items-start xl:items-center justify-between mt-8">

            <div className="relative w-full xl:w-[450px]">

              <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-black/30 text-lg" />

              <input

                type="text"

                placeholder="Search volunteers..."

                value={search}

                onChange={(e) =>
                  setSearch(e.target.value)
                }

                className="w-full h-[72px] pl-16 pr-6 rounded-[28px] bg-white border border-black/5 outline-none text-lg font-semibold shadow-[0_10px_40px_rgba(0,0,0,0.04)]"

              />

            </div>

            <motion.button

              whileHover={{
                scale:1.03
              }}

              whileTap={{
                scale:0.98
              }}

              onClick={() => {

                resetForm()

                setShowModal(true)

              }}

              className="h-[72px] px-8 rounded-[28px] bg-black text-white font-black text-lg flex items-center gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.12)]"

            >

              <FaPlus />

              Hire Volunteer

            </motion.button>

          </div>


          <div className="mt-8">

            {

              loading

              ?

              <div className="h-[400px] flex items-center justify-center text-4xl font-black">

                Loading Volunteers...

              </div>

              :

              filteredVolunteers.length === 0

              ?

              <div className="rounded-[40px] bg-white border border-black/5 h-[420px] flex flex-col items-center justify-center shadow-[0_20px_80px_rgba(0,0,0,0.04)]">

                <div className="w-28 h-28 rounded-[32px] bg-black text-white flex items-center justify-center text-5xl mb-8">

                  <FaUsers />

                </div>

                <h1 className="text-5xl font-black">

                  No Volunteers Yet

                </h1>

                <p className="text-black/45 mt-5 text-xl">

                  Add your first volunteer.

                </p>

              </div>

              :

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">

                {

                  filteredVolunteers.map((volunteer) => (

                    <motion.div

                      key={volunteer.id}

                      whileHover={{
                        y:-8
                      }}

                      transition={{
                        duration:0.3
                      }}

                      className="group rounded-[40px] bg-white border border-black/5 overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.04)]"

                    >

                      <div className="relative p-8 overflow-hidden">

                        <div className="absolute top-[-30%] right-[-10%] w-[220px] h-[220px] bg-violet-200/30 blur-[80px] rounded-full" />

                        <div className="relative z-10">


                          <div className="flex items-start justify-between gap-5">

                            <div className="flex items-center gap-5">

                              <div className="w-20 h-20 rounded-[26px] bg-black text-white flex items-center justify-center text-3xl font-black">

                                {

                                  volunteer.name
                                    ?.charAt(0)
                                    ?.toUpperCase()

                                }

                              </div>

                              <div>

                                <div className={`

                                  inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.25em]

                                  ${

                                    volunteer.status === "Active"

                                    ?

                                    "bg-emerald-100 text-emerald-700"

                                    :

                                    "bg-rose-100 text-rose-600"

                                  }

                                `}>

                                  <FaCircle className="text-[8px]" />

                                  {volunteer.status}

                                </div>

                                <h1 className="text-3xl font-black mt-4">

                                  {volunteer.name}

                                </h1>

                                <p className="text-black/45 font-semibold mt-2">

                                  {volunteer.role}

                                </p>

                              </div>

                            </div>


                            <div className="flex flex-col gap-3">

                              <button

                                onClick={() =>
                                  editVolunteer(volunteer)
                                }

                                className="w-12 h-12 rounded-[18px] bg-violet-100 text-violet-700 flex items-center justify-center hover:scale-110 transition-all"

                              >

                                <FaEdit />

                              </button>

                              <button

                                onClick={() =>
                                  deleteVolunteer(volunteer.id)
                                }

                                className="w-12 h-12 rounded-[18px] bg-rose-100 text-rose-600 flex items-center justify-center hover:scale-110 transition-all"

                              >

                                <FaTrash />

                              </button>

                            </div>

                          </div>


                          <div className="mt-8 rounded-[30px] bg-black text-white p-6">

                            <div className="flex items-center justify-between">

                              <div>

                                <p className="uppercase tracking-[0.22em] text-[10px] font-black text-white/40">

                                  Performance Score
                                </p>

                                <h1 className="text-5xl font-black mt-3">

                                  {volunteer.points || 0}

                                </h1>

                              </div>

                              <div className="w-16 h-16 rounded-[22px] bg-white/10 flex items-center justify-center text-2xl">

                                <FaMedal />
                              </div>

                            </div>

                          </div>


                          <div className="mt-7 flex items-center justify-between">

                            <div className="flex items-center gap-3 text-black/45">

                              <FaEnvelope className="text-violet-500" />

                              <span className="truncate max-w-[220px] font-semibold">

                                {volunteer.email}

                              </span>

                            </div>

                          </div>


                          <div className="mt-8 pt-6 border-t border-black/5 flex items-center justify-between">

                            <div>

                              <p className="uppercase tracking-[0.22em] text-[10px] font-black text-black/35">

                                Assigned Event
                              </p>

                              <h1 className="text-2xl font-black mt-2">

                                {volunteer.assignedEvent}
                              </h1>

                            </div>

                            <div className="w-16 h-16 rounded-[22px] bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl">

                              <FaStar />
                            </div>

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


      <AnimatePresence>

        {

          showModal &&

          <div className="fixed inset-0 bg-black/50 backdrop-blur-xl z-[99999] flex items-center justify-center p-4">

            <motion.div

              initial={{
                opacity:0,
                scale:0.9,
                y:20
              }}

              animate={{
                opacity:1,
                scale:1,
                y:0
              }}

              className="w-full max-w-[700px] rounded-[45px] bg-white p-10 relative overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.18)]"

            >

              <div className="absolute top-[-20%] right-[-10%] w-[260px] h-[260px] bg-violet-200/40 blur-[100px] rounded-full" />

              <div className="relative z-10">


                <div className="flex items-start justify-between gap-6">

                  <div>

                    <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-violet-100 text-violet-700 text-[10px] font-black uppercase tracking-[0.25em]">

                      <FaUserTie />

                      Volunteer Portal
                    </div>

                    <h1 className="text-5xl font-black mt-6">

                      {

                        editingVolunteer

                        ?

                        "Edit Volunteer"

                        :

                        "Add Volunteer"

                      }

                    </h1>

                  </div>

                  <button

                    onClick={() => {

                      setShowModal(false)
                      resetForm()

                    }}

                    className="w-14 h-14 rounded-[20px] bg-[#f6efe7] flex items-center justify-center"

                  >

                    <FaTimes />
                  </button>

                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

                  <InputField
                    label="Volunteer Name"
                    value={name}
                    setValue={setName}
                    placeholder="Masood"
                  />

                  <InputField
                    label="Email"
                    value={email}
                    setValue={setEmail}
                    placeholder="abc@gmail.com"
                  />

                  <InputField
                    label="Points"
                    value={points}
                    setValue={setPoints}
                    placeholder="500"
                    type="number"
                  />

                  <select

                    value={role}

                    onChange={(e)=>
                      setRole(e.target.value)
                    }

                    className="w-full h-[72px] px-6 rounded-[28px] bg-[#f6efe7] border border-black/5 outline-none text-lg font-semibold"

                  >

                    <option>Coordinator</option>
                    <option>Technical Team</option>
                    <option>Registration Team</option>
                    <option>Hospitality</option>
                    <option>Marketing</option>

                  </select>

                </div>


                <select

                  value={assignedEvent}

                  onChange={(e)=>
                    setAssignedEvent(
                      e.target.value
                    )
                  }

                  className="w-full mt-6 h-[72px] px-6 rounded-[28px] bg-[#f6efe7] border border-black/5 outline-none text-lg font-semibold"

                >

                  <option value="">
                    Select Event
                  </option>

                  {

                    events.map((event)=>(

                      <option
                        key={event.id}
                        value={event.title}
                      >

                        {event.title}

                      </option>

                    ))

                  }

                </select>


                <div className="grid grid-cols-2 gap-5 mt-6">

                  <button

                    onClick={()=>
                      setStatus("Active")
                    }

                    className={`

                      h-[64px]
                      rounded-[24px]
                      font-black

                      ${

                        status === "Active"

                        ?

                        "bg-emerald-100 text-emerald-700"

                        :

                        "bg-[#f6efe7] border border-black/5"

                      }

                    `}

                  >

                    Active

                  </button>

                  <button

                    onClick={()=>
                      setStatus("Inactive")
                    }

                    className={`

                      h-[64px]
                      rounded-[24px]
                      font-black

                      ${

                        status === "Inactive"

                        ?

                        "bg-rose-100 text-rose-600"

                        :

                        "bg-[#f6efe7] border border-black/5"

                      }

                    `}

                  >

                    Inactive

                  </button>

                </div>


                <div className="flex gap-5 mt-10">

                  <motion.button

                    whileHover={{
                      scale:1.02
                    }}

                    whileTap={{
                      scale:0.98
                    }}

                    onClick={

                      editingVolunteer

                      ?

                      updateVolunteer

                      :

                      createVolunteer

                    }

                    disabled={creating}

                    className="flex-1 h-[72px] rounded-[28px] bg-black text-white font-black text-lg"

                  >

                    {

                      creating

                      ?

                      "Saving..."

                      :

                      editingVolunteer

                      ?

                      "Update Volunteer"

                      :

                      "Add Volunteer"

                    }

                  </motion.button>

                  <button

                    onClick={() => {

                      setShowModal(false)
                      resetForm()

                    }}

                    className="px-10 h-[72px] rounded-[28px] bg-[#f6efe7] border border-black/5 font-bold"

                  >

                    Cancel

                  </button>

                </div>

              </div>

            </motion.div>

          </div>

        }

      </AnimatePresence>

</MainLayout>
  )

}

function HeroMiniCard({

  title,
  value,
  icon

}) {

  return (

    <div className="px-6 py-5 rounded-[28px] bg-white/10 backdrop-blur-md border border-white/10">

      <div className="flex items-center gap-5">

        <div className="w-14 h-14 rounded-[18px] bg-white text-black flex items-center justify-center text-xl">

          {icon}

        </div>

        <div>

          <p className="uppercase tracking-[0.22em] text-[10px] font-black text-white/40">

            {title}
          </p>

          <h1 className="text-3xl font-black mt-2">

            {value}
          </h1>

        </div>

      </div>

    </div>

  )

}

function InputField({

  label,
  value,
  setValue,
  placeholder,
  type="text"

}) {

  return (

    <div>

      <p className="uppercase tracking-[0.22em] text-[10px] font-black text-black/35 mb-4">

        {label}
      </p>

      <input

        type={type}

        value={value}

        onChange={(e)=>
          setValue(e.target.value)
        }

        placeholder={placeholder}

        className="w-full h-[72px] px-6 rounded-[28px] bg-[#f6efe7] border border-black/5 outline-none text-lg font-semibold"

      />

    </div>

  )

}

export default Volunteers