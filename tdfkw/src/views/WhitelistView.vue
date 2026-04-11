<script setup>
import QuestionTemplate from '@/components/QuestionTemplate.vue';

</script>
<template>
    <AppNav />
    <div class="app">
        <div class="subject">
            <QuestionTemplate />
        </div>
        <RouterLink to="/start">前往注册</RouterLink>
    </div>
</template>