import axios from '../axios'

/* 
 * 商品管理
 */

// 保存
export const save = (data) => {
    return axios({
        url: '/company/add',
        method: 'post',
        data
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/company/delete',
        method: 'post',
        data
    })
}
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/company/findPage',
        method: 'post',
        data
    })
}
//图片上传
export const fileUpload =(fileobj) =>{
    let param = new FormData()
    param.append('files',fileobj.file)
    return axios({
      method: 'post',
      url: '/docmanager/upload',
      headers: {'Content-Type':'multipart/form-data'},
      data: param
    })
  }

  export const uploadImg =(data)=>{
      return axios({
          url:'/goods/uploads',
          method:'post',
          headers: {'Content-Type':'multipart/form-data'},
          data:data
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
        url:'/upload/create/secret',
        method: 'get'
    })
}
//获取用户所属商户
export const listCompanys = (userId) => {
    return axios({
        url:'/company/list/user?userId='+userId,
        method: 'get',
        
    })
}

  export const REVIEW_COMPLAINTS_UPLOAD='goods/uploads'