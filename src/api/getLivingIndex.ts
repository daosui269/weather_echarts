import http from '@/utils/request'

const getLivingIndex = (data: string) =>{
  return http({
    method:'get',
    url: '/v7/indices/1d',
    params:{
      'location': data,
      'type': '1,2,3,4,15'
    }
  })
}
export default getLivingIndex