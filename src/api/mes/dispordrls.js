import request from '@/utils/request'

const api_name = '/mes/dispordrls'

export default {
  // 查询列表界面
  findPageDispOrdRls(dispOrdRlsQuery, pageNum, pageSize) {
    return request({
      url: `${api_name}/${pageNum}/${pageSize}`,
      method: 'post',
      data: dispOrdRlsQuery
    })
  },
  // 回显
  view(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'get'
    })
  },
  // 下达
  updateRelease(id) {
    return request({
      url: `${api_name}/updateRelease/${id}`,
      method: 'get'
    })
  }
}
