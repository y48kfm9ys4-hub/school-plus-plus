// =========================
// School++ / Main script
// =========================

document.addEventListener("DOMContentLoaded", () => {
  const loginScreen = document.getElementById("loginScreen");
  const dashboardScreen = document.getElementById("dashboardScreen");

  const loginForm = document.getElementById("loginForm");
  const studentNameInput = document.getElementById("studentName");
  const studentClassInput = document.getElementById("studentClass");

  const welcomeTitle = document.getElementById("welcomeTitle");

  const profileBtn = document.getElementById("profileBtn");
  const profileModal = document.getElementById("profileModal");
  const closeProfileBtn = document.getElementById("closeProfileBtn");
  const profileOkBtn = document.getElementById("profileOkBtn");
  const profileActions = document.getElementById("profileActions");

  const profileMiniAvatar = document.getElementById("profileMiniAvatar");
  const profileAvatar = document.getElementById("profileAvatar");
  const avatarInput = document.getElementById("avatarInput");
  const removeAvatarBtn = document.getElementById("removeAvatarBtn");

  const removeAvatarModal = document.getElementById("removeAvatarModal");
  const cancelRemoveAvatarBtn = document.getElementById("cancelRemoveAvatarBtn");
  const confirmRemoveAvatarBtn = document.getElementById("confirmRemoveAvatarBtn");

  const avatarCropModal = document.getElementById("avatarCropModal");
  const avatarCropImage = document.getElementById("avatarCropImage");
  const avatarZoomRange = document.getElementById("avatarZoomRange");
  const closeAvatarCropBtn = document.getElementById("closeAvatarCropBtn");
  const cancelAvatarCropBtn = document.getElementById("cancelAvatarCropBtn");
  const saveAvatarCropBtn = document.getElementById("saveAvatarCropBtn");

  const profileName = document.getElementById("profileName");
  const profileSubtitle = document.getElementById("profileSubtitle");

  const logoutBtn = document.getElementById("logoutBtn");
  const logoutModal = document.getElementById("logoutModal");
  const cancelLogoutBtn = document.getElementById("cancelLogoutBtn");
  const confirmLogoutBtn = document.getElementById("confirmLogoutBtn");

  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const themeText = document.getElementById("themeText");

  const heroTitle = document.getElementById("heroTitle");
  const heroDescription = document.getElementById("heroDescription");

  const nextLessonBadge = document.getElementById("nextLessonBadge");
  const nextLessonTitle = document.getElementById("nextLessonTitle");
  const nextLessonInfo = document.getElementById("nextLessonInfo");

  const todayLessonsCount = document.getElementById("todayLessonsCount");
  const todayLessonsText = document.getElementById("todayLessonsText");
  const homeworkCount = document.getElementById("homeworkCount");
  const homeworkText = document.getElementById("homeworkText");
  const testsCount = document.getElementById("testsCount");
  const testsText = document.getElementById("testsText");

  const todayLessonsList = document.getElementById("todayLessonsList");
  const homeworkList = document.getElementById("homeworkList");

  const selectedDayTitle = document.getElementById("selectedDayTitle");
  const todayBtn = document.getElementById("todayBtn");
  const dayTabs = document.getElementById("dayTabs");
  const dayTabButtons = document.querySelectorAll(".day-tab");

  let selectedAvatarData = null;

  const STORAGE_KEYS = {
    user: "schoolPlusPlus_user",
    theme: "schoolPlusPlus_theme",
    avatar: "schoolPlusPlus_avatar"
  };

  // Временная липовая БД.
  // Потом сюда можно будет подключить настоящие данные гимназии/сервера.
  const SCHOOL_DATA = {
    schedule: {
      monday: [
        { time: "14:00–14:45", subject: "Биология", room: "65", note: "Экскурсия" },
        { time: "15:00–15:45", subject: "Искусство", room: "59", note: "Тема не указана" },
        { time: "16:00–16:45", subject: "Физика", room: "79", note: "Тема не указана" },
        { time: "16:55–17:40", subject: "Всемирная история", room: "43", note: "Африка и Америка" }
      ],
      tuesday: [
        { time: "13:30–14:15", subject: "Геометрия", room: "305", note: "Смежные и вертикальные углы" },
        { time: "14:25–15:10", subject: "Английский язык", room: "221", note: "Conditionals" },
        { time: "15:25–16:10", subject: "История", room: "207", note: "Экономическое развитие" },
        { time: "16:20–17:05", subject: "Физкультура", room: "зал", note: "Форма обязательна" }
      ],
      wednesday: [
        { time: "13:30–14:15", subject: "Белорусская литература", room: "116", note: "Караткевич" },
        { time: "14:25–15:10", subject: "Алгебра", room: "305", note: "Решение задач" },
        { time: "15:25–16:10", subject: "География", room: "309", note: "Климатические пояса" },
        { time: "16:20–17:05", subject: "Физика", room: "214", note: "Подготовка к КР" }
      ],
      thursday: [
        { time: "13:30–14:15", subject: "Биология", room: "302", note: "Семена и прорастание" },
        { time: "14:25–15:10", subject: "Русская литература", room: "118", note: "Паустовский" },
        { time: "15:25–16:10", subject: "Английский язык", room: "221", note: "Speaking practice" },
        { time: "16:20–17:05", subject: "Трудовое обучение", room: "105", note: "Практическая работа" }
      ],
      friday: [
        { time: "13:30–14:15", subject: "Геометрия", room: "305", note: "Контрольная работа" },
        { time: "14:25–15:10", subject: "География", room: "309", note: "Работа с картой" },
        { time: "15:25–16:10", subject: "Алгебра", room: "305", note: "Самостоятельная работа" },
        { time: "16:20–17:05", subject: "История Беларуси", room: "207", note: "Повторение темы" }
      ],
      saturday: [],
      sunday: []
    },

    homework: [
      {
        subject: "Английский",
        task: "ex. 4c*, p. 183 (SB)\n Ответить на вопросы и обосновать почему так.\n Отвечать без тетради.",
        due: "завтра",
        priority: "high"
      },
      {
        subject: "Всемирная история",
        task: "Посмотреть презентацию про Тропическую Африку и Америку.",
        due: "завтра",
        priority: "medium"
      },
      {
        subject: "Биология",
        task: "Подг. к экскурсии (знать многообразие растений)",
        due: "завтра",
        priority: "low"
      }
    ],

    tests: [
      {
        subject: "Алгебра",
        date: "понедельник",
        title: "Контрольная работа"
      }
    ]
  };

  const DAY_KEYS = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday"
  ];

  const DAY_NAMES = {
    sunday: "Воскресенье",
    monday: "Понедельник",
    tuesday: "Вторник",
    wednesday: "Среда",
    thursday: "Четверг",
    friday: "Пятница",
    saturday: "Суббота"
  };

  let selectedDayKey = getTodayKey();

  initApp();

  function initApp() {
    loadTheme();
    renderDateAndDayType();
    renderDaySwitcher();
    renderDashboardData(selectedDayKey);

    const savedUser = getSavedUser();

    if (savedUser) {
      showDashboard(savedUser);
    } else {
      showLogin();
    }
  }

  // =========================
  // Переключатель дней
  // =========================

  dayTabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const dayKey = button.dataset.day;
      selectDay(dayKey);
    });
  });

  todayBtn.addEventListener("click", () => {
    selectDay(getTodayKey());
  });

  function selectDay(dayKey) {
    selectedDayKey = dayKey;

    renderDaySwitcher();
    renderDashboardData(selectedDayKey);
  }

  function renderDaySwitcher() {
    const realTodayKey = getTodayKey();

    selectedDayTitle.textContent = DAY_NAMES[selectedDayKey];

    dayTabButtons.forEach((button) => {
      const dayKey = button.dataset.day;

      button.classList.toggle("active", dayKey === selectedDayKey);
      button.classList.toggle("real-today", dayKey === realTodayKey);
    });
  }

  // =========================
  // Авторизация
  // =========================

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = studentNameInput.value.trim();
    const studentClass = studentClassInput.value.trim();

    if (name === "" || studentClass === "") {
      alert("Заполни имя и класс");
      return;
    }

    const user = {
      name: name,
      className: studentClass
    };

    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    showDashboard(user);
  });

  function getSavedUser() {
    const savedUser = localStorage.getItem(STORAGE_KEYS.user);

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch (error) {
      localStorage.removeItem(STORAGE_KEYS.user);
      return null;
    }
  }

  function showLogin() {
    loginScreen.classList.remove("hidden");
    dashboardScreen.classList.add("hidden");
  }

  function showDashboard(user) {
    loginScreen.classList.add("hidden");
    dashboardScreen.classList.remove("hidden");

    welcomeTitle.textContent = `Привет, ${user.name}!`;
    renderProfile(user);
  }

  // =========================
  // Профиль ученика
  // =========================

  profileBtn.addEventListener("click", () => {
    const user = getSavedUser();

    if (user) {
      renderProfile(user);
    }

    profileModal.classList.remove("hidden");
  });

  closeProfileBtn.addEventListener("click", () => {
    profileModal.classList.add("hidden");
  });

  profileOkBtn.addEventListener("click", () => {
    profileModal.classList.add("hidden");
  });

  profileModal.addEventListener("click", (event) => {
    if (event.target === profileModal) {
      profileModal.classList.add("hidden");
    }
  });

  avatarInput.addEventListener("change", () => {
    const file = avatarInput.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Выбери изображение");
      avatarInput.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      selectedAvatarData = reader.result;

      avatarCropImage.onload = () => {
        avatarZoomRange.value = "1";
        updateAvatarPreview();
        avatarCropModal.classList.remove("hidden");
      };

      avatarCropImage.src = selectedAvatarData;
    };

    reader.readAsDataURL(file);
  });

  removeAvatarBtn.addEventListener("click", () => {
    const savedAvatar = localStorage.getItem(STORAGE_KEYS.avatar);

    if (!savedAvatar) {
      return;
    }

    removeAvatarModal.classList.remove("hidden");
  });

  cancelRemoveAvatarBtn.addEventListener("click", () => {
    removeAvatarModal.classList.add("hidden");
  });

  confirmRemoveAvatarBtn.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEYS.avatar);
    removeAvatarModal.classList.add("hidden");

    const user = getSavedUser();

    if (user) {
      renderProfile(user);
    }
  });

  removeAvatarModal.addEventListener("click", (event) => {
    if (event.target === removeAvatarModal) {
      removeAvatarModal.classList.add("hidden");
    }
  });

  avatarZoomRange.addEventListener("input", updateAvatarPreview);

  closeAvatarCropBtn.addEventListener("click", closeAvatarCropModal);
  cancelAvatarCropBtn.addEventListener("click", closeAvatarCropModal);

  avatarCropModal.addEventListener("click", (event) => {
    if (event.target === avatarCropModal) {
      closeAvatarCropModal();
    }
  });

  saveAvatarCropBtn.addEventListener("click", () => {
    if (!selectedAvatarData) {
      closeAvatarCropModal();
      return;
    }

    const zoom = Number(avatarZoomRange.value);

    createCroppedAvatar(selectedAvatarData, zoom, (croppedAvatar) => {
      localStorage.setItem(STORAGE_KEYS.avatar, croppedAvatar);

      const user = getSavedUser();

      if (user) {
        renderProfile(user);
      }

      closeAvatarCropModal();
    });
  });

  function updateAvatarPreview() {
    avatarCropImage.style.transform = `scale(${avatarZoomRange.value})`;
  }

  function closeAvatarCropModal() {
    avatarCropModal.classList.add("hidden");
    selectedAvatarData = null;
    avatarInput.value = "";
    avatarZoomRange.value = "1";
    avatarCropImage.src = "";
    avatarCropImage.style.transform = "scale(1)";
  }

  function createCroppedAvatar(imageData, zoom, callback) {
    const image = new Image();

    image.onload = () => {
      const canvasSize = 420;
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = canvasSize;
      canvas.height = canvasSize;

      const sourceSize = Math.min(image.width, image.height) / zoom;
      const sourceX = (image.width - sourceSize) / 2;
      const sourceY = (image.height - sourceSize) / 2;

      context.drawImage(
        image,
        sourceX,
        sourceY,
        sourceSize,
        sourceSize,
        0,
        0,
        canvasSize,
        canvasSize
      );

      callback(canvas.toDataURL("image/jpeg", 0.92));
    };

    image.onerror = () => {
      alert("Не получилось обработать изображение. Попробуй выбрать другую фотографию.");
      closeAvatarCropModal();
    };

    image.src = imageData;
  }

  function renderProfile(user) {
    const classText = user.className ? `${user.className} класс` : "Класс не указан";

    profileName.textContent = user.name;
    profileSubtitle.textContent = `${classText} · ученик`;

    renderAvatar(user.name);
  }

  function renderAvatar(name) {
    const savedAvatar = localStorage.getItem(STORAGE_KEYS.avatar);
    const initials = getInitials(name);

    if (savedAvatar) {
      profileAvatar.style.backgroundImage = `url(${savedAvatar})`;
      profileAvatar.textContent = "";

      profileMiniAvatar.style.backgroundImage = `url(${savedAvatar})`;
      profileMiniAvatar.textContent = "";

      removeAvatarBtn.classList.remove("hidden");
      profileActions.classList.remove("single-action");
    } else {
      profileAvatar.style.backgroundImage = "";
      profileAvatar.textContent = initials;

      profileMiniAvatar.style.backgroundImage = "";
      profileMiniAvatar.textContent = initials;

      removeAvatarBtn.classList.add("hidden");
      profileActions.classList.add("single-action");
    }
  }

  function getInitials(name) {
    return name.trim().charAt(0).toUpperCase();
  }

  // =========================
  // Выход с модальным окном
  // =========================

  logoutBtn.addEventListener("click", () => {
    logoutModal.classList.remove("hidden");
  });

  cancelLogoutBtn.addEventListener("click", () => {
    logoutModal.classList.add("hidden");
  });

  confirmLogoutBtn.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEYS.user);

    studentNameInput.value = "";
    studentClassInput.value = "";

    logoutModal.classList.add("hidden");
    showLogin();
  });

  logoutModal.addEventListener("click", (event) => {
    if (event.target === logoutModal) {
      logoutModal.classList.add("hidden");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      logoutModal.classList.add("hidden");
      profileModal.classList.add("hidden");
      removeAvatarModal.classList.add("hidden");
      closeAvatarCropModal();
    }
  });

  // =========================
  // Тема
  // =========================

  themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark");

    if (isDark) {
      localStorage.setItem(STORAGE_KEYS.theme, "dark");
      setThemeButton("dark");
    } else {
      localStorage.setItem(STORAGE_KEYS.theme, "light");
      setThemeButton("light");
    }
  });

  function loadTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);

    if (savedTheme === "dark") {
      document.body.classList.add("dark");
      setThemeButton("dark");
    } else {
      document.body.classList.remove("dark");
      setThemeButton("light");
    }
  }

  function setThemeButton(theme) {
    if (theme === "dark") {
      themeIcon.innerHTML = getSunIcon();
      themeText.textContent = "Светлая";
    } else {
      themeIcon.innerHTML = getMoonIcon();
      themeText.textContent = "Тёмная";
    }
  }

  function getMoonIcon() {
    return `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M20 15.31A8.2 8.2 0 0 1 8.69 4a6.4 6.4 0 1 0 11.31 11.31Z"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    `;
  }

  function getSunIcon() {
    return `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle
          cx="12"
          cy="12"
          r="4"
          stroke="currentColor"
          stroke-width="2"
        />
        <path
          d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
    `;
  }

  // =========================
  // Дата и тип дня
  // =========================

  function renderDateAndDayType() {
    const now = new Date();
    const dayNumber = now.getDay();

    const dayFormatter = new Intl.DateTimeFormat("ru-RU", {
      weekday: "long"
    });

    const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "long"
    });

    const day = dayFormatter.format(now);
    const date = dateFormatter.format(now);

    heroTitle.textContent = `${date}, ${day}`;

    if (dayNumber === 0) {
      heroDescription.textContent =
        "Уроков нет. Можно спокойно отдохнуть и подготовиться к новой неделе.";
    } else if (dayNumber === 6) {
      heroDescription.textContent =
        "Уроков нет. Отличный день, чтобы закрыть долги, повторить темы и немного отдохнуть.";
    } else {
      heroDescription.textContent =
        "Учебный день. Ниже собраны уроки, задания и ближайшие события.";
    }
  }

  // =========================
  // Главная страница
  // =========================

  function renderDashboardData(dayKey = selectedDayKey) {
    const selectedLessons = SCHOOL_DATA.schedule[dayKey] || [];
    const activeHomework = SCHOOL_DATA.homework || [];
    const activeTests = SCHOOL_DATA.tests || [];

    renderSummaryCards(selectedLessons, activeHomework, activeTests);
    renderTodayLessons(dayKey, selectedLessons);
    renderHomework(activeHomework);
    renderNextLesson();
  }

  function renderSummaryCards(todayLessons, homework, tests) {
    todayLessonsCount.textContent = todayLessons.length;
    todayLessonsText.textContent =
      todayLessons.length > 0
        ? "Расписание загружено"
        : "Уроков нет";

    homeworkCount.textContent = homework.length;
    homeworkText.textContent =
      homework.length > 0
        ? "Активные задания"
        : "Все задания выполнены";

    testsCount.textContent = tests.length;
    testsText.textContent =
      tests.length > 0
        ? `${tests[0].subject} — ${tests[0].date}`
        : "Контрольных нет";
  }

  function renderTodayLessons(todayKey, lessons) {
    if (lessons.length === 0) {
      todayLessonsList.innerHTML = `
        <div class="empty-state">
          В этот день уроков нет. Можно отдохнуть или спокойно подготовиться к занятиям.
        </div>
      `;
      return;
    }

    todayLessonsList.innerHTML = lessons
      .map((lesson) => {
        return `
          <div class="lesson-item">
            <div class="lesson-time">${lesson.time}</div>

            <div class="lesson-main">
              <h4>${lesson.subject}</h4>
              <p>${lesson.note}</p>
            </div>

            <div class="lesson-room">${lesson.room}</div>
          </div>
        `;
      })
      .join("");
  }

  function renderHomework(homework) {
    if (homework.length === 0) {
      homeworkList.innerHTML = `
        <div class="empty-state">
          Домашних заданий пока нет.
        </div>
      `;
      return;
    }

    homeworkList.innerHTML = homework
      .map((item) => {
        return `
          <div class="homework-item">
            <div class="homework-main">
              <h4>${item.subject}</h4>
              <p>${item.task}</p>
              <p>Срок: ${item.due}</p>
            </div>

            <div class="homework-priority ${item.priority}">
              ${getPriorityText(item.priority)}
            </div>
          </div>
        `;
      })
      .join("");
  }

  function renderNextLesson() {
    const nextLessonData = getNextLesson();

    if (!nextLessonData) {
      nextLessonBadge.textContent = "нет";
      nextLessonTitle.textContent = "Уроков нет";
      nextLessonInfo.textContent = "Расписание пока пустое";
      return;
    }

    const { lesson, dayKey, dayOffset } = nextLessonData;

    nextLessonBadge.textContent = getDayOffsetText(dayOffset, dayKey);
    nextLessonTitle.textContent = lesson.subject;
    nextLessonInfo.textContent = `${lesson.time} · кабинет ${lesson.room} · ${lesson.note}`;
  }

  function getNextLesson() {
    const now = new Date();
    const todayNumber = now.getDay();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (let offset = 0; offset < 7; offset++) {
      const dayNumber = (todayNumber + offset) % 7;
      const dayKey = DAY_KEYS[dayNumber];
      const lessons = SCHOOL_DATA.schedule[dayKey] || [];

      for (const lesson of lessons) {
        const lessonStart = getLessonStartMinutes(lesson.time);

        if (offset > 0 || lessonStart > currentMinutes) {
          return {
            lesson: lesson,
            dayKey: dayKey,
            dayOffset: offset
          };
        }
      }
    }

    return null;
  }

  function getLessonStartMinutes(timeRange) {
    const startTime = timeRange.split("–")[0];
    const [hours, minutes] = startTime.split(":").map(Number);

    return hours * 60 + minutes;
  }

  function getTodayKey() {
    const todayNumber = new Date().getDay();
    return DAY_KEYS[todayNumber];
  }

  function getDayOffsetText(offset, dayKey) {
    if (offset === 0) {
      return "сегодня";
    }

    if (offset === 1) {
      return "завтра";
    }

    return DAY_NAMES[dayKey].toLowerCase();
  }

  function getPriorityText(priority) {
    if (priority === "high") {
      return "важно";
    }

    if (priority === "medium") {
      return "средне";
    }

    return "легко";
  }
});