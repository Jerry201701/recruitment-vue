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
            perms="manage:settling:view"
            type="primary"
            @click="findPage(null)"
          />
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-plus"
            label="新增"
            perms="manage:settling:add"
            type="primary"
            @click="handleAdd"
          />
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-check"
            label="勾选门店"
            perms="manage:settling:edit"
            type="primary"
            @click="chooseShop"
          />
        </el-form-item>
       
      </el-form>
    </div>
    <!-- 表格内容栏-->
    <kt-table
      :height="350"
      permsEdit="manage:settling:edit"
      permsDelete="manage:settling:delete"
      :data="pageResult"
      :columns="columns"
      @findPage="findPage"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
      @handleCurrentChange="ruleSelectChange"
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
<!--         
         <el-form-item label="种类选择" prop="settlingWay">
          <el-radio  v-model="dataForm.settlingWay" label=true>按订单</el-radio>
           <el-radio  v-model="dataForm.settlingWay" label=false>按商品</el-radio>
        </el-form-item> -->

         <el-form-item label="方式选择" prop="calculationRule">
          <el-radio  v-model="dataForm.calculationRule" :label=true>固定金额</el-radio>
           <el-radio  v-model="dataForm.calculationRule" :label=false>比例</el-radio>
        </el-form-item>

        <!-- <el-form-item label="结算单位" prop="category">
          <el-popover ref="popover" placement="bottom" trigger="click">
            <el-tree
              :props="props"
              :load="loadNode"
              :node-key="props.value"
              :check-strictly="false"  
              lazy
              show-checkbox
              ref="tree"
              @check-change="handleCheckChange">
              </el-tree> 
    </el-popover>
    <el-input  v-popover:popover :readonly="true" placeholder="请选择结算单位" style="cursor:pointer;"></el-input>
        <el-tree
        :props="props"
        :load="loadNode"
        :node-key="props.value"
        :check-strictly="false"  
        lazy
        show-checkbox
        ref="tree"
        @check-change="handleCheckChange">
        </el-tree>
        </el-form-item> -->


        <el-form-item label="固定金额(分)" prop="fixedAmount" >
            <el-input-number v-model="dataForm.fixedAmount"  :min="0"  :step="1" :max="10000" auto-complete="off"></el-input-number>
        </el-form-item>

        <el-form-item label="比例(100%)" prop="settlingRate">
          <el-input-number v-model="dataForm.settlingRate"  :min="0"  :step="1" :max="100" auto-complete="off"></el-input-number>
        </el-form-item>

        <el-form-item label="封顶值(分)" prop="upperValue">
          <el-input-number v-model="dataForm.upperValue"  :min="0"  :step="1" :max="10000" auto-complete="off"></el-input-number>
        </el-form-item>

        <el-form-item label="最小值(分)" prop="bottomValue">
          <el-input-number v-model="dataForm.bottomValue"  :min="0"  :step="1" :max="10000" auto-complete="off"></el-input-number>
        </el-form-item>
        <el-form-item label="平台提成(%)" prop="percentage">
          <el-input-number v-model="dataForm.percentage"  :min="0"  :step="1" :max="100" auto-complete="off"></el-input-number>
        </el-form-item>
        <el-form-item label="手续费率(%)" prop="fee">
          <el-input-number v-model="dataForm.fee"  :min="0"  :step="1" :max="100" auto-complete="off"></el-input-number>
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

    <!--选择店铺弹框-->
<el-dialog title="店铺列表" :visible.sync="dialogTableVisible">
   <el-table
    ref="multipleTable"
    :data="shopData"
    tooltip-effect="dark"
    style="width: 100%"
    @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
    <!-- <el-table-column
      label="日期"
      width="120">
      <template slot-scope="scope">{{ scope.row.date }}</template>
    </el-table-column> -->
    <el-table-column
      prop="shopId"
      label="门店编号"
      show-overflow-tooltip>
    </el-table-column>
    <el-table-column
      prop="companyName"
      label="商户名称"
      show-overflow-tooltip>
    </el-table-column>
    <el-table-column
      prop="shopName"
      label="门店名称"
      width="120">
    </el-table-column>
  </el-table>
  <div class="block">
    <div class="toolbar" style="padding:10px;">
      <el-button type="primary" style="float:left;" size="mini" @click="submitSelection">批量选中</el-button>
  <el-pagination
    layout="prev, pager, next"
     @current-change="refreshPageRequest"
    :total="50"
    style="float:right;">
  </el-pagination>
    </div>
