import http from '@/utils/request'

const getWeather24H = (data: string) =>{
  
  return http({
    method: 'get',
    url: '/v7/weather/24h',
    params:{
      'location': data
    }
  })
}
export default getWeather24H