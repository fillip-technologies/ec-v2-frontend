'use client';

import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

interface CollegeStudentsViewProps {
  students: any[];
}

type StudentSortField = 'displayName' | 'programTitle' | 'completionPercentage' | 'enrollmentStatus';
type SortOrder = 'asc' | 'desc';

export const CollegeStudentsView: React.FC<CollegeStudentsViewProps> = ({ students }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<StudentSortField>('displayName');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSort = (field: StudentSortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedStudents = useMemo(() => {
    let result = students.filter(
      (s) =>
        s.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.programTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
  }, [students, searchTerm, sortField, sortOrder]);

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
            <Users className="h-6 w-6 text-warning" />
            Institutional Student Cohort
          </h1>
          <p className="text-xs text-textMuted mt-1">
            Monitor student progress, program enrollments, and completion percentages for your institution.
          </p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-5 rounded-[20px] border border-borderLight shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-textMuted" />
          <input
            type="text"
            placeholder="Search students, email, program..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-xl bg-bgSoft pl-10 pr-4 py-2.5 text-xs font-bold text-textPrimary placeholder:text-textMuted border border-borderLight/60 focus:outline-none focus:border-brand"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-textMuted">
          <span>Rows:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded-lg bg-bgSoft px-2.5 py-1.5 text-xs font-black text-textPrimary border border-borderLight outline-none cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Datatable Wrapper */}
      <div className="bg-white rounded-[24px] border border-borderLight shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bgSoft/80 border-b border-borderLight text-[11px] font-extrabold uppercase tracking-wider text-textMuted select-none">
                <th
                  onClick={() => handleSort('displayName')}
                  className="py-4 px-5 cursor-pointer hover:text-brand transition-all"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Student Name</span>
                    <ArrowUpDown className="h-3 w-3 text-textMuted" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('programTitle')}
                  className="py-4 px-4 cursor-pointer hover:text-brand transition-all"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Program Enrolled</span>
                    <ArrowUpDown className="h-3 w-3 text-textMuted" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('completionPercentage')}
                  className="py-4 px-4 text-center cursor-pointer hover:text-brand transition-all"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Progress</span>
                    <ArrowUpDown className="h-3 w-3 text-textMuted" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('enrollmentStatus')}
                  className="py-4 px-4 text-right cursor-pointer hover:text-brand transition-all"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Status</span>
                    <ArrowUpDown className="h-3 w-3 text-textMuted" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderLight/60 text-xs">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-textMuted font-bold">
                    No cohort students found matching search.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-bgSoft/40 transition-all">
                    <td className="py-4 px-5">
                      <div className="font-black text-textPrimary">{s.displayName}</div>
                      <div className="text-[10px] text-textMuted">{s.email}</div>
                    </td>
                    <td className="py-4 px-4 font-medium text-textPrimary">{s.programTitle}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-black text-successDark">{s.completionPercentage}%</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="inline-block px-3 py-1 rounded-full bg-statusPassedBg text-statusPassedText font-extrabold text-[10px] uppercase">
                        {s.enrollmentStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Datatable Footer */}
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
