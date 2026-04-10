/**
 * Life Dashboard — app.js
 * Features: Clock/Greeting, Focus Timer (custom duration), To-Do List
 *           (CRUD + prevent duplicates + sort), Quick Links, Dark/Light Mode,
 *           Custom Name, Local Storage persistence
 */

'use strict';

/* ═══════════════════════════════════════════════════════════════
   UTILITIES
═══════════════════════════════════════════════════════════════ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const LS = {
  get: (key, fallback = null) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  set: (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
};

/* ── Toast notifications ───────────────────────────────────── */
const toastContainer = $('.toast-container');
function showToast(msg, type = 'info', duration = 2800) {
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  toastContainer.appendChild(t);
  setTimeout(() => {
    t.classList.add('fade-out');
    t.addEventListener('animationend', () => t.remove());
  }, duration);
}


/* ═══════════════════════════════════════════════════════════════
   THEME (Dark / Light) — Challenge ①
═══════════════════════════════════════════════════════════════ */
const themeToggle = $('#themeToggle');
const toggleKnob  = $('.toggle-knob', themeToggle);

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  toggleKnob.textContent = theme === 'light' ? '☀️' : '🌙';
  LS.set('theme', theme);
}

function initTheme() {
  const saved = LS.get('theme');
  const preferred = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  applyTheme(saved ?? preferred);
}

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'light' ? 'dark' : 'light');
});

initTheme();


/* ═══════════════════════════════════════════════════════════════
   CLOCK & GREETING
═══════════════════════════════════════════════════════════════ */
const clockEl    = $('#clock');
const dateEl     = $('#date');
const greetingEl = $('#greeting');

const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

function getGreeting(hour) {
  if (hour < 5)  return 'Good Night';
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  if (hour < 21) return 'Good Evening';
  return 'Good Night';
}

function pad(n) { return String(n).padStart(2, '0'); }

