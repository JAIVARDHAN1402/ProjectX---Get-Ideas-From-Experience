'use client'

/**
 * This configuration is used for the Sanity Studio that’s mounted
 * on the `\app\studio\[[...tool]]\page.tsx` route
 */

import { defineConfig } from 'sanity'
import { visionTool } from '@sanity/vision'
import { structureTool } from 'sanity/structure'
import { UserIcon } from '@sanity/icons'
import { markdownSchema } from 'sanity-plugin-markdown'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from './sanity/env'
import { schema } from './sanity/schemaTypes'
import { structure } from './sanity/structure'

export default defineConfig({
  name: 'default',
  title: 'My Studio',
  icon: UserIcon, 
  basePath: '/studio',
  projectId,
  dataset,

  schema,
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
    markdownSchema(),
  ],
})
