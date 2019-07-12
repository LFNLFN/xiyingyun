<template>
  <publicPopups :width="boxWidth" title-text="新增实测实量记录" v-on="$listeners" @closePopupsBox="closeBox">
    <template slot="main-content">
      <div v-show="curStep === 'checkInfo'">
        <el-form
          ref="addMeasureForm"
          :model="addMeasureFormData"
          :rules="addMeasureFormRules"
          :inline="true"
          label-width="110px"
          label-position="right"
          size="small"
          class="add-check-form">
          <el-form-item prop="projectId" label="项目名称">
            <el-select
              v-model="addMeasureFormData.projectId">
              <el-option
                v-for="(item, idx) in projectDetailDatas"
                :key="idx"
                :label="item.name"
                :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item prop="checkItemId" label="实测实量项">
            <el-select
              v-model="addMeasureFormData.checkItemId">
              <el-option
                v-for="item in measureItemDatas"
                :key="item.id"
                :label="item.name"
                :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item prop="partId" label="部位">
            <el-cascader
              v-model="addMeasureFormData.partId"
              :options="measBuildingDatas"
              :props="buildingProps"
              :disabled="measBuildingDatas.length === 0"
              size="small"
              placeholder="请选择部位"
              clearable
              @visible-change="getMeasBuildingFunc">
              <template slot="empty">
                <span />
              </template>
            </el-cascader>
          </el-form-item>
        </el-form>
      </div>
      <div v-loading="isLoading" v-show="curStep === 'fillInfo'">
        <el-form
          :inline="true"
          class="fill-info-form">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="实测实量项">
                <el-input v-model="checkedMeasureData.itemName" disabled size="small" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="部位">
                <el-input v-model="checkedMeasureData.partName" disabled size="small" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-table
          :data="measureTableData"
          class="fill-info-table no-border-gary-head">
          <el-table-column prop="index" width="50" label="序号" align="center" />
          <el-table-column prop="itemName" label="检查内容" align="center" />
          <el-table-column label="计算点数" align="center" >
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.measuredCount"
                :min="0"
                size="small" />
            </template>
          </el-table-column>
          <el-table-column label="计算爆点数" align="center" >
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.burstPoint"
                :min="0"
                size="small" />
            </template>
          </el-table-column>
          <el-table-column :formatter="tableRateFormatter" width="70" label="合格率" align="center"/>
        </el-table>
      </div>
    </template>
    <template v-if="curStep === 'checkInfo'">
      <template slot="footer-content">
        <el-button size="small" @click="closeBox">取消</el-button>
        <el-button type="primary" size="small" @click="toFillMeasureInfo">下一步</el-button>
      </template>
    </template>
    <template v-else-if="curStep === 'fillInfo'">
      <template slot="footer-content">
        <el-button size="small" @click="closeBox">取消</el-button>
        <el-button size="small" @click="toCheckMesureInfo">上一步</el-button>
        <el-button type="primary" size="small" @click="submitMeasureData">提交</el-button>
      </template>
    </template>
  </PublicPopups>
