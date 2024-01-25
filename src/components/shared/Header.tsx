import { SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '../ui/button'

export default function Header() {
  return (
    <header className=" w-full border-b">
      <div className="wrapper flex justify-between items-center">
        <Link href={'/'} className=" w-36">
          Book-now
        </Link>
        <div>
          <SignedOut>
            <Button asChild className=" rounded-full" size={'lg'}>
              <Link href="/sign-in">Login</Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}
