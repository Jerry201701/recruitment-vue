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
            perms="account:region:view"
            type="primary"
            @click="findPage(null)"
          />
        </el-form-item>
        <!-- <el-form-item>
          <kt-button
            icon="fa fa-plus"
            :label="$t('action.add')"
            perms="account:region:add"
            type="primary"
            @click="handleAdd"
          />
        </el-form-item> -->
      </el-form>
    </div>
    <!-- 表格内容栏-->
    <kt-table
      :height="350"
      permsEdit="account:region:edit"
      permsDelete="account:region:delete"
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
        <el-form-item label="账户名称" prop="regionName">
          <el-input v-model="dataForm.accountName" auto-complete="off"></el-input>
        </el-form-item>
         <el-form-item  label="审核" label-width="200px">
           <el-radio  v-model="dataForm.status" label=5>审核通过</el-radio>
           <el-radio  v-model="dataForm.status" label=4>审核未通过</el-radio>
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
        { prop: "withdrawId", label: "ID", minWidth: 50 },
        { prop: "accountName", label: "账户名称", minWidth: 80 },
        { prop: "withdrawAmount", label: "提现金额", minWidth: 50 },
        { prop: "status", label: "状态", minWidth: 50, formatter: this.statusFormat},
        { prop: "type", label: "身份", minWidth: 50, formatter: this.typeFormat },
        {
          prop: "applyTime",
          label: "申请时间",
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
        pass: false
        
       
     
      },
    

    

    };
  },

  methods: {
  

    // 获取分页数据
    findPage: function(data) {
      if (data !== null) {
        this.pageRequest = data.pageRequest;
      }
      this.pageRequest.columnFilters = {
        label: { name: "regionName", value: this.filters.label }
      };
      this.$api.withdrawal.findPage(this.pageRequest).then(res => {
      
          this.pageResult = res.data;
        })
        .then(data != null ? data.callback : "");
    },
    // 批量删除
    handleDelete: function(data) {
      this.$api.region.batchDelete(data.params).then(data != null ? data.callback : "");
    },
    // 显示新增界面
    handleAdd: function() {
      this.editDialogVisible = true;
      this.operation = true;
      this.dataForm = {
        id: 0,
        regionName: "",
        remark: "",
     
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
            this.$api.withdrawal.save(params).then(res => {
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

     typeFormat: function(row,column){
    //   console.log(row.type)
      //  if(row.type==1){
      //    return '商户'
      //  }
      //  if(row.type==2){
      //    return '配送员'
      //  }
     return row.type==1?"商户":"配送员";
    
  },
  statusFormat: function(row,column){
  
    var status=''
    switch(row.status){
      case 1:
        status='已完成';
        break;
      case 2:
        status='审核中';
        break;
      case 3:
        status='等待打款';
        break;
      case 4:
        status='失败';
        break;
      case 5:
        status='成功';
        break;
      default:
    }
    return status;


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