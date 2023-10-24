import http from '@/utils/request'

const getWeather7D = (data: string) =>{  
  return http({
    method: 'get',
    url: '/v7/weather/7d',
    params:{
      'location': data
    }
  })
}
export default getWeather7D