<template>
  <nav class="navbar navbar-expand-lg fixed-top shadow-lg"
       style="background: rgba(255,255,255,0.95); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(0,0,0,0.08);">
    <div class="container">

      <router-link to="/home" class="navbar-brand d-flex align-items-center gap-3 fw-bold text-primary">
        <div class="d-inline-flex align-items-center justify-content-center rounded-3 text-white"
             style="width: 48px; height: 48px; background: linear-gradient(135deg, #667eea, #764ba2); font-size: 20px;">
          VN
        </div>
        <span class="d-none d-md-block fs-4">Blog của tôi</span>
      </router-link>

      <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <i class="bi bi-list fs-3"></i>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto align-items-center gap-2">
           <li class="nav-item">
            <router-link to="/home" class="nav-link px-3 py-2 rounded-3 d-flex align-items-center gap-2 hover-primary"
                         :class="{ 'bg-primary text-white': $route.path === '/home' || $route.path === '/' }">
              <i class="bi bi-house-door-fill fs-5"></i>
              <span class="d-none d-lg-block">Trang chủ</span>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link to="/create-post" class="nav-link px-3 py-2 rounded-3 d-flex align-items-center gap-2 hover-success">
              <i class="bi bi-pencil-square fs-5"></i>
              <span class="d-none d-lg-block">Viết bài</span>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link to="/profile" class="nav-link px-3 py-2 rounded-3 d-flex align-items-center gap-2 hover-info">
              <i class="bi bi-person-circle fs-5"></i>
              <span class="d-none d-lg-block">Hồ sơ</span>
            </router-link>
          </li>

          <li class="nav-item d-none d-md-block">
            <div class="position-relative">
              <i class="bi bi-search position-absolute top-50 translate-middle-y text-muted"
                 style="left: 14px; font-size: 18px; z-index: 10;"></i>

              <input v-model="searchQuery"
                     @input="debouncedSearch"
                     @focus="showResults = true"
                     @blur="hideResults"
                     type="text"
                     class="form-control shadow-sm"
                     placeholder="Tìm kiếm..."
                     style="width: 340px; height: 42px; border-radius: 50px; padding-left: 42px; background-color: #f0f2f5; border: none;" />

              <div v-if="showResults && searchResults.length"
                   class="position-absolute top-100 start-0 mt-2 w-100 bg-white shadow-lg rounded-3 border overflow-hidden"
                   style="max-height: 480px; overflow-y: auto; z-index: 1050;">
                <div v-for="item in searchResults" :key="item.__backendId"
                     class="p-3 border-bottom d-flex align-items-center gap-3 cursor-pointer hover-bg-light"
                     @mousedown.prevent="goToResult(item)">
                  <template v-if="item.type === 'user'">
                    <img :src="item.avatar || 'https://placehold.co/50x50'" class="rounded-circle" width="50" height="50">
                    <div>
                      <div class="fw-bold">{{ item.username }}</div>
                      <small class="text-muted">Người dùng</small>
                    </div>
                  </template>
                  <template v-else>
                    <img :src="item.image || 'https://placehold.co/60x60?text=P'" class="rounded" width="50" height="50">
                    <div class="flex-grow-1">
                      <div class="fw-bold small text-truncate" style="max-width: 260px;">{{ item.title }}</div>
                      <small class="text-muted">{{ item.authorName }} • {{ formatDate(item.createdAt) }}</small>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </li>
        </ul>

        <ul class="navbar-nav align-items-center gap-2">
          <li class="nav-item dropdown">
            <a class="nav-link position-relative p-2 rounded-circle hover-bg-light" href="#" data-bs-toggle="dropdown">
              <i class="bi bi-person-plus-fill fs-4 text-dark"></i>
              <span v-if="friendRequestCount > 0"
                    class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger small">
                {{ friendRequestCount > 99 ? '99+' : friendRequestCount }}
              </span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0 p-3" style="width: 380px;">
              <li class="dropdown-header fw-bold fs-5">Lời mời kết bạn</li>
              <li><hr class="dropdown-divider"></li>
              <div v-if="friendRequests.length === 0" class="text-center py-4 text-muted">Không có lời mời mới</div>
              <li v-for="req in friendRequests" :key="req.__backendId" class="dropdown-item p-3">
                <div class="d-flex align-items-center gap-3">
                  <img :src="req.avatar || 'https://placehold.co/56x56'" class="rounded-circle" width="56" height="56">
                  <div class="flex-grow-1">
                    <strong>{{ req.username }}</strong> muốn kết bạn
                    <div class="d-flex gap-2 mt-2">
                      <button @click.stop="acceptFriend(req)" class="btn btn-primary btn-sm rounded-pill px-4">Xác nhận</button>
                      <button @click.stop="rejectFriend(req)" class="btn btn-light border btn-sm rounded-pill px-3">Xóa</button>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </li>

          <li class="nav-item">
            <a href="#" class="nav-link position-relative p-2 rounded-circle hover-bg-light" 
               @click.prevent="toggleChatWindow">
              <i class="bi bi-messenger fs-4 text-dark"></i>
              <span v-if="totalUnreadCount > 0"
                    class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger small">
                {{ totalUnreadCount > 9 ? '9+' : totalUnreadCount }}
              </span>
            </a>
          </li>

          <li class="nav-item dropdown">
            <a class="nav-link position-relative p-2 rounded-circle hover-bg-light" href="#" data-bs-toggle="dropdown">
              <i class="bi bi-bell-fill fs-4 text-dark"></i>
              <span v-if="unreadNotificationCount > 0"
                    class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger small">
                {{ unreadNotificationCount > 99 ? '99+' : unreadNotificationCount }}
              </span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0 p-0 overflow-hidden" style="width: 360px;">
               <div class="p-3 border-bottom d-flex justify-content-between align-items-center">
                   <h6 class="fw-bold mb-0">Thông báo</h6>
                   <small class="text-primary cursor-pointer" @click.stop="markAllRead">Đánh dấu đã đọc</small>
               </div>
               
               <div class="overflow-auto" style="max-height: 400px;">
                   <div v-if="myNotifications.length === 0" class="text-center py-4 text-muted small">
                       Không có thông báo mới
                   </div>

                   <div v-for="notif in myNotifications" :key="notif.__backendId"
                        class="dropdown-item p-3 d-flex gap-3 align-items-start"
                        :class="{'bg-light': !notif.isRead}"
                        style="white-space: normal; cursor: pointer;"
                        @click="handleNotificationClick(notif)">
                        
                        <div class="position-relative flex-shrink-0">
                             <img :src="getSenderInfo(notif.senderId)?.avatar || 'https://placehold.co/48x48'" 
                                  class="rounded-circle" width="48" height="48">
                             <span class="position-absolute bottom-0 end-0 bg-primary rounded-circle border border-2 border-white p-1">
                                 <i class="bi bi-postcard-fill text-white" style="font-size: 10px; display: block;"></i>
                             </span>
                        </div>
                        
                        <div class="flex-grow-1">
                            <span class="fw-bold">{{ getSenderInfo(notif.senderId)?.username || 'Người dùng' }}</span>
                            <span> {{ notif.content }}</span>
                            <div class="text-primary small mt-1 fw-bold">{{ formatDate(notif.createdAt) }}</div>
                        </div>

                        <span v-if="!notif.isRead" class="bg-primary rounded-circle p-1 align-self-center"></span>
                   </div>
               </div>
            </ul>
          </li>

          <li class="nav-item dropdown" v-if="user">
            <a class="nav-link d-flex align-items-center gap-2 p-2 rounded-3 hover-bg-light" href="#" data-bs-toggle="dropdown">
              <img :src="user.avatar || 'https://placehold.co/40x40'"
                   class="rounded-circle border border-2 border-white shadow" width="40" height="40">
              <div class="d-none d-xl-block text-start">
                <div class="fw-bold small">{{ user.username }}</div>
                <small class="text-muted">Xem hồ sơ</small>
              </div>
              <i class="bi bi-chevron-down small"></i>
            </a>
            <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0">
              <li><router-link to="/profile" class="dropdown-item d-flex align-items-center gap-3">Hồ sơ cá nhân</router-link></li>
              <li><router-link to="/create-post" class="dropdown-item d-flex align-items-center gap-3">Viết bài mới</router-link></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item d-flex align-items-center gap-3 text-danger" @click.prevent="logout">Đăng xuất</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div style="height: 80px;"></div>

  <div v-if="showChatBox" 
       class="position-fixed bottom-0 bg-white shadow-lg border rounded-top-4 overflow-hidden d-flex flex-column"
       style="right: 80px; width: 340px; height: 460px; z-index: 1060; font-family: sans-serif;">
    
    <div class="p-3 border-bottom d-flex align-items-center justify-content-between bg-white shadow-sm" 
         style="cursor: pointer;">
        <div class="d-flex align-items-center gap-2">
            <button v-if="activeChatUser" class="btn btn-sm btn-light rounded-circle" @click.stop="backToList">
                <i class="bi bi-arrow-left"></i>
            </button>
            <template v-if="activeChatUser">
                <div class="position-relative">
                    <img :src="activeChatUser.avatar || 'https://placehold.co/32x32'" class="rounded-circle" width="32" height="32">
                </div>
                <div class="fw-bold small">{{ activeChatUser.username }}</div>
            </template>
            <template v-else>
                <div class="fw-bold text-primary fs-5 px-2">Tin nhắn</div>
            </template>
        </div>
        <button class="btn btn-sm text-secondary hover-bg-light rounded-circle" @click.stop="showChatBox = false">
            <i class="bi bi-x-lg"></i>
        </button>
    </div>

    <div v-if="!activeChatUser" class="flex-grow-1 overflow-auto p-2">
        <div class="input-group mb-3 px-2">
            <span class="input-group-text bg-light border-0 rounded-start-pill ps-3"><i class="bi bi-search"></i></span>
            <input type="text" class="form-control bg-light border-0 rounded-end-pill" placeholder="Tìm kiếm bạn bè...">
        </div>
        <div v-for="friend in myFriends" :key="friend.__backendId" 
             @click="openChat(friend)"
             class="d-flex align-items-center gap-3 p-2 rounded hover-bg-light cursor-pointer position-relative">
            <div class="position-relative">
                <img :src="friend.avatar || 'https://placehold.co/48x48'" class="rounded-circle" width="48" height="48">
            </div>
            <div class="flex-grow-1 overflow-hidden">
                <div class="fw-bold small">{{ friend.username }}</div>
                <small class="text-muted d-block text-truncate" :class="{'fw-bold text-dark': getUnreadCount(friend.__backendId) > 0}" style="font-size: 13px;">
                   {{ getLastMessageContent(friend.__backendId) }}
                </small>
            </div>
            <span v-if="getUnreadCount(friend.__backendId) > 0" 
                  class="bg-primary rounded-circle" style="width: 10px; height: 10px;"></span>
        </div>
        <div v-if="myFriends.length === 0" class="text-center text-muted mt-4 small">Chưa có bạn bè để nhắn tin.</div>
    </div>

    <div v-else class="flex-grow-1 overflow-auto p-3 bg-light d-flex flex-column gap-2" id="chat-messages-area">
        <div v-if="currentConversation.length === 0" class="text-center text-muted small mt-3">
            Hãy bắt đầu cuộc trò chuyện với {{ activeChatUser.username }}
        </div>
        <div v-for="msg in currentConversation" :key="msg.__backendId" 
             class="d-flex w-100" 
             :class="msg.fromId === user.__backendId ? 'justify-content-end' : 'justify-content-start'">
            <img v-if="msg.fromId !== user.__backendId" 
                 :src="activeChatUser.avatar || 'https://placehold.co/24x24'" 
                 class="rounded-circle me-2 align-self-end" width="24" height="24">
            <div class="py-2 px-3 rounded-4 shadow-sm" 
                 :class="msg.fromId === user.__backendId ? 'bg-primary text-white' : 'bg-white text-dark border'"
                 style="max-width: 75%; font-size: 14px; word-wrap: break-word;">
                 {{ msg.content }}
            </div>
        </div>
    </div>

    <div v-if="activeChatUser" class="p-2 border-top bg-white d-flex align-items-center gap-2">
        <button class="btn btn-sm text-muted rounded-circle"><i class="bi bi-image"></i></button>
        <input v-model="chatInput" @keyup.enter="sendMessage" type="text" 
               class="form-control rounded-pill bg-light border-0 px-3 small" placeholder="Nhập tin nhắn...">
        <button @click="sendMessage" class="btn btn-link text-primary p-0">
            <i class="bi bi-send-fill fs-5"></i>
        </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, computed, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Ref } from 'vue'

