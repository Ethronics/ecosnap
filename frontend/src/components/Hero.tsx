import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sun, ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-20 relative bg-background">
      {/* Moving glare */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="w-[150%] h-full bg-gradient-to-tr from-white/5 to-white/0 animate-glare opacity-20 blur-2xl rotate-12" />
      </div>

      <div className="max-w-4xl mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative p-12 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-md overflow-hidden"
        >
          {/* Gentle diagonal glare overlay */}
          <div className="absolute inset-0 z-0 pointer-events-none bg-[linear-gradient(-45deg,_rgba(255,255,255,0.08)_25%,_transparent_25%,_transparent_50%,_rgba(255,255,255,0.08)_50%,_rgba(255,255,255,0.08)_75%,_transparent_75%,_transparent)] bg-[length:200%_200%] animate-card-glare rounded-3xl" />

          {/* Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-6 relative z-10"
          >
            <Sun className="h-14 w-14 text-yellow-400 mx-auto drop-shadow-sm" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent relative z-10"
          >
            Smart Environmental Sensing with AI
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-lg md:text-xl text-foreground/80 my-8 max-w-2xl mx-auto relative z-10"
          >
            Monitor temperature and humidity. Predict environmental safety. Stay
            informed across domains.
          </motion.p>

          {/* Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="relative z-10"
          >
            <Link to="/signup">
              <Button
                size="lg"
                className="relative bg-gradient-to-r from-primary via-accent to-primary text-white text-lg px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
