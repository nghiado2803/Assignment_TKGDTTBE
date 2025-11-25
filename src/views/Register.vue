<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden"
       style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">

    <!-- Hiệu ứng kính mờ + blob -->
    <div class="position-absolute top-50 start-50 translate-middle"
         style="width: 800px; height: 800px; background: rgba(255,255,255,0.12); border-radius: 50%; filter: blur(140px);"></div>
    <div class="position-absolute bottom-0 end-0"
         style="width: 600px; height: 600px; background: rgba(255,255,255,0.08); border-radius: 50%; filter: blur(120px);"></div>

    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7 col-sm-10">

          <!-- CARD SIÊU XỊN -->
          <div class="card border-0 shadow-2xl rounded-4 overflow-hidden"
               style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px);">

            <!-- Header gradient -->
            <div class="text-center py-5 px-4" style="background: linear-gradient(135deg, #667eea, #764ba2);">
              <div class="d-inline-flex align-items-center justify-content-center rounded-circle shadow-lg mb-4"
                   style="width: 90px; height: 90px; background: rgba(255,255,255,0.25); backdrop-filter: blur(10px);">
                <span class="text-white fw-bold fs-3">VN</span>
              </div>
              <h2 class="text-white fw-bold mb-2">Tạo tài khoản mới</h2>
              <p class="text-white opacity-90 mb-0">Tham gia cộng đồng blog ngay hôm nay!</p>
            </div>

            <div class="card-body p-5 pt-4">

              <!-- Form đăng ký -->
              <form @submit.prevent="handleSubmit" class="needs-validation" novalidate>

                <!-- Ảnh đại diện – Click để upload (như Facebook) -->
                <div class="text-center mb-5 position-relative">
                  <label for="avatar-upload" class="d-block" style="cursor: pointer;">
                    <div class="position-relative d-inline-block">
                      <img 
                        :src="previewAvatar || defaultAvatar"
                        class="rounded-circle border border-5 border-white shadow-lg hover-lift"
                        width="140" height="140"
                        style="object-fit: cover; transition: all 0.3s;"
                        alt="Avatar"
                      />
                      <div class="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-3 shadow hover-scale">
                        <i class="bi bi-camera-fill fs-4"></i>
                      </div>
                    </div>
                  </label>
                  <input 
                    id="avatar-upload"
                    type="file" 
                    accept="image/*" 
                    class="d-none" 
                    @change="handleFileChange"
                  />
                  <p class="mt-3 text-muted small mb-0">Nhấn vào ảnh để tải lên</p>
                </div>

                <div class="row g-3">
                  <!-- Tên người dùng -->
                  <div class="col-12">
                    <label class="form-label fw-semibold">Tên người dùng</label>
                    <div class="input-group input-group-lg">
                      <span class="input-group-text bg-white">
                        <i class="bi bi-person"></i>
                      </span>
                      <input 
                        v-model="form.username" 
                        type="text" 
                        class="form-control border-start-0 ps-0 shadow-sm" 
                        style="height: 58px;"
                        placeholder="Nguyễn Văn A" 
                        required 
                      />
                    </div>
                  </div>

                  <!-- Email -->
                  <div class="col-12">
                    <label class="form-label fw-semibold">Email</label>
                    <div class="input-group input-group-lg">
                      <span class="input-group-text bg-white">
                        <i class="bi bi-envelope"></i>
                      </span>
                      <input 
                        v-model="form.email" 
                        type="email" 
                        class="form-control border-start-0 ps-0 shadow-sm" 
                        style="height: 58px;"
                        placeholder="you@example.com" 
                        required 
                      />
                    </div>
                  </div>

                  <!-- Mật khẩu -->
                  <div class="col-12">
                    <label class="form-label fw-semibold">Mật khẩu</label>
                    <div class="input-group input-group-lg">
                      <span class="input-group-text bg-white">
                        <i class="bi bi-lock"></i>
                      </span>
                      <input 
                        v-model="form.password" 
                        type="password" 
                        class="form-control border-start-0 ps-0 shadow-sm" 
                        style="height: 58px;"
                        placeholder="Ít nhất 6 ký tự" 
                        required 
                        minlength="6"
                      />
                    </div>
                    <small class="text-muted d-block mt-1">Mật khẩu phải có ít nhất 6 ký tự</small>
                  </div>
                </div>

                <!-- Nút đăng ký -->
                <button 
                  type="submit" 
                  class="btn btn-lg w-100 mt-4 fw-bold rounded-4 shadow-lg d-flex align-items-center justify-content-center gap-3"
                  style="height: 60px; background: linear-gradient(135deg, #667eea, #764ba2); border: none; color: white;"
                  :disabled="isLoading || !isFormValid"
                  :class="{ 'opacity-75': isLoading || !isFormValid }"
                >
                  <div class="spinner-border spinner-border-sm text-white" v-if="isLoading"></div>
                  <span>{{ isLoading ? 'Đang tạo tài khoản...' : 'Đăng ký ngay' }}</span>
                  <i class="bi bi-arrow-right fs-4" v-if="!isLoading"></i>
                </button>
              </form>

              <!-- Đăng nhập -->
              <div class="text-center mt-5">
                <span class="text-muted">Đã có tài khoản?</span>
                <router-link to="/login" class="fw-bold ms-2 text-decoration-none" style="color: #667eea;">
                  Đăng nhập ngay
                  <i class="bi bi-arrow-right-short"></i>
                </router-link>
              </div>
            </div>
          </div>

          <!-- Footer -->
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
import { useRouter } from 'vue-router'