</template>
<script>
import PublicPopups from '@/components/Pop-ups/PublicPopups'
import { dateFormatter } from '@/utils/public'
import { getMeasBuilding, getMeasItemChild, getUserType, addMeasureDatas } from '@/api/quality/measure'
export default {
  components: { PublicPopups },
  data() {
    return {
      boxWidth: '550px',
      curStep: 'checkInfo', // 保存步骤，checkInfo：选项相关信息，fillInfo: 填写实测实量信息
      projectDetailDatas: [], // 保存项目数据
      measureItemDatas: [], // 保存所有实测实量项
      measBuildingDatas: [], // 保存实测实量项的楼栋数据
      buildingProps: {
        value: 'id',
        label: 'name',
        children: 'roomList',
        lazy: true,
        lazyLoad: this.buildingLazyLoad
      }, // 配置级联选择器
      addMeasureFormData: {
        projectId: '',
        checkItemId: '',
        partId: []
      },
      addMeasureFormRules: {
        projectId: [{ required: true, trigger: 'change', message: '请选择项目' }],
        checkItemId: [{ required: true, trigger: 'change', message: '请选择实测实量项' }],
        partId: [{ required: true, trigger: 'change', message: '请选择部位' }]
      },
      checkedMeasureData: {
        itemName: '',
        partName: ''
      }, // 保存已选择的实测实量项以及楼栋数据
      measureTableData: [], // 保存要添加的实测实量子项数据
      userType: null, // 保存用户类型
      isLoading: false
    }
  },
  watch: {
    'addMeasureFormData.checkItemId': function(newVal) {
      if (newVal !== '') {
        // 重置子项数据
        this.$set(this, 'measureTableData', [])
        // 重新加载房间数据
        this.$set(this, 'measBuildingDatas', [])
        this.getMeasBuildingFunc(true)
        // 保存已选择的实测实量项名称
        const curItem = this.measureItemDatas.find(item => {
          return newVal === item.id
        })
        if (curItem) {
          this.checkedMeasureData.itemName = curItem.name
        }
      }
    },
    'addMeasureFormData.partId': function(newVal) {
      if (newVal.length > 0) {
        let [building, floor, room, roomName] = ['', '', '', '']
        newVal.forEach((id, idx) => {
          if (idx === 0) {
            building = this.measBuildingDatas.find(item => {
              return item.id === id
            })
          } else if (idx === 1) {
            floor = building.roomList.find(item => {
              return item.id === id
            })
          } else if (idx === 2) {
            room = floor.children.find(item => {
              return item.id === id
            })
            roomName = `/${room.name}`
          }
        })
        this.checkedMeasureData.partName = `${building.name}/${floor.name}${roomName}`
      }
    }
  },
  methods: {
    resetDataProperty(obj) {
      const _keys = Object.keys(obj)
      _keys.forEach(key => {
        this.$set(this, key, obj[key])
      })
    },
    // 表格合格率数据处理
    tableRateFormatter(row, column, cellValue, index) {
      const count = row.measuredCount
      const burst = row.burstPoint
      let backData = 0
      if (count !== 0) {
        backData = `${Math.floor((count - burst) / count * 10000) / 100}%`
        row.passingRate = backData
      }
      return backData
    },
    // 加载楼栋数据
    getMeasBuildingFunc(visible) {
      if (!visible || this.measBuildingDatas.length > 0) return
      const projectId = this.addMeasureFormData.projectId
      const itemId = this.addMeasureFormData.checkItemId
      if (projectId === '' || itemId === '') {
        this.$message({
          type: 'warning',
          message: '请选择项目和实测实量项数据',
          duration: 3500,
          showClose: true
        })
        return
      }
      const message = this.$message({
        message: '楼栋数据加载中...',
        duration: 0
      })
      getMeasBuilding(projectId, itemId).then(resp => {
        this.$set(this, 'measBuildingDatas', resp.result)
        message.close()
      })
    },
    // 级联选择器楼栋数据懒加载处理
    buildingLazyLoad(node, reslove) {
      if (!node.data) return
      const data = node.data
      const curItem = this.measureItemDatas.find(item => {
        return item.id === this.addMeasureFormData.checkItemId
      })
      if (data.parentId && data.parentId === '-1') {
        data.children.forEach(child => {
          child['leaf'] = true
        })
        reslove(data.children)
      } else {
        /* 根据 checkType 区分按层还是按房间添加数据
          checkType：0 按层添加数据，不加载房间数据
          checkType：1 按房间添加数据 */
        data.roomList.forEach(child => {
          child['leaf'] = Boolean(!curItem.checkType)
        })
        reslove(data.roomList)
      }
    },
    // 显示添加实测实量项的详细数据界面
    toFillMeasureInfo() {
      this.$refs.addMeasureForm.validate(valid => {
        if (valid) {
          // 处理组件显示样式
          this.boxWidth = '750px'
          this.curStep = 'fillInfo'
          // 加载子项数据
          if (this.measureTableData.length === 0) {
            const message = this.$message({
              message: '实测实量项加载中...',
              duration: 0
            })
            const itemId = this.addMeasureFormData.checkItemId
            getMeasItemChild(itemId).then(resp => {
              const _data = resp.result
              _data.forEach((item, idx) => {
                this.measureTableData.push({
                  index: idx + 1,
                  itemName: item.name,
                  detailCheckItemId: item.id,
                  measuredCount: 0,
                  burstPoint: 0,
                  passingRate: 0
                })
              })
              message.close()
            })
          }
        }
      })
    },
    // 获取用户类型
    getUserTypeFunc() {
      return new Promise((resolve, reject) => {
        if (this.userType === null) {
          const projectId = this.addMeasureFormData.projectId
          getUserType(projectId).then(resp => {
            this.userType = resp.result[0]
            console.log('getUserType userType', this.userType)
            resolve(this.userType)
          }).catch(() => {
            reject()
          })
        } else {
          resolve(this.userType)
        }
      })
    },
    // 返回选择项目，实测实量项，部位界面
    toCheckMesureInfo() {
      this.boxWidth = '550px'
      this.curStep = 'checkInfo'
    },
    // 提交实测实量数据
    submitMeasureData() {
      // 获取用户类型
      this.isLoading = true
      this.getUserTypeFunc().then(resp => {
        console.log('addMeasureFormData', this.addMeasureFormData)
        console.log('measureTableData', this.measureTableData)
        const userType = resp
        const partIds = this.addMeasureFormData.partId
        const createDate = dateFormatter()
        // 组装要提交的实测实量数据
        const measureData = {
          projectId: this.addMeasureFormData.projectId,
          unitId: partIds[0],
          partId: partIds[partIds.length - 1],
          checkItemId: this.addMeasureFormData.checkItemId,
          createTime: createDate,
          type: userType,
          detailEntityList: []
        }
        // 组装子项数据
        this.measureTableData.forEach(item => {
          if (item.measuredCount > 0) {
            measureData.detailEntityList.push({
              detailCheckItemId: item.detailCheckItemId,
              measuredCount: item.measuredCount,
              burstPoint: item.burstPoint,
              passingRate: Number(item.passingRate.split('%')[0])
            })
          }
        })
        // 检测数据是否为空
        if (measureData.detailEntityList.length === 0) {
          this.$message({
            type: 'warning',
            message: '请填写实测实量数据...',
            duration: 3500,
            showClose: true
          })
          this.isLoading = false
          return
        }
        console.log('measureData', measureData)
        addMeasureDatas(measureData).then(resp => {
          this.isLoading = false
          this.$emit('refreshMeasure')
          this.closeBox()
          this.$message({
            type: 'success',
            message: '新增成功...'
          })
        }).catch(() => {
          this.isLoading = false
        })
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '获取用户类型失败，无法提交数据...'
        })
        this.isLoading = false
      })
    },
    // 关闭组件操作
    closeBox() {
      this.$emit('update:isAddMeasureShow', false)
      this.$refs['addMeasureForm'].resetFields()
      this.measBuildingDatas = []
      this.measureTableData = []
      this.boxWidth = '550px'
      this.curStep = 'checkInfo'
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';

.add-check-form {
  padding: 30px 20px 0 10px;
  &/deep/ .el-form-item {
    width: 100%;
    margin-top: 10px;
    .el-form-item__content {
      width: calc(100% - 130px);
    }
    .el-select, .el-cascader {
      width: 100%;
    }
  }
}
.fill-info-form {
  padding-top: 20px;
  &/deep/ .el-form-item {
    .el-select {
      width: 230px;
    }
  }
}
</style>
