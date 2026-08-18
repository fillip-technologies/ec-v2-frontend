'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { UserSidebar } from '@/components/shared/UserSidebar';
import { StudentOverview } from '@/components/student/StudentOverview';
import { StudentProgramView } from '@/components/student/StudentProgramView';
import { StudentSubmissionsView } from '@/components/student/StudentSubmissionsView';
import { StudentRubricsView } from '@/components/student/StudentRubricsView';
import { StudentOrdersView } from '@/components/student/StudentOrdersView';
import { TaskSubmissionModal } from '@/components/student/TaskSubmissionModal';
import { AdminOverview } from '@/components/admin/AdminOverview';
import { AdminCollegesView } from '@/components/admin/AdminCollegesView';
import { AdminUsersView } from '@/components/admin/AdminUsersView';
import { AdminProgramsView } from '@/components/admin/AdminProgramsView';
import { AdminCouponsView } from '@/components/admin/AdminCouponsView';
import { AdminSubmissionsView } from '@/components/admin/AdminSubmissionsView';
import { AdminOrdersView } from '@/components/admin/AdminOrdersView';
import { AdminStudentDetailView } from '@/components/admin/AdminStudentDetailView';
import { AdminStudentsListView } from '@/components/admin/AdminStudentsListView';
import { AdminCollegeDetailView } from '@/components/admin/AdminCollegeDetailView';
import { CollegeOverview } from '@/components/college/CollegeOverview';
import { CollegeStudentsView } from '@/components/college/CollegeStudentsView';
import { CollegeCouponsView } from '@/components/college/CollegeCouponsView';
import { CollegeReportsView } from '@/components/college/CollegeReportsView';
import { Project } from '@/types/catalog';
import { getProgramByIdOrSlug, getPrograms } from '@/lib/api/catalog';
import {
  getStudentOverview,
  getStudentProfile,
  getStudentWorkspace,
  getStudentPrograms,
  getStudentSubmissions,
  getStudentRubrics,
  submitStudentTask,
} from '@/lib/api/student';
import {
  getAdminOverview,
  getAdminColleges,
  updateCollegeStatus,
  getAdminUsers,
  updateUserStatus,
} from '@/lib/api/admin';
import {
  getCollegeOverview,
  getCollegeStudents,
  getCollegeCoupons,
  getCollegeReports,
} from '@/lib/api/college';
import studentData from '@/config/studentData.json';
import { showToast } from '@/lib/toast';
import { School, Shield, Loader2, Award, CreditCard } from 'lucide-react';

