import ReportesPanelAdmin from '../components/list/Reportes_Panel_Admin'
import { motion } from 'framer-motion'

const Reportes = () => {
    return (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}>
            <h1 
                style={{ fontFamily: 'Lora, serif' }}
                className='font-black text-2xl md:text-3xl lg:text-4xl text-gray-600'>Reportes del Sistema</h1>
            <hr className='my-2 md:my-4 border-t-2 border-gray-300' />
            <p className='mb-4 md:mb-8 text-sm md:text-base'>Visualiza y gestiona los reportes de usuarios, redes comunitarias y problemas de la aplicación:</p>
            <ReportesPanelAdmin />
        </motion.div>
    )
}

export default Reportes
