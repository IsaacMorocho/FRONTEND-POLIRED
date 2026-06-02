import EstudiantesRedAR from '../components/list/Estudiantes_Red_AR'
import { motion } from 'framer-motion'

const EstudiantesAR = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}>
      <EstudiantesRedAR />
    </motion.div>
  )
}

export default EstudiantesAR
