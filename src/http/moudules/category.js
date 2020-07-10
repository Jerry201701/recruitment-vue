import axios from '../axios'

/* 
 * 产品种类管理
 */

// 保存
export const save = (data) => {
    return axios({
        url: '/manage/category',
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
        url: '/category/page/region',
        method: 'post',
        data
    })
}