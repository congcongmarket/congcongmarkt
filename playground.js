document.addEventListener('DOMContentLoaded', () => {
  // =========================================
  // Navbar Mobile 下拉菜单交互
  // =========================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      // 切换 active 类，触发 CSS 里的动画
      navMenu.classList.toggle('active');
    });

    // 点击菜单里的任何一个链接后，自动收起菜单
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }
});