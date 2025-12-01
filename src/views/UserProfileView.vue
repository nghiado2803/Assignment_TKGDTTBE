<template>
  <div class="min-vh-100 bg-light">
    <div class="container py-4">

      <div v-if="!user" class="text-center py-5">
        <div class="bg-white rounded-4 shadow p-5">
          <h3 class="mb-4">Không tìm thấy người dùng</h3>
          <button @click="router.push('/home')" class="btn btn-primary rounded-pill px-5">
            Về trang chủ
          </button>
        </div>
      </div>

      <div v-else>
        <div class="position-relative mb-n5">
          <img src="/images/anhbia.webp" class="w-100 rounded-4" style="height: 380px; object-fit: cover;" alt="Ảnh bìa">
        </div>

        <div class="bg-white rounded-4 shadow-sm px-4 pt-5 pb-4 mb-4 position-relative">
          <img :src="user.avatar || 'https://via.placeholder.com/168'"
            class="rounded-circle border border-5 border-white shadow-lg position-absolute" width="168" height="168"
            style="top: -80px; left: 32px;">

          <div class="d-flex justify-content-between flex-wrap mt-5">
            <div class="d-flex flex-column ms-5 mt-3">
              <h1 class="fw-bold fs-2 mb-1">{{ user.username }}</h1>
              <p class="text-muted fs-5 mb-0">{{ friendsCount }} bạn bè</p>
            </div>

            <div class="d-flex align-items-center gap-2">
              <button v-if="isFriend" class="btn btn-light border btn-sm rounded-pill py-1 px-3 fw-medium">
                <i class="bi bi-person-check-fill me-1"></i> Bạn bè
              </button>

              <button v-else-if="hasSentRequest" class="btn btn-light border btn-sm rounded-pill py-1 px-3 fw-medium"
                disabled>
                <i class="bi bi-clock-fill me-1"></i> Đã gửi lời mời
              </button>

              <div v-else-if="hasReceivedRequest" class="d-flex align-items-center gap-2">
                <button @click="acceptFriend"
                  class="btn btn-primary btn-sm rounded-pill py-1 px-4 fw-medium">Xác nhận</button>
                <button @click="rejectFriend"
                  class="btn btn-light border btn-sm rounded-pill py-1 px-4 fw-medium">Xóa</button>
              </div>

              <button v-else @click="sendFriendRequest"
                class="btn btn-primary btn-sm rounded-pill py-1 px-3 fw-medium">
                <i class="bi bi-person-plus-fill me-1"></i> Thêm bạn bè
              </button>

              <button @click="openChat" class="btn btn-light border btn-sm rounded-pill py-1 px-3 fw-medium">
                <i class="bi bi-messenger me-1"></i> Nhắn tin
              </button>
            </div>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col-lg-8">

            <div v-if="userPosts.length === 0" class="bg-white rounded-4 shadow-sm text-center py-5 text-muted">
              <i class="bi bi-file-earmark-text fs-1 mb-3"></i>
              <p class="fs-4">{{ user.username }} chưa có bài viết nào</p>
            </div>

            <div v-for="post in userPosts" :key="post.__backendId"
              class="bg-white rounded-4 shadow-sm mb-4 overflow-hidden">

              <div class="p-4 pb-3 d-flex gap-3 align-items-center">
                <img :src="user.avatar || 'https://via.placeholder.com/48'" class="rounded-circle" width="48"
                  height="48">
                <div>
                  <strong class="d-block">{{ user.username }}</strong>
                  <small class="text-muted">{{ formatDate(post.createdAt) }}</small>
                </div>
              </div>

              <div class="px-4 pb-3">
                <h5 class="fw-bold mb-2">{{ post.title }}</h5>
                <p class="mb-0" style="white-space: pre-wrap;">{{ post.content }}</p>
              </div>

              <img v-if="post.image" :src="post.image" class="w-100" style="max-height: 600px; object-fit: cover;">

              <div class="px-4 py-2 border-top border-bottom bg-light">
                <div class="d-flex justify-content-between small text-muted">
                  <span v-if="post.likes > 0">
                    <i class="bi bi-hand-thumbs-up-fill text-primary"></i> {{ post.likes }}
                  </span>

                  <span v-if="postComments(post.__backendId).length > 0">
                    {{ postComments(post.__backendId).length }} bình luận
                  </span>
                </div>
              </div>

              <div class="px-4 py-3 d-flex justify-content-around border-bottom">
                <button @click="toggleLike(post)" class="btn btn-sm d-flex align-items-center gap-2 fw-medium"
                  :class="post.liked ? 'text-primary' : 'text-muted'">
                  <i class="bi" :class="post.liked ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'"></i>
                  Thích
                </button>

                <button @click="focusCommentInput(post.__backendId)"
                  class="btn btn-sm d-flex align-items-center gap-2 text-muted fw-medium">
                  <i class="bi bi-chat-dots"></i> Bình luận
                </button>

                <button @click="handleShare(post)"
                  class="btn btn-sm d-flex align-items-center gap-2 text-muted fw-medium">
                  <i class="bi bi-share"></i> Chia sẻ
                </button>
              </div>

              <div class="p-4 pt-3">

                <div v-for="c in postComments(post.__backendId)" :key="c.__backendId" class="d-flex gap-3 mb-3">

                  <img :src="c.avatar || 'https://via.placeholder.com/36'" class="rounded-circle flex-shrink-0"
                    width="36" height="36">

                  <div>
                    <div class="bg-light rounded-4 px-3 py-2">
                      <strong class="d-block small">{{ c.commentAuthorName }}</strong>
                      <p class="mb-0 small">{{ c.commentContent }}</p>
                    </div>
                    <small class="text-muted ms-2">{{ formatDate(c.createdAt) }}</small>
                  </div>
                </div>

                <div class="d-flex gap-3 mt-4">
                  <img :src="currentUser?.avatar || 'https://via.placeholder.com/40'"
                    class="rounded-circle flex-shrink-0" width="40" height="40">

                  <div class="flex-grow-1">
                    <input v-model="commentInputs[post.__backendId]" @keyup.enter="submitComment(post.__backendId)"
                      type="text" class="form-control form-control-sm rounded-pill bg-light border-0"
                      placeholder="Viết bình luận..." :ref="el => commentRefs[post.__backendId] = el">
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, computed, onMounted, nextTick, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const allData = inject<Ref<any[]>>('allData')!
const showToast = inject<(msg: string, type?: string) => void>('showToast')!
const currentUser = inject<Ref<any>>('currentUser')?.value

