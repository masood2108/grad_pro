
/* eslint-disable no-unused-vars */
import { Canvas, useFrame } from "@react-three/fiber"
import {
  Float,
  Sphere,
  MeshDistortMaterial
} from "@react-three/drei"

import {
  motion,
  useScroll,
  useTransform
} from "framer-motion"

import { useRef, useEffect } from "react"

import {
  FaArrowRight,
  FaBolt,
  FaUsers,
  FaShieldAlt,
  FaQrcode,
  FaBell,
  FaSearch,
  FaBook,
  FaClipboardList,
  FaMoneyBillWave
} from "react-icons/fa"

function Orb() {

  const mesh = useRef()

  useFrame(() => {

    if (mesh.current) {

      mesh.current.rotation.y += 0.002
      mesh.current.rotation.x += 0.001

    }

  })

  return (

    <Float speed={2} floatIntensity={2}>

      <Sphere
        ref={mesh}
        args={[1.5, 128, 128]}
        scale={2.8}
      >

        <MeshDistortMaterial
          color="#ff7a00"
          distort={0.4}
          speed={2}
          roughness={0}
        />

      </Sphere>

    </Float>

  )

}

function Home() {

  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  })

  const dashboardY = useTransform(
    scrollYProgress,
    [0, 1],
    [100, -20]
  )

  const dashboardRotate = useTransform(
    scrollYProgress,
    [0, 1],
    [-4, 0]
  )

  const dashboardScale = useTransform(
    scrollYProgress,
    [0, 0.3],
    [0.92, 1]
  )

  const text1X = useTransform(
    scrollYProgress,
    [0, 1],
    [-400, 250]
  )

  const text2X = useTransform(
    scrollYProgress,
    [0, 1],
    [400, -250]
  )

  const textOpacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.9, 1],
    [0, 1, 1, 0]
  )

  useEffect(() => {

    document.body.style.background = "#f4ece4"

  }, [])

  return (

    <div className="bg-[#f4ece4] overflow-x-hidden text-black relative">

      <div className="fixed inset-0 z-0">

        <Canvas camera={{ position: [0, 0, 5] }}>

          <ambientLight intensity={1.5} />

          <directionalLight position={[3, 3, 3]} />

          <Orb />

        </Canvas>

      </div>

      <div className="fixed top-[-250px] left-[-200px] w-[700px] h-[700px] bg-orange-300 opacity-40 blur-[180px] rounded-full z-0" />

      <div className="fixed bottom-[-250px] right-[-200px] w-[700px] h-[700px] bg-violet-300 opacity-30 blur-[180px] rounded-full z-0" />

      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6">

        <div className="max-w-7xl mx-auto rounded-[30px] bg-white/60 backdrop-blur-2xl border border-white/50 px-8 py-5 flex items-center justify-between shadow-xl">

          <div>

            <h1 className="text-3xl font-black tracking-tight">
              EventSphere
            </h1>

            <p className="text-black/40 text-sm mt-1">
              LMS PLATFORM
            </p>

          </div>

          <div className="flex gap-4">

            <a
              href="/login"
              className="px-6 py-3 rounded-xl bg-white border border-white hover:scale-105 transition duration-300"
            >
              Login
            </a>

            <a
              href="/register"
              className="px-6 py-3 rounded-xl bg-black text-white hover:scale-105 transition duration-300"
            >
              Get Started
            </a>

          </div>

        </div>

      </nav>

      <section className="relative z-10 min-h-screen flex items-center px-8 pt-24">

        <div className="max-w-7xl mx-auto w-full">

          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >

            

            <h1 className="text-[70px] md:text-[170px] leading-[0.82] font-black tracking-[-0.08em] max-w-7xl">

              BUILD THE
              <br />

              FUTURE OF
              <br />

              EVENTS

            </h1>

            <p className="mt-10 text-2xl text-black/60 leading-relaxed max-w-3xl">

              AI powered event infrastructure with realtime analytics,
              smart attendance, community systems and immersive dashboards.

            </p>

            <div className="flex flex-wrap gap-5 mt-8">

              <motion.a
                href="/register"
                whileHover={{
                  y: -4
                }}
                whileTap={{
                  scale: 0.96
                }}
                className="group px-10 py-6 rounded-2xl bg-black text-white font-bold text-lg flex items-center gap-4 shadow-[0_20px_60px_rgba(0,0,0,0.25)] transition-all duration-300"
              >

                Launch Platform

                <FaArrowRight className="group-hover:translate-x-1 transition duration-300" />

              </motion.a>

            </div>

          </motion.div>

        </div>

      </section>

      <section
        ref={sectionRef}
        className="relative min-h-screen py-6 z-10 overflow-hidden"
      >

        <motion.div
          style={{
            x: text1X,
            opacity: textOpacity
          }}
          className="absolute top-[10%] left-[-10%] z-10 whitespace-nowrap pointer-events-none"
        >

          <h1 className="text-[80px] md:text-[180px] font-black tracking-[-0.08em] text-[#5b21b6]/20">

            EVENTSPHERE

          </h1>

        </motion.div>

        <motion.div
          style={{
            x: text2X,
            opacity: textOpacity
          }}
          className="absolute bottom-[8%] right-[-10%] z-10 whitespace-nowrap pointer-events-none"
        >

          <h1 className="text-[80px] md:text-[180px] font-black tracking-[-0.08em] text-[#f97316]/20">

            COMMAND CENTER

          </h1>

        </motion.div>

        <motion.div
          style={{
            y: dashboardY,
            rotate: dashboardRotate,
            scale: dashboardScale
          }}
          className="relative z-30 px-4 md:px-8"
        >

          <div className="w-full max-w-[1400px] mx-auto rounded-[45px] overflow-hidden bg-[#050816] border border-[#251d4b] shadow-[0_60px_140px_rgba(0,0,0,0.45)]">

            <div className="flex flex-col lg:flex-row lg:items-center justify-between px-6 md:px-10 py-7 border-b border-white/5 gap-6">

              <div>

                <h2 className="text-3xl md:text-5xl font-black text-white">
                  LMS Command Center
                </h2>

                <p className="text-white/40 mt-2 text-base md:text-lg">
                  Good Afternoon, masood 👋
                </p>

              </div>

              <div className="flex items-center gap-4">

                <div className="bg-[#14152a] rounded-2xl px-5 py-4 flex items-center gap-4">

                  <FaSearch className="text-white/40" />

                  <span className="text-white/40">
                    Search...
                  </span>

                </div>

                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                  M
                </div>

              </div>

            </div>

            <div className="p-6 md:p-8">

              <div className="rounded-[35px] bg-gradient-to-r from-[#12152f] to-[#0d1c40] border border-violet-500/10 p-8 md:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">

                <div>

                  <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-8">

                    <FaBolt className="text-violet-400" />

                    <span className="text-violet-200">
                      LIVE SYSTEM
                    </span>

                  </div>

                  <h1 className="text-5xl md:text-7xl font-black text-white">
                    Welcome, masood
                  </h1>

                  <p className="text-white/40 text-xl md:text-2xl mt-5">
                    EventSphere LMS Platform
                  </p>

                </div>

                <div className="w-28 h-28 md:w-32 md:h-32 rounded-[35px] bg-violet-500/10 flex items-center justify-center shadow-[0_0_60px_rgba(139,92,246,0.45)]">

                  <FaBolt className="text-5xl md:text-6xl text-white" />

                </div>

              </div>

            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 px-6 md:px-8 pb-8">

              {[
                {
                  icon: <FaUsers />,
                  title: "Students",
                  value: "2,847",
                  color: "from-violet-500 to-purple-600"
                },
                {
                  icon: <FaBook />,
                  title: "Courses",
                  value: "156",
                  color: "from-cyan-400 to-blue-500"
                },
                {
                  icon: <FaClipboardList />,
                  title: "Assignments",
                  value: "89",
                  color: "from-pink-500 to-fuchsia-500"
                },
                {
                  icon: <FaMoneyBillWave />,
                  title: "Revenue",
                  value: "$24,560",
                  color: "from-orange-400 to-yellow-500"
                }
              ].map((item, i) => (

                <motion.div
                  key={i}
                  whileHover={{
                    y: -10,
                    scale: 1.03
                  }}
                  className="rounded-[28px] bg-[#0d1022] border border-white/5 p-7"
                >

                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center text-white text-3xl mb-8`}>

                    {item.icon}

                  </div>

                  <p className="text-white/40 text-lg">
                    {item.title}
                  </p>

                  <h3 className="text-4xl md:text-5xl font-black text-white mt-4">
                    {item.value}
                  </h3>

                </motion.div>

              ))}

            </div>

            <div className="grid lg:grid-cols-2 gap-8 px-6 md:px-8 pb-10">

              <div className="rounded-[35px] bg-[#0d1022] border border-white/5 p-8">

                <div className="flex items-center justify-between mb-10">

                  <h3 className="text-3xl md:text-4xl font-black text-white">
                    System Overview
                  </h3>

                  <button className="bg-[#14152a] text-white/60 px-5 py-3 rounded-xl">
                    This Month
                  </button>

                </div>

                <div className="h-[300px] rounded-[30px] bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 flex items-end p-8 gap-4 overflow-hidden">

                  {[40, 55, 48, 70, 62, 88, 75, 100].map((h, i) => (

                    <motion.div
                      key={i}
                      initial={{
                        height: 0
                      }}
                      whileInView={{
                        height: `${h}%`
                      }}
                      transition={{
                        duration: 1,
                        delay: i * 0.1
                      }}
                      className="flex-1 rounded-t-full bg-gradient-to-t from-violet-500 to-pink-500"
                    />

                  ))}

                </div>

              </div>

              <div className="rounded-[35px] bg-[#0d1022] border border-white/5 p-8">

                <div className="flex items-center justify-between mb-10">

                  <h3 className="text-3xl md:text-4xl font-black text-white">
                    Recent Activity
                  </h3>

                  <button className="text-white/50">
                    View All
                  </button>

                </div>

                <div className="space-y-6">

                  {[
                    "New student registered",
                    "Assignment submitted",
                    "Course updated",
                    "Attendance marked",
                    "Fee payment received"
                  ].map((item, i) => (

                    <motion.div
                      key={i}
                      whileHover={{
                        x: 10
                      }}
                      className="flex items-center gap-5 rounded-2xl bg-[#12152a] p-5"
                    >

                      <div className="w-14 h-14 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-400">

                        <FaBolt />

                      </div>

                      <div>

                        <h4 className="text-white text-lg md:text-xl font-semibold">
                          {item}
                        </h4>

                        <p className="text-white/40">
                          2 minutes ago
                        </p>

                      </div>

                    </motion.div>

                  ))}

                </div>

              </div>

            </div>

          </div>

        </motion.div>

      </section>
<section className="relative z-20 px-8 py-40 overflow-hidden">

  <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-violet-400/20 blur-[140px] rounded-full" />

  <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-orange-400/20 blur-[140px] rounded-full" />

  <div className="max-w-7xl mx-auto">

    <motion.div
      initial={{
        opacity: 0,
        y: 80
      }}
      whileInView={{
        opacity: 1,
        y: 0
      }}
      transition={{
        duration: 1
      }}
      viewport={{
        once: true
      }}
      className="text-center mb-28"
    >

      <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/60 backdrop-blur-xl border border-white/50 shadow-xl mb-10">

        <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse" />

        <span className="uppercase tracking-[0.3em] text-sm font-bold text-black/70">
          PLATFORM FEATURES
        </span>

      </div>

      <h2 className="text-6xl md:text-[140px] leading-[0.82] font-black tracking-[-0.08em]">

        EXPERIENCE
        <br />

        THE FUTURE

      </h2>

      <p className="mt-10 text-2xl text-black/50 max-w-4xl mx-auto leading-relaxed">

        EventSphere combines AI systems, realtime infrastructure,
        immersive dashboards and futuristic interactions into
        one unified ecosystem.

      </p>

    </motion.div>

    <div className="grid lg:grid-cols-3 gap-10">

      {[
        {
          icon: <FaShieldAlt />,
          title: "Ultra Secure",
          desc: "Enterprise-grade infrastructure with protected authentication and encrypted systems.",
          gradient: "from-orange-500 via-pink-500 to-red-500",
          glow: "shadow-orange-500/20"
        },
        {
          icon: <FaQrcode />,
          title: "Realtime Access",
          desc: "Smart QR systems with instant attendance tracking and live participant monitoring.",
          gradient: "from-cyan-400 via-blue-500 to-indigo-600",
          glow: "shadow-cyan-500/20"
        },
        {
          icon: <FaUsers />,
          title: "Community First",
          desc: "Connect organizers, students and sponsors through immersive digital experiences.",
          gradient: "from-violet-500 via-purple-600 to-fuchsia-600",
          glow: "shadow-violet-500/20"
        }
      ].map((card, i) => (

        <motion.div
          key={i}
          initial={{
            opacity: 0,
            y: 100
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.8,
            delay: i * 0.15
          }}
          viewport={{
            once: true
          }}
          whileHover={{
            y: -20,
            rotateX: 8,
            rotateY: 8,
            scale: 1.03
          }}
          className={`group relative rounded-[45px] p-[1px] bg-gradient-to-br ${card.gradient} ${card.glow} shadow-[0_30px_100px_rgba(0,0,0,0.15)]`}
        >

          <div className="relative h-full rounded-[45px] bg-white/70 backdrop-blur-2xl p-10 overflow-hidden">

            <div className={`absolute top-[-100px] right-[-100px] w-[250px] h-[250px] rounded-full blur-[100px] opacity-20 bg-gradient-to-br ${card.gradient}`} />

            <motion.div
              whileHover={{
                rotate: 12,
                scale: 1.1
              }}
              className={`w-24 h-24 rounded-[30px] bg-gradient-to-br ${card.gradient} flex items-center justify-center text-5xl text-white shadow-2xl mb-12`}
            >

              {card.icon}

            </motion.div>

            <h3 className="text-5xl font-black tracking-[-0.04em] text-black leading-tight">

              {card.title}

            </h3>

            <p className="mt-8 text-black/60 text-xl leading-relaxed">

              {card.desc}

            </p>

            <motion.div
              whileHover={{
                x: 10
              }}
              className="mt-12 flex items-center gap-4 text-black font-bold text-lg"
            >

              Explore Feature

              <FaArrowRight />

            </motion.div>

            <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-700 bg-gradient-to-r from-transparent via-black/40 to-transparent" />

          </div>

        </motion.div>

      ))}

    </div>

    <motion.div
      initial={{
        opacity: 0,
        y: 80
      }}
      whileInView={{
        opacity: 1,
        y: 0
      }}
      transition={{
        duration: 1
      }}
      viewport={{
        once: true
      }}
      className="mt-32 rounded-[50px] bg-black text-white overflow-hidden relative"
    >

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.35),transparent_40%)]" />

      <div className="relative z-10 p-14 md:p-20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-14">

        <div>

          <p className="uppercase tracking-[0.3em] text-sm text-white/50 mb-6">
            NEXT GENERATION PLATFORM
          </p>

          <h2 className="text-6xl md:text-8xl leading-[0.85] font-black tracking-[-0.06em]">

            One Platform.
            <br />

            Infinite Possibilities.

          </h2>

          <p className="mt-8 text-2xl text-white/60 max-w-3xl leading-relaxed">

            Manage events, students, analytics,
            attendance and AI workflows with
            a cinematic next-generation interface.

          </p>

        </div>

        <motion.a
          href="/register"
          whileHover={{
            scale: 1.05,
            y: -5
          }}
          whileTap={{
            scale: 0.96
          }}
          className="shrink-0 px-12 py-7 rounded-2xl bg-white text-black font-bold text-xl flex items-center gap-4 shadow-[0_20px_60px_rgba(255,255,255,0.15)]"
        >

          Launch Now

          <FaArrowRight />

        </motion.a>

      </div>

    </motion.div>

  </div>

</section>

  <footer className="relative z-20 mt-20 overflow-hidden rounded-t-[50px] bg-black">

  <div className="absolute top-[-120px] left-[-80px] w-[300px] h-[300px] bg-violet-500/20 blur-[120px] rounded-full" />

  <div className="absolute bottom-[-120px] right-[-80px] w-[300px] h-[300px] bg-orange-500/20 blur-[120px] rounded-full" />

  <div className="relative z-10 max-w-7xl mx-auto px-8 py-14 flex flex-col md:flex-row items-center justify-between gap-8">

    <div>

      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-xl mb-5">

        <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />

        <span className="uppercase tracking-[0.25em] text-xs font-semibold text-white/70">
          EVENTSPHERE
        </span>

      </div>

      <h2 className="text-4xl md:text-6xl leading-[0.9] font-black tracking-[-0.06em] text-white">

        BUILD
        <br />

        WITHOUT LIMITS

      </h2>

    </div>

    <motion.a
      href="/register"
      whileHover={{
        scale: 1.05,
        y: -4
      }}
      whileTap={{
        scale: 0.96
      }}
      className="inline-flex items-center gap-4 px-8 py-5 rounded-2xl bg-white text-black text-lg font-bold shadow-[0_20px_60px_rgba(255,255,255,0.12)]"
    >

      Launch Now

      <FaArrowRight />

    </motion.a>

  </div>

</footer>
    </div>

  )

}

export default Home