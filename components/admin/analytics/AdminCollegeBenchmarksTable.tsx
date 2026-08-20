'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  Award,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw,
  Loader2,
  ArrowUpDown,
} from 'lucide-react';
import { getAdminAnalyticsColleges } from '@/lib/api/admin';
import { CustomDropdown } from '@/components/shared/CustomDropdown';

export const AdminCollegeBenchmarksTable: React.FC = () => {
  const [colleges, setColleges] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Sorting
  const [sortField, setSortField] = useState<string>('totalRevenue');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchColleges = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await getAdminAnalyticsColleges({
        page: currentPage,
        limit: pageSize,
        search: searchTerm.trim() || undefined,
      });

      if (res && res.data && res.meta) {
        setColleges(res.data);
        setTotalCount(res.meta.total);
        setTotalPages(res.meta.totalPages);
      } else if (Array.isArray(res)) {
        setColleges(res);
        setTotalCount(res.length);
        setTotalPages(Math.ceil(res.length / pageSize) || 1);
      }
    } catch (err) {
      console.error('Failed to fetch college benchmarks:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, [currentPage, pageSize, searchTerm]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedColleges = [...colleges].sort((a, b) => {
    let valA = a[sortField] ?? '';
    let valB = b[sortField] ?? '';

    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const startIndex = (currentPage - 1) * pageSize;

  return (
    <div className="rounded-[28px] border border-borderLight bg-white shadow-xs overflow-hidden">
      {/* Header with Search and Per-Page Selector */}
      <div className="p-6 border-b border-borderLight flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h3 className="text-base font-black text-textPrimary">5. B2B Institutional Cohort Benchmarks</h3>
          <p className="text-xs text-textMuted">Partner college performance audit, seat utilization, and certificate output</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-textMuted" />
            <input
              type="text"
              placeholder="Search partner college..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl bg-bgSoft pl-9 pr-3 py-2 text-xs font-bold text-textPrimary placeholder:text-textMuted border border-borderLight focus:outline-none focus:border-brand"
            />
          </div>

          {/* Rows per page */}
          <div className="flex items-center gap-2 text-xs font-bold text-textMuted">
            <span>Rows:</span>
            <div className="w-24 min-w-[88px]">
              <CustomDropdown
                options={[10, 25, 50]}
                value={pageSize}
                onChange={(val) => {
                  setPageSize(Number(val));
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          <button
            onClick={() => fetchColleges(true)}
            disabled={refreshing || loading}
            className="p-2 rounded-xl border border-borderLight hover:bg-bgSoft text-textMuted hover:text-brand transition cursor-pointer disabled:opacity-50"
            title="Refresh Benchmarks"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin text-brand' : ''}`} />
          </button>
        </div>
      </div>

      {/* Datatable Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-borderLight bg-bgSoft/60 text-[11px] font-extrabold uppercase tracking-wider text-textMuted">
              <th
                className="py-3.5 px-6 cursor-pointer hover:text-brand transition select-none"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1.5">
                  <span>College / University</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                className="py-3.5 px-4 cursor-pointer hover:text-brand transition select-none"
                onClick={() => handleSort('seatsBought')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Seats Bought</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                className="py-3.5 px-4 cursor-pointer hover:text-brand transition select-none"
                onClick={() => handleSort('redeemedSeats')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Redeemed</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                className="py-3.5 px-4 cursor-pointer hover:text-brand transition select-none"
                onClick={() => handleSort('seatUtilizationPct')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Seat Util. %</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                className="py-3.5 px-4 cursor-pointer hover:text-brand transition select-none"
                onClick={() => handleSort('avgScore')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Avg Score</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                className="py-3.5 px-4 cursor-pointer hover:text-brand transition select-none"
                onClick={() => handleSort('certCount')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Passed Certs</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                className="py-3.5 px-6 text-right cursor-pointer hover:text-brand transition select-none"
                onClick={() => handleSort('totalRevenue')}
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Revenue (INR)</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borderLight/60 text-xs font-medium text-textPrimary">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-textMuted">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-brand" />
                    <span className="text-xs font-bold uppercase tracking-wider text-textMuted">
                      Loading benchmarks...
                    </span>
                  </div>
                </td>
              </tr>
            ) : sortedColleges.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-textMuted">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <Building2 className="h-8 w-8 text-textMuted/40" />
                    <span className="text-sm font-black text-textPrimary">No Institutions Found</span>
                    <p className="text-xs text-textMuted">
                      {searchTerm
                        ? 'No partner colleges match your search keyword.'
                        : 'No partner colleges registered yet.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedColleges.map((c) => (
                <tr key={c.id} className="hover:bg-bgSoft/40 transition-colors">
                  <td className="py-4 px-6 font-bold text-textPrimary flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-brand shrink-0" />
                    <span>{c.name}</span>
                  </td>
                  <td className="py-4 px-4 font-bold">{c.seatsBought}</td>
                  <td className="py-4 px-4 font-bold">{c.redeemedSeats}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md font-extrabold text-[11px] ${
                        c.seatUtilizationPct >= 75
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : c.seatUtilizationPct >= 50
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {c.seatUtilizationPct}%
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold">{c.avgScore} / 100</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                      <Award className="h-3.5 w-3.5 text-emerald-500" />
                      {c.certCount}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-black text-textPrimary">
                    ₹ {c.totalRevenue.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-bgSoft/40 border-t border-borderLight text-xs font-bold text-textMuted">
        <div>
          Showing <span className="text-textPrimary font-black">{totalCount > 0 ? startIndex + 1 : 0}</span> to{' '}
          <span className="text-textPrimary font-black">{Math.min(startIndex + pageSize, totalCount)}</span> of{' '}
          <span className="text-textPrimary font-black">{totalCount}</span> partner institutions
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1 || loading}
            className="p-1.5 rounded-lg border border-borderLight bg-white text-textPrimary hover:bg-bgSoft disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="First Page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="p-1.5 rounded-lg border border-borderLight bg-white text-textPrimary hover:bg-bgSoft disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Previous Page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <span className="px-3 text-xs font-black text-textPrimary">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="p-1.5 rounded-lg border border-borderLight bg-white text-textPrimary hover:bg-bgSoft disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Next Page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages || loading}
            className="p-1.5 rounded-lg border border-borderLight bg-white text-textPrimary hover:bg-bgSoft disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Last Page"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
