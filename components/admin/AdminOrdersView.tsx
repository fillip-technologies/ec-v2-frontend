'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  CreditCard,
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  Download,
  RefreshCw,
  Ticket,
  User,
  Building,
  TrendingUp,
  X,
  ShieldCheck,
  Mail,
  BookOpen,
  Copy,
  Check,
  ExternalLink,
  IndianRupee,
} from 'lucide-react';
import { getAdminOrders } from '@/lib/api/admin';
import { formatPrice } from '@/lib/utils/currency';
import { CustomDropdown } from '@/components/shared/CustomDropdown';
import { showToast } from '@/lib/toast';

interface StudentData {
  userid: number;
  firstName?: string;
  lastName?: string;
  customCollegeName?: string;
  usn?: string;
  college?: { id: number; name: string } | null;
  user?: { id: number; email?: string; phoneNo?: string } | null;
}

interface PaymentAttempt {
  id: number;
  gateway?: string;
  gatewayPaymentId?: string;
  status: string;
  amount: number | string;
  currency: string;
  method?: string;
  createdAt: string;
  errorCode?: string;
  errorDescription?: string;
}

export interface AdminOrderItem {
  id: number;
  studentId: number;
  programId: number;
  couponId?: number | null;
  amount: number | string;
  currency: string;
  status: 'PAID' | 'PENDING' | 'FAILED' | 'REFUNDED';
  gateway?: string | null;
  gatewayOrderId?: string | null;
  receipt?: string | null;
  createdAt: string;
  updatedAt: string;
  student?: StudentData | null;
  program?: { id: number; title: string; slug?: string; durationHours?: number } | null;
  payments?: PaymentAttempt[];
  coupon?: {
    id: number;
    code: string;
    status: string;
    batch?: {
      id: number;
      name?: string;
      college?: { id: number; name: string } | null;
    } | null;
  } | null;
  enrollment?: { id: number; status: string; createdAt: string } | null;
}

type SortField = 'id' | 'createdAt' | 'amount' | 'status' | 'studentName' | 'programTitle';
type SortOrder = 'asc' | 'desc';

