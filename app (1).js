// ===== MODAL =====
let currentMode = 'login';

function openModal(mode) {
  currentMode = mode;
  document.getElementById('modalBg').classList.add('open');
  updateModal();
}

function closeModal() {
  document.getElementById('modalBg').classList.remove('open');
  clearInputs();
}

function closeBg(e) {
  if (e.target.id === 'modalBg') closeModal();
}

function switchTo(mode) {
  currentMode = mode;
  updateModal();
}

function updateModal() {
  const isRegister = currentMode === 'register';
  document.getElementById('modalTitle').textContent = isRegister ? 'Create Account' : 'Welcome Back';
  document.getElementById('nameRow').style.display = isRegister ? 'block' : 'none';
  document.getElementById('confirmRow').style.display = isRegister ? 'block' : 'none';
  const btn = document.getElementById('modalSubmit');
  btn.textContent = isRegister ? 'Create Free Account' : 'Login';
  btn.className = isRegister ? 'modal-submit green-btn' : 'modal-submit';
  document.getElementById('modalSwitch').innerHTML = isRegister
    ? 'Already have an account? <a onclick="switchTo(\'login\')">Login</a>'
    : "Don't have an account? <a onclick=\"switchTo('register')\">Register free</a>";
}

function clearInputs() {
  ['nameInput','emailInput','passInput','confirmInput'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

function handleSubmit() {
  const email = document.getElementById('emailInput').value.trim();
  const pass = document.getElementById('passInput').value.trim();

  if (!email || !pass) {
    alert('Please fill in all fields!');
    return;
  }

  if (currentMode === 'register') {
    const name = document.getElementById('nameInput').value.trim();
    const confirm = document.getElementById('confirmInput').value.trim();
    if (!name) { alert('Please enter your name!'); return; }
    if (pass !== confirm) { alert('Passwords do not match!'); return; }
    localStorage.setItem('ac_user', name);
    closeModal();
    showToast('🎉 Welcome to AI Chetan, ' + name + '!');
    setTimeout(() => { window.location.href = 'chat.html'; }, 1500);
  } else {
    const savedName = localStorage.getItem('ac_user') || 'User'
    closeModal();
    showToast('✅ Welcome back, ' + savedName + '!');
    setTimeout(() => { window.location.href = 'chat.html'; }, 1500);
  }
}

// ===== TOAST =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// ===== HAMBURGER =====
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

// ===== KEYBOARD: close modal on Escape =====
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});
