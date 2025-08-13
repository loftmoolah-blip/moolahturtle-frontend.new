
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Building, Mail, Phone, Camera, Edit, Lock, LogOut } from 'lucide-react';
import { Investor } from '@/api/entities';
import { User as UserEntity } from '@/api/entities';
import { UploadFile } from '@/api/integrations';
import { useFormValidation, ValidatedInput, validationRules } from '@/components/common/FormValidation';
import { useToast } from '@/components/common/Toast';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function InvestorProfile({ investor, show, onClose, onUpdate }) {
  const { success, error } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Form for profile editing
  const profileSchema = {
    full_name: [validationRules.required, validationRules.minLength(2)],
    company_name: [], // Optional field, no validation required
    email: [validationRules.required, validationRules.email],
    phone: [validationRules.required, validationRules.phone],
  };
  // Initialize profile form with investor data. This will re-initialize if investor prop changes.
  const profileForm = useFormValidation(investor || {}, profileSchema);
  
  // Form for password change
  const passwordSchema = {
    currentPassword: [validationRules.required],
    newPassword: [validationRules.required, validationRules.minLength(8)],
    confirmPassword: [validationRules.required, (val, formVals) => val === formVals.newPassword ? null : 'Passwords do not match'],
  };
  const passwordForm = useFormValidation({ currentPassword: '', newPassword: '', confirmPassword: '' }, passwordSchema);

  const handleSave = async () => {
    if (!profileForm.validateForm()) {
      error('Please fix the errors before saving.');
      return;
    }
    setIsSaving(true);
    try {
      const updatedInvestor = await Investor.update(investor.id, profileForm.values);
      onUpdate(updatedInvestor); // Update parent component's investor state
      profileForm.setValues(updatedInvestor); // Ensure form reflects the new saved data
      success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      error(err.message || 'Error updating profile.');
    }
    setIsSaving(false);
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await UploadFile({ file });
      const updatedInvestor = await Investor.update(investor.id, { 
        avatar_url: result.file_url 
      });
      onUpdate(updatedInvestor);
      success('Avatar updated!');
    } catch (err) {
      console.error('Error uploading avatar:', err);
      error(err.message || 'Error uploading avatar.');
    }
    setIsUploading(false);
  };

  const handlePasswordSubmit = async () => {
    if (!passwordForm.validateForm()) {
      error('Please correct the password fields.');
      return;
    }
    setIsChangingPassword(true);
    try {
      // In a real application, this would call an API to change password
      // For now, simulate a successful password change
      await new Promise(resolve => setTimeout(resolve, 1000));
      success('Password changed successfully!');
      setShowPasswordChange(false);
      passwordForm.resetForm();
    } catch (err) {
      console.error('Error changing password:', err);
      error(err.message || 'Failed to change password. Please try again.');
    }
    setIsChangingPassword(false);
  };
  
  const handleLogout = async () => {
    try {
      await UserEntity.logout();
      success('Logged out successfully.');
      // Redirect will happen automatically via AuthProvider or similar context
    } catch (err) {
      console.error('Error logging out:', err);
      error(err.message || 'Error logging out.');
    }
  };

  if (!investor) return null;

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Investor Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={investor.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xl">
                      {investor.full_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <label className="absolute -bottom-2 -right-2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer transition-colors">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{investor.full_name}</h3>
                  {investor.company_name && (
                    <p className="text-gray-600">{investor.company_name}</p>
                  )}
                </div>
                <Button 
                  onClick={() => {
                    if (isEditing) { // If currently in editing mode, and clicking "Cancel" (or the Edit button acting as cancel)
                      profileForm.setValues(investor); // Revert form values to original investor data
                    }
                    setIsEditing(!isEditing);
                  }}
                  variant={isEditing ? "outline" : "default"}
                  className="flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <ValidatedInput name="full_name" label="Full Name" {...profileForm.getProps('full_name')} />
                    <ValidatedInput name="company_name" label="Company Name" {...profileForm.getProps('company_name')} placeholder="Optional" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <ValidatedInput name="email" label="Email" type="email" {...profileForm.getProps('email')} />
                    <ValidatedInput name="phone" label="Phone" {...profileForm.getProps('phone')} />
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsEditing(false);
                        profileForm.setValues(investor); // Discard unsaved changes and reset form
                      }} 
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSave} 
                      disabled={isSaving || !profileForm.isValid} 
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSaving ? <LoadingSpinner size="small" showText={false} /> : 'Save Changes'}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{investor.full_name}</p>
                      <p className="text-sm text-gray-500">Full Name</p>
                    </div>
                  </div>
                  {investor.company_name && (
                    <div className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{investor.company_name}</p>
                        <p className="text-sm text-gray-500">Company</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{investor.email}</p>
                      <p className="text-sm text-gray-500">Email</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{investor.phone}</p>
                      <p className="text-sm text-gray-500">Phone</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Security & Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {showPasswordChange ? (
                <div className="space-y-4">
                  <ValidatedInput name="currentPassword" label="Current Password" type="password" {...passwordForm.getProps('currentPassword')} placeholder="Enter current password" />
                  <ValidatedInput name="newPassword" label="New Password" type="password" {...passwordForm.getProps('newPassword')} placeholder="Enter new password" />
                  <ValidatedInput name="confirmPassword" label="Confirm New Password" type="password" {...passwordForm.getProps('confirmPassword')} placeholder="Confirm new password" />
                  
                  <div className="flex justify-end gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowPasswordChange(false);
                        passwordForm.resetForm(); // Reset form values on cancel
                      }}
                      disabled={isChangingPassword}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handlePasswordSubmit}
                      disabled={isChangingPassword || !passwordForm.isValid}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isChangingPassword ? <LoadingSpinner size="small" showText={false} /> : 'Change Password'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowPasswordChange(true)}
                    className="flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Change Password
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
