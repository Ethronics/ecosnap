import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Waves, Github, Mail, Shield, Send, Phone } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="py-12 px-4 mt-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-card p-8 rounded-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center md:text-left">
              <Link
                to="/"
                className="flex items-center space-x-2 justify-center md:justify-start mb-4"
              >
                <Waves className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  EcoSnap
                </span>
              </Link>
              <p className="text-foreground/70">
                Smart environmental monitoring solutions powered by AI
              </p>
            </div>

            <div className="text-center">
              <h4 className="text-lg font-semibold mb-4 text-foreground">
                Quick Links
              </h4>
              <div className="space-y-2">
                <Link
                  to="/"
                  className="block text-foreground/70 hover:text-primary transition-colors"
                >
                  About
                </Link>
                <Link
                  to="/"
                  className="block text-foreground/70 hover:text-primary transition-colors"
                >
                  Domains
                </Link>
                <Link
                  to="/"
                  className="block text-foreground/70 hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </div>
            </div>

            <div className="text-center md:text-right">
              <h4 className="text-lg font-semibold mb-4 text-foreground">
                Connect
              </h4>
              <div className="flex space-x-4 justify-center md:justify-end">
                <a
                  href="mailto:gadisaka04@gmail.com"
                  className="text-foreground/70 hover:text-primary transition-colors"
                >
                  <Mail className="h-6 w-6" />
                </a>
                <a
                  href="https://t.me/gzac_eldama"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 hover:text-primary transition-colors"
                >
                  <Send className="h-6 w-6" />
                </a>
                <a
                  href="tel:+251982828380"
                  className="text-foreground/70 hover:text-primary transition-colors"
                >
                  <Phone className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 pt-8 text-center text-foreground/60">
            <p>&copy; 2025 EcoSnap. All rights reserved.</p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
