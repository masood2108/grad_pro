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
  serverTimestamp
} from "firebase/firestore"

import { db } from "../firebase/firebase"
import MainLayout from "../layouts/MainLayout"

import {

  FaHandshake,
  FaSearch,
  FaBuilding,
  FaMoneyBillWave,
  FaGlobe,
  FaArrowUp,
  FaChartLine,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheckCircle,
  FaCrown,
  FaRocket,
  FaStar,
  FaExternalLinkAlt,
  FaBolt

} from "react-icons/fa"

function Sponsors() {

  const [sponsors, setSponsors] =
  useState([])

  const [filteredSponsors, setFilteredSponsors] =
  useState([])

  const [loading, setLoading] =
  useState(true)

  const [search, setSearch] =
  useState("")

  const [showModal, setShowModal] =
  useState(false)

  const [editingSponsor, setEditingSponsor] =
  useState(null)

  const [creating, setCreating] =
  useState(false)

  const [name, setName] =
  useState("")

  const [amount, setAmount] =
  useState("")

  const [website, setWebsite] =
  useState("")

  const [category, setCategory] =
  useState("")

  const [logo, setLogo] =
  useState("")

  useEffect(() => {

    const unsubscribe =

      onSnapshot(

        collection(db, "sponsors"),

        (snapshot) => {

          const data = []

          snapshot.forEach((doc) => {

            data.push({

              id: doc.id,
              ...doc.data()

            })

          })

          setSponsors(data)

          setLoading(false)

        }

      )

    return () => unsubscribe()

  }, [])

  useEffect(() => {

    let updated = [...sponsors]

    if (search) {

      updated = updated.filter(

        (sponsor) =>

          sponsor.name
            ?.toLowerCase()
            .includes(search.toLowerCase())

      )

    }

    setFilteredSponsors(updated)

  }, [sponsors, search])

  const totalFunding = sponsors.reduce(

    (acc, sponsor) =>

      acc + Number(sponsor.amount || 0),

    0

  )

  const platinumSponsors =
  sponsors.filter(
    sponsor =>
      Number(sponsor.amount) >= 100000
  ).length

  const resetForm = () => {

    setName("")
    setAmount("")
    setWebsite("")
    setCategory("")
    setLogo("")
    setEditingSponsor(null)

  }

  const createSponsor = async () => {

    if (
      !name ||
      !amount
    ) {

      return alert("Please fill required fields")

    }

    try {

      setCreating(true)

      await addDoc(

        collection(db, "sponsors"),

        {
          name,
          amount: Number(amount),
          website,
          category,
          logo,
          createdAt: serverTimestamp()
        }

      )

      resetForm()

      setShowModal(false)

    }

    catch (error) {

      console.log(error)

    }

    finally {

      setCreating(false)

    }

  }

  const updateSponsorData = async () => {

    try {

      setCreating(true)

      await updateDoc(

        doc(db, "sponsors", editingSponsor.id),

        {
          name,
          amount: Number(amount),
          website,
          category,
          logo
        }

      )

      resetForm()

      setShowModal(false)

    }

    catch (error) {

      console.log(error)

    }

    finally {

      setCreating(false)

    }

  }

  const deleteSponsor = async (id) => {

    const confirmDelete =
    window.confirm(
      "Delete this sponsor?"
    )

    if (!confirmDelete) return

    try {

      await deleteDoc(
        doc(db, "sponsors", id)
      )

    }

    catch (error) {

      console.log(error)

    }

  }

  const editSponsor = (sponsor) => {

    setEditingSponsor(sponsor)

    setName(sponsor.name || "")
    setAmount(sponsor.amount || "")
    setWebsite(sponsor.website || "")
    setCategory(sponsor.category || "")
    setLogo(sponsor.logo || "")

    setShowModal(true)

  }

  return (

   <MainLayout>

      <div className="flex-1 min-w-0 relative overflow-hidden">

        {/* BG */}

        <div className="absolute top-[-200px] right-[-100px] w-[450px] h-[450px] bg-emerald-300/20 blur-[120px] rounded-full" />

        <div className="absolute bottom-[-200px] left-[-100px] w-[450px] h-[450px] bg-violet-300/20 blur-[120px] rounded-full" />

        <div className="h-full overflow-y-auto p-6 relative z-10">


          {/* HERO */}

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

            className="relative overflow-hidden rounded-[45px] bg-black text-white p-10 md:p-14"

          >

            {/* BG */}

            <div className="absolute top-[-20%] right-[-10%] w-[320px] h-[320px] bg-emerald-500/20 blur-[100px] rounded-full" />

            <div className="absolute bottom-[-20%] left-[-10%] w-[320px] h-[320px] bg-violet-500/20 blur-[100px] rounded-full" />

            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">

              {/* LEFT */}

              <div>

                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-black tracking-[0.25em] uppercase">

                  <FaHandshake />

                  Sponsorship Hub

                </div>

                <h1 className="text-6xl md:text-8xl leading-[0.9] tracking-[-0.08em] font-black mt-8">

                  Brand
                  <br />
                  Partners
                </h1>

                <p className="text-white/55 text-2xl mt-8 max-w-3xl leading-relaxed">

                  Manage sponsorship deals,
                  strategic partnerships,
                  realtime funding analytics
                  and premium collaborations.

                </p>

                {/* STATS */}

                <div className="flex flex-wrap gap-5 mt-10">

                  <HeroMiniCard

                    title="Sponsors"
                    value={sponsors.length}
                    icon={<FaBuilding />}

                  />

                  <HeroMiniCard

                    title="Funding"
                    value={`₹${totalFunding}`}
                    icon={<FaMoneyBillWave />}

                  />

                  <HeroMiniCard

                    title="Platinum"
                    value={platinumSponsors}
                    icon={<FaCrown />}

                  />

                </div>

              </div>

              {/* RIGHT */}

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

          {/* SEARCH */}

          <div className="flex flex-col xl:flex-row gap-5 items-start xl:items-center justify-between mt-8">

            <div className="relative w-full xl:w-[450px]">

              <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-black/30 text-lg" />

              <input

                type="text"

                placeholder="Search sponsors..."

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

              Add Sponsor

            </motion.button>

          </div>

          {/* STATS */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

            <ModernStatCard

              title="Total Sponsors"
              value={sponsors.length}
              icon={<FaBuilding />}
              color="violet"

            />

            <ModernStatCard

              title="Total Funding"
              value={`₹${totalFunding}`}
              icon={<FaMoneyBillWave />}
              color="emerald"

            />

            <ModernStatCard

              title="Growth"
              value="+24%"
              icon={<FaArrowUp />}
              color="cyan"

            />

          </div>

          {/* SPONSORS */}

          <div className="mt-8">

            {

              loading

              ?

              <div className="h-[400px] flex items-center justify-center text-4xl font-black">

                Loading Sponsors...

              </div>

              :

              filteredSponsors.length === 0

              ?

              <div className="rounded-[40px] bg-white border border-black/5 h-[420px] flex flex-col items-center justify-center shadow-[0_20px_80px_rgba(0,0,0,0.04)]">

                <div className="w-28 h-28 rounded-[32px] bg-black text-white flex items-center justify-center text-5xl mb-8">

                  <FaHandshake />

                </div>

                <h1 className="text-5xl font-black">

                  No Sponsors Yet

                </h1>

                <p className="text-black/45 mt-5 text-xl">

                  Add your first brand partner.

                </p>

              </div>

              :

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">

                {

                  filteredSponsors.map((sponsor) => (

                    <motion.div

                      key={sponsor.id}

                      whileHover={{
                        y:-8
                      }}

                      transition={{
                        duration:0.3
                      }}

                      className="group rounded-[40px] bg-white border border-black/5 overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.04)]"

                    >

                      {/* TOP */}

                      <div className="relative p-8 overflow-hidden">

                        <div className="absolute top-[-30%] right-[-10%] w-[220px] h-[220px] bg-emerald-200/30 blur-[80px] rounded-full" />

                        <div className="relative z-10">

                          {/* HEADER */}

                          <div className="flex items-start justify-between gap-5">

                            <div className="flex items-center gap-5">

                              {

                                sponsor.logo

                                ?

                                <img

                                  src={sponsor.logo}

                                  alt=""

                                  className="w-20 h-20 rounded-[26px] object-cover border border-black/5"

                                />

                                :

                                <div className="w-20 h-20 rounded-[26px] bg-black text-white flex items-center justify-center text-3xl font-black">

                                  {

                                    sponsor.name
                                      ?.charAt(0)
                                      ?.toUpperCase()

                                  }

                                </div>

                              }

                              <div>

                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-[0.25em]">

                                  <FaCheckCircle />

                                  Active
                                </div>

                                <h1 className="text-3xl font-black mt-4">

                                  {sponsor.name}

                                </h1>

                                <p className="text-black/45 font-semibold mt-2">

                                  {

                                    sponsor.category ||

                                    "Technology Partner"

                                  }

                                </p>

                              </div>

                            </div>

                            {/* ACTIONS */}

                            <div className="flex flex-col gap-3">

                              <button

                                onClick={() =>
                                  editSponsor(sponsor)
                                }

                                className="w-12 h-12 rounded-[18px] bg-violet-100 text-violet-700 flex items-center justify-center hover:scale-110 transition-all"

                              >

                                <FaEdit />

                              </button>

                              <button

                                onClick={() =>
                                  deleteSponsor(sponsor.id)
                                }

                                className="w-12 h-12 rounded-[18px] bg-rose-100 text-rose-600 flex items-center justify-center hover:scale-110 transition-all"

                              >

                                <FaTrash />

                              </button>

                            </div>

                          </div>

                          {/* FUNDING */}

                          <div className="mt-8 rounded-[30px] bg-black text-white p-6">

                            <div className="flex items-center justify-between">

                              <div>

                                <p className="uppercase tracking-[0.22em] text-[10px] font-black text-white/40">

                                  Funding
                                </p>

                                <h1 className="text-5xl font-black mt-3">

                                  ₹{sponsor.amount || 0}

                                </h1>

                              </div>

                              <div className="w-16 h-16 rounded-[22px] bg-white/10 flex items-center justify-center text-2xl">

                                <FaMoneyBillWave />
                              </div>

                            </div>

                          </div>

                          {/* WEBSITE */}

                          <div className="mt-7 flex items-center justify-between">

                            <div className="flex items-center gap-3 text-black/45">

                              <FaGlobe className="text-emerald-500" />

                              <span className="truncate max-w-[200px] font-semibold">

                                {

                                  sponsor.website ||

                                  "No Website"

                                }

                              </span>

                            </div>

                            <button className="w-12 h-12 rounded-[18px] bg-[#f6efe7] border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all">

                              <FaExternalLinkAlt />
                            </button>

                          </div>

                          {/* FOOTER */}

                          <div className="mt-8 pt-6 border-t border-black/5 flex items-center justify-between">

                            <div>

                              <p className="uppercase tracking-[0.22em] text-[10px] font-black text-black/35">

                                Performance
                              </p>

                              <h1 className="text-2xl font-black mt-2 flex items-center gap-3">

                                <FaBolt className="text-yellow-500" />

                                Excellent
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

      {/* MODAL */}

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

            {/* BG */}

            <div className="absolute top-[-20%] right-[-10%] w-[260px] h-[260px] bg-emerald-200/40 blur-[100px] rounded-full" />

            <div className="relative z-10">

              {/* HEADER */}

              <div className="flex items-start justify-between gap-6">

                <div>

                  <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-[0.25em]">

                    <FaHandshake />

                    Sponsor Portal
                  </div>

                  <h1 className="text-5xl font-black mt-6">

                    {

                      editingSponsor

                      ?

                      "Edit Sponsor"

                      :

                      "Add Sponsor"

                    }

                  </h1>

                  <p className="text-black/45 text-lg mt-5 max-w-xl">

                    Manage sponsor partnerships,
                    funding details and brand
                    identity.

                  </p>

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

              {/* PREVIEW */}

              {

                logo &&

                <div className="mt-8 rounded-[32px] bg-[#f6efe7] border border-black/5 p-6 flex items-center gap-5">

                  <img

                    src={logo}

                    alt=""

                    className="w-24 h-24 rounded-[28px] object-cover"

                  />

                  <div>

                    <h1 className="text-3xl font-black">

                      {name || "Sponsor"}
                    </h1>

                    <p className="text-black/45 font-semibold mt-2">

                      {category || "Brand Partner"}
                    </p>
                  </div>

                </div>

              }

              {/* FORM */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

                <InputField
                  label="Sponsor Name"
                  value={name}
                  setValue={setName}
                  placeholder="Google"
                />

                <InputField
                  label="Category"
                  value={category}
                  setValue={setCategory}
                  placeholder="Technology Partner"
                />

                <InputField
                  label="Website"
                  value={website}
                  setValue={setWebsite}
                  placeholder="https://company.com"
                />

                <InputField
                  label="Funding Amount"
                  value={amount}
                  setValue={setAmount}
                  placeholder="50000"
                  type="number"
                />

              </div>

              <div className="mt-6">

                <InputField
                  label="Logo URL"
                  value={logo}
                  setValue={setLogo}
                  placeholder="Paste logo image URL..."
                />

              </div>

              {/* BUTTONS */}

              <div className="flex gap-5 mt-10">

                <motion.button

                  whileHover={{
                    scale:1.02
                  }}

                  whileTap={{
                    scale:0.98
                  }}

                  onClick={

                    editingSponsor

                    ?

                    updateSponsorData

                    :

                    createSponsor

                  }

                  disabled={creating}

                  className="flex-1 h-[72px] rounded-[28px] bg-black text-white font-black text-lg"

                >

                  {

                    creating

                    ?

                    "Saving..."

                    :

                    editingSponsor

                    ?

                    "Update Sponsor"

                    :

                    "Add Sponsor"

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

function ModernStatCard({

  title,
  value,
  icon,
  color

}) {

  return (

    <motion.div

      whileHover={{
        y:-5
      }}

      className="rounded-[36px] bg-white border border-black/5 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.04)]"

    >

      <div className="flex items-center justify-between">

        <div>

          <p className="uppercase tracking-[0.22em] text-xs font-black text-black/35">

            {title}
          </p>

          <h1 className="text-5xl font-black mt-5">

            {value}
          </h1>

        </div>

        <div className={`

          w-20 h-20 rounded-[28px]
          flex items-center justify-center text-3xl

          ${color === "violet" && "bg-violet-100 text-violet-700"}
          ${color === "emerald" && "bg-emerald-100 text-emerald-700"}
          ${color === "cyan" && "bg-cyan-100 text-cyan-700"}

        `}>

          {icon}

        </div>

      </div>

    </motion.div>

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

export default Sponsors