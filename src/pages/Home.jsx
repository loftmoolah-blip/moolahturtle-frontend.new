
import React from 'react';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight, Home as HomeIcon, MessageSquare, Handshake, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import BreakdancingTurtle from '@/components/home/BreakdancingTurtle';

const StepCard = ({ icon, title, description, step }) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 text-center h-full">
    <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
      {React.cloneElement(icon, { className: "w-8 h-8 text-green-600" })}
    </div>
    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-3">
      {step}
    </div>
    <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

export default function Home() {
  const steps = [
    {
      icon: <HomeIcon />,
      title: "Enter Your Personal Info",
      description: "Your info stays private until you accept an offer. We then share your phone number with the investor.",
      step: 1,
    },
    {
      icon: <MessageSquare />,
      title: "Add Property Details",
      description: "Tell us where your property is and why you're selling. Accurate info helps find the best offers.",
      step: 2,
    },
    {
      icon: <DollarSign />,
      title: "Start Receiving Free Offers",
      description: "Receive offers on your phone — no cost, no repairs, no cleanup, no fees until you close.",
      step: 3,
    },
    {
      icon: <Handshake />,
      title: "Accept & Close",
      description: "Pick your best offer and close often within 14 days, with no fees owed until then.",
      step: 4,
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <motion.h1 
              className="text-5xl md:text-7xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent">
                Get Your Moolah Fast
              </span>
              <br />
              <span className="text-gray-900">Sell Your Home Today!</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Fast Cash, No Hassle — Sell Your Home with Moolahturtle!
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <a href={createPageUrl("Register")}>
                <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-8 py-6 text-xl font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group">
                  Get a Free Offer
                  <ArrowRight className="w-6 h-6 ml-3 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </a>
              <a href={createPageUrl("InvestorRegistration")}>
                <Button variant="outline" className="px-8 py-6 text-xl font-semibold rounded-2xl border-2 border-green-500 text-green-600 hover:bg-green-50 transition-all duration-300">
                  Become an Investor
                </Button>
              </a>
            </motion.div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <BreakdancingTurtle />
            {/* The "shelf" or dance floor for the turtle */}
            <div className="w-48 h-3 bg-gray-900/10 rounded-full shadow-lg mt-4 blur-sm"></div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to get your cash offer</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              >
                <StepCard
                  icon={step.icon}
                  title={step.title}
                  description={step.description}
                  step={step.step}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Get Started?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a href={createPageUrl("Register")}>
                <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-8 py-6 text-xl font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
                  Sell My Home Now
                </Button>
              </a>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a href={createPageUrl("InvestorRegistration")}>
                <Button variant="outline" className="px-8 py-6 text-xl font-semibold rounded-2xl border-2 border-green-500 text-green-600 hover:bg-green-50 transition-all duration-300">
                  Start Investing
                </Button>
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
