
import React from 'react';
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  ShieldCheck, DollarSign, Globe, RefreshCw, Zap, Cloud // New icons for Features section
} from 'lucide-react';
import { motion } from 'framer-motion';

const StepCard = ({ step, title, description }) => (
  <div
    className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100"
  >
    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
      {step}
    </div>
    <div>
      <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </div>
);

export default function Investors() {
  const features = [
    { 
      icon: <ShieldCheck className="w-8 h-8 text-green-600" />, 
      title: "Verified & Secure", 
      description: "All property deals and parties are thoroughly vetted for your peace of mind." 
    },
    { 
      icon: <DollarSign className="w-8 h-8 text-green-600" />, 
      title: "Direct Deals, Better Value", 
      description: "Connect directly with sellers, cutting out intermediaries for optimal pricing." 
    },
    { 
      icon: <Globe className="w-8 h-8 text-green-600" />, 
      title: "Expand Your Reach", 
      description: "Access a wider range of investment opportunities across different regions." 
    },
    { 
      icon: <RefreshCw className="w-8 h-8 text-green-600" />, 
      title: "Streamlined Process", 
      description: "From lead to close, our platform simplifies every step of your investment journey." 
    },
    { 
      icon: <Zap className="w-8 h-8 text-green-600" />, 
      title: "Fast & Efficient", 
      description: "Receive timely notifications and make quick decisions on hot properties." 
    },
    { 
      icon: <Cloud className="w-8 h-8 text-green-600" />, 
      title: "Digital & Paperless", 
      description: "Manage all documentation and agreements securely online, reducing clutter." 
    }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="mb-12 lg:mb-0">
              <h1 
                className="text-5xl lg:text-7xl font-bold leading-tight mb-6"
              >
                <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent">
                  Grow Your Portfolio
                </span>
                <br />
                <span className="text-gray-900">Deal Directly with Vetted Sellers</span>
              </h1>
              
              <p 
                className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl"
              >
                Explore transparent deals, sign agreements digitally, and expand your investments confidently with Moolahturtle.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a href={createPageUrl("InvestorRegistration")}>
                  <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-10 py-6 text-xl font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group">
                    Start Investing Now
                    <ArrowRight className="w-6 h-6 ml-3 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </a>
                <a href={createPageUrl("InvestorLogin")}>
                  <Button variant="outline" className="px-10 py-6 text-xl font-semibold rounded-2xl border-2 border-green-500 text-green-600 hover:bg-green-50 transition-all duration-300">
                    Login
                  </Button>
                </a>
              </div>
            </div>
            
            <div className="flex justify-center items-center">
              {/* Empty div or add static image if desired */}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section (replaces Benefits Section) */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Why Invest with Moolahturtle?</h2>
            <p className="text-xl text-gray-600">Your direct connection to off-market property deals</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg h-full border border-green-100">
                  <div 
                    className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-6"
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              How It Works
            </h2>
            <p 
              className="text-lg text-gray-600"
            >
              Get started in just a few simple steps
            </p>
          </div>
          
          <div className="space-y-6">
            <StepCard 
              step={1}
              title="Receive vetted property leads"
              description="Get notifications about verified properties in your selected coverage areas via SMS and email."
            />
            <StepCard 
              step={2}
              title="Submit offers digitally"
              description="Review property details and submit competitive offers through our secure digital platform."
            />
            <StepCard 
              step={3}
              title="Close deals and grow your portfolio"
              description="Complete transactions with confidence knowing all parties are verified and protected."
            />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to Start Building Your Portfolio?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join our network of smart investors today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href={createPageUrl("InvestorRegistration")}>
                <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-10 py-6 text-xl font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
                  Get Started Now
                </Button>
              </a>
              <a href={createPageUrl("InvestorLogin")}>
                <Button variant="outline" className="px-10 py-6 text-xl font-semibold rounded-2xl border-2 border-green-500 text-green-600 hover:bg-green-50 transition-all duration-300">
                  Already have an account? Login
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
