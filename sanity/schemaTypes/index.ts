import { type SchemaTypeDefinition } from 'sanity'
import { user } from './user'
import { project } from './project'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [user, project],
}
