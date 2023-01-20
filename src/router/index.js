import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/admin/products',
    name: 'products',
    component: () => import('../views/ProductsView.vue')
  },
  {
    path: '/admin/products/:id',
    name: 'productsPage',
    component: () => import('../views/ProductsView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  linkActiveClass: 'active',
  routes
})

export default router
