import PublicacionesAR from '../components/list/Publicaciones_Panel_AR'
import ArticulosAR from '../components/list/Articulos_AR'
import { motion } from 'framer-motion'

const Publicaciones = () => {
    return (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}>
            <h1 
                className='font-black text-2xl md:text-3xl lg:text-4xl text-gray-600'>Publicaciones</h1>
            <hr className='my-2 md:my-4 border-t-2 border-gray-300' />
            <p className='mb-4 md:mb-8 text-sm md:text-base'>A continuacion se muestran las publicaciones existentes en la red comunitaria a su cargo</p>
            <PublicacionesAR/>
            <h1 
                className='font-black text-2xl md:text-3xl lg:text-4xl text-gray-600 mt-6 md:mt-8'>Articulos</h1>
            <hr className='my-2 md:my-4 border-t-2 border-gray-300' />
            <p className='mb-4 md:mb-8 text-sm md:text-base'>A continuacion se muestran los articulos existentes en la red comunitaria a su cargo</p>
            <ArticulosAR/>
        </motion.div>
        
    )
}

export default Publicaciones;