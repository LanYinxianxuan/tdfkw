<script setup>
import { RouterLink } from 'vue-router'
</script>
<template>
  <nav>
    <div class="logo">
      <RouterLink to="/">
        <img src="../assets/logo.svg" alt="logo" />
      </RouterLink>
    </div>
    <div class="nav">
      <ul>
        <li>
          <a href="/docs/index.md" target="_blank" rel="noopener noreferrer">
            <svg t="1748073854834" class="icon" viewBox="0 0 1024 1024" width="15" height="15">
              <path
                d="M537.152 414.72h-288.64a29.44 29.44 0 0 1-26.24-30.72 29.44 29.44 0 0 1 26.24-32h288.64a29.44 29.44 0 0 1 26.24 32 29.44 29.44 0 0 1-26.24 30.72z m209.92 165.76h-498.56a32.64 32.64 0 0 1 0-64h498.56a32.64 32.64 0 0 1 0 64z m0 165.76h-498.56a32.64 32.64 0 0 1 0-64h498.56a32.64 32.64 0 0 1 0 64z"
                fill="#000000"
              ></path>
              <path
                d="M192.832 0a128 128 0 0 0-128 128v768a128 128 0 0 0 128 128h640a128 128 0 0 0 128-128l7.04-670.72L748.992 0h-556.16z m512 64l192 192h-160.64a31.36 31.36 0 0 1-31.36-31.36V64z m128 896h-640a64 64 0 0 1-64-64V128a64 64 0 0 1 64-64h448v192a64 64 0 0 0 64 64h192v576a64 64 0 0 1-64 64z"
                fill="#000000"
              ></path></svg
            ><span>文档中心</span></a
          >
        </li>
        <li>
          <RouterLink to="/contact">
            <svg t="1748147498903" class="icon" viewBox="0 0 1024 1024" width="20" height="20">
              <path
                d="M824.8 613.2c-16-51.4-34.4-94.6-62.7-165.3C766.5 262.2 689.3 112 511.5 112 331.7 112 256.2 265.2 261 447.9c-28.4 70.8-46.7 113.7-62.7 165.3-34 109.5-23 154.8-14.6 155.8 18 2.2 70.1-82.4 70.1-82.4 0 49 25.2 112.9 79.8 159-26.4 8.1-85.7 29.9-71.6 53.8 11.4 19.3 196.2 12.3 249.5 6.3 53.3 6 238.1 13 249.5-6.3 14.1-23.8-45.3-45.7-71.6-53.8 54.6-46.2 79.8-110.1 79.8-159 0 0 52.1 84.6 70.1 82.4 8.5-1.1 19.5-46.4-14.5-155.8z"
                fill="#000000"
              ></path>
            </svg>
            <span>联系我们</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/about">
            <svg t="1748148277373" class="icon" viewBox="0 0 1024 1024" width="22" height="22">
              <path
                d="M469.333333 597.333333v-85.333333h-42.666666v-85.333333h128v170.666666h42.666666v85.333334h-170.666666v-85.333334h42.666666z m42.666667 256c-187.733333 0-341.333333-153.6-341.333333-341.333333s153.6-341.333333 341.333333-341.333333 341.333333 153.6 341.333333 341.333333-153.6 341.333333-341.333333 341.333333z m0-85.333333c140.8 0 256-115.2 256-256s-115.2-256-256-256-256 115.2-256 256 115.2 256 256 256z m42.666667-469.333333v85.333333h-85.333334V298.666667h85.333334z"
                fill="#000000"
              ></path>
            </svg>
            <span>关于</span>
          </RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>
<style>
nav {
  box-shadow: 0 0 1em #00000020;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
img {
  height: 4em;
}
.nav ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  justify-content: flex-end;
}
.nav li {
  margin-left: 1em;
}
.nav a {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
  position: relative;
  padding-bottom: 5px;
}
.nav a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #000;
  transition: width 0.3s ease;
}
.nav a:hover::after {
  width: 100%;
}
.nav .icon {
  margin-right: 0.5em;
}
</style>
