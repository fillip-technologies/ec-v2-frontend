'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import roleSidebarConfig from '@/config/roleSidebarConfig.json';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  FolderKanban,
  Send,
  ClipboardList,
  Award,
  CreditCard,
  Users,
  User,
  LogOut,
} from 'lucide-react';

export interface UserSidebarProps {
  activeSlug: string;
  onSelectSlug: (slug: string) => void;
  onOpenProfile?: () => void;
}

export const UserSidebar: React.FC<UserSidebarProps> = ({
  activeSlug,
  onSelectSlug,
  onOpenProfile,
}) => {
  const { user, roleName, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userRole = roleName || 'student';

  // Load sidebar config dynamically based on active user role from JSON
  const roleConfig =
    (roleSidebarConfig as Record<string, any>)[userRole] || roleSidebarConfig.student;

  const getIconForSlug = (slug: string) => {
    switch (slug) {
      case 'overview':
        return <LayoutDashboard className="h-4 w-4" />;
      case 'projects':
      case 'programs':
      case 'program':
        return <FolderKanban className="h-4 w-4" />;
      case 'submissions':
        return <Send className="h-4 w-4" />;
      case 'rubrics':
        return <ClipboardList className="h-4 w-4" />;
      case 'certificate':
        return <Award className="h-4 w-4" />;
      case 'payments':
        return <CreditCard className="h-4 w-4" />;
      case 'students':
      case 'users':
      case 'colleges':
        return <Users className="h-4 w-4" />;
      case 'profile':
        return <User className="h-4 w-4" />;
      default:
        return <FolderKanban className="h-4 w-4" />;
    }
  };

  const studentObj = (user as any)?.student;
  const firstName = studentObj?.firstName || user?.firstName || '';
  const lastName = studentObj?.lastName || user?.lastName || '';

  const displayName = mounted
    ? (firstName || lastName)
      ? `${firstName} ${lastName}`.trim()
      : user?.email
      ? user.email.split('@')[0]
      : 'Account'
    : 'Account';

  const avatarInitials = mounted
    ? firstName
      ? `${firstName[0]}${lastName ? lastName[0] : ''}`.toUpperCase()
      : user?.email
      ? user.email[0].toUpperCase()
      : 'U'
    : 'U';

  const userEmailDisplay = mounted ? user?.email || 'Logged in user' : 'Logged in user';

  return (
    <aside className="w-64 h-full shrink-0 border-r border-borderLight bg-white p-5 flex flex-col justify-between overflow-y-auto selection:bg-brand selection:text-white">
      <div className="space-y-6">
        {/* Portal Header / Brand Logo */}
        <div className="px-1 pt-1">
          <Link
            href="/"
            className="block transition-opacity hover:opacity-85"
            aria-label="Engineers Clinic Home"
          >
            <Image
              src="/images/Engineers-clinic-logo-black.png"
              alt="Engineers Clinic"
              width={220}
              height={56}
              priority
              className="h-12 w-auto max-w-full object-contain"
            />
          </Link>
          <div
            className="text-[10px] font-extrabold text-textMuted uppercase tracking-widest mt-2 px-1"
            suppressHydrationWarning
          >
            {roleConfig.roleName || 'Student Portal'}
          </div>
        </div>

        {/* Dynamic Navigation Groups from JSON */}
        {roleConfig.groups?.map((group: any) => (
          <div key={group.id} className="space-y-1.5">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-textMuted px-2">
              {group.label}
            </div>

            <nav className="space-y-1">
              {group.items
                ?.filter((item: any) => item.enabled !== false)
                .map((item: any) => {
                  const isActive = activeSlug === item.slug;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectSlug(item.slug)}
                      className={`w-full flex items-center gap-3 rounded-[14px] px-3 py-2.5 text-xs font-bold transition-all text-left cursor-pointer ${
                        isActive
                          ? 'bg-brand text-white shadow-xs'
                          : 'text-textPrimary hover:bg-bgSoft hover:text-brand'
                      }`}
                    >
                      {getIconForSlug(item.slug)}
                      <span>{item.label}</span>
                    </button>
                  );
                })}
            </nav>
          </div>
        ))}
      </div>

      {/* Sidebar Bottom Footer: Person Circle Avatar + User Name + Logout Button */}
      <div className="mt-6 pt-4">
        <div className="flex items-center justify-between gap-2 rounded-[20px] bg-bgSoft p-2.5 border border-borderLight/60">
          {/* Avatar & User Name (Clicking opens Profile) */}
          <button
            onClick={() => {
              if (onOpenProfile) onOpenProfile();
              else onSelectSlug('profile');
            }}
            className="flex items-center gap-2.5 flex-1 min-w-0 text-left group cursor-pointer"
            title="Open Profile"
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand font-black text-xs group-hover:bg-brand group-hover:text-white transition-all"
              suppressHydrationWarning
            >
              {avatarInitials}
            </div>
            <div className="flex-1 truncate">
              <div
                className="text-xs font-extrabold text-textPrimary truncate group-hover:text-brand transition-all"
                suppressHydrationWarning
              >
                {displayName}
              </div>
              <div
                className="text-[10px] font-medium text-textMuted truncate"
                suppressHydrationWarning
              >
                {userEmailDisplay}
              </div>
            </div>
          </button>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-dangerLight text-danger hover:bg-danger hover:text-white transition-all cursor-pointer"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
