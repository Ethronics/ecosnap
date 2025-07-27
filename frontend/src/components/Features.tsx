import { motion } from 'framer-motion';
import { 
  Activity, 
  Brain, 
  BarChart3, 
  Shield, 
  Zap, 
  Globe 
} from 'lucide-react';

const features = [
  {
    icon: Activity,
    title: 'Real-time Monitoring',
    description: 'Live temperature and humidity data with instant alerts'
  },
  {
    icon: Brain,
    title: 'AI Safety Prediction',
    description: 'Advanced algorithms predict environmental risks before they occur'
  },
  {
    icon: BarChart3,
    title: 'Interactive Dashboard',
    description: 'Beautiful visualizations and comprehensive analytics'
  },
  {
    icon: Shield,
    title: 'Safety Compliance',
    description: 'Automated compliance tracking and reporting'
  },
  {
    icon: Zap,
    title: 'Instant Alerts',
    description: 'Immediate notifications for critical environmental changes'
  },
  {
    icon: Globe,
    title: 'Multi-Domain Support',
    description: 'Customized solutions for every industry and environment'
  }
];

export const Features = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-transparent to-glass-primary/10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Everything you need to monitor and manage environmental conditions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="glass-card p-6 rounded-2xl group hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-4 rounded-full mb-4 bg-primary/20 group-hover:bg-primary/30 transition-colors">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-foreground/70 group-hover:text-foreground/90 transition-colors">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};