const router = useRouter()
const allData = inject('allData') as Ref<any[]>
const currentUser = inject('currentUser') as Ref<any>
const showToast = inject<(msg: string, type?: string) => void>('showToast')
const user = computed(() => currentUser?.value)


// Lấy danh sách thông báo của user hiện tại
const myNotifications = computed(() => {
  if (!user.value || !allData.value) return []
  return allData.value
    .filter((item: any) => item.type === 'notification' && item.recipientId === user.value.__backendId)
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // Mới nhất lên đầu
})

// Đếm số thông báo chưa đọc
const unreadNotificationCount = computed(() => {
  return myNotifications.value.filter((n: any) => !n.isRead).length
})

// Lấy thông tin người gửi (để hiện tên và avatar)
const getSenderInfo = (senderId: string) => {
  return allData.value.find((u: any) => u.type === 'user' && u.__backendId === senderId)
}

// Xử lý khi click vào thông báo
// Trong script setup của Navbar.vue

const handleNotificationClick = (notif: any) => {
  // 1. Đánh dấu đã đọc
  notif.isRead = true
  
  // 2. Chuyển hướng đến trang chi tiết bài viết
  if (notif.postId) {
     router.push(`/post/${notif.postId}`)
  } else {
     // Fallback nếu không có postId (hiếm khi xảy ra)
     router.push('/home')
  }
}

