<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden"
       style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">

    <!-- Blob mờ đẹp lung linh -->
    <div class="position-absolute top-50 start-50 translate-middle"
         style="width: 800px; height: 800px; background: rgba(255,255,255,0.12); border-radius: 50%; filter: blur(140px);"></div>
    <div class="position-absolute top-0 start-0"
         style="width: 500px; height: 500px; background: rgba(255,255,255,0.08); border-radius: 50%; filter: blur(100px);"></div>

    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-4 col-md-6 col-sm-9 col-11">

          <!-- CARD SIÊU ĐẸP -->
          <div class="card border-0 shadow-2xl rounded-4 overflow-hidden"
               style="background: rgba(255, 255, 255, 0.92); backdrop-filter: blur(20px);">
            
            <!-- Header gradient -->
            <div class="text-center py-5 px-4" style="background: linear-gradient(135deg, #667eea, #764ba2);">
              <div class="d-inline-flex align-items-center justify-content-center rounded-circle shadow-lg mb-4"
                   style="width: 90px; height: 90px; background: rgba(255,255,255,0.2); backdrop-filter: blur(10px);">
                <span class="text-white fw-bold fs-3">VN</span>
              </div>
              <h2 class="text-white fw-bold mb-2">Chào mừng trở lại</h2>
              <p class="text-white opacity-90 mb-0">Đăng nhập để tiếp tục quản lý blog</p>
            </div>

            <div class="card-body p-5 pt-4">

              <!-- Form đăng nhập -->
              <form @submit.prevent="handleSubmit" class="needs-validation" novalidate>
                
                <!-- Email -->
                <div class="mb-4">
                  <label for="email" class="form-label fw-semibold text-dark mb-2">Email</label>
                  <div class="input-group input-group-lg">
                    <span class="input-group-text bg-white border-end-0">
                      <i class="bi bi-envelope"></i>
                    </span>
                    <input 
                      type="email" 
                      id="email"
                      class="form-control border-start-0 ps-0 shadow-sm" 
                      style="height: 58px;"
                      v-model="form.email" 
                      placeholder="you@example.com" 
                      required 
                    />
                  </div>
                </div>

                <!-- Password -->
                <div class="mb-4">
                  <label for="password" class="form-label fw-semibold text-dark mb-2">Mật khẩu</label>
                  <div class="input-group input-group-lg">
                    <span class="input-group-text bg-white border-end-0">
                      <i class="bi bi-lock"></i>
                    </span>
                    <input 
                      type="password" 
                      id="password"
                      class="form-control border-start-0 ps-0 shadow-sm" 
                      style="height: 58px;"
                      v-model="form.password" 
                      placeholder="Nhập mật khẩu" 
                      required 
                    />
                  </div>
                </div>

                <!-- Nút đăng nhập -->
                <button 
                  type="submit" 
                  class="btn btn-lg w-100 fw-bold rounded-4 shadow-lg d-flex align-items-center justify-content-center gap-3"
                  style="height: 58px; background: linear-gradient(135deg, #667eea, #764ba2); border: none; color: white;"
                  :disabled="isLoading"
                  :class="{ 'opacity-75': isLoading }"
                >
                  <div class="spinner-border spinner-border-sm text-white" v-if="isLoading"></div>
                  <span>{{ isLoading ? 'Đang đăng nhập...' : 'Đăng nhập ngay' }}</span>
                  <i class="bi bi-arrow-right fs-5" v-if="!isLoading"></i>
                </button>
              </form>

              <!-- Đăng ký -->
              <div class="text-center mt-5">
                <span class="text-muted">Chưa có tài khoản?</span>
                <router-link 
                  to="/register" 
                  class="fw-bold ms-2 text-decoration-none"
                  style="color: #667eea;"
                >
                  Đăng ký miễn phí
                  <i class="bi bi-arrow-right-short"></i>
                </router-link>
              </div>
            </div>
          </div>

          <!-- Footer nhỏ xinh -->
          <p class="text-center text-white mt-4 opacity-70 small">
            © 2025 Blog Của Tôi • Made with Đỗ Văn Nghĩa <span class="text-danger">❤️</span> 
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, computed, type Ref } from 'vue'
const emit = defineEmits<{ login: [user: any] }>()

const allData = inject('allData') as Ref<any[]>
const showToast = inject('showToast')! as (msg: string, type?: string) => void

const form = ref({ email: '', password: '' })
const isLoading = ref(false)

const users = computed(() => {
  const data = allData.value ?? []
  return Array.isArray(data) ? data.filter((u: any) => u.type === 'user') : []
})

function handleSubmit() {
  if (!form.value.email || !form.value.password) return

  isLoading.value = true

  setTimeout(() => {
    const user = users.value.find(
      (u: any) => u.email === form.value.email && u.password === form.value.password
    )

    if (user) {
      showToast(`Chào mừng trở lại, ${user.username || user.email}!`, 'success')
      emit('login', user)
      form.value = { email: '', password: '' }
    } else {
      showToast('Email hoặc mật khẩu không đúng!', 'error')
    }
    isLoading.value = false
  }, 1000)
}
</script>

<style scoped>
/* Focus đẹp như app xịn */
.form-control:focus,
.input-group-text {
  box-shadow: 0 0 0 0.25rem rgba(102, 126, 234, 0.25) !important;
  border-color: #667eea !important;
}

/* Nút hover mượt */
.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4) !important;
  transition: all 0.3s ease;
}

/* Card shadow đậm hơn */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
/* Icon trong input group */
.input-group-text {
  background: white !important;
  color: #667eea;
}
</style>