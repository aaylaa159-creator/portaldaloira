import { AuthorForm } from '@/components/admin/AuthorForm';

export default function NewAuthorPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Novo autor</h1>
      <AuthorForm />
    </div>
  );
}
