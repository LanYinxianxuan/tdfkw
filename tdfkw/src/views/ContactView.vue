<script setup>
</script>

<template>
  <AppNav />
  <div class="card">
    <h3>QQ群</h3>
    <p></p>
    <div class="action">
      <a href="https://qm.qq.com/q/rmjRaGFt0O" target="_blank">加入QQ群</a>
    </div>
  </div>
</template>

<style scoped>
.card {
  max-width: 400px;
  margin: 10vh auto;
  padding: 2.5rem;
  background: var(--color-bg);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  text-align: center;
}

.card h3 {
  font-size: 1.3rem;
}

.card .action {
  margin-top: 1.5rem;
}

.card a {
  display: inline-block;
  padding: 0.7rem 2rem;
  background: var(--color-accent);
  color: var(--color-bg);
  border-radius: var(--radius-sm);
  text-decoration: none;
  font-size: 0.95rem;
  transition: background 0.2s;
}

.card a:hover {
  background: var(--color-accent-hover);
}
</style>
