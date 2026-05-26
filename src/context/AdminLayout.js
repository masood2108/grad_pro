import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"

function AdminLayout({

  children

}) {

  return (

    <div className="flex bg-[#030014] text-white min-h-screen overflow-hidden">

      <Sidebar />

      <div className="flex-1 overflow-y-auto p-6">

        <Navbar />

        {children}

      </div>

    </div>

  )

}

export default AdminLayout