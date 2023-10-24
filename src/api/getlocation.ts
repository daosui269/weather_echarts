import http from '@/utils/request'

const getlocation = () =>{
  return http({
    method: 'get',
    // baseURL: 'https://apis.map.qq.com',
    baseURL: '/api',
    url: '/ws/location/v1/ip',
    // headers: {'Content-Type':'application/json'},
    params:{
      key:'3SYBZ-PFD3B-E5FU5-JDDHM-V6Y2Q-JZFBD',
    }
  })
}
export default getlocation