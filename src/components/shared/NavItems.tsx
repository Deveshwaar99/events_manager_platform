'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const headerLinks = [
  {
    label: 'Home',
    route: '/',
  },
  {
    label: 'Create Event',
    route: '/events/create',
  },
  {
    label: 'My Profile',
    route: '/profile',
  },
]
export default function NavItems() {
  const pathName = usePathname()

  return (
    <ul className=" border border-amber-500 border-solid flex flex-col gap-6 w-full  md:flex-row md:justify-between ">
      {headerLinks.map((link, index) => {
        const isActive = link.route === pathName
        return (
          <li
            key={link.label}
            className={`${isActive && 'text-primary-500'}  p-medium-16 whitespace-nowrap`}
          >
            <Link href={link.route}>{link.label}</Link>
          </li>
        )
      })}
    </ul>
  )
}
