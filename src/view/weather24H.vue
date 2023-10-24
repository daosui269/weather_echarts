<script lang="ts" setup>
import getWeather24H from '@/api/getWeather24H'
import type { weatherHour } from '@/types/index'

import { onMounted, ref, type Ref, watch } from 'vue'
import * as echarts from 'echarts'

import useImportSvg from '@/hooks/ImportSvg'

// 导入svg
const { svgList } = useImportSvg()

const props = defineProps<{
  'location': string,
  'cityName': string
}>()

// 提取时间
const time = (dateString: string): string => {
  const date = new Date(dateString);
  const formattedTime = date.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' });
  return formattedTime
}

// 获取天气数据,并处理时间
const getweatherMsg = async (): Promise<weatherHour[]> => {
  const msgList = (await getWeather24H(props.location)).data.hourly
  for (let index in msgList) {
    msgList[index].fxTime = time(msgList[index].fxTime)
  }
  return msgList
}
let weatherMsgList: weatherHour[] = await getweatherMsg()

const target: Ref<HTMLElement | undefined> = ref()
let myEchar: any = null

onMounted(async () => {
  myEchar = echarts.init(target.value)
  drawEcharts(weatherMsgList)
})

watch(() => props.location, async () => {
  weatherMsgList = await getweatherMsg()

  drawEcharts(weatherMsgList)
})

// 绘制图表
const drawEcharts = (data: weatherHour[]) => {
  const option = {
    title: {
      show: true,
      text: `${props.cityName} 未来24小时天气`,
      top: '2%',
      left: '10%',
      textStyle:{
        color: '#fff'
      }
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      formatter: tooltipFormatter,
      position: 'bottom',

      backgroundColor: '#19E8FE',
      borderColor: '#2B2C7C',
      borderWidth:4,
      textStyle:{
        color: '#575D57'
      }
    },
    grid: {
      top: '25%',
      left: '5%',
      right: '5%',
      bottom: '5%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      axisTick:{
        alignWithLabel:true
      },
      
    },
    yAxis: {
      type: 'value',
      boundaryGap: false,
      axisLabel: {
        formatter: '{value} °C'
      },
      max:function (value:any){
        return Math.floor(parseInt(value.max)*1.2)
      },
      min: function (value:any){
        if(value.min > 0) return Math.round(parseInt(value.min)*0.8)
        else return Math.round(parseInt(value.min)*1.2)
      },
      // interval:2,
    },
    dataset: {
      'source': data
    },
    series: {
      name: '温度',
      type: 'line',
      encode: { x: 'fxTime', y: 'temp' },
      label: {
        show: true,
        formatter: labelFormatter,
      },
      symbol: (value: weatherHour) => {
        return `image://` + svgList.get(`${value.icon}-fill.svg`)

      },
      symbolSize: 20,
      symbolOffset: [0, '-80%'],
      itemStyle: {
        // 设置symbol的颜色
        normal: {
          // color: '#000'
          
        }
      },

      // markPoint: {
      //   data: [
      //     { type: 'max', name: 'Max' },
      //     { type: 'min', name: 'Min' }
      //   ],
      //   label: {

      //     formatter: '{c}℃'
      //   }
      // },
    }
  }
  myEchar.setOption(option)
  window.addEventListener("resize", function () {
   setTimeout(() => {
    myEchar && myEchar.resize();
   }, 400);
})
}

// 自定义提示框 
const tooltipFormatter = (params: any) => {
  return `<div style="display: flex; width: 100px; height: 100px">
    <div style="width: 60px; height: 100px;">
      <div style=" width: 100% ;height: 70px; text-align:center">
        <i class="qi-${params[0].data.icon}-fill" style="font-size: 50px" ></i></div>
      <div style="width:100%; text-align:center;">${params[0].data.text}</div>
    </div>
    <div style="display: flex; flex-direction: column;justify-content: space-between; width: 40px; height: 100px; text-align:center">
      <div>${params[0].data.fxTime}</div>
      <div>${params[0].data.temp}°C</div>
      <div>${params[0].data.windDir}</div>
  </div>`

  // return `<div style="display: flex; width: 100px; height: 100px">
  //   <div style="width: 50px; height: 100px;">
  //     <span class="" style="display: block; height: 70px;"></span>
  //     <div>多云</div>
  //   </div>
  //   <div style="display: flex; flex-direction: column;justify-content: space-between; width: 50px; height: 100px;">
  //     <div>时间</div>
  //     <div>温度</div>
  //     <div>风向</div>
  // </div>`
}

// 自定义标签
const labelFormatter = (params: any) => {
  // const msgIndex:number = weatherMsgList.findIndex(item => time(item.fxTime) == params[0].axisValue)
  
  // if (params.dataIndex % 2 != 0) return ''
  return `${params.value.temp}℃`
  // return `<i class="qi-${weatherMsgList[params.dataIndex].icon}-fill" style="font-size: 20px" ></i>`
}



</script>
<template>
  <div class="weather-hour" ref="target"></div>
</template>

<style lang="less" scoped>
.weather-hour {
  height: 100%;
  width: 100%;
  
}

.icon {
  font-size: 20px;
}
</style>