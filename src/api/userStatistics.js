import request from '@/utils/request'
/**
 *
 * @param {*} query
 * @returns
 */
export function GetAdminStatsUserDrawPageList(query) {
  return request({
    url: '/api/Contact/GetAdminStatsUserDrawPageList',
    method: 'get',
    params: query
  })
}

