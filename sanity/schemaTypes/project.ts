import { source } from "motion/react-client";
import { defineField, defineType } from "sanity";

export const project = defineType({
    name: 'project',
    title: 'Projects',
    type: 'document',
    fields: [
        defineField({
            name: 'slug',
            type: 'slug',
            options: {
                source: 'title'
            }
        }),
        defineField({
            name: 'title',
            type: 'string'
        }),
        defineField({
            name: 'user',
            type: 'reference',
            to: { type: 'user' }
        }),
        defineField({
            name: 'description',
            type: 'text'
        }),
        defineField({
            name: 'category',
            type: 'string'
        }),
        defineField({
            name: 'imageUrl',
            type: 'url'
        }),
        defineField({
            name: 'details',
            type: 'markdown'
        })
    ]
})
