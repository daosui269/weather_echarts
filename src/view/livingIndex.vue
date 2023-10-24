<script lang="ts" setup>
import getLivingIndex from '@/api/getLivingIndex'
import type { livingIndex } from '@/types/index'
import { onMounted, ref, watch, type Ref } from 'vue';
import * as echarts from 'echarts'

const props = defineProps<{
  'location': string
}>()

// 获取生活指数
let liveList: livingIndex[] = []
const getLivingIndexMsg = async () => {
  const data = (await getLivingIndex(props.location)).data
  liveList = data.daily
  console.log('liveList', liveList);
}
await getLivingIndexMsg()

const target: Ref<HTMLElement | undefined> = ref()
let myChart: any = null
onMounted(() => {
  myChart = echarts.init(target.value)
  drawChart()
})

// 绘图函数
const drawChart = () => {
  const series: any = []
  liveList.forEach((item: livingIndex, index: number) => {
    // 上层数据
    series.push({
      // name: item.name,
      type: 'pie',
      hoverAnimation: false,   // 放大效果
      radius: [73 - index * 15 + '%', 68 - index * 15 + '%'],  // 半径递减
      center: ['50%', '50%'],
      clockwise: false,  // 逆时针
      data: [
        {
          name: item.name,
          value: item.level,
          tooltip: {
            formatter: () => {
              return item.text
            },
          }
        },
        {
          value: 7,
          itemStyle: {
            color: "rgba(0,0,0,0)",
            borderWidth: 0,
          },
          tooltip: {
            show: false
          },
          hoverAnimation: false
        }
      ],
      itemStyle: {
        borderWidth: 0,
      },
      label: {
        show: false
      },
    })
    // 下层背景
    series.push({
      type: 'pie',
      silent: true,   // 图形不响应鼠标事件
      hoverAnimation: false,
      clockWise: false,
      z: 1,
      radius: [73 - 15 * index + '%', 68 - 15 * index + '%'],
      center: ['50%', '50%'],
      label: {
        show: false
      },
      data: [
        {
          value: 7.5,
          itemStyle: {
            color: 'rgb(3, 31, 62)',
            borderWidth: 0
          },
          tooltip: {
            show: false,
          },
          // hoverAnimation: false
        },
        {
          value: 2.5,
          itemStyle: {
            color: 'rgba(0,0,0,0)',
            borderWidth: 0
          },
          tooltip: {
            show: false,
          },
          // hoverAnimation: false
        }
      ]
    })
  });
  const option = {
    title: {
      show: true,
      text: '生活指数',
      textStyle: {
        color: '#fff'
      }
    },
    legend: {
      show: true,
      icon: 'circle',
      data: liveList.map(item => item.name),
      orient: 'vertical',
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 8,
      right: '20%',
      top: '12%',
      textStyle: {
        fontSize: 12,
        lineHeight: 5,
        color: 'rgba(255,255,255,0.8)'
      }
    },
    tooltip: {
      show: true
    },
    series: series
  }
  myChart.setOption(option)
  // echarts屏幕自适应
  window.addEventListener("resize", function () {
    setTimeout(() => {
      myChart && myChart.resize();
    }, 400);
  })
}

// 当地址变化后重新绘制
watch(() => props.location, async () =>{
  await getLivingIndexMsg()
  drawChart()
})


</script>

<template>
  <div ref="target" class="living"></div>
</template>

<style lang="less" scoped>
.living {
  width: 100%;
  height: 100%;
}
</style>