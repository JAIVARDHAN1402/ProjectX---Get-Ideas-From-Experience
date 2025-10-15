"use client"

import React, { useActionState, useState, useRef } from 'react'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import MDEditor from '@uiw/react-md-editor'
import { Button } from './ui/button'
import { formSchema } from '@/lib/validation'
import { createProject } from '@/lib/action'
import { useRouter } from 'next/navigation'
import { z } from "zod"
import { toast } from 'sonner' 
import { Upload, FileImage, X } from 'lucide-react'

const ProjectForm = () => {
    const [details, setDetails] = useState<string>("")
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [imageUrl, setImageUrl] = useState<string>("")
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error("Error", {
                    description: "Please select an image file (jpg, png, gif, etc.)",
                })
                return
            }
            
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Error", {
                    description: "File size must be less than 5MB",
                })
                return
            }
            
            setSelectedFile(file)
            setImageUrl("")
            setErrors(prev => ({...prev, imageUrl: ""}))
            
            toast.success("File Selected", {
                description: `${file.name} selected successfully`,
            })
        }
    }

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImageUrl(e.target.value)
        if (e.target.value) {
            setSelectedFile(null)
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        }
    }

    const handleRemoveFile = () => {
        setSelectedFile(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleFileButtonClick = () => {
        fileInputRef.current?.click()
    }

    const handleFormSubmit = async (previousState: any, formData: FormData) => {
        try {
            setErrors({})

            const formValues = {
                title: formData.get("title") as string, 
                description: formData.get("description") as string,
                category: formData.get("category") as string,
                imageFile: selectedFile || undefined,
                imageUrl: imageUrl || undefined,
                details
            }

            await formSchema.parseAsync(formValues)

            const submitFormData = new FormData()
            submitFormData.append("title", formValues.title)
            submitFormData.append("description", formValues.description)
            submitFormData.append("category", formValues.category)
            submitFormData.append("details", details)

            if (selectedFile) {
                submitFormData.append("imageFile", selectedFile)
                submitFormData.append("link", URL.createObjectURL(selectedFile))
            } else if (imageUrl) {
                submitFormData.append("link", imageUrl)
            }

            const result = await createProject(previousState, submitFormData)

            if (result.status === 'Success') {
                toast.success("Project Published Successfully!", {
                    description: "Congratulations! Your project has been published.",
                })
                router.push(`/project/${result._id}`)
            } else if (result.error) {
                toast.error("Error", {
                    description: result.error,
                })
            }

            return result

        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors: Record<string, string> = {}
                error.errors.forEach(err => {
                    if (err.path[0]) {
                        fieldErrors[err.path[0] as string] = err.message
                    }
                })
                setErrors(fieldErrors)
                
                toast.error("Validation Error", {
                    description: "Please fill the fields carefully",
                })
                return {...previousState, error: "Validation Error", status: "Error"}
            }

            console.error("Form submission error:", error)
            toast.error("Error", {
                description: "An unknown error occurred",
            })

            return {...previousState, error: "An unknown error occurred", status: "Error"}
        }
    }

    const [state, formAction, isPending] = useActionState(handleFormSubmit, { error: "", status: "INITIAL" })

    return (
        <div className='mt-10 flex justify-center'>
            <form action={formAction} className='flex justify-center w-[500px]'>
                <div className='flex flex-col gap-5'>
                    <div className='w-[500px]'>
                        <label htmlFor="title" className='font-bold'>Title</label>
                        <Input id='title' name='title' className='project-form_input mt-2' required placeholder='Project Title' />
                        {errors.title && <p className='project-form-error'> {errors.title}</p>}
                    </div>
                    <div className='w-[500px]'>
                        <label htmlFor="description" className='font-bold'>Description</label>
                        <Textarea id='description' name='description' className='project-form_description mt-2' required placeholder='Description of the Project in 10 words' />
                        {errors.description && <p className='project-form-error'> {errors.description}</p>}
                    </div>
                    <div className='w-[500px]'>
                        <label htmlFor="category" className='font-bold'>Category</label>
                        <Input id='category' name='category' className='project-form_category mt-2' required placeholder='Mention Category of the Project' />
                        {errors.category && <p className='project-form-error'> {errors.category}</p>}
                    </div>
                    
                    <div className='w-[500px]'>
                        <label className='font-bold'>Project Image *</label>
                        
                        <div className="mt-2">
                            <Input 
                                value={imageUrl}
                                onChange={handleUrlChange}
                                className='project-form_link' 
                                placeholder='Paste image URL here' 
                                disabled={!!selectedFile}
                            />
                        </div>
                        
                        <div className="mt-3">
                            <Button 
                                type="button"
                                onClick={handleFileButtonClick}
                                disabled={!!imageUrl}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                            >
                                <Upload size={16} />
                                Choose File from Computer
                            </Button>
                            
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                        
                        {selectedFile && (
                            <div className="flex items-center justify-between mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                                <div className="flex items-center gap-2">
                                    <FileImage size={16} className="text-green-600" />
                                    <span className="text-sm text-green-700">
                                        {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                                    </span>
                                </div>
                                <Button
                                    type="button"
                                    onClick={handleRemoveFile}
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 hover:bg-red-50"
                                >
                                    <X size={14} className="text-red-500" />
                                </Button>
                            </div>
                        )}
                        
                        {errors.imageUrl && <p className='text-red-500 text-sm mt-1'>{errors.imageUrl}</p>}
                    </div>
                    
                    <div className='w-[500px]' data-color-mode='light'>
                        <label htmlFor="details" className='font-bold'>Details</label>
                        <MDEditor 
                            value={details} 
                            onChange={(value) => setDetails(value || "")}
                            id='details' 
                            className='project-form_details mt-2' 
                            preview='edit' 
                            height={300} 
                            style={{ borderRadius: 20, overflow: 'hidden' }} 
                            textareaProps={{ placeholder: 'Details about the Project' }}
                            previewOptions={{ disallowedElements: ['style'] }}
                        />
                        {errors.details && <p className='project-form-error'> {errors.details}</p>}
                    </div>
                    <Button type='submit' className='project_submit-btn text-white' disabled={isPending}>
                        {isPending ? 'Publishing...' : 'Submit Your Project'}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default ProjectForm