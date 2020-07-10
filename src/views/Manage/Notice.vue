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
            perms="manage:notice:view"
            type="primary"
            @click="findPage(null)"
          />
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-plus"
            :label="$t('action.add')"
            perms="manage:notice:add"
            type="primary"
            @click="handleAdd"
          />
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格内容栏-->
    <kt-table
      :height="350"
      permsEdit="manage:notice:edit"
      permsDelete="manage:notice:delete"
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

          <!-- <el-form-item label="区域名称" prop="regionName">
          <el-select v-model="dataForm.regionId" placeholder="请选择区域" style="float:left;">
					<el-option
					v-for="item in regions"
					:key="item.key"
					:label="item.key"
					:value="item.value">
					</el-option>
					</el-select>
        </el-form-item>  -->


        <el-form-item label="告示题目" prop="noticeTitle">
          <el-input v-model="dataForm.noticeTitle" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="告示内容" prop="noticeContent">
          <el-input v-model="dataForm.noticeContent" auto-complete="off"></el-input>
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
        { prop: "noticeTitle", label: "告示题目", minWidth: 80 },
        { prop: "noticeContent", label: "告示内容", minWidth: 80 },
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
        noticeTitle: "",
        noticeContent: "",
       
     
      },
       regions:[],
       regionId:0
    
    };
  },

  methods: {
  

    // 获取分页数据
    findPage: function(data) {

       this.$api.user.findRegionByUser({'userId':sessionStorage.getItem('userId')}).then((res) => {
        this.regionId=res.data;
      if (data !== null) {
        this.pageRequest = data.pageRequest;
      }
      this.pageRequest.columnFilters = {
        label: { name: "regionId", value:  this.regionId }
      };
      this.$api.notice.findPage(this.pageRequest).then(res => {
          this.pageResult = res.data;
        })
        .then(data != null ? data.callback : "");
           });
    },
    // 批量删除
    handleDelete: function(data) {
      this.$api.notice.batchDelete(data.params).then(data != null ? data.callback : "");
    },
    // 显示新增界面
    handleAdd: function() {
      //  this.regions=[]
      // this.$api.region.showAllRegions().then(res=>{
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
        noticeTitle: "",
        noticeContent: "",
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
            this.$api.notice.save(params).then(res => {
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