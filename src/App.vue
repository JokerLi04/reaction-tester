<template>
  <div>
    <span>{{ prompt_txt }}</span>
    <button @click="clickToState">
      {{ button_txt }}
    </button>
  </div>
</template>

<script setup lang="js">
import { computed, ref } from "vue";

const averageReactionTime = ref(0); // 平均反应时间
let currentTestTimes = 0; // 当前测试轮数，共5轮
let timerId = null; // 计时器
// 状态
const state = {
  IDLE: "idle", // 空闲
  WAITING: "waiting", // 等待
  READY: "ready", // 就绪
  ACTIVE: "active", // 活跃
  FINISHED: "finished", // 完成
  CHECK: "check", // 查看结果
};
const currentState = ref(state.IDLE); // 初始状态
// 提示文本
const prompt_txt = computed(() => {
  switch (currentState.value) {
    case state.IDLE:
      return `测试方法：点击“开始测试”后，等待页面变化瞬间点击按钮，测试共5轮`;
    case state.WAITING:
      return `变化随时会出现（已经出现了${currentTestTimes}轮）`;
    case state.READY:
      return `快点击！`;
    case state.ACTIVE:
      return `这么厉害！竟然被你看到了`;
    case state.FINISHED:
      return `测试完成，点击“查看结果”查看测试结果`;
    case state.CHECK:
      return `5轮测试的平均反应时间：${averageReactionTime.value}ms`;
    default:
      return "你误入了异度空间，请点击“刷新”按钮";
  }
});
// 按钮描述
const button_txt = computed(() => {
  switch (currentState.value) {
    case state.IDLE:
      return `开始测试`;
    case state.WAITING:
      return `等待变化`;
    case state.READY:
      return `点击！`;
    case state.ACTIVE:
      return `承让`;
    case state.FINISHED:
      return `查看结果`;
    case state.CHECK:
      return `再来一次`;
    default:
      return "刷新";
  }
});

const timingRecord = []; // 记录的反应时间列表
let clickTime; // 点击的时间
let startTime; // 开始计算的时间

// 处理状态
const handleStateChange = (status) => {
  switch (status) {
    case state.IDLE:
      currentState.value = state.IDLE;
      break;
    case state.WAITING:
      currentState.value = state.WAITING;
      const randomTime = Math.trunc(Math.random() * 500 + 1750);
      timerId = setTimeout(() => {
        // 等待 -> 就绪
        timerId = null;
        handleStateChange(state.READY);
      }, randomTime);
      break;
    case state.READY:
      currentState.value = state.READY;
      startTime = Number(new Date());
      break;
    case state.ACTIVE:
      currentState.value = state.ACTIVE;
      setTimeout(() => {
        if (currentTestTimes < 5) handleStateChange(state.WAITING);
        else {
          if (timingRecord.length < 5) handleStateChange("");
          let totalReactionTime = 0;
          for (let i = 0; i < timingRecord.length; i++)
            totalReactionTime += timingRecord[i];
          averageReactionTime.value = Math.trunc(totalReactionTime / 5);
          timingRecord.splice(0, timingRecord.length);
          handleStateChange(state.FINISHED);
        }
      }, 50);
      break;
    case state.FINISHED:
      currentState.value = state.FINISHED;
      break;
    case state.CHECK:
      currentState.value = state.CHECK;
      break;
    default:
      currentState.value = "";
      return;
  }
};

// 点击执行逻辑
const clickToState = () => {
  switch (currentState.value) {
    case state.IDLE:
      // 空闲 -> 等待
      handleStateChange(state.WAITING);
      break;
    case state.WAITING:
      clearTimeout(timerId);
      alert("提前点击，这轮测试无效");
      handleStateChange(state.WAITING);
      break;
    case state.READY:
      clickTime = Number(new Date());
      const currentReactTime = clickTime - startTime;
      timingRecord.push(currentReactTime);
      currentTestTimes += 1;
      handleStateChange(state.ACTIVE);
      break;
    case state.ACTIVE:
      break;
    case state.FINISHED:
      handleStateChange(state.CHECK);
      break;
    case state.CHECK:
      handleStateChange(state.IDLE);
      break;
    default:
      handleStateChange(state.IDLE);
  }
};
</script>

<style></style>
