import UsuariosPanelAdmin from "../components/list/Usuarios_Panel_Admin"
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
                className='font-black text-2xl md:text-3xl lg:text-4xl text-gray-600'>Gestión de Usuarios</h1>
            <hr className='my-2 md:my-4 border-t-2 border-gray-300' />
            <p className='mb-4 md:mb-8 text-sm md:text-base'>Administra los estudiantes del sistema, actualiza sus datos, suspende o habilita cuentas:</p>
            <UsuariosPanelAdmin/>
        </motion.div>
    )
}

export default usuarios