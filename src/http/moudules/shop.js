import axios from '../axios'

/* 
 * 商品管理
 */

// 保存
export const save = (data) => {
    return axios({
        url: '/shop/info/edit',
        method: 'post',
        data
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/shop/delete',
        method: 'post',
        data
    })
}
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/shop/findPage',
        method: 'post',
        data
    })
}

  
export const findPageByCompany = (data) => {
    return axios({
        url: '/shop/page/company',
        method: 'post',
        data
    })
}

  
  // 查询机构树
export const findCategoryTree = () => {
    return axios({
        url: '/shop/findTree',
        method: 'get'
    })
}

//cos获取临时密钥
export const getTempSecret = () => {
    return axios({
        url:'/upload/create/secret',
        method: 'get'
    })
}
//营收统计statistics
export const shopStatistics = (data) => {
    return axios({
        url:'/manager/statistics',
        method: 'post',
        data
    })
}


  export const REVIEW_COMPLAINTS_UPLOAD='goods/uploads'