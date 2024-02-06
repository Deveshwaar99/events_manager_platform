'use client'

import { useState } from 'react'

//ui
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import Dropdown from '@/components/shared/Dropdown'
import FileUploader from '@/components/shared/FileUploader'
//DatePicker
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

//form
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

//zod
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

//image
import Image from 'next/image'
import locationImg from '../../../public/assets/icons/location-grey.svg'
import calendarImg from '../../../public/assets/icons/calendar.svg'
import priceImg from '../../../public/assets/icons/dollar.svg'
import urlImg from '../../../public/assets/icons/link.svg'

//uploadthing
import { useUploadThing } from '@/lib/uploadthing'

import { createEvent, updateEventById } from '@/lib/database/actions/events.actions'
import { useRouter } from 'next/navigation'
import { handleError } from '@/lib/utils'
import { IEvent } from '@/lib/database/models/events.models'

type EventFormProps = {
  userId: string
  eventId: string
  event?: IEvent
  type: 'update' | 'create'
}

const formSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters.')
    .max(30, 'Title must be less than 30 characters'),

  description: z
    .string()
    .min(2, 'Description must be at least 2 characters.')
    .max(700, 'Description must be less than 700 characters'),
  location: z
    .string()
    .min(3, 'Location must be at least 3 characters.')
    .max(50, 'Location must be less than 50 characters'),

  categoryId: z.string().min(3, 'Category must be selected'),
  imageUrl: z.string().min(3, 'Image must be added'),
  startDateTime: z.date(),
  endDateTime: z.date(),
  price: z.string(),
  isFree: z.boolean(),
  url: z.string(),
})

function EventForm({ userId, eventId, event, type }: EventFormProps) {
  //file upload
  const [files, setFiles] = useState<File[]>([])
  const { startUpload } = useUploadThing('imageUploader')

  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: event
      ? {
          ...event,
          categoryId: event.category._id,
          startDateTime: new Date(event.startDateTime),
          endDateTime: new Date(event.endDateTime),
        }
      : {
          title: '',
          description: '',
          location: '',
          categoryId: '',
          imageUrl: '',
          startDateTime: new Date(),
          endDateTime: new Date(),
          price: '',
          isFree: false,
          url: '',
        },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let eventDetails = { ...values }
    let uploadedImageUrl = values.imageUrl

    //uploading the image
    if (files.length) {
      const uploadedImg = await startUpload(files)

      if (!uploadedImg) return

      eventDetails.imageUrl = uploadedImg[0].url
    }
    if (type === 'create') {
      try {
        const newEvent = await createEvent({ userId, eventDetails })
        if (newEvent) {
          form.reset()
          router.push(`/events/${newEvent._id}`)
        }
      } catch (error) {
        handleError(error)
      }
    }

    if (type === 'update') {
      if (!eventId) return router.back()
      try {
        const updatedEvent = await updateEventById({ eventId, userId, eventDetails })
        if (updatedEvent) {
          form.reset()
          router.push(`/events/${updatedEvent._id}`)
        }
      } catch (error) {
        handleError(error)
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col md:flex-row gap-5">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input placeholder="Event title" className="input-field" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="w-full ">
                <FormControl>
                  <Dropdown value={field.value} onValueChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-5">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="h-72 ">
                  <Textarea placeholder="Description" className="rounded-2xl textarea" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <FileUploader
                    onFieldChange={field.onChange}
                    imageUrl={field.value}
                    setFiles={setFiles}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-5">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center bg-grey-50 px-4 py-2 rounded-full w-full h-[54px] overflow-hidden">
                    <Image src={locationImg} alt="location" width={24} height={24} />
                    <Input
                      placeholder="Event location or Online"
                      {...field}
                      className="input-field"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-5">
          <FormField
            control={form.control}
            name="startDateTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex items-center justify-start bg-grey-50 px-4 py-2 rounded-full w-full h-[54px] overflow-hidden">
                    <Image src={calendarImg} alt="calendar" width={24} height={24} />
                    <p className="ml-3 text-grey-600 whitespace-nowrap">Start Date</p>
                    <DatePicker
                      className="w-100"
                      selected={field.value}
                      onChange={(date: Date) => field.onChange(date)}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="MMMM d, yyyy h:mm aa"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDateTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex items-center justify-start bg-grey-50 px-4 py-2 rounded-full w-full h-[54px] overflow-hidden ">
                    <Image src={calendarImg} alt="calendar" width={24} height={24} />
                    <p className="ml-3 text-grey-600 whitespace-nowrap">End Date</p>
                    <DatePicker
                      className="w-100"
                      selected={field.value}
                      onChange={(date: Date) => field.onChange(date)}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="MMMM d, yyyy h:mm aa"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-5">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center bg-grey-50 px-4 py-2 rounded-full w-full h-[54px] overflow-hidden">
                    <Image src={priceImg} alt="price" width={24} height={24} />
                    <Input
                      type="number"
                      placeholder="Price"
                      {...field}
                      className="bg-grey-50 p-regular-16 border-0 focus:border-0 outline-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <FormField
                      control={form.control}
                      name="isFree"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="flex-center gap-2">
                              <label
                                htmlFor="isFree"
                                className="peer-disabled:opacity-70 pr-3 leading-none whitespace-nowrap peer-disabled:cursor-not-allowed"
                              >
                                Free Entry
                              </label>
                              <Checkbox
                                id="isFree"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center bg-grey-50 px-4 py-2 rounded-full w-full h-[54px] overflow-hidden">
                    <Image src={urlImg} alt="url" width={24} height={24} />
                    <Input placeholder="Url" {...field} className="input-field" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="col-span-2 w-full button"
        >
          {' '}
          {type === 'create' && (form.formState.isSubmitting ? 'Submitting...' : 'Submit')}
          {type === 'update' && (form.formState.isSubmitting ? 'Updating...' : 'Update Event')}
        </Button>
      </form>
    </Form>
  )
}

export default EventForm
