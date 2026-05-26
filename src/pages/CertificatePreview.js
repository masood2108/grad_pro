import {
  FaAward,
  FaCheckCircle,
  FaQrcode
} from "react-icons/fa"

import {
  motion
} from "framer-motion"

function CertificatePreview() {

  const studentName =
  "Masood Hussain"

  const eventName =
  "AI Innovation Summit 2026"

  const certificateId =
  "EVS-2026-X82KD9"

  const issueDate =
  "26 May 2026"

  return (

    <div className="min-h-screen bg-[#f6efe7] flex items-center justify-center p-6 overflow-hidden relative">


      <div className="absolute top-[-200px] left-[-120px] w-[500px] h-[500px] bg-violet-300/20 blur-[140px] rounded-full" />

      <div className="absolute bottom-[-200px] right-[-120px] w-[500px] h-[500px] bg-orange-300/20 blur-[140px] rounded-full" />


      <motion.div

        initial={{
          opacity:0,
          scale:0.92,
          y:50
        }}

        animate={{
          opacity:1,
          scale:1,
          y:0
        }}

        transition={{
          duration:0.8
        }}

        className="relative w-full max-w-[1400px] rounded-[50px] bg-white border border-black/5 overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.08)]"

      >


        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-orange-400 via-violet-500 to-cyan-400" />


        <div className="p-10 md:p-20 relative z-10">


          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">

            <div>

              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-violet-100 text-violet-700 font-black">

                <FaAward />

                EVENTSPHERE LMS
              </div>

              <h1 className="text-[60px] md:text-[110px] leading-[0.85] tracking-[-0.08em] font-black mt-8">

                Certificate
                <br />

                of Achievement

              </h1>

            </div>

            <div className="w-40 h-40 rounded-[40px] bg-black text-white flex items-center justify-center shadow-[0_30px_80px_rgba(0,0,0,0.15)]">

              <FaCheckCircle className="text-7xl" />

            </div>

          </div>


          <div className="mt-20">

            <p className="uppercase tracking-[0.35em] text-black/35 text-sm font-black">

              THIS CERTIFICATE IS PRESENTED TO
            </p>

            <h1 className="mt-8 text-[55px] md:text-[95px] leading-[0.9] tracking-[-0.08em] font-black text-violet-700">

              {studentName}

            </h1>

            <p className="mt-10 text-2xl md:text-4xl text-black/55 leading-relaxed max-w-5xl">

              For successfully participating and completing

              <span className="font-black text-black">
                {" "}
                {eventName}
              </span>

              {" "}organized by EventSphere LMS Platform.

            </p>

          </div>


          <div className="mt-24 grid grid-cols-1 lg:grid-cols-3 gap-10">


            <div className="rounded-[35px] bg-[#faf7f3] border border-black/5 p-8">

              <p className="uppercase tracking-[0.25em] text-black/35 text-xs font-black">

                Issue Date
              </p>

              <h1 className="text-4xl font-black mt-5">

                {issueDate}
              </h1>

            </div>


            <div className="rounded-[35px] bg-[#faf7f3] border border-black/5 p-8">

              <p className="uppercase tracking-[0.25em] text-black/35 text-xs font-black">

                Certificate ID
              </p>

              <h1 className="text-3xl font-black mt-5 break-all">

                {certificateId}
              </h1>

            </div>


            <div className="rounded-[35px] bg-black text-white p-8 flex flex-col items-center justify-center">

              <FaQrcode className="text-7xl" />

              <p className="mt-5 uppercase tracking-[0.25em] text-xs text-white/50 font-black">

                Verification QR
              </p>

            </div>

          </div>


          <div className="mt-24 grid md:grid-cols-2 gap-16">

            <div>

              <div className="h-[2px] bg-black w-full" />

              <h1 className="mt-5 text-3xl font-black">

                Event Organizer
              </h1>

              <p className="text-black/45 mt-2">

                EventSphere LMS
              </p>

            </div>

            <div>

              <div className="h-[2px] bg-black w-full" />

              <h1 className="mt-5 text-3xl font-black">

                Director
              </h1>

              <p className="text-black/45 mt-2">

                Academic Affairs
              </p>

            </div>

          </div>

        </div>

      </motion.div>

    </div>

  )

}

export default CertificatePreview