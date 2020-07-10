import axios from '../axios'

/* 
 * 字典管理模块
 */

// 保存
export const save = (data) => {
    return axios({
        url: '/manage/add/category',
        method: 'post',
        data
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/manage/category/delete',
        method: 'post',
        data
    })
}
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/manage/find/page',
        method: 'post',
        data
    })
}
//根据parentId获取子分类下的种类名称

export const findCategoryTree = (params) => {
    return axios({
        url: '/manage/category/tree',
        method: 'get',
        params
    })
}


//添加招聘区域
export const addRecruitmentRegion = (data) => {
    return axios({
        url: '/manage/region/add',
        method: 'post',
        data
    })
}

//分页查询区域
export const pageRecruitmentRegion = (data) => {
    return axios({
        url: '/manage/region/page',
        method: 'post',
        data
    })
}


//编辑招聘区域信息
export const editRecruitmentRegiond = (data) => {
    return axios({
        url: '/manage/region/edit',
        method: 'post',
        params
    })
}


//删除招聘区域
export const deleteRecruitmentRegion = (data) => {
    return axios({
        url: '/manage/region/batch/delete',
        method: 'post',
        data
    })
}

//分页显示招聘的单位
export const findCompanyPage = (data) => {
    return axios({
        url: '/company/page',
        method: 'post',
        data
    })
}
//审核
export const checkCompany = (data) => {
    return axios({
        url: '/company/check',
        method: 'post',
        data
    })
}



