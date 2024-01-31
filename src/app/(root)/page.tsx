import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

import heroImg from '../../../public/assets/images/hero1.png'

export default function Home() {
  return (
    <>
      <section className="py-5 bg-contain bg-primary-50 bg-random-pattern md:py-10">
        <div className="grid grid-cols-1 gap-5 wrapper md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold">
              Elevate Your Events, Connect Effortlessly, Celebrate Uniquely: Our Platform, Your
              Experience!
            </h1>
            <p className="p-regular-20 md:p-regular-24">
              Tap into 3.5K+ mentors across top companies. Elevate learning in our vibrant global
              community. Wisdom, connections, and innovation await.
            </p>
            <Button size="lg" asChild className="w-full button md:w-fit">
              <Link href="#events">Explore Now</Link>
            </Button>
          </div>

          <Image
            src={heroImg}
            alt="hero"
            width={1200}
            height={1200}
            className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]"
          />
        </div>
      </section>

      <section className="flex flex-col gap-8 my-8 wrapper md:gap-12 ">
        <h2>
          Trusted by <br />
          Thousands of Events
        </h2>
      </section>
    </>
  )
}
