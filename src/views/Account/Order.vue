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
      </el-form>
    </div>
  <!-- <el-button @click="resetDateFilter">清除日期过滤器</el-button>
  <el-button @click="clearFilter">清除所有过滤器</el-button> -->
  <el-table
    ref="filterTable"
    :data="tableData"
     tooltip-effect="dark"
    style="width: 100%"
    @selection-change="handleSelectionChange">
     <el-table-column
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column
      prop="orderNumber"
      label="订单号"
      width="150">
    </el-table-column>
    
    <el-table-column
      prop="shopName"
      label="店铺名称"
      width="150">
    </el-table-column>

    <el-table-column
      prop="customerName"
      label="顾客姓名"
      width="100">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址"
      width="150">
    </el-table-column>
    <el-table-column
      prop="phone"
      label="联系方式"
      width="150">
    </el-table-column>

    <el-table-column
      prop="orderTime"
      label="下单时间"
      sortable
      width="150"
      column-key="date"
      :formatter="dateFormat"
    >
    </el-table-column>

    <el-table-column label="操作" width="100" fixed="right"  header-align="center" align="center">
      <template slot-scope="scope">
       <el-button size="mini" type="info" icon="fa fa-edit"   @click="showOrderDetail(scope.row)">详情</el-button>
       <!-- <el-button size="mini" type="danger" icon="fa fa-edit"   @click="handleDelete">删除</el-button> -->
        <!-- <template slot-scope="scope">
          <kt-button icon="fa fa-edit" :label="$t('action.edit')" :perms="permsEdit" :size="size" @click="handleEdit(scope.$index, scope.row)" />
          <kt-button icon="fa fa-trash" :label="$t('action.delete')" :perms="permsDelete" :size="size" type="danger" @click="handleDelete(scope.$index, scope.row)" />
        </template> -->
        </template>
      </el-table-column>
    
    <!-- <el-table-column
      prop="orderNumber"
      label="订单号"
      width="200">
    </el-table-column> -->
    <!-- <el-table-column
      prop="tag"
      label="标签"
      width="100"
      :filters="[{ text: '家', value: '家' }, { text: '公司', value: '公司' }]"
      :filter-method="filterTag"
      filter-placement="bottom-end">
      <template slot-scope="scope">
        <el-tag
          :type="scope.row.tag === '家' ? 'primary' : 'success'"
          disable-transitions>{{scope.row.tag}}</el-tag>
      </template>
    </el-table-column> -->
  </el-table>
   <div class="toolbar" style="padding:10px;">
      <el-button type="primary" style="float:left;" size="mini" @click="submitSelection">批量选中</el-button>
  <el-pagination
    layout="prev, pager, next"
     @current-change="refreshPageRequest"
    :total="1000"
    style="float:right;">
  </el-pagination>
   </div>

   <el-dialog title="订单详情" :visible.sync="dialogTableVisible">
  <el-form
        :model="dataForm"
        label-width="120px"
        label-position="left"
        :rules="dataFormRules"
        ref="dataForm"
        :size="size"
      >
        
  <el-form-item
    v-for="(domain, index) in dataForm.goods"
    :label="'商品' + index"
    :key="domain.key"
  >
    <el-input v-model="domain.goodName" ></el-input>
    <el-input v-model="domain.quantity" ></el-input>

  </el-form-item>
        <el-form-item label="下单次数" prop="id" v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="消费总额" prop="orderNumber">
          <el-input v-model="dataForm.orderNumber" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="下单时间" prop="amount">
          <el-input v-model="dataForm.orderTime" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="支付状态" prop="amount">
          <el-input v-model="dataForm.payStatus" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品总额" prop="amount">
          <el-input v-model="dataForm.amount" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="打包费" prop="amount">
          <el-input v-model="dataForm.packCharges" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="配送费" prop="amount">
          <el-input v-model="dataForm.deliveryFee" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
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
        { prop: "regionName", label: "区域名称", minWidth: 80 },
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
        regionName: "",
        remark: ""
      },
      tableData:[],
       dialogTableVisible: false
    };
  },

  methods: {
  
    // 获取分页数据
    findPage: function() {

         
         this.refreshPageRequest(1)

      // if (data !== null) {
      //   this.pageRequest = data.pageRequest;
      // }
      // this.pageRequest.columnFilters = {
      //   label: { name: "regionName", value: this.filters.label }
      // };
      // this.$api.order.pageOrders(this.pageRequest).then(res => {
      //     this.pageResult = res.data;
      //   })
      //   .then(data != null ? data.callback : "");


    },

    handleSelectionChange(val) {
       // this.multipleSelection = val;
        console.log(val)
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

    //显示订单详情
    showOrderDetail: function(row){
     this.$api.order.showOrderDetail({'id':row.id}).then(res=>{
       res.data.orderTime=format(res.data.orderTime)
        res.data.payStatus=res.data.payStatus==1?'未支付':'已支付'
       this.dialogTableVisible=true;
        this.dataForm=res.data

     })
    //  this.dataForm = Object.assign({}, row);
    //    console.log(this.dataForm)

    },

    // 显示编辑界面
    handleEdit: function(params) {
      this.editDialogVisible = true;
      this.operation = false;
      this.dataForm = Object.assign({}, params.row);
    },

   filterHandler(value, row, column) {
         const property = column['property'];
         return row[property] === value;
       // return format(row[column.property]);
      },

  submitSelection:function(){
   // console.log('多选')

  },
  refreshPageRequest:function(pageNum){
    var shopRequest={
            regionId:this.regionId,
            pageNum:pageNum,
            pageSize:10
          }
     this.$api.order.pageOrders(shopRequest).then(res => {
     
            this.tableData=res.data.list;
            
          // this.pageResult=res.data
          // this.pageResult)
       // console.log(this.tableData)
        });

  },
  
    // 编辑
    submitForm: function() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let params = Object.assign({}, this.dataForm);
            this.$api.region.save(params).then(res => {
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
    this.findPage()
    //this.findTreeData()
  }
};
</script>

<style scoped>
</style>