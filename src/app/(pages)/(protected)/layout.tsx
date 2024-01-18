'use server';
import {redirect} from 'next/navigation';
import {headers} from 'next/headers';
import {getClientSession} from '@utils';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const domain = headersList.get('next-url') || '/';

  const session = await getClientSession();

  if (!session) {
    redirect(`/login/?redirect=${domain}`);
  } else {
    return <>{children}</>;
  }
}
