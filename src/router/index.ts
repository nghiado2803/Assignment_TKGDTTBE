import { createRouter, createWebHistory } from 'vue-router'
// Sử dụng đường dẫn tương đối:
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import CreatePost from '../views/CreatePost.vue'
import EditPost from '../views/EditPost.vue'
import PostDetail from '../views/PostDetail.vue'
import Profile from '../views/Profile.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login, meta: { requiresGuest: true }, props: true },
  { path: '/register', name: 'Register', component: Register, meta: { requiresGuest: true }, props: true },
  { path: '/home', name: 'Home', component: Home, meta: { requiresAuth: true }, props: true },
  { path: '/create-post', name: 'CreatePost', component: CreatePost, meta: { requiresAuth: true }, props: true },
  { path: '/edit-post/:id', name: 'EditPost', component: EditPost, meta: { requiresAuth: true }, props: true },
  { path: '/post/:id', name: 'PostDetail', component: PostDetail, meta: { requiresAuth: true }, props: true },
  { path: '/profile', name: 'Profile', component: Profile, meta: { requiresAuth: true }, props: true },
  { path: '/:pathMatch(.*)*', redirect: '/home' }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

export default router