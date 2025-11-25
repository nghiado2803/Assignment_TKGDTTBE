<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card shadow-lg border-0">
          <div class="card-body p-5">
            <h2 class="mb-4 text-primary fw-bold">Chỉnh sửa bài viết</h2>

            <!-- Đang tải -->
            <div v-if="!post" class="text-center py-5">
              <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Đang tải...</span>
              </div>
              <p class="mt-3 text-muted">Đang tải bài viết...</p>
            </div>

            <!-- Form chỉnh sửa (giống CreatePost) -->
            <form v-else @submit.prevent="handleSubmit">
              <!-- Tiêu đề -->
              <div class="mb-4">
                <input
                  v-model="form.title"
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Tiêu đề bài viết..."
                  required
                />
              </div>

              <!-- Nội dung -->
              <div class="mb-4">
                <textarea
                  v-model="form.content"
                  class="form-control"
                  rows="8"
                  placeholder="Nội dung bài viết..."
                  required
                ></textarea>
              </div>

              <!-- Ảnh hiện tại + Upload mới -->
              <div class="mb-4">
                <label class="form-label fw-bold">Ảnh bài viết</label>

                <!-- Hiển thị ảnh hiện tại hoặc ảnh mới chọn -->
                <div v-if="previewImage || post.image" class="text-center mb-3">
                  <img
                    :src="previewImage || post.image"
                    class="img-preview rounded"
                    alt="Ảnh bài viết"
                  />
                  <button @click.prevent="removeImage" class="btn btn-sm btn-danger mt-2">
                    Xóa ảnh
                  </button>
                </div>

                <!-- Input chọn file -->
                <input
                  type="file"
                  accept="image/*"
                  class="form-control"
                  @change="handleFileChange"
                  ref="fileInput"
                />
                <small class="text-muted">Chọn ảnh mới (để trống nếu giữ ảnh cũ)</small>
              </div>

              <!-- Nút hành động -->
              <div class="d-flex gap-3">
                <button
                  type="submit"
                  class="btn btn-primary btn-lg flex-grow-1"
                  :disabled="isLoading"
                >
                  {{ isLoading ? 'Đang cập nhật...' : 'Cập nhật bài viết' }}
                </button>
                <button @click.prevent="handleCancel" class="btn btn-outline-secondary btn-lg">
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Inject đúng cách
const allData = inject<Ref<any[]>>('allData')!
const showToast = inject<(msg: string, type?: 'success' | 'error' | 'warning') => void>('showToast')!
const currentUser = inject<Ref<any>>('currentUser')?.value

const route = useRoute()
const router = useRouter()

const post = ref<any>(null)
const form = ref({ title: '', content: '', image: '' })
const previewImage = ref<string>('') // ảnh mới chọn
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

// Xử lý chọn file mới
function handleFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    showToast('Vui lòng chọn file ảnh!', 'error')
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    showToast('Ảnh quá lớn! Tối đa 5MB', 'error')
    return
  }

  const reader = new FileReader()
  reader.onload = (ev) => {
    const result = ev.target?.result as string
    previewImage.value = result
    form.value.image = result // lưu ảnh mới
  }
  reader.readAsDataURL(file)
}

// Xóa ảnh (trở về không có ảnh)
function removeImage() {
  previewImage.value = ''
  form.value.image = ''
  ;(document.querySelector('input[type="file"]') as HTMLInputElement).value = ''
}

function handleSubmit() {
  if (!post.value) return

  isLoading.value = true

  setTimeout(() => {
    Object.assign(post.value, {
      title: form.value.title.trim(),
      content: form.value.content.trim(),
      image: previewImage.value || post.value.image || '', // giữ ảnh cũ nếu không đổi
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
.img-preview {
  max-width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}
textarea.form-control {
  resize: vertical;
  font-size: 1.1rem;
}
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}
.btn-primary:hover {
  background: linear-gradient(135deg, #5568d3 0%, #63408b 100%);
}
</style>