export const AdminOrdersView: React.FC = () => {
  const [orders, setOrders] = useState<AdminOrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<string>('ALL');
  const [sortOption, setSortOption] = useState<string>('NEWEST');

  // DataTable State
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Modal State for Order Inspector
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderItem | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const getStudentCollege = (student?: StudentData | null): string => {
    if (student?.college?.name && student.college.name.trim()) {
      return student.college.name.trim();
    }
    if (student?.customCollegeName && student.customCollegeName.trim()) {
      return student.customCollegeName.trim();
    }
    return 'N/A';
  };

  const handleCopy = (text: string, key: string) => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast.success('Copied to clipboard', 'Copied');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const fetchOrders = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await getAdminOrders();
      setOrders(Array.isArray(data) ? data : []);
      if (isManualRefresh) {
        showToast.success('Order records refreshed successfully', 'Synced');
      }
    } catch (err: any) {
      showToast.error(err.message || 'Failed to fetch student orders', 'Load Error');
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Sort Field Click Handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Sync quick sort dropdown with table sort
  const handleSortOptionChange = (option: string | number) => {
    setSortOption(String(option));
    switch (option) {
      case 'NEWEST':
        setSortField('createdAt');
        setSortOrder('desc');
        break;
      case 'OLDEST':
        setSortField('createdAt');
        setSortOrder('asc');
        break;
      case 'AMOUNT_DESC':
        setSortField('amount');
        setSortOrder('desc');
        break;
      case 'AMOUNT_ASC':
        setSortField('amount');
        setSortOrder('asc');
        break;
      case 'ID_DESC':
        setSortField('id');
        setSortOrder('desc');
        break;
      default:
        break;
    }
  };

  // KPI Computations
  const kpis = useMemo(() => {
    const totalOrders = orders.length;
    const paidOrders = orders.filter((o) => o.status === 'PAID');
    const pendingOrders = orders.filter((o) => o.status === 'PENDING');
    const failedOrders = orders.filter((o) => o.status === 'FAILED');
    const couponOrders = orders.filter((o) => Boolean(o.couponId || o.coupon?.code || Number(o.amount) === 0));

    const totalRevenueINR = paidOrders.reduce((sum, o) => {
      const amt = Number(o.amount) || 0;
      return sum + amt;
    }, 0);

    const paidRate = totalOrders > 0 ? Math.round((paidOrders.length / totalOrders) * 100) : 0;

    return {
      totalOrders,
      paidCount: paidOrders.length,
      pendingCount: pendingOrders.length,
      failedCount: failedOrders.length,
      couponCount: couponOrders.length,
      totalRevenueINR,
      paidRate,
    };
  }, [orders]);

  // Filtered and Sorted Data
  const filteredAndSortedOrders = useMemo(() => {
    let result = orders.filter((order) => {
      const studentFirstName = order.student?.firstName || '';
      const studentLastName = order.student?.lastName || '';
      const studentName = `${studentFirstName} ${studentLastName}`.trim();
      const studentEmail = order.student?.user?.email || '';
      const studentPhone = order.student?.user?.phoneNo || '';
      const studentUsn = order.student?.usn || '';
      const collegeName = getStudentCollege(order.student);
      const programTitle = order.program?.title || '';
      const couponCode = order.coupon?.code || '';
      const orderIdStr = `#ORD-${order.id} ${order.id}`;
      const txnId = order.payments?.[0]?.gatewayPaymentId || order.gatewayOrderId || '';
      const receipt = order.receipt || '';

      const query = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !query ||
        orderIdStr.toLowerCase().includes(query) ||
        studentName.toLowerCase().includes(query) ||
        studentEmail.toLowerCase().includes(query) ||
        studentPhone.toLowerCase().includes(query) ||
        studentUsn.toLowerCase().includes(query) ||
        collegeName.toLowerCase().includes(query) ||
        programTitle.toLowerCase().includes(query) ||
        couponCode.toLowerCase().includes(query) ||
        txnId.toLowerCase().includes(query) ||
        receipt.toLowerCase().includes(query);

      // Status Filter
      const matchesStatus =
        statusFilter === 'ALL' || order.status?.toUpperCase() === statusFilter.toUpperCase();

      // Payment Type Filter
      const isCoupon = Boolean(order.couponId || order.coupon?.code || Number(order.amount) === 0);
      const matchesType =
        paymentTypeFilter === 'ALL' ||
        (paymentTypeFilter === 'COUPON' && isCoupon) ||
        (paymentTypeFilter === 'GATEWAY' && !isCoupon);

      return matchesSearch && matchesStatus && matchesType;
    });

    result.sort((a, b) => {
      let valA: any = '';
      let valB: any = '';

      if (sortField === 'id') {
        valA = a.id;
        valB = b.id;
      } else if (sortField === 'createdAt') {
        valA = new Date(a.createdAt).getTime();
        valB = new Date(b.createdAt).getTime();
      } else if (sortField === 'amount') {
        valA = Number(a.amount) || 0;
        valB = Number(b.amount) || 0;
      } else if (sortField === 'status') {
        valA = a.status || '';
        valB = b.status || '';
      } else if (sortField === 'studentName') {
        valA = `${a.student?.firstName || ''} ${a.student?.lastName || ''}`.trim();
        valB = `${b.student?.firstName || ''} ${b.student?.lastName || ''}`.trim();
      } else if (sortField === 'programTitle') {
        valA = a.program?.title || '';
        valB = b.program?.title || '';
      }

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [orders, searchTerm, statusFilter, paymentTypeFilter, sortField, sortOrder]);

  // Pagination Calculations
  const totalEntries = filteredAndSortedOrders.length;
  const totalPages = Math.ceil(totalEntries / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedOrders = filteredAndSortedOrders.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredAndSortedOrders.length === 0) {
      showToast.info('No order records available to export', 'Export Empty');
      return;
    }

    const headers = [
      'Order ID',
      'Date & Time',
      'Student Name',
      'Student Email',
      'Phone Number',
      'College / Institution',
      'University Roll / USN',
      'Program Name',
      'Duration Hours',
      'Amount',
      'Currency',
      'Status',
      'Payment Method',
      'Gateway Order ID',
      'Gateway Payment ID',
      'Coupon Code',
      'Enrollment ID',
    ];

    const rows = filteredAndSortedOrders.map((o) => {
      const isCoupon = Boolean(o.couponId || o.coupon?.code || Number(o.amount) === 0);
      const studentName = `${o.student?.firstName || ''} ${o.student?.lastName || ''}`.trim() || 'Student Intern';
      const collegeName = getStudentCollege(o.student);
      const gatewayPaymentId = o.payments?.[0]?.gatewayPaymentId || 'N/A';

      return [
        `ORD-${o.id}`,
        new Date(o.createdAt).toISOString(),
        `"${studentName}"`,
        `"${o.student?.user?.email || 'N/A'}"`,
        `"${o.student?.user?.phoneNo || 'N/A'}"`,
        `"${collegeName}"`,
        `"${o.student?.usn || 'N/A'}"`,
        `"${o.program?.title || 'Internship'}"`,
        o.program?.durationHours || 120,
        Number(o.amount) || 0,
        o.currency || 'INR',
        o.status,
        isCoupon ? 'Institutional Coupon' : o.gateway || 'Razorpay',
        o.gatewayOrderId || 'N/A',
        gatewayPaymentId,
        o.coupon?.code || 'N/A',
        o.enrollment?.id ? `ENR-${o.enrollment.id}` : 'N/A',
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `engineers_clinic_orders_${new Date().toISOString().split('T')[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast.success('Exported orders to CSV', 'Download Ready');
  };

  const statusOptions = [
    { value: 'ALL', label: 'All Order Statuses' },
    { value: 'PAID', label: 'Paid & Settled' },
    { value: 'PENDING', label: 'Pending Settlement' },
    { value: 'FAILED', label: 'Failed Attempts' },
    { value: 'REFUNDED', label: 'Refunded' },
  ];

  const paymentTypeOptions = [
    { value: 'ALL', label: 'All Payment Types' },
    { value: 'GATEWAY', label: 'Direct Payment (Razorpay/Stripe)' },
    { value: 'COUPON', label: 'Institutional Coupon (₹0)' },
  ];

  const sortOptions = [
    { value: 'NEWEST', label: 'Newest Orders First' },
    { value: 'OLDEST', label: 'Oldest Orders First' },
    { value: 'AMOUNT_DESC', label: 'Highest Amount' },
    { value: 'AMOUNT_ASC', label: 'Lowest Amount' },
    { value: 'ID_DESC', label: 'Order ID (High to Low)' },
  ];

  const pageSizeOptions = [
    { value: 10, label: '10' },
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. View Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[24px] border border-borderLight shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-brand/10 text-brand">
              <CreditCard className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-black text-textPrimary tracking-tight">
              Student Orders & Billing Audit
            </h1>
          </div>
          <p className="text-xs text-textMuted mt-1">
            Real-time transaction reconciliation, student payment gateway attempts, and institutional coupon redemptions.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
          <button
            type="button"
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl border border-borderLight bg-bgSoft/60 px-4 py-2.5 text-xs font-bold text-textPrimary transition hover:bg-bgSoft hover:border-brand/30 cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin text-brand' : ''}`} />
            <span>Sync</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-brandHover cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="rounded-[20px] border border-borderLight bg-white p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-textMuted uppercase tracking-wider">
              Total Revenue
            </span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <IndianRupee className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-textPrimary">
              {formatPrice(kpis.totalRevenueINR, 'INR')}
            </div>
            <div className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>{kpis.paidCount} Paid Transactions</span>
            </div>
          </div>
        </div>

        {/* Total Orders Placed */}
        <div className="rounded-[20px] border border-borderLight bg-white p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-textMuted uppercase tracking-wider">
              Total Orders
            </span>
            <span className="p-2 rounded-xl bg-brand/10 text-brand">
              <CreditCard className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-textPrimary">{kpis.totalOrders}</div>
            <div className="text-[11px] text-textMuted font-medium mt-1">
              {kpis.paidRate}% Settlement Conversion Rate
            </div>
          </div>
        </div>

        {/* Coupon Redemptions (₹0) */}
        <div className="rounded-[20px] border border-borderLight bg-white p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-textMuted uppercase tracking-wider">
              Coupon Enrollments
            </span>
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Ticket className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-textPrimary">{kpis.couponCount}</div>
            <div className="text-[11px] text-purple-600 font-bold mt-1">
              Institutional Sponsored Seats
            </div>
          </div>
        </div>

        {/* Pending / Attention */}
        <div className="rounded-[20px] border border-borderLight bg-white p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-textMuted uppercase tracking-wider">
              Pending / Incomplete
            </span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-textPrimary">{kpis.pendingCount}</div>
            <div className="text-[11px] text-amber-600 font-bold mt-1">
              {kpis.failedCount > 0 ? `${kpis.failedCount} Failed Attempts` : 'Retryable Checkouts'}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="rounded-[24px] border border-borderLight bg-white p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-center gap-3">
          {/* Universal Search Input */}
          <div className="flex-1 w-full relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-textMuted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search student, email, phone, #ORD, coupon, txn ID..."
              className="w-full rounded-xl border border-borderLight bg-bgSoft/40 pl-10 pr-8 py-2.5 text-xs font-bold text-textPrimary placeholder:text-textMuted outline-hidden transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/10"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCurrentPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-textPrimary"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex items-center gap-2.5 w-full lg:w-auto">
            {/* Status Dropdown */}
            <div className="w-full lg:w-44">
              <CustomDropdown
                placeholder="Status..."
                options={statusOptions}
                value={statusFilter}
                onChange={(val) => {
                  setStatusFilter(String(val));
                  setCurrentPage(1);
                }}
                icon={<Filter className="h-3.5 w-3.5" />}
              />
            </div>

            {/* Payment Type Dropdown */}
            <div className="w-full lg:w-48">
              <CustomDropdown
                placeholder="Payment Type..."
                options={paymentTypeOptions}
                value={paymentTypeFilter}
                onChange={(val) => {
                  setPaymentTypeFilter(String(val));
                  setCurrentPage(1);
                }}
                icon={<CreditCard className="h-3.5 w-3.5" />}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="w-full lg:w-44">
              <CustomDropdown
                placeholder="Sort..."
                options={sortOptions}
                value={sortOption}
                onChange={handleSortOptionChange}
                icon={<ArrowUpDown className="h-3.5 w-3.5" />}
              />
            </div>

            {/* Rows Per Page Dropdown (Only Numbers) */}
            <div className="w-full lg:w-20 shrink-0">
              <CustomDropdown
                placeholder="10"
                options={pageSizeOptions}
                value={pageSize}
                onChange={(val) => {
                  setPageSize(Number(val));
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>

        {/* Active Filters Summary & Reset */}
        {(searchTerm || statusFilter !== 'ALL' || paymentTypeFilter !== 'ALL') && (
          <div className="flex items-center justify-between pt-2 border-t border-borderLight/60 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-textMuted">Active Filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 rounded-md bg-bgSoft px-2.5 py-1 font-bold text-textPrimary">
                  Search: &ldquo;{searchTerm}&rdquo;
                </span>
              )}
              {statusFilter !== 'ALL' && (
                <span className="inline-flex items-center gap-1 rounded-md bg-brand/10 px-2.5 py-1 font-bold text-brand">
                  Status: {statusFilter}
                </span>
              )}
              {paymentTypeFilter !== 'ALL' && (
                <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2.5 py-1 font-bold text-purple-700">
                  Type: {paymentTypeFilter === 'COUPON' ? 'Coupon Only' : 'Gateway Only'}
                </span>
              )}
            </div>

            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
                setPaymentTypeFilter('ALL');
                setCurrentPage(1);
              }}
              className="text-xs font-bold text-brand hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* 4. Orders DataTable Container */}
      <div className="rounded-[24px] border border-borderLight bg-white shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-16 space-y-3">
            <div className="h-10 w-10 rounded-full bg-brand/10 flex items-center justify-center text-brand animate-spin">
              <RefreshCw className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold text-textMuted">Loading student orders & transactions...</p>
          </div>
        ) : paginatedOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-bgSoft flex items-center justify-center text-textMuted">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-textPrimary">No Student Orders Found</h3>
              <p className="text-xs text-textMuted max-w-sm mt-1">
                {searchTerm || statusFilter !== 'ALL' || paymentTypeFilter !== 'ALL'
                  ? 'No order records match your current filter parameters. Try clearing filters.'
                  : 'No student checkout or coupon orders recorded in the platform database yet.'}
              </p>
            </div>
            {(searchTerm || statusFilter !== 'ALL' || paymentTypeFilter !== 'ALL') && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('ALL');
                  setPaymentTypeFilter('ALL');
                }}
                className="mt-2 text-xs font-bold text-brand hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-borderLight bg-bgSoft/40 text-[11px] font-extrabold uppercase tracking-wider text-textMuted">
                  <th
                    onClick={() => handleSort('id')}
                    className="py-3.5 px-4 cursor-pointer hover:text-textPrimary select-none whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Order Ref</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('studentName')}
                    className="py-3.5 px-4 cursor-pointer hover:text-textPrimary select-none whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Student Intern</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('programTitle')}
                    className="py-3.5 px-4 cursor-pointer hover:text-textPrimary select-none whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Internship Program</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Payment Method</th>
                  <th
                    onClick={() => handleSort('amount')}
                    className="py-3.5 px-4 cursor-pointer hover:text-textPrimary select-none whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Amount</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('status')}
                    className="py-3.5 px-4 cursor-pointer hover:text-textPrimary select-none whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Status</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Enrollment</th>
                  <th className="py-3.5 px-4 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderLight/60 text-xs">
                {paginatedOrders.map((order) => {
                  const isCoupon = Boolean(order.couponId || order.coupon?.code || Number(order.amount) === 0);
                  const studentFirstName = order.student?.firstName || '';
                  const studentLastName = order.student?.lastName || '';
                  const studentName = `${studentFirstName} ${studentLastName}`.trim() || 'Student Intern';
                  const studentEmail = order.student?.user?.email || 'N/A';
                  const studentUsn = order.student?.usn;
                  const collegeName = getStudentCollege(order.student);
                  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });
                  const formattedTime = new Date(order.createdAt).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-bgSoft/30 transition-colors group cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      {/* 1. Order Ref & Date */}
                      <td className="py-4 px-4 align-top whitespace-nowrap">
                        <div className="font-extrabold text-textPrimary flex items-center gap-1.5">
                          <span className="rounded-md bg-brand/10 px-2 py-0.5 text-[11px] font-black text-brand">
                            #ORD-{order.id}
                          </span>
                        </div>
                        <div className="text-[11px] text-textMuted mt-1">
                          {formattedDate} · {formattedTime}
                        </div>
                      </td>

                      {/* 2. Student Intern */}
                      <td className="py-4 px-4 align-top max-w-[220px]">
                        <div className="font-extrabold text-textPrimary truncate">{studentName}</div>
                        <div className="text-[11px] text-textMuted mt-0.5 flex items-center gap-1 truncate">
                          <Mail className="h-3 w-3 shrink-0" />
                          <span className="truncate">{studentEmail}</span>
                        </div>
                        <div className="text-[11px] text-textMuted mt-0.5 flex items-center gap-1 truncate">
                          <Building className="h-3 w-3 text-brand shrink-0" />
                          <span className="truncate">{collegeName}</span>
                          {studentUsn && (
                            <span className="rounded-sm bg-bgSoft px-1 text-[10px] font-mono font-bold text-textPrimary uppercase shrink-0">
                              {studentUsn}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 3. Internship Program */}
                      <td className="py-4 px-4 align-top max-w-[220px]">
                        <div className="font-bold text-textPrimary truncate">
                          {order.program?.title || 'Internship Program'}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className="rounded-full bg-bgSoft px-2 py-0.5 text-[10px] font-bold text-textMuted">
                            {order.program?.durationHours || 120} Hours
                          </span>
                        </div>
                      </td>

                      {/* 4. Payment Method / Coupon */}
                      <td className="py-4 px-4 align-top max-w-[180px]">
                        {isCoupon ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-[11px] font-black text-purple-700 border border-purple-200 truncate">
                              <Ticket className="h-3 w-3 shrink-0" />
                              <span className="truncate">{order.coupon?.code || 'COUPON'}</span>
                            </span>
                            {order.coupon?.batch?.college?.name && (
                              <p className="text-[10px] text-purple-600 truncate">
                                {order.coupon.batch.college.name}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700 border border-blue-200 truncate">
                              <CreditCard className="h-3 w-3 shrink-0" />
                              <span className="truncate">{order.gateway ? order.gateway.toUpperCase() : 'RAZORPAY'}</span>
                            </span>
                            {order.payments?.[0]?.gatewayPaymentId && (
                              <p className="text-[10px] text-textMuted font-mono truncate">
                                {order.payments[0].gatewayPaymentId}
                              </p>
                            )}
                          </div>
                        )}
                      </td>

                      {/* 5. Amount */}
                      <td className="py-4 px-4 align-top whitespace-nowrap">
                        <div className="font-black text-textPrimary text-sm">
                          {isCoupon ? (
                            <span className="text-emerald-700 font-extrabold">₹0 (Coupon)</span>
                          ) : (
                            formatPrice(Number(order.amount) || 0, order.currency || 'INR')
                          )}
                        </div>
                        <div className="text-[10px] text-textMuted uppercase">{order.currency || 'INR'}</div>
                      </td>

                      {/* 6. Status Badge */}
                      <td className="py-4 px-4 align-top whitespace-nowrap">
                        {order.status === 'PAID' ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            <span>PAID</span>
                          </span>
                        ) : order.status === 'PENDING' ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-black text-amber-700 border border-amber-200">
                            <Clock className="h-3.5 w-3.5 text-amber-600" />
                            <span>PENDING</span>
                          </span>
                        ) : order.status === 'FAILED' ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-black text-rose-700 border border-rose-200">
                            <XCircle className="h-3.5 w-3.5 text-rose-600" />
                            <span>FAILED</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-[11px] font-black text-purple-700 border border-purple-200">
                            <RotateCcw className="h-3.5 w-3.5 text-purple-600" />
                            <span>{order.status}</span>
                          </span>
                        )}
                      </td>

                      {/* 7. Enrollment Status */}
                      <td className="py-4 px-4 align-top whitespace-nowrap">
                        {order.enrollment?.id ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200">
                            <ShieldCheck className="h-3 w-3 text-emerald-600" />
                            <span>#ENR-{order.enrollment.id}</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-textMuted">Not Enrolled</span>
                        )}
                      </td>

                      {/* 8. Action */}
                      <td className="py-4 px-4 align-top text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-borderLight bg-white px-3 py-1.5 text-xs font-bold text-textPrimary shadow-2xs hover:bg-bgSoft hover:text-brand hover:border-brand/30 transition cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. Pagination Footer */}
        {!loading && filteredAndSortedOrders.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-borderLight bg-bgSoft/20">
            {/* Left: Summary */}
            <div className="text-xs text-textMuted">
              Showing <span className="font-bold text-textPrimary">{startIndex + 1}</span> to{' '}
              <span className="font-bold text-textPrimary">
                {Math.min(startIndex + pageSize, totalEntries)}
              </span>{' '}
              of <span className="font-bold text-textPrimary">{totalEntries}</span> orders
            </div>

            {/* Right: Pagination Navigation Buttons */}
            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-borderLight bg-white text-textPrimary hover:bg-bgSoft disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
                title="First Page"
              >
                <ChevronsLeft className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-borderLight bg-white text-textPrimary hover:bg-bgSoft disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
                title="Previous Page"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>

              <div className="px-3 py-1.5 text-xs font-black text-textPrimary rounded-xl border border-borderLight bg-white">
                Page {currentPage} of {totalPages}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-borderLight bg-white text-textPrimary hover:bg-bgSoft disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
                title="Next Page"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-borderLight bg-white text-textPrimary hover:bg-bgSoft disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
                title="Last Page"
              >
                <ChevronsRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 6. Integrated Order Detail Inspector Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="relative flex flex-col w-full max-w-2xl max-h-[88vh] rounded-[24px] bg-white border border-borderLight shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Pinned Modal Header */}
            <div className="px-6 py-4 border-b border-borderLight bg-white shrink-0 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="rounded-lg bg-brand/10 px-2.5 py-0.5 text-xs font-black text-brand">
                    #ORD-{selectedOrder.id}
                  </span>
                  <h3 className="text-base font-black text-textPrimary">Order & Settlement Audit</h3>
                </div>
                <p className="text-[11px] text-textMuted mt-0.5">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-full hover:bg-bgSoft text-textMuted hover:text-textPrimary transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Seamless Scrollable Modal Body */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-4 custom-scrollbar bg-white">
              {/* Status Banner */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between flex-wrap gap-3 ${
                  selectedOrder.status === 'PAID'
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                    : selectedOrder.status === 'PENDING'
                    ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                    : 'bg-rose-50/80 border-rose-200 text-rose-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {selectedOrder.status === 'PAID' ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  ) : selectedOrder.status === 'PENDING' ? (
                    <Clock className="h-5 w-5 text-amber-600 shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-rose-600 shrink-0" />
                  )}
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider">
                      Status: {selectedOrder.status}
                    </h4>
                    <p className="text-[11px] opacity-80 mt-0.5">
                      {selectedOrder.status === 'PAID'
                        ? 'Order settled and verified. Student workspace unlocked.'
                        : 'Awaiting payment confirmation or retry.'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-black">
                    {Boolean(selectedOrder.couponId || selectedOrder.coupon?.code || Number(selectedOrder.amount) === 0)
                      ? '₹0.00'
                      : formatPrice(Number(selectedOrder.amount) || 0, selectedOrder.currency || 'INR')}
                  </div>
                  <div className="text-[10px] uppercase opacity-75">{selectedOrder.currency || 'INR'}</div>
                </div>
              </div>

              {/* Student Intern Information */}
              <div className="p-4 rounded-2xl border border-borderLight/80 bg-bgSoft/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-textMuted uppercase tracking-wider flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-brand" />
                    <span>Student Intern Information</span>
                  </h4>
                  {selectedOrder.student?.userid && (
                    <a
                      href={`/admin/studentdetail/${selectedOrder.student.userid}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-brand hover:underline"
                    >
                      <span>Full Dossier</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="min-w-0">
                    <span className="text-textMuted block text-[11px]">Full Name:</span>
                    <span className="font-extrabold text-textPrimary truncate block">
                      {`${selectedOrder.student?.firstName || ''} ${selectedOrder.student?.lastName || ''}`.trim() || 'Student Intern'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-textMuted block text-[11px]">Email Address:</span>
                    <span className="font-bold text-textPrimary break-all block">
                      {selectedOrder.student?.user?.email || 'N/A'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-textMuted block text-[11px]">Phone Number:</span>
                    <span className="font-bold text-textPrimary block">
                      {selectedOrder.student?.user?.phoneNo || 'N/A'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-textMuted block text-[11px]">University Roll / USN:</span>
                    <span className="font-mono font-bold text-brand uppercase block">
                      {selectedOrder.student?.usn || 'N/A'}
                    </span>
                  </div>
                  <div className="sm:col-span-2 min-w-0">
                    <span className="text-textMuted block text-[11px]">College / Campus:</span>
                    <span className="font-bold text-textPrimary block break-words">
                      {getStudentCollege(selectedOrder.student)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Program & Curriculum Track */}
              <div className="p-4 rounded-2xl border border-borderLight/80 bg-bgSoft/30 space-y-3">
                <h4 className="text-xs font-bold text-textMuted uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-brand" />
                  <span>Internship Program & Curriculum Track</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="sm:col-span-2 min-w-0">
                    <span className="text-textMuted block text-[11px]">Program Title:</span>
                    <span className="font-extrabold text-textPrimary text-sm block break-words">
                      {selectedOrder.program?.title || 'Internship Program'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-textMuted block text-[11px]">Curriculum Duration:</span>
                    <span className="font-bold text-textPrimary block">
                      {selectedOrder.program?.durationHours || 120} Hours
                    </span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-textMuted block text-[11px]">Enrollment Reference:</span>
                    <span className="font-mono font-bold text-emerald-600 block">
                      {selectedOrder.enrollment?.id ? `#ENR-${selectedOrder.enrollment.id}` : 'Pending Generation'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Gateway & Reconciliation Attempts */}
              <div className="p-4 rounded-2xl border border-borderLight/80 bg-bgSoft/30 space-y-3">
                <h4 className="text-xs font-bold text-textMuted uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="h-3.5 w-3.5 text-brand" />
                  <span>Payment Gateway & Reconciliation</span>
                </h4>

                {selectedOrder.coupon?.code ? (
                  <div className="p-3.5 rounded-xl bg-purple-50/80 border border-purple-200 text-xs text-purple-900 space-y-1.5 break-words">
                    <div className="font-black flex items-center gap-1.5 flex-wrap">
                      <Ticket className="h-4 w-4 text-purple-600 shrink-0" />
                      <span>Coupon Redeemed: {selectedOrder.coupon.code}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(selectedOrder.coupon!.code, 'coupon')}
                        className="ml-auto text-[10px] font-bold text-purple-700 hover:text-purple-900 cursor-pointer flex items-center gap-1"
                      >
                        {copiedKey === 'coupon' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        <span>{copiedKey === 'coupon' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    {selectedOrder.coupon.batch?.college?.name && (
                      <p className="text-[11px] text-purple-700">
                        Allocated from College Cohort: <strong>{selectedOrder.coupon.batch.college.name}</strong>
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* Gateway Order ID & Receipt */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      {selectedOrder.gatewayOrderId && (
                        <div className="p-2.5 rounded-xl bg-white border border-borderLight min-w-0">
                          <span className="text-textMuted block text-[10px]">Gateway Order ID:</span>
                          <span className="font-mono font-bold text-textPrimary break-all block">
                            {selectedOrder.gatewayOrderId}
                          </span>
                        </div>
                      )}
                      {selectedOrder.receipt && (
                        <div className="p-2.5 rounded-xl bg-white border border-borderLight min-w-0">
                          <span className="text-textMuted block text-[10px]">Idempotency Receipt:</span>
                          <span className="font-mono font-bold text-textPrimary break-all block">
                            {selectedOrder.receipt}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Payment Attempts List */}
                    {selectedOrder.payments && selectedOrder.payments.length > 0 ? (
                      <div className="space-y-2 pt-1">
                        {selectedOrder.payments.map((p, idx) => (
                          <div
                            key={p.id || idx}
                            className="p-3 rounded-xl bg-white border border-borderLight text-xs space-y-1.5 min-w-0"
                          >
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <span className="font-mono font-bold text-textPrimary break-all">
                                {p.gatewayPaymentId || 'Attempt #' + (idx + 1)}
                              </span>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold shrink-0 ${
                                  p.status === 'CAPTURED' || p.status === 'PAID'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-rose-50 text-rose-700'
                                }`}
                              >
                                {p.status}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-textMuted text-[11px] flex-wrap gap-2">
                              <span>Method: {p.method || 'Online Gateway'}</span>
                              <span>{new Date(p.createdAt).toLocaleString('en-IN')}</span>
                            </div>
                            {p.errorDescription && (
                              <div className="text-[11px] text-rose-600 bg-rose-50 p-2 rounded-lg break-words">
                                Error: {p.errorDescription}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-textMuted italic">No external gateway payment attempt recorded yet.</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Pinned Modal Footer */}
            <div className="px-6 py-3.5 border-t border-borderLight bg-bgSoft/40 shrink-0 flex items-center justify-between">
              <span className="text-[11px] font-mono text-textMuted">
                Ref: ORD-{selectedOrder.id}
              </span>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-xl bg-brand px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-brandHover transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
