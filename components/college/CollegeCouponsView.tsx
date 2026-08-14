'use client';

import React from 'react';
import { Ticket, Copy } from 'lucide-react';

interface CollegeCouponsViewProps {
  coupons: any[];
}

export const CollegeCouponsView: React.FC<CollegeCouponsViewProps> = ({ coupons }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-[24px] border border-borderLight shadow-xs">
        <h1 className="text-xl font-black text-textPrimary flex items-center gap-2">
          <Ticket className="h-6 w-6 text-brand" />
          Institutional Coupon Batches & Seat Distribution
        </h1>
        <p className="text-xs text-textMuted mt-1">
          Zero-cost single-use redeemable coupon codes allocated to your college by Engineers Clinic.
        </p>
      </div>

      <div className="space-y-4">
        {coupons.map((c) => (
          <div key={c.id} className="bg-white rounded-[24px] p-6 border border-borderLight shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand font-extrabold text-xs mb-2">
                <Ticket className="h-3.5 w-3.5" />
                {c.code}
              </div>
              <h3 className="text-sm font-black text-textPrimary">{c.programTitle}</h3>
              <p className="text-xs text-textMuted mt-0.5">Valid until {c.validUntil} • Zero Cost B2B Allocation</p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-lg font-black text-textPrimary">{c.redeemedSeats} / {c.totalSeats}</div>
                <div className="text-[10px] font-bold text-textMuted uppercase">Seats Redeemed</div>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(c.code);
                  alert(`Copied coupon code ${c.code} to clipboard!`);
                }}
                className="px-4 py-2 rounded-xl bg-bgSoft hover:bg-borderLight text-textPrimary font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="h-3.5 w-3.5" /> Copy Code
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
