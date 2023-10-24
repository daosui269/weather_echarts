<script  lang="ts" setup>
import * as echarts from 'echarts'
import 'echarts-liquidfill'
import { onMounted, ref, watch, type Ref } from 'vue';
import getAir from '@/api/getAir'
import type { AirQuality } from '@/types/index'

const target: Ref<HTMLElement | undefined> = ref()
const props = defineProps<{
  'location': string
}>()

// 获取空气质量信息
let airMsg: AirQuality | undefined = undefined
const getAirMsg = async () => {
  const { data } = (await getAir(props.location))
  // console.log(data);
  airMsg = data.now
}
await getAirMsg()

let myChart: any = null
onMounted(async () => {
  console.log('airMsg', airMsg);
  myChart = echarts.init(target.value)
  drawChart()
})

const drawChart = () => {
  const option = {
    title: {
      show: true,
      text: '当前空气情况',
      top: '5%',
      left: '8%',
      textStyle: {
        color: '#fff'
      },
      shadowColor: 'rgba(0, 0, 0, 0.5)',
      shadowBlur: 10
    },
    tooltip: {
      show: true,
      formatter:() =>{
        return `空气质量:${airMsg?.category}`
      }
    },
    series: [{
      type: 'liquidFill',
      radius: '100%',
      center: ['50%', '50%'],
      data: [parseInt(<string>airMsg?.aqi) / 300],
      // parseInt(<string>airMsg?.aqi) / 300
      backgroundStyle: { // 球背景样式设置
        borderWidth: 1, // 球背景边框宽度
        borderColor: 'rgb(56, 155, 183)', // 球背景边框颜色
        color: 'rgb(56, 155, 183)' // 球背景颜色
      },

      label: {
        normal: {
          color: '#19E8FE',
          insideColor: 'transparent',
          textStyle: {
            fontSize: 18,
            fontWeight: 'bold',
          },
          formatter: (param: any) => { // 百分比正常样式字体格式
            return '空气指数:' + airMsg?.aqi; // 百分比正常样式字体格式
          }
        }
      },
      color: [{
        type: 'linear',
        x: 0,
        y: 1,
        x2: 0,
        y2: 0,
        colorStops: [{
          offset: 0,
          color: ['#00FF00'], // 0% 处的颜色
        }, 
        {
          offset: 0.8,
          color: ['#8F695E'], // 100% 处的颜色
        }
      ],
        global: false // 缺省为 false
      }],
      outline: {
        show: true,
        borderDistance: 5,
        itemStyle: {
          borderColor: 'rgba(67,209,100,1)',
          borderWidth: 0
        }
      }
    }]
  }
  myChart.setOption(option)

  // echarts屏幕自适应
  window.addEventListener("resize", function () {
    setTimeout(() => {
      myChart && myChart.resize();
    }, 400);
  })
}

watch(() => props.location, async () =>{
  await getAirMsg()
  drawChart()
})

</script>

<template>
  <div class="ary-body">
    <div ref="target" class="chart"></div>
    <div class="other">
      <div class="item9"> <span class="title">二氧化硫</span> <span class="content">指数:{{ airMsg?.so2 }}</span> </div>
      <div class="item9"> <span class="title">PM10</span> <span class="content">指数:{{ airMsg?.pm10 }}</span> </div>
      <div class="item9"> <span class="title">PM2.5</span> <span class="content">指数:{{ airMsg?.pm2p5 }}</span> </div>
      <div class="item9"> <span class="title">臭氧</span> <span class="content">指数:{{ airMsg?.o3 }}</span> </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.ary-body {
  display: flex;
  width: 100%;
  height: 100%;

  .chart {
    width: 50%;
    height: 100%;
  }

  .other {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    width: 50%;
    height: 100%;

    .item9 {
      display: inline;
      width: 80%;
      height: 20%;
      padding-top: 12%;
      background: linear-gradient(to left, #2CD5FF, #2CD5FF) left top no-repeat,
        linear-gradient(to bottom, #2CD5FF, #2CD5FF) left top no-repeat,
        linear-gradient(to left, #2CD5FF, #2CD5FF) right top no-repeat,
        linear-gradient(to bottom, #2CD5FF, #2CD5FF) right top no-repeat,
        linear-gradient(to left, #2CD5FF, #2CD5FF) left bottom no-repeat,
        linear-gradient(to bottom, #2CD5FF, #2CD5FF) left bottom no-repeat,
        linear-gradient(to left, #2CD5FF, #2CD5FF) right bottom no-repeat,
        linear-gradient(to left, #2CD5FF, #2CD5FF) right bottom no-repeat;
      background-size: 4px 20px, 20px 4px, 4px 20px, 20px 4px;
      border: 1px solid #073F97;
      position: relative;
      vertical-align: bottom;
    }

    .item9 .title {
      text-align: center;
      display: inline-block;
      width: 80%;
      height: 50%;
      background: #05286C;
      font-size: 16px;
      position: absolute;
      top: 0;
      left: 10%;
      padding: 4px 0px;
      color: #19E8FE;
      border-radius: 0 0 10px 10px;
    }

    .item9 .content {
      width: 100%;
      position: absolute;
      bottom: 10%;
      text-align: center;
      color: #fff;
      font-size: 20px;
    }
  }
}</style>