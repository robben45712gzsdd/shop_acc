<template>
  <div class="pagination-wrapper" v-if="totalPages > maxVisible">
    <div class="pagination">
      <button class="page-btn prev-btn" :disabled="currentPage === 1" @click="$emit('update:page', currentPage - 1)">
        <i class="fa-chevron-left fas"></i>
      </button>
      <div class="page-numbers">
        <button
          v-for="page in visiblePages"
          :key="page"
          :class="['page-btn', { active: page === currentPage }]"
          @click="$emit('update:page', page)"
        >
          {{ page }}
        </button>
      </div>
      <button class="page-btn next-btn" :disabled="currentPage === totalPages" @click="$emit('update:page', currentPage + 1)">
        <i class="fa-chevron-right fas"></i>
      </button>
    </div>
    <div class="pagination-info">
      <span>Trang {{ currentPage }} / {{ totalPages }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
    maxVisible: {
      type: Number,
      default: 5,
    },
  },
  computed: {
    visiblePages() {
      const pages = [];
      let start = Math.max(1, this.currentPage - Math.floor(this.maxVisible / 2));
      let end = Math.min(this.totalPages, start + this.maxVisible - 1);
      if (end - start < this.maxVisible - 1) start = Math.max(1, end - this.maxVisible + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      return pages;
    },
  },
};
</script>

<style scoped>
/* Giữ nguyên style như bạn đã viết trong AccountCategories.vue */
.pagination-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 50px;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-btn {
  min-width: 40px;
  height: 40px;
  border: 2px solid #e0e0e0;
  background: white;
  color: #1a1a1a;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  border-color: #ff6b35;
  color: #ff6b35;
  transform: translateY(-2px);
}

.page-btn.active {
  background: linear-gradient(135deg, #ff6b35, #ff8c5a);
  color: white;
  border-color: #ff6b35;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 8px;
}

.pagination-info {
  font-size: 13px;
  color: #666;
  font-weight: 600;
}
</style>
