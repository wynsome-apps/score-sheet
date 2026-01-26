<script setup>
import { RouterLink, RouterView } from 'vue-router'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiHome, mdiPlayCircle, mdiAccountGroup, mdiCardsPlayingOutline } from '@mdi/js'
</script>

<template>
  <main>
    <RouterView />
  </main>

  <nav class="bottom-nav">
    <RouterLink to="/" class="nav-item">
      <svg-icon type="mdi" :path="mdiHome"></svg-icon>
      <span class="nav-label">Home</span>
    </RouterLink>
    <RouterLink to="/play" class="nav-item">
      <svg-icon type="mdi" :path="mdiPlayCircle"></svg-icon>
      <span class="nav-label">Play</span>
    </RouterLink>
    <RouterLink to="/players" class="nav-item">
      <svg-icon type="mdi" :path="mdiAccountGroup"></svg-icon>
      <span class="nav-label">Players</span>
    </RouterLink>
    <RouterLink to="/game-templates" class="nav-item">
      <svg-icon type="mdi" :path="mdiCardsPlayingOutline"></svg-icon>
      <span class="nav-label">Games</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
main {
  padding: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
  min-height: calc(100vh - 70px);
  padding-bottom: 80px; /* Space for bottom nav */
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background-color: #ffffff;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1000;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #6c757d;
  flex: 1;
  padding: 8px 0;
}

.nav-label {
  font-size: 0.75rem;
  margin-top: 4px;
}

.router-link-active {
  color: #42b883;
}

@media (prefers-color-scheme: dark) {
  .bottom-nav {
    background-color: #1a1a1a;
    border-top-color: #333;
  }
}

@media (max-width: 480px) {
  main {
    padding: 1rem;
    padding-bottom: 80px;
  }
}
</style>
