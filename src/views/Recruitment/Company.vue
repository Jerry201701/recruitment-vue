<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" :size="size">
			<el-form-item>
				<el-input v-model="filters.label" placeholder="种类名称"></el-input>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:dict:view" type="primary" @click="findPage(null)"/>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-plus" :label="$t('action.add')" perms="sys:dict:add" type="primary" @click="handleAdd" />
			</el-form-item>
		</el-form>
	</div>
   <div>
       <!-- <label>音频测试</label> -->
   
    <audio autoplay muted ref="audio"  id="my_audio" src="/static/111.mp3" controls="controls" ></audio>

    <!-- 音频播放控件 -->
    <!-- <div>
      <el-button type="text" @click="startPlayOrPause">{{audio.playing | transPlayPause}}</el-button>
    </div> -->

    <div>
      <el-button type="text" @click="play">{{websocketMsg}}</el-button>
    </div> 

  </div>
	<!--表格内容栏-->
	<kt-table :height="350" permsEdit="sys:dict:edit" permsDelete="sys:dict:delete"
		:data="pageResult" :columns="columns" 
		@findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete">
	</kt-table>
	<!--新增编辑界面-->
	<el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="editDialogVisible" :close-on-click-modal="false">
		<el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size">
			<el-form-item label="ID" prop="id"  v-if="false">
				<el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="名称" prop="categoryName">
				<el-input v-model="dataForm.categoryName" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="排序" prop="paixu">
				<el-input v-model="dataForm.paixu" auto-complete="off"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button :size="size" @click.native="editDialogVisible = false">{{$t('action.cancel')}}</el-button>
			<el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
		</div>
	</el-dialog>
  </div>
</template>

<script>
import KtTable from "@/views/Core/KtTable"
import KtButton from "@/views/Core/KtButton"
import { format } from "@/utils/datetime"
export default {
	components:{
			KtTable,
			KtButton
	},
	data() {
		return {
			size: 'small',
			filters: {
				label: ''
			},
			columns: [
				{prop:"id", label:"ID", minWidth:50},
				{prop:"categoryName", label:"名称", minWidth:100},
				{prop:"paixu", label:"排序", minWidth:80},
				{prop:"createBy", label:"创建人", minWidth:100},
				{prop:"createTime", label:"创建时间", minWidth:120, formatter:this.dateFormat},
				{prop:"lastUpdateBy", label:"最后修改人", minWidth:100},
				{prop:"lastUpdateTime", label:"最后修改时间", minWidth:120, formatter:this.dateFormat}
			],
			pageRequest: { pageNum: 1, pageSize: 10 },
			pageResult: {},

			operation: false, // true:新增, false:编辑
			editDialogVisible: false, // 新增编辑界面是否显示
			editLoading: false,
			dataFormRules: {
				label: [
					{ required: true, message: '请输入名称', trigger: 'blur' }
				]
			},
			// 新增编辑界面数据
			dataForm: {
				id: 0,
				categoryName: '',
				paixu: ''
				
            },
            
            audio: {
        // 该字段是音频是否处于播放状态的属性
        playing: false
	  },
	  path:'ws://localhost:8080/socket/lily',
	  socket:'',
	  websocketMsg:''
	  
		}
	},
	methods: {
		 // 播放音频
    
		// 获取分页数据
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
		 ceshi:function(){
           var socket = new WebSocket(this.path);
           var _this = this;
           socket.onmessage=function(event){
             //  _this.testWebsocket();
           }
		},
		testWebsocket:function(msg){
			console.log(msg);
			 this.$refs.audio.play();	
		},
		
		open: function () {
            console.log("socket连接成功")
        },
        error: function () {
            console.log("连接错误")
        },
        getMessage: function (msg) {
			//console.log(msg);
			this.websocketMsg=msg.data
			//console.log(this.sound)
			var _this=this
			_this.sound.play()

			//	this.sound.play()
			// var _this = this;
			// _this.$refs.audio.play();
        },
        send: function () {
            this.socket.send(params)
        },
        close: function () {
            console.log("socket已经关闭")
        
    },
  

		findPage: function (data) {
			if(data !== null) {
				this.pageRequest = data.pageRequest
			}
			this.pageRequest.columnFilters = {label: {name:'categoryName', value:this.filters.label}}
			this.$api.category.findPage(this.pageRequest).then((res) => {
				console.log(res.data);
				this.pageResult = res.data
			}).then(data!=null?data.callback:'')
		},
		// 批量删除
		handleDelete: function (data) {
			this.$api.category.batchDelete(data.params).then(data!=null?data.callback:'')
		},
		// 显示新增界面
		handleAdd: function () {
			this.editDialogVisible = true
			this.operation = true
			this.dataForm = {
				id: 0,
				categoryName: '',
				paixu: 0
			//	description: 'desc',
			//	remarks: 'remark'
			}
		},
		// 显示编辑界面
		handleEdit: function (params) {
			this.editDialogVisible = true
			this.operation = false
			this.dataForm = Object.assign({}, params.row)
		},
	
		// 编辑
		submitForm: function () {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true
						let params = Object.assign({}, this.dataForm)
						this.$api.category.save(params).then((res) => {
							if(res.code == 200) {
								this.$message({ message: '操作成功', type: 'success' })
							} else {
								this.$message({message: '操作失败, ' + res.msg, type: 'error'})
							}
							this.editLoading = false
							this.$refs['dataForm'].resetFields()
							this.editDialogVisible = false
							this.findPage(null)
						})
					})
				}
			})
		},

		play:function() {
		console.log('开始播放')
		this.sound.audio.play()
     // this.$refs.audio.play()
    },
		
		// 时间格式化
      	dateFormat: function (row, column, cellValue, index){
          	return format(row[column.property])
      	}
	},
		

    // 控制音频的播放与暂停
    startPlayOrPause () {
      return this.audio.playing ? this.pause() : this.play()
	},
	
   
    // 暂停音频
    pause () {
      this.$refs.audio.pause()
    },
    // 当音频播放
    onPlay () {
      this.audio.playing = true
    },
    // 当音频暂停
    onPause () {
      this.audio.playing = false
    
  },
  msgChang:function(){
		//console.log(this.websocketMsg)
		 this.$refs.audio.play()
  },
  	mounted() {
		  this.sound = document.querySelector('#my_audio');
		   this.init()
	},
	
  filters: {
    // 使用组件过滤器来动态改变按钮的显示
    transPlayPause(value) {
      return value ? '暂停' : '播放'
    }
  },

  watch: {
	
    }
  
}
</script>

<style scoped>

</style>