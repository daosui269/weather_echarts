<script lang="ts" setup>
import getWeather7D from '@/api/getWeather7D'
import type { WeatherDay } from '@/types/index'
import { ref, watch, type Ref, onMounted } from 'vue'
import * as echarts from 'echarts'

import useImportSvg from '@/hooks/ImportSvg'

// 导入svg
const { svgList } = useImportSvg()

const props = defineProps<{
  'location': string,
  'cityName': string
}>()

// 获取天气信息
const getweatherMsg = async (): Promise<WeatherDay[]> => {
  const msgList: WeatherDay[] = (await getWeather7D(props.location)).data.daily
  for (let index in msgList) {
    const date: string[] = msgList[index].fxDate.split('-')
    msgList[index].fxDate = date[1] + '-' + date[2]
  }
  return msgList
}
let weatherMsg: WeatherDay[] = await getweatherMsg()

// 
const target: Ref<HTMLElement | undefined> = ref()
let myEchar: any = null
onMounted(() => {
  myEchar = echarts.init(target.value)
  drawEchart(weatherMsg)

})
const drawEchart = (data: WeatherDay[]) => {
  const option = {
    title: {
      show: true,
      text: `${props.cityName} 未来7天天气`,
      top: '2%',
      left: '10%',
      textStyle:{
        color: '#fff'
      }
    },
    tooltip: {
      show: true,
      trigger: 'item',
      formatter: tooltipFormatter,
      position: 'right',

      backgroundColor: '#19E8FE',
      borderColor: '#2B2C7C',
      borderWidth:4,
      textStyle:{
        color: '#575D57'
      }
    },
    legend: {
      show: 'true',
      right: '10%',
      top: '10%',
      textStyle:{
        color: '#fff'
      }
    },
    grid: {
      top: '25%',
      left: '5%',
      right: '5%',
      bottom: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} °C'
      },
    },
    dataset: {
      'source': data
    },
    series: [{
      name: '当日最高气温',
      type: 'bar',
      encode: { x: 'fxDate', y: 'tempMax' },
      barGap: '-100%',
      barWidth: '15',
      itemStyle: {
        color: 'rgba(255,127,36,0.8)',
        shadowColor: 'rgba(0,0,0,0.5)',
        shadowBlur: 5
      },
    },
    {
      name: '当日最低气温',
      type: 'bar',
      barWidth: '15',
      encode: { x: 'fxDate', y: 'tempMin' },
      itemStyle: {
        color: "#5D98CE",
        shadowColor: 'rgba(0,0,0,0.5)',
        shadowBlur: 5
      },
    },
    {
      type: 'effectScatter',
      encode: { x: 'fxDate', y: 'tempMax' },
      symbol: (value: any) => {
        const icon = `${value.iconDay}-fill.svg`
        return 'image://' + svgList.get(icon)
        
      },
      symbolSize:20,
      symbolOffset:[0,-10],
      rippleEffect:{
        number: 0
      }
    }
    ]
    ,
  }
  myEchar.setOption(option)
  window.addEventListener("resize", function () {
   setTimeout(() => {
    myEchar && myEchar.resize();
   }, 400);
})
}

const tooltipFormatter = (params: any) =>{
  return`
  <div style="display: flex;justify-content: space-between; width: 220px; height: 70px;text-align: center;">
    <div style="line-height: 70px;">10-21</div>
    <div style="width: 70px;">
      <div style=" width: 100% ;height: 50px; text-align:center">
        <i class="qi-${params.data.iconDay}-fill" style="font-size: 50px" ></i>
      </div>
      <div>${params.data.textDay}</div>
    </div>
    <div style="display: flex; flex-direction: column;justify-content: space-between; width: 80px;">
      <div>最高${params.data.tempMax}℃</div>
      <div>最低${params.data.tempMin}℃</div>
      <div>${params.data.windDirDay}</div>
    </div>
  </div>
  `
}

watch(() => props.location, async() => {
  weatherMsg = await getweatherMsg()
  drawEchart(weatherMsg)
})


</script>

<template>
  <div class="weatherDay" ref="target"></div>
</template>

<style lang="less" scoped>
.weatherDay {
  width: 100%;
  height: 100%;
}
</style>