const defaultAvatar = 'https://placehold.co/150x150?text=AVT&font=inter'

const allData = inject<Ref<any[]>>('allData')!
const showToast = inject<(msg: string, type?: 'success' | 'error' | 'warning') => void>('showToast')!
const router = useRouter()
const emit = defineEmits<{ register: [] }>()

const form = ref({
  username: '',
  email: '',
  password: '',
  avatar: ''
})

const previewAvatar = ref<string>('')
const isLoading = ref(false)

const isFormValid = computed(() =>
  form.value.username.trim().length >= 2 &&
  form.value.email.trim().includes('@') &&
  form.value.password.length >= 6
)

function handleFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    showToast('Chỉ chấp nhận file ảnh!', 'error')
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    showToast('Ảnh quá lớn! Tối đa 5MB', 'error')
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    const result = reader.result as string
    previewAvatar.value = result
    form.value.avatar = result
    showToast('Đã chọn ảnh đại diện!', 'success')
  }
  reader.readAsDataURL(file)
}

function handleSubmit() {
  if (allData.value.some(u => u.type === 'user' && u.email === form.value.email)) {
    showToast('Email này đã được sử dụng!', 'error')
    return
  }

  isLoading.value = true

  setTimeout(() => {
    const newUser = {
      type: 'user',
      __backendId: Date.now().toString(36) + Math.random().toString(36).substr(2),
      username: form.value.username.trim(),
      email: form.value.email.trim(),
      password: form.value.password,
      avatar: form.value.avatar || defaultAvatar,
      createdAt: new Date().toISOString(),
      isLoggedIn: false
    }

    allData.value.push(newUser)
    showToast(`Chào mừng ${newUser.username}! Đăng ký thành công!`, 'success')
    emit('register')
    
    // Reset form
    form.value = { username: '', email: '', password: '', avatar: '' }
    previewAvatar.value = ''
    isLoading.value = false
    
    router.push('/login')
  }, 1200)
}
</script>

<style scoped>
/* Hover hiệu ứng bay */
.hover-lift { transition: all 0.3s ease; }
.hover-lift:hover { transform: translateY(-8px); }
.hover-scale { transition: transform 0.2s; }
.hover-scale:hover { transform: scale(1.2); }

/* Input focus đẹp */
.form-control:focus,
.input-group-text {
  box-shadow: 0 0 0 0.25rem rgba(102, 126, 234, 0.25) !important;
  border-color: #667eea !important;
}

.input-group-text {
  background: white !important;
  color: #667eea;
}

/* Nút đăng ký mượt */
.btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.4) !important;
}

.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
</style>