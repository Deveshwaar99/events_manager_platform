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

import { createEvent } from '@/lib/database/actions/events.actions'
import { useRouter } from 'next/navigation'
import { handleError } from '@/lib/utils'

type EventFormProps = {
  userId: string
  type: 'create' | 'update'
}

const formSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters.')
    .max(15, 'Title must be less than 20 characters'),

  description: z
    .string()
    .min(2, 'Description must be at least 2 characters.')
    .max(350, 'Description must be less than 350 characters'),
  location: z
    .string()
    .min(3, 'Location must be at least 3 characters.')
    .max(15, 'Location must be less than 15 characters'),

  categoryId: z.string(),
  imageUrl: z.string(),
  startDateTime: z.date(),
  endDateTime: z.date(),
  price: z.string(),
  isFree: z.boolean(),
  url: z.string(),
})

function EventForm({ userId, type }: EventFormProps) {
  //file upload
  const [files, setFiles] = useState<File[]>([])
  const { startUpload } = useUploadThing('imageUploader')

  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
        console.log(error)
        handleError(error)
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-5 md:flex-row">
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

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className=" h-72">
                  <Textarea placeholder="Description" className="textarea rounded-2xl" {...field} />
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

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
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

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="startDateTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex justify-start items-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image src={calendarImg} alt="calendar" width={24} height={24} />
                    <p className="ml-3 whitespace-nowrap text-grey-600">Start Date</p>
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
                  <div className=" flex justify-start items-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image src={calendarImg} alt="calendar" width={24} height={24} />
                    <p className="ml-3 whitespace-nowrap text-grey-600">End Date</p>
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

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image src={priceImg} alt="price" width={24} height={24} />
                    <Input
                      type="number"
                      placeholder="Price"
                      {...field}
                      className="border-0 p-regular-16 bg-grey-50 outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <FormField
                      control={form.control}
                      name="isFree"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="gap-2 flex-center">
                              <label
                                htmlFor="isFree"
                                className="pr-3 leading-none whitespace-nowrap peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
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
          className="w-full col-span-2 button"
        >
          {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </Form>
  )
}

export default EventForm
