<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink> |
      <RouterLink to="/play">Play</RouterLink> |
      <RouterLink to="/players">Players</RouterLink> |
      <RouterLink to="/game-templates">Templates</RouterLink> |
      <RouterLink to="/about">About</RouterLink>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
header {
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  position: sticky;
  top: 0;
  z-index: 100;
}

nav {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

main {
  padding: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
  min-height: calc(100vh - 80px);
}

@media (prefers-color-scheme: dark) {
  header {
    background-color: #1a1a1a;
    border-bottom-color: #333;
  }
}

@media (max-width: 480px) {
  main {
    padding: 1rem;
  }
  nav {
    gap: 0.5rem;
  }
}

.router-link-active {
  font-weight: bold;
  color: #42b883;
}
</style>
