<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.label" placeholder="订单号"></el-input>
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-search"
            :label="$t('action.search')"
            perms="sys:dict:view"
            type="primary"
            @click="findPage(null)"
          />
        </el-form-item>
        <el-form-item>
          <div style="">
    <audio autoplay muted ref="audio"  id="my_audio" src="/static/111.mp3" controls="controls" ></audio>
          </div>
        </el-form-item>
       
      </el-form>
    </div>
	<!--表格内容栏-->
	<kt-table :height="350" permsEdit="sys:order:view" :showOperation="show" :showDetail="detail"
		:data="pageResult" :columns="columns"  
		@findPage="findPage" @getSingleDetail="getSingleDetail" @handleOrder="handleOrder">
	</kt-table>

  <!--新增编辑界面-->
	<el-dialog title="订单详情" width="80%" :visible.sync="editDialogVisible" :close-on-click-modal="false">
		 <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
         prop="id"
        label="商品编号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="goodName"
        label="商品名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="categoryName"
        label="商品种类"
        width="180">
      </el-table-column>
      <el-table-column
        prop="specifications"
        label="商品规格"
        width="180">
      </el-table-column>
      <el-table-column
        prop="minPrice"
        label="商品单价"
         width="180">
      </el-table-column>
      <el-table-column
        prop="quantity"
        label="商品数量"
         width="180">
      </el-table-column>
    </el-table>
	</el-dialog>
   
  </div>
</template>

<script>
import TableTreeColumn from "@/views/Core/TableTreeColumn";
import PopupTreeInput from "@/components/PopupTreeInput";
import FaIconTooltip from "@/components/FaIconTooltip";
import KtTable from "@/views/Core/KtTable";
import KtButton from "@/views/Core/KtButton";
import { format } from "@/utils/datetime";
import axios from "axios";
import Cookies from "js-cookie";

export default {
  components: {
    KtTable ,
    KtButton,
    TableTreeColumn,
    PopupTreeInput,
    FaIconTooltip
  },
  data() {
    return {
      show:false,
      detail:true,
      selectCategory: "",
      limitNum: 1,
      formLabelWidth: "80px",
      form: {
        file: ""
      },
      size: "small",
      filters: {
        label: ""
      },
      columns: [
        { prop: "id", label: "订单编号", minWidth: 100 },
        { prop: "amount", label: "消费额", minWidth: 100 },
        { prop: "address", label: "收货地址", minWidth: 180 },
        { prop: "remark", label: "备注", minWidth: 100 },
        { prop: "handled", label: "订单状态", minWidth: 100,formatter:this.tranOrderStatus},
        {
          prop: "createTime",
          label: "创建时间",
          minWidth: 120,
          formatter: this.dateFormat
        }
      ],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},

      operation: false, // true:新增, false:编辑
      editDialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      // 详情界面数据
      tableData: [],
      audio: {
        // 该字段是音频是否处于播放状态的属性
        playing: false
	  },
	  path:'ws://localhost:8050/socket/lily',
	  socket:'',
	  websocketMsg:''
    };
  },

  methods: {

     init: function () {
			 console.log('初始化')
            if(typeof(WebSocket) === "undefined"){
                alert("您的浏览器不支持socket")
            }else{
				console.log('websocket连接建立成功')
                // 实例化socket
                this.socket = new WebSocket(this.path)
                // 监听socket连接
                this.socket.onopen = this.open
                // 监听socket错误信息
                this.socket.onerror = this.error
                // 监听socket消息
			          this.socket.onmessage = this.getMessage
			  
            }
		},
		
		  open: function () {
            console.log("socket连接成功")
        },
        error: function () {
            console.log("连接错误")
        },
        getMessage: function (msg) {
        //   var _this=this
        
        //    _this.$api.order.getOrderDetail(msg.data).then(res=>{
        //   console.log(res)
        // })
        
		//	this.websocketMsg=msg.data
		//	var _this=this
		//	_this.sound.play()
        },
        send: function () {
            this.socket.send(params)
        },
        close: function () {
            console.log("socket已经关闭")
        
    },
  

    // 获取分页数据
    findPage: function(data) {
      if (data !== null) {
        this.pageRequest = data.pageRequest;
      }
      this.pageRequest.columnFilters = {
        label: { name: "goodName", value: this.filters.label }
      };
      this.$api.order
        .findPage(this.pageRequest)
        .then(res => {
          this.pageResult = res.data;
        })
        .then(data != null ? data.callback : "");
    },
    tranOrderStatus:function(row,column){
     // return row.handled==true ? "已处理" : "未处理"
      return row.handled?"已处理":"未处理"

    },




    // 订单详情展示页面
		getSingleDetail: function (params) {
			this.editDialogVisible = true
			this.operation = false
      //this.tableData = Object.assign({}, params.row)
      //console.log(params.row.orderNumber)
     // var   orderNumber='29afdac767eb4411bb2b04fc165b040920191020153853190'
    
      this.$api.order.getOrderDetail(params.row.orderNumber).then(res=>{
          this.tableData=res.data
        })
        .then(params != null ? params.callback : "");
    },
    handleOrder:function(params){
        console.log(params)
         this.$api.order.handleOrder(params.row.id).then(res=>{
         // this.tableData=res.data
         this.findPage(null)
        })
        .then(params != null ? params.callback : "");
    },

    // 时间格式化
    dateFormat: function(row, column, cellValue, index) {
      return format(row[column.property]);
    }
  },

  mounted() {
      this.sound = document.querySelector('#my_audio');
		   this.init()
   // this.findTreeData();
  }
};
</script>

<style scoped>
</style>