/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"

import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  getDoc,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore"
import {
  db,
  auth
} from "../firebase/firebase"

import MainLayout from "../layouts/MainLayout"

import html2canvas from "html2canvas"
import jsPDF from "jspdf"

import {
  FaCertificate,
  FaSearch,
  FaCheckCircle,
  FaDownload,
  FaAward,
  FaCalendarAlt,
  FaPlus,
  FaTimes,
  FaLock,
  FaEdit,
  FaTrash,
  FaEnvelope,
  FaBolt,
  FaCrown,
  FaMedal
} from "react-icons/fa"

function Certificates() {

  const [certificates, setCertificates] =
  useState([])

  const [filteredCertificates, setFilteredCertificates] =
  useState([])

  const [loading, setLoading] =
  useState(true)

  const [search, setSearch] =
  useState("")

  const [userRole, setUserRole] =
  useState("student")

  const [showModal, setShowModal] =
  useState(false)

  const [editingCertificate, setEditingCertificate] =
  useState(null)

  const [studentName, setStudentName] =
  useState("")

  const [studentEmail, setStudentEmail] =
  useState("")

  const [eventName, setEventName] =
  useState("")

  const [certificateDate, setCertificateDate] =
  useState("")

  const certificateRef = useRef()

  useEffect(() => {

    const getUserRole = async() => {

      const user =
      auth.currentUser

      if(user){

        const userRef =
        doc(
          db,
          "users",
          user.uid
        )

        const userSnap =
        await getDoc(userRef)

        if(userSnap.exists()){

          setUserRole(
            userSnap.data().role
          )

        }

      }

    }

    getUserRole()

  }, [])

  useEffect(() => {

    const unsubscribe =

      onSnapshot(

        collection(db, "certificates"),

        (snapshot) => {

          const data = []

          snapshot.forEach((doc) => {

            data.push({

              id: doc.id,
              ...doc.data()

            })

          })

          setCertificates(data)

          setLoading(false)

        }

      )

    return () => unsubscribe()

  }, [])

  useEffect(() => {

    let updated = [...certificates]

    if(search){

      updated = updated.filter(

        (certificate) =>

          certificate.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

          certificate.email
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )

      )

    }

    setFilteredCertificates(updated)

  }, [certificates, search])

  const resetForm = () => {

    setStudentName("")
    setStudentEmail("")
    setEventName("")
    setCertificateDate("")
    setEditingCertificate(null)

  }

  const createCertificate = async() => {

    if(
      userRole !== "admin" &&
      userRole !== "faculty"
    ){

      return alert(
        "Only Admin & Faculty can create certificates"
      )

    }

    if(
      !studentName ||
      !studentEmail ||
      !eventName ||
      !certificateDate
    ){

      return alert(
        "Fill all fields"
      )

    }

    try{

      await addDoc(

        collection(
          db,
          "certificates"
        ),

        {
          name:studentName,
          email:studentEmail,
          event:eventName,
          date:certificateDate,
          verified:true,
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

  }

  const updateCertificate = async() => {

    try{

      await updateDoc(

        doc(
          db,
          "certificates",
          editingCertificate.id
        ),

        {
          name:studentName,
          email:studentEmail,
          event:eventName,
          date:certificateDate
        }

      )

      resetForm()

      setShowModal(false)

    }

    catch(error){

      console.log(error)

    }

  }

  const editCertificate = (certificate) => {

    setEditingCertificate(
      certificate
    )

    setStudentName(
      certificate.name
    )

    setStudentEmail(
      certificate.email
    )

    setEventName(
      certificate.event
    )

    setCertificateDate(
      certificate.date
    )

    setShowModal(true)

  }

  const deleteCertificate = async(id) => {

    const confirmDelete =
    window.confirm(
      "Delete this certificate?"
    )

    if(!confirmDelete) return

    try{

      await deleteDoc(

        doc(
          db,
          "certificates",
          id
        )

      )

    }

    catch(error){

      console.log(error)

    }

  }

  const downloadCertificate = async(certificate) => {

    const input = document.getElementById(
      `certificate-${certificate.id}`
    )

    if(!input) return

    const canvas = await html2canvas(
      input,
      {
        scale:2
      }
    )

    const imgData =
    canvas.toDataURL("image/png")

    const pdf = new jsPDF(
      "landscape",
      "px",
      [canvas.width, canvas.height]
    )

    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      canvas.width,
      canvas.height
    )

    pdf.save(
      `${certificate.name}-certificate.pdf`
    )

  }

  return (

    <MainLayout>

      <div className="relative">

        <div className="absolute top-[-200px] right-[-120px] w-[500px] h-[500px] bg-yellow-300/20 blur-[140px] rounded-full pointer-events-none" />

        <div className="absolute bottom-[-200px] left-[-120px] w-[500px] h-[500px] bg-orange-300/20 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative z-10">


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

            className="rounded-[45px] bg-white/75 backdrop-blur-3xl border border-white shadow-[0_20px_80px_rgba(0,0,0,0.05)] overflow-hidden relative"

          >

            <div className="relative z-10 p-10 md:p-14 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">

              <div>

                <p className="uppercase tracking-[0.3em] text-orange-500 text-xs font-black mb-5">

                  DIGITAL CERTIFICATE MANAGEMENT

                </p>

                <h1 className="text-6xl md:text-8xl leading-[0.9] tracking-[-0.08em] font-black">

                  Certificates
                  <br />

                  Portal

                </h1>

                <p className="mt-8 text-2xl text-black/45 leading-relaxed max-w-3xl">

                  Generate premium realtime
                  certificates with automatic
                  PDF export.

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

                className="hidden lg:flex w-40 h-40 rounded-[40px] bg-black text-white items-center justify-center"

              >

                <FaAward className="text-6xl" />

              </motion.div>

            </div>

          </motion.div>


          <div className="flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between mt-8">

            <div className="relative flex-1">

              <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-black/35 text-lg" />

              <input

                type="text"

                placeholder="Search certificates..."

                value={search}

                onChange={(e)=>
                  setSearch(e.target.value)
                }

                className="w-full pl-16 pr-6 h-[68px] rounded-[28px] bg-white border border-black/5 outline-none text-black text-lg"

              />

            </div>

            {

              (
                userRole === "admin" ||

                userRole === "faculty"

              ) &&

              <button

                onClick={() => {

                  resetForm()
                  setShowModal(true)

                }}

                className="px-8 h-[68px] rounded-[28px] bg-black text-white font-black flex items-center gap-4"

              >

                <FaPlus />

                Generate Certificate

              </button>

            }

          </div>


          <div className="mt-10">

            {

              loading

              ?

              <div className="h-[400px] flex items-center justify-center">

                <h1 className="text-5xl font-black">

                  Loading Certificates...

                </h1>

              </div>

              :

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {

                  filteredCertificates.map((certificate,index)=>(

                    <motion.div

                      key={certificate.id}

                      initial={{
                        opacity:0,
                        y:30
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

                      className="rounded-[40px] overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.08)] bg-white border border-black/5"

                    >

                      <div
                        id={`certificate-${certificate.id}`}
                        className="relative bg-white overflow-hidden"
                      >

                        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-yellow-400 via-orange-400 to-violet-500" />

                        <div className="relative z-10 p-8">

                          <div className="flex items-center justify-between">

                            <div>

                              <p className="uppercase tracking-[0.28em] text-orange-500 text-xs font-black">

                                EVENTSPHERE LMS

                              </p>

                              <h1 className="text-5xl font-black tracking-[-0.08em] mt-5">

                                Certificate
                                <br />
                                of Achievement

                              </h1>

                            </div>

                            <div className="w-24 h-24 rounded-[30px] bg-black text-white flex items-center justify-center text-4xl">

                              <FaAward />

                            </div>

                          </div>

                          <div className="mt-14">

                            <p className="uppercase tracking-[0.25em] text-xs font-black text-black/35">

                              PRESENTED TO

                            </p>

                            <h1 className="text-6xl leading-[0.9] tracking-[-0.08em] font-black text-violet-700 mt-6">

                              {certificate.name}

                            </h1>

                            <p className="mt-8 text-2xl text-black/55 leading-relaxed">

                              For successfully completing

                              <span className="font-black text-black">
                                {" "}
                                {certificate.event}
                              </span>

                            </p>

                          </div>

                          <div className="grid grid-cols-2 gap-5 mt-14">

                            <div className="rounded-[25px] bg-[#faf7f3] border border-black/5 p-5">

                              <p className="uppercase tracking-[0.2em] text-xs font-black text-black/35">

                                Issue Date

                              </p>

                              <h1 className="text-2xl font-black mt-4">

                                {certificate.date}

                              </h1>

                            </div>

                            <div className="rounded-[25px] bg-black text-white p-5">

                              <p className="uppercase tracking-[0.2em] text-xs font-black text-white/35">

                                Verification

                              </p>

                              <div className="flex items-center gap-3 mt-4">

                                <FaCheckCircle className="text-green-400" />

                                <h1 className="text-2xl font-black">

                                  Verified

                                </h1>

                              </div>

                            </div>

                          </div>

                        </div>

                      </div>

                      <div className="p-6 border-t border-black/5">

                        <button

                          onClick={() =>
                            downloadCertificate(certificate)
                          }

                          className="w-full h-[62px] rounded-[24px] bg-black text-white font-black text-lg flex items-center justify-center gap-3"

                        >

                          <FaDownload />

                          Download PDF

                        </button>
                
                      </div>

                    </motion.div>

                  ))

                }

              </div>

            }

          </div>

        </div>

      </div>
{
  showModal &&

  <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[9999] flex items-center justify-center p-4">

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

      className="w-full max-w-[520px] rounded-[38px] bg-white shadow-[0_40px_120px_rgba(0,0,0,0.12)] border border-black/5 overflow-hidden"

    >


      <div className="px-8 pt-8 pb-6 border-b border-black/5 flex items-start justify-between">

        <div>

          <p className="uppercase tracking-[0.28em] text-orange-500 text-[10px] font-black mb-3">

            CERTIFICATE MANAGEMENT

          </p>

          <h1 className="text-[48px] leading-[0.9] tracking-[-0.08em] font-black text-black">

            {

              editingCertificate

              ?

              "Edit Certificate"

              :

              "Generate Certificate"

            }

          </h1>

        </div>

        <button

          onClick={()=>
            setShowModal(false)
          }

          className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center"

        >

          <FaTimes />

        </button>

      </div>


      <div className="p-8 space-y-5">

        <input

          value={studentName}

          onChange={(e)=>
            setStudentName(e.target.value)
          }

          placeholder="Student Name"

          className="w-full h-[58px] px-5 rounded-[20px] bg-[#f7f4f1] border border-black/5 outline-none text-black"

        />

        <input

          value={studentEmail}

          onChange={(e)=>
            setStudentEmail(e.target.value)
          }

          placeholder="Student Email"

          type="email"

          className="w-full h-[58px] px-5 rounded-[20px] bg-[#f7f4f1] border border-black/5 outline-none text-black"

        />

        <input

          value={eventName}

          onChange={(e)=>
            setEventName(e.target.value)
          }

          placeholder="Event Name"

          className="w-full h-[58px] px-5 rounded-[20px] bg-[#f7f4f1] border border-black/5 outline-none text-black"

        />

        <input

          type="date"

          value={certificateDate}

          onChange={(e)=>
            setCertificateDate(e.target.value)
          }

          className="w-full h-[58px] px-5 rounded-[20px] bg-[#f7f4f1] border border-black/5 outline-none text-black"

        />

        <motion.button

          whileHover={{
            scale:1.02
          }}

          whileTap={{
            scale:0.98
          }}

          onClick={

            editingCertificate

            ?

            updateCertificate

            :

            createCertificate

          }

          className="w-full h-[62px] rounded-[22px] bg-black text-white font-black text-lg shadow-[0_20px_50px_rgba(0,0,0,0.12)]"

        >

          {

            editingCertificate

            ?

            "Update Certificate"

            :

            "Generate Certificate"

          }

        </motion.button>

      </div>

    </motion.div>

  </div>
}
    </MainLayout>

  )

}

export default Certificates