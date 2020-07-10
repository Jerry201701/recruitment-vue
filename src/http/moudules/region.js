import axios from '../axios'

/* 
 * 商品管理
 */

// 保存
export const save = (data) => {
    return axios({
        url: '/region/add',
        method: 'post',
        data
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/region/delete',
        method: 'post',
        data
    })
}
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/region/findPage',
        method: 'post',
        data
    })
}
// 获取所有的区域
export const showAllRegions = () => {
    return axios({
        url: '/region/list',
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

  