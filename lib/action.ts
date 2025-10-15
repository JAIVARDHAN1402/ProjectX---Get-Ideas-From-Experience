// lib/action.ts
"use server"

import { auth } from "@/auth"
import { writeClient } from "@/sanity/lib/write-client"
import { revalidatePath } from "next/cache"

export async function createProject(previousState: any, formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { error: "You must be logged in to create a project", status: "Error" }
  }

  try {
    // Get form data
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const details = formData.get("details") as string
    const imageUrl = formData.get("imageUrl") as string
    const imageFile = formData.get("imageFile") as File

    console.log("Creating project with:", {
      title,
      description,
      category,
      detailsLength: details?.length,
      hasImageUrl: !!imageUrl,
      hasImageFile: !!(imageFile && imageFile.size > 0),
      userId: session.user.id
    })

    let finalImageUrl = ""

    // Case 1: Image URL provided
    if (imageUrl && imageUrl.trim() !== "") {
      finalImageUrl = imageUrl
    }
    // Case 2: Image File provided
    else if (imageFile && imageFile.size > 0) {
      // File ko Sanity mein upload karo
      finalImageUrl = await uploadToSanity(imageFile)
    } else {
      return { error: "Either image file or URL is required", status: "Error" }
    }

    // Sanity mein project create karo - WRITE CLIENT use karo
    const project = await writeClient.create({
      _type: 'project',
      title,
      description,
      category,
      details,
      imageUrl: finalImageUrl,
      user: {
        _type: 'reference',
        _ref: session.user.id,
      },
      slug: {
        _type: 'slug',
        current: title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      },
      views: 0
    })

    console.log("Project created successfully:", project._id)

    revalidatePath('/projects')
    return { 
      status: 'Success', 
      _id: project._id,
      message: 'Project created successfully' 
    }

  } catch (error: any) {
    console.error('Error creating project:', error)
    
    // Detailed error message
    let errorMessage = "Failed to create project"
    if (error.message.includes("token")) {
      errorMessage = "Authentication error - please check your Sanity token"
    } else if (error.message.includes("slug")) {
      errorMessage = "Project with this title already exists"
    } else if (error.message.includes("reference")) {
      errorMessage = "User not found - please login again"
    }
    
    return { error: errorMessage, status: "Error" }
  }
}

// Sanity mein image upload karne ke liye function
async function uploadToSanity(file: File): Promise<string> {
  try {
    // File ko buffer mein convert karo
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Sanity mein asset upload karo - WRITE CLIENT use karo
    const asset = await writeClient.assets.upload('image', buffer, {
      filename: file.name,
    })

    console.log("Image uploaded successfully:", asset.url)
    return asset.url
  } catch (error) {
    console.error('Error uploading image to Sanity:', error)
    throw new Error('Image upload failed')
  }
}