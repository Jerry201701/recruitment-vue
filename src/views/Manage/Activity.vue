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
            perms="manage:advertisement:view"
            type="primary"
            @click="findPage(null)"
          />
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-plus"
            label="新增秒杀活动"
            perms="manage:activity:add"
            type="primary"
            @click="handleAdd"
          />
        </el-form-item>
        <el-form-item>
            <kt-button
             icon="fa fa-plus"
            label="新增团购活动"
            perms="manage:activity:add"
            type="primary"
            @click="addGroup"
            />
        </el-form-item>
        <el-form-item>
            <kt-button
             icon="fa fa-plus"
            label="新增砍价活动"
            perms="manage:activity:add"
            type="primary"
            @click="addBargain"
            />
        </el-form-item>

      </el-form>
    </div>
    <!-- 表格内容栏-->
    <kt-table
      :height="350"
      permsEdit="manage:activity:edit"
      permsDelete="manage:activity:delete"
      :data="pageResult"
      :columns="columns"
      @findPage="findPage"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
    ></kt-table>
    <!--秒杀新增编辑界面 -->
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
        <el-form-item label="活动名称" prop="activityName">
          <el-input v-model="dataForm.activityName" auto-complete="off"></el-input>
        </el-form-item>
    
        <el-form-item label="门店名称" prop="shopName">
          <el-select v-model="dataForm.shopId" clearable @change="getGood(dataForm.shopId)" placeholder="请选择门店" style="float:left;">
					<el-option
					v-for="(item,index) in shops"
					:key="index"
					:label="item.key"
					:value="item.value">
					</el-option>
					</el-select>
        </el-form-item> 
        
        <el-form-item label="商品名称" prop="regionName">
          <el-select v-model="dataForm.goodId" clearable  placeholder="请选择商品" style="float:left;">
					<el-option
					v-for="(item,index) in goods"
					:key="index"
					:label="item.key"
					:value="item.value">
					</el-option>
					</el-select>
        </el-form-item> 


        <el-form-item label="开始时间" prop="beginTime">
        <el-date-picker
        v-model="dataForm.beginTime"
       type="datetime"
       placeholder="选择活动开始时间">
       </el-date-picker>
        </el-form-item>

        <el-form-item label="结束时间" prop="endTime">
        <el-date-picker
        v-model="dataForm.endTime"
       type="datetime"
       placeholder="选择活动结束时间">
       </el-date-picker>
        </el-form-item>

        <el-form-item label="活动价格" prop="activityPrice">
          <el-input-number v-model="dataForm.activityPrice" :precision="2" :step="0.1" :max="10" auto-complete="off"></el-input-number>
        </el-form-item>

        <el-form-item label="状态" prop="activityStatus">
           <el-select v-model="dataForm.activityStatus" placeholder="请选择类型" style="float:left;">
					<el-option
					v-for="item in status"
					:key="item.key"
					:label="item.key"
					:value="item.value">
					</el-option>
					</el-select>
        </el-form-item>

        <el-form-item label="库存" prop="stock">
            <el-input-number v-model="dataForm.stock"  :min="1" :max="1000" :step="10" auto-complete="off"></el-input-number>
        </el-form-item>

        <el-form-item label="限购数量" prop="restriction">
          <el-input-number v-model="dataForm.restriction"  :min="1" :max="10" auto-complete="off"></el-input-number>
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



    <!--团购新增编辑界面 -->
    <el-dialog
      :title="operation?'新增':'编辑'"
      width="40%"
      :visible.sync="groupDialogVisible"
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
        <el-form-item label="活动名称" prop="activityName">
          <el-input v-model="dataForm.activityName" auto-complete="off"></el-input>
        </el-form-item>

        
        <el-form-item label="门店名称" prop="shopName">
          <el-select v-model="dataForm.shopId" clearable @change="getGood(dataForm.shopId)" placeholder="请选择门店" style="float:left;">
					<el-option
					v-for="(item,index) in shops"
					:key="index"
					:label="item.key"
					:value="item.value">
					</el-option>
					</el-select>
        </el-form-item> 
        
        <el-form-item label="商品名称" prop="regionName">
          <el-select v-model="dataForm.goodId" clearable  placeholder="请选择商品" style="float:left;">
					<el-option
					v-for="(item,index) in goods"
					:key="index"
					:label="item.key"
					:value="item.value">
					</el-option>
					</el-select>
        </el-form-item> 

        <el-form-item label="开始时间" prop="beginTime">
        <el-date-picker
        v-model="dataForm.beginTime"
       type="datetime"
       placeholder="选择活动开始时间">
       </el-date-picker>
        </el-form-item>

        <el-form-item label="结束时间" prop="endTime">
        <el-date-picker
        v-model="dataForm.endTime"
       type="datetime"
       placeholder="选择活动结束时间">
       </el-date-picker>
        </el-form-item>
        <el-form-item label="起团人数" prop="minPeople">
           <el-input-number v-model="dataForm.minPeople"  :min="1" :max="100" auto-complete="off"></el-input-number>
        </el-form-item>
        <el-form-item label="团长价(分)" prop="leaderPrice">
           <el-input-number v-model="dataForm.leaderPrice"  :min="0" :max="1000" :step="10" auto-complete="off"></el-input-number>
        </el-form-item>
        <el-form-item label="团员价(分)" prop="memberPrice">
          <el-input-number v-model="dataForm.memberPrice"  :min="0" :max="1000" :step="10" auto-complete="off"></el-input-number>
        </el-form-item>
        <el-form-item label="拼团有效期" prop="groupValidityTime">
           <el-input-number v-model="dataForm.groupValidityTime"  :min="1" :max="1000" :step="10" auto-complete="off"></el-input-number>
        </el-form-item>
       
        <el-form-item label="库存" prop="stock">
           <el-input-number v-model="dataForm.stock"  :min="0" :max="1000" :step="10" auto-complete="off"></el-input-number>
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





    <!--砍价新增编辑界面 -->
    <el-dialog
      :title="operation?'新增':'编辑'"
      width="40%"
      :visible.sync="bargainDialogVisible"
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
        <el-form-item label="活动名称" prop="activityName">
          <el-input v-model="dataForm.activityName" auto-complete="off"></el-input>
        </el-form-item>

        
        <el-form-item label="门店名称" prop="shopName">
          <el-select v-model="dataForm.shopId" clearable @change="getGood(dataForm.shopId)" placeholder="请选择门店" style="float:left;">
					<el-option
					v-for="(item,index) in shops"
					:key="index"
					:label="item.key"
					:value="item.value">
					</el-option>
					</el-select>
        </el-form-item> 
        
        <el-form-item label="商品名称" prop="regionName">
          <el-select v-model="dataForm.goodId" clearable  placeholder="请选择商品" style="float:left;">
					<el-option
					v-for="(item,index) in goods"
					:key="index"
					:label="item.key"
					:value="item.value">
					</el-option>
					</el-select>
        </el-form-item> 
   
        <el-form-item label="开始时间" prop="beginTime">
        <el-date-picker
        v-model="dataForm.beginTime"
       type="datetime"
       placeholder="选择活动开始时间">
       </el-date-picker>
        </el-form-item>

        <el-form-item label="结束时间" prop="endTime">
        <el-date-picker
        v-model="dataForm.endTime"
       type="datetime"
       placeholder="选择活动结束时间">
       </el-date-picker>
        </el-form-item>

        <!-- <el-form-item label="每次最多砍价金额最大值(分)" prop="maxBargainPerTime">
          <el-input-number v-model="dataForm.maxBargainPerTime" :precision="2" :step="0.1" :max="10" auto-complete="off"></el-input-number>
        </el-form-item> -->
        <el-form-item label="每次最多砍价金额最大值(分)" prop="maxBargainPerTime">
          <el-input-number v-model="dataForm.maxBargainPerTime" :min="0" :step="10" :max="1000000" auto-complete="off"></el-input-number>
        </el-form-item>
        <el-form-item label="每次最少砍价金额最大值(分)" prop="minBargainPerTime">
          <el-input-number v-model="dataForm.minBargainPerTime" :min="0" :step="10" :max="1000000" auto-complete="off"></el-input-number>
        </el-form-item>

         <el-form-item label="砍价最多次数" prop="bargainTimeLimit">
            <el-input-number v-model="dataForm.bargainTimeLimit"  :min="1" :max="1000" :step="10" auto-complete="off"></el-input-number>
        </el-form-item>

        <!-- <el-form-item label="最小付款价(分)" prop="minBargainPayment">
           <el-input-number v-model="dataForm.minBargainPayment" :precision="2" :step="0.1" :max="10" auto-complete="off"></el-input-number>
        </el-form-item> -->
        <el-form-item label="最小付款价(分)" prop="minBargainPayment">
           <el-input-number v-model="dataForm.minBargainPayment" :min="0" :step="10" :max="1000000" auto-complete="off"></el-input-number>
        </el-form-item>
        <el-form-item label="砍价有效期" prop="bargainValidity">
            <el-input-number v-model="dataForm.bargainValidity"  :min="1" :max="1000" :step="10" auto-complete="off"></el-input-number>
        </el-form-item>
        <el-form-item label="是否允许自己砍价" prop="bargainSelf">
          <el-radio  v-model="dataForm.bargainSelf" label=true>允许</el-radio>
           <el-radio  v-model="dataForm.bargainSelf" label=false>不允许</el-radio>
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
        { prop: "activityName", label: "活动名称", minWidth: 80 },
        { prop: "companyName", label: "商户名称", minWidth: 80 },
        { prop: "shopName", label: "门店名称", minWidth: 80 },
        { prop: "goodName", label: "商品名称", minWidth: 80 },
        { prop: "remark", label: "备注", minWidth: 80 },
        {
          prop: "createTime",
          label: "创建时间",
          minWidth: 100,
          formatter: this.dateFormat
        }
      ],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},
      operation: false, // true:新增, false:编辑
      editDialogVisible: false, // 新增编辑界面是否显示
      groupDialogVisible:false,
      bargainDialogVisible:false,
      editLoading: false,
      dataFormRules: {
        goodName: [{ required: true, message: "请输入名称", trigger: "blur" }],
        goodDesc: [{ required: true, message: "请输入描述", trigger: "blur" }],
        minPrice: [{ required: true, message: "请输入价格", trigger: "blur" }]
      },
      // 新增编辑界面数据
      dataForm:{},
      // dataForm: {
      //   id: 0,
      //   activityName: "",
      //   beginTime: "",
      //   endTime: "",
      //   regionId: 0,
      //   goodId:0,
      //   companyId:0,
      //   shopId:0,
      //   goodId:0,
      //   type:0,
      //   remark:'',
      //   restriction:1,
      //   activityPrice:1.00,
      //   activityStatus:1,
      //   store:1,
      //   minPeople:0,
      //   memberPrice:0,
      //   leaderPrice:0,
      //   groupValidityTime:'',
      //   maxBargainPerTime:'',
      //   maxBargainPerPeople:0,
      //   minBargainPayment:0,
      //   bargainValidity:0,
      //   bargainSelf:false
      // },

      regionId:0,
      regions:[],
      types:[{key:"秒杀",value:1},{key:"团购",value:2},{key:"特价",value:3},{key:"砍价",value:4}],
      status:[{key:"是",value:1},{key:"否",value:2},{key:"进行中",value:3}],
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        value1: '',
        value2: '',
        value3: '',
        beginTime:'',
        endTime:'',
        shops:[],
        goods:[],
        restriction:1

    };
  },

  methods: {
      getShops:function(){
          this.shops=[]
          this.$api.activity.findShop(this.regionId).then(res =>{
              res.data.forEach(element =>{
            this.shops.push({
            value:element.shopId,
            key:element.shopName
          })
        }) })
      },
      handleChange(value) {
       
      },
     
    getGood:function(v){
      this.goods=[]
      this.$api.activity.findGood(v).then(res =>{
        res.data.forEach(element =>{
          this.goods.push({
            value:element.goodId,
            key:element.goodName
          })
        })
      })
    },



    findRegion:function(){
      // this.$api.dept.findDeptTree().then((res) => {
			// 	this.deptData = res.data
      // })
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
      this.$api.activity.findPage(this.pageRequest).then(res => {
          this.pageResult = res.data;
        })
        .then(data != null ? data.callback : "");
      });
       
     
    },
    // 批量删除
    handleDelete: function(data) {
      this.$api.activity.batchDelete(data.params).then(data != null ? data.callback : "");
    },
    // 显示新增界面
    handleAdd: function() {
      this.getShops()
      this.editDialogVisible = true;
      this.operation = true;
      this.dataForm = {
        id: 0,
        activityName: "",
        beginTime: "",
        endTime: "",
        regionId: 0,
        goodId:0,
        companyId:0,
        shopId:0,
        goodId:0,
        type:1,
        remark:'',
        restriction:1,
        activityPrice:1.00,
        activityStatus:1,
        stock:10,
        regionId:this.regionId
      };
    },
    addGroup:function(){
       this.getShops()
         this.groupDialogVisible = true;
        this.operation = true;
         this.dataForm = {
        id: 0,
        activityName: "",
        beginTime: "",
        endTime: "",
        regionId: 0,
        goodId:0,
        companyId:0,
        shopId:0,
        goodId:0,
        type:2,
        remark:'',
        regionId:this.regionId,
        minPeople:0,
        memberPrice:0,
        leaderPrice:0,
        groupValidityTime:10,
        stock:0
       
      };
    },
    addBargain:function(){
      this.getShops()
         this.bargainDialogVisible = true;
        this.operation = true;
         this.dataForm = {
        id: 0,
        activityName: "",
        beginTime: "",
        endTime: "",
        regionId: 0,
        goodId:0,
        companyId:0,
        shopId:0,
        goodId:0,
        type:4,
        regionId:this.regionId,
        maxBargainPerTime:0,
        minBargainPayment:0,
        bargainValidity:10,
        bargainSelf:0,
        bargainTimeLimit:0
      };
    },

    // 显示编辑界面
    handleEdit: function(params) {
      console.log(params)
      if(params.row.type==1){
        this.editDialogVisible = true;
      }
      if(params.row.type==2){
        this.groupDialogVisible = true;
      }
      if(params.row.type==4){
        this.bargainDialogVisible = true;
      }
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
            this.$api.activity.save(params).then(res => {
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