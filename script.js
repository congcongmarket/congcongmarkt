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
  // =========================================
  // 1. Case Studies 无限循环轮播逻辑
  // =========================================
  const cards = document.querySelectorAll('.project-card');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.prev-arrow');
  const nextBtn = document.querySelector('.next-arrow');
  
  let currentCardIndex = 0;

  // 核心切换卡片功能
  function showCard(index) {
    // 清除所有的 active 状态
    cards.forEach(card => card.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // 计算真实的索引（实现无限循环：3 的下一个变 0，0 的上一个变 2）
    currentCardIndex = (index + cards.length) % cards.length;

    // 给对应的卡片和圆点加上 active 状态
    cards[currentCardIndex].classList.add('active');
    dots[currentCardIndex].classList.add('active');
  }

  // 点击左右箭头
  if (nextBtn) {
    nextBtn.addEventListener('click', () => showCard(currentCardIndex + 1));
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => showCard(currentCardIndex - 1));
  }

  // 点击小圆点直接跳转
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showCard(index));
  });
});