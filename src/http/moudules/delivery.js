import axios from '../axios'

/* 
 * 产品种类管理
 */

// 保存
export const save = (data) => {
    return axios({
        url: '/delivery/edit',
        method: 'post',
        data
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/category/delete',
        method: 'post',
        data
    })
}
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/delivery/find/page',
        method: 'post',
        data
    })
}