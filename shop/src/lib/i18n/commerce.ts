import type { LocaleCode } from "@/lib/format";

export interface CommerceDictionary {
  cart: {
    metaTitle: string;
    metaDescription: string;
    srHeading: string;
    emptyText: string;
    backToShop: string;
    colProduct: string;
    colPrice: string;
    colQuantity: string;
    colSubtotal: string;
    removeItemAria: (name: string) => string;
    decreaseQtyAria: (name: string) => string;
    increaseQtyAria: (name: string) => string;
    bulkTierApplied: (minQty: number, unitPriceStr: string) => string;
    bulkTierLabel: (minQty: number) => string;
    giftBadge: string;
    giftSubtitle: string;
    continueViewing: string;
    updatingCart: string;
    updateCart: string;
    totalsHeading: string;
    subtotal: string;
    bulkSavings: string;
    promoCode: string;
    shipping: string;
    freeShipping: string;
    shippingCalcNote: string;
    total: string;
    proceedToCheckout: string;
    couponLabel: string;
    couponPlaceholder: string;
    applyCoupon: string;
    couponAppliedPrefix: (code: string, name: string) => string;
    rewardsEyebrow: string;
    chooseYourGift: string;
    giftCounter: (unlocked: boolean) => string;
    giftAutoAttached: (zeroPrice: string) => string;
    giftProgressPrompt: (itemsNeeded: number, rewardTitle: string) => string;
    giftDefaultPrompt: string;
    qtyProgress: (current: number, target: number) => string;
  };
  checkout: {
    metaTitle: string;
    metaDescription: string;
    srHeading: string;
    defaultProvince: string;
    defaultDistrictFallback: string;
    defaultWardFallback: string;
    altPhoneNotePrefix: string;
    errNameRequired: string;
    errPhoneInvalid: string;
    errAddressRequired: string;
    errProvinceRequired: string;
    errAltNameRequired: string;
    errAltAddressRequired: string;
    errNoOrderCode: string;
    errServerConnection: string;
    payosCancelTitle: string;
    payosCancelBody: string;
    haveCouponQuestion: string;
    clickToEnterCoupon: string;
    couponHint: string;
    couponPlaceholder: string;
    couponAriaLabel: string;
    applyBtnUpper: string;
    billingHeading: string;
    fullNameLabel: string;
    fullNamePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    contactExtraLabel: string;
    contactExtraPlaceholder: string;
    addressLabel: string;
    addressPlaceholder: string;
    provinceLabel: string;
    provincePlaceholder: string;
    districtLabel: string;
    districtPlaceholder: string;
    shipToDifferentLabel: string;
    altNameLabel: string;
    altNamePlaceholder: string;
    altPhoneLabel: string;
    altPhonePlaceholder: string;
    altAddressLabel: string;
    altAddressPlaceholder: string;
    additionalInfoHeading: string;
    orderNoteLabel: string;
    orderNotePlaceholder: string;
    yourOrderHeading: string;
    payosTitle: string;
    payosDesc: string;
    codTitle: string;
    codDesc: string;
    submittingBtn: string;
    placeOrderBtn: string;
    supportNote: string;
  };
  orderSuccess: {
    statusMetaTitle: string;
    statusMetaDesc: string;
    receivedMetaTitle: string;
    receivedMetaDesc: string;
    homeCrumb: string;
    checkoutCrumb: string;
    orderCrumb: (code: string) => string;
    notFoundHeading: string;
    notFoundDesc: string;
    trackOrderBtn: string;
    cellOrderCode: string;
    cellDate: string;
    today: string;
    cellTotal: string;
    recorded: string;
    cellPayment: string;
    codOpenBoxSuffix: string;
    qrHeading: (code: string) => string;
    qrSubheading: string;
    reserveCountdownLabel: string;
    qrAlt: (code: string) => string;
    qrReady: string;
    openPayosBtn: string;
    transferAmountLabel: string;
    transferNoteLabel: string;
    copyAriaLabel: string;
    copied: string;
    copy: string;
    continueShoppingBtn: string;
    expiredHeading: string;
    expiredDescPrefix: string;
    expiredDescSuffix: string;
    reorderBtn: string;
    backHomeBtn: string;
    paidHeading: (code: string) => string;
    receivedHeading: (code: string) => string;
    successSubheading: string;
    perksNote: string;
  };
  account: {
    metaTitle: string;
    metaDescription: string;
    srHeading: string;
    defaultAddressLabel: string;
    defaultProvince: string;
    defaultMemberName: string;
    errIdentifierRequired: string;
    errIdentifierInvalid: string;
    otpSentFallback: string;
    errOtpSendFailed: string;
    errLoginFieldsRequired: string;
    errOtpInvalid: string;
    profileSaved: string;
    profileSaveFailed: string;
    lookupNotFound: string;
    headingLogin: string;
    headingLookup: string;
    tabLogin: string;
    tabLookup: string;
    identifierLabel: string;
    identifierPlaceholder: string;
    otpSending: string;
    otpResend: (seconds: number) => string;
    sendOtp: string;
    otpLabel: string;
    otpPlaceholder: string;
    rememberMe: string;
    signingIn: string;
    signInBtn: string;
    forgotPassword: string;
    lookupIntro: string;
    orderCodeLabel: string;
    orderCodePlaceholder: string;
    deliveryPhoneLabel: string;
    deliveryPhonePlaceholder: string;
    lookingUp: string;
    lookupBtn: string;
    resultOrderCode: string;
    resultTotal: string;
    resultPayment: string;
    resultFulfillment: string;
    sidebarAccountLabel: string;
    navDashboard: string;
    navOrders: string;
    navAddresses: string;
    navProfile: string;
    signOut: string;
    greeting: (name: string) => string;
    dashboardIntroBeforeOrders: string;
    dashboardRecentOrders: (count: number) => string;
    dashboardMiddle: string;
    dashboardAddressBook: string;
    dashboardAfter: string;
    orderHistoryHeading: (count: number) => string;
    noOrdersText: string;
    shopNowBtn: string;
    colOrder: string;
    colDate: string;
    colStatus: string;
    colTotal: string;
    colAction: string;
    viewOrderBtn: string;
    addressesHeading: string;
    addAddressBtn: string;
    addrNamePlaceholder: string;
    addrNameAria: string;
    addrPhonePlaceholder: string;
    addrPhoneAria: string;
    addrProvincePlaceholder: string;
    addrProvinceAria: string;
    addrDistrictPlaceholder: string;
    addrDistrictAria: string;
    addrWardPlaceholder: string;
    addrWardAria: string;
    addrStreetPlaceholder: string;
    addrStreetAria: string;
    cancelBtn: string;
    saveAddressBtn: string;
    noAddressesText: string;
    defaultBadge: string;
    deleteAddressAria: string;
    profileHeading: string;
    profileNameLabel: string;
    profilePhoneLabel: string;
    profileEmailLabel: string;
    savingBtn: string;
    saveChangesBtn: string;
  };
  lostPassword: {
    heading: string;
    successPrefix: string;
    successSuffix: string;
    backToLoginBtn: string;
    instructions: string;
    identifierLabel: string;
    identifierPlaceholder: string;
    submitBtn: string;
    backToLoginLink: string;
  };
}

