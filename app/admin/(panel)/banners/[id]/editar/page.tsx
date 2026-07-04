import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { BannerForm } from '@/components/admin/BannerForm';
import type { AdBanner } from '@/lib/types';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBannerPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('ad_banners').select('*').eq('id', id).single<AdBanner>();
  if (!data) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Editar banner</h1>
      <BannerForm banner={data} />
    </div>
  );
}
