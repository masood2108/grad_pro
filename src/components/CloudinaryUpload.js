import { useState, useRef } from "react"

import Sidebar from "./Sidebar"
import Navbar from "./Navbar"

import {

  FaCloudUploadAlt,
  FaImage,
  FaCheckCircle,
  FaSpinner,
  FaLink,
  FaCalendarAlt,
  FaCertificate,
  FaUsers,
  FaArrowRight

} from "react-icons/fa"

function CloudinaryUpload() {

  const [imageUrl, setImageUrl] = useState("")

  const [loading, setLoading] = useState(false)

  const [dragActive, setDragActive] = useState(false)

  const [fileDetails, setFileDetails] = useState(null)

  const fileInputRef = useRef(null)

  const handleDrag = (e) => {

    e.preventDefault()

    e.stopPropagation()

    if (
      e.type === "dragenter" ||
      e.type === "dragover"
    ){

      setDragActive(true)

    }

    else if(e.type === "dragleave"){

      setDragActive(false)

    }

  }

  const handleDrop = async (e) => {

    e.preventDefault()

    e.stopPropagation()

    setDragActive(false)

    if (
      e.dataTransfer.files &&
      e.dataTransfer.files[0]
    ){

      const file = e.dataTransfer.files[0]

      setFileDetails({

        name:file.name,

        size:(file.size / 1024 / 1024).toFixed(2),

        type:file.type

      })

      await performUpload(file)

    }

  }

  const handleFileChange = async (e) => {

    const file = e.target.files[0]

    if(!file) return

    setFileDetails({

      name:file.name,

      size:(file.size / 1024 / 1024).toFixed(2),

      type:file.type

    })

    await performUpload(file)

  }

  const performUpload = async (file) => {

    setLoading(true)

    try{

      const formData = new FormData()

      formData.append("file", file)

      formData.append(
        "upload_preset",
        "99dxxxx"
      )

      const response = await fetch(

        "https://api.cloudinary.com/v1_1/dvic2uies/image/upload",

        {
          method:"POST",
          body:formData
        }

      )

      const data = await response.json()

      if(data.secure_url){

        setImageUrl(data.secure_url)

        alert("Asset Uploaded Successfully")

      }

      else{

        alert("Upload Failed")

      }

    }

    catch(error){

      console.log(error)

      alert("Upload Failed")

    }

    setLoading(false)

  }

  return (

    <div className="flex bg-[#030014] text-zinc-100 min-h-screen relative overflow-hidden font-sans">

      {/* BACKGROUND */}

      <div className="absolute top-[10%] left-[20%] w-[50%] h-[50%] radial-glow-violet pointer-events-none z-0 opacity-40" />

      <div className="absolute bottom-[10%] right-[10%] w-[50%] h-[50%] radial-glow-cyan pointer-events-none z-0 opacity-40" />

      <div className="absolute inset-0 tech-grid opacity-20 pointer-events-none z-0" />

      {/* SIDEBAR */}

      <Sidebar />

      {/* MAIN */}

      <div className="flex-1 p-8 overflow-y-auto max-h-screen relative z-10">

        <Navbar />

        {/* HERO */}

        <div className="glass-panel rounded-3xl border border-white/[0.05] p-8 mb-8 relative overflow-hidden">

          <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-purple-500/10 blur-3xl rounded-full" />

          <div className="relative z-10">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold tracking-wider mb-5">

              <FaCloudUploadAlt />

              EVENT ASSET MANAGEMENT

            </div>

            <h1 className="text-4xl font-extrabold leading-tight">

              Upload Event Assets
              <span className="block text-gradient-primary mt-2">

                Posters, Certificates & Media

              </span>

            </h1>

            <p className="text-zinc-400 mt-6 max-w-3xl text-lg leading-relaxed">

              Manage hackathon posters,
              sponsor logos, event banners,
              volunteer media, certificates,
              and college event assets through
              the centralized EventSphere cloud.

            </p>

          </div>

        </div>

        {/* GRID */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT */}

          <div className="lg:col-span-2">

            <div className="glass-panel p-8 rounded-3xl border border-white/[0.05]">

              <div className="mb-8">

                <h1 className="text-2xl font-bold">
                  Upload Center
                </h1>

                <p className="text-zinc-500 mt-2 text-sm">

                  Drag & drop event posters,
                  sponsor assets, and certificates.

                </p>

              </div>

              {/* DROPZONE */}

              <div

                onDragEnter={handleDrag}

                onDragOver={handleDrag}

                onDragLeave={handleDrag}

                onDrop={handleDrop}

                onClick={()=>fileInputRef.current.click()}

                className={`

                  border-2 border-dashed rounded-3xl
                  p-10 min-h-[320px]
                  flex flex-col items-center justify-center
                  cursor-pointer transition-all relative overflow-hidden

                  ${
                    dragActive

                    ?

                    "border-purple-500 bg-purple-500/5"

                    :

                    "border-white/[0.08] bg-zinc-950/30 hover:border-purple-500/40"
                  }

                `}

              >

                {
                  dragActive &&

                  <div className="absolute inset-0 radial-glow-violet opacity-20 animate-pulse" />
                }

                <input

                  ref={fileInputRef}

                  type="file"

                  onChange={handleFileChange}

                  className="hidden"

                  accept="image/*"

                />

                <div className="w-20 h-20 rounded-3xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-4xl text-purple-400 mb-6">

                  <FaCloudUploadAlt className={loading ? "animate-bounce" : ""} />

                </div>

                <h1 className="text-xl font-bold text-center">

                  {
                    dragActive

                    ?

                    "Drop Your Assets Here"

                    :

                    "Drag & Drop Event Assets"
                  }

                </h1>

                <p className="text-zinc-500 text-sm text-center mt-4 max-w-md leading-relaxed">

                  Upload hackathon posters,
                  workshop banners,
                  certificates,
                  sponsor logos,
                  and promotional media.

                </p>

                <button className="mt-8 bg-purple-600 px-6 py-3 rounded-xl font-semibold">

                  Browse Files

                </button>

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div className="space-y-6">

            {/* PREVIEW */}

            <div className="glass-panel p-6 rounded-3xl border border-white/[0.05]">

              <div className="flex items-center gap-2 mb-6">

                <FaImage className="text-purple-400" />

                <h1 className="text-lg font-bold">

                  Asset Preview

                </h1>

              </div>

              {
                loading

                ?

                <div className="py-16 flex flex-col items-center justify-center">

                  <FaSpinner className="animate-spin text-4xl text-purple-400 mb-4" />

                  <p className="text-zinc-500 text-sm">

                    Uploading Asset...

                  </p>

                </div>

                :

                imageUrl

                ?

                <div className="space-y-5">

                  <div className="rounded-2xl overflow-hidden border border-white/[0.05]">

                    <img

                      src={imageUrl}

                      alt=""

                      className="w-full h-[240px] object-cover"

                    />

                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-3">

                    <FaCheckCircle className="text-emerald-400" />

                    <div>

                      <h1 className="font-bold text-emerald-300">

                        Upload Successful

                      </h1>

                      <p className="text-xs text-zinc-500 mt-1">

                        Asset synced with Cloudinary CDN

                      </p>

                    </div>

                  </div>

                  {
                    fileDetails &&

                    <div className="space-y-3">

                      <div className="bg-zinc-900/60 p-4 rounded-2xl border border-white/[0.03]">

                        <span className="text-zinc-500 text-xs uppercase">

                          File Name

                        </span>

                        <h1 className="text-sm font-bold mt-1 break-all">

                          {fileDetails.name}

                        </h1>

                      </div>

                      <div className="grid grid-cols-2 gap-3">

                        <div className="bg-zinc-900/60 p-4 rounded-2xl border border-white/[0.03]">

                          <span className="text-zinc-500 text-xs uppercase">

                            Size

                          </span>

                          <h1 className="text-sm font-bold mt-1">

                            {fileDetails.size} MB

                          </h1>

                        </div>

                        <div className="bg-zinc-900/60 p-4 rounded-2xl border border-white/[0.03]">

                          <span className="text-zinc-500 text-xs uppercase">

                            Type

                          </span>

                          <h1 className="text-sm font-bold mt-1">

                            Image

                          </h1>

                        </div>

                      </div>

                    </div>
                  }

                  <a

                    href={imageUrl}

                    target="_blank"

                    rel="noreferrer"

                    className="flex items-center justify-center gap-3 bg-purple-600/10 border border-purple-500/20 hover:bg-purple-600/20 text-purple-300 py-4 rounded-2xl font-semibold transition-all"

                  >

                    <FaLink />

                    Open Asset URL

                    <FaArrowRight className="text-xs" />

                  </a>

                </div>

                :

                <div className="py-16 text-center">

                  <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/[0.05] flex items-center justify-center mx-auto text-zinc-500 text-2xl mb-5">

                    <FaImage />

                  </div>

                  <h1 className="font-bold text-zinc-300">

                    No Assets Uploaded

                  </h1>

                  <p className="text-zinc-500 text-sm mt-3 leading-relaxed">

                    Upload posters,
                    certificates,
                    banners,
                    and media assets.

                  </p>

                </div>
              }

            </div>

            {/* QUICK MODULES */}

            <div className="glass-panel p-6 rounded-3xl border border-white/[0.05]">

              <h1 className="text-lg font-bold mb-6">

                Asset Categories

              </h1>

              <div className="space-y-4">

                <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/[0.03] flex items-center gap-4">

                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">

                    <FaCalendarAlt />

                  </div>

                  <div>

                    <h1 className="font-bold">
                      Event Posters
                    </h1>

                    <p className="text-zinc-500 text-xs mt-1">
                      Hackathons & Workshops
                    </p>

                  </div>

                </div>

                <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/[0.03] flex items-center gap-4">

                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">

                    <FaUsers />

                  </div>

                  <div>

                    <h1 className="font-bold">
                      Volunteer Media
                    </h1>

                    <p className="text-zinc-500 text-xs mt-1">
                      Team & Event Photos
                    </p>

                  </div>

                </div>

                <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/[0.03] flex items-center gap-4">

                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">

                    <FaCertificate />

                  </div>

                  <div>

                    <h1 className="font-bold">
                      Certificates
                    </h1>

                    <p className="text-zinc-500 text-xs mt-1">
                      Participation & Winners
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  )
}

export default CloudinaryUpload