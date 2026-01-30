import { createRouter, createWebHistory } from 'vue-router'
import PokemonGame from '../modules/pokemon/pages/PokemonGame.vue'
import MenuPage from '../modules/pokemon/pages/MenuPage.vue'

const routes = [
  {
    path: '/',
    name: 'Menu',
    component: MenuPage
  },
  {
    path: '/game',
    name: 'PokemonGame',
    component: PokemonGame
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
