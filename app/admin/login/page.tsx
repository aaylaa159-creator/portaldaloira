import Image from 'next/image';
import Link from 'next/link';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';

export const dynamic = 'force-dynamic';

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="mb-8 flex flex-col items-center">
        <Image src="/logo.png" alt="Portal da Loira" width={180} height={48} priority />
        <p className="mt-2 text-sm text-gray-500">Painel da redação</p>
      </div>
      <div className="relative w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center font-display text-xl font-bold text-gray-900">
          Entrar
        </h1>
        <AdminLoginForm />
      </div>
      <p className="mt-6 text-center text-xs text-gray-400">
        <Link href="/" className="hover:text-brand-600">
          ← Voltar ao site
        </Link>
      </p>
    </div>
  );
}
