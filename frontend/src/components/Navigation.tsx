import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Waves } from "lucide-react";

export const Navigation = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-50 mx-4 mt-4"
    >
      <div className="glass-nav rounded-2xl px-6 py-4">
        <div className="flex items-center justify-between max-w-full mx-10">
          <Link to="/" className="flex items-center space-x-2">
            <Waves className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Envoinsight Ai
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {/* <Link to="/">
              <Button variant="ghost" className="glass-card hover:bg-white/20">
                Home
              </Button>
            </Link>
            
            <Link to="/dashboard">
              <Button variant="ghost" className="glass-card hover:bg-white/20">
                Dashboard
              </Button>
            </Link>
            
            <Link to="/history">
              <Button variant="ghost" className="glass-card hover:bg-white/20">
                History
              </Button>
            </Link>
            
            <Link to="/profile">
              <Button variant="ghost" className="glass-card hover:bg-white/20">
                Profile
              </Button>
            </Link> */}

            <Link to="/login">
              <Button className="bg-gray-700 hover:bg-gray-800 text-white backdrop-blur-sm">
                login
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-primary/80 hover:bg-primary text-white backdrop-blur-sm">
                Signup
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
