import request from '@/utils/request'

export function GetFirstPageStats(query) {
  return request({
    url: '/api/Contact/GetFirstPageStats',
    method: 'get',
    params: query
  })
}
