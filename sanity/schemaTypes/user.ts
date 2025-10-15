import { defineField, defineType } from "sanity"
import { UserIcon } from "@sanity/icons";

export const user = defineType(
    {
        name: 'user',
        title: 'Users',
        type: 'document',
        icon: UserIcon,
        fields: [
            defineField({
                name: 'id',
                type: 'number'
            }),
            defineField({
                name: 'username',
                type: 'string'
            }),
            defineField({
                name: 'email',
                type: 'string'
            }),
            defineField({
                name: 'image',
                type: 'url'
            }),
            defineField({
                name: 'Bio',
                type: 'text'
            })
        ],
        preview: {
            select: {
                "title": "username"
            }
        }
    }
)



