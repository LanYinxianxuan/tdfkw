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
  border-radius: var(--radius-lg);
  text-decoration: none;
  font-size: 0.95rem;
  transition: background 0.2s;
}

@keyframes amplify
{
    from {padding: 0.7rem 2.5rem; font-size: 0.95rem;}
    to {padding: 0.9rem 2.7rem; font-size: 1.15rem;}
}
 
@-webkit-keyframes amplify
{
    from {padding: 0.7rem 2.5rem; font-size: 0.95rem;}
    to {padding: 0.9rem 2.7rem; font-size: 1.15rem;}
}

.card a:hover {
  background: var(--color-accent-hover);
  box-shadow: var(--animation-shadow-hover);
  animation: amplify 0.3s ease forwards;
  -webkit-animation: amplify 0.3s ease forwards;
}
</style>
