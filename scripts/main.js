/**
 * RELHI - SIMPLIFIED CHINESE & BILINGUAL VIETNAMESE POPUP
 * Controls:
 * 1. 2-layer Sun Wheel Loading Screen
 * 2. 3-step Vertical Stepper with Simplified Chinese text & ARIA sync
 * 3. Horizontal Vietnamese Translation Tooltip on hover & touch
 * 4. High-Performance Multi-Layer 3D Mouse Parallax (Idle-sleep & Tab Visibility aware)
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initLoader();
  initVerticalStepper();
  initBilingualTooltip();
  initMultiLayerParallax();
});

/* ==========================================================================
   0. THEME TOGGLE (LIGHT / DARK MODE)
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const toggleText = document.getElementById('theme-toggle-text');
  const root = document.documentElement;

  // Khôi phục tùy chọn đã lưu hoặc dùng Dark Mode làm mặc định
  const savedTheme = localStorage.getItem('relhi-theme') || 'dark';
  applyTheme(savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('relhi-theme', newTheme);
    });
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      if (toggleText) toggleText.textContent = '暗夜';
      if (toggleBtn) toggleBtn.setAttribute('title', 'Đang ở chế độ Tối (Nhấn để chuyển Sáng)');
    } else {
      root.removeAttribute('data-theme');
      if (toggleText) toggleText.textContent = '白昼';
      if (toggleBtn) toggleBtn.setAttribute('title', 'Đang ở chế độ Sáng (Nhấn để chuyển Tối)');
    }
  }
}

/* ==========================================================================
   1. PRELOADER - OPTION 3: SPLIT PALACE DOORS & MAIN PAGE INTRO CASCADE
   ========================================================================== */
function initLoader() {
  const loader = document.getElementById('loader-screen');
  if (!loader) {
    document.body.classList.add('page-active');
    return;
  }

  let isOutroTriggered = false;

  function triggerOutro() {
    if (isOutroTriggered) return;
    isOutroTriggered = true;

    // Kích hoạt hiệu ứng mở cửa thần điện
    loader.classList.add('content-fading');
    loader.classList.add('doors-opening');
    document.body.classList.add('page-active');

    // Sau hiệu ứng mở cánh cửa (950ms), loại bỏ loader để tương tác bình thường
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 950);
  }

  // Tự động mở cửa sau 3s để người xem chiêm ngưỡng hiệu ứng thần luân
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(triggerOutro, 3000);
  } else {
    window.addEventListener('load', () => {
      setTimeout(triggerOutro, 3000);
    });
  }

  // Fallback an toàn tuyệt đối sau 3.6s
  setTimeout(triggerOutro, 3600);

  // Cho phép bấm trực tiếp vào màn hình loading để bỏ qua (skip) ngay lập tức
  loader.addEventListener('click', triggerOutro);
}

/* ==========================================================================
   2. SIMPLIFIED CHINESE DATA WITH VIETNAMESE TRANSLATIONS
   ========================================================================== */
