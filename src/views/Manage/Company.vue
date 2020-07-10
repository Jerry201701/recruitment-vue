<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" :size="size">
			<el-form-item>
				<el-input v-model="filters.label" placeholder="商品名称"></el-input>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:dict:view" type="primary" @click="findPage(null)"/>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-plus" :label="$t('action.add')" perms="sys:dict:add" type="primary" @click="handleAdd" />
			</el-form-item>
		</el-form>
	</div>
	<!--表格内容栏-->
	<kt-table :height="350" permsEdit="manage:company:edit" permsDelete="manage:company:delete"
		:data="pageResult" :columns="columns" 
		@findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete">
	</kt-table>
	<!--新增编辑界面-->
	<el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="editDialogVisible" :close-on-click-modal="false">
		<el-form :model="dataForm" label-width="100px" label-position='left' :rules="dataFormRules" ref="dataForm" :size="size">
			<el-form-item label="ID" prop="id"  v-if="false">
				<el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="老板姓名" prop="bossName">
				<el-input v-model="dataForm.bossName" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="联系方式" prop="phone">
				<el-input v-model="dataForm.phone" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="经营地址" prop="address">
				<el-input v-model="dataForm.address" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="店铺名字" prop="companyName">
				<el-input v-model="dataForm.companyName" auto-complete="off"></el-input>
			</el-form-item>

			<el-form-item label="区域名称" prop="regionName">
          	<el-select v-model="dataForm.regionId" placeholder="啊啊啊啊" style="float:left;">
					<el-option
					v-for="item in regions"
					:key="item.key"
					:label="item.key"
					:value="item.value">
					</el-option>
					</el-select>
        	</el-form-item>

	<el-form-item label="门头照" :label-width="formLabelWidth" >
      <el-upload
		action=""
		name="multipartfiles"
		:headers="myHeaders"
		multiple
		:on-success="uploadSuccess"
		:before-upload="onBeforeUpload"
		:limit="3">
		<el-button size="small" type="primary">点击上传图片</el-button>
		</el-upload>
    </el-form-item> 


	<el-form-item label="内景照" :label-width="formLabelWidth">
      <el-upload
		action=""
		name="multipartfiles"
		:headers="myHeaders"
		multiple
		:on-success="uploadSuccess"
		:before-upload="onBeforeUpload"
		:limit="3">
		<el-button size="small" type="primary">点击上传图片</el-button>
		</el-upload>
    </el-form-item> 

	
	<el-form-item label="收银台照" :label-width="formLabelWidth">
      <el-upload
		action=""
		name="multipartfiles"
		:headers="myHeaders"
		multiple
		:on-success="uploadSuccess"
		:before-upload="onBeforeUpload"
		:limit="3">
		<el-button size="small" type="primary">点击上传图片</el-button>
		</el-upload>
    </el-form-item> 


	
	<el-form-item label="证件资格照" :label-width="formLabelWidth">
      <el-upload
		action=""
		name="multipartfiles"
		:headers="myHeaders"
		multiple
		:on-success="uploadSuccess"
		:before-upload="onBeforeUpload"
		:limit="3">
		<el-button size="small" type="primary">点击上传图片</el-button>
		</el-upload>
    </el-form-item> 


		</el-form>
		<div>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button :size="size" @click.native="editDialogVisible = false">{{$t('action.cancel')}}</el-button>
			<el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
		</div>
	</el-dialog>


	
 
  </div>
</template>
<script>

import TableTreeColumn from '@/views/Core/TableTreeColumn'
import PopupTreeInput from "@/components/PopupTreeInput"
import FaIconTooltip from "@/components/FaIconTooltip"
import KtTable from "@/views/Core/KtTable"
import KtButton from "@/views/Core/KtButton"
import { format } from "@/utils/datetime"
import axios from 'axios'
import Cookies from "js-cookie"
import COS from "cos-js-sdk-v5"


