import axios from '../axios'

/* 
 * 结算模式设置
 */

// 保存
export const save = (data) => {
    return axios({
        url: '/settling/add',
        method: 'post',
        data
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/settling/delete',
        method: 'post',
        data
    })
}
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/settling/find/page',
        method: 'post',
        data
    })
}
//分页显示要勾选的店铺
export const ruleShops = (data) => {
    return axios({
        url: '/settling/rule/shops',
        method: 'post',
        data
    })
}
export const addDeliveryRule = (data) => {
    return axios({
        url: '/settling/choose/shop',
        method: 'post',
        data
    })
}
export const listStoreByRule = (params) => {
    return axios({
        url: '/settling/store/rule',
        method: 'get',
        params
    })
}

//根据regionId查询商户信息
export const findCompanys = (regionId) => {
    return axios({
        url: '/settling/list/tree?regionId='+regionId,
        method: 'get',
        
    })
}

//根据companyId查询门店信息
export const findShops = (companyId) => {
    return axios({
        url: '/settling/find/shops?companyId='+companyId,
        method: 'get',
        
    })
}
//根据shopId查询商品信息
export const findGoods = (shopId) => {
    return axios({
        url: '/settling/find/goods?shopId='+shopId,
        method: 'get',
        
    })
}
//根据结算id查询,必须用params,否则取不到参数，报400

export const findCheck = (params) => {
    return axios({
        url: '/settling/check',
        method: 'get',
        params
        
    })
}