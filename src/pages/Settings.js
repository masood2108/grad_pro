/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

import MainLayout from "../layouts/MainLayout"

import {

  FaCog,
  FaUser,
  FaUniversity,
  FaBell,
  FaShieldAlt,
  FaPalette,
  FaSave,
  FaMoon,
  FaSun,
  FaLock,
  FaCamera,
  FaCheckCircle,
  FaArrowRight,
  FaGlobe,
  FaRocket

} from "react-icons/fa"

import {

  auth

} from "../firebase/firebase"

function Settings() {

  const [name, setName] =
  useState("")

  const [email, setEmail] =
  useState("")

  const [college, setCollege] =
  useState("VNR VJIET")

  const [notifications, setNotifications] =
  useState(true)

  const [darkMode, setDarkMode] =
  useState(true)

  const [saving, setSaving] =
  useState(false)

  const [saved, setSaved] =
  useState(false)

  useEffect(() => {

    const unsubscribe =

      auth.onAuthStateChanged(

        (user) => {

          if (user) {

            setName(

              user.displayName ||

              user.email?.split("@")[0]

            )

            setEmail(user.email)

          }

        }

      )

    return () => unsubscribe()

  }, [])

  const saveSettings = () => {

    setSaving(true)

    setTimeout(() => {

      setSaving(false)

      setSaved(true)

      setTimeout(() => {

        setSaved(false)

      }, 3000)

    }, 1800)

  }

  return (

    <MainLayout>


      <div className="flex-1 min-w-0 relative overflow-hidden">


        <div className="absolute top-[-220px] right-[-120px] w-[500px] h-[500px] bg-violet-300/20 blur-[140px] rounded-full pointer-events-none" />

        <div className="absolute bottom-[-220px] left-[-120px] w-[500px] h-[500px] bg-cyan-300/20 blur-[140px] rounded-full pointer-events-none" />

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

            className="mt-6 rounded-[45px] bg-white border border-black/5 overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.05)] relative"

          >


            <div className="absolute top-[-120px] right-[-80px] w-[300px] h-[300px] bg-violet-300/20 blur-[120px] rounded-full" />

            <div className="absolute bottom-[-120px] left-[-80px] w-[300px] h-[300px] bg-cyan-300/20 blur-[120px] rounded-full" />

            <div className="relative z-10 p-10 md:p-14 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">


              <div>

                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-violet-100 text-violet-700 text-xs font-black uppercase tracking-[0.25em]">

                  <FaCog />

                  SYSTEM CONFIGURATION

                </div>

                <h1 className="text-6xl md:text-8xl leading-[0.9] tracking-[-0.08em] font-black mt-8">

                  Smart
                  <br />
                  Settings
                </h1>

                <p className="mt-8 text-black/45 text-2xl max-w-3xl leading-relaxed">

                  Configure your smart campus
                  dashboard, account security,
                  organization settings and
                  futuristic UI preferences.

                </p>


                <div className="flex flex-wrap gap-5 mt-10">

                  <MiniCard
                    title="Security"
                    value="High"
                    icon={<FaShieldAlt />}
                  />

                  <MiniCard
                    title="Theme"
                    value={
                      darkMode
                      ?
                      "Dark"
                      :
                      "Light"
                    }
                    icon={
                      darkMode
                      ?
                      <FaMoon />
                      :
                      <FaSun />
                    }
                  />

                  <MiniCard
                    title="Alerts"
                    value={
                      notifications
                      ?
                      "ON"
                      :
                      "OFF"
                    }
                    icon={<FaBell />}
                  />

                </div>

              </div>


              <motion.div

                animate={{
                  rotate:[0,8,-8,0],
                  y:[0,-10,0]
                }}

                transition={{
                  duration:6,
                  repeat:Infinity
                }}

                className="hidden xl:flex w-44 h-44 rounded-[40px] bg-black text-white items-center justify-center shadow-[0_30px_90px_rgba(0,0,0,0.15)]"

              >

                <FaRocket className="text-6xl" />

              </motion.div>

            </div>

          </motion.div>


          <div className="grid grid-cols-1 xl:grid-cols-2 gap-7 mt-8">


            <GlassCard>

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-5">

                  <div className="w-20 h-20 rounded-[28px] bg-violet-100 text-violet-700 flex items-center justify-center text-3xl">

                    <FaUser />

                  </div>

                  <div>

                    <p className="uppercase tracking-[0.22em] text-xs font-black text-black/35">

                      ACCOUNT
                    </p>

                    <h1 className="text-4xl font-black mt-2">

                      Profile Settings
                    </h1>

                  </div>

                </div>

                <button className="w-14 h-14 rounded-[20px] bg-black text-white flex items-center justify-center">

                  <FaCamera />
                </button>

              </div>


              <div className="space-y-6 mt-10">

                <div>

                  <label className="text-black/45 text-sm font-bold block mb-3">

                    Full Name

                  </label>

                  <input

                    value={name}

                    onChange={(e)=>
                      setName(e.target.value)
                    }

                    className="w-full h-[70px] px-6 rounded-[26px] bg-[#f8f4ef] border border-black/5 outline-none text-lg font-semibold"

                  />

                </div>

                <div>

                  <label className="text-black/45 text-sm font-bold block mb-3">

                    Email Address

                  </label>

                  <input

                    value={email}

                    onChange={(e)=>
                      setEmail(e.target.value)
                    }

                    className="w-full h-[70px] px-6 rounded-[26px] bg-[#f8f4ef] border border-black/5 outline-none text-lg font-semibold"

                  />

                </div>

              </div>

            </GlassCard>


            <GlassCard>

              <div className="flex items-center gap-5">

                <div className="w-20 h-20 rounded-[28px] bg-cyan-100 text-cyan-700 flex items-center justify-center text-3xl">

                  <FaUniversity />

                </div>

                <div>

                  <p className="uppercase tracking-[0.22em] text-xs font-black text-black/35">

                    ORGANIZATION
                  </p>

                  <h1 className="text-4xl font-black mt-2">

                    Institution
                  </h1>

                </div>

              </div>

              <div className="space-y-6 mt-10">

                <div>

                  <label className="text-black/45 text-sm font-bold block mb-3">

                    Institution Name

                  </label>

                  <input

                    value={college}

                    onChange={(e)=>
                      setCollege(e.target.value)
                    }

                    className="w-full h-[70px] px-6 rounded-[26px] bg-[#f8f4ef] border border-black/5 outline-none text-lg font-semibold"

                  />

                </div>

                <div className="rounded-[28px] bg-gradient-to-r from-cyan-100 to-violet-100 p-6 mt-5">

                  <div className="flex items-center justify-between gap-5">

                    <div>

                      <p className="uppercase tracking-[0.22em] text-[10px] font-black text-black/40">

                        SMART CAMPUS
                      </p>

                      <h1 className="text-2xl font-black mt-2">

                        Global Campus Sync
                      </h1>

                    </div>

                    <div className="w-16 h-16 rounded-[24px] bg-white text-black flex items-center justify-center text-2xl shadow-lg">

                      <FaGlobe />
                    </div>

                  </div>

                </div>

              </div>

            </GlassCard>


            <GlassCard>

              <div className="flex items-center gap-5">

                <div className="w-20 h-20 rounded-[28px] bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl">

                  <FaBell />

                </div>

                <div>

                  <p className="uppercase tracking-[0.22em] text-xs font-black text-black/35">

                    ALERTS
                  </p>

                  <h1 className="text-4xl font-black mt-2">

                    Notifications
                  </h1>

                </div>

              </div>

              <div className="mt-10 rounded-[30px] bg-[#f8f4ef] border border-black/5 p-6 flex items-center justify-between gap-5">

                <div>

                  <h1 className="text-2xl font-black">

                    Enable Notifications
                  </h1>

                  <p className="text-black/45 mt-2">

                    Receive realtime platform
                    updates and event alerts.

                  </p>

                </div>

                <button

                  onClick={()=>
                    setNotifications(!notifications)
                  }

                  className={`

                    w-24 h-12 rounded-full transition-all duration-300 relative

                    ${

                      notifications

                      ?

                      "bg-emerald-500"

                      :

                      "bg-zinc-300"

                    }

                  `}

                >

                  <div className={`

                    absolute top-1 w-10 h-10 rounded-full bg-white transition-all duration-300 shadow-lg

                    ${

                      notifications

                      ?

                      "left-13"

                      :

                      "left-1"

                    }

                  `} />

                </button>

              </div>

            </GlassCard>


            <GlassCard>

              <div className="flex items-center gap-5">

                <div className="w-20 h-20 rounded-[28px] bg-yellow-100 text-yellow-700 flex items-center justify-center text-3xl">

                  <FaShieldAlt />

                </div>

                <div>

                  <p className="uppercase tracking-[0.22em] text-xs font-black text-black/35">

                    SECURITY
                  </p>

                  <h1 className="text-4xl font-black mt-2">

                    Theme & Privacy
                  </h1>

                </div>

              </div>


              <div className="mt-10 rounded-[30px] bg-[#f8f4ef] border border-black/5 p-6 flex items-center justify-between gap-5">

                <div className="flex items-center gap-5">

                  <div className="w-16 h-16 rounded-[22px] bg-black text-white flex items-center justify-center text-2xl">

                    {

                      darkMode

                      ?

                      <FaMoon />

                      :

                      <FaSun />

                    }

                  </div>

                  <div>

                    <h1 className="text-2xl font-black">

                      Dark Mode
                    </h1>

                    <p className="text-black/45 mt-2">

                      Futuristic dashboard
                      appearance system.

                    </p>

                  </div>

                </div>

                <button

                  onClick={()=>
                    setDarkMode(!darkMode)
                  }

                  className={`

                    w-24 h-12 rounded-full transition-all duration-300 relative

                    ${

                      darkMode

                      ?

                      "bg-violet-500"

                      :

                      "bg-zinc-300"

                    }

                  `}

                >

                  <div className={`

                    absolute top-1 w-10 h-10 rounded-full bg-white transition-all duration-300 shadow-lg

                    ${

                      darkMode

                      ?

                      "left-13"

                      :

                      "left-1"

                    }

                  `} />

                </button>

              </div>


              <div className="mt-6 rounded-[30px] bg-black text-white p-6">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="uppercase tracking-[0.22em] text-[10px] font-black text-white/40">

                      SECURITY LEVEL
                    </p>

                    <h1 className="text-3xl font-black mt-3">

                      Protected
                    </h1>

                  </div>

                  <div className="w-16 h-16 rounded-[24px] bg-white/10 flex items-center justify-center text-2xl">

                    <FaLock />
                  </div>

                </div>

              </div>

            </GlassCard>

          </div>


          <motion.button

            whileHover={{
              scale:1.02,
              y:-2
            }}

            whileTap={{
              scale:0.98
            }}

            onClick={saveSettings}

            className="mt-10 h-[80px] px-10 rounded-[30px] bg-black text-white font-black text-xl flex items-center justify-center gap-5 shadow-[0_30px_90px_rgba(0,0,0,0.12)]"

          >

            {

              saving

              ?

              "Saving Configuration..."

              :

              saved

              ?

              "Configuration Saved"

              :

              "Save Configuration"

            }

            {

              saved

              ?

              <FaCheckCircle />

              :

              <FaArrowRight />

            }

          </motion.button>

        </div>

      </div>

</MainLayout>
  )

}

function GlassCard({

  children

}) {

  return (

    <motion.div

      whileHover={{
        y:-4
      }}

      className="rounded-[40px] bg-white border border-black/5 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.05)]"

    >

      {children}

    </motion.div>

  )

}

function MiniCard({

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

export default Settings