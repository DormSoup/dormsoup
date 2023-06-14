import { getServerSession } from "next-auth";

<<<<<<< HEAD
import { authOptions } from "./auth";
import EventList from "./eventList";

=======
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

import { LoginButton } from '@/components/buttons';

const inter = Inter({ subsets: ['latin'] })

>>>>>>> 93262a8 (Changes)
export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
<<<<<<< HEAD
    <main className={`flex min-h-screen flex-col items-center justify-between`}>
      <div className="w-full">
        {session === null ? "Welcome to Dormsoup! Sign in to view all the contents" : <EventList />}
=======
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className='w-full'>
        Welcome to Dormsoup!

        <LoginButton></LoginButton>
>>>>>>> 93262a8 (Changes)
      </div>
    </main>
  );
}
