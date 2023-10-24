<script lang="ts" setup>
import getlocation from '@/api/getlocation'

import * as echarts from 'echarts'
import { ref, onMounted, defineEmits, onUnmounted } from 'vue'

const emit = defineEmits(['click-position'])

const target = ref()

// 导入地图
const mapList = new Map()
let globModules = import.meta.glob('../utils/geo/provinceMap/*.json', { eager: true, import: 'default' })
Object.entries(globModules).forEach(async ([path, globModule]) => {
  const pathSplit = path.split('/')
  mapList.set(pathSplit[pathSplit.length - 1], globModule)
})

// 用于管理地图中心位置
let center: number[] = [106.51507490620529, 33.17184987631063]
// 用于管理地图层级,便于下钻返回
interface mapst {
  name: string,
  center: number[]
}
let mapStack: mapst[] = []
// 判断点击的是否是地图
let mapCilckState: boolean = false

onMounted(() => {
  drawMap(target.value, '中国', list)

  // 为地图添加cilckOutSide
  document.addEventListener('click', (el) => {
    const clickOutSide = () => {
      if (!mapCilckState && mapStack.length != 0) {
        const stack: mapst = <mapst>mapStack.pop()
        center = stack.center
        drawMap(target.value, stack.name, stack.name == '中国' ? list : [])
      }
      mapCilckState = false
    }
    clickOutSide()
    onUnmounted(() => {
      document.removeEventListener('click', clickOutSide)
    })
  })
})

const drawMap = async (el: HTMLElement, name: string, data: capital) => {
  const mapJ: any = mapList.get(`${provinceMapList[name]}.json`)

  // 是否显示标签
  const labelShow: boolean = name == '中国' ? false : true

  echarts.registerMap(name, mapJ)
  const mychart: echarts.ECharts = echarts.init(el)

  // 配置地图
  const option: echarts.EChartsOption = {
    grid: {
      top: '0%',
      right: '0%',
      bottom: '0%',
      width: '100%'
    },
    geo: {
      show: true,
      map: name,
      roam: true,
      zoom: 1.5,
      center: center,
      label: {
        show: labelShow,
        color: '#fff',
        position: 'inside'
      },
      itemStyle: {
        areaColor: {
          type: 'radial',
          x: 0.5,
          y: 0.5,
          r: 0.5,
          colorStops: [{
            offset: 0,
            color: 'rgba(147,235,248,0)',
          }, {
            offset: 1,
            color: 'rgba(147,235,248,.2)',
          }],
        },
        borderWidth: 1, // 边框大小
        borderColor: "rgba(104, 152, 190, 1)", // 边框样式
        shadowColor: "rgba(128, 217, 248, 1)", // 阴影颜色
        shadowOffsetX: -2, // 阴影水平方向上的偏移距离
        shadowOffsetY: 2, // 阴影垂直方向上的偏移距离
        shadowBlur: 10, // 文字块的背景阴影长度
      },
      emphasis: {
        itemStyle: {
          areaColor: '#389bb7',
          borderWidth: 0,
        }
      },
    },
    series: [
      {
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: <any>data,
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke'
        },
        label: {
          show: true,
          position: 'bottom',
          formatter: '{@[2]}',
          color: '#fff'
        },
        itemStyle: {
          color: '#20B2AA'
        }
      }
    ]
  }
  mychart.setOption(option)

  // echarts屏幕自适应
  window.addEventListener("resize", function () {
    setTimeout(() => {
      mychart && mychart.resize();
    }, 400);
  })

  // 添加地图点击事件,单击传出经纬度,双击下钻
  mychart.off('click')
  mychart.on('click', params => {
    mapCilckState = true
    console.log('params', params);
    let x: number = 109.43;
    let y: number = 24.33;
    if (params.event) {
      x = params.event.offsetX
      y = params.event.offsetY
    }
    // 将鼠标位置转为经纬度
    let data = mychart.convertFromPixel('geo', [x, y])
    console.log(data);
    emit('click-position', data)

  })
  mychart.off('dblclick')
  mychart.on('dblclick', params => {
    // 如果层级不存在，则退出
    if (!provinceMapList.hasOwnProperty(params.name)) return
    
    // 存储当前层级
    mapStack.push({
      name,
      center
    })
    // 计算中心位置, 将鼠标位置转为经纬度
    let x: number = 109.43;
    let y: number = 24.33;
    if (params.event) {
      x = params.event.offsetX
      y = params.event.offsetY
    }
    const data: number[] = mychart.convertFromPixel('geo', [x, y])
    // 将中心位置设置为点击处
    center = data
    // 重绘地图
    drawMap(el, params.name, [])
  })
  mychart.on('mouseup', () => {
    mapCilckState = true
  })

}

