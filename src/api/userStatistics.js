import request from '@/utils/request'
/**
 *
 * @param {*} query
 * @returns
 */
export function GetStatisticsView(query) {
  return request({
    url: '/api/Task/GetStatisticsView',
    method: 'get',
    params: query
  })
}

