<template>
  <!-- 新增项目分期页面 -->
  <footerBarContainer v-loading="stageLoading" @cancelHandle="cancelHandle" @confirmHandle="submitHandle">
    <template slot="main-content">
      <el-main class="stage-info-watp">
        <div class="header">
          <span>基础信息</span>
        </div>
        <el-form
          ref="stageForm"
          :model="stageFormData"
          :rules="stageFormRules"
          class="stage-Info-form">
          <el-form-item prop="name" label="项目名称">
            <el-input v-model="stageFormData.name" size="small" placeholder="请输入项目名称"/>
          </el-form-item>
          <el-form-item prop="code" label="项目编码">
            <el-input v-model="stageFormData.code" size="small" placeholder="请输入项目编码"/>
          </el-form-item>
          <el-form-item prop="address" label="项目地址">
            <el-input v-model="stageFormData.address" size="small" placeholder="请输入地址">
              <!-- <el-button slot="append">查询经纬度</el-button> -->
              <a slot="append" href="https://lbs.amap.com/console/show/picker" target="_blank">查询经纬度</a>
            </el-input>
          </el-form-item>
          <el-form-item prop="estateProjectDetailEntity.typeId" label="项目状态">
            <el-select
              v-model="stageFormData.estateProjectDetailEntity.typeId"
              :loading="selectLoading"
              size="small"
              clearable
              placeholder="请选择"
              @visible-change="(visiable) => getSelectData(visiable, 'projectStatus')">
              <el-option
                v-for="(item, idx) in projectStatus"
                :key="idx"
                :label="item.value"
                :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="所属公司">
            <el-input v-model="belongCompany" size="small" disabled/>
          </el-form-item>
          <el-form-item prop="estateProjectDetailEntity.cityId" label="所在城市">
            <div class="city-selects-wrap">
              <el-select
                v-model="provinceSelected"
                :loading="selectLoading"
                size="small"
                placeholder="省"
                @change="clearProvince"
              >
                <!-- @visible-change="(visiable) => getSelectData(visiable, 'provinceData')" -->
                <el-option
                  v-for="(item, idx) in provinceData"
                  :key="idx"
                  :label="item.value"
                  :value="item.id" />
              </el-select>
              <i class="city-selects-interval"/>
              <el-select
                v-model="citySelected"
                :loading="selectLoading"
                :disabled="!provinceSelected"
                size="small"
                @change="clearCity"
                placeholder="市">
                <!-- @visible-change="(visiable) => getSelectData(visiable, 'cityData')"> -->
                <el-option
                  v-for="(item, idx) in cityData"
                  :key="idx"
                  :label="item.value"
                  :value="item.id" />
              </el-select>
              <i class="city-selects-interval"/>
              <el-select
                v-model="stageFormData.estateProjectDetailEntity.cityId"
                :loading="selectLoading"
                :disabled="!citySelected"
                size="small"
                placeholder="区">
                <!-- @visible-change="(visiable) => getSelectData(visiable, 'districtData')"> -->
                <el-option
                  v-for="(item, idx) in districtData"
                  :key="idx"
                  :label="item.value"
                  :value="item.id" />
              </el-select>
            </div>
          </el-form-item>
          <el-form-item prop="status" label="状态">
            <el-select
              v-model="stageFormData.status"
              size="small"
              clearable
              placeholder="请选择">
              <el-option
                v-for="(item, idx) in enableStatus"
                :key="idx"
                :label="item.value"
                :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item prop="estateProjectDetailEntity.constructionArea" label="建筑面积">
            <el-input v-model="stageFormData.estateProjectDetailEntity.constructionArea" size="small" placeholder="请输入面积">
              <span slot="append" class="area-text">㎡</span>
            </el-input>
          </el-form-item>
          <el-form-item prop="estateProjectDetailEntity.deliveryType" label="交付类型">
            <el-select
              v-model="stageFormData.estateProjectDetailEntity.deliveryType"
              :loading="selectLoading"
              size="small"
              clearable
              placeholder="请选择"
              @visible-change="(visiable) => getSelectData(visiable, 'deliveryType')">
              <el-option
                v-for="(item, idx) in deliveryType"
                :key="idx"
                :label="item.value"
                :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item prop="estateProjectDetailEntity.constructionStage" label="施工阶段">
            <el-select
              v-model="stageFormData.estateProjectDetailEntity.constructionStage"
              :loading="selectLoading"
              size="small"
              clearable
              placeholder="请选择"
              @visible-change="(visiable) => getSelectData(visiable, 'constructionType')">
              <el-option
                v-for="(item, idx) in constructionType"
                :key="idx"
                :label="item.value"
                :value="item.id" />
            </el-select>
          </el-form-item>
          <el-row style="width: 100%">
            <el-form-item prop="estateProjectDetailEntity.aerialView" label="鸟瞰图上传(建议不超过50M)">
              <el-upload
                v-loading="isUploadAerialview"
                :http-request="uploadAerialview"
                :show-file-list="false"
                class="avatar-uploader"
                action="">
                <img v-if="stageFormData.estateProjectDetailEntity.aerialView" :src="GetOssImgFullPath(stageFormData.estateProjectDetailEntity.aerialView)" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </el-form-item>
          </el-row>
        </el-form>
      </el-main>
      <el-main class="house-type-wrap">
        <div class="header">
          <span>户型</span>
        </div>
        <div class="table-wrap">
          <el-table
            :data="houseTypeData"
            :row-class-name="tableRowClassHandle"
            class="house-type-table">
            <template>
              <el-table-column prop="name" label="名称" align="center">
                <template slot-scope="scope">
                  <span class="td-text">{{ scope.row.name }}</span>
                  <el-input v-model="houseTypeForm.name" size="small" class="td-input" placeholder="请输入名称"/>
                </template>
              </el-table-column>
              <el-table-column prop="constructionArea" label="面积" align="center">
                <template slot-scope="scope">
                  <span class="td-text">{{ scope.row.constructionArea }}</span>
                  <el-input v-model="houseTypeForm.constructionArea" size="small" class="td-input" placeholder="请输入面积">
                    <span slot="append" class="input-area-text">㎡</span>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="structure" label="房间结构" align="center">
                <template slot-scope="scope">
                  <span class="td-text">{{ scope.row.structure }}</span>
                  <el-input v-model="houseTypeForm.structure" size="small" class="td-input" placeholder="请输入户型结构"/>
                </template>
              </el-table-column>
              <el-table-column width="180" label="操作" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" class="save-btn" @click="addHouseTypeHandle(scope.$index, scope.row)">保存</el-button>
                  <el-button size="mini" type="primary" class="edit-btn" @click="editHouseTypeHandle(scope.row)">编辑</el-button>
                  <el-button size="mini" type="primary" @click="deleteHoseType(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </template>
          </el-table>
          <el-button size="small" plain class="add-house-property-btn" @click="addHouseTypeCtrl">
            <i class="el-icon-plus" />
            新增户型
          </el-button>
        </div>
      </el-main>
    </template>
  </footerBarContainer>
