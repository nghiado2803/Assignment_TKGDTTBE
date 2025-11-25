<template>
  <!-- Navbar chỉ hiện khi KHÔNG phải trang login/register -->
 <Navbar
  v-if="$route.path !== '/login' && $route.path !== '/register'"
  @logout="handleLogout"
/>

  <!-- Main content -->
  <main class="main-content"
        :class="{ 'auth-page': isAuthPage }">
    <router-view
      @login="handleLogin"
      @register="handleRegister"
      @update-profile="handleProfileUpdate"
      @create-post="handleCreatePost"
      @update-post="handleUpdatePost"
      @delete-post="handleDeletePost"
      @create-comment="handleCreateComment"
    />
  </main>
</template>

<script setup lang="ts">
import { ref, computed, provide, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'

const router = useRouter()
const route = useRoute()

// === DỮ LIỆU CHUNG CHO TOÀN APP ===
const allData = ref<any[]>([])

// ← ĐÂY LÀ DÒNG QUAN TRỌNG NHẤT: currentUser là computed → TỰ ĐỘNG UPDATE KHI allData THAY ĐỔI
const currentUser = computed(() => 
  allData.value.find(u => u.type === 'user' && u.isLoggedIn) || null
)

// === CUNG CẤP CHO TOÀN BỘ COMPONENT CON ===
provide('allData', allData)
provide('currentUser', currentUser)  // ← Đây là ref reactive thật sự!
provide('showToast', () => {})       // Im lặng như mày muốn

// === Helper: Kiểm tra trang login/register để bỏ padding và background ===
const isAuthPage = computed(() => 
  route.path === '/login' || route.path === '/register'
)

// === Các handler ===
const handleLogin = (user: any) => {
  // Đánh dấu user này là đã đăng nhập
  const userIndex = allData.value.findIndex(u => u.__backendId === user.__backendId)
  if (userIndex !== -1) {
    allData.value[userIndex].isLoggedIn = true
  }
  router.push('/home')
}

const handleLogout = () => {
  if (currentUser.value) {
    const userIndex = allData.value.findIndex(u => u.__backendId === currentUser.value.__backendId)
    if (userIndex !== -1) {
      allData.value[userIndex].isLoggedIn = false
    }
  }
  router.push('/login')
}

const handleRegister = () => {
  router.push('/login')
}

const handleProfileUpdate = () => {
  // Không cần làm gì cả – currentUser là computed → tự động update khi allData thay đổi
}

const handleCreatePost = () => { }
const handleUpdatePost = () => { }
const handleDeletePost = () => { }
const handleCreateComment = () => { }
</script>

<style scoped>
#app {
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.main-content {
  flex: 1;
  min-height: 100vh;
  background: transparent !important;
  transition: padding-top 0.4s ease;
}

/* Bỏ padding khi ở trang login/register */
:deep(.auth-page) {
  padding-top: 0 !important;
}
</style>