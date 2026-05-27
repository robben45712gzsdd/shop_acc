<template>
  <div class="faq-page">
    <div class="faq-container">
      <!-- Header Section -->
      <div class="faq-header">
        <div class="header-icon">
          <i class="fas fa-question-circle"></i>
        </div>
        <h1 class="faq-title">Câu Hỏi Thường Gặp</h1>
        <p class="faq-subtitle">Tìm hiểu các thông tin và giải đáp thắc mắc của bạn</p>
      </div>

      <!-- Search Box -->
      <div class="search-section">
        <div class="search-wrapper">
          <i class="fas fa-search search-icon"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm kiếm câu hỏi..."
            class="search-input"
          />
        </div>
      </div>

      <!-- Categories -->
      <div class="category-tabs">
        <button
          v-for="category in categories"
          :key="category.id"
          :class="['category-tab', { active: selectedCategory === category.id }]"
          @click="selectedCategory = category.id"
        >
          <i :class="category.icon"></i>
          <span>{{ category.name }}</span>
        </button>
      </div>

      <!-- FAQ List -->
      <div class="faq-list">
        <div
          v-for="faq in filteredFAQs"
          :key="faq.id"
          class="faq-item"
        >
          <div class="faq-question" @click="toggleFAQ(faq.id)">
            <div class="question-content">
              <div class="question-icon">
                <i class="fas fa-lightbulb"></i>
              </div>
              <h3>{{ faq.question }}</h3>
            </div>
            <span class="toggle-icon" :class="{ rotated: expandedFAQs.includes(faq.id) }">
              <i class="fas fa-chevron-down"></i>
            </span>
          </div>
          <transition name="fade">
            <div v-if="expandedFAQs.includes(faq.id)" class="faq-answer">
              <p v-html="faq.answer"></p>
              <div class="faq-meta">
                <span class="faq-date">
                  <i class="far fa-calendar-alt"></i>
                  {{ formatDate(faq.date) }}
                </span>
                <span class="faq-category">{{ getCategoryName(faq.categoryId) }}</span>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredFAQs.length === 0" class="empty-state">
        <i class="fas fa-inbox fa-3x"></i>
        <p>Không tìm thấy câu hỏi phù hợp</p>
        <span>Hãy thử tìm kiếm với từ khóa khác</span>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'FAQPage',
  head() {
    return {
      title: 'Câu Hỏi Thường Gặp - FAQ',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Tìm hiểu các câu hỏi thường gặp và giải đáp thắc mắc về dịch vụ của chúng tôi'
        }
      ]
    }
  },
  data() {
    return {
      searchQuery: '',
      selectedCategory: 'all',
      expandedFAQs: [],
      categories: [
        { id: 'all', name: 'Tất cả', icon: 'fas fa-th-large' },
        { id: 'account', name: 'Tài khoản', icon: 'fas fa-user' },
        { id: 'payment', name: 'Thanh toán', icon: 'fas fa-credit-card' },
        { id: 'security', name: 'Bảo mật', icon: 'fas fa-shield-alt' },
        { id: 'trading', name: 'Giao dịch', icon: 'fas fa-exchange-alt' },
        { id: 'technical', name: 'Kỹ thuật', icon: 'fas fa-cog' }
      ],
      faqs: [
        {
          id: 1,
          categoryId: 'account',
          question: 'Làm thế nào để đăng ký tài khoản trên ACCGAME247?',
          answer: 'Để đăng ký tài khoản:<br/>1. Click vào nút "ĐĂNG KÝ" ở góc trên bên phải<br/>2. Điền đầy đủ thông tin: Tên đăng nhập, Email, Mật khẩu<br/>3. Xác nhận đăng ký<br/>4. Kiểm tra email để kích hoạt tài khoản (nếu có)<br/>5. Đăng nhập và bắt đầu mua sắm',
          date: '2024-12-28'
        },
        {
          id: 2,
          categoryId: 'account',
          question: 'Quên mật khẩu tài khoản, tôi phải làm sao?',
          answer: 'Nếu quên mật khẩu:<br/>1. Vào trang đăng nhập<br/>2. Click "Quên mật khẩu"<br/>3. Nhập email đã đăng ký<br/>4. Kiểm tra email và làm theo hướng dẫn để đặt lại mật khẩu<br/>5. Hoặc liên hệ hotline 0336.856.626 để được hỗ trợ',
          date: '2024-12-28'
        },
        {
          id: 3,
          categoryId: 'payment',
          question: 'Các phương thức nạp tiền được hỗ trợ?',
          answer: 'Chúng tôi hỗ trợ nhiều phương thức nạp tiền:<br/>✅ <strong>Thẻ cào tự động</strong> - Viettel, Mobifone, Vinaphone<br/>✅ <strong>ATM/Internet Banking</strong> - Tất cả ngân hàng tại Việt Nam<br/>✅ <strong>MOMO</strong> - Nạp tự động 24/24 qua QR Code<br/>✅ <strong>ZaloPay, VNPay</strong> - Ví điện tử<br/><br/>Tất cả giao dịch đều tự động và xử lý nhanh chóng!',
          date: '2024-12-28'
        },
        {
          id: 4,
          categoryId: 'payment',
          question: 'Thời gian nạp tiền mất bao lâu?',
          answer: 'Thời gian nạp tiền phụ thuộc vào phương thức:<br/>💳 <strong>Thẻ cào:</strong> 1-5 phút<br/>🏦 <strong>ATM/MOMO:</strong> Tức thì (30 giây - 2 phút)<br/>💰 <strong>Ví điện tử:</strong> Tức thì<br/><br/>Hệ thống xử lý tự động 24/24. Nếu sau 10 phút chưa nhận được tiền, vui lòng liên hệ Zalo: 0336.856.626',
          date: '2024-12-28'
        },
        {
          id: 5,
          categoryId: 'payment',
          question: 'Nạp thẻ cào bị sai mệnh giá, có được hoàn tiền không?',
          answer: 'Về chính sách thẻ cào:<br/>⚠️ <strong>Sai mệnh giá:</strong> Bạn sẽ nhận được số tiền tương ứng với mệnh giá thực tế của thẻ<br/>⚠️ <strong>Thẻ đúng:</strong> Hệ thống tự động cộng tiền sau 1-5 phút<br/>⚠️ <strong>Thẻ sai/lỗi:</strong> Hệ thống từ chối, vui lòng kiểm tra lại mã thẻ<br/><br/>Lưu ý: Chỉ nạp thẻ chưa sử dụng và đúng mệnh giá để tránh mất phí!',
          date: '2024-12-28'
        },
        {
          id: 6,
          categoryId: 'trading',
          question: 'Quy trình mua tài khoản game như thế nào?',
          answer: 'Quy trình mua acc game cực kỳ đơn giản:<br/>1️⃣ <strong>Tìm kiếm:</strong> Duyệt danh mục hoặc tìm kiếm tài khoản phù hợp<br/>2️⃣ <strong>Xem chi tiết:</strong> Kiểm tra thông tin, ảnh, giá cả<br/>3️⃣ <strong>Mua ngay:</strong> Click "MUA NGAY" và xác nhận<br/>4️⃣ <strong>Thanh toán:</strong> Chọn thanh toán bằng số dư hoặc nạp thêm<br/>5️⃣ <strong>Nhận acc:</strong> Thông tin tài khoản sẽ hiển thị ngay sau khi thanh toán thành công<br/><br/>⏱️ Thời gian: Tức thì - Tự động 100%',
          date: '2024-12-28'
        },
        {
          id: 7,
          categoryId: 'trading',
          question: 'Sau khi mua acc, tôi cần làm gì?',
          answer: 'Sau khi mua thành công:<br/>✅ <strong>Kiểm tra thông tin:</strong> Xem lại username, password được cung cấp<br/>✅ <strong>Đăng nhập ngay:</strong> Login vào game/ứng dụng để kiểm tra<br/>✅ <strong>Đổi mật khẩu:</strong> Đổi password ngay để bảo mật<br/>✅ <strong>Liên kết:</strong> Thêm email, SĐT của bạn vào tài khoản<br/>✅ <strong>Báo lỗi:</strong> Nếu có vấn đề, liên hệ ngay trong vòng 24h để được hỗ trợ',
          date: '2024-12-28'
        },
        {
          id: 8,
          categoryId: 'trading',
          question: 'Tài khoản mua có được bảo hành không?',
          answer: 'Chính sách bảo hành:<br/>✅ <strong>Bảo hành 100%:</strong> Nếu tài khoản sai thông tin, không đăng nhập được<br/>✅ <strong>Đổi trả miễn phí:</strong> Trong vòng 24h nếu phát hiện lỗi từ shop<br/>✅ <strong>Hoàn tiền:</strong> Nếu không giải quyết được vấn đề<br/>⚠️ <strong>Lưu ý:</strong> Không bảo hành nếu tài khoản bị khóa do vi phạm điều khoản game hoặc bạn tự thay đổi thông tin',
          date: '2024-12-28'
        },
        {
          id: 9,
          categoryId: 'security',
          question: 'Thông tin cá nhân và giao dịch có được bảo mật?',
          answer: 'Chúng tôi cam kết bảo mật tuyệt đối:<br/>🔒 <strong>Mã hóa SSL:</strong> Tất cả dữ liệu được mã hóa 256-bit<br/>🔒 <strong>Không chia sẻ:</strong> Thông tin của bạn không bao giờ được bán cho bên thứ ba<br/>🔒 <strong>Thanh toán an toàn:</strong> Qua cổng thanh toán uy tín<br/>🔒 <strong>Tuân thủ pháp luật:</strong> Đúng quy định về bảo vệ dữ liệu cá nhân<br/><br/>Yên tâm mua sắm tại ACCGAME247!',
          date: '2024-12-28'
        },
        {
          id: 10,
          categoryId: 'security',
          question: 'Làm sao để bảo mật tài khoản của tôi?',
          answer: 'Để bảo mật tài khoản tốt nhất:<br/>🔐 <strong>Mật khẩu mạnh:</strong> Kết hợp chữ, số, ký tự đặc biệt (ví dụ: Game@2024!)<br/>🔐 <strong>Không chia sẻ:</strong> Không đưa thông tin đăng nhập cho bất kỳ ai<br/>🔐 <strong>Đổi mật khẩu:</strong> Thay đổi định kỳ 3-6 tháng/lần<br/>🔐 <strong>Email an toàn:</strong> Sử dụng email có xác thực 2 lớp<br/>🔐 <strong>Đăng xuất:</strong> Luôn đăng xuất sau khi sử dụng xong',
          date: '2024-12-28'
        },
        {
          id: 11,
          categoryId: 'technical',
          question: 'Tôi gặp lỗi khi thanh toán, phải làm sao?',
          answer: 'Nếu gặp lỗi thanh toán, hãy thử:<br/>1️⃣ Kiểm tra kết nối internet<br/>2️⃣ Xóa cache trình duyệt (Ctrl + Shift + Delete)<br/>3️⃣ Thử lại sau 5 phút<br/>4️⃣ Thử phương thức thanh toán khác<br/>5️⃣ Đảm bảo số dư đủ để thanh toán<br/>6️⃣ Kiểm tra thông tin thẻ/tài khoản chính xác<br/><br/>❌ Vẫn lỗi? Liên hệ ngay:<br/>📞 Hotline: 0336.856.626<br/>💬 Zalo: 0336.856.626',
          date: '2024-12-28'
        },
        {
          id: 12,
          categoryId: 'technical',
          question: 'Website không hiển thị đúng trên điện thoại?',
          answer: 'Nếu website bị lỗi hiển thị trên mobile:<br/>📱 <strong>Xóa cache:</strong> Vào cài đặt trình duyệt → Xóa dữ liệu<br/>📱 <strong>Cập nhật trình duyệt:</strong> Tải phiên bản mới nhất<br/>📱 <strong>Thử trình duyệt khác:</strong> Chrome, Safari, Firefox<br/>📱 <strong>Kiểm tra mạng:</strong> Chuyển từ 4G sang WiFi hoặc ngược lại<br/>📱 <strong>Khởi động lại:</strong> Tắt và bật lại điện thoại<br/><br/>Website được tối ưu 100% cho mobile!',
          date: '2024-12-28'
        },
        {
          id: 13,
          categoryId: 'account',
          question: 'Làm thế nào để xem lịch sử giao dịch?',
          answer: 'Để xem lịch sử giao dịch:<br/>1. Đăng nhập vào tài khoản<br/>2. Vào mục "TÀI KHOẢN" ở góc trên<br/>3. Chọn các tab:<br/>   • <strong>Lịch sử nạp thẻ:</strong> Xem các giao dịch nạp tiền<br/>   • <strong>Lịch sử mua acc:</strong> Danh sách tài khoản đã mua<br/>   • <strong>Lịch sử giao dịch:</strong> Tất cả các giao dịch<br/><br/>Mọi thông tin đều được lưu trữ và hiển thị chi tiết!',
          date: '2024-12-28'
        },
        {
          id: 14,
          categoryId: 'trading',
          question: 'Tôi có thể yêu cầu hoàn tiền không?',
          answer: 'Chính sách hoàn tiền:<br/>✅ <strong>Được hoàn tiền khi:</strong><br/>   • Tài khoản không đúng mô tả<br/>   • Không đăng nhập được<br/>   • Sai thông tin so với quảng cáo<br/>   • Lỗi từ phía shop<br/><br/>❌ <strong>KHÔNG hoàn tiền khi:</strong><br/>   • Đã đăng nhập và sử dụng<br/>   • Tự ý thay đổi thông tin<br/>   • Vi phạm điều khoản game<br/>   • Quá 24h kể từ lúc mua<br/><br/>⏰ Yêu cầu hoàn tiền trong vòng 24h sau khi mua',
          date: '2024-12-28'
        },
        {
          id: 15,
          categoryId: 'payment',
          question: 'Nạp ATM/MOMO tự động hoạt động như thế nào?',
          answer: 'Hệ thống nạp ATM/MOMO tự động:<br/>1️⃣ Click "NẠP ATM/MOMO TỰ ĐỘNG 24/24" ở menu<br/>2️⃣ Nhập số tiền muốn nạp (tối thiểu 10.000đ)<br/>3️⃣ Hệ thống tạo QR Code riêng cho bạn<br/>4️⃣ Mở app Momo hoặc Banking quét mã<br/>5️⃣ Xác nhận chuyển khoản<br/>6️⃣ Tiền tự động vào tài khoản sau 30 giây<br/><br/>🎉 Nhanh chóng - An toàn - Tự động 24/24!',
          date: '2024-12-28'
        }
      ]
    }
  },
  computed: {
    filteredFAQs() {
      let result = this.faqs

      // Filter by category
      if (this.selectedCategory !== 'all') {
        result = result.filter(faq => faq.categoryId === this.selectedCategory)
      }

      // Filter by search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        result = result.filter(faq => 
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query)
        )
      }

      return result
    }
  },
  methods: {
    toggleFAQ(id) {
      const index = this.expandedFAQs.indexOf(id)
      if (index > -1) {
        this.expandedFAQs.splice(index, 1)
      } else {
        this.expandedFAQs.push(id)
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    getCategoryName(categoryId) {
      const category = this.categories.find(cat => cat.id === categoryId)
      return category ? category.name : ''
    },
    contactSupport() {
      // Navigate to contact page or open chat support
      this.$toast.info('Đang chuyển đến trang liên hệ...')
      // this.$router.push('/contact')
    }
  }
}
</script>
<style scoped>
.faq-page {
  min-height: 100vh;
  background: #fbfcfd;
  padding: 56px 20px;
  position: relative;
}

.faq-container {
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* Header */
.faq-header {
  text-align: center;
  margin-bottom: 40px;
  color: #111827;
}

.header-icon {
  display: inline-flex;
  width: 72px;
  height: 72px;
  background: rgba(242, 138, 89, 0.06);
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  border: 1px solid rgba(242, 138, 89, 0.12);
}

.header-icon i {
  font-size: 2rem;
  color: #F28A59;
}

.faq-title {
  font-size: 2.6rem;
  font-weight: 800;
  margin-bottom: 8px;
  color: #0f172a;
}

.faq-subtitle {
  font-size: 1.05rem;
  opacity: 0.85;
  font-weight: 400;
  color: #475569;
}

/* Search Section */
.search-section {
  margin-bottom: 30px;
}

.search-wrapper {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.search-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: #F28A59;
  font-size: 1.1rem;
}

.search-input {
  width: 100%;
  padding: 13px 18px 13px 48px;
  font-size: 0.99rem;
  border: 1px solid #eef2f6;
  border-radius: 999px;
  outline: none;
  transition: all 0.15s ease;
  background: #ffffff;
  color: #0f172a;
  box-shadow: 0 1px 6px rgba(16, 24, 40, 0.06);
}

.search-input:focus {
  border-color: rgba(242,138,89,0.5);
  box-shadow: 0 8px 20px rgba(242,138,89,0.06);
}

.search-input::placeholder {
  color: #94a3b8;
}

/* Category Tabs */
.category-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 28px;
  flex-wrap: wrap;
  justify-content: center;
}

.category-tab {
  padding: 10px 18px;
  background: #ffffff;
  color: #334155;
  border: 1px solid #e6e9ee;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-tab:hover {
  transform: translateY(-1px);
}

.category-tab.active {
  background: #F28A59;
  color: white;
  border-color: #F28A59;
}

.category-tab i {
  font-size: 0.95rem;
}

/* FAQ List */
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.faq-item {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.12s ease;
  border: 1px solid #eef2f6;
}

.faq-item:hover {
  transform: translateY(-2px);
  border-color: rgba(242,138,89,0.08);
  box-shadow: 0 3px 10px rgba(16,24,40,0.06);
}

.faq-question {
  padding: 20px 22px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: transparent;
  color: #0f172a;
}

.question-content {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
}

.question-icon {
  width: 40px;
  height: 40px;
  background: rgba(242,138,89,0.05);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid rgba(242,138,89,0.1);
}

.question-icon i {
  font-size: 1.1rem;
  color: #F28A59;
}

.faq-question h3 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.4;
  color: #0f172a;
}

