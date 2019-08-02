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
      return new Promise((reslove, reject) => {
        this.getProjectDetailsVuex().then(resp => {
          this.$set(this, 'projectDetailDatas', [])
          resp.forEach((project) => {
            const stages = project.childrenWithDetail
            if (stages && stages.length > 0) {
              stages.forEach(stage => {
                this.projectDetailDatas.push({
                  id: stage.id,
                  parentName: project.name,
                  parentId: stage.parentId,
                  name: `${project.name}--${stage.name}`,
                  section: stage.childrenWithDetail || [],
                  source: stage,
                  parent: project
                })
              })
            }
          })
          reslove(this.projectDetailDatas)
          // if (callback && typeof callback === 'function') {
          //   callback(this.projectDetailDatas)
          // }
        }).catch(() => {
          reject()
        })
      })
    }
  }
}
