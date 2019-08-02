<template>
  <el-container class="global-container">
    <el-amap
      ref="map"
      :zoom="amapCionfig.zoom"
      :center="amapCionfig.center"
      :events="amapCionfig.events"
      vid="amapDemo"
      class="amap-entity"
      @complete="mapCompleteHandle" />
    <div
      :class="{'is-active': projectListShow}"
      class="project-list-wrap">
      <div class="position-wrap">
        <span
          class="toggle-btn"
          @click="projectListToggle">
          <i :class="{ 'el-icon-arrow-right': projectListShow, 'el-icon-arrow-left': !projectListShow }" />
        </span>
        <el-form
          size="small">
          <el-form-item>
            <el-input v-model="searchProjetName">
              <template slot="append">
                <el-button size="small">搜索</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
        <ul class="project-list">
          <li
            v-for="(item, idx) in cityAndProjectData"
            :key="idx">
            <p class="project-city">{{ item.city.describe }}</p>
            <div
              v-for="project in item.projectList"
              :key="project.id"
              class="project-wrap"
              @click="goProjectPortal(project)">
              <div class="project-avatar" />
              <div class="project-info">
                <p class="project-name">{{ project.name }}</p>
                <p v-show="project.source.constructionArea !== 0 && project.source.constructionArea" class="project-area">{{ project.constructionArea || 0.00 }} 平方米</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="city-check-wrap">
      <el-select
        v-model="citySelectedData"
        size="small">
        <el-option-group
          v-for="(group, idx) in citySelectedList"
          :key="idx">
          <el-option
            v-for="item in group.options"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
        </el-option-group>
      </el-select>
      <el-button size="small">重置</el-button>
    </div>
  </el-container>
</template>
<script>
import { Message } from 'element-ui'
import AmapManager from 'vue-amap'
import getProjectMixin from '@/mixins/getProjectStage'
import { getDictionaryItem } from '@/api/dictionary'
export default {
  mixins: [getProjectMixin],
  data() {
    return {
      amapCionfig: {
        amapManager: AmapManager,
        zoom: 4,
        center: [116.441953, 39.84279],
        events: {
          'complete': this.mapCompleteHandle
        }
      },
      cityAndProjectData: [],
      searchProjetName: '',
      citySelectedList: [
        {
          options: [{
            value: 'all',
            label: '全国'
          }]
        },
        {
          options: [
            {
              value: 'Chengdu',
              label: '成都'
            }, {
              value: 'Shenzhen',
              label: '深圳'
            }, {
              value: 'Guangzhou',
              label: '广州'
            }
          ]
        }
      ],
      citySelectedData: 'all',
      projectListShow: false
    }
  },
  created() {
    Message({
      message: '地图正在加载中...',
      duration: 0
    })
    this.getProjectFunc().then((proejctList) => {
      const cityProjects = {}
      const cityIdList = []
      proejctList.forEach(project => {
        const cityId = project.source.estateProjectDetailEntity.cityId || null
        if (cityId) {
          cityIdList.push(cityId)
          if (cityId in cityProjects) {
            cityProjects[cityId].push(project)
          } else {
            cityProjects[cityId] = Array.of(project)
          }
        }
      })
      const params = {
        'terms[0].column': 'dictId',
        'terms[0].value': 'city',
        'terms[1].column': 'id',
        'terms[1].termType': 'in',
        'terms[1].value': cityIdList.join()
      }
      getDictionaryItem(params).then(resp => {
        const cityData = resp.result
        cityData.forEach(city => {
          this.cityAndProjectData.push({
            city: city,
            projectList: cityProjects[city.id]
          })
        })
      })
    })
  },
  methods: {
    mapCompleteHandle() {
      Message.closeAll()
    },
    projectListToggle() {
      this.projectListShow = !this.projectListShow
    },
    goProjectPortal(data) {
      this.$router.push({ name: 'projectPortal', query: { projectId: data.id, parentId: data.parentId }})
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
@import "src/styles/variables.scss";

.el-container {
  position: relative;
  height: calc(100vh - #{$navbarHeight}) !important;
  .amap-entity {
    width: 100%;
    height: 100%;
  }
  .project-list-wrap {
    width: 380px;
    height: 100%;
    background: #fff;
    position: absolute;
    top: 0;
    right: -380px;
    transition: right 0.3s;
    &.is-active {
      right: 0px;
      transition: right 0.3s;
    }
    .position-wrap {
      width: 100%;
      height: 100%;
      position: relative;
      .toggle-btn {
        display: block;
        width: 20px;
        height: 60px;
        line-height: 60px;
        color: #fff;
        font-size: 22px;
        font-weight: bold;
        border-radius: 5px 0 0 5px;
        background: #80848f;
        cursor: pointer;
        position: absolute;
        left: -20px;
        top: 50%;
        transform: translate(0, -50%);
      }
      .el-form {
        padding: 20px 15px;
      }
      .project-list {
        margin: 0;
        padding: 0 10px;
        list-style: none;
        li {
          margin-bottom: 15px;
          .project-city {
            font-weight: bold;
            margin: 0 0 10px 5px;
          }
          .project-wrap {
            margin-top: 8px;
            cursor: pointer;
            @include flex-layout(flex-start, center, null, null);
            .project-avatar {
              width: 60px;
              height: 60px;
              border-radius: 5px;
              background: #edfbfe;
            }
            .project-info {
              height: 60px;
              padding-left: 15px;
              p {
                margin: 0;
                line-height: 30px;
                font-size: 14px;
                &.project-area {
                  font-size: 12px;
                  color: #80848f;
                }
              }
            }
          }
        }
      }
    }
  }
  .city-check-wrap {
    position: absolute;
    top: 15px;
    left: 15px;
    .el-select {
      width: 80px;
      &/deep/.el-input__inner {
        color: #495060;
        background: #f7f7f7;
        border-color: #dddee1;
      }
    }
    .el-button {
      margin-left: 15px;
      color: #495060;
      background: #f7f7f7;
      border-color: #dddee1;
      &:hover {
        background: #fff;
      }
    }
  }
}
</style>