export default {

	
	components:{
			KtTable,
			KtButton,
			TableTreeColumn,
			PopupTreeInput,
			FaIconTooltip
	},
	data() {
		return {
		selectCategory:'',
		myHeaders:{token: Cookies.get('token')},
		limitNum: 1,
		formLabelWidth: '90px',
		labelPositon:'right',
        form: {
			file: ''
      },
      fileList: [],
			uploadImgUrl:this.$api.good.fileUpload,
			size: 'small',
			filters: {
				label: ''
			},
			columns: [
				{prop:"id", label:"ID", minWidth:50},
				{prop:"companyName", label:"公司名称", minWidth:100},
				{prop:"bossName", label:"老板名字", minWidth:80},
				{prop:"address", label:"公司地址", minWidth:80},
				{prop:"phone", label:"联系方式", minWidth:80},
				{prop:"regionName", label:"所在区域", minWidth:100},
				{prop:"createTime", label:"创建时间", minWidth:120, formatter:this.dateFormat},
				//{prop:"lastUpdateBy", label:"最后修改人", minWidth:100},
				//{prop:"lastUpdateTime", label:"最后修改时间", minWidth:120, formatter:this.dateFormat}
			],
			pageRequest: { pageNum: 1, pageSize: 10 },
			pageResult: {},

			operation: false, // true:新增, false:编辑
			editDialogVisible: false, // 新增编辑界面是否显示
			editLoading: false,
			dataFormRules: {
				bossName: [
					{ required: true, message: '请输入老板名字', trigger: 'blur' }
				],
				phone: [
					{ required: true, message: '请输入联系方式', trigger: 'blur' }
				],
				address: [
					{ required: true, message: '请输入地址', trigger: 'blur' }
				],
				companyName: [
					{ required: true, message: '请输入商户名称', trigger: 'blur' }
				],
				regionId: [
					{ required: true, message: '请选择区域', trigger: 'blur' }
				],
				imageUrl: [
					{ required: true, message: '请上传图片', trigger: 'blur' }
				],
			},
			// 新增编辑界面数据
			dataForm: {
				id: 0,
				companyName: '',
				bossName: '',
				phone:'',
				address:'',
				regionId:"",
				pictures:[]
			},
			imgPath:'',
			popupTreeData: [],
			popupTreeProps: {
				label: 'categoryName',
				children: 'children'
			},
			 options: [{
				value: true,
				label: '推荐'
			}, {
			value: false,
			label: '不推荐'
			}],
			regions:[],

       
		recommend: false,
		pictures:[],
		regions:[]
	
		};
	},
	 
	methods: {

		// 获取数据
    findTreeData: function () {
      this.loading = true
			this.$api.good.findCategoryTree().then((res) => {
				this.tableTreeDdata = res.data
				this.popupTreeData = res.data
        		this.loading = false
			})
    },
		// 获取上级机构树
    getParentMenuTree: function (tableTreeDdata) {
      let parent = {
       // parentId: 0,
	  //  name: '顶级菜单',
	  id:0,
	  categoryName:'请点击选择',
      children: tableTreeDdata
	  }
      return [parent]
    },
onBeforeUpload:function(file){
	var that=this
		var secretId
		var secretkey
		var secretToken
		var expireTime
		this.$api.company.getTempSecret().then(function(res){
			console.log(res)
               let secretId= res.data.tmpSecretId
               let secretkey= res.data.tmpSecretKey
               let  secretToken= res.data.sessionToken
			   let  expireTime= res.data.expiredTime
			   	var	cos= new COS({  
	getAuthorization: function (options, callback) {
		callback({
                TmpSecretId: secretId,
                TmpSecretKey: secretkey,
                XCosSecurityToken: secretToken,
				ExpiredTime: expireTime, 
				
            });
	},
	 FileParallelLimit: 5,    // 控制文件上传并发数
    ChunkParallelLimit: 5,   // 控制单个文件下分片上传并发数
    ProgressInterval: 1000, 
});
	cos.putObject({
		Bucket: 'picture2019-1256835711',
        Region: 'ap-beijing',
        Key: 'company/' + file.name,
        Body: file

	},function(err,data){
		// console.log(err || data);
		 if(data){
			 that.pictures.push({pictureUrl:'https:'+data.Location,pictureType:1 })
		 }
		 
	})
 
	})
	
},

 uploadSuccess:function(e){
	 this.imgPath=e;
	 console.log(this.imgPath); 
		},
		
		// 获取分页数据
		findPage: function (data) {
			
			if(data !== null) {
				this.pageRequest = data.pageRequest
			}
			this.pageRequest.columnFilters = {label: {name:'companyName', value:this.filters.label}}
			//console.log(this.dataForm.id)
			//this.pageRequest.columnFilters = {label: {name:'id', value:this.dataForm.id}}
			this.$api.company.findPage(this.pageRequest).then((res) => {
				
				this.pageResult = res.data
			}).then(data!=null?data.callback:'')
		},
		// 批量删除
		handleDelete: function (data) {
			this.$api.company.batchDelete(data.params).then(data!=null?data.callback:'')
		},
		// 显示新增界面
		handleAdd: function () {
		this.regions=[]
      	this.$api.region.showAllRegions().then(res=>{
        res.data.forEach(element =>{
          this.regions.push({
            value:element.id,
            key:element.regionName
          })
        }
        )
      })
    
			this.editDialogVisible = true
			this.operation = true
			this.dataForm = {
				companyName: '',
				bossName: '',
				phone:'',
				address:'',
				pictures:[]
				
			}
		},
		
		// 显示编辑界面
		handleEdit: function (params) {
			this.editDialogVisible = true
			this.operation = false
			this.dataForm = Object.assign({}, params.row)
		},
		// 机构树选中
    handleTreeSelectChange (data, node) {
      this.dataForm.categoryId = data.id
      this.dataForm.categoryName = data.categoryName
	  this.selectCategory=data.categoryName
    },
		// 编辑
		submitForm: function () {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true
						this.dataForm.pictures=this.pictures;
						let params = Object.assign({}, this.dataForm)
						this.$api.company.save(params).then((res) => {
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
		// 时间格式化
      	dateFormat: function (row, column, cellValue, index){
          	return format(row[column.property])
},
	getRegins:function(){
		var category=1;
	this.$api.dict.findRegions({'category':1}).then((res)=>{
		res.data.forEach(element => {
			this.regions.push({
				label:element.label,
				value:element.id

			})
		});
	//	console.log(this.regions)

	})

},
    getSecret:function(){
	this.$api.company.getTempSecret().then((res)=>{
		console.log(res)

	})

}

      	},
	

	mounted() {
		this.getRegins()
	//	this.cosUploadFile()
	//	this.findTreeData()
	}
}
</script>

<style scoped>

</style>