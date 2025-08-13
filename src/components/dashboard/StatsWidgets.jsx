import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Handshake, Clock, ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';

const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return '$0';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

export default function StatsWidgets({ leads }) {
    const closedDeals = leads.filter(l => l.dealStatus === 'purchased');
    const closedDealsAmount = closedDeals.reduce((sum, l) => sum + (l.offerAmount || 0), 0);

    const pendingOffers = leads.filter(l => ['pending', 'countered'].includes(l.dealStatus));
    const pendingOffersAmount = pendingOffers.reduce((sum, l) => sum + (l.offerAmount || l.desiredPrice || 0), 0);

    const allLeadsValue = leads.reduce((sum, l) => sum + (l.desiredPrice || 0), 0);

    const stats = [
        {
            title: "Closed Deals Amount",
            value: closedDeals.length,
            amount: formatCurrency(closedDealsAmount),
            icon: Handshake,
            color: "bg-gray-800 text-white",
            bgColor: "bg-gray-50"
        },
        {
            title: "Pending Offers Amount",
            value: pendingOffers.length,
            amount: formatCurrency(pendingOffersAmount),
            icon: Clock,
            color: "bg-yellow-500 text-white",
            bgColor: "bg-yellow-50"
        },
        {
            title: "All Leads Value",
            value: leads.length,
            amount: formatCurrency(allLeadsValue),
            icon: ClipboardList,
            color: "bg-green-500 text-white",
            bgColor: "bg-green-50"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Card className={`overflow-hidden shadow-lg border-0 ${stat.bgColor}`}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stat.color}`}>
                                <stat.icon className="w-4 h-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-gray-900">{stat.amount}</div>
                            <p className="text-xs text-gray-500 mt-1">
                                From {stat.value} {stat.value === 1 ? 'deal' : 'deals'}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}