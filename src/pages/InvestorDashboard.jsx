import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, MapPin, Home, Bed, Bath, DollarSign, Eye, MoreHorizontal, Plus, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/hooks/useAuth';
import { InvestorService } from '@/components/services/investorService';

// Mock components for now to prevent import errors
const StatsWidgets = ({ leads }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Leads</p>
            <p className="text-2xl font-bold text-gray-900">{leads?.length || 0}</p>
          </div>
          <Home className="w-8 h-8 text-green-600" />
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Active Offers</p>
            <p className="text-2xl font-bold text-gray-900">{leads?.filter(l => l.dealStatus === 'Offer Made')?.length || 0}</p>
          </div>
          <DollarSign className="w-8 h-8 text-blue-600" />
        </div>
      </CardContent>
    </Card>
  </div>
);

const InvestorProfile = ({ investor, show, onClose, onUpdate }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <Card className="w-full max-w-md m-4">
        <CardHeader>
          <CardTitle>Profile (Mock)</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Profile component placeholder</p>
          <Button onClick={onClose} className="mt-4">Close</Button>
        </CardContent>
      </Card>
    </div>
  );
};

const CoverageMapDisplay = ({ investor, onEditCoverage }) => (
  <Card className="mb-8">
    <CardHeader>
      <CardTitle>Coverage Areas (Mock)</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Coverage areas: {investor?.coverage_areas?.length || 0} states</p>
      <Button onClick={onEditCoverage} className="mt-2">Edit Coverage</Button>
    </CardContent>
  </Card>
);

const LeadsTable = ({ leads, onLeadClick, onAction }) => (
  <div className="space-y-4">
    {leads?.length === 0 ? (
      <p className="text-center text-gray-500 py-8">No leads available</p>
    ) : (
      leads?.map((lead, index) => (
        <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onLeadClick(lead)}>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{lead.property?.address || 'Property Address'}</h3>
                <p className="text-sm text-gray-600">${lead.askingPrice?.toLocaleString() || 'N/A'}</p>
              </div>
              <Badge>{lead.dealStatus || 'New'}</Badge>
            </div>
          </CardContent>
        </Card>
      ))
    )}
  </div>
);

const LeadDetailModal = ({ lead, onClose }) => {
  if (!lead) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <Card className="w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Lead Details (Mock)</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Lead details for: {lead.property?.address}</p>
          <Button onClick={onClose} className="mt-4">Close</Button>
        </CardContent>
      </Card>
    </div>
  );
};

const ActionModal = ({ show, onClose }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <Card className="w-full max-w-md m-4">
        <CardHeader>
          <CardTitle>Action Modal (Mock)</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Action modal placeholder</p>
          <Button onClick={onClose} className="mt-4">Close</Button>
        </CardContent>
      </Card>
    </div>
  );
};

const CoverageEditModal = ({ show, onClose }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <Card className="w-full max-w-md m-4">
        <CardHeader>
          <CardTitle>Edit Coverage (Mock)</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Coverage edit modal placeholder</p>
          <Button onClick={onClose} className="mt-4">Close</Button>
        </CardContent>
      </Card>
    </div>
  );
};

import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function InvestorDashboard() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [investor, setInvestor] = useState(null);
  const [leads, setLeads] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [actionModal, setActionModal] = useState({ show: false, action: '', leadId: null });
  const [showCoverageEdit, setShowCoverageEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait until authentication status is determined
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate(createPageUrl('InvestorLogin'));
      } else {
        setInvestor(user);
        loadDashboardData(user?.id);
      }
    }
  }, [authLoading, isAuthenticated, user, navigate]);

  const loadDashboardData = async (investorId) => {
    if (!investorId) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      // Mock data for now to prevent API errors
      const mockLeads = [
        {
          id: 1,
          property: { address: '123 Main St, City, State' },
          askingPrice: 250000,
          dealStatus: 'New'
        },
        {
          id: 2,
          property: { address: '456 Oak Ave, Town, State' },
          askingPrice: 180000,
          dealStatus: 'Offer Made'
        }
      ];
      setLeads(mockLeads);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (action, leadId) => {
    console.log('Action:', action, 'Lead ID:', leadId);
  };

  const handleLeadClick = (lead) => {
    setSelectedLead(lead);
  };

  const handleEditCoverage = () => {
    setShowCoverageEdit(true);
  };

  const handleCoverageUpdate = (updatedCoverageAreas) => {
    setInvestor(prev => ({
      ...prev,
      coverage_areas: updatedCoverageAreas
    }));
    setShowCoverageEdit(false);
  };

  // Show loading spinner if authentication is in progress or data is loading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Fallback for unauthenticated or if investor data is not available
  if (!isAuthenticated || !investor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Authentication required</p>
          <Button onClick={() => navigate(createPageUrl('InvestorLogin'))} className="mt-4">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Investor Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {investor?.full_name || 'Investor'}!</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowProfile(true)}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Profile
            </Button>
            <Avatar className="h-10 w-10 cursor-pointer" onClick={() => setShowProfile(true)}>
              <AvatarImage src={investor?.avatar_url} />
              <AvatarFallback className="bg-green-500 text-white">
                {investor?.full_name?.charAt(0) || 'I'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Stats Widgets */}
        <StatsWidgets leads={leads} />

        {/* Coverage Map */}
        <CoverageMapDisplay investor={investor} onEditCoverage={handleEditCoverage} />

        {/* Leads Section */}
        <div className="mt-8">
          <Card className="shadow-xl border-0">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl font-bold">Property Leads</CardTitle>
                  <p className="text-gray-600 mt-1">
                    {leads.length} properties available in your coverage areas
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
                  {leads.filter(l => l.dealStatus === 'New').length} New
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <LeadsTable
                leads={leads}
                onLeadClick={handleLeadClick}
                onAction={handleAction}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <InvestorProfile
        investor={investor}
        show={showProfile}
        onClose={() => setShowProfile(false)}
        onUpdate={setInvestor}
      />

      <LeadDetailModal
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
      />

      <ActionModal
        show={actionModal.show}
        onClose={() => setActionModal({ show: false, action: '', leadId: null })}
      />

      <CoverageEditModal
        show={showCoverageEdit}
        onClose={() => setShowCoverageEdit(false)}
      />
    </div>
  );
}