<script  lang="ts" setup>
import getWarting from '@/api/getWarning'
import type { weatherWaring } from '@/types/index'

import { type Ref, ref, watch, computed } from 'vue';

const props = defineProps<{
  'location': string
}>()

// 获取预警信息
const getWartingMsg = async (): Promise<weatherWaring[]> => {
  const msg: weatherWaring[] = (await getWarting(props.location)).data.warning
  console.log(await getWarting(props.location));
  return msg
}
const warningMsg: Ref<weatherWaring[]> = ref(await getWartingMsg())

// 当地点变化后重新获取信息
watch(() => props.location, async () => {
  warningMsg.value = await getWartingMsg()
  console.log('预警',warningMsg.value);
})

// 警告图标
const warningIcon = computed(() => {
  return 'qi-' + warningMsg.value[0].type
})
</script>

<template>
  <div class="waring-body">
    <div class="warting" v-if="warningMsg.length != 0">
      <i :class="warningIcon" class="icon"></i>
      <div class="warning-msg">
        <div class="tilte"> {{ warningMsg[0].title }} :</div>
        <div class="content"> {{ warningMsg[0].text}} </div>
      </div>
    </div>
    <div class="nowarting" v-if="warningMsg.length == 0">该地区暂无预警</div>
  </div>
</template>

<style lang="less" scoped>
.waring-body {
  padding: 12px;
  font-size: 18px;
  font-weight: 700;
  font-family: "微软雅黑";
  color: #fff;
}
.warting{
  display: flex;
  // justify-content: space-between;
  align-items: center;
}

.icon {
  height: 100%;
  color: v-bind('warningMsg[0]?.severityColor');
  font-size: 70px;
}
.warning-msg{
  margin-left: 20px;
}

.content {
  margin-top: 8px;
  text-indent: 2em
}
</style>