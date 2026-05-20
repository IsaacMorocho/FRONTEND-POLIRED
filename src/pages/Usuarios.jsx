import UsuariosCrud from "../components/list/User_Panel_Admin"
import { motion } from 'framer-motion'

const usuarios = () => {
    return (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}>
            <h1 
                style={{ fontFamily: 'Lora, serif' }}
                className='font-black text-2xl md:text-3xl lg:text-4xl text-gray-600'>Usuarios</h1>
            <hr className='my-2 md:my-4 border-t-2 border-gray-300' />
            <p className='mb-4 md:mb-8 text-sm md:text-base'>Para crear usuarios llene los siguientes campos:</p>
            <UsuariosCrud/>
        </motion.div>
    )
}

export default usuarios;