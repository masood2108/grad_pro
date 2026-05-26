import { motion } from "framer-motion"
import {

  FaPlay,
  FaCalendarAlt,
  FaUsers,
  FaMapMarkerAlt,
  FaStar,
  FaQrcode

} from "react-icons/fa"

function CourseCard({

  title = "HackForge 2026",

  category = "Hackathon",

  registrations = 420,

  description = "A national-level 24 hour hackathon bringing together developers, designers, and innovators from colleges across the country.",

  image = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",

  organizer = "VNRVJIET",

  venue = "Hyderabad Campus",

  status = "Live",

  color = "purple"

}) {

  const getThemeColors = () => {

    switch(color){

      case "cyan":

        return {

          badge:"bg-cyan-500/10 text-cyan-300 border-cyan-400/20",

          glow:"group-hover:border-cyan-500/30",

          btn:"bg-cyan-600 hover:bg-cyan-500 shadow-cyan-600/10",

          status:"bg-cyan-500/10 text-cyan-300 border-cyan-500/20"

        }

      case "pink":

        return {

          badge:"bg-pink-500/10 text-pink-300 border-pink-400/20",

          glow:"group-hover:border-pink-500/30",

          btn:"bg-pink-600 hover:bg-pink-500 shadow-pink-600/10",

          status:"bg-pink-500/10 text-pink-300 border-pink-500/20"

        }

      case "purple":

      default:

        return {

          badge:"bg-purple-500/10 text-purple-300 border-purple-400/20",

          glow:"group-hover:border-purple-500/30",

          btn:"bg-purple-600 hover:bg-purple-500 shadow-purple-600/10",

          status:"bg-emerald-500/10 text-emerald-300 border-emerald-500/20"

        }

    }

  }

  const themes = getThemeColors()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`
      glass-panel
      rounded-3xl
      overflow-hidden
      glass-panel-hover
      group
      flex
      flex-col
      justify-between
      h-full
      border
      border-white/[0.05]

      ${themes.glow}

    `}>


      <div className="h-[230px] w-full overflow-hidden relative">

        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/30 to-transparent z-10 pointer-events-none" />

        <img

          src={image}

          alt={title}

          className="h-full w-full object-cover group-hover:scale-105 transition duration-500"

        />


        <span className={`

          absolute top-4 left-4 z-20
          px-3 py-1 rounded-xl
          text-[10px] font-bold tracking-widest uppercase
          border backdrop-blur-md

          ${themes.badge}

        `}>

          {category}

        </span>


        <span className={`

          absolute top-4 right-4 z-20
          px-3 py-1 rounded-xl
          text-[10px] font-bold tracking-widest uppercase
          border backdrop-blur-md

          ${themes.status}

        `}>

          {status}

        </span>

      </div>


      <div className="p-6 flex-1 flex flex-col justify-between">


        <div>


          <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-semibold">

            <FaCalendarAlt className="text-zinc-400" />

            <span>COLLEGE EVENT</span>

            <span>•</span>

            <span className="flex items-center gap-1 text-yellow-400">

              <FaStar />

              4.9

            </span>

          </div>


          <h2 className="text-2xl font-extrabold text-white mt-2 leading-snug group-hover:text-purple-300 transition duration-200">

            {title}

          </h2>


          <p className="text-zinc-400 text-sm mt-4 leading-relaxed font-medium">

            {description}

          </p>

        </div>


        <div className="mt-6 pt-5 border-t border-white/[0.04]">

          <div className="grid grid-cols-2 gap-4">


            <div className="bg-zinc-950/60 border border-white/[0.03] rounded-2xl p-4">

              <div className="flex items-center gap-2 text-zinc-500 text-[10px] uppercase font-bold tracking-wider">

                <FaUsers />

                Registrations

              </div>

              <h1 className="text-xl font-bold mt-2">

                {registrations}

              </h1>

            </div>


            <div className="bg-zinc-950/60 border border-white/[0.03] rounded-2xl p-4">

              <div className="flex items-center gap-2 text-zinc-500 text-[10px] uppercase font-bold tracking-wider">

                <FaMapMarkerAlt />

                Venue

              </div>

              <h1 className="text-sm font-bold mt-2 truncate">

                {venue}

              </h1>

            </div>

          </div>

        </div>


        <div className="mt-6 pt-5 border-t border-white/[0.04] flex items-center justify-between gap-4">


          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/[0.06] flex items-center justify-center font-bold text-xs text-zinc-300">

              {organizer.charAt(0)}

            </div>

            <div>

              <span className="block text-[9px] text-zinc-500 font-bold uppercase tracking-wider">

                Organizer

              </span>

              <span className="block text-[12px] text-zinc-300 font-bold">

                {organizer}

              </span>

            </div>

          </div>

          <button className={`

            px-5 py-3 rounded-2xl
            text-white font-bold text-sm
            transition-all duration-300
            flex items-center gap-2
            shadow-lg hover:scale-105

            ${themes.btn}

          `}>

            <FaQrcode className="text-xs" />

            View Event

          </button>

        </div>

      </div>

    </motion.div>

  )
}

export default CourseCard