import SolicitudesPanelAdmin from '../components/list/Solicitudes_Panel_Admin'
import { motion } from 'framer-motion'

const Solicitudes = () => {
    return (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}>
            <SolicitudesPanelAdmin />
        </motion.div>
    )
}

export default Solicitudes
