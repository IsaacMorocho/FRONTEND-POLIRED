import RedesPanelAdmin from '../components/list/Redes_Panel_Admin'
import { motion } from 'framer-motion'

const redes = () => {
    return (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}>
            <h1 
            style={{ fontFamily: 'Lora, serif' }}
            className='font-black text-2xl md:text-3xl lg:text-4xl text-gray-600'>Gestión de Redes Comunitarias</h1>
            <hr className='my-2 md:my-4 border-t-2 border-gray-300' />
            <p className='mb-4 md:mb-8 text-sm md:text-base'>Administra las redes comunitarias, verifica solicitudes y gestiona rehabilitaciones:</p>
            <RedesPanelAdmin />
        </motion.div>
    )
}

export default redes