</template>
<script>
import { uploadImg } from '@/utils/manageOSS'
import { mapGetters, mapActions } from 'vuex'
import { searchArrByKeyVal } from '@/utils/public'
import { addProjectStage, editProjectStage } from '@/api/project_config/project'
import AddHouseType from '@/views/project_config/project/components/addHouseType'
import FooterBarContainer from '@/components/FooterBarContainer'
import { emptyTarget } from '@/utils/public'
export default {
  components: { AddHouseType, FooterBarContainer },
  data() {
    const validCityFunc = (rule, val, callback) => { // 验证项目所在城市是否输入
      if (val === '') {
        callback(new Error('请完整填写地址'))
      } else {
        callback()
      }
    }
    // const validCityAreaView = (rule, val, callback) => { // 验证项目鸟瞰图是否输入
    //   if (val === '') {
    //     callback(new Error('请选择鸟瞰图'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      // ----------- 添加项目分期表单数据 -----------
      stageFormData: {
        projectId: '',
        parentId: '',
        type: 1,
        status: '',
        name: '',
        code: '',
        address: '',
        orgId: '',
        estateProjectDetailEntity: {
          typeId: '',
          cityId: '',
          constructionStage: '',
          constructionArea: '',
          deliveryType: '',
          aerialView: '',
          houseTypeEntityList: []
        },
        path: null
      },
      stageFormRules: {
        name: [{ required: true, trigger: 'blur', message: '项目名称不能为空' }],
        code: [{ required: true, trigger: 'blur', message: '项目编码不能为空' }],
        // address: [{ required: true, trigger: 'blur', message: '项目地址不能为空' }],
        status: [{ required: true, trigger: 'change', message: '请选择状态' }],
        estateProjectDetailEntity: {
          cityId: [{ required: true, trigger: 'change', validator: validCityFunc }],
          typeId: [{ required: true, trigger: 'change', message: '请选择项目状态' }]
          // constructionArea: [{ required: true, trigger: 'blur', message: '请输入建筑面积' }],
          // deliveryType: [{ required: true, trigger: 'change', message: '请选择项目状态' }],
          // constructionStage: [{ required: true, trigger: 'change', message: '请选择施工阶段' }],
          // aerialView: [{ required: true, trigger: 'change', validator: validCityAreaView }]
        }
      },
      // ------------------ 添加户型的表单数据 -------------------
      houseTypeForm: {
        name: '',
        structure: '',
        constructionArea: ''
      },
      // ----------- 保存下拉选择框的option需要的数据 -----------
      projectStatus: [], // 保存项目状态数据
      deliveryType: [], // 保存交付类型数据
      constructionType: [], // 保存施工阶段数据
      districtData: [], // 保存当前城市的区县数据
      cityData: [], // 保存当前省的城市数据
      provinceData: [], // 保存省的数据
      enableStatus: [
        { id: 0, value: '禁用' },
        { id: 1, value: '启用' }
      ], // 保存项目状态
      belongCompany: '', // 保存项目所属公司
      houseTypeData: [], // 保存添加的户型数据
      provinceSelected: '', // 保存选择的城市Id
      citySelected: '', // 保存选择的城市id
      // aerialviewSrc: '', // 鸟瞰图预览路径
      // ----------- 数据字典dictId与本地数据对照关系 -------------------
      selectDectionary: {
        projectStatus: {
          'dictId': 'project_status'
        },
        constructionType: {
          'dictId': 'construction_type'
        },
        deliveryType: {
          'dictId': 'delivery_type'
        },
        districtData: {
          'dictId': 'city',
          'parentId': ''
        },
        cityData: {
          'dictId': 'city',
          'parentId': ''
        },
        provinceData: {
          'dictId': 'city',
          'parentId': '-1'
        }
      },
      allCityData: [],
      allCityIndex: {},
      // ----------- 状态数据 -------------------
      stageLoading: false,
      selectLoading: false,
      isUploadAerialview: false,
      isAddingHouseType: false
    }
  },
  computed: {
    ...mapGetters([
      'projectList',
      'projectDetails'
    ])
  },
  watch: {
    // 通过省ID获取城市数据
    provinceSelected: function(newVal, oldVal) {
      if (newVal !== '' && newVal !== oldVal) {
        this.selectDectionary.cityData['parentId'] = newVal
        this.cityData = []
        this.getSelectData(true, 'cityData')
      }
    },
    // 通过城市ID获取区县数据或省数据
    citySelected: function(newVal, oldVal) {
      if (newVal !== '' && newVal !== oldVal) {
        this.selectDectionary.districtData['parentId'] = newVal
        this.districtData = []
        this.getSelectData(true, 'districtData')
      }
    },
    // 编辑项目分期时，获取所有城市数据再进行处理
    'stageFormData.estateProjectDetailEntity.cityId': function(newVal) {
      const eventType = this.$route.query.eventType
      if (this.districtData.length === 0 && eventType === 'edit') {
        const params = {
          'terms[0].column': 'dictId',
          'terms[0].value': 'city'
        }
        this.getDictionaryItemFunc({ params, dataKey: 'districtData' }).then(async resp => {
          // this.handleAllCityData(resp, newVal)
          this.handleAllCityDataNew(resp, newVal)
          this.stageLoading = false
        }).catch(err => {
          this.stageLoading = false
          this.$message.error('数据加载失败，请重试')
          console.log(err)
        })
      }
    }
  },
  created() {
    const projectId = this.$route.query.projectId
    const eventType = this.$route.query.eventType
    if (eventType === 'add') {
      // 添加分期，获取父级项目ID以及所属公司
      const curProject = searchArrByKeyVal(this.projectList, 'id', projectId)
      this.stageFormData.parentId = projectId
      // this.stageFormData['projectId'] = curProject['estateProjectDetailEntity'].projectId
      // this.stageFormData['projectId'] = curProject.projectId
      this.stageFormData.orgId = curProject.orgId
      if (curProject) {
        this.belongCompany = curProject.name
      }
      // 初始化加载省份数组，不需重复请求
      const msg = this.$message({
        type: 'info',
        message: '数据加载中',
        duration: 0
      })
      const params = {
        'terms[0].column': 'dictId',
        'terms[0].value': 'city'
      }
      this.getDictionaryItemFunc({ params, dataKey: 'districtData' }).then(async resp => {
        this.getProvinceArr(resp)
        this.stageLoading = false
        msg.close()
      }).catch(err => {
        this.stageLoading = false
        this.$message.error('数据加载失败，请重试')
        console.log(err)
        msg.close()
      })
    } else if (eventType === 'edit') {
      const msg = this.$message({
        type: 'info',
        message: '数据加载中',
        duration: 0
      })
      this.stageLoading = true
      // 编辑项目分期，加载表单数据
      const curProject = searchArrByKeyVal(this.projectDetails, 'id', projectId)
      if (curProject) {
        // this.stageLoading = true
        const parentId = curProject.parentId
        const _keys = Object.keys(curProject)
        const parentProject = searchArrByKeyVal(this.projectList, 'id', parentId)
        // 加载所属公司
        if (parentProject) {
          this.belongCompany = parentProject.name
        }
        // 加载表单数据
        _keys.forEach(key => {
          this.stageFormData[key] = curProject[key]
        })

        // this.stageFormData['estateProjectDetailEntity'].cityId = '101e4f9c7ad04ed0a1c314def2d5e0d2'

        // 加载下拉选择框数据
        const _selectDictKey = Object.keys(this.selectDectionary)
        const whiteList = ['provinceData', 'districtData', 'cityData']
        _selectDictKey.forEach(key => {
          // districtData, cityData, provinceData 城市相关数据另外加载
          if (this[key].length === 0 && !whiteList.includes(key)) {
            this.getSelectData(true, key)
          }
        })
        // 加载户型数据
        this.houseTypeData = curProject.estateProjectDetailEntity.houseTypeEntityList || []
        // 初始化加载省份数组，不需重复请求
        const params = {
          'terms[0].column': 'dictId',
          'terms[0].value': 'city'
        }
        this.getDictionaryItemFunc({ params, dataKey: 'districtData' }).then(async resp => {
          this.getProvinceArr(resp)
          this.stageLoading = false
          msg.close()
        }).catch(err => {
          this.stageLoading = false
          this.$message.error('数据加载失败，请重试')
          console.log(err)
          msg.close()
        })
      }
    }
  },
  methods: {
    ...mapActions([
      'getDictionaryItemFunc'
    ]),
    // 处理表格行的样式
    tableRowClassHandle({ row, rowIndex }) {
      if (row.virtual) {
        this.isAddingHouseType = true
        return 'add-house-type-row'
      } else {
        this.isAddingHouseType = false
      }
    },
    // 处理所有城市数据
    handleAllCityData(datas, tergetDistrictId) {
      const beHandleData = []
      datas = datas.slice(0, 10)
      // datas 每一项相当于一个地名（省市区都算一个）的数据
      datas.forEach(val => {
        if (val.parentId === '-1') { // parentId=-1那就是一个省级地名
          // 处理省
          this.allCityData.push(val) // 存储一个城市所属地方链条数据
          this.provinceData.push(val) // 一个只储存省级地名的数组
          this.allCityIndex[val.id] = [] // 为这个省级地名预留一个数组，index是省级地名的id
        } else {
          const keys = Object.keys(this.allCityIndex) // 返回省对象id数组
          const proviIndex = keys.indexOf(val.parentId) // 找出对应的省id
          if (proviIndex >= 0) {
            // 处理市
            const curProvi = this.allCityData[proviIndex] // 找出所属省份对象
            curProvi.children ? curProvi.children.push(val) : curProvi['children'] = Array.of(val) // 把城市数据放入省份对象children数组之中
            this.allCityIndex[keys[proviIndex]].push(val.id) // 在为省级地名预留的数组中添加一个市id
          } else {
            // 处理区县
            if (keys.length) {
              keys.forEach((key, idx) => {
                const cItyIndex = this.allCityIndex[key].indexOf(val.parentId)
                if (cItyIndex >= 0) {
                  const curCity = this.allCityData[idx].children[cItyIndex]
                  curCity.children ? curCity.children.push(val) : curCity['children'] = Array.of(val)
                  if (tergetDistrictId === val.id) {
                    this.provinceSelected = key
                    this.citySelected = val.parentId
                  }
                } else {
                  beHandleData.push(val)
                }
              })
            } else {
              beHandleData.push(val)
            }
          }
        }
      })
      if (beHandleData.length > 0) {
        this.handleAllCityData(beHandleData, tergetDistrictId)
      }
    },
    // 用于地点初始化
    handleAllCityDataNew(datas, tergetDistrictId) { // datas是3000多条的地方数据
      // let provinceArr = []
      // for (let index = 0; index < datas.length; index++) {
      //   const element = datas[index]
      //   if (element.parentId != '-1') { // parentId=-1那就是一个省级地名
      //     continue
      //   } else {
      //     provinceArr.push(element) // 获取包含所有省的数组
      //   }
      // }
      // if (this.provinceData.length<1) { // 不必重新请求省份
      //   this.provinceData = provinceArr
      // }
      for (let index = 0; index < datas.length; index++) {
        const element = datas[index]
        // if (element.id == '101e4f9c7ad04ed0a1c314def2d5e0d2') {
        if (element.id === tergetDistrictId) {
          this.citySelected = element.parentId // 填充对应的城市
          break
        }
      }
      for (let index = 0; index < datas.length; index++) {
        const element = datas[index]
        if (this.citySelected === element.id) { // 遍历找出城市对应的省份
          this.provinceSelected = element.parentId
          break
        }
      }
    },
    getProvinceArr(datas) {
      const provinceArr = []
      for (let index = 0; index < datas.length; index++) {
        const element = datas[index]
        if (element.parentId !== '-1') { // parentId=-1那就是一个省级地名
          continue
        } else {
          provinceArr.push(element) // 获取包含所有省的数组
        }
      }
      this.provinceData = provinceArr
    },
    // 获取下拉框数据
    getSelectData(visiable, dataKey) { // true of false, 一个this的属性（一个数组）
      if (visiable && this[dataKey].length === 0) { // true 而且对应数组为空数组的时候
        // this.selectLoading = true
        const msg = this.$message({
          message: '数据加载中',
          type: 'info',
          duration: 0
        })
        const paramsObj = this.selectDectionary[dataKey] // this.selectDectionary 包含了省市区数据对象的一个大对象
        const _keys = Object.keys(paramsObj) // 获取大对象里面的一个小对象的所有key值
        const params = {}
        _keys.forEach((key, idx) => { // 把小对象的key和value都作为params对象的值，组装一个请求的参数对象
          if (paramsObj[key] !== '') {
            params[`terms[${idx}].column`] = key
            params[`terms[${idx}].value`] = paramsObj[key]
          }
        })
        this.getDictionaryItemFunc({ params, dataKey }).then(resp => { // 请求返回小对象的数据
          this[dataKey] = resp
          // this.selectLoading = false
          msg.close()
        }).catch(err => {
          console.log(err)
          this.$message.error('数据请求失败，请重试')
          msg.close()
        })
      }
    },
    // 显示添加户型填写表单
    addHouseTypeCtrl() {
      // houseTypeData 户型数据
      // lastData 返回元素的virtual属性为true的元素集合
      const lastData = this.houseTypeData.filter(type => {
        if (type.virtual) {
          return true
        }
      })
      if (lastData.length) {
        return
      }
      // 新增虚拟数据到表格
      const _obj = {
        name: '',
        structure: '',
        constructionArea: '',
        virtual: true
      }
      this.houseTypeData.push(_obj)
    },
    // 添加户型处理
    addHouseTypeHandle(index, data) {
      if (this.houseTypeForm.name === '' || this.houseTypeForm.structure === '' || this.houseTypeForm.constructionArea === '') {
        this.$message({
          type: 'warning',
          message: '请填写完整数据'
        })
        return
      }
      const _obj = {
        name: this.houseTypeForm.name,
        structure: this.houseTypeForm.structure,
        constructionArea: this.houseTypeForm.constructionArea,
        projectId: this.stageFormData.projectId
      }
      // 如果是table中的最后一行，则按新增数据处理，否则按编辑数据处理
      if (index === this.houseTypeData.length - 1) {
        this.houseTypeData = this.houseTypeData.filter(type => {
          if (!type.virtual) {
            return true
          }
        })
        this.houseTypeData.push(_obj)
      } else {
        this.houseTypeData[index] = _obj
      }
      this.stageFormData.estateProjectDetailEntity.houseTypeEntityList = this.houseTypeData
      this.houseTypeForm = emptyTarget(this.houseTypeForm)
    },
    // 编辑户型数据
    editHouseTypeHandle(data) {
      if (this.isAddingHouseType) {
        this.$message({
          message: '请先完成或取消新增户型填写',
          duration: 0,
          showClose: true
        })
        return false
      }
      // data是每一行的数据，this.houseTypeForm是表格里的输入框
      const _keys = Object.keys(this.houseTypeForm)
      _keys.forEach(key => {
        this.houseTypeForm[key] = data[key]
      })
      this.$set(data, 'virtual', true)
    },
    // 删除户型
    deleteHoseType(index, data) {
      this.houseTypeData.splice(index, 1)
      this.stageFormData.estateProjectDetailEntity.houseTypeEntityList = this.houseTypeData
    },
    // 上传鸟瞰图
    uploadAerialview({ file }) {
      this.isUploadAerialview = true
      uploadImg(file, 'aerialview').then(resp => {
        // this.aerialviewSrc = resp.url
        this.stageFormData.estateProjectDetailEntity.aerialView = resp.url
        this.isUploadAerialview = false
      })
    },
    // 添加分期处理
    submitHandle() {
      this.$refs.stageForm.validate(valid => {
        if (valid) {
          if (this.isUploadAerialview) {
            this.$alert('正在上传鸟瞰图，请等待上传完！', '提示', {
              confirmButtonText: '确定'
            })
            return
          }
          this.stageLoading = true
          let _method, _msg
          const eventType = this.$route.query.eventType
          console.log('this.stageFormData', this.stageFormData)
          if (eventType === 'add') {
            _method = addProjectStage(this.stageFormData)
            _msg = '新增项目分期成功'
          } else if (eventType === 'edit') {
            _method = editProjectStage(this.stageFormData)
            _msg = '编辑项目分期成功'
          }
          _method.then(resp => {
            this.stageLoading = false
            this.$router.go(-1)
            this.$message({
              message: _msg,
              type: 'success'
            })
          }).catch(() => {
            this.stageLoading = false
          })
        }
      })
    },
    cancelHandle() {
      if (this.isUploadAerialview) {
        this.$confirm('正在上传鸟瞰图，退出会中断上传，是否退出？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.go(-1)
        })
      } else {
        this.$router.go(-1)
      }
    },
    // 地址更改时的清空交互
    clearProvince() {
      this.citySelected = '';
      this.stageFormData.estateProjectDetailEntity.cityId = ''
    },
    clearCity() {
      this.stageFormData.estateProjectDetailEntity.cityId = ''
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.header {
  height: 50px;
  padding: 0 15px;
  font-size: 18px;
  font-weight: bold;
  background: #fff;
  border-bottom: 1px solid #ccc;
  @include flex-layout(space-between, center, null, null);
}
.stage-info-watp {
  padding: 0;
  background: #fff;
  .stage-Info-form{
    padding: 20px;
    @include flex-layout(flex-start, center, row, wrap);
    .el-form-item {
      width: 27%;
      margin: 10px 3%;
      .el-input {
        .el-button {
          padding: 8px 5px;
        }
        &/deep/.el-input-group__append {
          padding: 0 7px;
        }
      }
      .el-select {
        width: 100%;
      }
      .city-selects-wrap {
        width: 100%;
        display: inline-block;
        text-align: center;
        font-size: 0;
        .el-select {
          width: 30%;
        }
        .city-selects-interval {
          width: 3%;
          margin: 0 1%;
          display: inline-block;
          border: 1px solid #ccc;
        }
      }
    }
  }
  .aerialview-upload-wrap {
    // padding: 0 20px 30px 20px;
    // margin-left: 3%;
    .title-text {
      font-size: 14px;
      margin-left: 10px;
    }
    & /deep/ .el-upload {
      width: 130px;
      height: 130px;
      margin-top: 15px;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      overflow: hidden;
      background: #fbfdff;
      cursor: pointer;
      @include flex-layout(center, center, null, nowrap);
      img {
        display: none;
        width: 85%;
      }
      i {
        font-size: 46px;
        color: #ccc;
      }
    }
    & /deep/ .uploaded {
      background: #fff;
      i {
        display: none;
      }
      img {
        display: block;
      }
    }
  }
}
.house-type-wrap {
  padding: 0;
  background: #fff;
  margin-top: 20px;
  .table-wrap {
    padding: 20px;
    .house-type-table {
      border: 1px solid #ccc;
      border-bottom: none;
      & /deep/ .el-table__header {
        th {
          padding: 8px;
          background: #f0f1f5;
          border-bottom: 1px solid #ccc;
        }
      }
      & /deep/.el-table__row {
        .td-input {
          display: none;
        }
        .save-btn {
          display: none;
          margin-left: 10px;
        }
        .el-input-group__append {
          padding: 0 8px;
        }
      }
      & /deep/.add-house-type-row {
        .td-input, .save-btn {
          display: inline-table;
        }
        .td-text, .edit-btn {
          display: none;
        }
      }
    }
  }
  .add-house-property-btn {
    width: 100%;
    border: 1px dashed #ccc;
    margin-top: 10px;
    &:hover {
      border-color: #409EFF
    }
  }
}
/deep/.el-popper {
  margin-top: 0;
}

  .avatar-uploader .avatar-uploader-icon {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .avatar-uploader-icon:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
