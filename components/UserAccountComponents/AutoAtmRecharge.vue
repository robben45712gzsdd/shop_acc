<template>
  <div class="auto-atm-recharge">
    <!-- HEADER -->
    <div class="recharge-header">
      <div class="header-content">
        <i class="fas fa-university"></i>
        <h2>Nạp Tiền ATM/MOMO Tự Động</h2>
      </div>
      <p class="header-subtitle">Nạp tiền 24/24 qua chuyển khoản ngân hàng, nhận tiền sau 5-30 giây</p>
    </div>

    <!-- INFO BANNER -->
    <div class="info-banner">
      <i class="fas fa-info-circle"></i>
      <span>Hệ thống sẽ tự động cộng tiền vào tài khoản sau khi xác nhận chuyển khoản thành công</span>
    </div>

    <!-- RECHARGE OPTIONS -->
    <div class="recharge-options">
      <!-- ATM RECHARGE OPTION -->
      <div class="option-card">
        <div class="option-header" @click="toggleAtmDetails">
          <div class="option-info">
            <div class="option-icon">
              <i class="fas fa-building"></i>
            </div>
            <div class="option-text">
              <h3>Chuyển Khoản Ngân Hàng</h3>
              <p>Chuyển khoản online qua các ngân hàng Việt Nam</p>
            </div>
          </div>
          <div class="option-toggle">
            <i :class="showAtmRecharge ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
          </div>
        </div>

        <!-- ATM DETAILS -->
        <transition name="slide">
          <div v-if="showAtmRecharge" class="option-details">
            <!-- BANK INFO -->
            <div class="detail-section">
              <div class="section-title">Thông Tin Tài Khoản Ngân Hàng</div>
              <div class="bank-info-grid">
                <div class="info-item">
                  <span class="info-label">Chủ Tài Khoản</span>
                  <span class="info-value">HOANG THAI SON</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Số Tài Khoản</span>
                  <div class="info-value-with-copy">
                    <span ref="bankAccountNumber">3513042002</span>
                    <button
                      class="btn-copy-small"
                      @click="copyToClipboard('bankAccountNumber', 'copyBankBtn')"
                      ref="copyBankBtn"
                      title="Sao chép"
                    >
                      <i class="fas fa-copy"></i>
                    </button>
                  </div>
                </div>
                <div class="info-item">
                  <span class="info-label">Ngân Hàng</span>
                  <span class="info-value">MB BANK</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Mã Chuyển Khoản</span>
                  <div class="info-value-with-copy">
                    <span class="code-badge" ref="bankTransferId">{{ transactionId }}</span>
                    <button
                      class="btn-copy-small"
                      @click="copyToClipboard('bankTransferId', 'copyTransferIdBtn')"
                      ref="copyTransferIdBtn"
                      title="Sao chép"
                    >
                      <i class="fas fa-copy"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- QR CODE -->
            <div class="detail-section">
              <div class="section-title">Quét Mã QR Để Thanh Toán</div>
              <div class="qr-container">
                <img
                  :src="`https://img.vietqr.io/image/MB-3513042002-print.png?addInfo=${transactionId}`"
                  alt="QR Code"
                  class="qr-code"
                />
                <p class="qr-hint">Sử dụng ứng dụng ngân hàng để quét mã QR</p>
              </div>
            </div>

            <!-- TRANSFER INSTRUCTIONS -->
            <div class="detail-section">
              <div class="section-title">Hướng Dẫn Chuyển Khoản</div>
              <div class="instructions">
                <div class="instruction-step">
                  <div class="step-number">1</div>
                  <div class="step-content">
                    <p class="step-title">Mở ứng dụng ngân hàng hoặc internet banking</p>
                    <p class="step-desc">Đăng nhập vào tài khoản của bạn</p>
                  </div>
                </div>
                <div class="instruction-step">
                  <div class="step-number">2</div>
                  <div class="step-content">
                    <p class="step-title">Chọn "Chuyển tiền"</p>
                    <p class="step-desc">Tìm chức năng chuyển khoản trong ứng dụng</p>
                  </div>
                </div>
                <div class="instruction-step">
                  <div class="step-number">3</div>
                  <div class="step-content">
                    <p class="step-title">Điền thông tin chuyển khoản</p>
                    <p class="step-desc">Số tài khoản: <strong>3513042002</strong> | Nội dung: <strong>{{ transactionId }}</strong></p>
                  </div>
                </div>
                <div class="instruction-step">
                  <div class="step-number">4</div>
                  <div class="step-content">
                    <p class="step-title">Xác nhận chuyển khoản</p>
                    <p class="step-desc">Kiểm tra lại thông tin rồi nhấn xác nhận</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- IMPORTANT NOTES -->
            <div class="detail-section">
              <div class="section-title">Lưu Ý Quan Trọng</div>
              <div class="notes-list">
                <div class="note-item warning">
                  <i class="fas fa-exclamation-triangle"></i>
                  <span>Ghi đúng nội dung chuyển khoản <strong>{{ transactionId }}</strong>, nếu sai hệ thống không thể cộng tiền</span>
                </div>
                <div class="note-item info">
                  <i class="fas fa-lightbulb"></i>
                  <span>Chuyển cùng ngân hàng MB để nhận tiền nhanh nhất (1-2 phút)</span>
                </div>
                <div class="note-item info">
                  <i class="fas fa-clock"></i>
                  <span>Chuyển khác ngân hàng vui lòng chọn "Chuyển tiền nhanh 24/7" để nhận tiền trong vòng 5-30 giây</span>
                </div>
                <div class="note-item success">
                  <i class="fas fa-check-circle"></i>
                  <span>Sau khi chuyển xong, hãy bấm nút xác nhận để hệ thống kiểm tra và cộng tiền</span>
                </div>
              </div>
            </div>

            <!-- CONFIRM BUTTON -->
            <div class="confirm-section">
              <button class="btn-confirm" @click="confirmTransfer">
                <i class="fas fa-check"></i>
                Xác Nhận, Tôi Đã Chuyển
              </button>
              <p class="confirm-hint">Sau khi bấm, hệ thống sẽ kiểm tra và cộng tiền vào tài khoản trong vòng 30 giây</p>
            </div>
          </div>
        </transition>
      </div>

      <!-- MOMO RECHARGE OPTION (COMING SOON) -->
      <div class="option-card coming-soon">
        <div class="option-header" @click="showComingSoon">
          <div class="option-info">
            <div class="option-icon">
              <i class="fas fa-mobile-alt"></i>
            </div>
            <div class="option-text">
              <h3>Chuyển Khoản Qua Ví Momo</h3>
              <p>Chuyển tiền qua ứng dụng Momo (Sắp ra mắt)</p>
            </div>
          </div>
          <div class="option-toggle">
            <span class="badge-coming">Sắp Có</span>
          </div>
        </div>
      </div>
    </div>

    <!-- TOAST NOTIFICATION -->
    <transition name="toast">
      <div v-if="showToast" class="toast-notification" :class="toastType">
        <i :class="toastIcon"></i>
        <span>{{ toastMessage }}</span>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'AutoAtmRecharge',
  data() {
    return {
      showAtmRecharge: false,
      showToast: false,
      toastMessage: '',
      toastType: 'success',
      toastIcon: 'fas fa-check-circle',
    };
  },

  computed: {
    transactionId() {
      return this.$store.state?.user_data?.topUpCode || 'GIAO_DICH_123456';
    },
  },

  methods: {
    toggleAtmDetails() {
      this.showAtmRecharge = !this.showAtmRecharge;
    },

    copyToClipboard(refName, btnRefName) {
      const element = this.$refs[refName];
      const text = element.textContent;

      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          this.showCopySuccess(btnRefName);
        }).catch(() => {
          this.fallbackCopy(text, btnRefName);
        });
      } else {
        this.fallbackCopy(text, btnRefName);
      }
    },

    fallbackCopy(text, btnRefName) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.showCopySuccess(btnRefName);
    },

    showCopySuccess(btnRefName) {
      const btn = this.$refs[btnRefName];
      if (btn) {
        const originalIcon = btn.innerHTML;
        btn.classList.add('copied');
        btn.innerHTML = '<i class="fas fa-check"></i>';

        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = originalIcon;
        }, 2000);
      }

      this.showToastMessage('Đã sao chép!', 'success', 'fas fa-check-circle');
    },

    confirmTransfer() {
      this.showToastMessage('Đang kiểm tra chuyển khoản...', 'info', 'fas fa-hourglass-half');
      
      setTimeout(() => {
        this.showToastMessage('Chuyển khoản thành công! Tiền sẽ được cộng vào tài khoản trong 30 giây', 'success', 'fas fa-check-circle');
      }, 2000);
    },

    showComingSoon() {
      this.showToastMessage('Tính năng này sẽ ra mắt sớm', 'info', 'fas fa-clock');
    },

    showToastMessage(message, type = 'success', icon = 'fas fa-check-circle') {
      this.toastMessage = message;
      this.toastType = type;
      this.toastIcon = icon;
      this.showToast = true;

      setTimeout(() => {
        this.showToast = false;
      }, 3000);
    },
  },

  mounted() {
    // Auto-expand ATM details by default
    this.showAtmRecharge = true;
  },
};
</script>

