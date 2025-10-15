import {z} from "zod";

// File validation schema
const imageFileSchema = z.instanceof(File).refine(
  (file) => file.size <= 5 * 1024 * 1024, 
  "File size must be less than 5MB"
).refine(
  (file) => file.type.startsWith("image/"),
  "Must be an image file"
);

export const formSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(50),
    description: z.string().min(4, "Description must be at least 4 characters").max(70),
    category: z.string().min(3, "Category must be at least 3 characters").max(25),
    
    // Either file upload OR image URL
    imageFile: imageFileSchema.optional(),
    imageUrl: z.string().url("Please enter a valid URL").optional()
    
}).refine((data) => data.imageFile || data.imageUrl, {
    message: "Either upload an image file or provide an image URL",
    path: ["imageUrl"]
});

// Server action ke liye alag schema
export const serverFormSchema = z.object({
    title: z.string().min(3).max(50),
    description: z.string().min(4).max(70),
    category: z.string().min(3).max(25),
    details: z.string().min(10)
});