<template>
  <leftSlidePopup :show="isPopupShow" width="680px" v-on="$listeners" @leaveOver="closeBoxHandle">
    <div v-loading="isLoading" slot="main-content" class="container">
      <el-tabs v-model="showTabName" class="tabs-container">
        <el-tab-pane label="进场申请" name="acceptApply">
          <div class="apply-Info-wrap">
            <div class="Info-item">
              <span class="info-label">项目名称：</span>
              <span class="info-text">{{ acceptApplyData.projectName }}</span>
            </div>
            <div class="Info-item">
              <span class="info-label">材料进场批次名称：</span>
              <span class="info-text">{{ acceptApplyData.name }}</span>
            </div>
            <div class="Info-item">
              <span class="info-label">材料类型：</span>
              <span class="info-text">{{ acceptApplyData.metarialTypeName }}</span>
            </div>
            <div class="Info-item">
              <span class="info-label">部位：</span>
              <span class="info-text">{{ acceptApplyData.part }}</span>
            </div>
            <div class="Info-item">
              <span class="info-label">接收单位：</span>
              <span class="info-text">{{ acceptApplyData.consOrgName }}</span>
            </div>
            <div class="Info-item">
              <span class="info-label">接收人：</span>
              <span class="info-text">{{ acceptApplyData.consPersonName }}</span>
            </div>
            <div class="Info-item">
              <span class="info-label">监理：</span>
              <span class="info-text">{{ acceptApplyData.superPersonName }}</span>
            </div>
            <div class="Info-item">
              <span class="info-label">建设单位接收人：</span>
              <span class="info-text">{{ acceptApplyData.buildPersonName }}</span>
            </div>
            <div class="Info-item">
              <span class="info-label">计划进场日期：</span>
              <span class="info-text">{{ acceptApplyData.sealDate }}</span>
            </div>
            <div class="Info-item">
              <span class="info-label">供货类别：</span>
              <span class="info-text">{{ acceptApplyData.typeName }}</span>
            </div>
            <div class="Info-item">
              <span class="info-label">抄送人：</span>
              <span class="info-text">{{ acceptApplyData.ccPerson }}</span>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="材料验收" name="acceptance">
          <div class="material-accept-wrap">
            <div class="material-detail-wrap">
              <div class="header">材料明细</div>
              <div
                v-for="item in materialDetailData"
                :key="item.id"
                class="record-item-wrap">
                <div class="real-wrap">
                  <el-row :gutter="10">
                    <el-col :span="16">
                      <p>{{ item.brand }} {{ item.name }}</p>
                    </el-col>
                    <el-col :span="8">
                      <p class="accept-text text-right">实收数：{{ item.actualNum || '无' }}</p>
                    </el-col>
                  </el-row>
                </div>
                <div class="plan-wrap">
                  <el-row :gutter="10">
                    <el-col :span="16">
                      <p v-if="item.specificateAttribute">{{ item.specificateAttribute }}</p>
                    </el-col>
                    <el-col :span="8">
                      <p class="text-right">计划进场数: {{ item.planNum || '无' }}</p>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
            <AcceptRecord :record-list="acceptRecordData" />
            <!-- <div class="accept-record-wrap">
              <div class="header">验收记录</div>
              <ul class="record-list">
                <li class="record-item">
                  <div class="record-info-wrap">
                    <i class="user-img el-icon-user-solid"/>
                    <p>
                      <span class="name-text">李四</span>
                      <span class="date-text">2019-07-29</span>
                    </p>
                    <p>中信项目管理咨询有限公司</p>
                  </div>
                  <p class="record-status">#到货确认</p>
                  <p class="problem-content">物料到货确认</p>
                  <div class="photo-list">
                    <div class="photo-item">
                      <img src="" >
                    </div>
                  </div>
                </li>
              </ul>
            </div> -->
          </div>
        </el-tab-pane>
        <el-tab-pane label="材料送检" name="materialTest">
          <div class="material-test-wrap">
            <AcceptRecord :record-list="testRecordData" />
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="close-box-btn" @click="popupHideHandle">
        <i class="el-icon-close" />
      </div>
    </div>
  </leftSlidePopup>
