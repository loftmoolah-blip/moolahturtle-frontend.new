
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Home,
  Bed,
  Bath,
  DollarSign,
  Eye,
  MoreHorizontal,
  MapPin,
  Camera,
  Edit,
  TrendingUp,
  TrendingDown,
  ArrowRightLeft
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from 'framer-motion';
import DealStatusCell from './DealStatusCell';
import ActionButtonsCell from './ActionButtonsCell';

export default function LeadsTable({ leads, onLeadClick, onAction }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const PropertyThumbnails = ({ property }) => {
    const photos = property?.photos;
    if (!photos) return <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
      <Camera className="w-4 h-4 text-green-500" />
    </div>;

    const allPhotos = [
      ...(photos.interior?.bedrooms || []).slice(0, 2),
      photos.interior?.living_room,
      photos.interior?.kitchen,
      photos.exterior?.front
    ].filter(Boolean).slice(0, 3);

    if (allPhotos.length === 0) {
      return <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
        <Camera className="w-4 h-4 text-green-500" />
      </div>;
    }

    return (
      <div className="flex -space-x-2">
        {allPhotos.map((photo, index) => (
          <img
            key={index}
            src={photo}
            alt={`Property ${index + 1}`}
            className="w-10 h-10 rounded-lg border-2 border-white object-cover cursor-pointer hover:z-10 hover:scale-110 transition-transform"
            onClick={(e) => {
              e.stopPropagation();
              // Handle image lightbox
            }}
          />
        ))}
        {allPhotos.length < 3 && (
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-green-100 rounded-lg border-2 border-white flex items-center justify-center">
            <span className="text-xs text-emerald-600 font-medium">+{3 - allPhotos.length}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-4 font-semibold text-gray-700 w-20">Lead ID</th>
              <th className="text-left py-4 px-4 font-semibold text-gray-700 w-1/5">Property</th>
              <th className="text-left py-4 px-4 font-semibold text-gray-700 w-1/6">Details</th>
              <th className="text-left py-4 px-4 font-semibold text-gray-700 w-1/4">Deal Status & Pricing</th>
              <th className="text-left py-4 px-4 font-semibold text-gray-700 w-1/8">Photos</th>
              <th className="text-right py-4 px-4 font-semibold text-gray-700 w-1/8">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, index) => {
              return (
                <motion.tr
                  key={lead.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4 align-top">
                    <div className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      #{lead.id.slice(-6).toUpperCase()}
                    </div>
                  </td>
                  <td className="py-4 px-4 align-top">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {lead.property?.address}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 align-top">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium">{lead.property?.property_type}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Bed className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{lead.property?.bedrooms}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{lead.property?.bathrooms}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 align-top">
                    <DealStatusCell lead={lead} />
                  </td>
                  <td className="py-4 px-4 align-top">
                    <PropertyThumbnails property={lead.property} />
                  </td>
                  <td className="py-4 px-4 text-right align-top">
                    <ActionButtonsCell
                      lead={lead}
                      onAction={onAction}
                      onLeadClick={onLeadClick}
                    />
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {leads.map((lead, index) => {
          return (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                    <p className="font-medium text-gray-900 text-sm">
                      {lead.property?.address}
                    </p>
                  </div>
                  <div className="text-xs font-mono text-gray-500 mt-1">
                    Lead #{lead.id.slice(-6).toUpperCase()}
                  </div>
                </div>
                <PropertyThumbnails property={lead.property} />
              </div>

              <div className="border-t border-gray-100 my-3"></div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">{lead.property?.property_type}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Bed className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{lead.property?.bedrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{lead.property?.bathrooms}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <DealStatusCell lead={lead} />
                </div>
              </div>

              <div className="border-t border-gray-100 my-3"></div>

              <div className="flex justify-between items-center">
                <ActionButtonsCell
                  lead={lead}
                  onAction={onAction}
                  onLeadClick={onLeadClick}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {leads.length === 0 && (
        <div className="text-center py-12">
          <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No leads available</h3>
          <p className="text-gray-500">
            Check back later for new property leads in your coverage areas.
          </p>
        </div>
      )}
    </div>
  );
}
