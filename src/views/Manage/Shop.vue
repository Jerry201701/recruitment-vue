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
            perms="manage:shop:view"
            type="primary"
            @click="findPage(null)"
          />
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-plus"
            :label="$t('action.add')"
            perms="manage:shop:add"
            type="primary"
            @click="handleAdd"
          />
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-check"
            label="添加商品"
             perms="manage:shop:edit"
            type="primary"
              @click="addGoods"
          />
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-check"
            :label="$t('action.check')"
            perms="manage:shop:view"
            type="primary"
             @click="findUnCheck"
          />
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格内容栏-->
    <kt-table
      :height="350"
      permsEdit="manage:shop:edit"
      permsDelete="manage:shop:delete"
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
        <el-form-item label="门店名称" prop="shopName">
          <el-input v-model="dataForm.shopName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="门店地址" prop="address">
          <el-input v-model="dataForm.address" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="门店电话" prop="phone">
          <el-input v-model="dataForm.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="服务范围" prop="deliveryRange">
          <el-input v-model="dataForm.deliveryRange" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="起送价" prop="basePrice">
          <el-input v-model="dataForm.basePrice" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="加价费" prop="extraPrice">
          <el-input v-model="dataForm.extraPrice" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="配送区域描述" prop="deliveryRegionDesc">
          <el-input v-model="dataForm.deliveryRegionDesc" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="店铺描述" prop="shopDesc">
          <el-input v-model="dataForm.shopDesc" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="库存功能开关" prop="inventory">
          <el-radio-group v-model="dataForm.inventory">
            <el-radio :label="0">开启</el-radio>
            <el-radio :label="1">关闭</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="库存显示" prop="displayInventory">
          <el-radio-group v-model="dataForm.displayInventory">
            <el-radio :label="0">开启</el-radio>
            <el-radio :label="1">关闭</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="每日库存恢复" prop="dailyInventory">
          <el-radio-group v-model="dataForm.dailyInventory">
            <el-radio :label="0">开启</el-radio>
            <el-radio :label="1">关闭</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="营业开始时间" prop="openTime">
          <el-time-select
            v-model="dataForm.openTime"
            :picker-options="{
    		start: '05:30',
    		step: '00:15',
    		end: '23:30'
  				}"
            placeholder="选择时间"
			
			
			
          ></el-time-select>
        
        </el-form-item>

        <el-form-item label="营业结束时间" prop="closeTime">
          <el-time-select
            v-model="dataForm.closeTime"
            :picker-options="{
    		start: '05:30',
    		step: '00:15',
    		end: '23:30'
  				}"
            placeholder="选择时间"
			
			
			
          ></el-time-select>
        </el-form-item>

        <el-form-item label="进店是否验证" prop="verified">
          <el-radio-group v-model="dataForm.verified">
            <el-radio :label="0">开启</el-radio>
            <el-radio :label="1">关闭</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="是否打烊" prop="closed">
          <el-radio-group v-model="dataForm.closed">
            <el-radio :label="0">开启</el-radio>
            <el-radio :label="1">关闭</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="是否在商户显示" prop="display">
          <el-radio-group v-model="dataForm.display">
            <el-radio :label="0">开启</el-radio>
            <el-radio :label="1">关闭</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="是否自动接单" prop="autoReceipt">
          <el-radio-group v-model="dataForm.autoReceipt">
            <el-radio :label="0">开启</el-radio>
            <el-radio :label="1">关闭</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="上传店铺封面图片" label-width="200px">
          <el-upload
            action
            name="multipartfiles"
            :headers="myHeaders"
            multiple
            :on-success="uploadSuccess"
            :before-upload="onBeforeUpload"
            :limit="5"
          >
            <el-button size="small" type="primary">点击上传图片</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item  label="审核" label-width="200px">
           <el-radio  v-model="dataForm.pass" label=true>审核通过</el-radio>
           <el-radio  v-model="dataForm.pass" label=false>审核未通过</el-radio>
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
        { prop: "shopName", label: "门店名称", minWidth: 80 },
        { prop: "address", label: "地址", minWidth: 80 },
        { prop: "phone", label: "联系方式", minWidth: 80 },
        { prop: "deliveryRange", label: "服务范围", minWidth: 80 },
        { prop: "basePrice", label: "起送价", minWidth: 80 },
        { prop: "extraPrice", label: "加价费", minWidth: 80 },
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
        shopName: "",
        address: "",
        phone: "",
        deliveryRange: 0,
        basePrice: 0,
        extraPrice: 0,
        deliveryRegionDesc: "",
        shopDesc: "",
        inventory: false,
        displayInventory: false,
        dailyInventory: false,
        openTime: false,
        closeTime: false,
        verified: false,
        pictureInfos: [],
        closed: false,
        display: false,
        autoReceipt: false,
        companyId: false,
        regionId: false,
        categoryId: false,
        pictures: [],
        pass:false


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
      radio2: 3,
    pictures: [],
    pass:false

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
      console.log(tableTreeDdata);
      let parent = {
        // parentId: 0,
        //  name: '顶级菜单',
        id: 0,
        categoryName: "请点击选择",
        children: tableTreeDdata
      };
      return [parent];
    },

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
            Key: "manage/shop" + file.name,
            Body: file
          },
          function(err, data) {
            //console.log(err || data);
            if (data) {
             // console.log(data.Location);
              that.pictures.push({
                pictureUrl: "https://" + data.Location,
                pictureType: 1
              });
            }
          }
        );
        console.log(that.pictures);
      });
    },

    uploadSuccess: function(e) {},
    findUnCheck:function(){
        console.log('显示未审核门店');
      
      this.pageRequest.columnFilters = {
        label: { name: "shopStatus", value: 3 }
      };
      this.$api.shop.findPage(this.pageRequest).then(res => {
       // console.log(res)
          this.pageResult = res.data;
        })
       // .then(data != null ? data.callback : "");
    },

    // 获取分页数据
    findPage: function(data) {
        this.$api.user.findRegionByUser({'userId':sessionStorage.getItem('userId')}).then((res) => {
        this.$api.shop.findPage({
                  regionId:res.data,
                  pageNum:1,
                  pageSize:5
        }).then(res => {
          this.pageResult= res.data;
        }).then(data != null ? data.callback : "");
        this.regionId=res.data
        
        })
    //    console.log(this.regionId)
    //     
    
     
      // if (data !== null) {
      //   this.pageRequest = data.pageRequest;
      // }
      // this.pageRequest.columnFilters = {
      //   label: { name: "shopName", value: this.filters.label }
      // };
   
      // this.$api.shop
      //   .findPage(this.pageRequest)
      //   .then(res => {
      //     this.pageResult = res.data;
      //   })
      //   .then(data != null ? data.callback : "");

    },
    // 批量删除
    handleDelete: function(data) {
      this.$api.shop
        .batchDelete(data.params)
        .then(data != null ? data.callback : "");
    },
    // 显示新增界面
    handleAdd: function() {
      this.editDialogVisible = true;
      this.operation = true;
      this.dataForm = {
        id: 0,
        shopName: "",
        address: "",
        phone: "",
        deliveryRange: 0,
        basePrice: 0,
        extraPrice: 0,
        deliveryRegionDesc: "",
        shopDesc: "",
        inventory: false,
        displayInventory: false,
        dailyInventory: false,
        openTime: '',
        closeTime: '',
        verified: false,
        closed: false,
        display: false,
        autoReceipt: false,
        companyId: 0,
        regionId: this.regionId,
        categoryId: 0,
        pictures: [],
        regionId:this.regionId
      };
    },

    // 显示编辑界面
    handleEdit: function(params) {
      this.editDialogVisible = true;
      this.operation = false;
      this.dataForm = Object.assign({}, params.row);
    //  this.dataForm.pass=false;
    },
    // 机构树选中
    handleTreeSelectChange(data, node) {
      this.dataForm.categoryId = data.id;
      this.dataForm.categoryName = data.categoryName;
      this.selectCategory = data.categoryName;
    },
    // 编辑
    submitForm: function() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
			this.dataForm.pictures = this.pictures;
            let params = Object.assign({}, this.dataForm);
            this.$api.shop.save(params).then(res => {
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

  addGoods: function(){
      console.log('添加商品')
       this.$router.push({  //核心语句
        path:'/Manage/Good',   //跳转的路径
        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
          id:378899, 
        }
      })
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