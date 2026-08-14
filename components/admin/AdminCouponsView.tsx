'use client';

import React from 'react';
import { CreditCard, Tag, Plus, CheckCircle2 } from 'lucide-react';

export const AdminCouponsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-[24px] border border-borderLight shadow-xs flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black text-textPrimary flex items-center gap-2">
            <Tag className="h-6 w-6 text-blue-600" />
            B2B Coupon Engine & Bulk Seats
          </h1>
          <p className="text-xs text-textMuted mt-1">
            Generate program-bound single-use zero-cost coupons for partner colleges.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[24px] p-8 border border-borderLight text-center space-y-4 shadow-xs">
        <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto font-black text-sm">
          ₹0
        </div>
        <h3 className="text-base font-black text-textPrimary">Zero-Cost B2B Distribution Pipeline</h3>
        <p className="text-xs text-textMuted max-w-md mx-auto">
          Coupons are bound to specific internship programs and single-use per student. Enrolment, workspace, and evaluation paths remain identical to direct pay.
        </p>
      </div>
    </div>
  );
};
