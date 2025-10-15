import { Project, User } from "@/sanity.types"

export type ProjectTypeCard = Omit<Project,'User'> & {
    user? : 'User'  
}