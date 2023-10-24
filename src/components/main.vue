<script lang="ts" setup>
import Mapchart from '@/view/map.vue'
import Weather24H from '@/view/weather24H.vue'
import Weather7D from '@/view/weather7D.vue'
import Warning from '@/view/warning.vue';
import livingIndex from '@/view/livingIndex.vue'
import Air from '@/view/Air.vue';
import getlocation from '@/api/getlocation'

import { ref, type Ref, watch } from 'vue';

import getCityMsg from '@/api/getCityMsg'

// 当前经纬度
const position: Ref<Array<number>> = ref([])

// 定位
const getNowPosition = async () => {
  const msg = (await getlocation()).data.result
  return [msg.location.lng.toFixed(2), msg.location.lat.toFixed(2)]
}
position.value = await getNowPosition()

// 接收地图点击等传出的坐标
const emitValue = (data: Array<number>) => {
  position.value = data
}

// 获取城市名称和id
const location: Ref<string> = ref('')
const cityName: Ref<string> = ref('')
const cityMsg = async () => {
  const msg = (await getCityMsg(position.value))
  //  console.log(msg.data.location[0].name);
  location.value = msg.data.location[0].id
  // 如果上级行政和前城市相同，就只取一个
  if (msg.data.location[0].name == msg.data.location[0].adm2) {
    cityName.value = msg.data.location[0].name
    return
  }
  cityName.value = msg.data.location[0].adm2 + '市' + msg.data.location[0].name
}
await cityMsg()

// 当坐标变化时，重新获取城市信息
watch(position, async () => {
  await cityMsg()
})

</script>

<template>
  <div class="main">
    <div class="left">
      <div class="temp">
        <Weather24H :location="location" :cityName="cityName" />
      </div>
      <div class="temp-recent">
        <Weather7D :location="location" :cityName="cityName" />
      </div>
    </div>
    <div class="middle">
      <div class="warning">
        <Warning :location="location" />
      </div>
      <div class="bottom">
        <div class="map">
          <Mapchart @click-position="emitValue" />
        </div>
        <div class="bottom-right">
          <div class="livingIndex"> <livingIndex :location="location" /> </div>
          <div class="allWarning">
            <Air :location="location" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.main {
  display: flex;
  height: 100vh;
  background-image: url('@/assets/image/bg.png');
  justify-content: space-between;

  .left {
    min-width: 588px;
    // border: 1px solid #ADD8E6;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .temp {
      height: 47%;
      background-color: rgba(30, 41, 59, 0.3);
    }

    .temp-recent {
      height: 47%;
      width: 100%;
      background-color: rgba(30, 41, 59, 0.3);
    }
  }

  .middle {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    min-width: 1304px;

    // border: 1px solid #ADD8E6;
    .warning {
      height: 15%;
      // border-bottom: 1px solid #ADD8E6;
      background-color: rgba(30, 41, 59, 0.3);
    }

    .bottom {
      display: flex;
      justify-content: space-around;
      height: 80%;

      .map {
        width: 920px;
        // margin-top: 5%;
        background-color: rgba(30, 41, 59, 0.3);
      }

      .bottom-right {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        height: 100%;
        width: 364px;

        .livingIndex {
          height: 48%;
          width: 100%;
          background-color: rgba(30, 41, 59, 0.3);
        }

        .allWarning {
          height: 48%;
          background-color: rgba(30, 41, 59, 0.3);
        }

      }
    }


  }
}
</style>