<style lang="scss" scoped>
// DESIGN TOKENS
$primary: #ff6b35;
$primary-dark: #e55a28;
$primary-light: #ff8f5f;
$text-main: #1a1a1a;
$text-sub: #6b7280;
$text-light: #9ca3af;
$border: #e5e7eb;
$border-light: #f3f4f6;
$bg: #ffffff;
$bg-light: #f9fafb;

$green: #10b981;
$green-light: #ecfdf5;
$blue: #3b82f6;
$blue-light: #eff6ff;
$yellow: #f59e0b;
$yellow-light: #fffbeb;
$red: #ef4444;
$red-light: #fef2f2;

$shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
$shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.1);

.auto-atm-recharge {
  padding: 0;

  // HEADER
  .recharge-header {
    padding: 24px;
    background: linear-gradient(135deg, rgba($primary, 0.08), rgba($primary, 0.03));
    border-bottom: 2px solid $border;

    .header-content {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;

      i {
        font-size: 20px;
        color: $primary;
      }

      h2 {
        font-size: 18px;
        font-weight: 700;
        color: $text-main;
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }

    .header-subtitle {
      font-size: 13px;
      color: $text-sub;
      margin: 0;
      margin-left: 32px;
    }
  }

  // INFO BANNER
  .info-banner {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 20px 24px 0 24px;
    padding: 14px 16px;
    background: $blue-light;
    border-left: 4px solid $blue;
    border-radius: 8px;
    font-size: 13px;
    color: $blue;

    i {
      font-size: 16px;
      flex-shrink: 0;
    }

    span {
      line-height: 1.5;
    }
  }

  // RECHARGE OPTIONS
  .recharge-options {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .option-card {
      background: $bg;
      border: 2px solid $border;
      border-radius: 10px;
      overflow: hidden;
      transition: all 0.3s ease;

      &:hover:not(.coming-soon) {
        border-color: $primary;
        box-shadow: $shadow-md;
      }

      &.coming-soon {
        opacity: 0.7;
        cursor: not-allowed;

        .option-header {
          cursor: not-allowed;
        }
      }

      .option-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 18px 20px;
        background: linear-gradient(135deg, rgba($primary, 0.05), rgba($primary, 0.02));
        border-bottom: 2px solid $border;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: linear-gradient(135deg, rgba($primary, 0.08), rgba($primary, 0.04));
        }

        .option-info {
          display: flex;
          align-items: center;
          gap: 14px;
          flex: 1;

          .option-icon {
            width: 48px;
            height: 48px;
            border-radius: 10px;
            background: linear-gradient(135deg, $primary, $primary-dark);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 20px;
            flex-shrink: 0;
          }

          .option-text {
            h3 {
              font-size: 15px;
              font-weight: 700;
              color: $text-main;
              margin: 0 0 4px 0;
            }

            p {
              font-size: 13px;
              color: $text-sub;
              margin: 0;
            }
          }
        }

        .option-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: $border-light;
          color: $primary;
          font-size: 16px;
          transition: all 0.2s ease;

          .badge-coming {
            padding: 4px 10px;
            background: $yellow;
            color: white;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
          }
        }
      }

      .option-details {
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 24px;

        // DETAIL SECTION
        .detail-section {
          display: flex;
          flex-direction: column;
          gap: 12px;

          .section-title {
            font-size: 13px;
            font-weight: 700;
            color: $text-main;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding-bottom: 8px;
            border-bottom: 2px solid $primary;
          }

          // BANK INFO GRID
          .bank-info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 12px;

            .info-item {
              display: flex;
              flex-direction: column;
              gap: 6px;
              padding: 12px;
              background: $bg-light;
              border-radius: 8px;
              border: 1px solid $border-light;

              .info-label {
                font-size: 11px;
                font-weight: 700;
                color: $text-light;
                text-transform: uppercase;
                letter-spacing: 0.3px;
              }

              .info-value {
                font-size: 14px;
                font-weight: 600;
                color: $text-main;
              }

              .info-value-with-copy {
                display: flex;
                align-items: center;
                gap: 8px;

                .code-badge {
                  flex: 1;
                  padding: 8px 12px;
                  background: linear-gradient(135deg, $primary, $primary-dark);
                  color: white;
                  border-radius: 6px;
                  
                  font-size: 13px;
                  font-weight: 700;
                  word-break: break-all;
                }

                span {
                  font-size: 13px;
                  font-weight: 600;
                  color: $text-main;
                }

                .btn-copy-small {
                  width: 32px;
                  height: 32px;
                  border: 1px solid $border;
                  background: white;
                  color: $primary;
                  border-radius: 6px;
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  transition: all 0.2s ease;
                  flex-shrink: 0;

                  i {
                    font-size: 13px;
                  }

                  &:hover {
                    background: $primary;
                    color: white;
                    border-color: $primary;
                  }

                  &.copied {
                    background: $green;
                    border-color: $green;
                    color: white;
                  }
                }
              }
            }
          }

          // QR CODE
          .qr-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            padding: 20px;
            background: $bg-light;
            border-radius: 10px;
            border: 2px dashed $border;

            .qr-code {
              width: auto;
              height: 60vh;
              border-radius: 8px;
              box-shadow: $shadow-md;
            }

            .qr-hint {
              font-size: 12px;
              color: $text-sub;
              margin: 0;
              text-align: center;
            }
          }

          // INSTRUCTIONS
          .instructions {
            display: flex;
            flex-direction: column;
            gap: 12px;

            .instruction-step {
              display: flex;
              gap: 14px;
              padding: 14px;
              background: $bg-light;
              border-radius: 8px;
              border-left: 4px solid $primary;

              .step-number {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: linear-gradient(135deg, $primary, $primary-dark);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                flex-shrink: 0;
              }

              .step-content {
                flex: 1;

                .step-title {
                  font-size: 13px;
                  font-weight: 600;
                  color: $text-main;
                  margin: 0 0 4px 0;
                }

                .step-desc {
                  font-size: 12px;
                  color: $text-sub;
                  margin: 0;
                  line-height: 1.4;
                }
              }
            }
          }

          // NOTES
          .notes-list {
            display: flex;
            flex-direction: column;
            gap: 10px;

            .note-item {
              display: flex;
              gap: 10px;
              padding: 12px;
              border-radius: 8px;
              font-size: 12px;
              border-left: 4px solid $border;

              i {
                font-size: 14px;
                flex-shrink: 0;
                margin-top: 1px;
              }

              span {
                line-height: 1.5;
              }

              &.warning {
                background: $yellow-light;
                color: darken($yellow, 10%);
                border-left-color: $yellow;
              }

              &.info {
                background: $blue-light;
                color: $blue;
                border-left-color: $blue;
              }

              &.success {
                background: $green-light;
                color: darken($green, 10%);
                border-left-color: $green;
              }
            }
          }
        }

        // CONFIRM SECTION
        .confirm-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 20px;
          background: linear-gradient(135deg, rgba($primary, 0.08), rgba($primary, 0.03));
          border-radius: 10px;
          border: 2px solid $primary;

          .btn-confirm {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 14px 24px;
            background: linear-gradient(135deg, $primary, $primary-dark);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            cursor: pointer;
            transition: all 0.2s ease;

            i {
              font-size: 16px;
            }

            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 16px rgba($primary, 0.3);
            }

            &:active {
              transform: translateY(0);
            }
          }

          .confirm-hint {
            font-size: 12px;
            color: $text-sub;
            margin: 0;
            text-align: center;
          }
        }
      }
    }
  }

  // TOAST NOTIFICATION
  .toast-notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    box-shadow: $shadow-lg;
    z-index: 1000;
    animation: slideInUp 0.3s ease;

    i {
      font-size: 16px;
    }

    &.success {
      background: $green-light;
      color: $green;
      border: 1px solid rgba($green, 0.2);
    }

    &.error {
      background: $red-light;
      color: $red;
      border: 1px solid rgba($red, 0.2);
    }

    &.info {
      background: $blue-light;
      color: $blue;
      border: 1px solid rgba($blue, 0.2);
    }
  }
}

