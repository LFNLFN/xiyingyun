export default {
  data() {
    return {
      acceptanceStatus: [
        {
          type: 0,
          name: '验收通过'
        },
        {
          type: 1,
          name: '未验收'
        },
        {
          type: 2,
          name: '待验收'
        },
        {
          type: 3,
          name: '验收不通过'
        },
        {
          type: 4,
          name: '已作废'
        }
      ]
    }
  }
}
