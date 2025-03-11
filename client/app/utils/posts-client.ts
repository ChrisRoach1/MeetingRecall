import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import axios from 'redaxios'
import { queryOptions } from '@tanstack/react-query'
import { useAuth } from '@clerk/tanstack-start'



export type WeatherForecastType = {
  date: Date
  temperatureC: number
  temperatureF: number
  summary: string
}


export async function fetchWeather(token: string){

  console.log( `token ${token}`)
  console.info('Fetching weather...')
  return axios
    .get<Array<WeatherForecastType>>('https://localhost:7193/WeatherForecast',{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    .then((r) => r.data.slice(0, 10))
}




export const weatherQueryOptions = (token: string) =>
  queryOptions({
    queryKey: ['weather'],
    queryFn: () => fetchWeather(token),
  })
  
