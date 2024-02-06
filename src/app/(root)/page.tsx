import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

import heroImg from '../../../public/assets/images/hero1.png'
import EventsCollection from '@/components/shared/EventsCollection'
import Card from '@/components/shared/Card'
import { fetchAllEvents } from '@/lib/database/actions/events.actions'

export default async function Home({ searchParams }: any) {
  const page = Number(searchParams?.page) || 1
  const searchText = (searchParams?.query as string) || ''
  const category = (searchParams?.category as string) || ''

  const events = await fetchAllEvents({
    query: searchText,
    category,
    page,
    limit: 6,
  })
  return (
    <>
      <section className="bg-primary-50 bg-random-pattern bg-contain py-5 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 2xl:gap-0 wrapper">
          <div className="flex flex-col justify-center gap-4">
            <h1 className="h1-bold">
              Elevate Your Events, Connect Effortlessly, Celebrate Uniquely: Our Platform, Your
              Experience!
            </h1>
            <p className="p-regular-20 md:p-regular-24">
              Tap into 3.5K+ mentors across top companies. Elevate learning in our vibrant global
              community. Wisdom, connections, and innovation await.
            </p>
            <Button size="lg" asChild className="w-full md:w-fit button">
              <Link href="#events">Explore Now</Link>
            </Button>
          </div>

          <Image
            src={heroImg}
            alt="hero"
            width={1200}
            height={1200}
            className="max-h-[70vh] 2xl:max-h-[50vh] object-center object-contain"
          />
        </div>
      </section>

      <section className="flex flex-col gap-8 md:gap-12 my-8 wrapper">
        <h2>
          Trusted by <br />
          Thousands of Events
        </h2>
        <EventsCollection
          data={events?.data}
          emptyTitle="No Events Found"
          emptyStateSubtext="Come back later"
          collectionType="All_Events"
          limit={6}
          page={page}
          totalPages={events?.pageCount}
        />
      </section>
    </>
  )
}
