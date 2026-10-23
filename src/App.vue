<template>
  <div class="reaction-container" :class="currentState">
    <span class="prompt-text">{{ prompt_txt }}</span>
    <button class="action-button" :class="currentState" @click="clickToState">
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

<style scoped>
/* ---------- 全局 & 容器 ---------- */
.reaction-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  font-family:
    system-ui,
    -apple-system,
    "Segoe UI",
    Roboto,
    Helvetica,
    Arial,
    sans-serif;
  background-color: #f5f7fa; /* 默认浅灰背景 */
  transition: background-color 0.25s ease;
}

/* 手机端适配：小屏时内边距稍减 */
@media (max-width: 480px) {
  .reaction-container {
    padding: 16px;
  }
}

/* ---------- 提示文本 ---------- */
.prompt-text {
  font-size: 1.1rem;
  line-height: 1.5;
  text-align: center;
  max-width: 90%;
  margin-bottom: 28px;
  color: #1e293b;
  word-break: break-word;
  transition: color 0.2s ease;
}

@media (max-width: 480px) {
  .prompt-text {
    font-size: 1rem;
    margin-bottom: 20px;
  }
}

/* ---------- 按钮 ---------- */
.action-button {
  padding: 16px 40px;
  font-size: 1.4rem;
  font-weight: 600;
  border: none;
  border-radius: 60px;
  cursor: pointer;
  color: #fff;
  background-color: #3b82f6; /* 默认蓝 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition:
    background-color 0.2s ease,
    transform 0.1s ease,
    box-shadow 0.2s ease;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  letter-spacing: 0.5px;
  min-width: 200px;
  text-align: center;
}

/* 手机端按钮稍小一点 */
@media (max-width: 480px) {
  .action-button {
    padding: 14px 28px;
    font-size: 1.2rem;
    min-width: 160px;
  }
}

/* 按钮按下效果 (仅视觉反馈，不影响逻辑) */
.action-button:active {
  transform: scale(0.97);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

/* 按钮禁用样式 (如果有) */
.action-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ---------- 状态驱动样式 ---------- */

/* 等待状态：整个页面背景变深/变暗，按钮变灰，提示文字变白——营造“等待变化”氛围 */
.reaction-container.waiting {
  background-color: #1e293b; /* 深蓝灰 */
}
.reaction-container.waiting .prompt-text {
  color: #e2e8f0; /* 浅灰白文字 */
}
.reaction-container.waiting .action-button {
  background-color: #475569; /* 暗灰蓝 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  cursor: default; /* 等待时按钮点击会重置，但视觉上可以展示为普通状态 */
}

/* 就绪状态：页面背景变为醒目的亮黄/橙色，按钮变为高对比亮色，提示文字深色——强烈暗示“立刻点击” */
.reaction-container.ready {
  background-color: #fbbf24; /* 琥珀黄 */
}
.reaction-container.ready .prompt-text {
  color: #0f172a; /* 深黑蓝，更醒目 */
  font-weight: 700;
  font-size: 1.4rem; /* 稍微加大 */
}
@media (max-width: 480px) {
  .reaction-container.ready .prompt-text {
    font-size: 1.25rem;
  }
}
.reaction-container.ready .action-button {
  background-color: #dc2626; /* 红色，醒目 */
  box-shadow: 0 6px 16px rgba(220, 38, 38, 0.4);
  transform: scale(1.02); /* 轻微放大，吸引点击 */
  animation: pulse 0.8s infinite alternate; /* 脉动效果加强“点击”暗示 */
}
/* 脉动动画 */
@keyframes pulse {
  from {
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
    transform: scale(1);
  }
  to {
    box-shadow: 0 8px 24px rgba(220, 38, 38, 0.6);
    transform: scale(1.04);
  }
}

/* 活跃状态：点击后恢复浅色背景，按钮变为绿色表示成功 */
.reaction-container.active {
  background-color: #f5f7fa; /* 恢复默认 */
}
.reaction-container.active .prompt-text {
  color: #1e293b;
}
.reaction-container.active .action-button {
  background-color: #10b981; /* 成功绿 */
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

/* 完成状态：背景变浅蓝，按钮变为蓝色 */
.reaction-container.finished {
  background-color: #e0f2fe; /* 非常浅的蓝 */
}
.reaction-container.finished .prompt-text {
  color: #0369a1;
}
.reaction-container.finished .action-button {
  background-color: #0284c7;
}

/* 查看结果状态：背景浅紫，按钮紫色 */
.reaction-container.check {
  background-color: #ede9fe; /* 浅紫 */
}
.reaction-container.check .prompt-text {
  color: #5b21b6;
  font-weight: 600;
}
.reaction-container.check .action-button {
  background-color: #7c3aed;
}

/* 空闲状态：可以保持默认 */
.reaction-container.idle {
  background-color: #f5f7fa;
}

/* 默认状态兜底 (如状态为空字符串) */
.reaction-container:not(.idle):not(.waiting):not(.ready):not(.active):not(
    .finished
  ):not(.check) {
  background-color: #f5f7fa;
}
</style>
