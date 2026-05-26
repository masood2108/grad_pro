import { useEffect, useState } from "react"

import {
  Html5QrcodeScanner
} from "html5-qrcode"

import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc
} from "firebase/firestore"

import {
  db
} from "../firebase/firebase"

import {
  motion
} from "framer-motion"

import {
  FaQrcode,
  FaCheckCircle,
  FaTimesCircle,
  FaBolt
} from "react-icons/fa"
import MainLayout from "../layouts/MainLayout"

function AttendanceScanner() {

  const [message, setMessage] =
  useState("Waiting For Scan...")

  const [scanType, setScanType] =
  useState("idle")

  const [studentName, setStudentName] =
  useState("")

  useEffect(() => {

    const scanner =
    new Html5QrcodeScanner(

      "reader",

      {

        qrbox:{
          width:260,
          height:260
        },

        fps:5,

        aspectRatio:1

      },

      false

    )

    const success = async(result)=>{

      try{

        const regQuery =
        await getDocs(

          query(

            collection(
              db,
              "eventRegistrations"
            ),

            where(
              "qrId",
              "==",
              result
            )

          )

        )

        if(regQuery.empty){

          setScanType("error")

          setMessage(
            "Invalid QR Code"
          )

          setStudentName("")

          return

        }

        regQuery.forEach(async(regDoc)=>{

          const data =
          regDoc.data()

          if(data.attendance){

            setScanType("error")

            setMessage(
              "Attendance Already Marked"
            )

            setStudentName(
              data.name
            )

            return
          }

          await updateDoc(

            doc(

              db,
              "eventRegistrations",
              regDoc.id

            ),

            {

              attendance:true,

              scannedAt:
              new Date()
              .toLocaleString()

            }

          )

          setScanType("success")

          setMessage(
            "Attendance Marked"
          )

          setStudentName(
            data.name
          )

        })

      }

      catch(error){

        console.log(error)

        setScanType("error")

        setMessage(
          "Scan Failed"
        )

      }

    }

    const error = ()=>{}

    scanner.render(
      success,
      error
    )

    return ()=>{

      scanner.clear()

    }

  }, [])

  return (
<MainLayout>
    <div className="min-h-screen bg-[#f6efe7] overflow-hidden relative flex items-center justify-center p-6">

      {/* BG */}

      <div className="absolute top-[-200px] left-[-100px] w-[420px] h-[420px] bg-violet-300/20 blur-[140px] rounded-full" />

      <div className="absolute bottom-[-200px] right-[-100px] w-[420px] h-[420px] bg-orange-300/20 blur-[140px] rounded-full" />

      {/* MAIN CARD */}

      <motion.div

        initial={{
          opacity:0,
          scale:0.95,
          y:40
        }}

        animate={{
          opacity:1,
          scale:1,
          y:0
        }}

        className="relative z-10 w-full max-w-5xl rounded-[50px] bg-white/80 backdrop-blur-3xl border border-white shadow-[0_30px_120px_rgba(0,0,0,0.08)] overflow-hidden"

      >

        {/* TOP */}

        <div className="px-10 md:px-16 pt-12 pb-10 border-b border-black/5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">

          <div>

            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-orange-100 text-orange-600 text-[11px] uppercase tracking-[0.28em] font-black">

              <FaBolt />

              SMART EVENT SYSTEM

            </div>

<h1 className="text-black text-6xl md:text-7xl leading-[0.9] tracking-[-0.08em] font-black mt-8">
              QR Attendance
              <br />

              Scanner

            </h1>

            <p className="text-black/45 text-xl mt-6 leading-relaxed max-w-2xl">

              Scan student event QR tickets
              for realtime attendance tracking
              and automated verification.

            </p>

          </div>

          <motion.div

            animate={{
              rotate:[0,6,-6,0],
              y:[0,-10,0]
            }}

            transition={{
              duration:5,
              repeat:Infinity
            }}

            className="hidden lg:flex w-40 h-40 rounded-[40px] bg-black text-white items-center justify-center shadow-[0_30px_80px_rgba(0,0,0,0.18)]"

          >

            <FaQrcode className="text-6xl" />

          </motion.div>

        </div>

        {/* BODY */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-8 md:p-12">

          {/* SCANNER */}

<div className="rounded-[40px] bg-[#f8f4ef] border border-black/5 p-6 shadow-[0_15px_60px_rgba(0,0,0,0.04)] min-h-[620px] flex items-center justify-center">
<div
  id="reader"
  className="w-full"
/>
          </div>

          {/* STATUS */}

          <div className="flex flex-col justify-center">

            <motion.div

              animate={{
                scale:[1,1.03,1]
              }}

              transition={{
                duration:2,
                repeat:Infinity
              }}

              className={`

                rounded-[40px]
                p-10 border

                ${

                  scanType === "success"

                  ?

                  "bg-emerald-50 border-emerald-200"

                  :

                  scanType === "error"

                  ?

                  "bg-rose-50 border-rose-200"

                  :

                  "bg-white border-black/5"

                }

              `}

            >

              <div className={`

                w-24 h-24 rounded-[30px]
                flex items-center justify-center
                text-5xl mb-8

                ${

                  scanType === "success"

                  ?

                  "bg-emerald-500 text-white"

                  :

                  scanType === "error"

                  ?

                  "bg-rose-500 text-white"

                  :

                  "bg-black text-white"

                }

              `}>

                {

                  scanType === "success"

                  ?

                  <FaCheckCircle />

                  :

                  scanType === "error"

                  ?

                  <FaTimesCircle />

                  :

                  <FaQrcode />

                }

              </div>

              <h1 className="text-5xl leading-[1] tracking-[-0.06em] font-black">

                {message}
              </h1>

              {

                studentName &&

                <p className="text-2xl text-black/50 mt-6 font-semibold">

                  Student :
                  {" "}
                  {studentName}

                </p>

              }

              <div className="mt-10 flex items-center gap-4">

                <div className={`

                  w-5 h-5 rounded-full

                  ${

                    scanType === "success"

                    ?

                    "bg-emerald-500"

                    :

                    scanType === "error"

                    ?

                    "bg-rose-500"

                    :

                    "bg-yellow-400"

                  }

                `} />

                <p className="uppercase tracking-[0.25em] text-xs font-black text-black/40">

                  Realtime Scanner Active

                </p>

              </div>

            </motion.div>

          </div>

        </div>

      </motion.div>

    </div>
    </MainLayout>
    

  )

}

export default AttendanceScanner