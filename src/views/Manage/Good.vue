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
            perms="manage:good:view"
            type="primary"
            @click="findPage(null)"
          />
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-plus"
            :label="$t('action.add')"
            perms="manage:good:add"
            type="primary"
            @click="handleAdd"
          />
        </el-form-item>
      </el-form>
    </div>
    <!--表格内容栏-->
    <kt-table :height="350" permsEdit="manage:good:edit" permsDelete="manage:good:delete"
		:data="pageResult" :columns="columns" 
		@findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete">
    </kt-table>
    <!--新增编辑界面-->
    <el-dialog
      :title="operation?'新增':'编辑'"
      width="40%"
      :visible.sync="editDialogVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="dataForm"
        label-width="80px"
        :rules="dataFormRules"
        ref="dataForm"
        :size="size"
      >
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品名称" prop="goodName">
          <el-input v-model="dataForm.goodName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goodPrice">
          <el-input v-model="dataForm.goodPrice" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品单位" prop="unit">
          <el-input v-model="dataForm.unit" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品库存" prop="stock">
          <el-input v-model="dataForm.stock" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品特性" prop="feature">
          <el-input v-model="dataForm.feature" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否上架" prop="onShelf">
          <el-radio-group v-model="dataForm.onShelf">
            <el-radio :label="0">开启</el-radio>
            <el-radio :label="1">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上架计划" prop="salePlan">
          <el-input v-model="dataForm.salePlan" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="库存复原" prop="restore">
          <el-radio-group v-model="dataForm.restore">
            <el-radio :label="0">开启</el-radio>
            <el-radio :label="1">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商品图片" :label-width="formLabelWidth">
          <el-upload
            action
            name="multipartfiles"
            :headers="myHeaders"
            multiple
            :on-success="uploadSuccess"
            :before-upload="onBeforeUpload"
            :limit="3"
          >
            <el-button size="small" type="primary">点击上传图片</el-button>
          </el-upload>
        </el-form-item>
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
        { prop: "goodName", label: "商品名称", minWidth: 80 },
        { prop: "price", label: "商品价格", minWidth: 80 },
        { prop: "unit", label: "商品单位", minWidth: 80 },
        { prop: "shopName", label: "所属门店", minWidth: 80 },
        { prop: "onShelf", label: "是否上架", minWidth: 80 ,formatter:this.goodStatusFormat},
        {
          prop: "createTime",
          label: "创建时间",
          minWidth: 120,
          formatter: this.dateFormat
        }
        //{prop:"lastUpdateBy", label:"最后修改人", minWidth:100},
        //{prop:"lastUpdateTime", label:"最后修改时间", minWidth:120, formatter:this.dateFormat}
      ],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},

      operation: false, // true:新增, false:编辑
      editDialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dataFormRules: {
        goodName: [{ required: true, message: "请输入名称", trigger: "blur" }],
        goodDesc: [{ required: true, message: "请输入描述", trigger: "blur" }],
        minPrice: [{ required: true, message: "请输入价格", trigger: "blur" }],
        specifications: [
          { required: true, message: "请输入规格", trigger: "blur" }
        ],
        stores: [{ required: true, message: "请输入总数", trigger: "blur" }],
        category: [{ required: true, message: "请选择种类", trigger: "blur" }],
        imageUrl: [{ required: true, message: "请上传图片", trigger: "blur" }]
      },
      // 新增编辑界面数据
      dataForm: {
        id: 0,
        goodName: "",
        goodPrice: 0,
        unit: "",
        stock: 0,
        feature: "",
        superior: 0,
        salePlan: "",
        onShelf: false,
        restore: false
      },
      imgPath: "",
      popupTreeData: [],
      popupTreeProps: {
        label: "categoryName",
        children: "children"
      },
      options: [
        {
          value: true,
          label: "推荐"
        },
        {
          value: false,
          label: "不推荐"
        }
      ],
      recommend: false,
      pictures: [],
      regionId:0

    };
  },

  methods: {
    // 获取数据
    findTreeData: function() {
      this.loading = true;
      this.$api.good.findCategoryTree().then(res => {
        this.tableTreeDdata = res.data;
        //this.popupTreeData = this.getParentMenuTree(res.data)
        this.popupTreeData = res.data;
        //console.log(this.popupTreeData)
        this.loading = false;
      });
    },
    // 获取上级机构树
    getParentMenuTree: function(tableTreeDdata) {
     
      let parent = {
        // parentId: 0,
        //  name: '顶级菜单',
        id: 0,
        categoryName: "请点击选择",
        children: tableTreeDdata
      };
      return [parent];
    },

    uploadSuccess: function(e) {},

    onBeforeUpload: function(file) {
      var that = this;
      var secretId;
      var secretkey;
      var secretToken;
      var expireTime;
      this.$api.company.getTempSecret().then(function(res) {
        let secretId = res.data.tmpSecretId;
        let secretkey = res.data.tmpSecretKey;
        let secretToken = res.data.sessionToken;
        let expireTime = res.data.expiredTime;
        var cos = new COS({
          getAuthorization: function(options, callback) {
            callback({
              TmpSecretId: secretId,
              TmpSecretKey: secretkey,
              XCosSecurityToken: secretToken,
              ExpiredTime: expireTime
            });
          },
          FileParallelLimit: 5, // 控制文件上传并发数
          ChunkParallelLimit: 5, // 控制单个文件下分片上传并发数
          ProgressInterval: 1000
        });
        cos.putObject(
          {
            Bucket: "waimai-1257008423",
            Region: "ap-chengdu",
            Key: "manage/good" + file.name,
            Body: file
          },
          function(err, data) {
            // console.log(err || data);
            if (data) {
              that.pictures.push({
                pictureUrl: "https://" + data.Location,
                pictureType: 1
              });
            }
          }
        );
        //	console.log(that.pictures)
      });
    },

    // 获取分页数据
    findPage: function(data) {
          this.$api.user.findRegionByUser({'userId':sessionStorage.getItem('userId')}).then((res) => {
      if (data !== null) {
        this.pageRequest = data.pageRequest;
      }
      // this.pageRequest.columnFilters = {
      //   label: { name: "goodName", value: this.filters.label }
      // };
      this.$api.good
        .findPage({regionId:res.data,pageNum:this.pageRequest.pageNum,pageSize:this.pageRequest.pageSize})
        .then(res => {
          this.pageResult = res.data;
         
        })
        .then(data != null ? data.callback : "");
        this.regionId=res.data;
        
         })
    },
    // 批量删除
    handleDelete: function(data) {
      this.$api.good
        .batchDelete(data.params)
        .then(data != null ? data.callback : "");
    },
    // 显示新增界面
    handleAdd: function() {
      this.editDialogVisible = true;
      this.operation = true;
      this.dataForm = {
        id: 0,
        goodName: "",
        goodPrice: 0,
        unit: "",
        stock: 0,
        feature: "",
        superior: 0,
        salePlan: '',
        onShelf: false,
        restore: false
      };
    },

    // 显示编辑界面
    handleEdit: function(params) {
      this.editDialogVisible = true;
      this.operation = false;
      this.dataForm = Object.assign({}, params.row);
    },
    // 机构树选中
    handleTreeSelectChange(data, node) {
      this.dataForm.categoryId = data.id;
      this.dataForm.categoryName = data.categoryName;
      this.selectCategory = data.categoryName;
    },
      goodStatusFormat:function(row,column,cellValue,index){
      return row[column.property]?'上架':'未上架'
  },
    // 编辑
    submitForm: function() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            this.dataForm.pic = this.imgPath;
            let params = Object.assign({}, this.dataForm);
            this.$api.good.save(params).then(res => {
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