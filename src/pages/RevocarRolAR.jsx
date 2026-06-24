import RevocarRolPanelAR from '../components/list/RevocarRol_AR'
import { motion } from 'framer-motion'

const RevocarRolAR = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-6"
        >
            <RevocarRolPanelAR />
        </motion.div>
    )
}

export default RevocarRolAR