// Đánh dấu tất cả đã đọc
const markAllRead = () => {
    myNotifications.value.forEach((n: any) => n.isRead = true)
}

const showChatBox = ref(false)
const activeChatUser = ref<any>(null)
const chatInput = ref('')

const myFriends = computed(() => {
    if (!user.value || !allData.value) return []
    return allData.value.filter((u: any) => u.type === 'user' && user.value.friends?.includes(u.__backendId))
})
const allMessages = computed(() => allData.value.filter((item: any) => item.type === 'message'))
const totalUnreadCount = computed(() => {
    if (!user.value) return 0
    return allMessages.value.filter((msg: any) => msg.toId === user.value.__backendId && !msg.isRead).length
})
const getLastMessageContent = (friendId: string) => {
    if (!user.value) return ''
    const conversation = allMessages.value.filter((msg: any) => 
        (msg.fromId === user.value.__backendId && msg.toId === friendId) || (msg.fromId === friendId && msg.toId === user.value.__backendId)
    )
    if (conversation.length === 0) return 'Các bạn đã là bạn bè'
    const lastMsg = conversation[conversation.length - 1]
    if (lastMsg.fromId === user.value.__backendId) return `Bạn: ${lastMsg.content}`
    return lastMsg.content
}
const getUnreadCount = (friendId: string) => {
    if (!user.value) return 0
    return allMessages.value.filter((msg: any) => msg.fromId === friendId && msg.toId === user.value.__backendId && !msg.isRead).length
}
const currentConversation = computed(() => {
    if (!user.value || !activeChatUser.value) return []
    const friendId = activeChatUser.value.__backendId
    return allMessages.value.filter((msg: any) => (msg.fromId === user.value.__backendId && msg.toId === friendId) || (msg.fromId === friendId && msg.toId === user.value.__backendId))
})
const toggleChatWindow = () => { showChatBox.value = !showChatBox.value }
const openChat = (friend: any) => {
    activeChatUser.value = friend
    markMessagesAsRead(friend.__backendId)
    scrollToBottom()
}
const backToList = () => { activeChatUser.value = null }
const scrollToBottom = () => {
    nextTick(() => {
        const chatArea = document.getElementById('chat-messages-area')
        if (chatArea) chatArea.scrollTop = chatArea.scrollHeight
    })
}
const markMessagesAsRead = (friendId: string) => {
    if (!user.value) return
    const unreadMsgs = allData.value.filter((item: any) => item.type === 'message' && item.fromId === friendId && item.toId === user.value.__backendId && !item.isRead)
    unreadMsgs.forEach((msg: any) => msg.isRead = true)
}
const sendMessage = () => {
    if (!chatInput.value.trim() || !user.value || !activeChatUser.value) return
    const newMessage = {
        __backendId: Date.now().toString(),
        type: 'message',
        fromId: user.value.__backendId,
        toId: activeChatUser.value.__backendId,
        content: chatInput.value,
        createdAt: new Date().toISOString(),
        isRead: false
    }
    allData.value.push(newMessage)
    chatInput.value = ''
    scrollToBottom()
}

