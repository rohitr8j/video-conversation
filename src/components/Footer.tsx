import { Heart } from "lucide-react";
import { motion } from "framer-motion";

export const Footer = () => {
  return (
    <motion.footer 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="p-6 text-center"
    >
      <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
        <span>Made with</span>
        <Heart className="h-4 w-4 text-red-500 fill-current" />
        <span>for mental wellness</span>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Professional AI therapy support • Confidential • Available 24/7
      </p>
    </motion.footer>
  );
};