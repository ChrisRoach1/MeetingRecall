import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import axios from 'redaxios'
import { queryOptions } from '@tanstack/react-query'
import { useAuth } from '@clerk/tanstack-start'



export type Notes = {
  id: number;
  originalNotes: string
  summarizedNotes: string
  createdOn: Date
}


export async function fetchNotes(token: string){
  return axios
    .get<Array<Notes>>('https://localhost:7193/api/meetingnotes',{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    .then((r) => r.data)
}




export const notesQueryOptions = (token: string, userId: string) =>
  queryOptions({
    queryKey: ['notes', userId],
    queryFn: () => fetchNotes(token),
  })
  
