'use client';

import React, { useState, useMemo } from 'react';
import {
  School,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

interface AdminCollegesViewProps {
  colleges: any[];
  onApproveCollege: (id: number) => void;
  onRejectCollege: (id: number) => void;
}

type SortField = 'name' | 'address' | 'countryName' | 'status' | 'studentCount' | 'memberCount';
type SortOrder = 'asc' | 'desc';

export const AdminCollegesView: React.FC<AdminCollegesViewProps> = ({
  colleges,
  onApproveCollege,
  onRejectCollege,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // DataTable State
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // 1. Filtered and Sorted Data
  const filteredAndSortedColleges = useMemo(() => {
    let result = colleges.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.countryName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    result.sort((a, b) => {
      let valA = a[sortField] ?? '';
      let valB = b[sortField] ?? '';

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [colleges, searchTerm, statusFilter, sortField, sortOrder]);

  // 2. Pagination Calculations
  const totalEntries = filteredAndSortedColleges.length;
  const totalPages = Math.ceil(totalEntries / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedColleges = filteredAndSortedColleges.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[24px] border border-borderLight shadow-xs">
        <div>
          <h1 className="text-xl font-black text-textPrimary flex items-center gap-2">
            <School className="h-6 w-6 text-warning" />
            B2B Colleges & Seats Administration
          </h1>
          <p className="text-xs text-textMuted mt-1">
            Vet institution registration applications, manage zero-cost coupon batches, and monitor student cohorts.
          </p>
        </div>
      </div>

      {/* Datatable Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-5 rounded-[20px] border border-borderLight shadow-xs">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-textMuted" />
          <input
            type="text"
            placeholder="Search colleges, address, country..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-xl bg-bgSoft pl-10 pr-4 py-2.5 text-xs font-bold text-textPrimary placeholder:text-textMuted border border-borderLight/60 focus:outline-none focus:border-brand"
          />
        </div>

        {/* Filters & Page Size Selector */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <Filter className="h-4 w-4 text-textMuted shrink-0 mr-1" />
            {['all', 'pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold capitalize transition-all cursor-pointer ${
                  statusFilter === status
                    ? 'bg-brand text-white shadow-xs'
                    : 'bg-bgSoft text-textPrimary hover:bg-borderLight'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-textMuted border-l border-borderLight pl-3">
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-lg bg-bgSoft px-2 py-1 text-xs font-black text-textPrimary border border-borderLight outline-none cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Datatable Wrapper */}
      <div className="bg-white rounded-[24px] border border-borderLight shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bgSoft/80 border-b border-borderLight text-[11px] font-extrabold uppercase tracking-wider text-textMuted select-none">
                <th
                  onClick={() => handleSort('name')}
                  className="py-4 px-5 cursor-pointer hover:text-brand transition-all"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Institution Name</span>
                    <ArrowUpDown className="h-3 w-3 text-textMuted" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('address')}
                  className="py-4 px-4 cursor-pointer hover:text-brand transition-all"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Location & Country</span>
                    <ArrowUpDown className="h-3 w-3 text-textMuted" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="py-4 px-4 cursor-pointer hover:text-brand transition-all"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Status</span>
                    <ArrowUpDown className="h-3 w-3 text-textMuted" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('studentCount')}
                  className="py-4 px-4 text-center cursor-pointer hover:text-brand transition-all"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Enrolled Students</span>
                    <ArrowUpDown className="h-3 w-3 text-textMuted" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('memberCount')}
                  className="py-4 px-4 text-center cursor-pointer hover:text-brand transition-all"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Admin Members</span>
                    <ArrowUpDown className="h-3 w-3 text-textMuted" />
                  </div>
                </th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderLight/60 text-xs">
              {paginatedColleges.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-textMuted font-bold">
                    No colleges found matching criteria.
                  </td>
                </tr>
              ) : (
                paginatedColleges.map((c) => (
                  <tr key={c.id} className="hover:bg-bgSoft/40 transition-all">
                    <td className="py-4 px-5">
                      <div className="font-black text-textPrimary">{c.name}</div>
                      <div className="text-[10px] text-textMuted">ID: #{c.id}</div>
                    </td>
                    <td className="py-4 px-4 font-medium text-textPrimary">
                      {c.address}
                      <div className="text-[10px] text-textMuted font-bold">{c.countryName}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          c.status === 'approved'
                            ? 'bg-statusPassedBg text-statusPassedText'
                            : c.status === 'pending'
                            ? 'bg-statusEvaluatingBg text-statusEvaluatingText'
                            : 'bg-statusErrorBg text-statusErrorText'
                        }`}
                      >
                        {c.status === 'approved' && <CheckCircle2 className="h-3 w-3" />}
                        {c.status === 'pending' && <Clock className="h-3 w-3" />}
                        {c.status === 'rejected' && <XCircle className="h-3 w-3" />}
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center font-black text-textPrimary">
                      {c.studentCount || 0}
                    </td>
                    <td className="py-4 px-4 text-center font-black text-textPrimary">
                      {c.memberCount || 0}
                    </td>
                    <td className="py-4 px-5 text-right space-x-2">
                      {c.status !== 'approved' && (
                        <button
                          onClick={() => onApproveCollege(c.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-success text-white hover:bg-successDark font-extrabold text-[11px] transition-all cursor-pointer shadow-xs"
                        >
                          Approve
                        </button>
                      )}
                      {c.status !== 'rejected' && (
                        <button
                          onClick={() => onRejectCollege(c.id)}
                          className="px-3 py-1.5 rounded-xl bg-dangerLight text-danger hover:bg-danger hover:text-white font-extrabold text-[11px] transition-all cursor-pointer"
                        >
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Datatable Footer / Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-bgSoft/40 border-t border-borderLight text-xs font-bold text-textMuted">
          <div>
            Showing <span className="text-textPrimary font-black">{totalEntries > 0 ? startIndex + 1 : 0}</span> to{' '}
            <span className="text-textPrimary font-black">{Math.min(startIndex + pageSize, totalEntries)}</span> of{' '}
            <span className="text-textPrimary font-black">{totalEntries}</span> entries
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-borderLight bg-white text-textPrimary hover:bg-bgSoft disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title="First Page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
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
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-borderLight bg-white text-textPrimary hover:bg-bgSoft disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-borderLight bg-white text-textPrimary hover:bg-bgSoft disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title="Last Page"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
