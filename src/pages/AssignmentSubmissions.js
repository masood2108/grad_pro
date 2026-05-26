/* eslint-disable no-unused-vars */
import {
  useEffect,
  useState
} from "react"

import {
  useParams
} from "react-router-dom"

import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc
} from "firebase/firestore"

import {
  db
} from "../firebase/firebase"

import MainLayout from "../layouts/MainLayout"

import {
  FaFilePdf,
  FaCheckCircle,
  FaUserGraduate,
  FaStar,
  FaDownload,
  FaFire,
  FaClock,
  FaChartLine,
  FaMedal,
  FaBolt,
  FaPaperPlane
} from "react-icons/fa"

import {
  motion
} from "framer-motion"

function AssignmentSubmissions() {

  const { id } = useParams()

  const [submissions, setSubmissions] =
  useState([])

  const [loading, setLoading] =
  useState(true)

  const [feedbacks, setFeedbacks] =
  useState({})

  useEffect(() => {

    const q = query(

      collection(db, "submissions"),

      where(
        "assignmentId",
        "==",
        id
      )

    )

    const unsubscribe =

    onSnapshot(q, (snapshot) => {

      const data = []

      snapshot.forEach((doc) => {

        data.push({

          id:doc.id,
          ...doc.data()

        })

      })

      setSubmissions(data)

      setLoading(false)

    })

    return () => unsubscribe()

  }, [id])

  const giveMarks = async(
    submissionId,
    marks,
    feedback
  ) => {

    try{

      await updateDoc(

        doc(
          db,
          "submissions",
          submissionId
        ),

        {
          marks,
          feedback:
          feedback ||
          "Reviewed Successfully"
        }

      )

    }

    catch(error){

      console.log(error)

    }

  }

  const averageMarks =

  submissions.length > 0

  ?

  Math.round(

    submissions.reduce(

      (acc,curr)=>

        acc + (curr.marks || 0),

      0

    ) / submissions.length

  )

  :

  0

  const reviewedCount =

  submissions.filter(

    item => item.marks !== null

  ).length

  return (

          <MainLayout>


        <div className="absolute top-[-180px] right-[-120px] w-[500px] h-[500px] bg-violet-300/20 blur-[140px] rounded-full pointer-events-none" />

        <div className="absolute bottom-[-180px] left-[-120px] w-[500px] h-[500px] bg-orange-300/20 blur-[140px] rounded-full pointer-events-none" />

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

            className="mt-6 rounded-[45px] bg-white/70 backdrop-blur-3xl border border-white shadow-[0_20px_80px_rgba(0,0,0,0.05)] overflow-hidden relative"

          >

            <div className="absolute top-[-120px] right-[-100px] w-[300px] h-[300px] bg-violet-300/20 blur-[120px] rounded-full" />

            <div className="absolute bottom-[-120px] left-[-100px] w-[300px] h-[300px] bg-orange-300/20 blur-[120px] rounded-full" />

            <div className="relative z-10 p-10 md:p-14 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">

              <div>

                <p className="uppercase tracking-[0.3em] text-orange-500 text-xs font-black mb-5">

                  TEACHER REVIEW PANEL

                </p>

                <h1 className="text-6xl md:text-8xl leading-[0.9] tracking-[-0.08em] font-black">

                  Assignment
                  <br />
                  Reviews

                </h1>

                <p className="mt-8 text-2xl text-black/45 leading-relaxed max-w-3xl">

                  Review submissions,
                  assign marks,
                  provide realtime feedback
                  and track student performance.

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

                <FaMedal className="text-6xl" />

              </motion.div>

            </div>

          </motion.div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 mb-10">

            <StatCard
              title="Total Submissions"
              value={submissions.length}
              icon={<FaUserGraduate />}
              color="purple"
            />

            <StatCard
              title="Reviewed"
              value={reviewedCount}
              icon={<FaCheckCircle />}
              color="emerald"
            />

            <StatCard
              title="Average Marks"
              value={`${averageMarks}%`}
              icon={<FaChartLine />}
              color="orange"
            />

          </div>


          {

            loading

            ?

            <div className="h-[400px] flex items-center justify-center">

              <h1 className="text-5xl font-black">

                Loading Submissions...

              </h1>

            </div>

            :

            submissions.length === 0

            ?

            <div className="h-[400px] flex items-center justify-center">

              <h1 className="text-5xl font-black">

                No Submissions Found

              </h1>

            </div>

            :

            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8">

              {

                submissions.map((submission,index)=>(

                  <motion.div

                    key={submission.id}

                    initial={{
                      opacity:0,
                      y:20
                    }}

                    animate={{
                      opacity:1,
                      y:0
                    }}

                    transition={{
                      delay:index * 0.08
                    }}

                    whileHover={{
                      y:-10
                    }}

                    className="rounded-[38px] bg-white border border-black/5 shadow-[0_25px_80px_rgba(0,0,0,0.05)] overflow-hidden"

                  >


                    <div className="relative p-7 overflow-hidden">

                      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 via-cyan-400 to-orange-400" />

                      <div className="flex items-center justify-between">

                        <div className="w-20 h-20 rounded-[28px] bg-violet-100 text-violet-700 flex items-center justify-center text-3xl">

                          <FaUserGraduate />

                        </div>

                        {

                          submission.marks !== null

                          ?

                          <div className="px-5 py-3 rounded-full bg-emerald-100 text-emerald-700 text-[11px] uppercase tracking-[0.25em] font-black">

                            Reviewed

                          </div>

                          :

                          <div className="px-5 py-3 rounded-full bg-orange-100 text-orange-700 text-[11px] uppercase tracking-[0.25em] font-black">

                            Pending

                          </div>

                        }

                      </div>

                      <h1 className="mt-8 text-[46px] leading-[0.9] tracking-[-0.08em] font-black">

                        {submission.studentName}

                      </h1>

                      <p className="mt-5 text-black/45 text-lg leading-relaxed">

                        {

                          submission.feedback ||

                          "Waiting for faculty review"

                        }

                      </p>

                    </div>


                    <div className="px-7">

                      <div className="rounded-[28px] bg-[#f8f4ef] border border-black/5 p-5 flex items-center justify-between">

                        <div>

                          <p className="uppercase tracking-[0.22em] text-xs font-black text-black/35">

                            Current Marks

                          </p>

                          <h1 className="text-5xl font-black mt-3">

                            {

                              submission.marks ??

                              "--"

                            }

                          </h1>

                        </div>

                        <div className="w-16 h-16 rounded-[22px] bg-black text-white flex items-center justify-center text-2xl">

                          <FaStar />

                        </div>

                      </div>

                    </div>


                    <div className="px-7 mt-6">

                      <motion.a

                        whileHover={{
                          scale:1.02
                        }}

                        whileTap={{
                          scale:0.98
                        }}

                        href={submission.fileUrl + "?fl_attachment=true"}

                        target="_blank"

                        rel="noreferrer"

                        className="w-full h-[62px] rounded-[24px] bg-red-100 text-red-700 font-black flex items-center justify-center gap-4 shadow-lg"

                      >

                        <FaFilePdf />

                        Download PDF

                      </motion.a>

                    </div>


                    <div className="grid grid-cols-4 gap-3 px-7 mt-6">

                      {

                        [60,70,80,100].map((mark)=>(

                          <motion.button

                            key={mark}

                            whileHover={{
                              scale:1.05
                            }}

                            whileTap={{
                              scale:0.95
                            }}

                            onClick={()=>
                              giveMarks(
                                submission.id,
                                mark,
                                `Scored ${mark}%`
                              )
                            }

                            className={`

                              h-[60px]
                              rounded-[22px]
                              font-black
                              text-lg

                              ${mark === 60 && "bg-yellow-100 text-yellow-700"}
                              ${mark === 70 && "bg-cyan-100 text-cyan-700"}
                              ${mark === 80 && "bg-violet-100 text-violet-700"}
                              ${mark === 100 && "bg-emerald-100 text-emerald-700"}

                            `}

                          >

                            {mark}

                          </motion.button>

                        ))

                      }

                    </div>


                    <div className="p-7">

                      <textarea

                        placeholder="Write detailed feedback..."

                        value={
                          feedbacks[submission.id] || ""
                        }

                        onChange={(e)=>

                          setFeedbacks({

                            ...feedbacks,

                            [submission.id]:
                            e.target.value

                          })

                        }

                        rows="4"

                        className="w-full rounded-[24px] bg-[#f8f4ef] border border-black/5 px-5 py-4 outline-none resize-none"

                      />

                      <motion.button

                        whileHover={{
                          scale:1.02
                        }}

                        whileTap={{
                          scale:0.98
                        }}

                        onClick={()=>
                          giveMarks(
                            submission.id,
                            submission.marks || 0,
                            feedbacks[submission.id]
                          )
                        }

                        className="w-full h-[62px] mt-5 rounded-[24px] bg-black text-white font-black text-lg flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.12)]"

                      >

                        Save Feedback

                        <FaPaperPlane />

                      </motion.button>

                    </div>

                  </motion.div>

                ))

              }

            </div>

          }

        </div>

 </MainLayout>

  )

}

function StatCard({

  title,
  value,
  icon,
  color

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

        ${color === "purple" && "bg-gradient-to-r from-violet-500 to-fuchsia-500"}
        ${color === "emerald" && "bg-gradient-to-r from-emerald-500 to-green-400"}
        ${color === "orange" && "bg-gradient-to-r from-orange-500 to-yellow-400"}

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

          ${color === "purple" && "bg-violet-100 text-violet-700"}
          ${color === "emerald" && "bg-emerald-100 text-emerald-700"}
          ${color === "orange" && "bg-orange-100 text-orange-700"}

        `}>

          {icon}

        </div>

      </div>

      <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-sm font-black">

        <FaBolt />

        Live Review

      </div>

    </motion.div>

  )

}

export default AssignmentSubmissions