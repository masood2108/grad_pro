import {
  addDoc,
  collection,
  serverTimestamp
} from "firebase/firestore"

import {
  db
} from "../firebase/firebase"

const sendNotification = async ({
  title,
  message,
  type = "general",
  userId = "all"
}) => {

  try {

    await addDoc(

      collection(
        db,
        "notifications"
      ),

      {
        title,
        message,
        type,
        userId,

        read: false,

        createdAt:
        serverTimestamp()

      }

    )

    console.log(
      "Notification Sent"
    )

  }

  catch (error) {

    console.log(
      "Notification Error:",
      error
    )

  }

}

export default sendNotification