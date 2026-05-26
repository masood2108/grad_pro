import { motion } from "framer-motion"
import {

  FaCalendarAlt,
  FaUsers,
  FaHandshake,
  FaCertificate,
  FaArrowUp,
  FaCheckCircle,
  FaBolt,
  FaChartLine

} from "react-icons/fa"

function StatCard({ title, value }) {

  const getIconData = () => {

    switch(title.toLowerCase()){

      case "events":

        return {

          icon:<FaCalendarAlt />,

          colorClass:"text-purple-400 bg-purple-500/10 border-purple-500/20",

          shadowClass:"badge-glow-purple",

          subtext:"8 events scheduled this week",

          trend:
          <span className="text-emerald-400 flex items-center gap-1">

            <FaArrowUp />

            +18%

          </span>

        }

      case "registrations":

        return {

          icon:<FaUsers />,

          colorClass:"text-cyan-400 bg-cyan-500/10 border-cyan-500/20",

          shadowClass:"badge-glow-cyan",

          subtext:"1.2K new participants joined",

          trend:
          <span className="text-cyan-400 flex items-center gap-1">

            <FaArrowUp />

            +34%

          </span>

        }

      case "sponsors":

        return {

          icon:<FaHandshake />,

          colorClass:"text-emerald-400 bg-emerald-500/10 border-emerald-500/20",

          shadowClass:"badge-glow-emerald",

          subtext:"5 active sponsorship deals",

          trend:
          <span className="text-emerald-400 flex items-center gap-1">

            <FaCheckCircle />

            Active

          </span>

        }

      case "certificates":

        return {

          icon:<FaCertificate />,

          colorClass:"text-yellow-400 bg-yellow-500/10 border-yellow-500/20",

          shadowClass:"badge-glow-amber",

          subtext:"Participation & winner certificates",

          trend:
          <span className="text-yellow-400 flex items-center gap-1">

            <FaBolt />

            Auto Gen

          </span>

        }

      case "volunteers":

        return {

          icon:<FaUsers />,

          colorClass:"text-pink-400 bg-pink-500/10 border-pink-500/20",

          shadowClass:"badge-glow-rose",

          subtext:"Volunteer ecosystem active",

          trend:
          <span className="text-pink-400 flex items-center gap-1">

            <FaArrowUp />

            +12%

          </span>

        }

      default:

        return {

          icon:<FaChartLine />,

          colorClass:"text-purple-400 bg-purple-500/10 border-purple-500/20",

          shadowClass:"badge-glow-purple",

          subtext:"Live ecosystem analytics",

          trend:null

        }

    }

  }

  const {

    icon,
    colorClass,
    shadowClass,
    subtext,
    trend

  } = getIconData()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="glass-panel p-6 rounded-3xl glass-panel-hover relative overflow-hidden group flex flex-col justify-between min-h-[150px] border border-white/[0.05]"
    >

      {/* Glow Overlay */}

      <div className="absolute top-0 right-0 w-20 h-20 bg-white/[0.02] rounded-bl-full pointer-events-none group-hover:bg-white/[0.04] transition-all duration-300" />

      {/* HEADER */}

      <div className="flex justify-between items-start">

        <div className={`

          w-12 h-12 rounded-2xl
          flex items-center justify-center
          border text-xl
          transition-transform duration-300
          group-hover:scale-105

          ${colorClass}
          ${shadowClass}

        `}>

          {icon}

        </div>

        <div className="text-xs font-bold">

          {trend}

        </div>

      </div>

      {/* BODY */}

      <div className="mt-5">

        <span className="text-zinc-500 text-[11px] font-bold uppercase tracking-[0.2em] block">

          {title}

        </span>

        <div className="flex items-end gap-2 mt-2">

          <span className="text-4xl font-extrabold text-white tracking-tight">

            {value}

          </span>

          <span className="text-[10px] text-zinc-500 font-medium mb-1">

            live metrics

          </span>

        </div>

      </div>

      {/* FOOTER */}

      <div className="mt-4 pt-3 border-t border-white/[0.03] flex justify-between items-center">

        <span className="text-[10px] text-zinc-500 font-medium">

          {subtext}

        </span>

        <span className="text-[9px] text-purple-500/60 font-bold tracking-[0.2em] uppercase group-hover:text-purple-400 transition-all">

          EVENTSPHERE

        </span>

      </div>

    </motion.div>

  )
}

export default StatCard