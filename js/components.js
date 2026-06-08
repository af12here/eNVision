(function () {
  const HEADER_HTML = `
  <header class="site-header" id="siteHeader">
    <div class="header-inner">
      <a href="index.html" class="logo">
        <div class="logo-icon">
          <div class="logo-circle"></div>
          <div class="logo-circle"></div>
        </div>
        <div class="logo-text">
          <span class="logo-name">eNVision</span>
          <span class="logo-sub">Optical Store</span>
        </div>
      </a>
      <nav class="main-nav" id="mainNav">
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="products.html">Products</a></li>
          <li><a href="rewards.html">Rewards</a></li>
          <li><a href="about.html">About Us</a></li>
          <li><a href="order.html">Order</a></li>
        </ul>
      </nav>
      <button class="hamburger" id="hamburger" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>
  <nav class="mobile-nav" id="mobileNav">
    <a href="index.html">Home</a>
    <a href="products.html">Products</a>
    <a href="rewards.html">Rewards</a>
    <a href="about.html">About Us</a>
    <a href="order.html">Order</a>
  </nav>`;

  const FOOTER_HTML = `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="logo">
            <div class="logo-icon">
              <div class="logo-circle"></div>
              <div class="logo-circle"></div>
            </div>
            <div class="logo-text">
              <span class="logo-name">eNVision</span>
              <span class="logo-sub">Optical Store</span>
            </div>
          </div>
          <p class="footer-tagline">See The World<br>With Modern Precision</p>
        </div>
        <div class="footer-col">
          <h4>Navigation</h4>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="products.html">Products</a></li>
            <li><a href="rewards.html">Rewards</a></li>
            <li><a href="about.html">About Us</a></li>
            <li><a href="order.html">Order</a></li>
          </ul>
        </div>
        <div class="footer-col footer-contact">
          <h4>Contact Us</h4>
          <p>+62 812-3456-7890<br>
             envision@email.com<br>
             Jl. Kebon Jeruk Raya No. 123,<br>
             Kebon Jeruk, Jakarta Barat<br>
             DKI Jakarta, Indonesia, 12345</p>
        </div>
        <div class="footer-col">
          <h4>Our Social Media</h4>
          <div class="footer-socials">
            <a href="#" class="social-icon" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M14 8h2V4h-2c-2.2 0-4 1.8-4 4v2H8v4h2v6h4v-6h2.5l.5-4H14V8z"
                          fill="currentColor"/>
                </svg>
            </a>
            <a href="#" class="social-icon" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="5"
                          stroke="currentColor" stroke-width="2"/>
                    <circle cx="12" cy="12" r="4"
                            stroke="currentColor" stroke-width="2"/>
                    <circle cx="17.5" cy="6.5" r="1.2"
                            fill="currentColor"/>
                </svg>
            </a>
            <a href="#" class="social-icon" aria-label="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="5" width="20" height="14" rx="4"
                          stroke="currentColor" stroke-width="2"/>
                    <path d="M10 9L16 12L10 15V9Z"
                          fill="currentColor"/>
                </svg>
            </a>
            <a href="#" class="social-icon" aria-label="X">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.9 2H22l-6.8 7.8L23 22h-6.1l-4.8-6.3L6.6 22H3.5l7.3-8.4L1 2h6.2l4.3 5.7L18.9 2z"/>
                </svg>
            </a>
            <a href="#" class="social-icon" aria-label="TikTok">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M14 4V13.5
                            A3.5 3.5 0 1 1 10.5 10"
                          stroke="currentColor"
                          stroke-width="2.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"/>
                    <path d="M14 4
                            C14.5 6 16.5 8 19 8"
                          stroke="currentColor"
                          stroke-width="2.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"/>
                </svg>
            </a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2026 eNVision Optical Store. All rights reserved.</p>
      </div>
    </div>
  </footer>`;

  // Inject header
  const headerTarget = document.getElementById('headerMount');
  if (headerTarget) headerTarget.outerHTML = HEADER_HTML;

  // Inject footer
  const footerTarget = document.getElementById('footerMount');
  if (footerTarget) footerTarget.outerHTML = FOOTER_HTML;

  // Inject back-to-top button
  const btt = document.createElement('button');
  btt.id = 'backToTop';
  btt.className = 'back-to-top';
  btt.setAttribute('aria-label', 'Back to top');
  btt.innerHTML = '&#8593;';
  document.body.appendChild(btt);
})();
