"use client"
import React, { useEffect, useState } from 'react'
import { useSession } from "next-auth/react"
import { client } from '@/sanity/lib/client'
import MDEditor from '@uiw/react-md-editor'

interface SanityUser {
  _id: string;
  username?: string;
  email?: string;
  image?: string;
  Bio?: string;
}

export interface Project {
  _id: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  user?: SanityUser;
  slug?: {
    _type: 'slug';
    current: string;
  };
  category?: string;
  details?: string;
}

interface PageProps {
  params: Promise<{
    projectid: string;
  }>;
}

const Page = ({ params }: PageProps) => {
  const { data: session } = useSession()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [resolvedParams, setResolvedParams] = useState<{ projectid: string } | null>(null)

  // Params ko resolve karo
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params
      setResolvedParams(resolved)
    }
    resolveParams()
  }, [params])

  // Sanity se project data fetch karo jab params resolve ho jaaye
  useEffect(() => {
    if (!resolvedParams) return

    const fetchProject = async () => {
      try {
        const query = `*[_type == "project" && _id == $id][0]{
          _id,
          title,
          description,
          imageUrl,
          category,
          details,
          user->{
            _id,
            username,
            email,
            image,
            Bio
          },
          slug
        }`
        
        const projectData = await client.fetch(query, { id: resolvedParams.projectid })
        console.log("Fetched project:", projectData) // Debugging ke liye
        setProject(projectData)
      } catch (error) {
        console.error('Error fetching project from Sanity:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [resolvedParams])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl">Loading project...</p>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl text-red-500">Project not found</p>
      </div>
    )
  }

  return (
    <>
      <div className="relative flex h-[350px] w-full flex-col items-center justify-center overflow-hidden bg-gray-900">
        {/* Title and subtitle */}
        <div className="relative z-10 text-center">
          <h2 className="mx-auto max-w-4xl text-2xl font-bold text-neutral-300 md:text-4xl lg:text-7xl dark:text-neutral-100">
            {project.title}
          </h2>
          <p className="mt-10 text-neutral-400 dark:text-neutral-500">
            {project.description}
          </p>
        </div>
      </div>

      <section className='section_container flex justify-center'>
        <div className='items-center max-w-4xl'>
          {/* Image with proper styling */}
          <img 
            className='mt-10 rounded-2xl w-full h-auto max-h-[500px] object-cover' 
            src={project.imageUrl || "https://imgs.search.brave.com/nxyM_kBqNUYblzJH7EBTIqqU8dNnny2aGWsygAeU7OE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jaXJj/dWl0ZGlnZXN0LmNv/bS9zaXRlcy9kZWZh/dWx0L2ZpbGVzL3By/b2plY3RpbWFnZV9t/aWMvV2lyZWxlc3Mt/QXJkdWluby1Sb2Jv/dC5qcGc"} 
            alt="project img" 
            onError={(e) => {
              // Fallback image agar original image load na ho
              e.currentTarget.src = "https://imgs.search.brave.com/nxyM_kBqNUYblzJH7EBTIqqU8dNnny2aGWsygAeU7OE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jaXJj/dWl0ZGlnZXN0LmNv/bS9zaXRlcy9kZWZh/dWx0L2ZpbGVzL3By/b2plY3RpbWFnZV9t/aWMvV2lyZWxlc3Mt/QXJkdWluby1Sb2Jv/dC5qcGc"
            }}
          />

          <div className='info mt-5 flex justify-between items-center'>
            <div className='flex gap-4 items-center'>
              <img 
                src={project.user?.image || "/profile.png"} 
                alt="profile_img" 
                width={64} 
                height={64} 
                className="rounded-full"
              />
              <div className='flex flex-col gap-1'>
                <p className='text-[20px] font-medium'>
                  {project.user?.username || "Unknown User"}
                </p>
                <p className='text-[17px] font-small text-gray-600'>
                  {project.user?.email || "No email"}
                </p>
              </div>
            </div>
            <div className='bg-blue-200 rounded-full px-6 py-2'>
              <p className='text-center text-sm font-medium'>
                {project.category}
              </p>
            </div>
          </div>

          <h3 className='text-[30px] font-medium mt-7'>PROJECT DETAILS</h3>
          
          {/* Markdown Content Display */}
          <div className='mt-4' data-color-mode='light'>
            {project.details ? (
              <MDEditor.Markdown 
                source={project.details} 
                style={{ 
                  whiteSpace: 'pre-wrap',
                  backgroundColor: 'transparent',
                  color: 'inherit',
                  fontSize: '15px',
                  lineHeight: '1.6'
                }}
              />
            ) : (
              <p className='text-[15px] font-small text-gray-500'>No details provided.</p>
            )}
          </div>
          
          <hr className='divider mt-8'/>
          <br />
          <br />
        </div>
      </section>
    </>
  )
}

export default Page