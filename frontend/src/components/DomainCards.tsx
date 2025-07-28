import { useState } from "react";
import { motion } from "framer-motion";
import {
  Wheat,
  Building,
  GraduationCap,
  Heart,
  Factory,
  Beaker,
} from "lucide-react";

const domains = [
  {
    id: "agriculture",
    name: "Agriculture",
    icon: Wheat,
    description: "Optimize crop conditions and soil health monitoring",
    color: "green",
  },
  {
    id: "office",
    name: "Office",
    icon: Building,
    description: "Maintain comfortable workplace environments",
    color: "blue",
  },
  {
    id: "school",
    name: "School",
    icon: GraduationCap,
    description: "Ensure optimal learning environment conditions",
    color: "purple",
  },
  {
    id: "medical",
    name: "Medical",
    icon: Heart,
    description: "Critical monitoring for healthcare facilities",
    color: "red",
  },
  {
    id: "factory",
    name: "Factory",
    icon: Factory,
    description: "Industrial environment safety and efficiency",
    color: "yellow",
  },
  {
    id: "lab",
    name: "Lab",
    icon: Beaker,
    description: "Precise environmental control for research",
    color: "blue",
  },
];

// Helper to map Tailwind color names to RGB values
const getRgb = (color: string) => {
  switch (color) {
    case "green":
      return "34,197,94";
    case "blue":
      return "59,130,246";
    case "purple":
      return "168,85,247";
    case "red":
      return "239,68,68";
    case "orange":
      return "249,115,22";
    case "cyan":
      return "6,182,212";
    default:
      return "0,0,0";
  }
};

export const DomainCards = () => {
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null);

  const changeTheme = (domain: string) => {
    const root = document.documentElement;
    const domainColors = {
      agriculture: "120 60% 50%",
      office: "270 70% 60%",
      school: "45 90% 60%",
      medical: "0 70% 55%",
      factory: "20 70% 50%",
      lab: "210 80% 55%",
    };

    root.style.setProperty(
      "--accent",
      domainColors[domain as keyof typeof domainColors]
    );
  };

  return (
    <section className="py-20 px-4 transition-all duration-500 ease-in-out">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Where We Work
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Tailored environmental monitoring solutions for every industry
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {domains.map((domain, index) => (
            <motion.div
              key={domain.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="glass-card p-8 rounded-2xl cursor-pointer group transition-shadow duration-500"
              onMouseEnter={() => {
                setHoveredDomain(domain.id);
                changeTheme(domain.id);
              }}
              onMouseLeave={() => setHoveredDomain(null)}
              style={{
                boxShadow:
                  hoveredDomain === domain.id
                    ? `0 0 30px rgba(${getRgb(domain.color)}, 0.4)`
                    : "none",
              }}
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className={`p-4 rounded-full mb-4 bg-${domain.color}-500/20 group-hover:bg-${domain.color}-500/30 transition-colors`}
                >
                  <domain.icon className={`h-8 w-8 text-${domain.color}-500`} />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                  {domain.name}
                </h3>
                <p className="text-foreground/70 group-hover:text-foreground/90 transition-colors">
                  {domain.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