.toggle-icon {
  font-size: 1.1rem;
  min-width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(242,138,89,0.05);
  border-radius: 50%;
  transition: transform 0.12s ease, background 0.12s ease;
  color: #F28A59;
}

.toggle-icon.rotated {
  transform: rotate(180deg);
  background: #F28A59;
  color: white;
}

.faq-answer {
  padding: 20px 22px;
  background: #ffffff;
  border-top: 1px solid #eef2f6;
}

.faq-answer p {
  margin: 0 0 12px 0;
  line-height: 1.7;
  color: #334155;
  font-size: 0.98rem;
}

.faq-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #eef2f6;
  font-size: 0.9rem;
  color: #64748b;
}

.faq-date {
  display: flex;
  align-items: center;
  gap: 8px;
  font-style: italic;
}

.faq-date i {
  color: #F28A59;
}

.faq-category {
  background: #F28A59;
  color: white;
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 600;
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: all 0.28s ease;
  max-height: 1000px;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 56px 20px;
  background: #ffffff;
  border-radius: 12px;
  color: #64748b;
  border: 1px solid #eef2f6;
}

.empty-state i {
  color: #F28A59;
  margin-bottom: 18px;
  opacity: 0.9;
}

.empty-state p {
  font-size: 1.15rem;
  margin: 0 0 8px 0;
  font-weight: 700;
  color: #0f172a;
}

