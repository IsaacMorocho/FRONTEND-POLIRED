import RedesC_Panel_AR  from '../components/create/RedesC_Panel_AR'
import Estudiantes_AR from '../components/create/Estudiantes_AR'
import { motion } from 'framer-motion'

const redesAR = () => {
    return (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}>
            <h1 
            style={{ fontFamily: 'Lora, serif' }}
            className='font-black text-2xl md:text-3xl lg:text-4xl text-gray-600'>Red Comunitaria</h1>
            <hr className='my-2 md:my-4 border-t-2 border-gray-300' />
            <p className='mb-4 md:mb-8 text-sm md:text-base'>Aqui puede actualizar la informacion de su red comunitaria</p>
            <RedesC_Panel_AR />
            <h1 
            style={{ fontFamily: 'Lora, serif' }}
            className='font-black text-2xl md:text-3xl lg:text-4xl text-gray-600 mt-6 md:mt-8'>Estudiantes</h1>
            <hr className='my-2 md:my-4 border-t-2 border-gray-300' />
            <p className='mb-4 md:mb-8 text-sm md:text-base'>A continuacion se muestran los estudiantes registrados en su red comunitaria</p>
            <Estudiantes_AR/>
        </motion.div>
    )
}

export default redesAR;