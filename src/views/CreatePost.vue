<template>
  <div class="min-vh-100 position-relative overflow-hidden"
   style="background: #f0f2f5;">

    <!-- Blob trang trí -->
    <div class="position-absolute top-50 start-50 translate-middle blob"></div>
    <div class="position-absolute bottom-0 end-0 blob-lg"></div>

    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-6 col-xl-5">

          <!-- CARD NỀN TRẮNG CHUẨN FACEBOOK -->
          <div class="card border-0 rounded-4 shadow-lg fb-card">

            <!-- Header: Avatar + tên -->
            <div class="card-header bg-transparent border-0 p-4 pb-3">
              <div class="d-flex align-items-center gap-3">
                <img :src="currentUser?.avatar || 'https://placehold.co/56x56?text=U'"
                     class="rounded-circle border border-4 border-white shadow"
                     width="56" height="56" alt="avatar">
                <div>
                  <h5 class="mb-0 fw-bold">{{ currentUser?.username || 'Bạn' }}</h5>
                  <small class="text-muted">đang tạo bài viết mới...</small>
                </div>
              </div>
            </div>

            <div class="card-body p-4 pt-0">
              <form @submit.prevent="handleSubmit">

                <!-- Tiêu đề -->
                <input v-model="form.title"
                       type="text"
                       class="form-control fs-3 fw-bold border-0 shadow-none mb-3"
                       placeholder="Tiêu đề bài viết..."
                       required />

                <!-- Nội dung -->
                <textarea v-model="form.content"
                          rows="6"
                          class="form-control fs-5 border-0 shadow-none resize-none mb-4"
                          placeholder="Bạn đang nghĩ gì thế?"
                          required></textarea>

                <!-- Xem trước ảnh -->
                <div v-if="previewImage" class="mb-4 rounded-4 overflow-hidden shadow">
                  <div class="position-relative">
                    <img :src="previewImage" class="w-100" style="max-height: 500px; object-fit: cover;">
                    <button @click.prevent="removeImage"
                            class="btn btn-danger btn-sm rounded-pill position-absolute top-0 end-0 m-3">
                      <i class="bi bi-x-lg"></i>
                    </button>
                  </div>
                </div>

                <!-- Nút thêm ảnh -->
          <!-- NÚT THÊM ẢNH/VIDEO – GÓC TRÁI, ICON XANH CHUẨN FACEBOOK -->
                <div class="d-flex align-items-center mt-4 pt-3 border-top border-light">
                  <label for="file-upload" class="d-flex align-items-center gap-3 text-dark fw-medium hover-lift" style="cursor: pointer;">
                    <i class="bi bi-image fs-3 text-success"></i>
                    <span class="fw-semibold">Ảnh/Video</span>
                    <input 
                      id="file-upload" 
                      type="file" 
                      accept="image/*,video/*" 
                      class="d-none" 
                      @change="handleFileChange" 
                      ref="fileInput"
                    >
                  </label>
                </div>

                <hr class="my-4">

                <!-- Nút Đăng + Hủy -->
                <div class="d-flex gap-3">
                  <button @click.prevent="handleCancel"
                          class="btn btn-outline-secondary flex-fill rounded-pill py-3">
                    Hủy bỏ
                  </button>
                  <button type="submit"
                          class="btn btn-primary flex-fill rounded-pill py-3 fw-bold shadow hover-lift"
                          :disabled="!isFormValid || isLoading">
                    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ isLoading ? 'Đang đăng...' : 'Đăng bài' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p class="text-center text-black mt-4 opacity-75 small">
            © 2025 Blog Của Tôi • Made with Đỗ Văn Nghĩa ❤️
          </p>
  </div>
  
</template>

<script setup lang="ts">
// GIỮ NGUYÊN 100% JS CỦA MÀY – TAO KHÔNG ĐỘNG GÌ HẾT
import { ref, inject, computed, type Ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const allData = inject<Ref<any[]>>('allData')!
const showToast = inject<(msg: string, type?: string) => void>('showToast')!
const currentUser = inject<Ref<any>>('currentUser')?.value

const form = ref({ title: '', content: '', image: '' })
const previewImage = ref<string>('')
const isLoading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const isFormValid = computed(() =>
  form.value.title.trim().length > 0 &&
  form.value.content.trim().length > 10
)

function handleFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) {
    showToast('Ảnh quá lớn! Tối đa 5MB', 'error')
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    previewImage.value = reader.result as string
    form.value.image = reader.result as string
  }
  reader.readAsDataURL(file)
}

function removeImage() {
  previewImage.value = ''
  form.value.image = ''
  if (fileInput.value) fileInput.value.value = ''
}

async function handleSubmit() {
  if (!currentUser) { router.push('/login'); return }
  isLoading.value = true
  await new Promise(r => setTimeout(r, 1000))

  allData.value.push({
    type: 'post',
    __backendId: Math.random().toString(36).substr(2, 9),
    title: form.value.title.trim(),
    content: form.value.content.trim(),
    image: form.value.image || '',
    authorId: currentUser.__backendId,
    createdAt: new Date().toISOString()
  })

  showToast('Đăng bài thành công!', 'success')
  form.value = { title: '', content: '', image: '' }
  previewImage.value = ''
  isLoading.value = false
  router.push('/home')
}

function handleCancel() {
  if (form.value.title || form.value.content || previewImage.value) {
    if (!confirm('Bạn có chắc muốn hủy?')) return
  }
  router.push('/home')
}
</script>

<style scoped>
.blob { background: rgba(255,255,255,0.18); border-radius: 50%; filter: blur(130px); }
.blob { width: 600px; height: 600px; }
.blob-lg { width: 900px; height: 900px; }

.fb-card {
  background: rgba(255, 255, 255, 0.97) !important;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0,0,0,0.1) !important;
}

.form-control:focus {
  box-shadow: none !important;
  border-color: #667eea !important;
}

.hover-lift { transition: all 0.3s ease; }
.hover-lift:hover { transform: translateY(-4px); box-shadow: 0 10px 20px rgba(102,126,234,0.3) !important; }

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2) !important;
  border: none !important;
}
</style>