document.addEventListener("DOMContentLoaded", () => {
  const loginScreen = document.getElementById("loginScreen");
  const dashboardScreen = document.getElementById("dashboardScreen");
  const loginForm = document.getElementById("loginForm");
  const loginInput = document.getElementById("loginInput");
  const passwordInput = document.getElementById("passwordInput");
  const loginError = document.getElementById("loginError");
  const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");
  const registerBtn = document.getElementById("registerBtn");

  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const themeText = document.getElementById("themeText");
  const logoutBtn = document.getElementById("logoutBtn");
  const logoutModal = document.getElementById("logoutModal");
  const cancelLogoutBtn = document.getElementById("cancelLogoutBtn");
  const confirmLogoutBtn = document.getElementById("confirmLogoutBtn");
  const removeAvatarModal = document.getElementById("removeAvatarModal");
  const cancelRemoveAvatarBtn = document.getElementById("cancelRemoveAvatarBtn");
  const confirmRemoveAvatarBtn = document.getElementById("confirmRemoveAvatarBtn");

  const heroEyebrow = document.getElementById("heroEyebrow");
  const heroTitle = document.getElementById("heroTitle");
  const heroDescription = document.getElementById("heroDescription");
  const studentFullName = document.getElementById("studentFullName");
  const studentClassBtn = document.getElementById("studentClassBtn");
  const teacherName = document.getElementById("teacherName");
  const accountLogin = document.getElementById("accountLogin");
  const accountEmail = document.getElementById("accountEmail");
  const accountPhone = document.getElementById("accountPhone");
  const toggleLoginBtn = document.getElementById("toggleLoginBtn");
  const editProfileBtn = document.getElementById("editProfileBtn");
  const profileModal = document.getElementById("profileModal");
  const avatarInput = document.getElementById("avatarInput");
  const removeAvatarBtn = document.getElementById("removeAvatarBtn");
  const studentPhoto = document.getElementById("studentPhoto");
  const photoPlaceholder = document.getElementById("photoPlaceholder");

  const weekRangeTitle = document.getElementById("weekRangeTitle");
  const prevWeekBtn = document.getElementById("prevWeekBtn");
  const nextWeekBtn = document.getElementById("nextWeekBtn");
  const dayTabs = document.getElementById("dayTabs");
  const diaryTitle = document.getElementById("diaryTitle");
  const diaryTableWrap = document.getElementById("diaryTableWrap");

  const forgotModal = document.getElementById("forgotModal");
  const forgotMessage = document.getElementById("forgotMessage");
  const registerModal = document.getElementById("registerModal");
  const registerStepCode = document.getElementById("registerStepCode");
  const registerStepAccount = document.getElementById("registerStepAccount");
  const inviteForm = document.getElementById("inviteForm");
  const inviteCodeInput = document.getElementById("inviteCodeInput");
  const inviteError = document.getElementById("inviteError");
  const registerForm = document.getElementById("registerForm");
  const newLoginInput = document.getElementById("newLoginInput");
  const newPasswordInput = document.getElementById("newPasswordInput");
  const repeatPasswordInput = document.getElementById("repeatPasswordInput");
  const registerError = document.getElementById("registerError");

  const STORAGE_KEYS = {
    user: "schoolPlusPlus_user",
    theme: "schoolPlusPlus_theme",
    avatar: "schoolPlusPlus_avatar"
  };

  const DAY_ORDER = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const DAY_NAMES = {
    monday: "Понедельник",
    tuesday: "Вторник",
    wednesday: "Среда",
    thursday: "Четверг",
    friday: "Пятница",
    saturday: "Суббота",
    sunday: "Воскресенье"
  };
  const DAY_SHORT = {
    monday: "Пн",
    tuesday: "Вт",
    wednesday: "Ср",
    thursday: "Чт",
    friday: "Пт",
    saturday: "Сб",
    sunday: "Вс"
  };

  const accounts = typeof SCHOOL_ACCOUNTS !== "undefined" && Array.isArray(SCHOOL_ACCOUNTS) ? SCHOOL_ACCOUNTS : [];
  const diary = typeof SCHOOL_DIARY !== "undefined" ? SCHOOL_DIARY : { weeks: [] };
  let selectedWeekIndex = getInitialWeekIndex();
  let selectedDayKey = getInitialDayKey();
  let isLoginVisible = false;
  let currentUser = null;

  init();

  function init() {
    loadTheme();
    bindEvents();
    renderPasswordToggles();
    renderAvatar();

    const savedUser = getSavedUser();
    if (savedUser) {
      showDashboard(savedUser);
    } else {
      showLogin();
    }
  }

  function bindEvents() {
    loginForm.addEventListener("submit", handleLogin);
    forgotPasswordBtn.addEventListener("click", () => openModal(forgotModal));
    registerBtn.addEventListener("click", openRegisterModal);

    themeToggle.addEventListener("click", toggleTheme);
    logoutBtn.addEventListener("click", () => openModal(logoutModal));
    cancelLogoutBtn.addEventListener("click", () => closeModal(logoutModal));
    confirmLogoutBtn.addEventListener("click", logout);
    cancelRemoveAvatarBtn.addEventListener("click", () => closeModal(removeAvatarModal));
    confirmRemoveAvatarBtn.addEventListener("click", removeAvatar);

    prevWeekBtn.addEventListener("click", () => selectWeek(selectedWeekIndex - 1));
    nextWeekBtn.addEventListener("click", () => selectWeek(selectedWeekIndex + 1));
    dayTabs.addEventListener("click", (event) => {
      const button = event.target.closest(".day-tab");
      if (!button) return;
      selectedDayKey = button.dataset.day;
      renderDiary();
    });

    avatarInput.addEventListener("change", handleAvatarUpload);
    removeAvatarBtn.addEventListener("click", () => openModal(removeAvatarModal));
    toggleLoginBtn.addEventListener("click", toggleLoginVisibility);
    editProfileBtn.addEventListener("click", () => openModal(profileModal));

    inviteCodeInput.addEventListener("input", () => {
      inviteCodeInput.value = formatInviteCode(inviteCodeInput.value);
      hideMessage(inviteError);
    });
    inviteForm.addEventListener("submit", handleInviteSubmit);
    registerForm.addEventListener("submit", handleRegisterSubmit);

    document.querySelectorAll("[data-close-modal]").forEach((button) => {
      button.addEventListener("click", () => {
        closeModal(document.getElementById(button.dataset.closeModal));
      });
    });

    document.querySelectorAll(".modal-overlay").forEach((modal) => {
      modal.addEventListener("click", (event) => {
        if (event.target === modal) closeModal(modal);
      });
    });

    document.querySelectorAll("[data-prototype-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        showMessage(forgotMessage, "Восстановление в прототипе пока не подключено.", "info");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        document.querySelectorAll(".modal-overlay").forEach(closeModal);
      }
    });
  }

  function handleLogin(event) {
    event.preventDefault();
    const login = loginInput.value.trim();
    const password = passwordInput.value;
    const account = accounts.find((item) => item.login === login && item.password === password);

    if (!account) {
      showMessage(loginError, "Неверный логин или пароль. Проверьте данные и попробуйте ещё раз.");
      return;
    }

    saveUser(account);
    hideMessage(loginError);
    showDashboard(account);
  }

  function openRegisterModal() {
    inviteForm.reset();
    registerForm.reset();
    hideMessage(inviteError);
    hideMessage(registerError);
    registerStepCode.classList.remove("hidden");
    registerStepAccount.classList.add("hidden");
    openModal(registerModal);
    inviteCodeInput.focus();
  }

  function handleInviteSubmit(event) {
    event.preventDefault();
    const code = inviteCodeInput.value.trim();
    const account = accounts.find((item) => item.inviteCode === code);

    if (!account) {
      showMessage(inviteError, "Пригласительный код не найден. Проверьте символы и дефисы.");
      return;
    }

    registerStepCode.classList.add("hidden");
    registerStepAccount.classList.remove("hidden");
    newLoginInput.focus();
  }

  function handleRegisterSubmit(event) {
    event.preventDefault();
    const login = newLoginInput.value.trim();
    const password = newPasswordInput.value;
    const repeated = repeatPasswordInput.value;

    if (!login || !password) {
      showMessage(registerError, "Заполните логин и пароль.");
      return;
    }

    if (password !== repeated) {
      showMessage(registerError, "Пароли не совпадают.");
      return;
    }

    const testAccount = accounts[0];
    saveUser(testAccount);
    closeModal(registerModal);
    showDashboard(testAccount);
  }

  function showLogin() {
    loginScreen.classList.remove("hidden");
    dashboardScreen.classList.add("hidden");
  }

  function showDashboard(user) {
    currentUser = user;
    isLoginVisible = false;
    loginScreen.classList.add("hidden");
    dashboardScreen.classList.remove("hidden");
    renderStudent(user);
    renderHero(user);
    renderDiary();
  }

  function saveUser(user) {
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  }

  function getSavedUser() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.user);
      const user = raw ? JSON.parse(raw) : null;

      if (!user || !user.login || !user.firstName || !user.lastName) {
        localStorage.removeItem(STORAGE_KEYS.user);
        return null;
      }

      return accounts.find((account) => account.login === user.login) || user;
    } catch (error) {
      localStorage.removeItem(STORAGE_KEYS.user);
      return null;
    }
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEYS.user);
    loginForm.reset();
    closeModal(logoutModal);
    showLogin();
  }

  function renderStudent(user) {
    const fullName = `${user.lastName} ${user.firstName}`.toUpperCase();
    const teacherText = user.classroom ? `${user.teacher}, каб. ${user.classroom}` : user.teacher;

    studentFullName.textContent = fullName;
    studentClassBtn.textContent = `${user.className} класс`;
    teacherName.textContent = teacherText || "—";
    accountEmail.textContent = user.email || "не указан";
    accountPhone.textContent = user.phone || "не указан";
    renderAccountLogin(user);
  }

  function toggleLoginVisibility() {
    isLoginVisible = !isLoginVisible;

    if (currentUser) {
      renderAccountLogin(currentUser);
    }
  }

  function renderAccountLogin(user) {
    accountLogin.textContent = isLoginVisible ? user.login : "••••••••";
    toggleLoginBtn.innerHTML = getEyeIcon(isLoginVisible);
    toggleLoginBtn.setAttribute("aria-label", isLoginVisible ? "Скрыть логин" : "Показать логин");
  }

  function renderHero(user) {
    const today = new Date();
    const dayKey = getDayKeyByDate(today);
    const dateText = formatDateLong(today);
    const dayText = DAY_NAMES[dayKey].toLowerCase();
    const todayLessons = getLessonsForDate(today);

    heroEyebrow.textContent = `Привет, ${user.firstName}! Сегодня`;
    heroTitle.textContent = `${dateText}, ${dayText}`;
    heroDescription.textContent = todayLessons.length
      ? "Учебный день. Ниже собраны уроки, задания и ближайшие события."
      : "Уроков нет. Можно спокойно отдохнуть и подготовиться к новой неделе.";
  }

  function renderDiary() {
    const week = diary.weeks[selectedWeekIndex];
    if (!week) {
      weekRangeTitle.textContent = "Данных пока нет";
      dayTabs.innerHTML = "";
      diaryTitle.textContent = "Дневник";
      diaryTableWrap.innerHTML = `<div class="empty-state">Недели с расписанием пока не добавлены.</div>`;
      return;
    }

    weekRangeTitle.textContent = formatWeekRange(week);
    prevWeekBtn.disabled = selectedWeekIndex === 0;
    nextWeekBtn.disabled = selectedWeekIndex >= diary.weeks.length - 1;
    renderDayTabs(week);

    const lessons = week.days[selectedDayKey] || [];
    const dayDate = getDateForDay(week.start, selectedDayKey);
    diaryTitle.textContent = `${DAY_NAMES[selectedDayKey]}, ${dayDate.getDate()}`;

    if (!lessons.length) {
      diaryTableWrap.innerHTML = `<div class="empty-state">В этот день уроков нет. Дневник пуст, но неделя остаётся доступной для заполнения.</div>`;
      return;
    }

    diaryTableWrap.innerHTML = `
      <table class="diary-table">
        <thead>
          <tr>
            <th>Урок</th>
            <th>Домашнее задание</th>
            <th>Отметка</th>
          </tr>
        </thead>
        <tbody>
          ${lessons.map(renderLessonRow).join("")}
        </tbody>
      </table>
    `;
  }

  function renderLessonRow(lesson) {
    const homework = lesson.homework ? escapeHtml(lesson.homework) : "—";
    const grade = lesson.grade ? `<span class="grade">${escapeHtml(lesson.grade)}</span>` : "—";

    return `
      <tr>
        <td data-label="Урок">
          <div class="lesson-cell">
            <strong>${lesson.number}. ${escapeHtml(lesson.subject)}</strong>
            <span>${escapeHtml(lesson.time)} · каб. ${escapeHtml(lesson.room)}</span>
          </div>
        </td>
        <td data-label="Домашнее задание">${homework}</td>
        <td data-label="Отметка">${grade}</td>
      </tr>
    `;
  }

  function renderDayTabs(week) {
    const todayIso = toIsoDate(new Date());
    dayTabs.innerHTML = DAY_ORDER.map((dayKey) => {
      const date = getDateForDay(week.start, dayKey);
      const isSelected = dayKey === selectedDayKey;
      const isToday = toIsoDate(date) === todayIso;
      return `
        <button class="day-tab ${isSelected ? "active" : ""} ${isToday ? "real-today" : ""}" type="button" data-day="${dayKey}">
          <span>${DAY_SHORT[dayKey]}</span>
          <small>${date.getDate()}</small>
        </button>
      `;
    }).join("");
  }

  function selectWeek(index) {
    if (index < 0 || index >= diary.weeks.length) return;
    selectedWeekIndex = index;
    selectedDayKey = getInitialDayKeyForWeek(diary.weeks[index]);
    renderDiary();
  }

  function getInitialWeekIndex() {
    const todayIso = toIsoDate(new Date());
    const index = diary.weeks.findIndex((week) => week.start <= todayIso && todayIso <= week.end);
    return index >= 0 ? index : 0;
  }

  function getInitialDayKey() {
    const week = diary.weeks[selectedWeekIndex];
    return getInitialDayKeyForWeek(week);
  }

  function getInitialDayKeyForWeek(week) {
    if (!week) return "monday";
    const today = new Date();
    const todayIso = toIsoDate(today);
    if (week.start <= todayIso && todayIso <= week.end) return getDayKeyByDate(today);
    return "monday";
  }

  function getLessonsForDate(date) {
    const iso = toIsoDate(date);
    const week = diary.weeks.find((item) => item.start <= iso && iso <= item.end);
    return week ? week.days[getDayKeyByDate(date)] || [] : [];
  }

  function getDayKeyByDate(date) {
    const map = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    return map[date.getDay()];
  }

  function getDateForDay(weekStart, dayKey) {
    const date = parseIsoDate(weekStart);
    date.setDate(date.getDate() + DAY_ORDER.indexOf(dayKey));
    return date;
  }

  function parseIsoDate(value) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  function toIsoDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function formatDateLong(date) {
    return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(date);
  }

  function formatWeekRange(week) {
    const start = parseIsoDate(week.start);
    const end = parseIsoDate(week.end);
    const startDay = start.getDate();
    const endDay = end.getDate();
    const month = new Intl.DateTimeFormat("ru-RU", { month: "long" }).format(end);
    return `${startDay}–${endDay} ${month}`;
  }

  function handleAvatarUpload() {
    const file = avatarInput.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      localStorage.setItem(STORAGE_KEYS.avatar, reader.result);
      renderAvatar();
    };
    reader.readAsDataURL(file);
  }

  function removeAvatar() {
    localStorage.removeItem(STORAGE_KEYS.avatar);
    avatarInput.value = "";
    closeModal(removeAvatarModal);
    renderAvatar();
  }

  function renderAvatar() {
    const avatar = localStorage.getItem(STORAGE_KEYS.avatar);
    if (avatar) {
      studentPhoto.src = avatar;
      studentPhoto.classList.remove("hidden");
      photoPlaceholder.classList.add("hidden");
      removeAvatarBtn.classList.remove("hidden");
      return;
    }

    studentPhoto.removeAttribute("src");
    studentPhoto.classList.add("hidden");
    photoPlaceholder.classList.remove("hidden");
    removeAvatarBtn.classList.add("hidden");
    photoPlaceholder.innerHTML = getUploadIcon();
  }

  function toggleTheme() {
    const isDark = document.body.classList.toggle("dark");
    const theme = isDark ? "dark" : "light";
    localStorage.setItem(STORAGE_KEYS.theme, theme);
    setThemeButton(theme);
  }

  function loadTheme() {
    const theme = localStorage.getItem(STORAGE_KEYS.theme) === "dark" ? "dark" : "light";
    document.body.classList.toggle("dark", theme === "dark");
    setThemeButton(theme);
  }

  function setThemeButton(theme) {
    themeIcon.innerHTML = theme === "dark" ? getSunIcon() : getMoonIcon();
    themeText.textContent = theme === "dark" ? "Светлая" : "Тёмная";
  }

  function renderPasswordToggles() {
    document.querySelectorAll("[data-toggle-password]").forEach((button) => {
      const input = document.getElementById(button.dataset.togglePassword);
      button.innerHTML = getEyeIcon(false);
      button.addEventListener("click", () => {
        const isHidden = input.type === "password";
        input.type = isHidden ? "text" : "password";
        button.innerHTML = getEyeIcon(isHidden);
        button.setAttribute("aria-label", isHidden ? "Скрыть пароль" : "Показать пароль");
      });
    });
  }

  function openModal(modal) {
    modal.classList.remove("hidden");
  }

  function closeModal(modal) {
    if (modal) modal.classList.add("hidden");
  }

  function showMessage(element, text, type = "error") {
    element.textContent = text;
    element.className = `form-message ${type}`;
    element.classList.remove("hidden");
  }

  function hideMessage(element) {
    element.textContent = "";
    element.classList.add("hidden");
  }

  function formatInviteCode(value) {
    const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 16);
    return clean.replace(/(.{4})/g, "$1-").replace(/-$/, "");
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getEyeIcon(isVisible) {
    if (isVisible) {
      return `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.2 5.4A9.8 9.8 0 0 1 12 5c5.5 0 9 5.2 9 7a7.8 7.8 0 0 1-2.1 3M6.5 6.8C4.3 8.3 3 10.7 3 12c0 1.8 3.5 7 9 7 1.4 0 2.6-.3 3.7-.8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    }

    return `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/></svg>`;
  }

  function getMoonIcon() {
    return `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 15.31A8.2 8.2 0 0 1 8.69 4a6.4 6.4 0 1 0 11.31 11.31Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }

  function getSunIcon() {
    return `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
  }

  function getUploadIcon() {
    return `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5M5 20h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Загрузить фото</span>`;
  }
});
