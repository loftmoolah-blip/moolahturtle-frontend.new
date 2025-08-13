
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Building, Mail, Phone, Shield, ArrowRight, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { InvestorService } from '@/components/services/investorService';
import { useFormValidation, ValidatedInput, validationRules } from '@/components/common/FormValidation';
import { useToast } from '@/components/common/Toast';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

// Placeholder for createPageUrl. In a real application, this would be imported from a routing utility.
const createPageUrl = (pageName) => {
  switch (pageName) {
    case 'InvestorLogin':
      return '/investor-login'; // Adjust this path according to your application's routing
    default:
      return `/${pageName.toLowerCase()}`;
  }
};

export default function RegistrationForm({ onSubmit, initialData }) {
  const { success, error } = useToast();
  const [showOTP, setShowOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [emailDispatched, setEmailDispatched] = useState(false);

  const registrationSchema = {
    full_name: [validationRules.required, validationRules.minLength(2)],
    company_name: [],
    email: [validationRules.required, validationRules.email],
    phone: [validationRules.required, validationRules.phone],
    password: [validationRules.required, validationRules.minLength(8)],
  };
  
  const form = useFormValidation(initialData, registrationSchema);

  const formatPhoneNumber = (value) => {
    const phoneNumber = value.replace(/\D/g, '');
    if (phoneNumber.length <= 3) {
      return `(${phoneNumber}`;
    } else if (phoneNumber.length <= 6) {
      return `(${phoneNumber.slice(0, 3)})-${phoneNumber.slice(3)}`;
    } else {
      return `(${phoneNumber.slice(0, 3)})-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (name, value) => {
    const formatted = formatPhoneNumber(value);
    form.handleChange(name, formatted);
  };

  const handleSendOTP = async () => {
    if (!form.validateForm()) {
      error('Please fill in all required fields correctly.');
      return;
    }

    setIsLoading(true);

    try {
      try {
        await InvestorService.sendEmailConfirmation(form.values.email);
        setEmailDispatched(true);
      } catch (emailErr) {
        console.error('Email confirmation failed:', emailErr);
      }

      await InvestorService.sendVerificationCode(form.values.phone);
      setShowOTP(true);
      success('Verification code sent successfully!');
    } catch (err) {
      error(err.message || 'Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpCode || otpCode.length !== 6) {
      error('Please enter a valid 6-digit verification code.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real scenario, you'd verify OTP with the backend:
      // await InvestorService.verifyOTP(form.values.phone, otpCode);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call (successful phone verification and account creation)
      if (emailDispatched) {
        setEmailSent(true);
        success('Account created! Please check your email to verify your account.');
      } else {
        success('Account created! You can now log in.');
        onSubmit({ ...form.values, phone_verified: true });
      }

    } catch (err) {
      error(err.message || 'Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <Card className="shadow-2xl border-0 max-w-2xl mx-auto">
        <CardContent className="p-10 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="space-y-6"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Check Your Email</h2>
              <p className="text-gray-600">
                We've sent a verification link to <strong>{form.values.email}</strong>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Please click the link in the email to complete your registration.
              </p>
            </div>
            <Button
              onClick={() => window.open('https://mail.google.com/mail/u/0/#inbox', '_blank')} // Direct link to Gmail inbox
              variant="outline"
              className="mr-3"
            >
              Open Gmail
            </Button>
            <Button
              onClick={() => window.location.href = createPageUrl('InvestorLogin')}
              className="bg-gradient-to-r from-green-500 to-emerald-600"
            >
              Continue to Login
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-2xl border-0 max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
            {showOTP ? (
              <Shield className="w-8 h-8 text-white" />
            ) : (
              <User className="w-8 h-8 text-white" />
            )}
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">
              {showOTP ? 'Verify Your Phone' : 'Join Our Investor Network'}
            </CardTitle>
            <p className="text-gray-600 mt-1">
              {showOTP ? 'Enter the code we sent to your phone' : 'Create your investor account to get started'}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {!showOTP ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <ValidatedInput
              name="full_name"
              label="Full Name / Individual Name *"
              placeholder="Enter your full name"
              value={form.values.full_name}
              error={form.errors.full_name}
              touched={form.touched.full_name}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              icon={<User />}
            />
            
            <ValidatedInput
              name="company_name"
              label="Company Name (Optional)"
              placeholder="Enter your company name"
              value={form.values.company_name}
              error={form.errors.company_name}
              touched={form.touched.company_name}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              icon={<Building />}
            />
            
            <ValidatedInput
              name="email"
              label="Email Address *"
              type="email"
              placeholder="Enter your email address"
              value={form.values.email}
              error={form.errors.email}
              touched={form.touched.email}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              icon={<Mail />}
            />

            <ValidatedInput
              name="password"
              label="Password *"
              type="password"
              placeholder="Create a secure password (min. 8 characters)"
              value={form.values.password}
              error={form.errors.password}
              touched={form.touched.password}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              icon={<Lock />}
            />
            
            <ValidatedInput
              name="phone"
              label="Phone Number *"
              type="tel"
              placeholder="(000)-000-0000"
              value={form.values.phone}
              error={form.errors.phone}
              touched={form.touched.phone}
              onChange={handlePhoneChange}
              onBlur={form.handleBlur}
              maxLength={14}
              icon={<Phone />}
            />
            
            <Button 
              onClick={handleSendOTP} 
              disabled={isLoading || !form.isValid}
              className="w-full py-6 text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              {isLoading ? <LoadingSpinner size="small" showText={false} /> : 'Send OTP'}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <ValidatedInput
              name="otp"
              label="Verification Code"
              placeholder="Enter 6-digit code"
              value={otpCode}
              onChange={(name, value) => setOtpCode(value)}
              className="text-center tracking-widest" // Retain specific styling
              maxLength={6}
              icon={<Shield />}
            />
            
            <Button 
              onClick={handleVerifyOTP} 
              disabled={isLoading}
              className="w-full py-6 text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              {isLoading ? (
                <LoadingSpinner size="small" showText={false} />
              ) : (
                <>
                  Verify & Continue
                  <ArrowRight className="ml-2" />
                </>
              )}
            </Button>
            
            <button 
              onClick={() => setShowOTP(false)}
              className="w-full text-sm text-gray-500 hover:text-gray-700"
              disabled={isLoading}
            >
              Back to edit information
            </button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
