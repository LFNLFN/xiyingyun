import { mapActions } from 'vuex'
export default {
  data() {
    return {
      projectDetailDatas: []
    }
  },
  methods: {
    ...mapActions([
      'getProjectDetailsVuex'
    ]),
    getProjectFunc(callback) {
      // 加载项目数据
      this.getProjectDetailsVuex().then(resp => {
        resp.forEach((project) => {
          const stages = project.childrenWithDetail
          if (stages && stages.length > 0) {
            stages.forEach(stage => {
              this.projectDetailDatas.push({
                id: stage.id,
                parentId: stage.parentId,
                name: `${project.name}--${stage.name}`,
                section: stage.childrenWithDetail || []
              })
            })
          }
        })
        callback(this.projectDetailDatas)
      })
    }
  }
}
