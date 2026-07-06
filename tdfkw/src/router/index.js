import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/start',
      name: 'start',
      component: () => import('../views/StartView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/whitelist',
      name: 'whitelist',
      component: () => import('../views/WhitelistView.vue'),
    },
    {
      path: '/dashboard',
      component: () => import('../views/DashboardView.vue'),
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('../views/DashboardHomeView.vue'),
        },
        {
          path: 'userdata',
          redirect: '/dashboard',
        },
        {
          path: 'files',
          name: 'files',
          component: () => import('../views/FilesView.vue'),
        },
        {
          path: 'server',
          name: 'server',
          component: () => import('../views/ServerStatusView.vue'),
        },
        {
          path: 'projects',
          name: 'projects',
          component: () => import('../views/ProjectsView.vue'),
        },
      ],
    },
    {
      path: '/userdata',
      redirect: '/dashboard/userdata',
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue'),
    },
  ],
})

export default router