export const COMMERCE_I18N: Record<LocaleCode, CommerceDictionary> = {
  vi: {
    cart: {
      metaTitle: "Giỏ hàng",
      metaDescription: "Xem lại sản phẩm và tiến hành thanh toán tại 11Sport.",
      srHeading: "Giỏ hàng 11Sport",
      emptyText: "Chưa có sản phẩm nào trong giỏ hàng.",
      backToShop: "QUAY TRỞ LẠI CỬA HÀNG",
      colProduct: "SẢN PHẨM",
      colPrice: "GIÁ",
      colQuantity: "SỐ LƯỢNG",
      colSubtotal: "TẠM TÍNH",
      removeItemAria: (name) => `Xóa ${name}`,
      decreaseQtyAria: (name) => `Giảm số lượng ${name}`,
      increaseQtyAria: (name) => `Tăng số lượng ${name}`,
      bulkTierApplied: (minQty, unitPriceStr) =>
        `Giá mua nhiều bậc ${minQty}+: ${unitPriceStr}/sp`,
      bulkTierLabel: (minQty) => `Mua từ ${minQty} sản phẩm cùng biến thể`,
      giftBadge: "Quà tặng",
      giftSubtitle: "Quà tặng 11Sport: Miễn phí",
      continueViewing: "← TIẾP TỤC XEM SẢN PHẨM",
      updatingCart: "ĐANG CẬP NHẬT...",
      updateCart: "CẬP NHẬT GIỎ HÀNG",
      totalsHeading: "TỔNG CỘNG GIỎ HÀNG",
      subtotal: "Tạm tính",
      bulkSavings: "Tiết kiệm Giá Mua Nhiều",
      promoCode: "Mã ưu đãi",
      shipping: "Vận chuyển",
      freeShipping: "Miễn phí vận chuyển",
      shippingCalcNote:
        "Các tùy chọn vận chuyển sẽ được cập nhật trong quá trình thanh toán.",
      total: "Tổng",
      proceedToCheckout: "TIẾN HÀNH THANH TOÁN",
      couponLabel: "Mã ưu đãi",
      couponPlaceholder: "Nhập mã giảm giá",
      applyCoupon: "Áp dụng",
      couponAppliedPrefix: (code, name) => `Đã áp dụng mã ${code}: ${name}`,
      rewardsEyebrow: "11SPORT EXCLUSIVE REWARDS",
      chooseYourGift: "Chọn quà tặng của bạn",
      giftCounter: (unlocked) => (unlocked ? "1 / 1 QUÀ" : "0 / 1 QUÀ"),
      giftAutoAttached: (zeroPrice) =>
        `Tự động đính kèm cùng đơn hàng · Miễn phí ${zeroPrice}`,
      giftProgressPrompt: (itemsNeeded, rewardTitle) =>
        `Mua thêm ${itemsNeeded} sản phẩm để mở khóa: ${rewardTitle}`,
      giftDefaultPrompt:
        "Chọn từ 5 sản phẩm trở lên để nhận áo Polo 11Sport Dry-Fit miễn phí.",
      qtyProgress: (current, target) => `${current} / ${target} SP`,
    },
    checkout: {
      metaTitle: "Thanh toán đơn hàng",
      metaDescription: "Hoàn tất thông tin giao hàng và thanh toán tại 11Sport.",
      srHeading: "Thanh toán đơn hàng 11Sport",
      defaultProvince: "TP. Hồ Chí Minh",
      defaultDistrictFallback: "Trung tâm",
      defaultWardFallback: "Phường trung tâm",
      altPhoneNotePrefix: "SĐT người nhận khác",
      errNameRequired: "Vui lòng nhập họ và tên người nhận.",
      errPhoneInvalid: "Số điện thoại không hợp lệ (VD: 0909 123 456).",
      errAddressRequired: "Vui lòng điền đầy đủ địa chỉ giao hàng.",
      errProvinceRequired: "Vui lòng điền Tỉnh / Thành phố giao hàng.",
      errAltNameRequired: "Vui lòng nhập họ tên người nhận thay thế.",
      errAltAddressRequired: "Vui lòng nhập địa chỉ người nhận thay thế.",
      errNoOrderCode: "Không nhận được mã đơn hàng từ hệ thống.",
      errServerConnection:
        "Không thể kết nối máy chủ đặt hàng. Vui lòng thử lại sau.",
      payosCancelTitle: "Giao dịch thanh toán PayOS đã được hủy",
      payosCancelBody:
        "Các sản phẩm bạn đã chọn vẫn được lưu đầy đủ trong giỏ hàng bên dưới. Bạn có thể chọn lại phương thức thanh toán khác hoặc điều chỉnh đơn hàng để tiếp tục đặt hàng.",
      haveCouponQuestion: "Bạn có mã ưu đãi?",
      clickToEnterCoupon: "Ấn vào đây để nhập mã",
      couponHint:
        "Nếu bạn có mã giảm giá, vui lòng điền vào phía bên dưới (VD: SALE11).",
      couponPlaceholder: "Mã ưu đãi",
      couponAriaLabel: "Mã ưu đãi",
      applyBtnUpper: "ÁP DỤNG",
      billingHeading: "THÔNG TIN THANH TOÁN",
      fullNameLabel: "Họ và Tên",
      fullNamePlaceholder: "Họ và tên",
      phoneLabel: "Số điện thoại",
      phonePlaceholder: "Số điện thoại (VD: 0909 123 456)",
      contactExtraLabel: "Email / WhatsApp (tuỳ chọn)",
      contactExtraPlaceholder: "Email nhận hóa đơn hoặc WhatsApp / Viber",
      addressLabel: "Địa chỉ",
      addressPlaceholder: "Số nhà, tên đường...",
      provinceLabel: "Tỉnh / Thành phố",
      provincePlaceholder: "VD: TP. Hồ Chí Minh",
      districtLabel: "Quận / Huyện (tuỳ chọn)",
      districtPlaceholder: "VD: Quận 10",
      shipToDifferentLabel: "Giao hàng đến một địa chỉ khác?",
      altNameLabel: "Họ tên người nhận",
      altNamePlaceholder: "Tên người nhận hàng",
      altPhoneLabel: "Số điện thoại nhận",
      altPhonePlaceholder: "Số điện thoại người nhận",
      altAddressLabel: "Địa chỉ nhận hàng",
      altAddressPlaceholder: "Số nhà, đường, quận/huyện, tỉnh thành...",
      additionalInfoHeading: "THÔNG TIN BỔ SUNG",
      orderNoteLabel: "Ghi chú đơn hàng (tuỳ chọn)",
      orderNotePlaceholder:
        "Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn.",
      yourOrderHeading: "ĐƠN HÀNG CỦA BẠN",
      payosTitle: "Chuyển khoản ngân hàng QR (VietQR / PayOS)",
      payosDesc:
        "Thanh toán bằng thẻ ATM nội địa, QR VietQR / PayOS, xác nhận tự động 24/7 và ưu tiên đóng gói.",
      codTitle: "Thanh toán khi nhận hàng (COD) · 11Sport liên hệ xác nhận",
      codDesc:
        "Hỗ trợ mở hộp đồng kiểm vợt & quét chip NFC chính hãng trước khi thanh toán.",
      submittingBtn: "ĐANG XỬ LÝ ĐƠN HÀNG...",
      placeOrderBtn: "ĐẶT HÀNG",
      supportNote:
        "Bộ phận CSKH sẽ liên hệ bạn qua số điện thoại để xác nhận đơn hàng.",
    },
    orderSuccess: {
      statusMetaTitle: "Trạng thái đơn hàng",
      statusMetaDesc: "Thông tin xác nhận và thanh toán đơn hàng tại 11Sport.",
      receivedMetaTitle: "Đặt Hàng Thành Công",
      receivedMetaDesc: "Xác nhận đơn hàng và chi tiết thanh toán tại 11Sport.",
      homeCrumb: "Trang chủ",
      checkoutCrumb: "Thanh toán",
      orderCrumb: (code) => `Đơn hàng #${code}`,
      notFoundHeading: "Không tìm thấy mã đơn hàng",
      notFoundDesc:
        "Bạn có thể tra cứu trạng thái đơn hàng bằng mã đơn và số điện thoại.",
      trackOrderBtn: "TRA CỨU ĐƠN HÀNG",
      cellOrderCode: "MÃ ĐƠN HÀNG",
      cellDate: "NGÀY ĐẶT",
      today: "Hôm nay",
      cellTotal: "TỔNG CỘNG",
      recorded: "Đã ghi nhận",
      cellPayment: "THANH TOÁN",
      codOpenBoxSuffix: "Đồng kiểm",
      qrHeading: (code) => `Quét mã QR để hoàn tất thanh toán đơn hàng #${code}`,
      qrSubheading:
        "Hệ thống đang giữ chỗ tồn kho và tự động kiểm tra trạng thái thanh toán.",
      reserveCountdownLabel: "Thời gian giữ chỗ tồn kho còn lại",
      qrAlt: (code) => `Mã QR thanh toán PayOS / VietQR cho đơn ${code}`,
      qrReady: "Mã QR PayOS đang sẵn sàng",
      openPayosBtn: "MỞ CỔNG THANH TOÁN PAYOS",
      transferAmountLabel: "Số tiền cần chuyển:",
      transferNoteLabel: "Nội dung chuyển khoản:",
      copyAriaLabel: "Sao chép mã đơn hàng",
      copied: "Đã chép",
      copy: "Sao chép",
      continueShoppingBtn: "TIẾP TỤC MUA SẮM",
      expiredHeading: "Mã QR thanh toán đã hết hạn",
      expiredDescPrefix: "Đơn hàng",
      expiredDescSuffix:
        "đã quá thời gian giữ chỗ 15 phút và tồn kho đã được hoàn lại.",
      reorderBtn: "ĐẶT LẠI ĐƠN HÀNG",
      backHomeBtn: "VỀ TRANG CHỦ",
      paidHeading: (code) =>
        `Thanh toán thành công! Đơn hàng #${code} đã được xác nhận.`,
      receivedHeading: (code) =>
        `Cảm ơn bạn. Đơn hàng #${code} đã được tiếp nhận!`,
      successSubheading:
        "Chuyên viên CSKH 11Sport sẽ liên hệ qua số điện thoại trong vòng 15 phút để xác nhận và gửi mã vận đơn.",
      perksNote:
        "Mọi kiện hàng tại 11Sport đều được tặng kèm quấn cán, dán viền, bao vợt và hỗ trợ mở hộp đồng kiểm tem NFC chính hãng trước khi thanh toán.",
    },
    account: {
      metaTitle: "Tài khoản khách hàng",
      metaDescription: "Đăng nhập, quản lý đơn hàng và sổ địa chỉ 11Sport.",
      srHeading: "Tài khoản khách hàng 11Sport",
      defaultAddressLabel: "Nhà riêng",
      defaultProvince: "TP. Hồ Chí Minh",
      defaultMemberName: "Thành viên 11Sport",
      errIdentifierRequired:
        "Vui lòng nhập email hoặc số điện thoại để nhận mã OTP.",
      errIdentifierInvalid: "Email hoặc số điện thoại không hợp lệ.",
      otpSentFallback:
        "Mã OTP 6 số đã được gửi. Vui lòng kiểm tra email / tin nhắn.",
      errOtpSendFailed: "Không thể gửi mã OTP lúc này. Vui lòng thử lại.",
      errLoginFieldsRequired:
        "Vui lòng nhập email / số điện thoại và mã OTP 6 số.",
      errOtpInvalid:
        "Mã OTP không chính xác hoặc đã hết hạn. Vui lòng thử lại.",
      profileSaved: "Đã lưu thông tin tài khoản 11Sport thành công.",
      profileSaveFailed: "Không thể lưu thay đổi lúc này. Vui lòng thử lại.",
      lookupNotFound:
        "Không tìm thấy đơn hàng khớp với mã đơn và số điện thoại.",
      headingLogin: "ĐĂNG NHẬP",
      headingLookup: "TRA CỨU ĐƠN HÀNG",
      tabLogin: "Đăng nhập tài khoản",
      tabLookup: "Tra cứu đơn hàng",
      identifierLabel: "Email hoặc số điện thoại",
      identifierPlaceholder: "VD: khachhang@11sport.vn hoặc 0909 123 456",
      otpSending: "ĐANG GỬI...",
      otpResend: (seconds) => `GỬI LẠI (${seconds}s)`,
      sendOtp: "Gửi mã OTP",
      otpLabel: "Mã xác thực OTP",
      otpPlaceholder: "Nhập mã OTP 6 số (Mock: 123456)",
      rememberMe: "Ghi nhớ phiên đăng nhập",
      signingIn: "ĐANG ĐĂNG NHẬP...",
      signInBtn: "ĐĂNG NHẬP",
      forgotPassword: "Quên mật khẩu?",
      lookupIntro:
        "Nhập mã đơn hàng (VD: ONL-20261120-0188) và số điện thoại nhận hàng.",
      orderCodeLabel: "Mã đơn hàng",
      orderCodePlaceholder: "ONL-20261120-0188",
      deliveryPhoneLabel: "Số điện thoại nhận hàng",
      deliveryPhonePlaceholder: "0909 123 456",
      lookingUp: "ĐANG TRA CỨU...",
      lookupBtn: "TRA CỨU ĐƠN HÀNG",
      resultOrderCode: "Mã đơn:",
      resultTotal: "Tổng thanh toán:",
      resultPayment: "Thanh toán:",
      resultFulfillment: "Trạng thái giao:",
      sidebarAccountLabel: "Tài khoản",
      navDashboard: "Bảng điều khiển",
      navOrders: "Đơn hàng của tôi",
      navAddresses: "Địa chỉ giao nhận",
      navProfile: "Chi tiết tài khoản",
      signOut: "Đăng xuất",
      greeting: (name) => `Xin chào, ${name}`,
      dashboardIntroBeforeOrders:
        "Từ trang quản trị tài khoản 11Sport, bạn có thể theo dõi lịch sử ",
      dashboardRecentOrders: (count) => `đơn hàng gần đây (${count})`,
      dashboardMiddle: ", quản lý ",
      dashboardAddressBook: "sổ địa chỉ giao hàng",
      dashboardAfter:
        " và cập nhật thông tin cá nhân để nhận ưu đãi thành viên.",
      orderHistoryHeading: (count) => `Lịch sử đơn hàng (${count})`,
      noOrdersText: "Bạn chưa có đơn hàng nào tại 11Sport.",
      shopNowBtn: "MUA SẮM NGAY",
      colOrder: "Đơn hàng",
      colDate: "Ngày đặt",
      colStatus: "Trạng thái",
      colTotal: "Tổng cộng",
      colAction: "Thao tác",
      viewOrderBtn: "Xem",
      addressesHeading: "Sổ địa chỉ giao hàng",
      addAddressBtn: "Thêm địa chỉ",
      addrNamePlaceholder: "Họ và tên người nhận",
      addrNameAria: "Họ và tên người nhận",
      addrPhonePlaceholder: "Số điện thoại (VD: 0909 123 456)",
      addrPhoneAria: "Số điện thoại người nhận",
      addrProvincePlaceholder: "Tỉnh/TP",
      addrProvinceAria: "Tỉnh hoặc Thành phố",
      addrDistrictPlaceholder: "Quận/Huyện",
      addrDistrictAria: "Quận hoặc Huyện",
      addrWardPlaceholder: "Phường/Xã",
      addrWardAria: "Phường hoặc Xã",
      addrStreetPlaceholder: "Số nhà, tên đường",
      addrStreetAria: "Số nhà và tên đường",
      cancelBtn: "Hủy",
      saveAddressBtn: "Lưu địa chỉ",
      noAddressesText: "Chưa có địa chỉ nào được lưu.",
      defaultBadge: "Mặc định",
      deleteAddressAria: "Xóa địa chỉ",
      profileHeading: "Chi tiết tài khoản",
      profileNameLabel: "Họ và tên",
      profilePhoneLabel: "Số điện thoại",
      profileEmailLabel: "Email",
      savingBtn: "ĐANG LƯU...",
      saveChangesBtn: "LƯU THAY ĐỔI",
    },
    lostPassword: {
      heading: "QUÊN MẬT KHẨU",
      successPrefix: "Liên kết đặt lại mật khẩu đã được gửi tới",
      successSuffix: ". Vui lòng kiểm tra hộp thư của bạn.",
      backToLoginBtn: "QUAY LẠI ĐĂNG NHẬP",
      instructions:
        "Quên mật khẩu? Vui lòng nhập tên đăng nhập hoặc địa chỉ email. Bạn sẽ nhận được một liên kết tạo mật khẩu mới qua email.",
      identifierLabel: "Tên đăng nhập hoặc email",
      identifierPlaceholder: "Nhập email hoặc tên tài khoản...",
      submitBtn: "ĐẶT LẠI MẬT KHẨU",
      backToLoginLink: "← Quay lại trang Đăng nhập",
    },
  },
  en: {
    cart: {
      metaTitle: "Shopping Cart",
      metaDescription:
        "Review your items and proceed to checkout at 11Sport.",
      srHeading: "11Sport Shopping Cart",
      emptyText: "Your shopping cart is currently empty.",
      backToShop: "RETURN TO SHOP",
      colProduct: "PRODUCT",
      colPrice: "PRICE",
      colQuantity: "QUANTITY",
      colSubtotal: "SUBTOTAL",
      removeItemAria: (name) => `Remove ${name}`,
      decreaseQtyAria: (name) => `Decrease quantity of ${name}`,
      increaseQtyAria: (name) => `Increase quantity of ${name}`,
      bulkTierApplied: (minQty, unitPriceStr) =>
        `Bulk Pricing (${minQty}+): ${unitPriceStr}/unit`,
      bulkTierLabel: (minQty) => `Buy ${minQty}+ of the same variant`,
      giftBadge: "Free Gift",
      giftSubtitle: "11Sport Free Gift: Complimentary",
      continueViewing: "← CONTINUE SHOPPING",
      updatingCart: "UPDATING...",
      updateCart: "UPDATE CART",
      totalsHeading: "CART TOTALS",
      subtotal: "Subtotal",
      bulkSavings: "Bulk Savings",
      promoCode: "Promo Code",
      shipping: "Shipping",
      freeShipping: "Free Nationwide Shipping",
      shippingCalcNote: "Shipping options will be updated during checkout.",
      total: "Total",
      proceedToCheckout: "PROCEED TO CHECKOUT",
      couponLabel: "Promo Code",
      couponPlaceholder: "Enter promo code",
      applyCoupon: "Apply",
      couponAppliedPrefix: (code, name) => `Promo code ${code} applied: ${name}`,
      rewardsEyebrow: "11SPORT EXCLUSIVE REWARDS",
      chooseYourGift: "Choose Your Free Gift",
      giftCounter: (unlocked) => (unlocked ? "1 / 1 GIFT" : "0 / 1 GIFT"),
      giftAutoAttached: (zeroPrice) =>
        `Automatically included with your order · Free (${zeroPrice})`,
      giftProgressPrompt: (itemsNeeded, rewardTitle) =>
        `Add ${itemsNeeded} more ${
          itemsNeeded === 1 ? "item" : "items"
        } to unlock: ${rewardTitle}`,
      giftDefaultPrompt:
        "Add 5 or more items to unlock a free 11Sport Dry-Fit Polo Shirt.",
      qtyProgress: (current, target) =>
        `${current} / ${target} ${target === 1 ? "item" : "items"}`,
    },
    checkout: {
      metaTitle: "Checkout",
      metaDescription:
        "Complete your shipping details and payment at 11Sport.",
      srHeading: "11Sport Checkout",
      defaultProvince: "Ho Chi Minh City",
      defaultDistrictFallback: "Central District",
      defaultWardFallback: "Central Ward",
      altPhoneNotePrefix: "Alternate recipient phone",
      errNameRequired: "Please enter the recipient's full name.",
      errPhoneInvalid:
        "Please enter a valid Vietnamese phone number (10–11 digits starting with 0, e.g. 0909 123 456).",
      errAddressRequired: "Please enter your complete street address.",
      errProvinceRequired: "Please enter your province or city.",
      errAltNameRequired: "Please enter the alternate recipient's full name.",
      errAltAddressRequired: "Please enter the alternate delivery address.",
      errNoOrderCode:
        "Could not receive an order code from the server. Please try again.",
      errServerConnection:
        "Unable to connect to the checkout server. Please try again shortly.",
      payosCancelTitle: "Your PayOS payment was cancelled",
      payosCancelBody:
        "Your selected items are still saved in your cart below. You can choose another payment method or adjust your order to complete checkout.",
      haveCouponQuestion: "Have a promo code?",
      clickToEnterCoupon: "Click here to enter your code",
      couponHint: "If you have a promo code, enter it below (e.g., SALE11).",
      couponPlaceholder: "Promo Code",
      couponAriaLabel: "Promo Code",
      applyBtnUpper: "APPLY",
      billingHeading: "BILLING & SHIPPING DETAILS",
      fullNameLabel: "Full Name",
      fullNamePlaceholder: "Enter your full name",
      phoneLabel: "Phone Number",
      phonePlaceholder: "Vietnamese phone number (e.g., 0909 123 456)",
      contactExtraLabel: "Email / WhatsApp (optional)",
      contactExtraPlaceholder: "Email for receipt, or WhatsApp / Viber",
      addressLabel: "Street Address",
      addressPlaceholder: "House number, street name...",
      provinceLabel: "Province / City",
      provincePlaceholder: "e.g., Ho Chi Minh City",
      districtLabel: "District (optional)",
      districtPlaceholder: "e.g., District 10",
      shipToDifferentLabel: "Ship to a different address?",
      altNameLabel: "Recipient Full Name",
      altNamePlaceholder: "Enter recipient's full name",
      altPhoneLabel: "Recipient Phone Number",
      altPhonePlaceholder: "Recipient phone (e.g., 0909 123 456)",
      altAddressLabel: "Delivery Address",
      altAddressPlaceholder: "Street address, district, city...",
      additionalInfoHeading: "ADDITIONAL INFORMATION",
      orderNoteLabel: "Order Notes (optional)",
      orderNotePlaceholder:
        "Notes about your order, e.g. preferred delivery time or special drop-off instructions.",
      yourOrderHeading: "YOUR ORDER",
      payosTitle: "Bank Transfer via QR (VietQR / PayOS)",
      payosDesc:
        "Pay with a domestic ATM card or VietQR / PayOS QR code with instant 24/7 confirmation and priority packing.",
      codTitle: "Cash on Delivery (COD) · Confirmation call from 11Sport",
      codDesc:
        "Open-Box Inspection and authentic NFC chip verification supported before payment.",
      submittingBtn: "PROCESSING ORDER...",
      placeOrderBtn: "PLACE ORDER",
      supportNote:
        "Our customer care team will call you to confirm your order.",
    },
    orderSuccess: {
      statusMetaTitle: "Order Status",
      statusMetaDesc: "Order confirmation and payment status at 11Sport.",
      receivedMetaTitle: "Order Received",
      receivedMetaDesc: "Order confirmation and payment details at 11Sport.",
      homeCrumb: "Home",
      checkoutCrumb: "Checkout",
      orderCrumb: (code) => `Order #${code}`,
      notFoundHeading: "Order code not found",
      notFoundDesc:
        "You can look up your order status using your order code and phone number.",
      trackOrderBtn: "TRACK ORDER",
      cellOrderCode: "ORDER CODE",
      cellDate: "ORDER DATE",
      today: "Today",
      cellTotal: "TOTAL",
      recorded: "Recorded",
      cellPayment: "PAYMENT",
      codOpenBoxSuffix: "Open-Box Inspection",
      qrHeading: (code) =>
        `Scan the QR code to complete payment for order #${code}`,
      qrSubheading:
        "Your inventory is reserved while we automatically verify your payment status.",
      reserveCountdownLabel: "Inventory reservation expires in",
      qrAlt: (code) => `PayOS / VietQR payment QR code for order ${code}`,
      qrReady: "PayOS QR code is ready",
      openPayosBtn: "OPEN PAYOS PAYMENT PORTAL",
      transferAmountLabel: "Amount to transfer:",
      transferNoteLabel: "Transfer reference:",
      copyAriaLabel: "Copy order code",
      copied: "Copied",
      copy: "Copy",
      continueShoppingBtn: "CONTINUE SHOPPING",
      expiredHeading: "Payment QR code expired",
      expiredDescPrefix: "Order",
      expiredDescSuffix:
        "has exceeded the 15-minute reservation window and reserved stock has been released.",
      reorderBtn: "REORDER FROM CART",
      backHomeBtn: "BACK TO HOME",
      paidHeading: (code) =>
        `Payment successful! Order #${code} has been confirmed.`,
      receivedHeading: (code) =>
        `Thank you! Order #${code} has been received.`,
      successSubheading:
        "Our 11Sport customer care team will contact you by phone within 15 minutes to confirm your order and send your tracking number.",
      perksNote:
        "Every 11Sport paddle order includes a Free Overgrip, Edge Tape & Paddle Cover, plus Open-Box Inspection and NFC authenticity verification before payment.",
    },
    account: {
      metaTitle: "My Account",
      metaDescription:
        "Sign in, track your orders, and manage shipping addresses at 11Sport.",
      srHeading: "11Sport My Account",
      defaultAddressLabel: "Home",
      defaultProvince: "Ho Chi Minh City",
      defaultMemberName: "11Sport Member",
      errIdentifierRequired:
        "Please enter your email address or phone number to receive an OTP code.",
      errIdentifierInvalid:
        "Please enter a valid email address or Vietnamese phone number.",
      otpSentFallback:
        "A 6-digit OTP code has been sent. Please check your email or SMS.",
      errOtpSendFailed:
        "Unable to send an OTP code right now. Please try again.",
      errLoginFieldsRequired:
        "Please enter your email or phone number and the 6-digit OTP code.",
      errOtpInvalid:
        "The OTP code is invalid or has expired. Please try again.",
      profileSaved: "Your 11Sport account details have been saved.",
      profileSaveFailed:
        "Unable to save your changes right now. Please try again.",
      lookupNotFound:
        "No order found matching that order code and phone number.",
      headingLogin: "SIGN IN",
      headingLookup: "TRACK ORDER",
      tabLogin: "Sign In",
      tabLookup: "Track Order",
      identifierLabel: "Email or Phone Number",
      identifierPlaceholder: "e.g., customer@11sport.vn or 0909 123 456",
      otpSending: "SENDING...",
      otpResend: (seconds) => `RESEND (${seconds}s)`,
      sendOtp: "Send OTP",
      otpLabel: "OTP Verification Code",
      otpPlaceholder: "Enter 6-digit OTP code (Demo: 123456)",
      rememberMe: "Keep me signed in",
      signingIn: "SIGNING IN...",
      signInBtn: "SIGN IN",
      forgotPassword: "Forgot password?",
      lookupIntro:
        "Enter your order code (e.g., ONL-20261120-0188) and delivery phone number.",
      orderCodeLabel: "Order Code",
      orderCodePlaceholder: "ONL-20261120-0188",
      deliveryPhoneLabel: "Delivery Phone Number",
      deliveryPhonePlaceholder: "0909 123 456",
      lookingUp: "SEARCHING...",
      lookupBtn: "TRACK ORDER",
      resultOrderCode: "Order Code:",
      resultTotal: "Order Total:",
      resultPayment: "Payment Status:",
      resultFulfillment: "Fulfillment Status:",
      sidebarAccountLabel: "My Account",
      navDashboard: "Dashboard",
      navOrders: "My Orders",
      navAddresses: "Shipping Addresses",
      navProfile: "Account Details",
      signOut: "Sign Out",
      greeting: (name) => `Welcome back, ${name}`,
      dashboardIntroBeforeOrders:
        "From your 11Sport account dashboard, you can track your ",
      dashboardRecentOrders: (count) => `recent orders (${count})`,
      dashboardMiddle: ", manage your ",
      dashboardAddressBook: "shipping addresses",
      dashboardAfter:
        ", and update your profile details for member benefits.",
      orderHistoryHeading: (count) => `Order History (${count})`,
      noOrdersText: "You haven't placed any orders at 11Sport yet.",
      shopNowBtn: "SHOP NOW",
      colOrder: "Order",
      colDate: "Date",
      colStatus: "Status",
      colTotal: "Total",
      colAction: "Action",
      viewOrderBtn: "View",
      addressesHeading: "Shipping Addresses",
      addAddressBtn: "Add Address",
      addrNamePlaceholder: "Recipient full name",
      addrNameAria: "Recipient full name",
      addrPhonePlaceholder: "Phone number (e.g., 0909 123 456)",
      addrPhoneAria: "Recipient phone number",
      addrProvincePlaceholder: "Province / City",
      addrProvinceAria: "Province or City",
      addrDistrictPlaceholder: "District",
      addrDistrictAria: "District",
      addrWardPlaceholder: "Ward",
      addrWardAria: "Ward",
      addrStreetPlaceholder: "House number, street name",
      addrStreetAria: "Street address",
      cancelBtn: "Cancel",
      saveAddressBtn: "Save Address",
      noAddressesText: "No shipping addresses saved yet.",
      defaultBadge: "Default",
      deleteAddressAria: "Delete address",
      profileHeading: "Account Details",
      profileNameLabel: "Full Name",
      profilePhoneLabel: "Phone Number",
      profileEmailLabel: "Email",
      savingBtn: "SAVING...",
      saveChangesBtn: "SAVE CHANGES",
    },
    lostPassword: {
      heading: "FORGOT PASSWORD",
      successPrefix: "A password reset link has been sent to",
      successSuffix: ". Please check your inbox.",
      backToLoginBtn: "BACK TO SIGN IN",
      instructions:
        "Forgot your password? Enter your username or email address below and we will send you a link to create a new password.",
      identifierLabel: "Username or Email",
      identifierPlaceholder: "Enter your email or username...",
      submitBtn: "RESET PASSWORD",
      backToLoginLink: "← Back to Sign In",
    },
  },
};

export function getCommerceI18n(locale: LocaleCode): CommerceDictionary {
  return COMMERCE_I18N[locale];
}
