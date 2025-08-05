import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Operations Manager",
    company: "TechCorp Industries",
    image: "/placeholder.svg",
    content:
      "envoinsight has revolutionized how we monitor our manufacturing facilities. The AI predictions have prevented multiple safety incidents.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Facility Director",
    company: "GreenEnergy Solutions",
    image: "/placeholder.svg",
    content:
      "The real-time monitoring and instant alerts have given us peace of mind. Our compliance reporting is now automated and accurate.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Safety Manager",
    company: "BioTech Labs",
    image: "/placeholder.svg",
    content:
      "The dashboard is intuitive and the predictive analytics are incredibly accurate. It's like having a safety expert on staff 24/7.",
    rating: 5,
  },
];

export const Testimonials = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-glass-primary/10 to-transparent">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            See what facility managers and safety professionals are saying about
            envoinsight
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="glass-card p-6 rounded-2xl relative group hover:shadow-2xl transition-all duration-300"
            >
              {/* Quote icon */}
              <div className="absolute top-4 right-4 text-primary/20 group-hover:text-primary/30 transition-colors">
                <Quote className="h-8 w-8" />
              </div>

              {/* Rating */}
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground/80 mb-6 text-lg leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={testimonial.image} alt={testimonial.name} />
                  <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-foreground">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-foreground/60">
                    {testimonial.role}
                  </p>
                  <p className="text-sm text-primary font-medium">
                    {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
