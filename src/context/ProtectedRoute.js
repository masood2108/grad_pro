/* eslint-disable no-unused-vars */
import {
  useEffect,
  useState
} from "react"

import {
  Navigate,
  useLocation
} from "react-router-dom"

import {
  auth,
  db
} from "../firebase/firebase"

import {
  doc,
  getDoc
} from "firebase/firestore"

import {
  onAuthStateChanged
} from "firebase/auth"

import {
  FaLock,
  FaBolt
} from "react-icons/fa"

function ProtectedRoute({

  children,
  allowedRoles

}) {

  const location =
  useLocation()

  const [loading, setLoading] =
  useState(true)

  const [authorized, setAuthorized] =
  useState(false)

  const [redirectPath, setRedirectPath] =
  useState("/login")

  useEffect(() => {

    const unsubscribe =

      onAuthStateChanged(

        auth,

        async(user) => {

          /* NOT LOGGED IN */

          if(!user){

            setAuthorized(false)

            setRedirectPath("/login")

            setLoading(false)

            return

          }

          try{

            /* GET USER ROLE */

            const userRef =

            doc(
              db,
              "users",
              user.uid
            )

            const userSnap =

            await getDoc(userRef)

            if(userSnap.exists()){

              const userData =
              userSnap.data()

              const role =
              userData.role

              /* ALLOWED */

              if(

                allowedRoles.includes(role)

              ){

                setAuthorized(true)

              }

              /* NOT ALLOWED */

              else{

                setAuthorized(false)

                /* ROLE BASED REDIRECT */

                if(

                  role === "parent"

                ){

                  setRedirectPath(
                    "/dashboard"
                  )

                }

                else if(

                  role === "student"

                ){

                  setRedirectPath(
                    "/dashboard"
                  )

                }

                else if(

                  role === "faculty"

                ){

                  setRedirectPath(
                    "/dashboard"
                  )

                }

                else if(

                  role === "organizer"

                ){

                  setRedirectPath(
                    "/dashboard"
                  )

                }

                else{

                  setRedirectPath(
                    "/login"
                  )

                }

              }

            }

            else{

              setAuthorized(false)

              setRedirectPath(
                "/login"
              )

            }

          }

          catch(error){

            console.log(error)

            setAuthorized(false)

            setRedirectPath(
              "/login"
            )

          }

          finally{

            setLoading(false)

          }

        }

      )

    return () => unsubscribe()

  }, [

    allowedRoles,
    location.pathname

  ])

  /* LOADING SCREEN */

  if(loading){

    return (

      <div className="w-screen h-screen bg-[#f5efe7] overflow-hidden flex items-center justify-center relative">

        {/* BLUR */}

        <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-violet-300/20 blur-[140px] rounded-full" />

        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-orange-300/20 blur-[140px] rounded-full" />

        <div className="relative z-10 flex flex-col items-center">

          <div className="w-28 h-28 rounded-[35px] bg-black text-white flex items-center justify-center shadow-[0_30px_80px_rgba(0,0,0,0.18)] animate-pulse">

            <FaBolt className="text-5xl" />

          </div>

          <h1 className="mt-8 text-5xl font-black tracking-[-0.08em] text-black">

            Checking Access...

          </h1>

          <p className="mt-4 text-black/40 text-lg font-medium">

            Verifying role permissions

          </p>

        </div>

      </div>

    )

  }

  /* BLOCK ACCESS */

  if(!authorized){

    return (

      <Navigate

        to={redirectPath}

        replace

      />

    )

  }

  /* SUCCESS */

  return children

}

export default ProtectedRoute