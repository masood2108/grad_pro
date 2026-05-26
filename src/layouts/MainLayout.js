import { useState, useEffect } from "react"

import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"

import {
  FaBars,
  FaTimes,
  FaBolt
} from "react-icons/fa"

function MainLayout({ children }) {

  const [sidebarOpen, setSidebarOpen] =
  useState(false)

  useEffect(() => {

    if(sidebarOpen){

      document.body.style.overflow = "hidden"

    }

    else{

      document.body.style.overflow = "auto"

    }

    return () => {

      document.body.style.overflow = "auto"

    }

  }, [sidebarOpen])

  return (

    <div className="w-screen min-h-screen bg-[#f6efe7] flex text-black relative overflow-x-hidden">

      {/* MOBILE TOPBAR */}

      <div className="lg:hidden fixed top-0 left-0 right-0 h-[78px] bg-white/80 backdrop-blur-2xl border-b border-black/5 flex items-center justify-between px-5 z-[99999]">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-[16px] bg-black text-white flex items-center justify-center shadow-lg">

            <FaBolt />

          </div>

          <div>

            <h1 className="text-[22px] font-black tracking-[-0.06em] leading-none">

              EventSphere

            </h1>

            <p className="text-[11px] text-black/40 font-semibold mt-1">

              LMS PLATFORM

            </p>

          </div>

        </div>

        <button

          onClick={()=>
            setSidebarOpen(
              !sidebarOpen
            )
          }

          className="w-11 h-11 rounded-[16px] bg-black text-white flex items-center justify-center active:scale-95 transition-all"

        >

          {

            sidebarOpen

            ?

            <FaTimes />

            :

            <FaBars />

          }

        </button>

      </div>

      {/* OVERLAY */}

      <div

        onClick={()=>
          setSidebarOpen(false)
        }

        className={`

          lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]
          transition-all duration-300

          ${

            sidebarOpen

            ?

            "opacity-100 pointer-events-auto"

            :

            "opacity-0 pointer-events-none"

          }

        `}

      />

      {/* MOBILE SIDEBAR FROM BOTTOM */}

      <div

        className={`

          lg:hidden fixed bottom-0 left-0 right-0 z-[99999]

          transition-all duration-500
          ease-[cubic-bezier(0.22,1,0.36,1)]

          ${

            sidebarOpen

            ?

            "translate-y-0"

            :

            "translate-y-full"

          }

        `}

      >

        <div className="bg-[#f6efe7] rounded-t-[35px] shadow-[0_-20px_80px_rgba(0,0,0,0.18)] border-t border-black/5 max-h-[85vh] overflow-y-auto overflow-x-hidden">

          {/* HANDLE */}

          <div className="flex justify-center pt-4 pb-2">

            <div className="w-20 h-2 rounded-full bg-black/15" />

          </div>

          {/* SIDEBAR */}

          <div className="px-3 pb-6">

            <Sidebar
              setSidebarOpen={
                setSidebarOpen
              }
            />

          </div>

        </div>

      </div>

      {/* DESKTOP SIDEBAR */}

      <div className="hidden lg:block">

        <Sidebar
          setSidebarOpen={
            setSidebarOpen
          }
        />

      </div>

      {/* PAGE */}

      <div className="flex-1 min-w-0 relative overflow-x-hidden">

        <div className="min-h-screen overflow-y-auto overflow-x-hidden p-4 md:p-6 pt-[95px] lg:pt-6 relative z-10">

          <Navbar />

          <div className="mt-4">

            {children}

          </div>

        </div>

      </div>

    </div>

  )

}

export default MainLayout