import axios from '../axios'

/* 
 * 商品管理
 */

// 保存
export const save = (data) => {
    return axios({
        url: '/shop/good/add',
        method: 'post',
        data
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/good/delete',
        method: 'post',
        data
    })
}
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/shop/good/findPage',
        method: 'post',
        data
    })
}

  // 查询机构树
export const findCategoryTree = () => {
    return axios({
        url: '/goods/findTree',
        method: 'get'
    })
}

//cos获取临时密钥
export const getTempSecret = () => {
    return axios({
        url:'/good/get/secret',
        method: 'get'
    })
}

  export const REVIEW_COMPLAINTS_UPLOAD='goods/uploads'