const STEP_DATA = {
  1: {
    badge: '礼 · 晞 · 吞 · 日',
    vnBadge: 'Lễ Hy (Lǐ Xī) · Thôn Nhật Thần Lang (Hồ sơ Thần Tướng Thái Cổ)',
    quote: '“ 烈阳入口化长啸，九天沉寂尽成荒；独踏玄虚吞烈曜，万古乾坤一念藏。 ”',
    vnQuote: '“Thái dương nuốt trọn hóa thành tiếng gầm xé toạc đêm đen, chín tầng trời chìm vào tĩnh mịch hóa cõi hoang sơ. Một mình dẫm đạp hư vô nuốt vầng thiên nhật, cõi vạn cổ càn khôn gom trọn trong một ý niệm.”',
    body: '荒古异种吞日神狼，自太初混沌烈火中孕育而生。其身躯如玄铁山岳，骨骼镌刻着上古吞噬神纹，体内深处凝铸着至纯至狂之太阳炽核。相传洪荒初开，天穹十日肆虐，万物生灵焦土千里。神狼踏碎太虚长空，张口生吞九天炽烈神轮，硬生生将焚尽众生的暴虐太阳锁入狼骨血脉与神魂深处。无尽烈阳在其脏腑间化为苍茫狂焰，双眸凝视之处，炽日黯然，八荒失色；长啸骤起之时，群星战栗，唯留亘古长夜与滔天炎威。',
    vnBody: 'Dị chủng hoang cổ Thôn Nhật Thần Lang, sinh ra giữa ngọn lửa hỗn độn thuở hồng hoang thái sơ. Thân hình hắn tựa núi non huyền thiết sừng sững, khung xương khắc sâu thần văn thôn phệ viễn cổ, sâu thẳm trong cơ thể ngưng tụ lõi thái dương chí thuần cuồng bạo. Thuở hồng hoang vạn vật chìm trong thảm cảnh mười vầng mặt trời thiêu đốt cõi trần, Thần Lang đạp rách hư không, há miệng nuốt trọn vầng thái dương chín tầng trời, khóa vĩnh viễn nhiệt lượng cuồng nộ vào từng giọt huyết mạch và cốt tủy. Nơi ánh mắt hắn nhìn qua, vạn vật nín lặng, nhật nguyệt lu mờ, chỉ còn lại tiếng gầm thấu tận cửu trùng thiên cùng uy áp cuồng diễm vô biên.'
  },
  2: {
    badge: '荒 · 殿 · 苍 · 茫',
    vnBadge: 'Quyển 2: Hoang Điện Thương Mang · Phế tích thần điện & Huyết đằng sinh sôi',
    quote: '“ 破殿荒石撕赤魄，残碑折戟镇幽芒；太初神火焚不灭，古木狂藤绕断梁。 ”',
    vnQuote: '“Phế tích đền cổ xé toạc xích phách, bia tàn gươm gãy trấn giữ u mang. Lửa thần thái sơ cháy mãi ngàn kiếp không tắt, dây leo huyết đằng cuồng cuộn quấn quanh phế trụ hoang tàn.”',
    body: '太古诸界崩解覆灭之际，天穹陷落，神祇陨灭。神狼自诸神葬身之地踏步而下，驻足于孤寂荒凉之古神殿遗迹之上。那古殿之高耸石柱与残垣断壁，皆由洪荒混沌神岩所筑。数万载岁月更迭，古殿残柱间蔓延滋长出猩红可怖之古老血藤，此非凡木，乃是常年贪婪吸纳神狼每一次吐息溢出的太阳余火与神兽暴戾狂煞，方得以在死寂荒域中逆天疯长。断壁残垣在赤金烈炎灼烧下流转着古神阵纹，静静见证着一代神狼吞噬天日后的孤绝与霸烈。',
    vnBody: 'Thuở các giới thái cổ sụp đổ tan tành, vòm trời rách toạc, chư thần vẫn lạc. Thần Lang bước ra từ cõi chôn vùi thần ma, ngự trên phế tích cổ điện ngàn năm hiu quạnh. Những trụ đá chọc trời và vách thành hoang phế được đúc từ thần nham hỗn độn viễn cổ. Trải qua muôn vàn năm tháng, quấn quanh các phế tích ấy là loài huyết đằng đỏ thẫm hung bạo, vốn nhờ tham lam hấp thụ ngọn lửa thái dương và sát khí cuồng bạo tỏa ra từ từng hơi thở của Thần Lang mà sinh sôi nghịch thiên giữa cõi hoang tàn, vĩnh hằng bảo hộ nơi thần điện ngự tọa.'
  },
  3: {
    badge: '日 · 核 · 神 · 杖',
    vnBadge: 'Thần Trượng Bạch Cốt Viễn Cổ · Khảm phong ấn Lõi Thái Dương Chân Thần',
    quote: '“ 白骨为杖锁天日，神威万丈掌乾坤；赤芒吞吐撼星汉，一杖横空覆九门。 ”',
    vnQuote: '“Bạch cốt đúc trượng khóa vầng thiên nhật, thần uy muôn trượng nắm trọn càn khôn. Khí tức xích kim rung chuyển tinh tú ngân hà, một trượng vung lên định đoạt sinh tử muôn loài.”',
    body: '神狼右手所执之无上法器，乃是斩杀太古魔神后抽取极寒真龙脊骨淬炼而成的洪荒白骨神杖。法杖顶端死死咬合囚锢着的，正是当年神狼自九霄天穹生生嚼碎夺下的真正太阳核心炽核。那团日核宛若拥有自主意识的太古活物，日夜疯狂搏动咆哮，逸散出足以焚山煮海的纯粹极阳毁灭之力。但在神狼至尊意志与森森白骨神纹的绝对压制之下，狂暴日核只能乖乖臣服，化为其号令诸天万象、崩裂乾坤星海的本命神威。',
    vnBody: 'Binh khí tối thượng mà Thần Lang nắm giữ nơi tay phải chính là cây thần trượng được gọt giũa từ cột sống chân long cực hàn thái cổ sau trận huyết chiến chém giết ma thần. Đỉnh trượng ngậm chặt một lõi thái dương chân chính – thứ do chính tay Thần Lang cắn xé nuốt xuống từ đỉnh trời cao nhất. Lõi mặt trời hừng hực như một quả tim sống điên cuồng đập nhịp, tỏa ra năng lượng diệt thế có thể thiêu cháy non sông cạn khô biển cả; song dưới uy áp tuyệt đối của Thần Lang, cuồng diễm thái dương hóa thành thần uy hiệu triệu cõi trời đất vạn tượng.'
  }
};

