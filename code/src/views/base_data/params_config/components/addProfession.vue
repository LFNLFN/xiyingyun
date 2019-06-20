<template>
  <publicPopups title-text="新增楼层" @closePopupsBox="closeBox" @formConfirm="addProfessionsubmit">
    <template slot="main-content">
    </template>
  </publicPopups>
</template>
<script>
import PublicPopups from '@/components/Pop-ups/PublicPopups'
export default {
  components: { PublicPopups },
  data() {
    return {
      professionFormData: {
        name: ''
      },
      professionFormRules: {
        name: [{ required: true, trigger: 'blur', message: '专业名称不能为空' }]
      }
    }
  },
  methods: {
    addProfessionsubmit() {
      console.log(addProfessionsubmit)
    },
    closeBox() {
      this.$emit('update:isAddProfessionShow', false)
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
</style>
