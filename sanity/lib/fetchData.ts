import { client } from './client'

export const fetchData = async (query: string, params?: any) => {
  try {
    const data = await client.fetch(query, params);
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}