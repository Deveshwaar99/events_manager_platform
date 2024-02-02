'use client'

import { useCallback, Dispatch, SetStateAction } from 'react'
import { useDropzone } from '@uploadthing/react/hooks'
import { generateClientDropzoneAccept } from 'uploadthing/client'

import { Button } from '@/components/ui/button'
import { convertFileToUrl } from '@/lib/utils'

import Image from 'next/image'
import uploadIcon from '../../../public/assets/icons/upload.svg'

type FileUploaderProps = {
  onFieldChange: (url: string) => void
  imageUrl: string
  setFiles: Dispatch<SetStateAction<File[]>>
}

export default function FileUploader({ imageUrl, onFieldChange, setFiles }: FileUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles(acceptedFiles)
      onFieldChange(convertFileToUrl(acceptedFiles[0]))
    },
    [onFieldChange, setFiles]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*' ? generateClientDropzoneAccept(['image/*']) : undefined,
  })

  return (
    <div
      {...getRootProps()}
      className="flex flex-col overflow-hidden cursor-pointer flex-center bg-dark-3 h-72 rounded-xl bg-grey-50"
    >
      <input {...getInputProps()} className="cursor-pointer" />

      {imageUrl ? (
        <div className="flex justify-center flex-1 w-full h-full ">
          <Image
            src={imageUrl}
            alt="image"
            width={250}
            height={250}
            className="object-cover object-center w-full"
          />
        </div>
      ) : (
        <div className="flex-col py-5 flex-center text-grey-500">
          <Image src={uploadIcon} width={77} height={77} alt="file upload" />
          <h3 className="mt-2 mb-2">Drag photo here</h3>
          <p className="mb-4 p-medium-12">SVG, PNG, JPG</p>
          <Button type="button" className="rounded-full">
            Select from computer
          </Button>
        </div>
      )}
    </div>
  )
}
