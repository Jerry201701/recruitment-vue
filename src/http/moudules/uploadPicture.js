import Vue from 'vue'
import SparkMD5 from 'spark-md5'
import COS  from 'cos-js-sdk-v5'
import axios from '../axios'



// var cos = new COS({

//     getAuthorization: function (options, callback) {
//         axios({
//             url:'/upload/create/secret',
//             method: 'get'
//         }).then((res)=>{

//         })
//         $.get('http://example.com/server/sts.php', {
//         }, function (data) {
//             callback({
//                 TmpSecretId: data.TmpSecretId,
//                 TmpSecretKey: data.TmpSecretKey,
//                 XCosSecurityToken: data.XCosSecurityToken,
//                 ExpiredTime: data.ExpiredTime, 
//             });
//         });
//     }
// })


