import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, DollarSign, Plus, Minus, TrendingUp, TrendingDown } from "lucide-react";

const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
};

const PriceCounter = ({ label, icon, value, onUpdate, step = 5000, min = 0 }) => (
    <div className="flex items-center justify-between p-6 border-2 border-gray-200 rounded-xl bg-white">
        <div className="flex items-center gap-4">
            {React.cloneElement(icon, { className: "w-6 h-6 text-green-500" })}
            <span className="text-lg font-medium text-gray-700">{label}</span>
        </div>
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => onUpdate(Math.max(min, value - step))} disabled={value <= min} className="h-12 w-12">
                <Minus className="w-5 h-5" />
            </Button>
            <span className="text-2xl font-bold w-40 text-center text-gray-900">{formatCurrency(value)}</span>
            <Button variant="outline" size="icon" onClick={() => onUpdate(value + step)} className="h-12 w-12">
                <Plus className="w-5 h-5" />
            </Button>
        </div>
    </div>
);

export default function PropertyPricing({ data, onNext, onBack }) {
    const [desiredPrice, setDesiredPrice] = useState(data.desired_price || 250000);
    const [bottomPrice, setBottomPrice] = useState(data.bottom_price || 200000);

    const handleNext = () => {
        onNext({ desired_price: desiredPrice, bottom_price: bottomPrice });
    };

    return (
        <Card className="shadow-2xl border-0 max-w-4xl mx-auto">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                        <DollarSign className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-bold">What are your price expectations?</CardTitle>
                        <p className="text-gray-600 mt-1">This helps investors make relevant offers.</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <PriceCounter 
                        label="Desired Price" 
                        icon={<TrendingUp />} 
                        value={desiredPrice} 
                        onUpdate={setDesiredPrice}
                        min={0}
                    />
                    <PriceCounter 
                        label="Bottom Price" 
                        icon={<TrendingDown />} 
                        value={bottomPrice} 
                        onUpdate={(value) => setBottomPrice(Math.min(value, desiredPrice))}
                        min={0}
                    />
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-700">
                        <strong>Note:</strong> Your "Bottom Price" is the lowest offer you'd consider. This helps us filter offers for you and is not directly shared with investors.
                    </p>
                </div>
                <div className="flex justify-between items-center">
                    <Button variant="outline" onClick={onBack} className="py-6 px-8 text-lg">
                        <ArrowLeft className="mr-2" /> Back
                    </Button>
                    <Button onClick={handleNext} className="py-6 px-8 text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                        Next <ArrowRight className="ml-2" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}