import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import menuIcon from '../../../public/assets/icons/menu.svg'
import NavItems from './NavItems'

export default function MobileNav() {
  return (
    <nav>
      <Sheet>
        <SheetTrigger className=" align-middle">
          <Image
            src={menuIcon}
            alt="menu-icon"
            width={24}
            height={24}
            className=" cursor-pointer"
          ></Image>
        </SheetTrigger>
        <SheetContent className="md:hidden bg-white flex flex-col gap-6 ">
          <h1 className=" text-2xl font-black">Book-now</h1>
          <Separator />
          <NavItems />
        </SheetContent>
      </Sheet>
    </nav>
  )
}
