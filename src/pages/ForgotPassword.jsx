import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, ArrowLeft } from 'lucide-react';
import { InvestorService } from '@/components/services/investorService';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useToast } from '@/components/common/Toast';
import { useFormValidation, ValidatedInput, validationRules } from '@/components/common/FormValidation';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = {
    email: [validationRules.required, validationRules.email],
  };

  const form = useFormValidation({ email: '' }, formSchema);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.validateForm()) {
      error('Please enter a valid email address.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, the backend would handle sending the email.
      // We are simulating the API call and success state.
      await InvestorService.forgotPassword(form.values.email);
      success('If an account with that email exists, a password reset link has been sent.', { duration: 8000 });
      navigate(createPageUrl('InvestorLogin'));
    } catch (err) {
      // Even on error, we show a generic message to prevent email enumeration.
      success('If an account with that email exists, a password reset link has been sent.', { duration: 8000 });
      navigate(createPageUrl('InvestorLogin'));
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md mx-auto shadow-2xl border-0">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <CardTitle className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Forgot Your Password?
            </span>
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Enter your email and we'll send you a link to reset it.
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <ValidatedInput
              name="email"
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={form.values.email}
              error={form.errors.email}
              touched={form.touched.email}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              required
            />
            
            <Button 
              type="submit"
              disabled={isLoading || !form.isValid}
              className="w-full py-6 text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50"
            >
              {isLoading ? (
                <LoadingSpinner size="small" showText={false} />
              ) : (
                'Send Reset Link'
              )}
            </Button>
            
            <div className="text-center">
              <Link
                  to={createPageUrl('InvestorLogin')}
                  className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}