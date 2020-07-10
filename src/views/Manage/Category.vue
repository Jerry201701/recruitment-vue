<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.label" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-search"
            :label="$t('action.search')"
            perms="manage:category:view"
            type="primary"
            @click="findPage(null)"
          />
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-plus"
            :label="$t('action.add')"
            perms="manage:category:add"
            type="primary"
            @click="handleAdd"
          />
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格内容栏-->
    <kt-table
      :height="350"
      permsEdit="manage:category:edit"
      permsDelete="manage:category:delete"
      :data="pageResult"
      :columns="columns"
      @findPage="findPage"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
    ></kt-table>
    <!--新增编辑界面 -->
    <el-dialog
      :title="operation?'新增':'编辑'"
      width="40%"
      :visible.sync="editDialogVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="dataForm"
        label-width="120px"
        label-position="left"
        :rules="dataFormRules"
        ref="dataForm"
        :size="size"
      >
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model="dataForm.categoryName" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="标签名称" prop="label">
          <el-input v-model="dataForm.label" auto-complete="off"></el-input>
        </el-form-item>

        	<el-form-item label="标签logo" :label-width="formLabelWidth" >
      <el-upload
		action=""
		name="multipartfiles"
		multiple
		:on-success="uploadSuccess"
		:before-upload="onBeforeUpload"
		:limit="3">
		<el-button size="small" type="primary">点击上传图片</el-button>
		</el-upload>
    </el-form-item> 

        <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark" auto-complete="off"></el-input>
        </el-form-item>
<!--         
        <el-form-item label="区域名称" prop="regionName">
          <el-select v-model="dataForm.regionId" placeholder="请选择区域" style="float:left;">
					<el-option
					v-for="item in regions"
					:key="item.key"
					:label="item.key"
					:value="item.value">
					</el-option>
					</el-select>
        </el-form-item> -->

      </el-form>

      <div></div>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="editDialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button
          :size="size"
          type="primary"
          @click.native="submitForm"
          :loading="editLoading"
        >{{$t('action.submit')}}</el-button>
      </div>
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
import COS from "cos-js-sdk-v5";

export default {
  components: {
    KtTable,
    KtButton,
    TableTreeColumn,
    PopupTreeInput,
    FaIconTooltip
  },
  data() {
    return {
      selectCategory: "",
      myHeaders: { token: Cookies.get("token") },
      limitNum: 1,
      formLabelWidth: "80px",
      form: {
        file: ""
      },
      fileList: [],
      uploadImgUrl: this.$api.good.fileUpload,
      size: "small",
      filters: {
        label: ""
      },
      columns: [
        { prop: "id", label: "ID", minWidth: 50 },
        { prop: "categoryName", label: "分类名称", minWidth: 80 },
        { prop: "regionName", label: "校区名称", minWidth: 80 },
        { prop: "logoUrl", label: "图片路径", minWidth: 80 },
        { prop: "remark", label: "备注", minWidth: 80 },
        {
          prop: "createTime",
          label: "创建时间",
          minWidth: 100,
          formatter: this.dateFormat
        },
        {
          prop: "lastUpdateTime",
          label: "修改时间",
          minWidth: 100,
          formatter: this.dateFormat
        }
      ],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},
      operation: false, // true:新增, false:编辑
      editDialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dataFormRules: {
        goodName: [{ required: true, message: "请输入名称", trigger: "blur" }],
        goodDesc: [{ required: true, message: "请输入描述", trigger: "blur" }],
        minPrice: [{ required: true, message: "请输入价格", trigger: "blur" }]
      },
      // 新增编辑界面数据
      dataForm: {
        id: 0,
        categoryName: "",
        logoUrl: "",
        remark: "",
        label: "",
        regionId:0
      },
       regions:[]
     

    };
  },

  methods: {

     uploadSuccess:function(e){
	 
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
			 that.dataForm.logoUrl='https:'+data.Location
		 }
		 
	})

	})
	
},
  

    // 获取分页数据
    findPage: function(data) {
      //  this.$api.user.findRegionByUser({'userId':sessionStorage.getItem('userId')}).then((res) => {
      //   this.regionId=res.data;
      // if (data !== null) {
      //   this.pageRequest = data.pageRequest;
      // }
      // this.pageRequest.columnFilters = {
      //   label: { name: "regionId", value:  this.regionId}
      // };
      // this.$api.category.findPage(this.pageRequest).then(res => {
      //     this.pageResult = res.data;
      //   })
      //   .then(data != null ? data.callback : "");
      //     });
       this.$api.user.findRegionByUser({'userId':sessionStorage.getItem('userId')}).then((res) => {
        this.regionId=res.data;
      if (data !== null) {
        this.pageRequest = data.pageRequest;
      }
      this.pageRequest.columnFilters = {
        label: { name: "regionId", value:  this.regionId}
      };
      this.$api.category.findPage(this.pageRequest).then(res => {
          this.pageResult = res.data;
        })
        .then(data != null ? data.callback : "");
      });
    },
    // 批量删除
    handleDelete: function(data) {
      this.$api.advertisement.batchDelete(data.params).then(data != null ? data.callback : "");
    },
    // 显示新增界面
    handleAdd: function() {
      // this.regions=[]
      // this.$api.region.showAllRegions().then(res=>{
      //   console.log(res)
      //   res.data.forEach(element =>{
      //     this.regions.push({
      //       value:element.id,
      //       key:element.regionName
      //     })
      //   }
      //   )
      // })
     
      this.editDialogVisible = true;
      this.operation = true;
      this.dataForm = {
        id: 0,
        categoryName: "",
        logoUrl: "",
        label:"",
        remark:"",
        regionId:this.regionId
     
      };
    },

    // 显示编辑界面
    handleEdit: function(params) {
      this.editDialogVisible = true;
      this.operation = false;
      this.dataForm = Object.assign({}, params.row);
    },
  
    // 编辑
    submitForm: function() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let params = Object.assign({}, this.dataForm);
            this.$api.category.save(params).then(res => {
              if (res.code == 200) {
                this.$message({ message: "操作成功", type: "success" });
              } else {
                this.$message({
                  message: "操作失败, " + res.msg,
                  type: "error"
                });
              }
              this.editLoading = false;
              this.$refs["dataForm"].resetFields();
              this.editDialogVisible = false;
              this.findPage(null);
            });
          });
        }
      });
    },
    // 时间格式化
    dateFormat: function(row, column, cellValue, index) {
      return format(row[column.property]);
    }
  },

  mounted() {
    //this.findTreeData()
  }
};
</script>

<style scoped>
</style>