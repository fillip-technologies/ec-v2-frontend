'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  GraduationCap,
  Search,
  Filter,
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
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // DataTable State
  const [sortField, setSortField] = useState<StudentSortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchStudentsList = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await getAdminStudents();
      setStudents(Array.isArray(data) ? data : []);
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
  }, []);

  const handleSort = (field: StudentSortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // 1. Filtered and Sorted Students
  const filteredAndSortedStudents = useMemo(() => {
    let result = students.filter((s) => {
      const name = s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim();
      const email = s.email || '';
      const phone = s.phoneNo || '';
      const usn = s.usn || '';
      const college = s.collegeName || '';
      const branch = s.branch || '';

      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        name.toLowerCase().includes(query) ||
        email.toLowerCase().includes(query) ||
        phone.includes(query) ||
        usn.toLowerCase().includes(query) ||
        college.toLowerCase().includes(query) ||
        branch.toLowerCase().includes(query);

      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;

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
  }, [students, searchTerm, statusFilter, sortField, sortOrder]);

  // 2. Pagination Calculations
  const totalEntries = filteredAndSortedStudents.length;
  const totalPages = Math.ceil(totalEntries / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedStudents = filteredAndSortedStudents.slice(startIndex, startIndex + pageSize);

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
            <GraduationCap className="h-6 w-6 text-brand" />
            Students Detailes
          </h1>
          <p className="text-xs text-textMuted mt-1">
            Browse complete student cohorts, monitor academic tracks, and inspect 360-degree dossiers.
          </p>
        </div>

        <button
          onClick={() => fetchStudentsList(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-borderLight text-xs font-bold text-textPrimary hover:bg-bgSoft transition cursor-pointer shadow-2xs"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin text-brand' : 'text-textMuted'}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh Directory'}</span>
        </button>
      </div>

      {/* Datatable Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-5 rounded-[20px] border border-borderLight shadow-xs">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-textMuted" />
          <input
            type="text"
            placeholder="Search student name, email, USN, college..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-xl bg-bgSoft pl-10 pr-4 py-2.5 text-xs font-bold text-textPrimary placeholder:text-textMuted border border-borderLight/60 focus:outline-none focus:border-brand"
          />
        </div>

        {/* Filters & Rows per page */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <Filter className="h-4 w-4 text-textMuted shrink-0 mr-1" />
            {['all', 'active', 'pending', 'disabled'].map((st) => (
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
            <div className="w-20">
              <CustomDropdown
                options={[10, 25, 50, 100]}
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
                    <span>Student Profile</span>
                    <ArrowUpDown className="h-3 w-3 text-textMuted" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('collegeName')}
                  className="py-4 px-4 cursor-pointer hover:text-brand transition-all"
                >
                  <div className="flex items-center gap-1.5">
                    <span>College / Campus</span>
                    <ArrowUpDown className="h-3 w-3 text-textMuted" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('enrollmentCount')}
                  className="py-4 px-4 text-center cursor-pointer hover:text-brand transition-all"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Programs & Steps</span>
                    <ArrowUpDown className="h-3 w-3 text-textMuted" />
                  </div>
                </th>
                <th className="py-4 px-4">
                  <span>Status</span>
                </th>
                <th className="py-4 px-6 text-right whitespace-nowrap min-w-[80px]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderLight/60 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-textMuted font-bold">
                    <RefreshCw className="h-6 w-6 animate-spin text-brand mx-auto mb-2" />
                    Loading student cohort directory...
                  </td>
                </tr>
              ) : paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-textMuted font-bold">
                    No students found matching your search.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-bgSoft/40 transition-all group cursor-pointer"
                    onClick={() => onSelectStudent(s.id)}
                  >
                    {/* Student Info */}
                    <td className="py-4 px-5">
                      <div className="font-black text-textPrimary flex items-center gap-2">
                        <span>{s.name || 'Student Intern'}</span>
                        <span className="rounded-md bg-brand/10 px-1.5 py-0.5 text-[10px] font-mono font-bold text-brand">
                          #ID-{s.id}
                        </span>
                      </div>
                      <div className="text-[11px] text-textMuted mt-0.5 flex items-center gap-1">
                        <Mail className="h-3 w-3 shrink-0" />
                        <span>{s.email}</span>
                      </div>
                    </td>

                    {/* College */}
                    <td className="py-4 px-4">
                      <div className="font-extrabold text-textPrimary flex items-center gap-1">
                        <Building className="h-3 w-3 text-brand shrink-0" />
                        <span className="truncate max-w-[500px]">{s.collegeName || 'N/A'}</span>
                      </div>
                      <div className="text-[10px] text-textMuted mt-0.5">
                        {s.countryName || 'India'}
                      </div>
                    </td>

                    {/* Programs & Steps */}
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex items-center gap-3">
                        <div className="flex items-center gap-1 font-black text-textPrimary" title="Enrolled Programs">
                          <BookOpen className="h-3.5 w-3.5 text-brand" />
                          <span>{s.enrollmentCount || 0}</span>
                        </div>
                        <div className="flex items-center gap-1 font-bold text-emerald-600" title="Submissions">
                          <Award className="h-3.5 w-3.5 text-amber-500" />
                          <span>{s.certificateCount || 0}</span>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          s.status === 'active'
                            ? 'bg-statusPassedBg text-statusPassedText'
                            : s.status === 'disabled'
                            ? 'bg-statusErrorBg text-statusErrorText'
                            : 'bg-statusEvaluatingBg text-statusEvaluatingText'
                        }`}
                      >
                        {s.status}
                      </span>
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
            Showing <span className="text-textPrimary font-black">{totalEntries > 0 ? startIndex + 1 : 0}</span> to{' '}
            <span className="text-textPrimary font-black">{Math.min(startIndex + pageSize, totalEntries)}</span> of{' '}
            <span className="text-textPrimary font-black">{totalEntries}</span> students
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
