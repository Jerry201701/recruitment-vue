<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.label" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item>
           <el-button size="small" type="primary" icon="fa fa-search"  @click="search">
            查询
          </el-button>
        </el-form-item>
       
        <el-form-item>
          <el-button size="small" type="primary" icon="fa fa-check"  @click="findUnCheck">
            未审核
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格内容栏-->
    <el-table
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      fixed
      prop="id"
      label="ID"
      width="80">
    </el-table-column>
    <el-table-column
      prop="fullName"
      label="全称"
      width="80">
    </el-table-column>
    <el-table-column
      prop="shortName"
      label="简称"
      width="80">
    </el-table-column>
    <el-table-column
      prop="brand"
      label="品牌"
      width="80">
    </el-table-column>
    <el-table-column
      prop="scale"
      label="规模"
      width="80"
      :formatter="staffFormat">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址"
      width="300">
    </el-table-column>
    <el-table-column
      prop="createTime"
      label="创建时间"
      width="200"
      :formatter="dateFormat">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="100">
      <template slot-scope="scope">
        <el-button  type="primary" @click="handleClick(scope.row)"  size="small">审核</el-button>
        <!-- <el-button type="text" size="small">编辑</el-button> -->
      </template>
    </el-table-column>
  </el-table>
  <!--分页栏-->
    <div class="toolbar" style="padding:10px;">
      <el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshPageRequest" 
        :current-page="pageRequest.pageNum" :page-size="pageRequest.pageSize" :total="data.totalSize" style="float:right;">
      </el-pagination>
    </div>
   

    <!--新增编辑界面 -->
     <el-dialog
      title='审核'
      width="40%"
      :visible.sync="editDialogVisible"
      :close-on-click-modal="false"
    >

     <el-form
        :model="dataForm"
        label-width="120px"
        label-position="left"
        ref="dataForm"
        :size="size"
      >
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="全称" prop="fullName">
          <el-input v-model="dataForm.fullName" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="简称" prop="shortName">
          <el-input v-model="dataForm.shortName" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="品牌" prop="brand">
          <el-input v-model="dataForm.brand" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="dataForm.address" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item  label="审核" label-width="200px">
           <el-radio  v-model="dataForm.flag" label=3>审核通过</el-radio>
           <el-radio  v-model="dataForm.flag" label=2>审核未通过</el-radio>
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
      loading:false,
      myHeaders: { token: Cookies.get("token") },
      limitNum: 1,
      formLabelWidth: "80px",
      form: {
        file: ""
      },
      fileList: [],
      size: "small",
      filters: {
        label: ""
      },
      columns: [
        { prop: "id", label: "ID", minWidth: 50 },
        { prop: "fullName", label: "全称", minWidth: 80 },
        { prop: "shortName", label: "简称", minWidth: 80 },
        { prop: "brand", label: "品牌", minWidth: 80 },
        { prop: "address", label: "地址", minWidth: 80 },
        { prop: "description", label: "描述", minWidth: 80 },
        {
          prop: "createTime",
          label: "创建时间",
          minWidth: 100,
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
      tableData:[],
      dataForm:{},
       // 分页信息
	  pageRequest: {
		pageNum: 1,
        pageSize: 10
      },
       data: Object
    };
  },

  methods: {
    // 分页查询
    findPage: function () {
        this.loading = true
        let callback = res => {
          this.loading = false
        }
     // this.$emit('findPage', {pageRequest:this.pageRequest, callback:callback})
      this.$api.job.findCompanyPage(this.pageRequest).then(res=>{
            this.tableData=res.data.content
      })
    },
     // 换页刷新
	refreshPageRequest: function (pageNum) {
      this.pageRequest.pageNum = pageNum
      this.findPage()
    },
 
  findUnCheck:function(){
        console.log('显示未审核门店');
      this.pageRequest.columnFilters = {label: {name:'status', value:1}}
      this.$api.job.findCompanyPage(this.pageRequest).then(res => {
        console.log(res.data)
          this.tableData = res.data.content;
        })
      
    },

   
  handleClick(row) {
        console.log(row);
        this.editDialogVisible=true
         this.dataForm = Object.assign({}, row);
      //   this.dataForm = Object.assign({}, params.row);
      },

  search(){



      },
   
 
  submitForm: function() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
           // let params = Object.assign({}, this.dataForm);
          //  console.log(params)
            this.$api.job.checkCompany({
              id:this.dataForm.id,
              flag:this.dataForm.flag
            }).then(res => {
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
    },
    staffFormat:function(row, column, cellValue, index){
        return row.minStaff+'-'+row.maxStaff
    }
  },

  mounted() {
    this.refreshPageRequest(1)
  }
};
</script>

<style scoped>
</style>