function initVerticalStepper() {
  const stepBtns = document.querySelectorAll('.step-item');
  const loreBadge = document.getElementById('lore-badge');
  const loreQuote = document.getElementById('lore-quote');
  const loreBody = document.getElementById('lore-body');
  const stepperSunImg = document.getElementById('stepper-sun-img');

  // Góc xoay của Thái Dương Thần Luân tương ứng với 3 quyển:
  // Quyển 1: 0°, Quyển 2: 45°, Quyển 3: 90°
  const STEP_ANGLES = {
    1: 0,
    2: 45,
    3: 90
  };

  let currentStep = 1;

  function rotateSun(stepIndex) {
    if (!stepperSunImg) return;
    const targetAngle = STEP_ANGLES[stepIndex] !== undefined ? STEP_ANGLES[stepIndex] : (stepIndex - 1) * 45;

    // Nếu bấm lại chính bước đang chọn: khẽ lắc nhẹ 1 nhịp rồi hồi vị
    if (stepIndex === currentStep) {
      stepperSunImg.style.transform = `rotate(${targetAngle + 14}deg)`;
      setTimeout(() => {
        stepperSunImg.style.transform = `rotate(${targetAngle}deg)`;
      }, 240);
      return;
    }

    // Xoay mượt mà đến góc mới
    stepperSunImg.style.transform = `rotate(${targetAngle}deg)`;
    currentStep = stepIndex;
  }

  let activeTimeouts = [];
  let activeIntervals = [];

  function clearAllTyping() {
    activeTimeouts.forEach(t => clearTimeout(t));
    activeIntervals.forEach(i => clearInterval(i));
    activeTimeouts = [];
    activeIntervals = [];
  }

  // Hiệu ứng Typewriter: Chữ xuất hiện lần lượt từ trên xuống dưới (hỗ trợ trọn vẹn Unicode)
  function typeVerticalColumn(element, fullText, vnData, startDelay = 0, charSpeed = 26) {
    if (!element) return;

    element.setAttribute('data-vn', vnData);
    element.textContent = '';
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';

    const chars = Array.from(fullText);
    const timeout = setTimeout(() => {
      let charIndex = 0;
      const interval = setInterval(() => {
        if (charIndex < chars.length) {
          element.textContent += chars[charIndex];
          charIndex++;
        } else {
          clearInterval(interval);
        }
      }, charSpeed);
      activeIntervals.push(interval);
    }, startDelay);
    activeTimeouts.push(timeout);
  }

  function updateContent(stepIndex, isInitial = false) {
    const data = STEP_DATA[stepIndex];
    if (!data) return;

    // Dọn sạch hoàn toàn mọi timeout & interval trước đó để tránh race-condition
    clearAllTyping();

    if (!isInitial) {
      const els = [loreBadge, loreQuote, loreBody];
      els.forEach(el => {
        if (el) {
          el.style.opacity = '0.3';
          el.style.transition = 'opacity 0.12s ease';
        }
      });
    }

    // Hiệu ứng gõ chữ (Typewriter) từ trên xuống dưới lần lượt từng cột
    const baseDelay = isInitial ? 400 : 120;
    const outerTimeout = setTimeout(() => {
      typeVerticalColumn(loreBadge, data.badge, data.vnBadge, 0, 32);
      typeVerticalColumn(loreQuote, data.quote, data.vnQuote, 140, 26);
      typeVerticalColumn(loreBody, data.body, data.vnBody, 320, 18);
    }, baseDelay);
    activeTimeouts.push(outerTimeout);
  }

  stepBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const step = parseInt(btn.dataset.step, 10);
      rotateSun(step);

      stepBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      updateContent(step);
    });
  });

  // Khởi động gõ chữ cho bước 1 khi mở trang
  updateContent(1, true);

  // Hỗ trợ phím mũi tên Lên/Xuống để chuyển bước nhanh
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      const nextStep = currentStep < 3 ? currentStep + 1 : 1;
      const targetBtn = document.querySelector(`.step-item[data-step="${nextStep}"]`);
      if (targetBtn) targetBtn.click();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      const prevStep = currentStep > 1 ? currentStep - 1 : 3;
      const targetBtn = document.querySelector(`.step-item[data-step="${prevStep}"]`);
      if (targetBtn) targetBtn.click();
    }
  });
}

