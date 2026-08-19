'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  GraduationCap,
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Mail,
  Building,
  BookOpen,
  Award,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { CustomDropdown } from '@/components/shared/CustomDropdown';
import { getAdminStudents } from '@/lib/api/admin';
import { showToast } from '@/lib/toast';

interface AdminStudentsListViewProps {
  onSelectStudent: (studentId: number) => void;
}

type StudentSortField = 'name' | 'email' | 'collegeName' | 'usn' | 'enrollmentCount' | 'createdAt';
type SortOrder = 'asc' | 'desc';

export const AdminStudentsListView: React.FC<AdminStudentsListViewProps> = ({
  onSelectStudent,
}) => {
  const [students, setStudents] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // DataTable State
  const [sortField, setSortField] = useState<StudentSortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchStudentsList = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await getAdminStudents({
        page: currentPage,
        limit: pageSize,
        search: searchTerm.trim() || undefined,
      });

      if (res && res.data && res.meta) {
        setStudents(res.data);
        setTotalCount(res.meta.total);
        setTotalPages(res.meta.totalPages);
      } else if (Array.isArray(res)) {
        setStudents(res);
        setTotalCount(res.length);
        setTotalPages(Math.ceil(res.length / pageSize) || 1);
      }
      if (isManual) {
        showToast.success('Students directory refreshed', 'Synced');
      }
    } catch (err: any) {
      showToast.error(err.message || 'Failed to fetch students list', 'Error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStudentsList();
  }, [currentPage, pageSize, searchTerm]);

  const handleSort = (field: StudentSortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Sorted Students for the active page
  const sortedStudents = useMemo(() => {
    const list = [...students];
    list.sort((a, b) => {
      let valA: any = a[sortField] ?? '';
      let valB: any = b[sortField] ?? '';

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [students, sortField, sortOrder]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const startIndex = (currentPage - 1) * pageSize;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[24px] border border-borderLight shadow-xs">
        <div>
          <h1 className="text-xl font-black text-textPrimary flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-brand" />
            Students Directory & Dossier Registry
          </h1>
          <p className="text-xs text-textMuted mt-1">
            Browse enrolled student cohorts, inspect academic progression, review submission metrics, and verify awarded certificates.
          </p>
        </div>

        <button
          onClick={() => fetchStudentsList(true)}
          disabled={refreshing || loading}
          className="inline-flex items-center gap-2 rounded-xl border border-borderLight bg-bgSoft px-3.5 py-2 text-xs font-bold text-textPrimary hover:bg-borderLight hover:text-brand transition cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin text-brand' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh Directory'}</span>
        </button>
      </div>

      {/* Datatable Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-5 rounded-[20px] border border-borderLight shadow-xs">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-textMuted" />
          <input
            type="text"
            placeholder="Search by name, email, USN, college, or branch..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-xl bg-bgSoft pl-10 pr-4 py-2.5 text-xs font-bold text-textPrimary placeholder:text-textMuted border border-borderLight/60 focus:outline-none focus:border-brand"
          />
        </div>

        {/* Page Size Selector */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2 text-xs font-bold text-textMuted pl-3">
            <span>Rows per page:</span>
            <div className="w-20">
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
        </div>
      </div>

      {/* Students DataTable Container */}
      <div className="bg-white rounded-[24px] border border-borderLight shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-borderLight bg-bgSoft/60 text-[11px] font-extrabold uppercase tracking-wider text-textMuted">
                <th
                  className="py-4 px-6 cursor-pointer hover:text-brand transition"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Student Profile</span>
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </div>
                </th>
                <th
                  className="py-4 px-6 cursor-pointer hover:text-brand transition"
                  onClick={() => handleSort('collegeName')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Institution / Branch</span>
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </div>
                </th>
                <th
                  className="py-4 px-6 cursor-pointer hover:text-brand transition"
                  onClick={() => handleSort('usn')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>USN / Cohort</span>
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </div>
                </th>
                <th
                  className="py-4 px-6 cursor-pointer hover:text-brand transition"
                  onClick={() => handleSort('enrollmentCount')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Tracks & Reviews</span>
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </div>
                </th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderLight/60 text-xs font-medium text-textPrimary">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-textMuted">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="h-8 w-8 animate-spin text-brand" />
                      <span className="text-xs font-bold uppercase tracking-wider text-textMuted">
                        Loading Students from Server...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : sortedStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-textMuted">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <GraduationCap className="h-8 w-8 text-textMuted/40" />
                      <span className="text-sm font-black text-textPrimary">No Students Found</span>
                      <p className="text-xs text-textMuted">
                        {searchTerm
                          ? 'No student profiles matched your search keyword.'
                          : 'No students registered in the platform database yet.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedStudents.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => onSelectStudent(s.id)}
                    className="hover:bg-bgSoft/40 transition-colors cursor-pointer group"
                  >
                    {/* Student Profile (Avatar + Name + Email) */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand font-black text-xs group-hover:bg-brand group-hover:text-white transition-all shadow-2xs">
                          {(s.firstName?.[0] || s.email?.[0] || 'S').toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-black text-textPrimary text-sm group-hover:text-brand transition-colors">
                            {s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Student'}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-textMuted mt-0.5">
                            <Mail className="h-3 w-3 shrink-0" />
                            <span className="truncate">{s.email || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* College & Branch */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-textPrimary">
                        <Building className="h-3.5 w-3.5 text-brand shrink-0" />
                        <span className="truncate max-w-[200px]">{s.collegeName || 'Self-Enrolled / Direct'}</span>
                      </div>
                      {s.branch && (
                        <div className="text-[11px] font-bold text-textMuted mt-0.5 pl-5">
                          {s.branch} {s.graduationYear ? `• Class of ${s.graduationYear}` : ''}
                        </div>
                      )}
                    </td>

                    {/* USN / Cohort */}
                    <td className="py-4 px-6">
                      <div className="font-mono text-xs font-bold text-textPrimary">
                        {s.usn || 'N/A'}
                      </div>
                      <div className="text-[10px] font-bold text-textMuted uppercase tracking-wider mt-0.5">
                        {s.countryName || 'Global'}
                      </div>
                    </td>

                    {/* Tracks & Reviews Badges */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700 border border-blue-200">
                          <BookOpen className="h-3 w-3 text-blue-500" />
                          {s.enrollmentCount || 0} Tracks
                        </span>
                        {s.certificateCount > 0 && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                            <Award className="h-3 w-3 text-emerald-500" />
                            {s.certificateCount} Certs
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Action */}
                    <td
                      className="py-4 px-6 text-right whitespace-nowrap min-w-[80px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => onSelectStudent(s.id)}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-brand/10 text-brand hover:bg-brand hover:text-white transition-all cursor-pointer shadow-2xs shrink-0"
                        title="View Student Dossier"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
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
            Showing <span className="text-textPrimary font-black">{totalCount > 0 ? startIndex + 1 : 0}</span> to{' '}
            <span className="text-textPrimary font-black">{Math.min(startIndex + pageSize, totalCount)}</span> of{' '}
            <span className="text-textPrimary font-black">{totalCount}</span> students
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
    </div>
  );
};
