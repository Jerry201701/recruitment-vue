<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" :size="size">
			<el-form-item>
				<el-input v-model="filters.label" placeholder="名称"></el-input>
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
			<el-form-item label="上级" prop="parentId">
				<div class="block">
  				<!-- <span class="demonstration">单选选择任意一级选项</span> -->
				<el-cascader
					:props="props"
          :options="options"
          @change="chooseChange"
					clearable>
          </el-cascader>
				<!-- <el-cascader
					:options="options"
					:props="{ checkStrictly: true }"
					clearable>
          </el-cascader> -->
				</div>
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
     let that=this;
		return {
			size: 'small',
			filters: {
				label: ''
			},
			columns: [
				{prop:"id", label:"ID", minWidth:50},
				{prop:"categoryName", label:"种类名称", minWidth:100},
				{prop:"parent", label:"上级种类", minWidth:100},
				{prop:"createTime", label:"创建时间", minWidth:120, formatter:this.dateFormat}
				// {prop:"lastUpdateBy", label:"更新人", minWidth:100},
				// {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
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
				parentId: 0,
				categoryName: ''
      },
      props:{
      checkStrictly: true,
      label: 'categoryName',
      value: 'id',
      children: 'children',
      lazy: true,
      lazyLoad(node,resolve){
          that.initData(node,resolve)
        }
},
      //  props: {
      //     checkStrictly:true,
      //     lazy: true,
      //     lazyLoad (node, resolve) {
      //       const { level } = node;
      //       setTimeout(() => {
      //         const nodes = Array.from({ length: level + 1 })
      //           .map(item => ({
      //             value: ++id,
      //             label: `选项${id}`,
      //             leaf: level >= 2
      //           }));
      //         resolve(nodes);
      //       }, 1000);
      //     }
      //   },
      options: [],
      parentId:0
		}
	},
	methods: {
		// 获取分页数据
		findPage: function (data) {
			if(data !== null) {
				this.pageRequest = data.pageRequest
			}
			this.pageRequest.columnFilters = {label: {name:'label', value:this.filters.label}}
			this.$api.job.findPage(this.pageRequest).then((res) => {
				this.pageResult = res.data
			}).then(data!=null?data.callback:'')
    },
    
    getOptions:function() {
      this.$api.job.findCategoryTree({parentId:0}).then(res=>{
        this.options=res.data
        this.options.forEach((item,index)=>{
          this.options[index].children=[]
        })
      })


  // $api.searchAreaInfo({
  //   parentId: 0
  // }).then((res) => {
  //   this.provenceArray = res && res.data && res.data.data || []
  //   this.provenceArray.forEach((item,index)=>{
  //     this.provenceArray[index].cities = [] // 视图未更新
  //     // this.$set(this.provenceArray[index], 'cities', []) // right
  //   })
  // })
    },
    initData:function(node,resolve){
      if(node.value){
        this.$api.job.findCategoryTree({parentId:node.value}).then(res=>{
          resolve(res.data)
          })
          }
       //   console.log(this.parentId)
    },
    chooseChange:function(e){
        this.parentId=e[e.length-1]
    },

 handleItemChange:function(val) {
   let value = val[0]
  // this.dataForm.parentId=value
  console.log(value)
 
},
		// 批量删除
		handleDelete: function (data) {
			this.$api.job.batchDelete(data.params).then(data!=null?data.callback:'')
		},
		// 显示新增界面
		handleAdd: function () {
			this.editDialogVisible = true
			this.operation = true
			this.dataForm = {
				id: 0,
				categoryName: '',
				parentId: 0
      }
      this.getOptions()
		},
		// 显示编辑界面
		handleEdit: function (params) {
			this.editDialogVisible = true
			this.operation = false
      this.dataForm = Object.assign({}, params.row)
      this.getOptions()
		},
		// 编辑
		submitForm: function () {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            console.log(this.parentId)
            this.dataForm.parentId=this.parentId
						let params = Object.assign({}, this.dataForm)
						this.$api.job.save(params).then((res) => {
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
      	}
	},
	mounted() {
	}
}
</script>

<style scoped>

</style>