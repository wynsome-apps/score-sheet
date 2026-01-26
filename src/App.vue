<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink> |
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
}

nav {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

main {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.router-link-active {
  font-weight: bold;
  color: #42b883;
}
</style>