function updateClock() {
  const now   = new Date();
  const h     = now.getHours();
  const m     = now.getMinutes();
  const s     = now.getSeconds();
  clockEl.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
  dateEl.textContent  = `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  const name = LS.get('userName', '');
  const suffix = name ? `, <span class="user-name">${name}</span>` : '!';
  greetingEl.innerHTML = `${getGreeting(h)}${suffix}`;
}

setInterval(updateClock, 1000);
updateClock();


/* ═══════════════════════════════════════════════════════════════
   CUSTOM NAME — Challenge ②
═══════════════════════════════════════════════════════════════ */
const nameEditBtn = $('#nameEditBtn');

nameEditBtn.addEventListener('click', () => {
  const currentName = LS.get('userName', '');
  const span = $('.user-name') ?? greetingEl;

  // Replace greeting with inline editor
  const saved = greetingEl.innerHTML;
  const input = document.createElement('input');
  input.className = 'name-inline-input';
  input.value = currentName;
  input.maxLength = 30;
  input.placeholder = 'Your name';
  input.setAttribute('aria-label', 'Enter your name');

  const hour = new Date().getHours();
  greetingEl.innerHTML = `${getGreeting(hour)}, `;
  greetingEl.appendChild(input);

  input.focus();
  input.select();

  function saveName() {
    const val = input.value.trim();
    LS.set('userName', val);
    updateClock();
    if (val) showToast(`Hi, ${val}! 👋`, 'success');
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { saveName(); input.blur(); }
    if (e.key === 'Escape') { greetingEl.innerHTML = saved; }
  });
  input.addEventListener('blur', saveName);
});


/* ═══════════════════════════════════════════════════════════════
   FOCUS TIMER (Pomodoro) — with custom duration — Challenge ③
═══════════════════════════════════════════════════════════════ */
const ringFill      = $('#timerRingFill');
const timerDisplay  = $('#timerDisplay');
const durationSelect = $('#durationSelect');
const btnStart      = $('#btnStart');
const btnStop       = $('#btnStop');
const btnReset      = $('#btnReset');
const doneBadge     = $('#timerDoneBadge');

const RING_CIRCUMFERENCE = 502; // 2π × 79 (r=79)

let timerInterval = null;
let timerRunning  = false;
let totalSeconds  = 0;     // total duration in seconds
let remainSeconds = 0;     // current remaining

function getSelectedDuration() {
  return parseInt(durationSelect.value, 10) * 60;
}

function setRingProgress(remaining, total) {
  const fraction = total > 0 ? remaining / total : 1;
  ringFill.style.strokeDashoffset = RING_CIRCUMFERENCE * (1 - fraction);
}

function renderTimer() {
  const m = Math.floor(remainSeconds / 60);
  const s = remainSeconds % 60;
  timerDisplay.textContent = `${pad(m)}:${pad(s)}`;
}

function resetTimer() {
  clearInterval(timerInterval);
  timerRunning  = false;
  totalSeconds  = getSelectedDuration();
  remainSeconds = totalSeconds;
  renderTimer();
  setRingProgress(1, 1);
  doneBadge.classList.remove('visible');
  btnStart.textContent = 'Start';
  ringFill.style.stroke = 'url(#timerGradient)';
}

function startTimer() {
  if (timerRunning) return;
  if (remainSeconds <= 0) resetTimer();
  timerRunning = true;
  btnStart.textContent = 'Running…';
  doneBadge.classList.remove('visible');
  timerInterval = setInterval(() => {
    remainSeconds--;
    renderTimer();
    setRingProgress(remainSeconds, totalSeconds);
    if (remainSeconds <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      btnStart.textContent = 'Start';
      doneBadge.classList.add('visible');
      ringFill.style.stroke = 'var(--success)';
      showToast('⏰ Focus session complete! Great job!', 'success', 4000);
      // Pulse body to notify
      document.body.classList.add('timer-done');
      setTimeout(() => document.body.classList.remove('timer-done'), 600);
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  btnStart.textContent = 'Resume';
}

btnStart.addEventListener('click', startTimer);
btnStop.addEventListener('click', stopTimer);
btnReset.addEventListener('click', resetTimer);

durationSelect.addEventListener('change', () => {
  if (!timerRunning) resetTimer();
  else showToast('Reset the timer to use new duration.', 'info');
});

// Init timer
resetTimer();


/* ═══════════════════════════════════════════════════════════════
   TO-DO LIST (Add / Edit / Delete / Done / Sort / No Duplicates)
═══════════════════════════════════════════════════════════════ */
const todoInput  = $('#todoInput');
const btnAddTodo = $('#btnAddTodo');
const taskList   = $('#taskList');
const todoError  = $('#todoError');
const sortSelect = $('#sortSelect');
const taskCount  = $('#taskCount');

let tasks = LS.get('tasks', []);

/* Key: uuid-lite */
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

function saveTasks() { LS.set('tasks', tasks); }

function getSortedTasks() {
  const mode = sortSelect.value;
  const copy = [...tasks];
  if (mode === 'az')     return copy.sort((a,b) => a.text.localeCompare(b.text));
  if (mode === 'za')     return copy.sort((a,b) => b.text.localeCompare(a.text));
  if (mode === 'done')   return copy.sort((a,b) => Number(a.done) - Number(b.done));
  if (mode === 'undone') return copy.sort((a,b) => Number(b.done) - Number(a.done));
  return copy; // default: insertion order
}

function updateCountBadge() {
  const done  = tasks.filter(t => t.done).length;
  const total = tasks.length;
  taskCount.textContent = total === 0 ? 'No tasks' : `${done}/${total} done`;
}

function setError(msg) {
  todoError.textContent = msg;
  if (msg) {
    todoInput.classList.add('input-error');
    setTimeout(() => {
      todoInput.classList.remove('input-error');
      todoError.textContent = '';
    }, 1800);
  }
}

function renderTasks() {
  const sorted = getSortedTasks();
  taskList.innerHTML = '';

  if (sorted.length === 0) {
    taskList.innerHTML = `
      <li class="empty-task">
        <span class="empty-icon">📋</span>
        <span>No tasks yet — add one above!</span>
      </li>`;
    updateCountBadge();
    return;
  }

  sorted.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item${task.done ? ' done' : ''}`;
    li.dataset.id = task.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.done;
    checkbox.setAttribute('aria-label', `Mark "${task.text}" as done`);
    checkbox.addEventListener('change', () => toggleTask(task.id));

    const textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    textSpan.textContent = task.text;

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'btn-icon edit';
    editBtn.title = 'Edit task';
    editBtn.innerHTML = '✏️';
    editBtn.setAttribute('aria-label', `Edit task "${task.text}"`);
    editBtn.addEventListener('click', () => startEditTask(li, task));

    const delBtn = document.createElement('button');
    delBtn.className = 'btn-icon delete';
    delBtn.title = 'Delete task';
    delBtn.innerHTML = '🗑️';
    delBtn.setAttribute('aria-label', `Delete task "${task.text}"`);
    delBtn.addEventListener('click', () => deleteTask(task.id));

    actions.append(editBtn, delBtn);
    li.append(checkbox, textSpan, actions);
    taskList.appendChild(li);
  });

  updateCountBadge();
}

function addTask() {
  const text = todoInput.value.trim();
  if (!text) { setError('Task cannot be empty.'); todoInput.focus(); return; }

  /* Prevent duplicate — Challenge ③ */
  const isDuplicate = tasks.some(t => t.text.toLowerCase() === text.toLowerCase());
  if (isDuplicate) {
    setError('This task already exists!');
    todoInput.focus();
    showToast('⚠️ Duplicate task not added.', 'error');
    return;
  }

  tasks.push({ id: uid(), text, done: false, createdAt: Date.now() });
  saveTasks();
  todoInput.value = '';
  renderTasks();
  showToast('Task added ✅', 'success', 1800);
}

function toggleTask(id) {
  const t = tasks.find(t => t.id === id);
  if (t) { t.done = !t.done; saveTasks(); renderTasks(); }
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
  showToast('Task deleted 🗑️', 'info', 1600);
}

