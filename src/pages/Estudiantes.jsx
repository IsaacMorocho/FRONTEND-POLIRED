import EstudiantesPanelAdmin from '../components/list/Estudiantes_Panel_Admin'
import { motion } from 'framer-motion'

const Estudiantes = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <EstudiantesPanelAdmin />
    </motion.div>
  )
}

export default Estudiantes
