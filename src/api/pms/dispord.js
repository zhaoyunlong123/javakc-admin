import request from '@/utils/request'

const api_name = '/pms/dispord'

export default {
  // ## 动态条件查询
  findPageDispOrd(dispOrdQuery, pageNum, pageSize) {
    return request({
      url: `${api_name}/${pageNum}/${pageSize}`,
      method: 'post',
      data: dispOrdQuery
    })
  },
  // 创建调度指令库
  save(dispOrd) {
    return request({
      url: `${api_name}/createDispOrd`,
      method: `post`,
      data: dispOrd
    })
  },
  // 回显
  getById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'get',
    })
  },
  // 修改
  update(dispOrd) {
    return request({
      url: `${api_name}/updateDispOrd`,
      method: 'put',
      data: dispOrd
    })
  },
  // 删除
  delete(id) {
    return request({
        url: `${api_name}/${id}`,
        method: 'delete'
    })
  }
}
