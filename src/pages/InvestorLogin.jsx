
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { InvestorService } from '@/components/services/investorService';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useToast } from '@/components/common/Toast';
import { useFormValidation, ValidatedInput, validationRules } from '@/components/common/FormValidation';
import { useAuth } from '@/components/hooks/useAuth';

const AnimatedTurtle = () => (
  <div className="text-6xl">
    🐢
  </div>
);

export default function InvestorLogin() {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const { login: authLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loginSchema = {
    email: [validationRules.required, validationRules.email],
    password: [validationRules.required, validationRules.minLength(8)]
  };

  const form = useFormValidation({
    email: '',
    password: ''
  }, loginSchema);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.validateForm()) {
      error('Please fill in all fields correctly');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await InvestorService.login(form.values);
      
      // Check if email is verified
      if (!response.user.email_verified) {
        error('Please verify your email address before logging in.');
        // Redirect to email confirmation page
        navigate(createPageUrl(`EmailConfirmation?email=${encodeURIComponent(response.user.email)}`));
        return;
      }

      await authLogin(response.token, response.user);
      success('Login successful! Redirecting to dashboard...');
      navigate(createPageUrl('InvestorDashboard'));
    } catch (err) {
      error(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md mx-auto shadow-2xl border-0">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <AnimatedTurtle />
          </div>
          
          <CardTitle className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Investor Login
            </span>
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Access your property deals dashboard
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
            
            <div className="relative">
              <ValidatedInput
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.values.password}
                error={form.errors.password}
                touched={form.touched.password}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            <div className="text-right">
              <Link 
                to={createPageUrl('ForgotPassword')}
                className="text-sm font-medium text-green-600 hover:text-green-700"
              >
                Forgot Password?
              </Link>
            </div>
            
            <Button 
              type="submit"
              disabled={isLoading || !form.isValid}
              className="w-full py-6 text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50"
            >
              {isLoading ? (
                <LoadingSpinner size="small" showText={false} />
              ) : (
                'Sign In'
              )}
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate(createPageUrl('InvestorRegistration'))}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
