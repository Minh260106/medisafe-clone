const API_BASE = 'http://127.0.0.1:8000/api';
const state = { medications: [], schedules: [], logs: [], stats: null };

const toast = document.getElementById('toast');
const pageTitle = document.getElementById('pageTitle');
const views = document.querySelectorAll('.view');
const navLinks = document.querySelectorAll('.nav-link');

function showToast(message, isError = false) {
  toast.textContent = message;
  toast.classList.remove('show');
  void toast.offsetWidth;
  toast.classList.add('show');
  if (isError) toast.style.background = '#b91c1c';
  else toast.style.background = '#111827';
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove('show'), 2200);
}

async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.detail || 'Yêu cầu thất bại');
  }
  return data;
}

async function loadOverview() {
  try {
    const [medications, stats] = await Promise.all([
      api('/medications'),
      api('/stats/compliance')
    ]);
    state.medications = medications;
    state.stats = stats;
    document.getElementById('totalMedicationCount').textContent = medications.length;
    document.getElementById('complianceScore').textContent = `${stats.taken_percentage}%`;
    document.getElementById('scheduleCount').textContent = state.schedules.length || 0;
  } catch (error) {
    showToast(error.message, true);
  }
}

async function loadMedications() {
  try {
    const medications = await api('/medications');
    state.medications = medications;
    const list = document.getElementById('medicationList');
    if (!medications.length) {
      list.innerHTML = '<div class="item-card">Chưa có thuốc nào. Hãy thêm thuốc đầu tiên.</div>';
      return;
    }
    list.innerHTML = medications.map((item) => `
      <article class="item-card">
        <h4>${item.name}</h4>
        <div class="item-meta">Dạng: ${item.form} • Liều: ${item.dosage}</div>
        <div class="item-meta">Tồn kho: ${item.stock}</div>
      </article>
    `).join('');
  } catch (error) {
    showToast(error.message, true);
  }
}

async function loadSchedules() {
  try {
    const schedules = await api('/schedules');
    state.schedules = schedules;
    const list = document.getElementById('scheduleList');
    if (!schedules.length) {
      list.innerHTML = '<div class="item-card">Chưa có lịch uống nào.</div>';
      return;
    }
    list.innerHTML = schedules.map((item) => `
      <article class="item-card">
        <h4>Lịch #${item.id}</h4>
        <div class="item-meta">Thuốc ID: ${item.medication_id} • Tần suất: ${item.frequency}</div>
        <div class="item-meta">Giờ uống: ${item.time_to_take}</div>
      </article>
    `).join('');
  } catch (error) {
    showToast(error.message, true);
  }
}

async function loadLogs() {
  try {
    const logs = await api('/logs');
    state.logs = logs;
    const list = document.getElementById('logList');
    if (!logs.length) {
      list.innerHTML = '<div class="item-card">Chưa có nhật ký nào.</div>';
      return;
    }
    list.innerHTML = logs.map((item) => `
      <article class="item-card">
        <h4>${item.status}</h4>
        <div class="item-meta">Schedule ID: ${item.schedule_id}</div>
        <div class="item-meta">Thời gian: ${new Date(item.timestamp).toLocaleString('vi-VN')}</div>
      </article>
    `).join('');
  } catch (error) {
    showToast(error.message, true);
  }
}

async function loadStats() {
  try {
    const stats = await api('/stats/compliance');
    state.stats = stats;
    document.getElementById('takenPercent').textContent = `${stats.taken_percentage}%`;
    document.getElementById('skippedPercent').textContent = `${stats.skipped_percentage}%`;
    document.getElementById('takenBar').style.width = `${stats.taken_percentage}%`;
    document.getElementById('skippedBar').style.width = `${stats.skipped_percentage}%`;
  } catch (error) {
    showToast(error.message, true);
  }
}

async function createMedication(event) {
  event.preventDefault();
  const payload = {
    name: document.getElementById('medName').value.trim(),
    form: document.getElementById('medForm').value.trim(),
    dosage: document.getElementById('medDosage').value.trim(),
    stock: Number(document.getElementById('medStock').value),
  };

  try {
    await api('/medications', { method: 'POST', body: JSON.stringify(payload) });
    showToast('Thuốc đã được lưu thành công');
    document.getElementById('medicationForm').reset();
    await loadMedications();
    await loadOverview();
  } catch (error) {
    showToast(error.message, true);
  }
}

async function createSchedule(event) {
  event.preventDefault();
  const payload = {
    medication_id: Number(document.getElementById('scheduleMedicationId').value),
    frequency: document.getElementById('scheduleFrequency').value.trim(),
    time_to_take: document.getElementById('scheduleTime').value.trim(),
  };

  try {
    await api('/schedules', { method: 'POST', body: JSON.stringify(payload) });
    showToast('Lịch uống đã được tạo');
    document.getElementById('scheduleForm').reset();
    await loadSchedules();
  } catch (error) {
    showToast(error.message, true);
  }
}

async function createLog(event) {
  event.preventDefault();
  const payload = {
    schedule_id: Number(document.getElementById('logScheduleId').value),
    status: document.getElementById('logStatus').value,
  };
  try {
    await api('/logs', { method: 'POST', body: JSON.stringify(payload) });
    showToast('Nhật ký đã được ghi nhận');
    document.getElementById('logForm').reset();
    await loadLogs();
    await loadStats();
    await loadOverview();
  } catch (error) {
    showToast(error.message, true);
  }
}

function switchView(viewId) {
  views.forEach((view) => view.classList.toggle('active', view.id === viewId));
  navLinks.forEach((link) => link.classList.toggle('active', link.dataset.view === viewId));
  const titles = { overview: 'Tổng quan', medications: 'Thuốc', schedules: 'Lịch uống', logs: 'Nhật ký', stats: 'Thống kê' };
  pageTitle.textContent = titles[viewId] || 'Dashboard';
}

navLinks.forEach((button) => button.addEventListener('click', () => switchView(button.dataset.view)));
document.getElementById('openMedicationForm').addEventListener('click', () => switchView('medications'));
document.getElementById('openMedicationModal').addEventListener('click', () => switchView('medications'));
document.getElementById('medicationForm').addEventListener('submit', createMedication);
document.getElementById('scheduleForm').addEventListener('submit', createSchedule);
document.getElementById('logForm').addEventListener('submit', createLog);

(async function init() {
  switchView('overview');
  await Promise.all([loadOverview(), loadMedications(), loadSchedules(), loadLogs(), loadStats()]);
})();
