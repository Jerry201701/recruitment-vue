import axios from '../axios'

/* 
 * 商品管理
 */

// 保存
export const save = (data) => {
    return axios({
        url: '/goods/save',
        method: 'post',
        data
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/goods/delete',
        method: 'post',
        data
    })
}
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/order/findPage',
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

 
  // 查询单笔订单详情
export const getOrderDetail = (data) => {
    return axios({
        url: '/order/detail?orderNumber='+data,
        method: 'get',
        
    })
}

 //处理订单
export const handleOrder = (data) => {
    return axios({
        url: '/order/handle?id='+data,
        method: 'get',
        
    })
}
 //订单列表展示
export const pageOrders = (data) => {
    return axios({
        url: '/manager/list/order',
        method: 'post',
        data
        
    })
}
//订单详情
export const showOrderDetail = (params) => {
    return axios({
        url: '/manager/show/order/detail',
        method: 'get',
        params
        
    })
}

 