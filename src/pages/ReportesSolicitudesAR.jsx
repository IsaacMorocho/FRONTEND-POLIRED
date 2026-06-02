import ReportesSolicitudesAR from '../components/list/Reportes_Solicitudes_AR'
import { motion } from 'framer-motion'

const ReportesSolicitudesARPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}>
      <ReportesSolicitudesAR />
    </motion.div>
  )
}

export default ReportesSolicitudesARPage
