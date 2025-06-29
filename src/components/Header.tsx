import { Moon, Sun, Settings } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Button } from "./ui/button";
import { useAtom } from "jotai";
import { screenAtom } from "@/store/screens";
import { motion } from "framer-motion";

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const [, setScreenState] = useAtom(screenAtom);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleSettings = () => {
    setScreenState({ currentScreen: "settings" });
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex items-center justify-between p-6"
    >
      <motion.div 
        className="flex items-center space-x-2"
        whileHover={{ scale: 1.05 }}
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">T</span>
        </div>
        <h1 className="text-xl font-bold gradient-text">Talk to a Therapist</h1>
      </motion.div>

      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full hover:bg-primary/10"
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSettings}
          className="rounded-full hover:bg-primary/10"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </motion.header>
  );
};