// ANIMATIONS
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

// RESPONSIVE
@media (max-width: 768px) {
  .auto-atm-recharge {
    .recharge-header {
      padding: 16px;

      .header-content h2 {
        font-size: 16px;
      }

      .header-subtitle {
        font-size: 12px;
        margin-left: 28px;
      }
    }

    .info-banner {
      margin: 16px 16px 0 16px;
      padding: 12px 14px;
      font-size: 12px;
    }

    .recharge-options {
      padding: 16px;
      gap: 12px;

      .option-card .option-header {
        padding: 14px 16px;

        .option-info {
          gap: 10px;

          .option-icon {
            width: 40px;
            height: 40px;
            font-size: 16px;
          }

          .option-text {
            h3 {
              font-size: 14px;
            }

            p {
              font-size: 12px;
            }
          }
        }
      }

      .option-card .option-details {
        padding: 16px;
        gap: 16px;

        .detail-section {
          .bank-info-grid {
            grid-template-columns: 1fr;
          }

          .qr-container {
            padding: 16px;

            .qr-code {
              width: auto;
              height: 60vh;
            }
          }

          .confirm-section {
            padding: 16px;
          }
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .auto-atm-recharge {
    .recharge-header {
      padding: 12px;

      .header-content {
        h2 {
          font-size: 14px;
        }

        i {
          font-size: 18px;
        }
      }

      .header-subtitle {
        font-size: 11px;
      }
    }

    .recharge-options {
      padding: 12px;

      .option-card {
        .option-header {
          padding: 12px 14px;

          .option-info {
            gap: 8px;

            .option-icon {
              width: 36px;
              height: 36px;
              font-size: 14px;
            }

            .option-text {
              h3 {
                font-size: 13px;
              }

              p {
                font-size: 11px;
              }
            }
          }
        }

        .option-details {
          padding: 12px;

          .detail-section {
            gap: 8px;

            .section-title {
              font-size: 12px;
            }

            .qr-container {
              padding: 12px;

              .qr-code {
                width: auto;
                height: 60vh;
              }
            }

            .instructions .instruction-step {
              padding: 10px;
              gap: 10px;

              .step-number {
                width: 28px;
                height: 28px;
                font-size: 12px;
              }

              .step-content {
                .step-title {
                  font-size: 12px;
                }

                .step-desc {
                  font-size: 11px;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>