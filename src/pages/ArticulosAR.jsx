import Articulos from '../components/list/Articulos_AR'
import { motion } from 'framer-motion'

const ArticulosAR = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}>
      <h1 
        className='font-black text-2xl md:text-3xl lg:text-4xl text-white'>
        Gestión de Artículos
      </h1>
      <hr className='my-2 md:my-4 border-t-2 border-slate-700' />
      <p className='mb-4 md:mb-8 text-sm md:text-base text-slate-400'>Visualiza y gestiona los artículos publicados en tu red comunitaria:</p>
      <Articulos />
    </motion.div>
  )
}

export default ArticulosAR
