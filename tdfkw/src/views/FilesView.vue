<script setup>
import { ref } from 'vue';
const files = ref([{ id: 1, name: '名字', introduction: '介绍' }])
</script>
<template>
  <div class="files-page">
    <!-- <h2>档案</h2> -->
    <div class="search-card">
      <input class="search-box" type="text" placeholder="搜索名称" />
      <input class="btn-search" type="button" value="搜索" />
    </div>
    <div class="information" v-for="value in files" :key="value.id">
      <div class="card information-card">
        <div class="a">
          <img src="" alt="档案图片" />
        </div>
        <div class="b">
          <h3>{{ value.name }}</h3>
          <p>{{ value.introduction }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.files-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.files-page h2 {
  font-size: 1.5rem;
}

.search-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}

search-box {
  width: 100%;
  /* margin-bottom: var(--space-md); */
}

.btn-search {
  margin-left: var(--space-sm);
  border-radius: var(--radius-sm);
  border: solid var(--color-border) 1px;
  padding: var(--space-sm);
  background-color: var(--color-bg);
}

.information-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 80%;
  /* padding:var(--space-sm); */
}

.information-card p {
  color: var(--color-text-secondary);
}

.information-card img {
  width: 160px;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: var(--radius-sm);
}

.information {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: var(--space-md);
}
</style>
