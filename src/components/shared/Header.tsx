import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '../ui/button'
import NavItems from './NavItems'
import MobileNav from './MobileNav'

export default function Header() {
  return (
    <header className=" w-full border-b">
      <div className="wrapper flex justify-between items-center">
        <Link href={'/'} className=" ">
          <h1 className=" border border-amber-500 border-solid text-3xl font-black">Book.</h1>
        </Link>

        <SignedIn>
          <nav className="hidden md:flex-between w-full max-w-xs  ">
            <NavItems />
          </nav>
        </SignedIn>

        <div className=" border border-amber-500 border-solid flex justify-end gap-3">
          <SignedOut>
            <Button asChild className=" rounded-full" size={'lg'}>
              <Link href="/sign-in">Login</Link>
            </Button>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
            <span className="md:hidden">
              <MobileNav />
            </span>
          </SignedIn>
        </div>
      </div>
    </header>
  )
}
