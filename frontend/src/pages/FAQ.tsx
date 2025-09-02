import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HelpCircle, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { RoleNavigation } from "@/components/RoleNavigation";
import { Navigation } from "@/components/Navigation";
import useAuthStore from "@/stores/authStore";

const FAQ = () => {
  const { user } = useAuthStore();

  const faqData = [
    {
      question: "What is EcoSnap?",
      answer: "EcoSnap is a comprehensive environmental monitoring and sustainability tracking platform that helps organizations monitor their environmental impact, track sustainability metrics, and make data-driven decisions for a greener future."
    },
    {
      question: "How do I get started with EcoSnap?",
      answer: "Getting started is easy! Simply sign up for an account, choose your role (Admin, Manager, Staff, or Employee), and follow the onboarding process. You'll be guided through setting up your organization's profile and initial environmental tracking parameters."
    },
    {
      question: "What types of environmental data can I track?",
      answer: "EcoSnap allows you to track various environmental metrics including carbon emissions, energy consumption, water usage, waste generation, recycling rates, and custom sustainability KPIs specific to your organization."
    },
    {
      question: "Can I customize my dashboard?",
      answer: "Yes! EcoSnap offers extensive customization options. You can personalize your dashboard layout, choose which metrics to display, set up custom alerts, and configure reports based on your specific needs. Visit the Settings > Customize page to get started."
    },
    {
      question: "How do different user roles work?",
      answer: "EcoSnap has four main user roles: Admin (full system access), Manager (team and department oversight), Staff (data entry and reporting), and Employee (basic tracking and viewing). Each role has specific permissions and access levels tailored to their responsibilities."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely! We take data security seriously. EcoSnap uses enterprise-grade encryption, secure data centers, regular security audits, and follows industry best practices to protect your environmental data and organizational information."
    },
    {
      question: "Can I export my data and reports?",
      answer: "Yes, EcoSnap provides comprehensive export capabilities. You can export data in various formats (CSV, PDF, Excel) and generate detailed reports for compliance, stakeholder presentations, or further analysis."
    },
    {
      question: "Do you offer integrations with other systems?",
      answer: "EcoSnap offers integrations with popular business tools, IoT devices, and environmental monitoring systems. Contact our support team to discuss specific integration requirements for your organization."
    },
    {
      question: "What support options are available?",
      answer: "We offer multiple support channels including email support, live chat, comprehensive documentation, video tutorials, and dedicated account management for enterprise customers. Our support team is here to help you succeed."
    },
    {
      question: "How is pricing structured?",
      answer: "EcoSnap offers flexible pricing plans based on organization size and features needed. We have plans for small teams, growing companies, and enterprise organizations. Contact our sales team for a customized quote that fits your needs."
    }
  ];

  return (
    <div className="min-h-screen">
      {user ? <RoleNavigation /> : <Navigation />}
      
      <div className="pt-24 px-4 max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center mb-4"
          >
            <HelpCircle className="h-16 w-16 text-primary" />
          </motion.div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find answers to common questions about EcoSnap and how to make the most of our environmental tracking platform.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Common Questions</CardTitle>
              <CardDescription className="text-center">
                Click on any question below to see the answer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqData.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + (index * 0.1) }}
                  >
                    <AccordionItem value={`item-${index}`}>
                      <AccordionTrigger className="text-left font-medium hover:text-primary transition-colors">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="glass-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Still Have Questions?</CardTitle>
              <CardDescription>
                Can't find what you're looking for? We're here to help!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 1.0 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex flex-col items-center p-6 bg-primary/10 rounded-lg border border-primary/20 backdrop-blur-sm max-w-md"
                >
                  <Mail className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Email Support</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Get detailed help via email. We typically respond within 24 hours.
                  </p>
                  <Button asChild variant="outline" className="hover:bg-primary/20">
                    <a 
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=support@ecosnap.com&su=EcoSnap Support Request&body=Hello EcoSnap Team,%0D%0A%0D%0AI have a question about:%0D%0A%0D%0A[Please describe your question here]%0D%0A%0D%0AThank you!"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Send Message
                    </a>
                  </Button>
                </motion.div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="mt-8 text-center"
              >
                {/* <p className="text-muted-foreground mb-4">
                  Looking for more resources?
                </p> */}
                {/* <div className="flex flex-wrap justify-center gap-4">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button asChild variant="ghost" className="hover:bg-primary/20">
                      <Link to={user ? `/dashboard/${user.role}` : "/dashboard"}>
                        Go to Dashboard
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button asChild variant="ghost" className="hover:bg-primary/20">
                      <Link to="/settings/customize">
                        Customize Settings
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button asChild variant="ghost" className="hover:bg-primary/20">
                      <Link to="/profile">
                        View Profile
                      </Link>
                    </Button>
                  </motion.div>
                </div> */}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
