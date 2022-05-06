import { AnimatePresence, motion } from "framer-motion";

export default function Animater({ children, ...props }) {
  return (
    <AnimatePresence exitBeforeEnter={true}>
      <motion.div {...props}>{children}</motion.div>
    </AnimatePresence>
  );
}
