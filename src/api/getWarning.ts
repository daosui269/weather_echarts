import http from '@/utils/request'

// function getWarting(data: Array<Number>): any
// function getWarting(data: string): any
// function getWarting(data: string | Array<Number>): any {
//   if (typeof data == 'string') {
//     return http({
//       method: 'get',
//       url: '/v7/warning/now',
//       params: {
//         'location': data
//       }
//     })
//   } else {
//     return http({
//       method: 'get',
//       url: '/v7/warning/now',
//       params: {
//         'location': data[0] + ',' + data[1]
//       }
//     })
//   }
// }

function getWarting (data: string):any {
  return http({
    method: 'get',
    url: '/v7/warning/now',
    params:{
      'location':data
    }
  })
}
export default getWarting