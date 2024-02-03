'use client'
import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import { ICategory } from '@/lib/database/models/category.models'
import { Input } from '../ui/input'
import { addNewCategory, fetchCategories } from '@/lib/database/actions/category.actions'
type DropdownProps = {
  value: string
  onValueChange: () => void
}

function Dropdown({ value, onValueChange }: DropdownProps) {
  const [categories, setCategories] = useState<ICategory[]>([])
  const [newCategory, setNewCategory] = useState('')

  useEffect(() => {
    async function getCategories() {
      const categoryList = await fetchCategories()
      if (categoryList.length) {
        setCategories(categoryList)
      }
    }
    getCategories()
  }, [])

  async function handleAddCategory() {
    console.log('handleadd')
    if (newCategory.length < 3) return
    const addedCategory = await addNewCategory(newCategory)
    setCategories(prev => [...prev, addedCategory])
    setNewCategory('')
  }
  return (
    <Select onValueChange={onValueChange} defaultValue={value}>
      <SelectTrigger className=" select-field">
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {categories &&
            categories.map(category => (
              <SelectItem key={category._id} value={category._id}>
                {category.name}
              </SelectItem>
            ))}

          <AlertDialog>
            <AlertDialogTrigger className="w-full py-3 pl-8 rounded-sm hover:bg-primary-50 focus:text-primary-500 text-primary-500flex p-medium-14">
              Add Category
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Enter new Category</AlertDialogTitle>
                <AlertDialogDescription>
                  <Input
                    type="string"
                    value={newCategory}
                    placeholder="Type here..."
                    onChange={e => setNewCategory(e.target.value)}
                    className="mt-3 input-field"
                  />
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleAddCategory()}>Add</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default Dropdown
