import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react"

import { auth, db } from "../firebase/firebase"

import {
  onAuthStateChanged
} from "firebase/auth"

import {
  doc,
  getDoc
} from "firebase/firestore"

const AuthContext =
createContext()

export function AuthProvider({
  children
}) {

  const [currentUser,
  setCurrentUser] =
  useState(null)

  const [userRole,
  setUserRole] =
  useState(null)

  const [loading,
  setLoading] =
  useState(true)

  useEffect(() => {

    const unsubscribe =

      onAuthStateChanged(

        auth,

        async(user) => {

          if(user){

            setCurrentUser(user)

            try{

              const docRef =

                doc(
                  db,
                  "users",
                  user.uid
                )

              const docSnap =

                await getDoc(docRef)

              if(docSnap.exists()){

                setUserRole(
                  docSnap.data().role
                )

              }

            }

            catch(error){

              console.log(error)

            }

          }

          else{

            setCurrentUser(null)

            setUserRole(null)

          }

          setLoading(false)

        }

      )

    return () => unsubscribe()

  }, [])

  return (

    <AuthContext.Provider

      value={{

        currentUser,
        userRole,
        loading

      }}

    >

      {children}

    </AuthContext.Provider>

  )

}

export function useAuth(){

  return useContext(AuthContext)

}