import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFormValidation, ValidatedInput, validationRules } from '@/components/common/FormValidation';
import { useToast } from '@/components/common/Toast';

export default function PropertyDetails() {
  const navigate = useNavigate();
  const { success, error } = useToast();

  const urlParams = new URLSearchParams(window.location.search);
  const sellerId = urlParams.get('seller_id');

  const formSchema = {
    address: [validationRules.required],
    type: [validationRules.required],
    condition: [validationRules.required],
    price: [validationRules.required, validationRules.positiveNumber]
  };

  const form = useFormValidation(
    { address: '', type: '', condition: '', price: '' },
    formSchema
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.validateForm()) {
      error('Please complete all fields correctly');
      return;
    }

    const propertyId = Date.now().toString();
    const propertyData = { ...form.values, sellerId, propertyId };
    try {
      localStorage.setItem('moolahturtle_property', JSON.stringify(propertyData));
    } catch {
      // ignore storage errors
    }
    success('Property details saved');
    navigate(createPageUrl(`PhotoUpload?seller_id=${sellerId || ''}&property_id=${propertyId}`));
  };

  return (
    <div className="min-h-[calc(10vh-8rem)] flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-lg mx-auto shadow-2xl border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Property Details</CardTitle>
          <p className="text-gray-600 mt-1">Tell us about the property you're selling</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <ValidatedInput
              name="address"
              label="Property Address"
              placeholder="123 Main St"
              value={form.values.address}
              error={form.errors.address}
              touched={form.touched.address}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              required
            />
            <ValidatedInput
              name="type"
              label="Property Type"
              placeholder="Single Family, Condo, etc."
              value={form.values.type}
              error={form.errors.type}
              touched={form.touched.type}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              required
            />
            <ValidatedInput
              name="condition"
              label="Property Condition"
              placeholder="Excellent, Good, Needs work..."
              value={form.values.condition}
              error={form.errors.condition}
              touched={form.touched.condition}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              required
            />
            <ValidatedInput
              name="price"
              label="Asking Price"
              placeholder="500000"
              value={form.values.price}
              error={form.errors.price}
              touched={form.touched.price}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              required
            />
            <Button
              type="submit"
              className="w-full py-6 text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
