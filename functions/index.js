const openRazorpay = async (fee) => {

  const options = {

    key: "rzp_test_Su0csRRzeeIKTl",

    amount: fee.amount * 100,

    currency: "INR",

    name: "LMS ERP",

    description: fee.course,

    image:
    "https://cdn-icons-png.flaticon.com/512/3135/3135755.png",

    method: {

      upi: true,

      card: false,

      netbanking: false,

      wallet: false,

      emi: false,

      paylater: false

    },

    config: {

      display: {

        blocks: {

          upi: {

            name: "Pay using UPI",

            instruments: [

              {

                method: "upi"

              }

            ]

          }

        },

        sequence: ["block.upi"],

        preferences: {

          show_default_blocks: false

        }

      }

    },

    handler: async function(response) {

      try {

        await updateDoc(

          doc(db, "fees", fee.id),

          {

            status: "Paid",

            paymentId:
            response.razorpay_payment_id,

            paidAt:
            serverTimestamp()

          }

        )

        alert("Payment Successful")

      }

      catch(error){

        console.log(error)

      }

    },

    prefill: {

      name:
      fee.studentName

    },

    theme: {

      color: "#000000"

    }

  }

  const razorpay =
  new window.Razorpay(options)

  razorpay.open()

}