const searchQuery = ref('')
const showResults = ref(false)
const searchResults = ref<any[]>([])
const allPosts = computed(() => {
  const data = allData?.value || []
  return data.filter((item: any) => item.type === 'post').map((post: any) => {
      const author = data.find((u: any) => u.type === 'user' && u.__backendId === post.authorId)
      return { ...post, authorName: author?.username || 'Ẩn danh', type: 'post' }
    })
})
const allUsers = computed(() => {
  const data = allData?.value || []
  return data.filter((item: any) => item.type === 'user').map((user: any) => ({ ...user, type: 'user' }))
})
let timeoutId: number | null = null
const debouncedSearch = () => {
  if (timeoutId !== null) clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    const q = searchQuery.value.trim().toLowerCase()
    if (q === '') { searchResults.value = []; return }
    const users = allUsers.value.filter(user => user.username?.toLowerCase().includes(q)).slice(0, 5)
    const posts = allPosts.value.filter(post => post.title?.toLowerCase().includes(q) || post.content?.toLowerCase().includes(q)).slice(0, 5)
    searchResults.value = [...users, ...posts]
  }, 300)
}
const goToResult = (item: any) => {
  if (item.type === 'user') router.push(`/profile/${item.__backendId}`)
  else router.push(`/post/${item.__backendId}`)
  searchQuery.value = ''
  showResults.value = false
}
const hideResults = () => setTimeout(() => (showResults.value = false), 200)

