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
      </el-form>
    </div>
    <!-- 表格内容栏-->
    <!-- <el-button @click="resetDateFilter">清除日期过滤器</el-button>
  <el-button @click="clearFilter">清除所有过滤器</el-button> -->
  <el-table
    ref="filterTable"
    :data="tableData"
    style="width: 100%">
    <!-- <el-table-column
      prop="date"
      label="日期"
      sortable
      width="180"
      column-key="date"
      :filters="[{text: '2016-05-01', value: '2016-05-01'}, {text: '2016-05-02', value: '2016-05-02'}, {text: '2016-05-03', value: '2016-05-03'}, {text: '2016-05-04', value: '2016-05-04'}]"
      :filter-method="filterHandler"
    >
    </el-table-column> -->
    <el-table-column
      prop="companyName"
      label="商户名称"
      width="100">
    </el-table-column>
    <el-table-column
      prop="shopName"
      label="门店名称"
      width="100">
    </el-table-column>
    <el-table-column
      prop="turnover"
      label="营业额"
      width="100">
    </el-table-column>
    <el-table-column
      prop="orderNumber"
      label="订单数"
      width="100">
    </el-table-column>
    <el-table-column
      prop="refund"
      label="退款金额"
      width="100">
    </el-table-column>
    <el-table-column
      prop="incomeNumber"
      label="订单收款笔数"
      width="150">
    </el-table-column>
    <el-table-column
      prop="successCount"
      label="成功单数"
      width="100">
    </el-table-column>
    <el-table-column
      prop="failCount"
      label="失败单数"
      width="100">
    </el-table-column>
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
  <el-pagination
    layout="prev, pager, next"
     @current-change="refreshPageRequest"
    :total="1000"
    style="float:right;">
  </el-pagination>
   </div>
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
        { prop: "companyName", label: "商户名称", minWidth: 50 },
        { prop: "shopName", label: "门店名称", minWidth: 80 },
        { prop: "turnover", label: "营业额", minWidth: 80 },
        { prop: "orderNumber", label: "订单数", minWidth: 80 },
        { prop: "refund", label: "退款金额", minWidth: 80 },
        { prop: "incomeNumber", label: "订单收款笔数", minWidth: 80 },
        { prop: "successCount", label: "成功单数", minWidth: 80 },
        { prop: "failCount", label: "失败单数", minWidth: 80 }
      ],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},
      operation: false, // true:新增, false:编辑
      editDialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
       regions:[],
       regionId:0,
       tableData:[]
    
    };
  },

  methods: {
  

    // 获取分页数据
    findPage: function() {

       this.$api.user.findRegionByUser({'userId':sessionStorage.getItem('userId')}).then((res) => {
     //   this.regionId=res.data;
        this.regionId=7;
         this.refreshPageRequest(1)
     
      // this.$api.shop.shopStatistics(this.pageRequest).then(res => {
      //   console.log(res)
        
      //   })
       })
       
    },
     refreshPageRequest:function(pageNum){
    const request={
            regionId:this.regionId,
            pageNum:pageNum,
            pageSize:10
          }
     this.$api.shop.shopStatistics(request).then(res => {
     
            this.tableData=res.data.list;
            
          // this.pageResult=res.data
          // this.pageResult)
       // console.log(this.tableData)
        });

  },

     resetDateFilter() {
        this.$refs.filterTable.clearFilter('date');
      },
      clearFilter() {
        this.$refs.filterTable.clearFilter();
      },
      formatter(row, column) {
        return row.address;
      },
      filterTag(value, row) {
        return row.tag === value;
      },
      filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
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