// 全国省份列表
interface MapList {
  [key: string]: string
}
const provinceMapList: MapList = {
  '中国': 'china',
  '北京市': 'beijing',
  '天津市': 'tianjin',
  '河北省': 'hebei',
  '山西省': 'shanxi',
  '内蒙古自治区': 'neimenggu',
  '辽宁省': 'liaoning',
  '吉林省': 'jilin',
  '黑龙江省': 'heilongjiang',
  '上海市': 'shanghai',
  '江苏省': 'jiangsu',
  '浙江省': 'zhejiang',
  '安徽省': 'anhui',
  '福建省': 'fujian',
  '江西省': 'jiangxi',
  '山东省': 'shandong',
  '河南省': 'henan',
  '湖北省': 'hubei',
  '湖南省': 'hunan',
  '广东省': 'guangdong',
  '广西壮族自治区': 'guangxi',
  '海南省': 'hainan',
  '重庆市': 'chongqing',
  '四川省': 'sichuan',
  '贵州省': 'guizhou',
  '云南省': 'yunnan',
  '西藏自治区': 'xizang',
  '陕西省': 'shaanxi',
  '甘肃省': 'gansu',
  '青海省': 'qinghai',
  '宁夏回族自治区': 'ningxia',
  '新疆维吾尔自治区': 'xinjiang'
};

// 各个省份行政中心的位置
interface capital {
  [row: number]: Array<string>;
}
const list: capital = [
  ['123.429092', '41.796768', '沈阳市'],
  ['125.324501', '43.886841', '长春市'],
  ['126.642464', '45.756966', '哈尔滨市'],
  ['116.405289', '39.904987', '北京市'],
  ['117.190186', '39.125595', '天津市'],
  ['111.751990', '40.841490', '呼和浩特市'],
  ['106.232480', '38.486440', '银川市'],
  ['112.549248', '37.857014', '太原市'],
  ['114.502464', '38.045475', '石家庄市'],
  ['117.000923', '36.675808', '济南市'],
  ['113.665413', '34.757977', '郑州市'],
  ['108.948021', '34.263161', '西安市'],
  ['114.298569', '30.584354', '武汉市'],
  ['118.76741', '32.041546', '南京市'],
  ['117.283043', '31.861191', '合肥市'],
  ['121.472641', '31.231707', '上海市'],
  ['112.982277', '28.19409', '长沙市'],
  ['115.892151', '28.676493', '南昌市'],
  ['120.15358', '30.287458', '杭州市'],
  ['119.306236', '26.075302', '福州市'],
  ['113.28064', '23.125177', '广州市'],
  ['121.5200760', '25.0307240', '台北市'],
  ['110.199890', '20.044220', '海口市'],
  ['108.320007', '22.82402', '南宁市'],
  ['106.504959', '29.533155', '重庆市'],
  ['102.71225', '25.040609', '昆明市'],
  ['106.713478', '26.578342', '贵阳市'],
  ['104.065735', '30.659462', '成都市'],
  ['103.834170', '36.061380', '兰州市'],
  ['101.777820', '36.617290', '西宁市'],
  ['91.11450', '29.644150', '拉萨市'],
  ['87.616880', '43.826630', '乌鲁木齐市'],
  ['114.165460', '22.275340', '香港'],
  ['113.549130', '22.198750', '澳门'],
]

// 定位
const getNowPosition = async () => {
  const msg = (await getlocation()).data.result
  emit('click-position', [msg.location.lng.toFixed(2), msg.location.lat.toFixed(2)])
}

</script>

<template>
  <div class="map-body">
    <div ref="target" class="mapEchart">
    </div>
    <img title="定位" @click="getNowPosition" class="button" src="..\\assets\\image\\position.svg" alt="" srcset="">
  </div>
</template>


<style lang="less" scoped>
.mapEchart {
  width: 100%;
  height: 100%;
}

.map-body {
  position: relative;
  width: 100%;
  height: 100%;
}

.button {
  position: absolute;
  top: 0;
  left: 20px;
  width: 30px;
  height: 30px;
}
</style>