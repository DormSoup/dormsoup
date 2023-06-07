import Image from 'next/image'
import { Inter } from 'next/font/google'

import { getServerSession } from 'next-auth';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const session = await getServerSession(authOptions);
  console.log(session);
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className='w-full'>
        Welcome to Dormsoup!
      </div>
    </main>
  )
}
