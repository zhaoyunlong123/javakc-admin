<template>
  <div id="app-container">
    <!-- 查询表单 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="dispOrdQuery.orderName" placeholder="指令名称" />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dispOrdQuery.beginDate"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="dispOrdQuery.endDate"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-button type="primary" @click="query()">查询</el-button>
      <el-button type="primary" @click="resetData()">重置</el-button>
      <el-button type="primary" @click="exportExcel">导出<i class="el-icon-download el-icon--right"></i></el-button>
      <el-button type="primary" @click="excelDialogVisible=true">导入<i class="el-icon-upload el-icon--right"></i></el-button>
    </el-form>
    <!-- 列表 -->
    <el-table :data="dispOrdList" border fit highlight-current-row @selection-change="handleSelectionChange"> // ## 边框 列的宽度是否自撑开 是否要高亮当前行 冒号单向绑定
      <el-table-column type="selection" width="55" />
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (pageNum - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="orderName" label="指令名称" width="80" />
      <el-table-column label="优先级">
        <template slot-scope="scope">
          {{
            scope.row.priority === 1 ? '一级' :
            scope.row.priority === 2 ? '二级' :
            scope.row.priority === 3 ? '三级' : '四级'
          }}
        </template>
      </el-table-column>
      <el-table-column label="专业类型">
        <template slot-scope="scope">
          {{
            scope.row.specType === 1 ? '生产调度指令' :
            scope.row.specType === 2 ? '安全调度指令' :
            scope.row.specType === 3 ? '开工调度指令' : '培训调度指令'
          }}
        </template>
      </el-table-column>
      <el-table-column prop="orderDesc" label="指令描述" />
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :page-size="pageSize"
      :current-page="pageNum"
      :total="total"
      :pager-count="11"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="query">
    </el-pagination>
    <!-- 操作按钮 -->
    <el-row>
      <el-col :span="2" :offset="8">
        <el-button type="primary" @click="toCreateDispOrd()">创建</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="toUpdateDispOrd()" :disabled="this.multipleSelection.length === 0 || this.multipleSelection.length > 1">修改</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="deleteDispOrd()" :disabled="this.multipleSelection.length === 0 || this.multipleSelection.length > 1">删除</el-button>
      </el-col>
    </el-row>
    <!-- 创建对话框 -->
    <el-dialog
      title="增加集团调度指令信息"
      :visible.sync="dialogVisible"
      width="50%"> <!-- dialogVisible : 指的是消息框是否是隐藏状态 -->
      <el-form label-width="130px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="优先级">
              <el-select v-model="dispOrd.priority" clearable placeholder="请选择">
                <el-option :value="1" label="一级"/>
                <el-option :value="2" label="二级"/>
                <el-option :value="3" label="三级"/>
                <el-option :value="4" label="四级"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专业类型">
              <el-select v-model="dispOrd.specType" clearable placeholder="请选择">
                <el-option :value="1" label="生产调度指令"/>
                <el-option :value="2" label="安全调度指令"/>
                <el-option :value="3" label="开工调度指令"/>
                <el-option :value="4" label="培训调度指令"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="指令名称">
              <el-input v-model="dispOrd.orderName"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="指令描述">
              <el-input v-model="dispOrd.orderDesc" :rows="10" type="textarea"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" :offset="5">
            <el-form-item>
              <el-button :disabled="saveBtnDisabled" type="primary" @click="saveDispOrd()">保存</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-button type="primary" @click="createDialogVisible">返回</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <!-- 导入窗口的对话框 -->
    <el-dialog title="导入Excel" :visible.sync="excelDialogVisible">
      <el-upload
        ref="upload"
        name="file"
        :action="this.BASE_API + '/pms/dispord/importExcel'"
        :on-success="handleSuccess"
        :on-error="handleError"
        :limit="1"
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button :disabled="importBtnDisabled" style="margin-left: 10px;" size="small" type="success" @click="importExcel">上传到服务器</el-button>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import dispord from '@/api/pms/dispord'

export default {
  data() {
    return{
      dispOrdQuery: {}, // 封装查询对象
      pageNum: 1, // 当前页
      pageSize: 5, // 每页最大条数
      dispOrdList: [], // 展示数据
      total: 0, // 总记录数
      multipleSelection: [],// 记录表格复选框选中的值（存放id信息）
      dialogVisible: false, // 消息框保持关闭状态
      saveBtnDisabled: false, // 不禁用按钮  未禁用状态
      dispOrd: { // 调度指令信息 属性可以不指定，在后台会自动根据名称对应，但最好还是添加上属性，这样一定不会报错
        id: '',
        orderName: '',
        priority: '',
        specType: '',
        orderDesc: ''
      },
      BASE_API: process.env.VUE_APP_BASE_API, // ## 接口API地址
      excelDialogVisible: false, // ## 导入Excel窗口, false为关闭
      importBtnDisabled: false // ## 按钮是否禁用,false为不禁用
    }
  },
  created() { // 在页面渲染前执行
    this.query()
  },
  methods: {
    query(pageNum = 1) { // 带条件的分页查询
      this.pageNum = pageNum
      dispord.findPageDispOrd(this.dispOrdQuery, this.pageNum, this.pageSize)
      .then(response => {
        // 列表展示数据
        this.dispOrdList = response.data.items
        // 总记录数赋值
        this.total = response.data.total
      })
    },
    handleSelectionChange(val) { // 复选框改变时触发该事件
      this.multipleSelection = val
    },
    resetData() { // 重置查询数据
      // 清空数据
      this.dispOrdQuery = {}
      // 重新查询
      this.query()
    },
    toCreateDispOrd() { // 创建触发的时间
      // 打开对话框
      this.dialogVisible = true
      // 清空数据
      this.dispOrd = {}
      // 打开禁用按钮
      this.saveBtnDisabled = false
    },
    saveDispOrd() { // 创建调度指令信息
      // 禁用保存按钮  禁用状态
      this.saveBtnDisabled = true
      // 调用API接口的新增方法
      dispord.save(this.dispOrd)
      .then(response => {
        // 消息提示
        this.$message({
          message: "创建成功！",
          type: "success"
        })
        // 关闭对话框
        this.dialogVisible = false
        // 重新查询数据
        this.query()
      })
    },
    createDialogVisible() { // 返回数据查询
      // 清空数据
      this.dispOrd = {}
      // 关闭信息框
      this.dialogVisible = false
      // 返回查询类列表
      this.query()
    },
    // 跳转到修改的页面
    toUpdateDispOrd() {
      // 首先获取所有选中行的id，用逗号隔开
      var ids = this.multipleSelection.map(item => item.id).join()
      // 跳转
      this.$router.push('/pms/dispord/update/' + ids)
    },
    // 删除调度指令库
    deleteDispOrd() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 获取所有选中行的id组成的字符串，以逗号分隔
        let ids = this.multipleSelection.map(item => item.id).join()
        console.log(ids)
        dispord.delete(ids)
          .then(response => {
            this.query()
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          })
      })
    },
    exportExcel() { // 导出Excel
      document.location.href = this.BASE_API + '/pms/dispord/exportExcel'
    },
    importExcel() { // 导入 Excel
      // 禁用按钮
      this.importBtnDisabled = true
      // 提交
      this.$refs.upload.submit()
    },
    handleSuccess() { // 导入成功后执行的方法
      // 关闭窗口
      this.excelDialogVisible = false
      // 消息提示
      this.$message({
        message: '导入成功！',
        type: 'success'
      })
      // 解除按钮禁用
      this.importBtnDisabled = false
      // 重新查询数据
      this.query()
    },
    handleError() { // 导入失败后执行的方法
      // 消息提示
      this.$message({
        message: '导入失败！',
        type: 'error'
      })
      // 解除按钮禁用
      this.importBtnDisabled = false
    }
  }

}
</script>

<style scoped>

</style>
