import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { InvestorService } from '@/components/services/investorService';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useToast } from '@/components/common/Toast';
import { motion } from 'framer-motion';

export default function EmailConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { success, error } = useToast();
  const [status, setStatus] = useState('pending'); // pending, success, error, expired
  const [isResending, setIsResending] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    const email = urlParams.get('email');
    
    if (email) {
      setUserEmail(email);
    }

    if (token) {
      verifyEmailToken(token);
    } else if (!email) {
      // No token or email, redirect to login
      navigate(createPageUrl('InvestorLogin'));
    }
  }, [location, navigate]);

  const verifyEmailToken = async (token) => {
    try {
      await InvestorService.verifyEmail(token);
      setStatus('success');
      success('Email verified successfully! You can now access your account.');
    } catch (err) {
      if (err.message?.includes('expired')) {
        setStatus('expired');
      } else {
        setStatus('error');
      }
      error(err.message || 'Email verification failed');
    }
  };

  const handleResendConfirmation = async () => {
    if (!userEmail) {
      error('Email address not found. Please try registering again.');
      return;
    }

    setIsResending(true);
    try {
      await InvestorService.resendEmailConfirmation(userEmail);
      success('Confirmation email sent! Please check your inbox.');
    } catch (err) {
      error(err.message || 'Failed to resend confirmation email');
    }
    setIsResending(false);
  };

  const renderContent = () => {
    switch (status) {
      case 'success':
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-green-800 mb-2">Email Verified!</h2>
              <p className="text-gray-600">
                Your email has been successfully verified. You can now access your account.
              </p>
            </div>
            <Button
              onClick={() => navigate(createPageUrl('InvestorLogin'))}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              Continue to Login
            </Button>
          </motion.div>
        );

      case 'error':
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-red-800 mb-2">Verification Failed</h2>
              <p className="text-gray-600">
                The verification link is invalid or has already been used.
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={handleResendConfirmation}
                disabled={isResending || !userEmail}
              >
                {isResending ? <LoadingSpinner size="small" showText={false} /> : 'Resend Email'}
              </Button>
              <Button onClick={() => navigate(createPageUrl('InvestorLogin'))}>
                Back to Login
              </Button>
            </div>
          </div>
        );

      case 'expired':
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-orange-800 mb-2">Link Expired</h2>
              <p className="text-gray-600">
                This verification link has expired. We can send you a new one.
              </p>
            </div>
            <Button
              onClick={handleResendConfirmation}
              disabled={isResending || !userEmail}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              {isResending ? <LoadingSpinner size="small" showText={false} /> : 'Send New Verification Email'}
            </Button>
          </div>
        );

      default: // pending
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Check Your Email</h2>
              <p className="text-gray-600">
                We sent a verification link to <strong>{userEmail}</strong>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Click the link in the email to verify your account. The link will expire in 24 hours.
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={handleResendConfirmation}
                disabled={isResending}
              >
                {isResending ? <LoadingSpinner size="small" showText={false} /> : <RefreshCw className="w-4 h-4 mr-2" />}
                Resend Email
              </Button>
              <Button onClick={() => navigate(createPageUrl('InvestorLogin'))}>
                Back to Login
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md mx-auto shadow-2xl border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold">Email Verification</CardTitle>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}