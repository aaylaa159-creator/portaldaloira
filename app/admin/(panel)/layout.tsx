import { requireEditorialUser } from '@/lib/auth/editorial';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export const dynamic = 'force-dynamic';

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireEditorialUser();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar user={user} />
      <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>
    </div>
  );
}
