<template>
  <div>{{ message }}</div>
</template>
<script>
export default{
  data() {
    return {
      message: 'test'
    }
  },
  created() {
    console.log('params: ', this.$route.params)
  }
}
</script>
