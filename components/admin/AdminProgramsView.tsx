'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Globe,
  Trash2,
  Pencil,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { Program } from '@/types/catalog';
import { deleteProgram } from '@/lib/api/catalog';
import { AdminCreateProgramView } from './AdminCreateProgramView';
import { useAuth } from '@/context/AuthContext';

interface AdminProgramsViewProps {
  programs: Program[];
  onProgramUpdated?: () => void;
}

type ProgramSortField = 'title' | 'durationHours' | 'status' | 'createdAt';
type SortOrder = 'asc' | 'desc';

export const AdminProgramsView: React.FC<AdminProgramsViewProps> = ({
  programs,
  onProgramUpdated,
}) => {
  const { user, roleName } = useAuth();
  const activeRole = roleName || (user as any)?.role?.name || (typeof user?.role === 'string' ? user.role : 'student');
  const canManageCatalogue = activeRole === 'super_admin' || activeRole === 'admin';

  const [mode, setMode] = useState<'list' | 'create'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // DataTable State
  const [sortField, setSortField] = useState<ProgramSortField>('title');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSort = (field: ProgramSortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleDeleteProgram = async (id: number, title: string) => {
    if (confirm(`Are you sure you want to delete the program "${title}"?`)) {
      try {
        await deleteProgram(id);
        if (onProgramUpdated) onProgramUpdated();
      } catch (err: any) {
        alert(err.message || 'Failed to delete program');
      }
    }
  };

  // 1. Filtered & Sorted Programs
  const filteredAndSortedPrograms = useMemo(() => {
    let result = (programs || []).filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    result.sort((a, b) => {
      let valA: any = a[sortField] ?? '';
      let valB: any = b[sortField] ?? '';

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [programs, searchTerm, statusFilter, sortField, sortOrder]);

  // 2. Pagination Calculations
  const totalEntries = filteredAndSortedPrograms.length;
  const totalPages = Math.ceil(totalEntries / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedPrograms = filteredAndSortedPrograms.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Full Page Create View Mode (Fallback if embedded)
  if (mode === 'create') {
    return (
      <AdminCreateProgramView
        onBack={() => setMode('list')}
        onSuccess={() => {
          if (onProgramUpdated) onProgramUpdated();
          setMode('list');
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[24px] border border-borderLight shadow-xs">
        <div>
          <h1 className="text-xl font-black text-textPrimary flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-brand" />
            Catalog Internship Programs Management
          </h1>
          <p className="text-xs text-textMuted mt-1">
            Author and publish 120-hour internship programs, configure multi-country pricing, and structure capstone project pools.
          </p>
        </div>
        {canManageCatalogue && (
          <Link
            href="/admin/program"
            className="rounded-xl bg-gradient-to-r from-textPrimary via-gray-900 to-brand text-white px-4 py-2.5 text-xs font-black transition-all hover:scale-[1.01] cursor-pointer shadow-md flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Program</span>
          </Link>
        )}
      </div>

      {/* Datatable Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-5 rounded-[20px] border border-borderLight shadow-xs">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-textMuted" />
          <input
            type="text"
            placeholder="Search title, slug, description..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-xl bg-bgSoft pl-10 pr-4 py-2.5 text-xs font-bold text-textPrimary placeholder:text-textMuted border border-borderLight/60 focus:outline-none focus:border-brand"
          />
        </div>

        {/* Status Filters & Page Size Selector */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <Filter className="h-4 w-4 text-textMuted shrink-0 mr-1" />
            {['all', 'published', 'draft', 'archived'].map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold capitalize transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-brand text-white shadow-xs'
                    : 'bg-bgSoft text-textPrimary hover:bg-borderLight'
                }`}
              >
                {st}
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
                  onClick={() => handleSort('title')}
                  className="py-4 px-5 cursor-pointer hover:text-brand transition-all"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Program Title & Slug</span>
                    <ArrowUpDown className="h-3 w-3 text-textMuted" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('durationHours')}
                  className="py-4 px-4 text-center cursor-pointer hover:text-brand transition-all"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Duration</span>
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
                <th className="py-4 px-4">Country Pricings</th>
                {canManageCatalogue && <th className="py-4 px-5 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-borderLight/60 text-xs">
              {paginatedPrograms.length === 0 ? (
                <tr>
                  <td colSpan={canManageCatalogue ? 5 : 4} className="py-12 text-center text-textMuted font-bold">
                    No catalog programs found matching criteria.
                  </td>
                </tr>
              ) : (
                paginatedPrograms.map((prog) => (
                  <tr key={prog.id} className="hover:bg-bgSoft/40 transition-all">
                    <td className="py-4 px-5">
                      <div className="font-black text-textPrimary">{prog.title}</div>
                      <div className="text-[10px] text-textMuted font-medium">{prog.slug}</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-block px-3 py-1 rounded-full bg-brand/10 text-brand font-extrabold text-[10px]">
                        {prog.durationHours || 120} Hours
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          prog.status === 'published'
                            ? 'bg-statusPassedBg text-statusPassedText'
                            : 'bg-statusEvaluatingBg text-statusEvaluatingText'
                        }`}
                      >
                        {prog.status === 'published' ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <Clock className="h-3 w-3" />
                        )}
                        {prog.status || 'published'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-textPrimary">
                        <Globe className="h-3.5 w-3.5 text-brand" />
                        <span>
                          {prog.pricings?.[0]
                            ? `${prog.pricings[0].currency} ${prog.pricings[0].amount}`
                            : '₹4,999'}
                        </span>
                      </div>
                    </td>
                    {canManageCatalogue && (
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/program?id=${prog.id}`}
                            className="p-2 rounded-xl text-brand hover:bg-brand/10 transition-all cursor-pointer inline-flex items-center justify-center"
                            title="Edit Program"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteProgram(prog.id, prog.title)}
                            className="p-2 rounded-xl text-danger hover:bg-dangerLight hover:text-dangerDark transition-all cursor-pointer inline-flex items-center justify-center"
                            title="Delete Program"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    )}
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
