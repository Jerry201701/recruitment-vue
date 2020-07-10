import axios from '../axios'

/* 
 * 商品管理
 */

// 保存
export const save = (data) => {
    return axios({
        url: '/withdraw/edit',
        method: 'post',
        data
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/notice/delete',
        method: 'post',
        data
    })
}
// 分页查询
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/withdraw/findPage',
        method: 'post',
        data
    })
}
 
//cos获取临时密钥
export const getTempSecret = () => {
    return axios({
        url:'/upload/create/secret',
        method: 'get'
    })
}

  