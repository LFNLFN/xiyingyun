export default {
  data() {
    return {
      pagePermission: {
        'get': false,
        'update': false,
        'delete': false,
        'add': false,
        'add-person': false,
        'bind-person': false,
        'unbind-person': false,
        'bind-project': false,
        'unbind-project': false,
        'add-position': false,
        'update-position': false,
        'delete-position': false,
        'disable': false,
        'enable': false,
        'add-role': false,
        'update-role': false,
        'delete-role': false
      }
    }
  },
  created() {
    const pagePermissionId = this.$route.meta.pagePermissionId
    const pagePermissionDic = this.$store.state.user.permissions
    if (pagePermissionDic.hasOwnProperty(pagePermissionId)) {
      for (const key in this.pagePermission) {
        if (this.pagePermission.hasOwnProperty(key) && pagePermissionDic[pagePermissionId].indexOf(key) > -1) {
          this.pagePermission[key] = true
        }
      }
    } else {
      // this.$router.push({ path: "/404" });
    }
  }
}
