/* ZGCLLM prototype shell — injects header + footer, wires theme/lang/demo toggles.
   Each page sets <body data-page="alliance"> to highlight the active nav item. */
(function () {
  var NAV = [
    { href: 'alliance.html', page: 'alliance', cn: '联盟介绍', en: 'About' },
    { href: 'working-groups.html', page: 'working-groups', cn: '工作组与专项', en: 'Working Groups' },
    { href: 'cybersecurity.html', page: 'cybersecurity', cn: '网络安全生态', en: 'Security' },
    { href: 'members.html', page: 'members', cn: '成员伙伴', en: 'Members' },
    { href: 'news.html', page: 'news', cn: '新闻动态', en: 'News' }
  ];
  var active = document.body.getAttribute('data-page') || '';

  function navHtml() {
    return NAV.map(function (n) {
      var cur = n.page === active ? ' aria-current="page"' : '';
      return '<a href="' + n.href + '"' + cur + '><span data-cn>' + n.cn +
        '</span><span data-en>' + n.en + '</span></a>';
    }).join('');
  }

  var header =
    '<a class="skip-link" href="#main-content"><span data-cn>跳到主要内容</span><span data-en>Skip to content</span></a>' +
    '<header class="header"><div class="container header__inner">' +
    '<a class="brand" href="index.html"><span class="brand__mark">ZG</span>' +
    '<span><span data-cn>中关村自主大模型产业联盟</span><span data-en>ZGCLLM Alliance</span></span></a>' +
    '<nav class="nav" aria-label="主导航">' + navHtml() + '</nav>' +
    '<div class="header__actions">' +
    '<button class="toggle toggle--seg" id="langToggle" aria-label="切换语言 / Switch language"><span class="on">中</span><span>EN</span></button>' +
    '<button class="toggle" id="themeToggle" aria-label="切换深浅色主题 / Toggle theme"><span id="themeIcon">☀︎</span></button>' +
    '<a class="btn btn--primary" href="join.html"><span data-cn>申请生态共建</span><span data-en>Apply</span></a>' +
    '<button class="toggle hamburger" aria-label="打开菜单">☰</button>' +
    '</div></div></header>';

  var footer =
    '<footer class="footer"><div class="container">' +
    '<div class="footer__grid">' +
    '<div class="footer__brand"><a class="brand" href="index.html" style="color:#fff"><span class="brand__mark">ZG</span>' +
    '<b><span data-cn>中关村自主大模型产业联盟</span><span data-en>ZGCLLM Alliance</span></b></a>' +
    '<p><span data-cn>连接自主大模型产业力量，推动开放协作与生态共建。</span>' +
    '<span data-en>Connecting the autonomous LLM industry through open collaboration.</span></p></div>' +
    '<div><h4><span data-cn>了解联盟</span><span data-en>Alliance</span></h4>' +
    '<a href="alliance.html"><span data-cn>联盟介绍</span><span data-en>About</span></a><br>' +
    '<a href="working-groups.html"><span data-cn>工作组与专项</span><span data-en>Working Groups</span></a><br>' +
    '<a href="cybersecurity.html"><span data-cn>网络安全生态</span><span data-en>Security</span></a></div>' +
    '<div><h4><span data-cn>参与</span><span data-en>Participate</span></h4>' +
    '<a href="join.html"><span data-cn>生态共建</span><span data-en>Partnership</span></a><br>' +
    '<a href="professionals.html"><span data-cn>专业用户加入</span><span data-en>Professionals</span></a><br>' +
    '<a href="members.html"><span data-cn>成员伙伴</span><span data-en>Members</span></a></div>' +
    '<div><h4><span data-cn>更多</span><span data-en>More</span></h4>' +
    '<a href="news.html"><span data-cn>新闻动态</span><span data-en>News</span></a><br>' +
    '<a href="privacy.html"><span data-cn>隐私说明</span><span data-en>Privacy</span></a></div>' +
    '</div><div class="footer__bottom">© 2026 ZGCLLM · www.zgcllm.org.cn</div>' +
    '</div></footer>';

  document.body.insertAdjacentHTML('afterbegin', header);
  document.body.insertAdjacentHTML('beforeend', footer);

  var html = document.documentElement;

  // theme (prefers-color-scheme as first-frame fallback)
  var themeBtn = document.getElementById('themeToggle');
  var themeIcon = document.getElementById('themeIcon');
  if (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) {
    html.setAttribute('data-theme', 'dark'); themeIcon.textContent = '☾';
  }
  themeBtn.addEventListener('click', function () {
    var dark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', dark ? 'light' : 'dark');
    themeIcon.textContent = dark ? '☀︎' : '☾';
  });

  // language
  var langBtn = document.getElementById('langToggle');
  langBtn.addEventListener('click', function () {
    var en = html.getAttribute('data-lang') === 'en';
    html.setAttribute('data-lang', en ? 'cn' : 'en');
    html.lang = en ? 'zh-CN' : 'en';
    var segs = langBtn.querySelectorAll('span');
    segs[0].classList.toggle('on', en);
    segs[1].classList.toggle('on', !en);
  });

  // demo state switcher (filled / empty) — only if page declares [data-state]
  var demoBtns = document.querySelectorAll('.demo-bar button');
  demoBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      demoBtns.forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      var view = b.getAttribute('data-demo');
      document.querySelectorAll('[data-state]').forEach(function (el) {
        el.hidden = el.getAttribute('data-view') !== view;
      });
    });
  });
})();