function DashboardContent() {
  const { user, roleName } = useAuth();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') || searchParams.get('slug');
  const idParam = searchParams.get('id');

  const [activeSlug, setActiveSlug] = useState<string>(tabParam || 'overview');
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    (tabParam === 'students' || tabParam === 'studentdetail') && idParam ? Number(idParam) : null
  );
  const [selectedCollegeId, setSelectedCollegeId] = useState<number | null>(
    (tabParam === 'colleges' || tabParam === 'collegedetail') && idParam ? Number(idParam) : null
  );
  const [projects, setProjects] = useState<Project[]>([]);
  const [programsData, setProgramsData] = useState<any[]>([]);
  const [catalogPrograms, setCatalogPrograms] = useState<any[]>([]);
  const [overviewData, setOverviewData] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [submissionsList, setSubmissionsList] = useState<any[]>(studentData.submissions);
  const [rubricsList, setRubricsList] = useState<any[]>(studentData.rubrics);

  // Admin Data State
  const [adminOverviewData, setAdminOverviewData] = useState<any>(null);
  const [adminColleges, setAdminColleges] = useState<any[]>([]);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);

  // College Data State
  const [collegeOverviewData, setCollegeOverviewData] = useState<any>(null);
  const [collegeStudents, setCollegeStudents] = useState<any[]>([]);
  const [collegeCoupons, setCollegeCoupons] = useState<any[]>([]);
  const [collegeReports, setCollegeReports] = useState<any>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<{
    id: number;
    title: string;
    repoUrl?: string;
    workspaceId?: number;
  } | null>(null);

  const activeRole = roleName || (user as any)?.role?.name || (typeof user?.role === 'string' ? user.role : 'student');
  const isAdmin = activeRole === 'super_admin' || activeRole === 'admin';
  const isCollege = activeRole === 'college';

  const handleNavigateSlug = (slug: string, itemId?: number | null) => {
    setActiveSlug(slug);
    if (slug === 'students' || slug === 'studentdetail') {
      setSelectedStudentId(itemId !== undefined ? itemId : null);
      setSelectedCollegeId(null);
    } else if (slug === 'colleges' || slug === 'collegedetail') {
      setSelectedCollegeId(itemId !== undefined ? itemId : null);
      setSelectedStudentId(null);
    } else {
      setSelectedStudentId(null);
      setSelectedCollegeId(null);
    }

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', slug);
      if (itemId) {
        url.searchParams.set('id', String(itemId));
      } else {
        url.searchParams.delete('id');
      }
      window.history.pushState({}, '', url.pathname + '?' + url.searchParams.toString());
    }
  };

  const handleViewStudentDetail = (id: number) => {
    setSelectedStudentId(id);
    handleNavigateSlug('students', id);
  };

  const handleViewCollegeDetail = (id: number) => {
    setSelectedCollegeId(id);
    handleNavigateSlug('colleges', id);
  };

  // Sync active tab when URL param changes or on browser back/forward
  useEffect(() => {
    if (tabParam) {
      setActiveSlug(tabParam);
    } else if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (!url.searchParams.has('tab')) {
        url.searchParams.set('tab', 'overview');
        window.history.replaceState({}, '', url.pathname + '?' + url.searchParams.toString());
      }
    }
    if (idParam) {
      if (tabParam === 'colleges' || tabParam === 'collegedetail') {
        setSelectedCollegeId(Number(idParam));
        setSelectedStudentId(null);
      } else if (tabParam === 'students' || tabParam === 'studentdetail') {
        setSelectedStudentId(Number(idParam));
        setSelectedCollegeId(null);
      }
    } else {
      setSelectedStudentId(null);
      setSelectedCollegeId(null);
    }

    const onPopState = () => {
      if (typeof window !== 'undefined') {
        const currentParams = new URLSearchParams(window.location.search);
        const currentTab = currentParams.get('tab') || currentParams.get('slug') || 'overview';
        const currentId = currentParams.get('id');
        setActiveSlug(currentTab);
        if (currentTab === 'colleges' || currentTab === 'collegedetail') {
          setSelectedCollegeId(currentId ? Number(currentId) : null);
          setSelectedStudentId(null);
        } else if (currentTab === 'students' || currentTab === 'studentdetail') {
          setSelectedStudentId(currentId ? Number(currentId) : null);
          setSelectedCollegeId(null);
        } else {
          setSelectedStudentId(null);
          setSelectedCollegeId(null);
        }
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [tabParam, idParam]);

  const handleOpenSubmissionModal = (
    taskId: number,
    taskTitle: string,
    repoUrl?: string,
    workspaceId?: number
  ) => {
    setSelectedTask({ id: taskId, title: taskTitle, repoUrl, workspaceId });
    setIsModalOpen(true);
  };

  const handleSubmissionSuccess = () => {
    getStudentOverview().then((data) => { if (data) setOverviewData(data); });
    getStudentPrograms().then((progs) => { if (Array.isArray(progs) && progs.length > 0) setProgramsData(progs); });
    getStudentSubmissions().then((subs) => { if (Array.isArray(subs)) setSubmissionsList(subs); });
  };

  // Admin College Handlers
  const handleApproveCollege = async (id: number) => {
    try {
      await updateCollegeStatus(id, 'approved');
      const updatedColleges = await getAdminColleges();
      setAdminColleges(updatedColleges);
      const updatedOverview = await getAdminOverview();
      if (updatedOverview) setAdminOverviewData(updatedOverview);
      showToast.success('College account approved successfully.', 'College Approved');
    } catch (err: any) {
      showToast.error(err.message || 'Failed to approve college', 'Action Failed');
    }
  };

  const handleRejectCollege = async (id: number) => {
    try {
      await updateCollegeStatus(id, 'rejected');
      const updatedColleges = await getAdminColleges();
      setAdminColleges(updatedColleges);
      const updatedOverview = await getAdminOverview();
      if (updatedOverview) setAdminOverviewData(updatedOverview);
      showToast.info('College account has been marked as rejected.', 'College Rejected');
    } catch (err: any) {
      showToast.error(err.message || 'Failed to reject college', 'Action Failed');
    }
  };

  // Admin User Handlers
  const handleUpdateUserStatus = async (id: number, status: string) => {
    try {
      await updateUserStatus(id, status);
      const updatedUsers = await getAdminUsers();
      setAdminUsers(updatedUsers);
      showToast.success(`User status updated to "${status}".`, 'Status Updated');
    } catch (err: any) {
      showToast.error(err.message || 'Failed to update user status', 'Action Failed');
    }
  };

  useEffect(() => {
    if (isAdmin) {
      // Fetch Super Admin Console Telemetry Data
      getAdminOverview().then((data) => { if (data) setAdminOverviewData(data); });
      getAdminColleges().then((colleges) => setAdminColleges(colleges));
      getAdminUsers().then((users) => setAdminUsers(users));
      getPrograms().then((progs) => setCatalogPrograms(progs));
    } else if (isCollege) {
      // Fetch B2B College Portal Data
      getCollegeOverview().then((data) => { if (data) setCollegeOverviewData(data); });
      getCollegeStudents().then((students) => setCollegeStudents(students));
      getCollegeCoupons().then((coupons) => setCollegeCoupons(coupons));
      getCollegeReports().then((reports) => setCollegeReports(reports));
      getPrograms().then((progs) => setCatalogPrograms(progs));
    } else {
      // Fetch Student Data
      getStudentPrograms()
        .then((progs) => { if (Array.isArray(progs) && progs.length > 0) setProgramsData(progs); })
        .catch((err) => console.error('Failed to load student programs:', err));

      getStudentWorkspace()
        .then((wsProjects) => {
          if (Array.isArray(wsProjects) && wsProjects.length > 0) {
            setProjects(wsProjects);
          } else {
            getProgramByIdOrSlug(studentData.defaultProgramSlug)
              .then((data) => { if (data?.projects) setProjects(data.projects); })
              .catch((err) => console.error('Failed to load program projects:', err));
          }
        })
        .catch(() => {
          getProgramByIdOrSlug(studentData.defaultProgramSlug)
            .then((data) => { if (data?.projects) setProjects(data.projects); })
            .catch((err) => console.error('Failed to load program projects:', err));
        });

      getStudentOverview().then((data) => { if (data) setOverviewData(data); });
      getStudentProfile().then((data) => { if (data) setProfileData(data); });
      getStudentSubmissions().then((data) => { if (Array.isArray(data)) setSubmissionsList(data); });
      getStudentRubrics().then((data) => { if (Array.isArray(data)) setRubricsList(data); });
    }
  }, [isAdmin, isCollege]);

  const studentObj = (user as any)?.student;
  const firstName = studentObj?.firstName || user?.firstName || '';
  const lastName = studentObj?.lastName || user?.lastName || '';
  
  const displayName = profileData?.displayName || (
    (firstName || lastName)
      ? `${firstName} ${lastName}`.trim()
      : user?.email
      ? user.email.split('@')[0]
      : 'User Account'
  );

  const userEmail = profileData?.email || user?.email || 'user@engineersclinic.com';
  const institutionName = profileData?.institutionName || studentData.profile.institutionName;
  const verificationStatus = profileData?.verificationStatus || studentData.profile.verificationStatus;

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-bgSoft">
      {/* Pinned Left Sidebar */}
      <UserSidebar
        activeSlug={activeSlug}
        onSelectSlug={handleNavigateSlug}
        onOpenProfile={() => handleNavigateSlug('profile')}
      />

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto p-6 sm:p-8">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Super Admin Console Views */}
          {isAdmin ? (
            <>
              {activeSlug === 'overview' && (
                <AdminOverview
                  overviewData={adminOverviewData}
                  onApproveCollege={handleApproveCollege}
                  onRejectCollege={handleRejectCollege}
                  onNavigateSlug={handleNavigateSlug}
                />
              )}

              {activeSlug === 'students' && (
                selectedStudentId ? (
                  <AdminStudentDetailView
                    studentId={selectedStudentId}
                    onBack={() => handleNavigateSlug('students')}
                  />
                ) : (
                  <AdminStudentsListView
                    onSelectStudent={(id) => handleNavigateSlug('students', id)}
                  />
                )
              )}

              {activeSlug === 'studentdetail' && selectedStudentId && (
                <AdminStudentDetailView
                  studentId={selectedStudentId}
                  onBack={() => handleNavigateSlug('students')}
                />
              )}

              {activeSlug === 'colleges' && (
                selectedCollegeId ? (
                  <AdminCollegeDetailView
                    collegeId={selectedCollegeId}
                    onBack={() => handleNavigateSlug('colleges')}
                    onSelectStudent={(sId) => handleNavigateSlug('students', sId)}
                  />
                ) : (
                  <AdminCollegesView
                    colleges={adminColleges}
                    onApproveCollege={handleApproveCollege}
                    onRejectCollege={handleRejectCollege}
                    onSelectCollege={(cId) => handleNavigateSlug('colleges', cId)}
                  />
                )
              )}

              {activeSlug === 'collegedetail' && selectedCollegeId && (
                <AdminCollegeDetailView
                  collegeId={selectedCollegeId}
                  onBack={() => handleNavigateSlug('colleges')}
                  onSelectStudent={(sId) => handleNavigateSlug('students', sId)}
                />
              )}

              {activeSlug === 'users' && (
                <AdminUsersView
                  users={adminUsers}
                  onUpdateUserStatus={handleUpdateUserStatus}
                  onViewStudentDetail={handleViewStudentDetail}
                  onViewCollegeDetail={handleViewCollegeDetail}
                />
              )}

              {activeSlug === 'programs' && (
                <AdminProgramsView
                  programs={catalogPrograms}
                  onProgramUpdated={() => getPrograms().then((p) => setCatalogPrograms(p))}
                />
              )}

              {activeSlug === 'submissions' && <AdminSubmissionsView />}
              {activeSlug === 'coupons' && <AdminCouponsView />}
              {activeSlug === 'orders' && <AdminOrdersView />}
            </>
          ) : isCollege ? (
            /* B2B College Portal Views */
            <>
              {activeSlug === 'overview' && (
                <CollegeOverview
                  overviewData={collegeOverviewData}
                  onNavigateSlug={handleNavigateSlug}
                />
              )}

              {activeSlug === 'program' && (
                <AdminProgramsView
                  programs={catalogPrograms}
                />
              )}

              {activeSlug === 'students' && (
                <CollegeStudentsView
                  students={collegeStudents}
                />
              )}

              {activeSlug === 'coupons' && (
                <CollegeCouponsView
                  coupons={collegeCoupons}
                />
              )}

              {activeSlug === 'reports' && (
                <CollegeReportsView
                  reportsData={collegeReports}
                />
              )}
            </>
          ) : (
            /* B2C Student Dashboard Views */
            <>
              {activeSlug === 'overview' && (
                <StudentOverview
                  projects={projects}
                  overviewData={overviewData}
                  programsData={programsData}
                  onSelectSlug={handleNavigateSlug}
                  onNavigateSlug={handleNavigateSlug}
                />
              )}

              {activeSlug === 'program' && (
                <StudentProgramView
                  programsData={programsData}
                  fallbackProjects={projects}
                  projects={projects}
                  submissions={submissionsList}
                  onOpenSubmitModal={handleOpenSubmissionModal}
                  onSubmitTaskWork={handleOpenSubmissionModal}
                  onRepoUpdated={() => {
                    getStudentPrograms().then((progs) => {
                      if (Array.isArray(progs) && progs.length > 0) setProgramsData(progs);
                    });
                  }}
                />
              )}

              {activeSlug === 'submissions' && (
                <StudentSubmissionsView
                  submissions={submissionsList}
                  onNavigateProgram={() => handleNavigateSlug('program')}
                />
              )}

              {activeSlug === 'certificate' && (
                <div className="rounded-[24px] border border-borderLight bg-white p-8 text-center space-y-4 shadow-xs">
                  <div className="h-14 w-14 rounded-full bg-brand/10 text-brand flex items-center justify-center mx-auto">
                    <Award className="h-7 w-7" />
                  </div>
                  <h2 className="text-xl font-black text-textPrimary">Verified Internship Certificate</h2>
                  <p className="text-xs text-textMuted max-w-md mx-auto">
                    Complete all 3 capstone projects and pass AI evaluation rubrics to unlock your verifiable certificate and transcript badge.
                  </p>
                  <div className="inline-block rounded-full bg-brand/10 px-4 py-1.5 text-xs font-bold text-brand">
                    {overviewData?.metrics?.completionPercentage || studentData.metrics.completionPercentage}% Complete
                  </div>
                </div>
              )}

              {activeSlug === 'rubrics' && <StudentRubricsView rubrics={rubricsList} />}

              {(activeSlug === 'orders' || activeSlug === 'payments') && (
                <StudentOrdersView onNavigateProgram={() => handleNavigateSlug('program')} />
              )}
            </>
          )}

          {/* Profile & Institution Details Tab */}
          {activeSlug === 'profile' && (
            <div className="rounded-[28px] border border-borderLight bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-borderLight pb-4">
                <div>
                  <h2 className="text-xl font-black text-textPrimary">User & Institution Profile</h2>
                  <p className="text-xs text-textMuted">Account credentials and verification status</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand uppercase tracking-wider">
                    {activeRole}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Task Submission Modal */}
      {!isAdmin && !isCollege && selectedTask && (
        <TaskSubmissionModal
          isOpen={isModalOpen}
          taskId={selectedTask.id}
          taskTitle={selectedTask.title}
          repoUrl={selectedTask.repoUrl}
          workspaceId={selectedTask.workspaceId}
          onClose={() => setIsModalOpen(false)}
          onSubmitSuccess={handleSubmissionSuccess}
          submitFn={submitStudentTask}
        />
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthProvider>
      <Suspense
        fallback={
          <div className="flex h-screen w-screen items-center justify-center bg-bgSoft">
            <Loader2 className="h-8 w-8 animate-spin text-brand" />
          </div>
        }
      >
        <DashboardContent />
      </Suspense>
    </AuthProvider>
  );
}
