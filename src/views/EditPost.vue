<template>
  <div class="min-vh-100" style="background: #f0f2f5;">
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-lg-6">

          <!-- Card kiểu Facebook -->
          <div class="bg-white rounded-3 shadow-sm border-0 overflow-hidden">
            
            <!-- Header -->
            <div class="bg-primary text-white px-4 py-3">
              <h5 class="mb-0 fw-bold d-flex align-items-center gap-2">
                <i class="bi bi-pencil-square"></i>
                Chỉnh sửa bài viết
              </h5>
            </div>

            <div class="p-4">

              <!-- Loading -->
              <div v-if="!post" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>

              <!-- Form kiểu Facebook -->
              <form v-else @submit.prevent="handleSubmit">

                <!-- Tiêu đề -->
                <div class="mb-3">
                  <input
                    v-model="form.title"
                    type="text"
                    class="form-control form-control-lg border-0 shadow-none fs-5 fw-medium"
                    placeholder="Tiêu đề bài viết..."
                    style="border-bottom: 1px solid #ddd !important; border-radius: 0; padding-left: 0;"
                    required
                  />
                </div>

                <!-- Nội dung -->
                <div class="mb-4">
                  <textarea
                    v-model="form.content"
                    class="form-control border-0 shadow-none"
                    rows="6"
                    placeholder="Bạn đang nghĩ gì?"
                    style="resize: none; font-size: 1.1rem; line-height: 1.5;"
                    required
                  ></textarea>
                </div>

                <!-- Ảnh preview -->
                <div v-if="previewImage || post.image" class="mb-3 position-relative">
                  <img
                    :src="previewImage || post.image"
                    class="w-100 rounded-3"
                    style="max-height: 500px; object-fit: cover;"
                    alt="Ảnh bài viết"
                  />
                  <button
                    @click.prevent="removeImage"
                    class="btn btn-danger btn-sm rounded-circle position-absolute top-0 end-0 m-3 shadow"
                    style="width: 36px; height: 36px;"
                  >
                    <i class="bi bi-x-lg"></i>
                  </button>
                </div>

                <!-- Nút chọn ảnh - kiểu Facebook -->
                <div class="mb-4">
                  <label class="d-block bg-light border border-2 border-dashed rounded-3 p-4 text-center cursor-pointer hover-bg-gray"
                         style="transition: all 0.2s;">
                    <i class="bi bi-image text-success fs-1 mb-2 d-block"></i>
                    <span class="fw-medium text-muted">Thêm ảnh</span>
                    <small class="d-block text-muted">JPG, PNG, GIF • Tối đa 5MB</small>
                    <input type="file" accept="image/*" @change="handleFileChange" class="d-none" />
                  </label>
                  <div class="text-center mt-2">
                    <small class="text-muted">Để trống nếu muốn giữ ảnh cũ</small>
                  </div>
                </div>

                <!-- Nút hành động -->
                <div class="d-flex gap-2">
                  <button
                    type="submit"
                    class="btn btn-primary flex-grow-1 fw-bold py-2 rounded-3"
                    :disabled="isLoading"
                  >
                    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ isLoading ? 'Đang cập nhật...' : 'Cập nhật bài viết' }}
                  </button>
                  <button
                    @click.prevent="handleCancel"
                    class="btn btn-light border px-4 fw-medium rounded-3"
                  >
                    Hủy
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
import { ref, inject, onMounted, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const allData = inject<Ref<any[]>>('allData')!
const showToast = inject<(msg: string, type?: 'success' | 'error' | 'warning') => void>('showToast')!
const currentUser = inject<Ref<any>>('currentUser')?.value

const route = useRoute()
const router = useRouter()

const post = ref<any>(null)
const form = ref({ title: '', content: '', image: '' })
const previewImage = ref<string>('')
const isLoading = ref(false)

onMounted(() => {
  const postId = route.params.id as string
  const foundPost = allData.value.find(p => p.type === 'post' && p.__backendId === postId)

  if (!foundPost) {
    showToast('Không tìm thấy bài viết!', 'error')
    router.push('/home')
    return
  }

  if (foundPost.authorId !== currentUser?.__backendId) {
    showToast('Bạn không có quyền chỉnh sửa!', 'error')
    router.push('/home')
    return
  }

  post.value = foundPost
  form.value = {
    title: foundPost.title,
    content: foundPost.content,
    image: foundPost.image || ''
  }
})

function handleFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) return showToast('Chỉ chọn file ảnh!', 'error')
  if (file.size > 5 * 1024 * 1024) return showToast('Ảnh quá lớn!', 'error')

  const reader = new FileReader()
  reader.onload = (ev) => {
    const result = ev.target?.result as string
    previewImage.value = result
    form.value.image = result
  }
  reader.readAsDataURL(file)
}

function removeImage() {
  previewImage.value = ''
  form.value.image = ''
  const input = document.querySelector('input[type="file"]') as HTMLInputElement
  if (input) input.value = ''
}

function handleSubmit() {
  if (!post.value) return
  isLoading.value = true

  setTimeout(() => {
    Object.assign(post.value, {
      title: form.value.title.trim(),
      content: form.value.content.trim(),
      image: previewImage.value || post.value.image || '',
      updatedAt: new Date().toISOString()
    })
    showToast('Cập nhật bài viết thành công!', 'success')
    isLoading.value = false
    router.push('/home')
  }, 1000)
}

function handleCancel() {
  router.push('/home')
}
</script>

<style scoped>
/* Diệt sạch mọi viền xanh + outline */
input:focus,
textarea:focus,
*:focus,
*:focus-visible {
  outline: none !important;
  box-shadow: none !important;
  border-color: transparent !important;
}

/* Hover nhẹ cho nút chọn ảnh */
.hover-bg-gray:hover {
  background-color: #e4e6eb !important;
}

/* Background Facebook */
body {
  background: #f0f2f5 !important;
}
</style>