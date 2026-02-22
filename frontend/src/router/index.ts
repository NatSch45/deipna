import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import RestaurantSearchView from '@/views/customer/RestaurantSearchView.vue'
import RestaurantDetailView from '@/views/customer/RestaurantDetailView.vue'
import MyReservationsView from '@/views/customer/MyReservationsView.vue'
import DashboardView from '@/views/restaurant/DashboardView.vue'
import FloorPlanEditorView from '@/views/restaurant/FloorPlanEditorView.vue'
import ReservationsCalendarView from '@/views/restaurant/ReservationsCalendarView.vue'
import RestaurantSettingsView from '@/views/restaurant/RestaurantSettingsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/restaurants',
      name: 'restaurants',
      component: RestaurantSearchView,
    },
    {
      path: '/restaurants/:id',
      name: 'restaurant-detail',
      component: RestaurantDetailView,
    },
    {
      path: '/my-reservations',
      name: 'my-reservations',
      component: MyReservationsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true, requiresRestaurant: true },
    },
    {
      path: '/dashboard/floor-plan',
      name: 'floor-plan',
      component: FloorPlanEditorView,
      meta: { requiresAuth: true, requiresRestaurant: true },
    },
    {
      path: '/dashboard/reservations',
      name: 'reservations-calendar',
      component: ReservationsCalendarView,
      meta: { requiresAuth: true, requiresRestaurant: true },
    },
    {
      path: '/dashboard/settings',
      name: 'restaurant-settings',
      component: RestaurantSettingsView,
      meta: { requiresAuth: true, requiresRestaurant: true },
    },
  ],
})

// Navigation guard for authentication
router.beforeEach((to, _from, next) => {
  const isAuthenticated = localStorage.getItem('token') !== null

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
