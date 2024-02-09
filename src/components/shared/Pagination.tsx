'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { Button } from '../ui/button'
import { formUrlQuery } from '@/lib/utils'

function Pagination({ totalPages, page }: { totalPages: number; page: string | number }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  function onClick(type: string) {
    const newPage = type === 'next' ? Number(page) + 1 : Number(page) - 1

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'page',
      value: newPage.toString(),
    })

    router.push(newUrl, { scroll: false })
  }
  return (
    <div className="flex gap-2">
      <Button
        size="lg"
        variant="outline"
        className="w-28"
        onClick={() => onClick('prev')}
        disabled={Number(page) <= 1}
      >
        Previous
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="w-28"
        onClick={() => onClick('next')}
        disabled={Number(page) >= totalPages}
      >
        Next
      </Button>
    </div>
  )
}

export default Pagination
