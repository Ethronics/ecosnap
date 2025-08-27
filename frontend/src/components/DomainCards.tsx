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
    detailedDescription:
      "Monitor soil moisture, temperature, and humidity to maximize crop yields. Track environmental conditions for optimal plant growth and implement smart irrigation systems.",
    color: "green",
  },
  {
    id: "office",
    name: "Office",
    icon: Building,
    description: "Maintain comfortable workplace environments",
    detailedDescription:
      "Ensure optimal air quality, temperature, and humidity levels for employee productivity and well-being. Monitor CO2 levels and implement smart HVAC controls.",
    color: "blue",
  },
  {
    id: "school",
    name: "School",
    icon: GraduationCap,
    description: "Ensure optimal learning environment conditions",
    detailedDescription:
      "Create ideal learning environments with proper ventilation, temperature control, and air quality monitoring. Support student health and academic performance.",
    color: "purple",
  },
  {
    id: "medical",
    name: "Medical",
    icon: Heart,
    description: "Critical monitoring for healthcare facilities",
    detailedDescription:
      "Maintain sterile environments with precise temperature and humidity control. Monitor air quality for patient safety and regulatory compliance in hospitals and clinics.",
    color: "red",
  },
  {
    id: "factory",
    name: "Factory",
    icon: Factory,
    description: "Industrial environment safety and efficiency",
    detailedDescription:
      "Monitor air quality, temperature, and humidity for worker safety and equipment efficiency. Track environmental compliance and optimize production conditions.",
    color: "yellow",
  },
  {
    id: "lab",
    name: "Lab",
    icon: Beaker,
    description: "Precise environmental control for research",
    detailedDescription:
      "Maintain precise temperature, humidity, and air quality standards for sensitive research and experiments. Ensure data integrity and equipment protection.",
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
              className="glass-card p-8 rounded-2xl cursor-pointer group transition-shadow duration-500 relative"
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

                {/* Hover Description Overlay */}
                {hoveredDomain === domain.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute inset-0 bg-background/95 backdrop-blur-sm rounded-2xl p-6 flex items-center justify-center z-10"
                  >
                    <div className="text-center">
                      <h4 className="text-xl font-semibold mb-3 text-foreground">
                        {domain.name}
                      </h4>
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        {domain.detailedDescription}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
