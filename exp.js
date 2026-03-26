document.addEventListener('DOMContentLoaded', () => {

  // =========================================
  // Navbar Mobile 下拉菜单交互
  // =========================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      // 切换 active 类，触发 CSS 里的展开/收起动画
      navMenu.classList.toggle('active');
    });

    // 贴心小细节：点击菜单里的任何一个链接后，自动收起菜单
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }
  
  const sections = document.querySelectorAll('.info-block');
  const navLinks = document.querySelectorAll('.sidebar-item');

  // ==========================================
  // 1. 点击侧边栏：精准控制落点
  // ==========================================
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault(); 
      
      const targetId = this.getAttribute('href'); 
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        // 算出元素在整个网页中的绝对真实高度
        const elementPosition = targetSection.getBoundingClientRect().top + window.scrollY;
        
        // 减去 140（120的Navbar + 20的视觉呼吸空间）
        const offsetPosition = elementPosition - 140;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth' // 现在只有这里生效，绝对听话
        });
      }
    });
  });

  // ==========================================
  // 2. 滚动监听 (ScrollSpy)：精准雷达探测
  // ==========================================
  window.addEventListener('scroll', () => {
    let currentId = '';

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      
      // 这里的 160 是探测线。
      // 因为我们点击跳转后，标题会停在距离顶部 140px 的位置。
      // 所以探测线设为 160px，刚好能稳稳识别到它，又不会误伤下面的短区块！
      if (rect.top <= 160) {
        currentId = section.getAttribute('id');
      }
    });

    // 强保底逻辑：只要网页滑到了最顶端附近，永远保持第一个标签高亮
    if (window.scrollY < 100 && sections.length > 0) {
      currentId = sections[0].getAttribute('id');
    }

    // 动态切换高亮状态
    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // ==========================================
  // 3. 初始化触发
  // ==========================================
  window.dispatchEvent(new Event('scroll'));

});