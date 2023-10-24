import http from '@/utils/request'

const getAir = (data: string) =>{
  return http({
    method: 'get',
    url: '/v7/air/now',
    params:{
      location: data
    }
  })
}
export default getAir