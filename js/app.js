// Application Logic for Ju Han-tae's Ritual & Portfolio Hub

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Data from window.INITIAL_RITUAL_DATA & LocalStorage
  let localRecords = [];
  try {
    const saved = localStorage.getItem('user_ritual_records');
    if (saved) {
      localRecords = JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load local records:', e);
  }

  // Combine initial 38 days + custom user records
  const allRecords = [...(window.INITIAL_RITUAL_DATA || []), ...localRecords];

  // 2. Tab Navigation
  const tabButtons = document.querySelectorAll('.nav-tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetEl = document.getElementById(targetTab);
      if (targetEl) {
        targetEl.classList.add('active');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // 3. Narrative Switcher (3인칭 vs 1인칭)
  const narrativeBtns = document.querySelectorAll('.narrative-btn');
  const narrativeThird = document.getElementById('narrative-third');
  const narrativeFirst = document.getElementById('narrative-first');

  narrativeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      narrativeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.getAttribute('data-mode');
      if (mode === 'first') {
        narrativeThird.style.display = 'none';
        narrativeFirst.style.display = 'block';
      } else {
        narrativeThird.style.display = 'block';
        narrativeFirst.style.display = 'none';
      }
    });
  });

  // 4. Checklist Persistence
  const checklistItems = document.querySelectorAll('.check-item');
  const savedChecks = JSON.parse(localStorage.getItem('ritual_checklist') || '{}');

  checklistItems.forEach((item, idx) => {
    const key = `check_${idx}`;
    if (savedChecks[key] !== undefined) {
      if (savedChecks[key]) {
        item.classList.add('completed');
      } else {
        item.classList.remove('completed');
      }
    }

    item.addEventListener('click', () => {
      item.classList.toggle('completed');
      savedChecks[key] = item.classList.contains('completed');
      localStorage.setItem('ritual_checklist', JSON.stringify(savedChecks));
      updateChecklistBadge();
    });
  });

  function updateChecklistBadge() {
    const completedCount = document.querySelectorAll('.check-item.completed').length;
    const badge = document.getElementById('checklist-status-badge');
    if (badge) {
      badge.textContent = `완료 ${completedCount}/6`;
    }
  }
  updateChecklistBadge();

  // 5. Copy Self-Introduction
  const copyIntroBtn = document.getElementById('copy-intro-btn');
  if (copyIntroBtn) {
    copyIntroBtn.addEventListener('click', () => {
      const textToCopy = `[제목: 알람 10개의 실행력과 배려의 소통으로 팀의 인프라를 완성하는 엔지니어, 주한태]

(첫 문장 - 직접 씀) 넘어지지 않은 사람이 아니라, 넘어진 뒤에 시스템을 고쳐 더 단단하게 일어선 엔지니어 주한태입니다.

[소제목 1: 방황을 지나 위기를 30분의 여유로 바꾸는 실행의 회복탄력성]
스무 살 대학교 1학년 시절, 전공에 마음을 붙이지 못해 강의실과 자취방을 겉돌며 무기력한 방황을 겪었습니다. 그러나 2022년 말 강원도 화천 전방 7사단으로 입대해 혹한기 생활관에서 궂은일을 솔선하는 전우들을 보며 삶의 태도를 바꿨고, '사회로 나가면 내 힘으로 온전히 몰입할 수 있는 IT 기술을 공부해 당당히 살아가겠다'고 다짐했습니다. 이 다짐은 이번 13주 리추얼 기록에서도 그대로 증명되었습니다. 과정 중 피로가 누적되어 이틀 연속 지각이라는 고비가 닥쳤을 때, 저는 "내일도 늦으면 개다"라며 자책만 하는 데 머물지 않았습니다. 그날 밤 스마트폰 알람 10개를 맞추고 수면 환경을 통제하는 즉각적인 물리적 행동을 단행했습니다. 그 결과 바로 다음 날 정상 출석을 회복했고, 다다음 날엔 남들보다 30분 먼저 강의실에 도착해 자격증 공부를 하는 동료의 질문을 돕는 긍정적인 반전을 만들어냈습니다(강점 1: 신뢰와 회복탄력성).

[소제목 2: 모르면 묻고 끝까지 파고드는 기술 집념과 배려의 협업]
Cisco Packet Tracer를 활용한 OSPF 라우팅 모의 실습, Linux 가상화 서버 배포, 정보처리 보안 지식 습득에 이르기까지 저는 혼자만의 성취에 머무르지 않았습니다. 수업 중 멍때리다 놓친 부분이 생겼을 때도 숨기거나 자존심을 세우지 않고 옆자리 형에게 솔직하게 물어보며 끝까지 실습을 완수했습니다(강점 2: 기술 탐구와 완결성). 그리고 동료들로부터 "첫 대면에서도 편안하게 만들어주는 배려심과 시원시원한 친화력"이라는 평가를 받은 것처럼, 화를 다스리는 인내심으로 팀 내 소통의 병목을 없애고 배운 지식을 아낌없이 나누었습니다(강점 3: 인내와 쿠션형 소통).

(마지막 문장 - 직접 씀) 팀의 인프라와 보안에 어떤 장애나 위기가 닥치더라도 주저앉지 않고 즉시 원인을 분석해 프로세스를 개선하며, 언제나 가장 먼저 달려가 시스템을 정상화하는 든든한 동료가 되겠습니다.`;
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast('자기소개서 초안이 클립보드에 복사되었습니다!');
      });
    });
  }

  // 6. Toast Notification
  function showToast(msg) {
    let toast = document.getElementById('app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>✓</span> ${msg}`;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
  window.showToast = showToast;

  // 7. Tracker Metrics & Feed Render
  const recordsContainer = document.getElementById('records-container');
  const searchInput = document.getElementById('search-input');
  const filterBtns = document.querySelectorAll('.filter-btn');

  let activeFilter = 'all';

  function renderMetrics() {
    const totalDaysEl = document.getElementById('stat-total-days');
    const totalBreathEl = document.getElementById('stat-total-breath');
    const practiceRateEl = document.getElementById('stat-practice-rate');

    const totalDays = allRecords.length;
    let totalBreathMinutes = 0;
    let doneCount = 0;
    let evalCount = 0;

    allRecords.forEach(r => {
      if (r.morning && r.morning.breathNum) {
        totalBreathMinutes += r.morning.breathNum;
      }
      if (r.evening && r.evening['강점 행동']) {
        evalCount++;
        if (r.evening['강점 행동'].includes('실천했다')) {
          doneCount++;
        }
      }
    });

    if (totalDaysEl) totalDaysEl.innerHTML = `${totalDays}<small>일</small>`;
    if (totalBreathEl) totalBreathEl.innerHTML = `${Math.round(totalBreathMinutes)}<small>분</small>`;
    const rate = evalCount > 0 ? Math.round((doneCount / evalCount) * 100) : 85;
    if (practiceRateEl) practiceRateEl.innerHTML = `${rate}<small>%</small>`;
  }

  function renderRecords() {
    if (!recordsContainer) return;
    const query = (searchInput ? searchInput.value.toLowerCase().trim() : '');

    const filtered = allRecords.filter(r => {
      // Filter type
      if (activeFilter === 'highlight' && !r.isHighlight) return false;
      if (activeFilter === 'evening-only' && (!r.evening || Object.keys(r.evening).length === 0)) return false;

      // Query search
      if (!query) return true;
      const jsonStr = JSON.stringify(r).toLowerCase();
      return jsonStr.includes(query);
    });

    recordsContainer.innerHTML = '';

    if (filtered.length === 0) {
      recordsContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 48px; color: var(--text-muted);">
          일치하는 리추얼 기록이 없습니다.
        </div>
      `;
      return;
    }

    filtered.forEach(record => {
      const card = document.createElement('div');
      card.className = `record-card ${record.isHighlight ? 'highlight' : ''}`;
      
      const breathText = record.morning && record.morning['호흡'] ? record.morning['호흡'] : '호흡 완료';
      const strengthText = record.morning && record.morning['내 강점'] ? record.morning['내 강점'] : (record.evening && record.evening['나에게 남기는 말'] ? record.evening['나에게 남기는 말'] : '기록');
      const quoteText = record.morning && record.morning['강점이 드러난 일화'] ? record.morning['강점이 드러난 일화'] : (record.evening && record.evening['감사일기'] ? record.evening['감사일기'] : '리추얼 기록 세부사항');

      card.innerHTML = `
        <div class="record-header">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span class="record-date">${record.date}</span>
            ${record.isCustom ? '<span class="user-badge">내가 작성</span>' : ''}
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="record-breath">${breathText}</span>
            ${record.isCustom ? `<button type="button" class="link-btn delete-custom-btn" data-date="${record.date}" style="color: #ef4444; font-size: 0.75rem;" title="기록 삭제">삭제</button>` : ''}
          </div>
        </div>
        <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 6px; color: var(--text-main);">${strengthText}</h4>
        <p class="record-preview">${quoteText}</p>
        <div class="record-tags">
          ${record.isHighlight ? '<span class="micro-tag" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24;">★ 명장면</span>' : ''}
          ${record.evening && record.evening['강점 행동'] ? `<span class="micro-tag">${record.evening['강점 행동']}</span>` : ''}
          <span class="micro-tag">상세보기 ↗</span>
        </div>
      `;

      card.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-custom-btn')) {
          e.stopPropagation();
          const targetDate = e.target.getAttribute('data-date');
          if (confirm(`${targetDate} 리추얼 기록을 삭제하시겠습니까?`)) {
            localRecords = localRecords.filter(r => r.date !== targetDate);
            localStorage.setItem('user_ritual_records', JSON.stringify(localRecords));
            const removeIdx = allRecords.findIndex(r => r.date === targetDate && r.isCustom);
            if (removeIdx !== -1) allRecords.splice(removeIdx, 1);
            renderMetrics();
            renderRecords();
            showToast('기록이 삭제되었습니다.');
          }
          return;
        }
        openRecordModal(record);
      });

      recordsContainer.appendChild(card);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', renderRecords);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter');
      renderRecords();
    });
  });

  // 8. Record Detail Modal
  const recordModal = document.getElementById('record-modal');
  const modalContent = document.getElementById('modal-record-detail');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  function openRecordModal(record) {
    if (!recordModal || !modalContent) return;

    let morningHtml = '<p style="color: var(--text-muted); font-size: 0.88rem;">작성된 아침 기록이 없습니다.</p>';
    if (record.morning && Object.keys(record.morning).length > 0) {
      morningHtml = Object.entries(record.morning)
        .filter(([k]) => k !== 'breathNum')
        .map(([k, v]) => `
          <div class="detail-row">
            <strong>${k}:</strong> <span>${v}</span>
          </div>
        `).join('');
    }

    let eveningHtml = '<p style="color: var(--text-muted); font-size: 0.88rem;">작성된 마무리 기록이 없습니다.</p>';
    if (record.evening && Object.keys(record.evening).length > 0) {
      eveningHtml = Object.entries(record.evening)
        .map(([k, v]) => `
          <div class="detail-row">
            <strong>${k}:</strong> <span>${v}</span>
          </div>
        `).join('');
    }

    modalContent.innerHTML = `
      <div style="margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 14px;">
        <span class="badge-tag" style="margin-bottom: 8px;">리추얼 상세 기록</span>
        <h2 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800;">${record.date}</h2>
      </div>

      <div class="modal-detail-section">
        <h4>☀️ 아침 리추얼</h4>
        <div style="background: rgba(0,0,0,0.2); padding: 16px; border-radius: var(--radius-md);">
          ${morningHtml}
        </div>
      </div>

      <div class="modal-detail-section">
        <h4>🌙 마무리 리추얼</h4>
        <div style="background: rgba(0,0,0,0.2); padding: 16px; border-radius: var(--radius-md);">
          ${eveningHtml}
        </div>
      </div>
    `;

    recordModal.classList.add('active');
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      recordModal.classList.remove('active');
    });
  }

  if (recordModal) {
    recordModal.addEventListener('click', (e) => {
      if (e.target === recordModal) {
        recordModal.classList.remove('active');
      }
    });
  }

  // 9. Interactive Breathing Timer
  let breathInterval = null;
  let remainingSeconds = 180; // default 3 min
  let isBreathingRunning = false;
  const breathCircle = document.getElementById('breath-circle');
  const breathStateText = document.getElementById('breath-state-text');
  const timerDisplay = document.getElementById('timer-display');
  const startBreathBtn = document.getElementById('start-breath-btn');
  const presetBtns = document.querySelectorAll('.timer-preset-btn');

  function updateTimerText(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (timerDisplay) {
      timerDisplay.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
  }

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const min = parseInt(btn.getAttribute('data-min'), 10);
      remainingSeconds = min * 60;
      updateTimerText(remainingSeconds);
      if (isBreathingRunning) {
        stopBreathing();
      }
    });
  });

  function startBreathing() {
    isBreathingRunning = true;
    startBreathBtn.textContent = '일시 정지';
    startBreathBtn.style.background = 'var(--accent-rose)';

    let breathPhase = 0; // 0: inhale, 1: hold, 2: exhale
    function runBreathCycle() {
      if (breathPhase === 0) {
        breathStateText.textContent = '들이쉬기';
        breathCircle.classList.remove('exhale');
        breathCircle.classList.add('inhale');
        breathPhase = 1;
      } else if (breathPhase === 1) {
        breathStateText.textContent = '숨 멈추기';
        breathPhase = 2;
      } else {
        breathStateText.textContent = '내쉬기';
        breathCircle.classList.remove('inhale');
        breathCircle.classList.add('exhale');
        breathPhase = 0;
      }
    }

    runBreathCycle();
    const cycleInterval = setInterval(() => {
      if (!isBreathingRunning) {
        clearInterval(cycleInterval);
        return;
      }
      runBreathCycle();
    }, 4000);

    breathInterval = setInterval(() => {
      if (remainingSeconds <= 1) {
        stopBreathing();
        remainingSeconds = 0;
        updateTimerText(0);
        breathStateText.textContent = '호흡 완료!';
        const activePreset = document.querySelector('.timer-preset-btn.active');
        const minVal = activePreset ? activePreset.getAttribute('data-min') : '3';
        const studioBreath = document.getElementById('studio-breath');
        if (studioBreath) studioBreath.value = `${minVal}분 완료`;
        showToast(`호흡 명상(${minVal}분)이 완료되어 작성창에 자동 반영되었습니다! 편안한 마음으로 하루를 기록해 보세요.`);
        return;
      }
      remainingSeconds--;
      updateTimerText(remainingSeconds);
    }, 1000);
  }

  function stopBreathing() {
    isBreathingRunning = false;
    clearInterval(breathInterval);
    if (startBreathBtn) {
      startBreathBtn.textContent = '호흡 시작';
      startBreathBtn.style.background = '';
    }
    if (breathCircle) {
      breathCircle.classList.remove('inhale', 'exhale');
    }
    if (breathStateText) {
      breathStateText.textContent = '준비';
    }
  }

  if (startBreathBtn) {
    startBreathBtn.addEventListener('click', () => {
      if (isBreathingRunning) {
        stopBreathing();
      } else {
        if (remainingSeconds === 0) remainingSeconds = 180;
        startBreathing();
      }
    });
  }

  // 10. New Ritual Entry Modal
  const newEntryModal = document.getElementById('new-entry-modal');
  const openNewEntryBtn = document.getElementById('open-new-entry-btn');
  const closeNewEntryBtn = document.getElementById('close-new-entry-btn');
  const saveEntryBtn = document.getElementById('save-entry-btn');

  if (openNewEntryBtn) {
    openNewEntryBtn.addEventListener('click', () => {
      // Set today's date
      const today = new Date().toISOString().split('T')[0];
      const dateInput = document.getElementById('form-date');
      if (dateInput) dateInput.value = today;
      newEntryModal.classList.add('active');
    });
  }

  if (closeNewEntryBtn) {
    closeNewEntryBtn.addEventListener('click', () => {
      newEntryModal.classList.remove('active');
    });
  }

  if (saveEntryBtn) {
    saveEntryBtn.addEventListener('click', () => {
      const date = document.getElementById('form-date').value;
      if (!date) {
        alert('날짜를 입력해주세요.');
        return;
      }

      const breath = document.getElementById('form-breath').value || '3분';
      const calm = document.getElementById('form-calm').value || '';
      const strength = document.getElementById('form-strength').value || '';
      const episode = document.getElementById('form-episode').value || '';
      const eveningDone = document.getElementById('form-evening-done').value;
      const noteToSelf = document.getElementById('form-note').value || '';
      const gratitude = document.getElementById('form-gratitude').value || '';

      const newRecord = {
        date: date,
        isHighlight: false,
        morning: {
          '호흡': breath,
          breathNum: parseFloat(breath) || 3,
          '편안했던 장면': calm,
          '내 강점': strength,
          '강점이 드러난 일화': episode
        },
        evening: {
          '강점 행동': eveningDone,
          '나에게 남기는 말': noteToSelf,
          '감사일기': gratitude
        }
      };

      localRecords.unshift(newRecord);
      localStorage.setItem('user_ritual_records', JSON.stringify(localRecords));
      allRecords.unshift(newRecord);

      renderMetrics();
      renderRecords();
      newEntryModal.classList.remove('active');
      showToast(`${date} 리추얼 기록이 성공적으로 저장되었습니다!`);
    });
  }

  // Initial Render
  renderMetrics();
  renderRecords();

  // ==========================================
  
  // ==========================================
  // 10. Daily Ritual Studio Controller
  // ==========================================
  const studioDateInput = document.getElementById('studio-date');
  const studioTodayBtn = document.getElementById('studio-today-btn');
  const studioSyncBreathBtn = document.getElementById('studio-sync-breath-btn');
  const studioBreathInput = document.getElementById('studio-breath');
  const studioCalmInput = document.getElementById('studio-calm');
  const studioStrengthInput = document.getElementById('studio-strength');
  const studioEpisodeInput = document.getElementById('studio-episode');
  const studioNoteInput = document.getElementById('studio-note');
  const studioGratitudeInput = document.getElementById('studio-gratitude');
  const studioSaveBtn = document.getElementById('studio-save-btn');
  const studioCopyBtn = document.getElementById('studio-copy-btn');
  const studioDownloadBtn = document.getElementById('studio-download-btn');
  const studioClearBtn = document.getElementById('studio-clear-btn');

  // Set Default Date to Today
  function setStudioDateToToday() {
    const today = new Date().toISOString().split('T')[0];
    if (studioDateInput) studioDateInput.value = today;
  }
  setStudioDateToToday();

  if (studioTodayBtn) {
    studioTodayBtn.addEventListener('click', setStudioDateToToday);
  }

  // Sync Timer to Breath Field
  if (studioSyncBreathBtn && studioBreathInput) {
    studioSyncBreathBtn.addEventListener('click', () => {
      const activePreset = document.querySelector('.timer-preset-btn.active');
      const minVal = activePreset ? activePreset.getAttribute('data-min') : '3';
      studioBreathInput.value = `${minVal}분`;
      showToast(`호흡 명상 시간(${minVal}분)이 적용되었습니다!`);
    });
  }

  // Save Entry from Studio
  if (studioSaveBtn) {
    studioSaveBtn.addEventListener('click', () => {
      const date = studioDateInput ? studioDateInput.value : '';
      if (!date) {
        alert('기록할 날짜를 선택해주세요.');
        if (studioDateInput) studioDateInput.focus();
        return;
      }

      const breath = (studioBreathInput && studioBreathInput.value.trim()) || '3분';
      const calm = (studioCalmInput && studioCalmInput.value.trim()) || '';
      const strength = (studioStrengthInput && studioStrengthInput.value.trim()) || '일일 루틴 실천';
      const episode = (studioEpisodeInput && studioEpisodeInput.value.trim()) || '';
      const eveningRadio = document.querySelector('input[name="studio-evening-eval"]:checked');
      const eveningDone = eveningRadio ? eveningRadio.value : '실천했다';
      const noteToSelf = (studioNoteInput && studioNoteInput.value.trim()) || '';
      const gratitude = (studioGratitudeInput && studioGratitudeInput.value.trim()) || '';

      const newRecord = {
        date: date,
        isHighlight: false,
        isCustom: true,
        morning: {
          '호흡': breath,
          breathNum: parseFloat(breath) || 3,
          '편안했던 장면': calm,
          '내 강점': strength,
          '강점이 드러난 일화': episode
        },
        evening: {
          '강점 행동': eveningDone,
          '나에게 남기는 말': noteToSelf,
          '감사일기': gratitude
        }
      };

      // Check if entry for this date already exists in localRecords
      const existingIdx = localRecords.findIndex(r => r.date === date);
      if (existingIdx !== -1) {
        if (!confirm(`${date} 날짜의 기록이 이미 존재합니다. 덮어쓰시겠습니까?`)) {
          return;
        }
        localRecords[existingIdx] = newRecord;
        const allIdx = allRecords.findIndex(r => r.date === date && r.isCustom);
        if (allIdx !== -1) allRecords[allIdx] = newRecord;
      } else {
        localRecords.unshift(newRecord);
        allRecords.unshift(newRecord);
      }

      localStorage.setItem('user_ritual_records', JSON.stringify(localRecords));

      renderMetrics();
      renderRecords();
      showToast(`${date} 오늘의 리추얼이 성공적으로 저장되었습니다! 🎉`);

      // Scroll to records container smoothly
      const recSection = document.getElementById('records-container');
      if (recSection) {
        recSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  // Copy Studio Content
  if (studioCopyBtn) {
    studioCopyBtn.addEventListener('click', () => {
      const date = (studioDateInput && studioDateInput.value) || new Date().toISOString().split('T')[0];
      const breath = (studioBreathInput && studioBreathInput.value) || '';
      const calm = (studioCalmInput && studioCalmInput.value) || '';
      const strength = (studioStrengthInput && studioStrengthInput.value) || '';
      const episode = (studioEpisodeInput && studioEpisodeInput.value) || '';
      const eveningRadio = document.querySelector('input[name="studio-evening-eval"]:checked');
      const eveningDone = eveningRadio ? eveningRadio.value : '';
      const noteToSelf = (studioNoteInput && studioNoteInput.value) || '';
      const gratitude = (studioGratitudeInput && studioGratitudeInput.value) || '';

      const text = `[주한태 데일리 리추얼 - ${date}]

☀️ 아침 리추얼
- 호흡 시간: ${breath}
- 편안했던 장면: ${calm}
- 오늘 지킬 강점·가치: ${strength}
- 강점이 드러난 일화/다짐: ${episode}

🌙 저녁 마무리
- 강점 행동 실천: ${eveningDone}
- 나에게 남기는 말: ${noteToSelf}
- 감사일기: ${gratitude}`;

      navigator.clipboard.writeText(text).then(() => {
        showToast('작성한 리추얼 내용이 클립보드에 복사되었습니다! 📋');
      });
    });
  }

  // Download TXT
  if (studioDownloadBtn) {
    studioDownloadBtn.addEventListener('click', () => {
      const date = (studioDateInput && studioDateInput.value) || new Date().toISOString().split('T')[0];
      const breath = (studioBreathInput && studioBreathInput.value) || '';
      const calm = (studioCalmInput && studioCalmInput.value) || '';
      const strength = (studioStrengthInput && studioStrengthInput.value) || '';
      const episode = (studioEpisodeInput && studioEpisodeInput.value) || '';
      const eveningRadio = document.querySelector('input[name="studio-evening-eval"]:checked');
      const eveningDone = eveningRadio ? eveningRadio.value : '';
      const noteToSelf = (studioNoteInput && studioNoteInput.value) || '';
      const gratitude = (studioGratitudeInput && studioGratitudeInput.value) || '';

      const text = `[주한태 데일리 리추얼 - ${date}]

☀️ 아침 리추얼
- 호흡 시간: ${breath}
- 편안했던 장면: ${calm}
- 오늘 지킬 강점·가치: ${strength}
- 강점이 드러난 일화/다짐: ${episode}

🌙 저녁 마무리
- 강점 행동 실천: ${eveningDone}
- 나에게 남기는 말: ${noteToSelf}
- 감사일기: ${gratitude}`;

      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `ritual-${date}.txt`;
      a.click();
      URL.revokeObjectURL(a.href);
      showToast(`ritual-${date}.txt 파일이 다운로드되었습니다!`);
    });
  }

  // Clear Studio Inputs
  if (studioClearBtn) {
    studioClearBtn.addEventListener('click', () => {
      if (confirm('작성 중인 내용을 모두 지우시겠습니까?')) {
        if (studioBreathInput) studioBreathInput.value = '';
        if (studioCalmInput) studioCalmInput.value = '';
        if (studioStrengthInput) studioStrengthInput.value = '';
        if (studioEpisodeInput) studioEpisodeInput.value = '';
        if (studioNoteInput) studioNoteInput.value = '';
        if (studioGratitudeInput) studioGratitudeInput.value = '';
        showToast('입력창이 초기화되었습니다.');
      }
    });
  }

  // Open New Entry Button scrolls to Studio
  if (openNewEntryBtn) {
    openNewEntryBtn.addEventListener('click', () => {
      const studio = document.getElementById('ritual-studio');
      if (studio) {
        studio.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (studioBreathInput) studioBreathInput.focus();
      }
    });
  }


  // Card 3: Guide Modal Controller (T09-C06 ~ T09-C10)
  // ==========================================
  const guideModalOverlay = document.getElementById('guide-modal-overlay');
  const btnOpenGuideModal = document.getElementById('btn-open-guide-modal');
  const guideModalCloseBtn = document.getElementById('guide-modal-close-btn');
  const guideBtnPrev = document.getElementById('guide-btn-prev');
  const guideBtnNext = document.getElementById('guide-btn-next');
  const guideStepIndicator = document.getElementById('guide-step-indicator');
  const guideModalTitle = document.getElementById('guide-modal-title');
  const guideModalBody = document.querySelector('.guide-modal-body');

  const guideSteps = [
    {
      step: '2단계 확인 중',
      title: '에이전트에게 주는 다섯 가지 규칙',
      content: `
        <div class="guide-section">
          <h4>하는 일</h4>
          <p>내 리추얼 기록을 바탕으로 에이전트에게 역할을 부여하고, 거짓이나 과장을 걸러낼 수 있는 나만의 규칙 5개를 작성합니다.</p>
          <p><strong>우선순위 원칙</strong> ④ 기록 없으면 비우기 > ① 장면 > ② 반복 > ③ 나란히 > ⑤ 3인칭 순서로 엄격히 통제합니다.</p>
        </div>
        <div class="guide-section border-emerald">
          <h4>통과 기준</h4>
          <ul>
            <li><strong>T09-C03</strong> 규칙이 다섯 개이다.</li>
            <li><strong>T09-C04</strong> 학생 자신의 표현으로 작성되어 있다.</li>
            <li><strong>T09-C05</strong> 규칙끼리 부딪힐 때의 우선순위가 정해져 있다.</li>
          </ul>
        </div>
      `
    },
    {
      step: '3단계 확인 중',
      title: '강점 지도 뽑고, 틀린 것 지우기',
      content: `
        <div class="guide-section">
          <h4>하는 일</h4>
          <p>
            에이전트에게 상위 강점 세 개를 고르게 하고, 강점마다 네 가지를 붙이게 합니다. 날짜가 있는 장면, 동료가 말한 것, 그때 내가 지킨 가치, 그리고 1번부터 8번 과제까지 만든 것 중 그 강점이 드러난 것. 그다음이 진짜 작업입니다. 표를 읽고 아닌 것을 지우십시오. 기록에 없는 장면, 나 같지 않은 표현, 남이 말한 것을 부풀린 것. 지운 자리에 왜 지웠는지 한 줄을 남깁니다. 카드 1에서 표시한 대목과 견주어 보면 판단이 쉽습니다. 하나도 지우지 않았다면 두 가지 중 하나입니다. 에이전트가 완벽했거나, 내가 안 읽었거나. 대개 뒤쪽입니다.
          </p>
          <p style="margin-bottom: 0;">
            <strong>완료 목표</strong> 에이전트가 고른 강점 셋을 내가 검사합니다. 지우는 것이 이 카드의 일입니다.
          </p>
        </div>

        <div class="guide-section">
          <h4>첫 행동</h4>
          <ul>
            <li>"상위 강점 셋을 고르고, 강점마다 날짜 있는 장면·동료가 말한 것·지킨 가치·1~8번 과제 중 관련된 것을 붙여 표로" 요청합니다.</li>
            <li>표를 서사 문서에 옮깁니다.</li>
            <li>아닌 항목을 지우고 이유를 적습니다.</li>
            <li>지운 뒤 빈 칸이 생기면 기록에서 직접 찾아 채우거나 "기록에 없음"으로 둡니다.</li>
          </ul>
        </div>

        <div class="guide-section border-emerald">
          <h4>통과 기준</h4>
          <ul>
            <li><strong>T09-C06</strong> 강점이 세 개 이상이다.</li>
            <li><strong>T09-C07</strong> 강점 각각에 날짜가 적힌 장면이 하나 이상 있다.</li>
            <li><strong>T09-C08</strong> 강점 각각에 동료가 말한 것이 있거나 "자신의 느낌"이 적혀 있다.</li>
            <li><strong>T09-C09</strong> 강점 각각에 1번부터 8번 과제 중 관련된 것이 하나 이상 적혀 있다.</li>
            <li><strong>T09-C10</strong> 에이전트 제안 가운데 학생이 지운 항목이 하나 이상 있고, 지운 이유가 각각 적혀 있다.</li>
          </ul>
        </div>

        <div class="guide-section border-amber">
          <h4>막히는 지점과 확인 순서</h4>
          <div class="guide-sub-heading">세 개가 다 비슷합니다</div>
          <p>"셋이 서로 어떻게 다른지 각각 다른 장면으로 설명해 달라"고 합니다. 설명이 안 되면 둘을 합치고 다른 후보를 올립니다.</p>
          <div class="guide-sub-heading">동료가 말한 것이 없습니다</div>
          <p>동료 나눔을 건너뛴 날이 많은 경우입니다. 그 자리에 자신의 느낌을 적습니다.</p>
        </div>

        <div class="guide-section border-purple">
          <h4>남길 것</h4>
          <ul>
            <li>강점 지도 표</li>
            <li>지운 항목과 이유</li>
          </ul>
        </div>
      `
    },
    {
      step: '4단계 확인 중',
      title: '나의 회복탄력성: 고난을 통해 더 나아진 나',
      content: `
        <div class="guide-section">
          <h4>하는 일</h4>
          <p>고난(과정 이전 연도·장소)에서 출발하여 방황을 극복하고, 13주 리추얼 속에서 물리적 행동(알람 10개)으로 회복하여 더 나아진 나로 끝나는 이야기를 완성합니다.</p>
          <p>에이전트로부터 3인칭 초안(900자 안팎)을 받고, 내가 1인칭으로 직접 고쳐 써 두 판을 나란히 남깁니다. 동료 두 사람에게 읽히고 두 질문의 답을 이름 없이 적습니다.</p>
        </div>
        <div class="guide-section border-emerald">
          <h4>통과 기준</h4>
          <ul>
            <li><strong>T09-C11</strong> 이야기에 고난, 다시 일어난 날, 더 나아진 나의 세 부분이 각각 있고, 고난은 과정 이전의 일로 연도와 장소가 있다.</li>
            <li><strong>T09-C12</strong> 3인칭 초안과 1인칭 완성본이 모두 남아 있다.</li>
            <li><strong>T09-C13</strong> 동료 두 사람의 답("나 같은가", "지어낸 느낌이 있는가")이 이름 없이 적혀 있다.</li>
          </ul>
        </div>
      `
    },
    {
      step: '5단계 확인 중',
      title: '자기소개서 초안과 포트폴리오 뼈대',
      content: `
        <div class="guide-section">
          <h4>하는 일</h4>
          <p>
            1인칭 이야기를 자기소개서 분량으로 줄입니다. 대략 1,000자 안팎이면 좋습니다. 이름, 강점 셋, 고비 한 장면, 지금 하고 싶은 것. 이 네 가지가 들어가면 됩니다. 말투는 "나를 처음 만나는 동료"에게 쓴다고 생각하면 됩니다. 첫 문장과 마지막 문장은 꼭 내 손으로 쓰십시오.
          </p>
          <p>
            포트폴리오는 이번에 뼈대만 세웁니다. 한 페이지에 이름, 자기소개서, 강점 셋을 두고, 1번부터 8번 과제에서 만든 것들을 각 강점 아래에 증거로 배치합니다. 10번 논문, 11번 소설, 마지막 과제의 대표작이 들어갈 자리는 비워 둡니다.
          </p>
          <p style="margin-bottom: 0;">
            <strong>완료 목표</strong> 이야기를 실제로 보낼 수 있는 자기소개서로 줄이고, 증거를 붙일 자리를 마련합니다.
          </p>
        </div>

        <div class="guide-section border-emerald">
          <h4>통과 기준</h4>
          <ul>
            <li><strong>T09-C14</strong> 자기소개서 초안에 본인 이름, 강점 셋, 고비 한 장면, 지금 하고 싶은 것이 들어 있다.</li>
            <li><strong>T09-C15</strong> 포트폴리오 뼈대(URL 또는 문서 안의 목차)에 본인 이름과 1~8번 과제 산출물이 강점별로 놓여 있다.</li>
            <li><strong>T09-C16</strong> 제출문에 ① AI에게 맡긴 일, ② 내가 직접 판단한 일, ③ AI 제안을 따르지 않은 일이 각각 나뉘어 적혀 있다.</li>
            <li><strong>T09-C17</strong> 짧은 확인 방법에 서사 문서 안에서 자기소개서와 강점 지도를 어디서 찾는지가 적혀 있다.</li>
            <li><strong>T09-C18</strong> 서사 문서 파일이 한 개이고 형식은 DOCX·MD·TXT 중 하나이며, 비밀번호나 외부 계정 없이 열린다.</li>
            <li><strong>T09-C19</strong> 제출한 모든 URL은 계정 생성·로그인·인증·초대·비밀번호·OAuth·CAPTCHA 없이 새 시크릿 창에서 열린다.</li>
            <li><strong>T09-C26</strong> 제출물에 본인 이름 외의 다른 사람 실명·연락처, 비밀번호·토큰·API 키가 없다.</li>
          </ul>
        </div>

        <div class="guide-section border-purple">
          <h4>남길 것</h4>
          <ul>
            <li>자기소개서 초안 (1,000자 안팎)</li>
            <li>포트폴리오 뼈대 (URL 및 목차 매핑)</li>
            <li>AI와 나의 판단 3줄 및 검증 삼총사</li>
          </ul>
        </div>
      `
    }
  ];

  let currentStepIdx = 1; // Default: Step 3 (강점 지도 뽑고, 틀린 것 지우기)

  function renderGuideStep(idx) {
    if (idx < 0 || idx >= guideSteps.length) return;
    currentStepIdx = idx;
    const data = guideSteps[idx];
    if (guideStepIndicator) guideStepIndicator.textContent = data.step;
    if (guideModalTitle) guideModalTitle.textContent = data.title;
    if (guideModalBody) guideModalBody.innerHTML = data.content;

    if (guideBtnPrev) guideBtnPrev.disabled = idx === 0;
    if (guideBtnNext) guideBtnNext.disabled = idx === guideSteps.length - 1;
  }

  if (btnOpenGuideModal && guideModalOverlay) {
    btnOpenGuideModal.addEventListener('click', () => {
      renderGuideStep(1); // 3단계 카드
      guideModalOverlay.classList.add('active');
    });
  }

  if (guideModalCloseBtn && guideModalOverlay) {
    guideModalCloseBtn.addEventListener('click', () => {
      guideModalOverlay.classList.remove('active');
    });
  }

  if (guideModalOverlay) {
    guideModalOverlay.addEventListener('click', (e) => {
      if (e.target === guideModalOverlay) {
        guideModalOverlay.classList.remove('active');
      }
    });
  }

  if (guideBtnPrev) {
    guideBtnPrev.addEventListener('click', () => {
      if (currentStepIdx > 0) renderGuideStep(currentStepIdx - 1);
    });
  }

  if (guideBtnNext) {
    guideBtnNext.addEventListener('click', () => {
      if (currentStepIdx < guideSteps.length - 1) renderGuideStep(currentStepIdx + 1);
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && guideModalOverlay && guideModalOverlay.classList.contains('active')) {
      guideModalOverlay.classList.remove('active');
    }
  });
});

