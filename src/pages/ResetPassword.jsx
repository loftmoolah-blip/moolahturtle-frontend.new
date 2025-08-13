import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { InvestorService } from '@/components/services/investorService';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useToast } from '@/components/common/Toast';
import { useFormValidation, ValidatedInput, validationRules } from '@/components/common/FormValidation';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { success, error } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(search);
    const resetToken = params.get('token');
    if (!resetToken) {
      error('Invalid or missing reset token.');
      navigate(createPageUrl('InvestorLogin'));
    }
    setToken(resetToken);
  }, [search, navigate, error]);

  const formSchema = {
    password: [validationRules.required, validationRules.minLength(8)],
    confirmPassword: [validationRules.required, (value, allValues) => 
      value === allValues.password ? null : 'Passwords must match'
    ],
  };

  const form = useFormValidation({ password: '', confirmPassword: '' }, formSchema);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.validateForm()) {
      error('Please fill in all fields correctly.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await InvestorService.resetPassword(token, form.values.password);
      success('Your password has been reset successfully! Please log in.');
      navigate(createPageUrl('InvestorLogin'));
    } catch (err) {
      error(err.message || 'Failed to reset password. The link may be expired.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md mx-auto shadow-2xl border-0">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Reset Your Password
            </span>
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Enter a new password for your account.
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <ValidatedInput
                name="password"
                label="New Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password (min. 8 characters)"
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
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            <ValidatedInput
              name="confirmPassword"
              label="Confirm New Password"
              type="password"
              placeholder="Confirm your new password"
              value={form.values.confirmPassword}
              error={form.errors.confirmPassword}
              touched={form.touched.confirmPassword}
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
                'Set New Password'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}