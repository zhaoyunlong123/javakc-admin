<template>
  <div id="app-container">
    <!-- 查询表单 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="dispOrdRlsQuery.orderNo" placeholder="调度指令编号" />
      </el-form-item>
      <el-button type="primary" @click="findPageDispOrdRls()">查询</el-button>
      <el-button type="primary" @click="resetData()">重置</el-button>
    </el-form>
    <!-- 列表 -->
    <el-table :data="dispOrdRlsList" border fit highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="调度指令编号">
        <template slot-scope="scope">
          <el-link type="primary" @click="toRelease(scope.row.id)">{{ scope.row.orderNo }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="orderName" label="指令名称" />
      <el-table-column label="指令优先级" width="100">
        <template slot-scope="scope">
          {{
          scope.row.priority === 1 ? '一级' :
          scope.row.priority === 2 ? '二级' :
          scope.row.priority === 3 ? '三级' : '四级'
          }}
        </template>
      </el-table-column>
      <el-table-column label="指令专业类型">
        <template slot-scope="scope">
          {{
          scope.row.specType === 1 ? '生产调度指令' :
          scope.row.specType === 2 ? '安全调度指令' :
          scope.row.specType === 3 ? '开工调度指令' : '培训调度指令'
          }}
        </template>
      </el-table-column>
      <el-table-column prop="transfer" label="指令下达人"  width="100" />
      <el-table-column prop="transmitter" label="指令传达人"  width="100" />
      <el-table-column prop="releaseTime" label="下达时间" />
      <el-table-column prop="isRelease" label="指令下达状态"  width="110">
        <template slot-scope="scope">
          {{ scope.row.isRelease === 1 ? '是' : '否' }}
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
      @current-change="findPageDispOrdRls">
    </el-pagination>
    <!-- 下达对话框 -->
    <el-dialog
      title="集团调度指令信息"
      :visible.sync="releaseDialogVisible"
      width="50%">
      <el-form label-width="130px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="调度指令编号">
              {{ dispOrdRls.orderNo }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="指令名称">
              {{ dispOrdRls.orderName }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="优先级">
              {{
              dispOrdRls.priority === 1 ? '一级' :
              dispOrdRls.priority === 2 ? '二级' :
              dispOrdRls.priority === 3 ? '三级' : '四级'
              }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专业类型">
              {{
              dispOrdRls.specType === 1 ? '生产调度指令' :
              dispOrdRls.specType === 2 ? '安全调度指令' :
              dispOrdRls.specType === 3 ? '开工调度指令' : '培训调度指令'
              }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="指令描述">
              {{ dispOrdRls.orderDesc }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" :offset="5">
            <el-form-item>
              <el-button :disabled="releaseBtnDisabled" type="primary" @click="updateRelease()">下达</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-button type="primary" @click="releaseDialogVisible = false">返回</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>

import dispordrls from '@/api/pms/dispordrls'

export default {
  data() {
    return {
      dispOrdRlsList: [], // ## 数据列表
      dispOrdRlsQuery: {}, // ## 查询条件封装对象
      total: 0, // ## 总记录数
      pageNum: 1, // ## 页码
      pageSize: 5, // ## 每页显示记录数
      multipleSelection: [], // ## 记录表格复选框选中的值
      releaseDialogVisible: false, // ## 关闭下达窗口
      releaseBtnDisabled: false, // ## 不禁用下达按钮
      dispOrdRls: {
        id: '' // id必须存在且稳定
      }
    }
  },
  created() {
    this.findPageDispOrdRls()
  },
  methods: {
    findPageDispOrdRls(pageNum = 1) {
      this.pageNum = pageNum
      dispordrls.findPageDispOrdRls(this.dispOrdRlsQuery, this.pageNum, this.pageSize)
        .then(response => {
          // 列表数据赋值
          this.dispOrdRlsList = response.data.items
          this.total = response.data.total
        })
    },
    resetData() { // ## 清空方法
      // ## 清空所有值
      this.dispOrdQuery = {}
      // ## 查询所有数据
      this.getPageDispOrdList()
    },
    handleSelectionChange(val) { // ## 复选框改变时触发该事件
      this.multipleSelection = val
    },
    toRelease(id) { // 打开下达对话框
      // 不禁用按钮
      this.releaseBtnDisabled = false
      // 打开下达对话框
      this.releaseDialogVisible = true
      // 回显数据
      dispordrls.view(id)
        .then(response => {
          this.dispOrdRls = response.data.dispOrdRls
        })
      //
    },
    updateRelease() { // 集团调度指令下达
      // 禁用按钮
      this.releaseBtnDisabled = true
      // 调用API
      dispordrls.updateRelease(this.dispOrdRls.id)
        .then(response => {
          // 消息提示
          this.$message({
            message: '下达成功',
            type: 'success'
          })
          // 关闭窗口
          this.releaseDialogVisible = false
          // 重新查询数据
          this.findPageDispOrdRls()
        })
    }
  }
}
</script>