const route = useRoute()
const router = useRouter()

const user = ref<any>(null)
const commentInputs = ref<Record<string, string>>({})
const commentRefs = ref<Record<string, any>>({})

// === LOGIC LIKE ===
const allLikes = computed(() => {
  return allData.value.filter(item => item.type === 'like')
})

onMounted(() => {
  const id = route.params.id as string
  const rawUser = allData.value.find(u => u.type === 'user' && u.__backendId === id)

  if (!rawUser) {
    showToast('Không tìm thấy người dùng!', 'error')
    setTimeout(() => router.push('/home'), 1500)
    return
  }
  user.value = rawUser
})

// === POSTS CỦA USER ===
const userPosts = computed(() => {
  if (!user.value) return []

  return allData.value
    .filter(p => p.type === 'post' && p.authorId === user.value.__backendId)
    .map(post => {
      // Logic hiển thị: kiểm tra trong allData
      const postLikes = allLikes.value.filter(l => l.postId === post.__backendId)
      const isCurrentUserLiked = postLikes.some(l => l.authorId === currentUser?.__backendId)

      return {
        ...post,
        likes: postLikes.length,
        liked: isCurrentUserLiked,
      }
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

const postComments = (postId: string) => {
  return allData.value
    .filter(c => c.type === 'comment' && c.postId === postId)
    .map(c => {
      const author = allData.value.find(u => u.type === 'user' && u.__backendId === c.commentAuthorId)
      return { ...c, commentAuthorName: author?.username || 'Ẩn danh', avatar: author?.avatar || '' }
    })
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
}

// === HÀM TOGGLE LIKE ĐỒNG BỘ ===
const toggleLike = (post: any) => {
  if (!currentUser) {
    showToast('Bạn cần đăng nhập để thích bài viết này!', 'warning')
    router.push('/login')
    return
  }

  // 1. Kiểm tra TRỰC TIẾP trong allData xem đã like chưa
  // (Không dựa vào post.liked để tránh sai lệch state)
  const existingLikeIndex = allData.value.findIndex(item =>
    item.type === 'like' &&
    item.postId === post.__backendId &&
    item.authorId === currentUser.__backendId
  )

  if (existingLikeIndex !== -1) {
    // 2a. Nếu ĐÃ có -> Xóa (Unlike)
    allData.value.splice(existingLikeIndex, 1)
    showToast('Đã bỏ thích bài viết.', 'info')
  } else {
    // 2b. Nếu CHƯA có -> Thêm (Like)
    allData.value.push({
      type: 'like',
      __backendId: Math.random().toString(36).substr(2, 9),
      postId: post.__backendId,
      authorId: currentUser.__backendId,
      createdAt: new Date().toISOString()
    })
    showToast('Bạn đã thích bài viết này!', 'success')
  }
}

// ... (Các hàm focusCommentInput, submitComment, handleShare, friend logic giữ nguyên) ...
const focusCommentInput = (postId: string) => {
  nextTick(() => commentRefs.value[postId]?.focus())
}

const submitComment = (postId: string) => {
  const content = commentInputs.value[postId]?.trim()
  if (!content || !currentUser) return

  allData.value.push({
    type: 'comment',
    __backendId: Date.now().toString(36) + Math.random().toString(36).substring(2),
    postId,
    commentContent: content,
    commentAuthorId: currentUser.__backendId,
    createdAt: new Date().toISOString()
  })

  commentInputs.value[postId] = ''
  showToast('Đã đăng bình luận!', 'success')
}

const handleShare = (post: any) => {
  const url = `${window.location.origin}/post/${post.__backendId}`
  const title = post.title || 'Bài viết hay'
  const text = (post.content || '').slice(0, 100) + '...'

  if (navigator.share) {
    navigator.share({ title, text, url }).catch(() => {
      navigator.clipboard.writeText(url)
      showToast('Đã sao chép link!', 'success')
    })
  } else {
    navigator.clipboard.writeText(url)
    showToast('Đã sao chép link!', 'success')
  }
}

const friendsCount = computed(() => user.value?.friends?.length || 0)
const isFriend = computed(() => currentUser?.friends?.includes(user.value?.__backendId))
const hasSentRequest = computed(() => currentUser?.sentRequests?.includes(user.value?.__backendId))
const hasReceivedRequest = computed(() => user.value?.friendRequests?.includes(currentUser?.__backendId))

const sendFriendRequest = () => {
  currentUser.sentRequests ??= []
  user.value.friendRequests ??= []
  currentUser.sentRequests.push(user.value.__backendId)
  user.value.friendRequests.push(currentUser.__backendId)
  showToast(`Đã gửi lời mời kết bạn đến ${user.value.username}`, 'success')
}

const acceptFriend = () => {
  currentUser.friendRequests = currentUser.friendRequests?.filter((id: string) => id !== user.value.__backendId)
  user.value.sentRequests = user.value.sentRequests?.filter((id: string) => id !== currentUser.__backendId)
  currentUser.friends.push(user.value.__backendId)
  user.value.friends.push(currentUser.__backendId)
  showToast(`Bạn và ${user.value.username} đã trở thành bạn bè!`, 'success')
}

const rejectFriend = () => {
  currentUser.friendRequests = currentUser.friendRequests?.filter((id: string) => id !== user.value.__backendId)
  user.value.sentRequests = user.value.sentRequests?.filter((id: string) => id !== currentUser.__backendId)
  showToast('Đã từ chối lời mời', 'info')
}

const openChat = () => router.push(`/messages/${user.value.__backendId}`)

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Vừa xong'
  if (minutes < 60) return `${minutes} phút trước`
  if (hours < 24) return `${hours} giờ trước`
  if (days < 7) return `${days} ngày trước`

  return date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.rounded-4 { border-radius: 1rem !important; }
</style>