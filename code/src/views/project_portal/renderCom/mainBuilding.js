import { acceptDefault, processAccepted } from '@/styles/variables.scss'
export default {
  name: 'MainBuilding',
  // functional: true,
  props: {
    roomList: {
      type: Array,
      default: () => {
        return []
      }
    },
    processItems: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      acceptDefaultColor: acceptDefault,
      processAcceptedColor: processAccepted,
      floorColors: {}
    }
  },
  computed: {
    roomDatas() {
      // 楼层重新排序，按从高到低排
      const backData = this.roomList.sort((prev, next) => {
        return next.sortIndex - prev.sortIndex
      })
      // 处理楼层颜色
      let color
      backData.forEach(room => {
        const { acceptItemId, acceptStatus, id } = room
        // 已验收
        if (!acceptStatus) {
          // 是否是预设工序项，是则选用预设工序项验收，否则选用自定义验收
          const target = this.processItems.find(item => {
            return item.describe === acceptItemId
          })
          if (target === undefined) {
            color = this.processAcceptedColor
          } else {
            color = `#${target.value}`
          }
        // 未验收
        } else {
          color = this.acceptDefaultColor
        }
        this.floorColors[id] = color
      })
      return backData
    }
  },
  render(h, context) {
    return (
      <div class='building-item-warp'>
        <div class='building-top'/>
        <div class='building-left'>
          {
            this.roomDatas.map(item => {
              return <span class='floor-wrap'>
                {
                  Array.apply(null, { length: 4 }).map(() => {
                    return (<span class='room-item' style={ this.styleHandle(item) }/>)
                  })
                }
              </span>
            })
          }
        </div>
        <div class='building-right'>
          {
            this.roomDatas.map(item => {
              return <span class='floor-wrap'>
                {
                  Array.apply(null, { length: 6 }).map(() => {
                    return (<span class='room-item' style={ this.styleHandle(item) }/>)
                  })
                }
              </span>
            })
          }
        </div>
      </div>
    )
  },
  methods: {
    // 返回设置背景颜色的内联样式
    styleHandle(data) {
      const roomId = data.id
      return { 'background': this.floorColors[roomId] }
    }
  }
}