function startEditTask(li, task) {
  const textSpan = $('.task-text', li);
  const actions  = $('.task-actions', li);

  const input = document.createElement('input');
  input.className = 'task-edit-input';
  input.value = task.text;
  input.maxLength = 200;
  textSpan.replaceWith(input);
  input.focus();
  input.select();

  // Hide action buttons while editing
  actions.style.visibility = 'hidden';

  function saveEdit() {
    const newText = input.value.trim();
    actions.style.visibility = '';
    if (!newText) { renderTasks(); return; }

    /* Prevent duplicate on edit */
    const dup = tasks.some(t => t.id !== task.id && t.text.toLowerCase() === newText.toLowerCase());
    if (dup) { showToast('⚠️ Task with this name already exists.', 'error'); renderTasks(); return; }

    task.text = newText;
    saveTasks();
    renderTasks();
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter')  { e.preventDefault(); saveEdit(); }
    if (e.key === 'Escape') { actions.style.visibility = ''; renderTasks(); }
  });
  input.addEventListener('blur', saveEdit);
}

/* Wire up input events */
btnAddTodo.addEventListener('click', addTask);
todoInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addTask(); });
sortSelect.addEventListener('change', renderTasks);

renderTasks();


/* ═══════════════════════════════════════════════════════════════
   QUICK LINKS
═══════════════════════════════════════════════════════════════ */
const linkNameInput = $('#linkName');
const linkUrlInput  = $('#linkUrl');
const btnAddLink    = $('#btnAddLink');
const linksGrid     = $('#linksGrid');

let links = LS.get('quickLinks', [
  { id: uid(), name: 'Google',   url: 'https://google.com'   },
  { id: uid(), name: 'YouTube',  url: 'https://youtube.com'  },
  { id: uid(), name: 'GitHub',   url: 'https://github.com'   },
]);

function saveLinks() { LS.set('quickLinks', links); }

function getFaviconUrl(url) {
  try {
    const origin = new URL(url).origin;
    return `https://www.google.com/s2/favicons?domain=${origin}&sz=32`;
  } catch { return ''; }
}

function ensureHttps(url) {
  url = url.trim();
  if (!url) return '';
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
  return url;
}

function renderLinks() {
  linksGrid.innerHTML = '';

  if (links.length === 0) {
    linksGrid.innerHTML = '<span class="links-empty">No links yet — add your favorites!</span>';
    return;
  }

  links.forEach(link => {
    const chip = document.createElement('a');
    chip.className = 'link-chip';
    chip.href = link.url;
    chip.target = '_blank';
    chip.rel = 'noopener noreferrer';
    chip.setAttribute('aria-label', `Open ${link.name}`);

    const favicon = document.createElement('img');
    favicon.className = 'favicon';
    favicon.src = getFaviconUrl(link.url);
    favicon.alt = '';
    favicon.width = 16; favicon.height = 16;
    favicon.onerror = () => { favicon.style.display = 'none'; };

    const nameSpan = document.createElement('span');
    nameSpan.textContent = link.name;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-link';
    removeBtn.innerHTML = '×';
    removeBtn.title = `Remove ${link.name}`;
    removeBtn.setAttribute('aria-label', `Remove ${link.name}`);
    removeBtn.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      removeLink(link.id);
    });

    chip.append(favicon, nameSpan, removeBtn);
    linksGrid.appendChild(chip);
  });
}

function addLink() {
  const name = linkNameInput.value.trim();
  const url  = ensureHttps(linkUrlInput.value);

  if (!name) { showToast('Please enter a link name.', 'error'); linkNameInput.focus(); return; }
  if (!url)  { showToast('Please enter a URL.', 'error'); linkUrlInput.focus(); return; }

  // Basic URL validation
  try { new URL(url); } catch {
    showToast('Invalid URL format.', 'error'); linkUrlInput.focus(); return;
  }

  // Duplicate check
  if (links.some(l => l.url.toLowerCase() === url.toLowerCase())) {
    showToast('This link already exists!', 'error'); return;
  }

  links.push({ id: uid(), name, url });
  saveLinks();
  linkNameInput.value = '';
  linkUrlInput.value  = '';
  renderLinks();
  showToast(`${name} added 🔗`, 'success', 1800);
}

function removeLink(id) {
  links = links.filter(l => l.id !== id);
  saveLinks();
  renderLinks();
  showToast('Link removed.', 'info', 1600);
}

btnAddLink.addEventListener('click', addLink);
linkUrlInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addLink(); });
linkNameInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { linkUrlInput.focus(); } });

renderLinks();


/* ═══════════════════════════════════════════════════════════════
   KEYBOARD SHORTCUTS (bonus UX)
═══════════════════════════════════════════════════════════════ */
document.addEventListener('keydown', (e) => {
  // Alt+T → focus todo input
  if (e.altKey && e.key.toLowerCase() === 't') {
    e.preventDefault(); todoInput.focus();
  }
  // Alt+Space → start/stop timer
  if (e.altKey && e.key === ' ') {
    e.preventDefault();
    if (timerRunning) stopTimer(); else startTimer();
  }
});