.empty-state span {
  font-size: 0.98rem;
  color: #64748b;
}

/* Contact Section */
.contact-section {
  margin-top: 40px;
  padding: 36px 28px;
  background: #ffffff;
  border-radius: 12px;
  text-align: center;
  position: relative;
  overflow: hidden;
  border: 1px solid #eef2f6;
}

.contact-icon {
  display: inline-block;
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #F28A59, #ff7d4d);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 18px;
  position: relative;
}

.contact-icon i {
  font-size: 1.7rem;
  color: white;
}

.contact-section h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #0f172a;
  font-weight: 700;
}

.contact-section p {
  color: #475569;
  margin-bottom: 18px;
  font-size: 0.98rem;
}

.contact-button {
  padding: 12px 32px;
  background: linear-gradient(135deg, #F28A59, #ff7d4d);
  color: white;
  border: none;
  border-radius: 999px;
  font-size: 0.98rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.18s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.contact-button:hover {
  transform: translateY(-2px);
}

.contact-button i {
  font-size: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .faq-page {
    padding: 40px 15px;
  }

  .faq-title {
    font-size: 2rem;
  }

  .faq-subtitle {
    font-size: 0.98rem;
  }

  .header-icon {
    width: 56px;
    height: 56px;
  }

  .header-icon i {
    font-size: 1.6rem;
  }

  .category-tabs {
    gap: 8px;
  }

  .category-tab {
    padding: 8px 14px;
    font-size: 0.9rem;
  }

  .faq-question {
    padding: 14px 16px;
  }

  .question-icon {
    width: 34px;
    height: 34px;
  }

  .question-icon i {
    font-size: 0.95rem;
  }

  .faq-question h3 {
    font-size: 0.98rem;
  }

  .faq-answer {
    padding: 16px;
  }

  .contact-section {
    padding: 28px 20px;
  }

  .contact-section h3 {
    font-size: 1.25rem;
  }

  .contact-button {
    padding: 10px 24px;
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .category-tab span {
    display: none;
  }

  .category-tab {
    padding: 8px 12px;
  }

  .search-input {
    padding: 12px 16px 12px 44px;
    font-size: 0.95rem;
  }
}
</style>
