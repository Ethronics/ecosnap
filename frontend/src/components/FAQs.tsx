import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What is envoinsight?",
    answer: "envoinsight is a comprehensive environmental monitoring platform that provides real-time insights into environmental data using advanced AI technology. It helps organizations track, analyze, and respond to environmental changes efficiently."
  },
  {
    question: "How does the monitoring system work?",
    answer: "Our system uses a network of sensors and IoT devices to collect environmental data in real-time. This data is processed through our AI algorithms to provide actionable insights and automated alerts when thresholds are exceeded."
  },
  {
    question: "What types of environmental data can I monitor?",
    answer: "You can monitor various environmental parameters including air quality, water quality, soil conditions, noise levels, temperature, humidity, and more. The platform is customizable to your specific monitoring needs."
  },
  {
    question: "Is the platform suitable for small businesses?",
    answer: "Yes! envoinsight offers scalable solutions for businesses of all sizes. We have different pricing tiers and plans that can accommodate small businesses, large corporations, and government agencies."
  },
  {
    question: "How secure is my data?",
    answer: "Data security is our top priority. We use enterprise-grade encryption, secure cloud infrastructure, and follow industry best practices to ensure your environmental data is protected and secure."
  },
  {
    question: "Can I integrate with existing systems?",
    answer: "Absolutely! envoinsight provides APIs and integration capabilities that allow you to connect with your existing environmental management systems, databases, and reporting tools."
  },
  {
    question: "What kind of support do you provide?",
    answer: "We offer comprehensive support including 24/7 technical assistance, training sessions, documentation, and dedicated account managers for enterprise clients. Our team is always ready to help you succeed."
  },
  {
    question: "How accurate are the environmental measurements?",
    answer: "Our sensors and monitoring equipment meet industry standards for accuracy and reliability. We regularly calibrate our systems and provide detailed accuracy reports to ensure you can trust your data."
  }
];

export const FAQs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-foreground/70 text-lg">
            Get answers to common questions about envoinsight
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="glass-card border-white/20">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <span className="font-medium text-foreground text-lg">
                    {faq.question}
                  </span>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-primary" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-primary" />
                  )}
                </button>
                
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-4"
                  >
                    <div className="border-t border-white/20 pt-4">
                      <p className="text-foreground/80 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-foreground/70 mb-4">
            Still have questions? We're here to help!
          </p>
          <a
            href="mailto:gadisaka04@gmail.com"
            className="inline-flex items-center px-6 py-3 bg-primary/80 hover:bg-primary text-white rounded-lg transition-colors"
          >
            Contact Support
          </a>
        </motion.div>
      </div>
    </section>
  );
};
