import Vue from 'vue'
import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"

Vue.use(Toast, {
  timeout: 2000,
  closeOnClick: true,
  position: "top-right",
  transition: "Vue-Toastification--fade",
  maxToasts: 5,
  newestOnTop: true,
  
  // Custom styling
  toastClassName: "custom-toast",
  bodyClassName: "custom-toast-body",
  
  // Customize icons
  icon: true,
  closeButton: "button",
  
  // Toast classes for different types
  classes: {
    success: "toast-success",
    error: "toast-error",
    info: "toast-info",
    warning: "toast-warning",
    default: "toast-default"
  }
})

// CSS custom styles
const style = document.createElement('style')
style.textContent = `
  .custom-toast {
    padding: 16px !important;
    border-radius: 12px !important;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    animation: slideInRight 0.3s ease-out;
  }

  .custom-toast-body {
    font-size: 14px;
    font-weight: 500;
    padding: 0 !important;
  }

  /* Success Toast */
  .toast-success {
    background: #f0fdf4 !important;
    color: #166534 !important;
    border: 1px solid #dcfce7 !important;
  }

  .toast-success .Toastification__icon {
    color: #16a34a;
  }

  /* Error Toast */
  .toast-error {
    background: #fef2f2 !important;
    color: #7f1d1d !important;
    border: 1px solid #fee2e2 !important;
  }

  .toast-error .Toastification__icon {
    color: #dc2626;
  }

  /* Info Toast */
  .toast-info {
    background: #eff6ff !important;
    color: #1e40af !important;
    border: 1px solid #dbeafe !important;
  }

  .toast-info .Toastification__icon {
    color: #2563eb;
  }

  /* Warning Toast */
  .toast-warning {
    background: #fffbeb !important;
    color: #92400e !important;
    border: 1px solid #fef3c7 !important;
  }

  .toast-warning .Toastification__icon {
    color: #d97706;
  }

  /* Default Toast */
  .toast-default {
    background: #f5f3ff !important;
    color: #4c1d95 !important;
    border: 1px solid #ede9fe !important;
  }

  .toast-default .Toastification__icon {
    color: #7c3aed;
  }

  /* Close button styling */
  .Toastification__closeButton {
    color: white !important;
    opacity: 0.8;
    transition: opacity 0.2s;
  }

  .Toastification__closeButton:hover {
    opacity: 1;
  }

  /* Animation */
  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  /* Progress bar styling */
  .Toastification__progressBar {
    background: rgba(255, 255, 255, 0.3) !important;
    height: 3px !important;
  }
`

document.head.appendChild(style)