/* ==========================================================================
   3. HORIZONTAL VIETNAMESE POPUP TOOLTIP SYSTEM (HOVER + TOUCH SUPPORT)
   ========================================================================== */
function initBilingualTooltip() {
  let tooltip = document.getElementById('vn-tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'vn-tooltip';
    document.body.appendChild(tooltip);
  }

  function formatTooltipText(rawText) {
    if (!rawText) return '';
    // Tách câu theo dấu chấm, chấm phẩy, hoặc dấu kết câu kết hợp ngoặc kép
    // Giữ nguyên tiêu đề ngắn hoặc tách từng câu thành các dòng riêng biệt
    const sentences = rawText
      .replace(/([.!?；;])\s*(?=[A-ZÀ-Ỹ“"0-9]|$)/g, '$1|__SPLIT__|')
      .split('|__SPLIT__|')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (sentences.length <= 1) {
      return `<p class="tooltip-sentence">${escapeHTML(rawText)}</p>`;
    }

    return sentences
      .map(sentence => `<p class="tooltip-sentence">${escapeHTML(sentence)}</p>`)
      .join('');
  }

  function showTooltip(target, clientX, clientY) {
    const vnText = target.getAttribute('data-vn');
    if (!vnText) return;

    // Thiết kế cấu trúc thẻ ngọc truyền thư cổ phong
    tooltip.innerHTML = `
      <div class="vn-tooltip-header">
        <span class="vn-tooltip-seal">
          <span class="seal-char">译</span>
        </span>
        <span class="vn-tooltip-title">BẢN DỊCH NGHĨA</span>
        <span class="vn-tooltip-sub">VĂN TỰ THÁI CỔ</span>
      </div>
      <div class="vn-tooltip-body">${formatTooltipText(vnText)}</div>
    `;

    tooltip.classList.add('visible');
    positionTooltip(clientX, clientY);
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  function hideTooltip() {
    tooltip.classList.remove('visible');
  }

  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('[data-vn]');
    if (!target) return;
    showTooltip(target, e.clientX, e.clientY);
  });

  document.addEventListener('mousemove', (e) => {
    if (tooltip.classList.contains('visible')) {
      positionTooltip(e.clientX, e.clientY);
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest('[data-vn]');
    if (target) {
      hideTooltip();
    }
  });

  // Hỗ trợ thiết bị di động / cảm ứng khi chạm (tap)
  document.addEventListener('touchstart', (e) => {
    const target = e.target.closest('[data-vn]');
    if (target && e.touches.length > 0) {
      showTooltip(target, e.touches[0].clientX, e.touches[0].clientY);
    } else if (!e.target.closest('#vn-tooltip')) {
      hideTooltip();
    }
  }, { passive: true });

  function positionTooltip(clientX, clientY) {
    const offset = 14;
    const tooltipRect = tooltip.getBoundingClientRect();
    const w = tooltipRect.width || 240;
    const h = tooltipRect.height || 60;

    let left = clientX + offset;
    let top = clientY + offset;

    // Tránh tràn viền phải
    if (left + w > window.innerWidth - 16) {
      left = clientX - w - offset;
    }

    // Tránh tràn viền dưới
    if (top + h > window.innerHeight - 16) {
      top = clientY - h - offset;
    }

    left = Math.max(12, left);
    top = Math.max(12, top);

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }
}

/* ==========================================================================
   4. MULTI-LAYER 3-CLUSTER MOUSE PARALLAX SYSTEM
   High Performance: Tự ngủ khi chuột đứng yên & Tạm dừng khi ẩn Tab
   ========================================================================== */
function initMultiLayerParallax() {
  const stage = document.getElementById('parallax-stage');
  const clusterBg = document.getElementById('cluster-bg');
  const clusterMid = document.getElementById('cluster-mid');
  const clusterFg = document.getElementById('cluster-fg');

  if (!stage || !clusterBg || !clusterMid || !clusterFg) return;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let isLoopRunning = false;

  function onMouseMove(e) {
    const normX = (e.clientX / window.innerWidth) * 2 - 1;
    const normY = (e.clientY / window.innerHeight) * 2 - 1;
    targetX = Math.max(-1, Math.min(1, normX));
    targetY = Math.max(-1, Math.min(1, normY));

    if (!isLoopRunning && !document.hidden) {
      isLoopRunning = true;
      requestAnimationFrame(updateParallax);
    }
  }

  function onMouseLeave() {
    targetX = 0;
    targetY = 0;
    if (!isLoopRunning && !document.hidden) {
      isLoopRunning = true;
      requestAnimationFrame(updateParallax);
    }
  }

  function updateParallax() {
    if (document.hidden) {
      isLoopRunning = false;
      return;
    }

    const dx = targetX - currentX;
    const dy = targetY - currentY;

    // Tự động ngắt vòng lặp khi chuyển động đã tiệm cận đích (tiết kiệm CPU/Pin)
    if (Math.abs(dx) < 0.0003 && Math.abs(dy) < 0.0003) {
      currentX = targetX;
      currentY = targetY;
      applyTransform(currentX, currentY);
      isLoopRunning = false;
      return;
    }

    currentX += dx * 0.08;
    currentY += dy * 0.08;
    applyTransform(currentX, currentY);

    requestAnimationFrame(updateParallax);
  }

  function applyTransform(x, y) {
    // Parallax 2.5D mượt mà đa tầng (Không xoay 3D để giữ độ sắc nét 100% và đạt 60fps tuyệt đối):
    // Cụm 1: Hậu cảnh (Sky + Sun) - dịch nhẹ ngược hướng
    const bgX = (x * -12).toFixed(1);
    const bgY = (y * -8).toFixed(1);
    clusterBg.style.transform = `translate(${bgX}px, ${bgY}px)`;

    // Cụm 2: Trung cảnh (P3 + P2 + P1) - dịch cùng hướng biên độ vừa
    const midX = (x * 15).toFixed(1);
    const midY = (y * 10).toFixed(1);
    clusterMid.style.transform = `translate(${midX}px, ${midY}px)`;

    // Cụm 3: Tiền cảnh (O1 + Relhi + F1) - dịch cùng hướng biên độ lớn nhất tạo chiều sâu
    const fgX = (x * 32).toFixed(1);
    const fgY = (y * 20).toFixed(1);
    clusterFg.style.transform = `translate(${fgX}px, ${fgY}px)`;
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true });
  document.addEventListener('mouseleave', onMouseLeave);

  // Tạm dừng khi tab chuyển sang nền, khởi động lại khi quay lại
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !isLoopRunning) {
      isLoopRunning = true;
      requestAnimationFrame(updateParallax);
    }
  });

  // Khởi động 1 lần đầu tiên
  isLoopRunning = true;
  requestAnimationFrame(updateParallax);
}