</div>
<div style="margin-top: 30px">
<el-tag
  v-for="tag in tags"
  :key="tag.name"
  closable
  @close="handleClose(tag)"
  :type="tag.type">
  {{tag.name}}
</el-tag>
</div>

  <!-- <div style="margin-top: 20px">
    <el-button @click="toggleSelection([tableData[1], tableData[2]])">切换第二、第三行的选中状态</el-button>
    <el-button @click="toggleSelection()">取消选择</el-button>
  </div> -->
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
        { prop: "fixedAmount", label: "固定值(分)", minWidth: 50 },
        { prop: "settlingRate", label: "比例(100%)", minWidth: 50 },
        { prop: "upperValue", label: "最大值(分)", minWidth: 50 },
        { prop: "bottomValue", label: "最小值(分)", minWidth: 50 },
        { prop: "fee", label: "手续费(100%)", minWidth: 50 },
        { prop: "percentage", label: "平台提成(100%)", minWidth: 50 },
        {
          prop: "createTime",
          label: "创建时间",
          minWidth: 60,
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
      dataForm:{
          category:1,
          type:1
      },
     

      regionId:0,
      regions:[],
     
    shops:[],
    goods:[],
    restriction:1,
    value: [],
    companys:[],
    options: [],
     popupTreeProps: {
        label: 'name',
				children: 'children'
        },
        count: 1,
        chooes:[],
        props: {
          value: 'id',
          label: 'name',
          children: 'children'
        },
        ruleId:0,
        dialogTableVisible:false,
        shopData:[],

       
        multipleSelection: [],
        tags:[]
       


   
    };
  },

  methods: {

        handleCheckChange(data, checked, indeterminate) {
          this.options=this.$refs.tree.getCheckedKeys()
         // console.log(this.options)
          //console.log(this.$refs.tree.getCheckedKeys())
         // this.options = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())
      },
      handleNodeClick(data) {
          console.log('1111')
        console.log(data);
      },
      loadNode(node, resolve) {
          
        if (node.level === 0) {
          this.companys=[]
          this.$api.settling.findCompanys(this.regionId).then(res=>{
          this.companys=res.data
          return resolve(this.companys);
     })
  
        }
        if(node.level===1){
        this.shops=[]
          this.$api.settling.findShops(node.data.id).then(res =>{
            this.shops=res.data
            resolve(this.shops)
        })
       // return resolve(data)
        }
        if(node.level===2){
            this.goods=[]
            this.$api.settling.findGoods(node.data.id).then(res=>{
                this.goods=res.data
       resolve(this.goods)
            })
        }
        if (node.level > 2) return resolve([]);
        resolve(this.shops)
      //   setTimeout(() => {   //等组件生成再调用init;
      //   this.$api.settling.findCheck({'settlementId':6}).then(res=>{
      //     this.$refs.tree.setCheckedKeys(res.data)
      //   })
      // }, 200)
         
      },
     

    findRegion:function(){
      console.log('获取区域信息')
      this.$api.user.findRegionByUser({'userId':sessionStorage.getItem('userId')}).then((res) => {
        this.regionId=res.data
      })
    },

   

    // 获取分页数据
    findPage: function(data) {
        
      this.$api.user.findRegionByUser({'userId':sessionStorage.getItem('userId')}).then((res) => {
        this.regionId=res.data;
      if (data !== null) {
        this.pageRequest = data.pageRequest;
      }
      
      this.pageRequest.columnFilters = {
        label: { name: "regionId", value:  this.regionId}
      };
      this.$api.settling.findPage(this.pageRequest).then(res => {
          this.pageResult = res.data;
        })
        .then(data != null ? data.callback : "");
      });
       
     
    },
    // 批量删除
    handleDelete: function(data) {
      this.$api.settling.batchDelete(data.params).then(data != null ? data.callback : "");
    },
    // 显示新增界面
    handleAdd: function() {
      
      this.editDialogVisible = true;
      this.operation = true;
      this.dataForm = {
        id: 0,
        companyId:0,
        shopId:0,
        goodId:0,
        settlingWay:0,
        calculationRule:0,
        fixedAmount:0,
        settlingRate:0,
        upperValue:0,
        bottomValue:0,
        unitId:[],
        regionId:this.regionId,
        fee:0,
        percentage:0

      };
    },
   

    // 显示编辑界面
    handleEdit: function(params) {
      this.editDialogVisible = true;
      this.operation = false;
      this.dataForm = Object.assign({}, params.row);
      console.log(this.dataForm)
      //     setTimeout(() => {   
      //   this.$api.settling.findCheck({'settlementId':6}).then(res=>{
      //     this.$refs.tree.setCheckedKeys(res.data)
      //   })
      // }, 200)
     
    },
  
    // 编辑
    submitForm: function() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            this.dataForm.unitId=this.options;
            let params = Object.assign({}, this.dataForm);

            this.$api.settling.save(params).then(res => {
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
              this.groupDialogVisible = false;
              this.bargainDialogVisible = false;
              this.findPage(null);
            });
          });
        }
      });
    },
    ruleSelectChange:function(val){
     
      this.ruleId=val.val.id;
   

    },
    chooseShop: function(){
      this.dialogTableVisible=true
      if(this.ruleId==0){
        this.dialogTableVisible=false
         this.$message.error('没有选择规则，请选一条');
      }
    
      this.refreshPageRequest(1)
      this.tags=[]
       this.$api.settling.listStoreByRule({'ruleId':this.ruleId}).then(res => {
         res.data.forEach(element =>{
          this.tags.push({
            name: element.shopId+element.shopName,
            type: 'info',
            value:element.shopId
          })
         
        })
       })
    },

     toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      //  console.log(this.multipleSelection)
      },
      refreshPageRequest:function(pageNum){
          var shopRequest={
            regionId:this.regionId,
            pageNum:pageNum,
            pageSize:5
          }
           this.$api.settling.ruleShops(shopRequest).then(res => {
         
          this.shopData=res.data
        });

      },

      submitSelection:function(){

         this.multipleSelection.forEach(row => {
           row.ruleId=this.ruleId
          });
          
            this.$api.settling.addDeliveryRule(this.multipleSelection).then(res => {
              if (res.code == 200) {
                this.$message({ message: "操作成功", type: "success" });
                 this.tags=[]
          this.$api.settling.listStoreByRule({'ruleId':this.ruleId}).then(res => {
         res.data.forEach(element =>{
          this.tags.push({
            name: element.shopId+element.shopName,
            type: 'info',
            value:element.shopId
          })
         
        })
       })
              } else {
                this.$message({
                  message: "操作失败, " + res.msg,
                  type: "error"
                });
              }
            });
      },

      handleClose(tag) {
       
        this.tags.splice(this.tags.indexOf(tag), 1);
         this.$api.settling.addDeliveryRule([{
           ruleId:0,
           shopId:tag.value
         }]).then(res => {
              if (res.code == 200) {
                this.$message({ message: "操作成功", type: "success" });
              } else {
                this.$message({
                  message: "操作失败, " + res.msg,
                  type: "error"
                });
              }
            });

      //  console.log(this.multipleSelection)
      },

    // 时间格式化
    dateFormat: function(row, column, cellValue, index) {
      return format(row[column.property]);
    }
  },

  mounted() {
 //   this.findRegion()
  //this.findTreeData()
  }
};
</script>

<style scoped>
</style>