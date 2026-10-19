<template>
  <span>{{ currentPrompt_txt }}</span>
  <button @click="clickToState(currentState)">
    {{ currentButton_txt }}
  </button>
</template>

<script setup lang="js">
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";

let currentTestTimes = 0; // 当前测试次数
const currentTiming = ref(0); // 单次的反应时间
const reactionTime = ref(0); // 平均反应时间
let timer = null; // 计时器
// 状态
const state = {
  IDLE: "idle",
  WAITING: "waiting",
  READY: "ready",
  ACTIVE: "active",
  FINISHED: "finished",
};
// 提示文本
const prompt_txt = {
  idle: `测试方法：点击“开始测试”后，等待页面变化瞬间点击按钮，测试共5次`,
  waiting: `变化随时会来（已经来了${currentTestTimes}次）`,
  ready: "别看了，快点击",
  active: "这么厉害！竟然被你看到了",
  finished: `平均反应时间：${reactionTime.value}ms`,
};
// 按钮描述
const button_txt = {
  idle: "开始测试",
  waiting: "等待变化",
  ready: "点击！",
  active: "承让",
  finished: "再来一次",
};
const currentState = ref(state.IDLE); // 初始状态
// 记录计时
const timingRecord = reactive({
  first: "",
  second: "",
  third: "",
  fourth: "",
  fifth: "",
});
// 状态变化
const handleStateChange = (status) => {
  switch (status) {
    case state.IDLE:
      currentState.value = state.WAITING;
      break;
    case state.WAITING:
      if (currentTestTimes < 5) {
        currentState.value = state.ACTIVE;
        currentTestTimes++;
      } else {
        currentState.value = state.FINISHED;
        currentTestTimes = 0;
      }
      break;
    case state.READY:
      currentState.value = state.READY;
    case state.ACTIVE:
      currentState.value = state.WAITING;
      break;
    case state.FINISHED:
      currentState.value = state.IDLE;
      break;
    default:
      return;
  }
};
// 状态对应的文本
const currentPrompt_txt = computed(() => prompt_txt[currentState.value]);
const currentButton_txt = computed(() => button_txt[currentState.value]);
// active状态的处理
const handleActiveState = () => {
  clearTimeout(timer);
  timer = window.setTimeout(handleStateChange(state.WAITING), 100);
};
// 点击对应函数
const clickToState = (status) => {
  if (!status) return;
  if (status != state.ACTIVE) {
    return handleStateChange(currentState.value);
  } else return handleActiveState;
};
// 清理副产物
onUnmounted(() => {
  if (timer) {
    clearTimeout(timer);
  }
});
</script>

<style></style>
