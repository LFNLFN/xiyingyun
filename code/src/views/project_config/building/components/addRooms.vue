<template>
  <publicPopups title-text="生成房间 " @closePopupsBox="closeBox">
    <template slot="main-content">
      <el-form
        ref="floorForm"
        :model="floorFormData">
        <el-form-item prop="" >
          <el-input size="small" class="unit-input">
            <template slot="append">
              <span>单元</span>
            </template>
          </el-input>
          <el-input v-model="floorFormData.name" size="small" placeholder="请输入标准层户数" class="room-input"/>
        </el-form-item>
      </el-form>
      <el-button size="small" class="add-unit-btn">添加单元</el-button>
    </template>
    <template slot="footer-content">
      <el-button type="primary" size="small" class="next-btn">下一步</el-button>
    </template>
  </publicPopups>
</template>
<script>
import PublicPopups from '@/components/Pop-ups/PublicPopups'
export default {
  components: { PublicPopups },
  data() {
    return {
      floorFormData: {
        name: '',
        addPlace: ''
      },
      floorFormCount: 1
    }
  },
  methods: {
    closeBox() {
      console.log('closeBox')
      this.$emit('update:isAddRoomsShow', false)
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
.el-form {
  padding-top: 20px;
  .el-form-item {
    white-space: nowrap;
    .unit-input {
      width: 20%;
      &/deep/.el-input-group__append {
        padding: 0 7px;
      }
    }
    .room-input {
      margin-left: 10px;
      width: calc(80% - 10px);
    }
  }
}
.add-unit-btn {
  width: 100%;
  border: 1px dashed #ccc;
  &:hover {
    border-color: #409EFF
  }
}
.next-btn {
  float: left;
}
</style>
