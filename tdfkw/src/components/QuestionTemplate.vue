<script setup>
import { ref } from 'vue'

const questions = ref([
  {
    id: 1,
    type: 'single',
    title: 'Vue.js 是什么类型的框架？',
    options: [
      { id: 'A', text: '后端框架' },
      { id: 'B', text: '前端渐进式框架' },
      { id: 'C', text: '桌面应用框架' },
      { id: 'D', text: '数据库管理框架' },
    ],
  },
  {
    id: 2,
    type: 'multiple',
    title: '以下哪些是 Vue.js 的核心特性？（多选）',
    options: [
      { id: 'A', text: '声明式渲染' },
      { id: 'B', text: '组件系统' },
      { id: 'C', text: '响应式数据绑定' },
      { id: 'D', text: '直接操作 DOM' },
    ],
  },
  {
    id: 3,
    type: 'single',
    title: '在 Vue 3 中，Composition API 的入口函数是？',
    options: [
      { id: 'A', text: 'created' },
      { id: 'B', text: 'mounted' },
      { id: 'C', text: 'setup' },
      { id: 'D', text: 'init' },
    ],
  },
])
</script>
<template>
  <div class="app">
    <div class="subject">
      <div v-for="question in questions" :key="question.id">
        <h2>{{  question.id}} {{  question.title }} </h2>
        <div v-if="question.type === 'single'">
          <div v-for="option in question.options" :key="option.id">
            <label for="">
              <input type="radio" :value="option.id"/>
              {{  option.id }} {{  option.text }}
            </label>
          </div>

        </div>
      </div>
        </div>
      </div>
</template>
