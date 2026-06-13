import { motion } from 'framer-motion'
import SolicitudesRedesPanelAdmin from '../components/list/SolicitudesRedes_Panel_Admin'

const SolicitudesRedes = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}>
      <SolicitudesRedesPanelAdmin />
    </motion.div>
  )
}

export default SolicitudesRedes
