import { useState } from "react"

import {
  motion,
  AnimatePresence
} from "framer-motion"

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaArrowLeft,
  FaBolt,
  FaSync,
  FaCheck
} from "react-icons/fa"

import {
  createUserWithEmailAndPassword
} from "firebase/auth"

import {
  doc,
  setDoc
} from "firebase/firestore"

import {
  auth,
  db
} from "../firebase/firebase"

import {
  useNavigate,
  Link
} from "react-router-dom"

function Register() {

  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("student")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const registerUser = async (e) => {

    e.preventDefault()

    if (!name || !email || !password) {

      setErrorMsg("Please fill all fields.")
      return

    }

    if (password.length < 6) {

      setErrorMsg("Password must be at least 6 characters.")
      return

    }

    setLoading(true)
    setErrorMsg("")

    try {

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

      const user = userCredential.user

      await setDoc(doc(db, "users", user.uid), {

        uid: user.uid,
        name,
        email,
        role,
        createdAt: new Date()

      })

      navigate("/dashboard", {
        replace: true
      })

    } catch (error) {

      if (error.code === "auth/email-already-in-use") {

        setErrorMsg("This email is already registered.")

      } else if (error.code === "auth/invalid-email") {

        setErrorMsg("Please enter a valid email.")

      } else if (error.code === "auth/weak-password") {

        setErrorMsg("Weak password detected.")

      } else {

        setErrorMsg(error.message)

      }

    } finally {

      setLoading(false)

    }

  }

  return (

    <div className="min-h-screen bg-[#f4ece4] overflow-hidden relative flex items-center justify-center px-6 py-6">

      <div className="absolute top-[-220px] left-[-180px] w-[500px] h-[500px] bg-orange-300/40 blur-[160px] rounded-full" />

      <div className="absolute bottom-[-220px] right-[-180px] w-[500px] h-[500px] bg-violet-300/30 blur-[160px] rounded-full" />

      <motion.button
        whileHover={{
          scale: 1.08,
          x: -2
        }}
        whileTap={{
          scale: 0.94
        }}
        onClick={() => navigate("/")}
        className="absolute top-5 left-5 z-50 w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center shadow-[0_15px_40px_rgba(0,0,0,0.15)]"
      >

        <FaArrowLeft className="text-lg" />

      </motion.button>

      <div className="w-full max-w-[1180px] min-h-[88vh] grid lg:grid-cols-[1.1fr_0.9fr] rounded-[45px] overflow-hidden bg-white/45 backdrop-blur-3xl border border-white/60 shadow-[0_40px_120px_rgba(0,0,0,0.08)]">

        <div className="hidden lg:flex relative overflow-hidden bg-[#faf7f3] p-14 flex-col justify-center">

          <div className="absolute top-[-120px] right-[-120px] w-[320px] h-[320px] bg-violet-300/30 blur-[140px] rounded-full" />

          <div className="absolute bottom-[-120px] left-[-120px] w-[280px] h-[280px] bg-orange-300/30 blur-[140px] rounded-full" />

          <div className="relative z-10">

            <div className="flex items-center gap-4 mb-16">

              <motion.div
                animate={{
                  rotate: [0, 8, -8, 0]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity
                }}
                className="w-16 h-16 rounded-[24px] bg-black flex items-center justify-center shadow-xl"
              >

                <FaBolt className="text-white text-2xl" />

              </motion.div>

              <div>

                <h1 className="text-4xl font-black tracking-tight text-black">
                  EventSphere
                </h1>

                <p className="text-black/40 mt-1 tracking-[0.35em] text-xs font-bold uppercase">
                  LMS PLATFORM
                </p>

              </div>

            </div>

            <h1 className="text-[85px] leading-[0.85] font-black tracking-[-0.08em] text-black">

              JOIN.
              <br />

              CREATE.
              <br />

              GROW.

            </h1>

            <p className="mt-8 text-[20px] text-black/50 leading-relaxed max-w-lg">

              Create your account and access realtime dashboards,
              smart attendance systems and immersive LMS experiences.

            </p>

            <div className="grid grid-cols-2 gap-5 mt-14">

              {[
                "Student Portal",
                "Faculty Access",
                "Realtime Analytics",
                "Admin Control"
              ].map((item, i) => (

                <motion.div
                  key={i}
                  whileHover={{
                    y: -5,
                    scale: 1.02
                  }}
                  className="rounded-[26px] bg-white/80 border border-white shadow-lg p-5"
                >

                  <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center mb-4">

                    <FaBolt />

                  </div>

                  <h3 className="text-lg font-black text-black">
                    {item}
                  </h3>

                </motion.div>

              ))}

            </div>

          </div>

        </div>

        <div className="relative flex items-center justify-center px-8 py-10">

          <motion.div
            initial={{
              opacity: 0,
              y: 40,
              scale: 0.96
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1
            }}
            transition={{
              duration: 0.7
            }}
            className="w-full max-w-[430px]"
          >

            <div className="rounded-[38px] bg-white/80 backdrop-blur-3xl border border-white shadow-[0_25px_80px_rgba(0,0,0,0.08)] p-8 md:p-10">

              <div className="flex lg:hidden items-center justify-center gap-3 mb-8">

                <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center">

                  <FaBolt className="text-white" />

                </div>

                <h1 className="text-3xl font-black text-black">
                  EventSphere
                </h1>

              </div>

              <div className="mb-8">

                <p className="uppercase tracking-[0.28em] text-xs font-bold text-orange-500 mb-4">

                  CREATE ACCOUNT

                </p>

                <h1 className="text-5xl font-black tracking-tight text-black leading-none">

                  Join
                  <br />

                  EventSphere

                </h1>

                <p className="text-black/50 mt-5 text-lg leading-relaxed">

                  Access the complete LMS ecosystem.

                </p>

              </div>

              <AnimatePresence>

                {errorMsg && (

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -10
                    }}
                    animate={{
                      opacity: 1,
                      y: 0
                    }}
                    exit={{
                      opacity: 0,
                      y: -10
                    }}
                    className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-500 text-sm font-semibold"
                  >

                    {errorMsg}

                  </motion.div>

                )}

              </AnimatePresence>

              <form
                onSubmit={registerUser}
                className="space-y-5"
              >

                <div>

                  <label className="block mb-3 text-xs uppercase tracking-[0.25em] font-bold text-black/40">

                    Full Name

                  </label>

                  <div className="relative">

                    <FaUser className="absolute left-5 top-1/2 -translate-y-1/2 text-black/40" />

                    <input
                      type="text"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-14 pr-5 py-4 rounded-2xl bg-white border border-black/5 text-black outline-none focus:border-orange-400 transition"
                    />

                  </div>

                </div>

                <div>

                  <label className="block mb-3 text-xs uppercase tracking-[0.25em] font-bold text-black/40">

                    Email

                  </label>

                  <div className="relative">

                    <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-black/40" />

                    <input
                      type="email"
                      placeholder="name@college.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-14 pr-5 py-4 rounded-2xl bg-white border border-black/5 text-black outline-none focus:border-orange-400 transition"
                    />

                  </div>

                </div>

                <div>

                  <label className="block mb-3 text-xs uppercase tracking-[0.25em] font-bold text-black/40">

                    Password

                  </label>

                  <div className="relative">

                    <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-black/40" />

                    <input
                      type="password"
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-14 pr-5 py-4 rounded-2xl bg-white border border-black/5 text-black outline-none focus:border-orange-400 transition"
                    />

                  </div>

                </div>

                <div>

                  <label className="block mb-3 text-xs uppercase tracking-[0.25em] font-bold text-black/40">

                    Select Role

                  </label>

                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl bg-white border border-black/5 text-black outline-none focus:border-orange-400 transition appearance-none"
                  >

                    <option value="student">
                      Student
                    </option>

                    <option value="faculty">
                      Faculty
                    </option>

                    <option value="parent">
                      Parent
                    </option>

                    <option value="admin">
                      Admin
                    </option>

                  </select>

                </div>

                <div className="flex items-start gap-3">

                  <div className="w-5 h-5 rounded-lg bg-black text-white flex items-center justify-center text-[9px] mt-0.5 flex-shrink-0">

                    <FaCheck />

                  </div>

                  <p className="text-xs text-black/45 leading-relaxed">

                    By creating an account you agree to use EventSphere LMS platform.

                  </p>

                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{
                    scale: 1.02,
                    y: -3
                  }}
                  whileTap={{
                    scale: 0.98
                  }}
                  className="w-full py-4 rounded-2xl bg-black text-white font-bold text-lg flex items-center justify-center gap-3 shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
                >

                  {loading ? (
                    <>
                      <FaSync className="animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <FaBolt />
                      Create Account
                    </>
                  )}

                </motion.button>

              </form>

              <div className="mt-8 pt-6 border-t border-black/5 text-center">

                <span className="text-black/50">
                  Already have an account?
                </span>

                <Link
                  to="/login"
                  className="ml-2 font-black text-orange-500 hover:text-orange-600 transition"
                >

                  Sign In

                </Link>

              </div>

            </div>

          </motion.div>

        </div>

      </div>

    </div>

  )

}

export default Register