import http from '@/utils/request'

const getCityMsg = (data: Array<Number>) =>{  
  return http({
    method: 'get',
    url: '/v2/city/lookup',
    baseURL: 'https://geoapi.qweather.com',
    params:{
      'location':data[0] + ',' + data[1]
    }
  })
}
export default getCityMsg