</template>
<script>
import LeftSlidePopup from '@/components/Pop-ups/LeftSlidePopup'
import AcceptRecord from '@/views/material/material_acceptance/components/acceptRecord'
import { getMaterialAcceptDetail } from '@/api/material/material_acceptance'
export default {
  components: {
    LeftSlidePopup,
    AcceptRecord
  },
  props: {
    isMaterialDetailShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      materialAcceptData: {},
      acceptApplyData: {}, // 保存进场申请数据
      materialDetailData: [], // 保存材料明细数据
      acceptRecordData: [], // 保存材料验收回复
      testRecordData: [], // 保存材料送检回复
      showTabName: 'acceptApply',
      isPopupShow: false,
      isLoading: false
    }
  },
  watch: {
    isMaterialDetailShow: function(newVal) {
      if (newVal) {
        this.isPopupShow = newVal
      }
    },
    materialAcceptData: function(newVal) {
      if ('id' in newVal) {
        this.isLoading = true
        getMaterialAcceptDetail(newVal.id).then(resp => {
          console.log('AcceptDetail', resp)
          const _data = resp.result
          // 抄送人集合
          const ccPerson = []
          if (_data.identityEntityList && _data.identityEntityList.length > 0) {
            _data.identityEntityList.forEach(item => {
              ccPerson.push(item.personName)
            })
          }
          // 材料明细
          if (_data.detailEntityList) {
            this.$set(this, 'materialDetailData', _data.detailEntityList)
          }
          // 材料验收回复
          if (_data.replyEntityList) {
            this.$set(this, 'acceptRecordData', _data.replyEntityList)
          }
          // 材料送检回复
          if (_data.checkReplyEntityList) {
            this.$set(this, 'testRecordData', _data.checkReplyEntityList)
          }
          // 整理进场申请数据
          const applyData = {
            projectName: _data.projectName,
            acceptName: _data.name,
            metarialTypeName: _data.metarialTypeName,
            part: _data.part,
            consOrgName: _data.consOrgName,
            consPersonName: _data.consPersonName,
            superPersonName: _data.superPersonName,
            buildPersonName: _data.buildPersonName,
            sealDate: _data.sealDate,
            typeName: _data.typeName,
            ccPerson: ccPerson.join()
          }
          this.$set(this, 'acceptApplyData', applyData)
          this.isLoading = false
        }).catch(() => {
          this.isLoading = false
        })
        //
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
    popupHideHandle() {
      this.isPopupShow = false
    },
    closeBoxHandle() {
      this.$emit('update:isMaterialDetailShow', false)
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';

.container {
  height: 100%;
  padding: 15px;
  position: relative;
  color: #495060;
  .close-box-btn {
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    position: absolute;
    right: 0;
    top: 3px;
    color: #f00;
    font-size: 30px;
    cursor: pointer;
  }
  .tabs-container {
    width: 100%;
    height: 100%;
    .apply-Info-wrap {
      padding: 15px 20px 20px 20px;
      .Info-item {
        width: 100%;
        margin:  15px 0;
        font-size: 14px;
        color: #495060;
        .info-label, .info-text {
          display: inline-block;
          // height: 30px;
          // line-height: 30px;
        }
        .info-label {
          width: 150px;
          font-weight: bold;
          text-align: right;
          vertical-align: top;
        }
        .info-text {
          width: calc(100% - 155px);
          padding-left: 5px;
          line-height: 20px;
        }
      }
    }
    .material-accept-wrap {
      padding: 10px;
      .header {
        padding: 8px 0;
        font-weight: bold;
        border-bottom: 1px solid #ccc;
      }
      .material-detail-wrap {
        .record-item-wrap {
          margin-top: 15px;
          padding: 12px 10px;
          border-radius: 5px;
          border: 1px solid #ccc;
          p {
            margin: 0;
            line-height: 25px;
            &.text-right {
              text-align: right
            }
            &.accept-text {
              font-weight: bold;
            }
          }
          .real-wrap {
            margin-bottom: 15px;
            font-size: 14px;
          }
          .plan-wrap {
            font-size: 12px;
          }
        }
      }
      .accept-record-wrap {
        margin-top: 15px;
        .record-list {
          list-style: none;
          padding: 0;
          margin: 15px 0 0 0;
          .record-item {
            font-size: 12px;
            color: #80848f;
            width: 100%;
            margin-bottom: 10px;
            padding: 10px 10px 20px 70px;
            border: 1px solid #dddee1;
            border-radius: 5px;
            // box-shadow: 0 0 5px #dddee1;
            .record-info-wrap {
              position: relative;
              .user-img {
                width: 40px;
                height: 40px;
                line-height: 40px;
                background: #d9d9d9;
                border-radius: 50px;
                position: absolute;
                left: -50px;
                top: -3px;
                color: #fff;
                font-size: 26px;
                text-align: center;
              }
              .name-text {
                font-size: 16px;
              }
              .date-text {
                float: right;
              }
            }
            p {
              margin: 7px 0;
              &.record-status {
                color: #5cadff;
              }
            }
            .photo-list {
              @include flex-layout(flex-start, flex-start, null, wrap);
              .photo-item {
                width: 80px;
                height: 65px;
                border: 1px solid #dddee1;
                border-radius: 5px;
                margin: 10px 10px 0 0;
                padding: 10px;
                @include flex-layout(center, center, null, null);
                img {
                  width: 100%;
                  height: 100%;
                  cursor: pointer;
                }
              }
            }
          }
        }
      }
    }
    .material-test-wrap {
      padding: 10px;
    }
  }
}
</style>
