import statusColor from '@/styles/variables.scss'
export default {
  data() {
    return {
      problemTypes: [
        {
          id: 0,
          name: '质量问题'
        },
        {
          id: 1,
          name: '安全问题'
        }
      ],
      problemTypeMsg: {
        0: { title: '待指派', color: statusColor.orangeStatus },
        1: { title: '待整改', color: statusColor.redStatus },
        2: { title: '待销项', color: statusColor.blueStatus },
        3: { title: '已销项', color: statusColor.greenStatus },
        4: { title: '已作废', color: statusColor.grayStatus }
      }
    }
  }
}