const friendRequests = computed(() => {
  if (!user.value) return []
  const data = allData?.value || []
  return data.filter((u: any) => u.type === 'user' && user.value.friendRequests?.includes(u.__backendId))
})
const friendRequestCount = computed(() => friendRequests.value.length)
const acceptFriend = (reqUser: any) => {
  if (!user.value || !reqUser) return
  user.value.friendRequests = (user.value.friendRequests || []).filter((id: string) => id !== reqUser.__backendId)
  reqUser.sentRequests = (reqUser.sentRequests || []).filter((id: string) => id !== user.value.__backendId)
  user.value.friends.push(reqUser.__backendId)
  reqUser.friends.push(user.value.__backendId)
  showToast?.(`Đã kết bạn với ${reqUser.username}!`, 'success')
}
const rejectFriend = (reqUser: any) => {
  if (!user.value || !reqUser) return
  user.value.friendRequests = (user.value.friendRequests || []).filter((id: string) => id !== reqUser.__backendId)
  reqUser.sentRequests = (reqUser.sentRequests || []).filter((id: string) => id !== user.value.__backendId)
  showToast?.('Đã từ chối lời mời', 'info')
}
const emit = defineEmits<{ logout: [] }>()
const logout = () => emit('logout')
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) {
      if (diff < 3600000) return `${Math.floor(diff/60000)} phút trước`
      return `${Math.floor(diff/3600000)} giờ trước`
  }
  if (days === 1) return 'Hôm qua'
  if (days < 7) return `${days} ngày trước`
  return date.toLocaleDateString('vi-VN')
}
onMounted(() => {
  if (user.value) {
    user.value.friends = user.value.friends || []
    user.value.friendRequests = user.value.friendRequests || []
    user.value.sentRequests = user.value.sentRequests || []
  }
})
</script>

<style scoped>
.hover-primary:hover { background: #e7f3ff !important; color: #667eea !important; }
.hover-success:hover { background: #d4edda !important; color: #28a745 !important; }
.hover-info:hover { background: #d1ecf1 !important; color: #17a2b8 !important; }
.hover-bg-light:hover { background: #f8f9fa !important; }
.cursor-pointer { cursor: pointer; }
.form-control:focus {
  background-color: #fff !important;
  box-shadow: 0 0 0 3px rgba(24, 119, 242, 0.15) !important;
}
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
::-webkit-scrollbar-track { background: transparent; }
</style>