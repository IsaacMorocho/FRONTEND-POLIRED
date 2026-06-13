import RedesC_Panel_AR  from '../components/create/RedesC_Panel_AR'

import { motion } from 'framer-motion'

const redesAR = () => {
    return (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="space-y-6"
        >
            <RedesC_Panel_AR />
        </motion.div>
    )
}

export default redesAR;