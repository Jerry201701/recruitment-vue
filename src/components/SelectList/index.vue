<template id="template">
            <select>
                <option value="-1">请选择</option>
                <option v-for="item in items" v-bind:value="item.id">{{item.name}}</option>
            </select>
        </template>
        <script src="vue.js"></script>
        <script>
            //1.创建组件
            Vue.component("dsh-select-list", {
                props: ['items'],
                template: '#template'
            });
 
 
            //2.初始化
            var app = new Vue({
                el: "#app",
                data: {
                    //数组:用户角色
                    roles: [{
                            id: 1,
                            name: "管理员"
                        },
                        {
                            id: 2,
                            name: "普通用户"
                        }
                    ],
                    //数组:商品分类
                    types: [{
                            id: 1,
                            name: "零食"
                        },
                        {
                            id: 2,
                            name: "数码"
                        },
                        {
                            id: 3,
                            name: "生活用品"
                        },
 
                    ]
                }
            })
        </script>