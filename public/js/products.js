
const apiUrl = '/api/products';

const ajaxHeaders = {
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
};

let allData = [];
let deleteTargetId = null;

const productModal = new bootstrap.Modal(document.getElementById('productModal'));
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
const bsToast = new bootstrap.Toast(document.getElementById('mainToast'), { delay: 3000 });

// ── LOAD DATA ──
async function loadData() {
    try {
        const res = await fetch(apiUrl, { headers: ajaxHeaders });
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.message || 'Gagal mengambil data');
        allData = json.data;
        applyFilters();
        updateStats(allData);
    } catch (e) {
        showToast('Gagal memuat data: ' + e.message, 'danger');
        console.error('[loadData]', e.message);
    }
}

// ── APPLY SEMUA FILTER + SORT ──
function applyFilters() {
    let data = [...allData];

    // 1. Filter by stok
    const stokFilter = document.querySelector('input[name="filterStok"]:checked')?.value || 'all';
    if (stokFilter === 'available') data = data.filter(i => i.stock > 5);
    if (stokFilter === 'low') data = data.filter(i => i.stock <= 5);

    // 2. Filter by tanggal (created_at)
    const dateFrom = document.getElementById('filterDateFrom').value;
    const dateTo = document.getElementById('filterDateTo').value;
    if (dateFrom) {
        const from = new Date(dateFrom);
        from.setHours(0, 0, 0, 0);
        data = data.filter(i => new Date(i.created_at) >= from);
    }
    if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        data = data.filter(i => new Date(i.created_at) <= to);
    }

    // 3. Filter by search
    const q = document.getElementById('searchInput').value.toLowerCase();
    if (q) data = data.filter(i =>
        i.name.toLowerCase().includes(q) ||
        (i.description || '').toLowerCase().includes(q)
    );

    // 4. Sort
    const sort = document.getElementById('sortSelect').value;
    const sortMap = {
        'created_desc': (a, b) => new Date(b.created_at) - new Date(a.created_at),
        'created_asc': (a, b) => new Date(a.created_at) - new Date(b.created_at),
        'name_asc': (a, b) => a.name.localeCompare(b.name),
        'name_desc': (a, b) => b.name.localeCompare(a.name),
        'price_asc': (a, b) => a.price - b.price,
        'price_desc': (a, b) => b.price - a.price,
        'stock_asc': (a, b) => a.stock - b.stock,
        'stock_desc': (a, b) => b.stock - a.stock,
    };
    if (sortMap[sort]) data.sort(sortMap[sort]);

    // Update info teks
    const isFiltered = data.length !== allData.length;
    document.getElementById('tableInfo').textContent = isFiltered
        ? `Menampilkan ${data.length} dari ${allData.length} produk`
        : 'Menampilkan semua data';

    renderTable(data);
}

// ── RESET FILTER ──
function resetFilters() {
    document.getElementById('stokAll').checked = true;
    document.getElementById('filterDateFrom').value = '';
    document.getElementById('filterDateTo').value = '';
    document.getElementById('searchInput').value = '';
    document.getElementById('sortSelect').value = 'created_desc';
    applyFilters();
}

// ── RENDER TABLE ──
function renderTable(data) {
    document.getElementById('tableCount').textContent = data.length + ' produk';
    const tbody = document.getElementById('tableBody');

    if (!data.length) {
        tbody.innerHTML = `
                <tr><td colspan="7" class="text-center py-5 text-muted">
                    <i class="bi bi-inbox fs-2 d-block mb-2"></i>
                    Tidak ada produk yang sesuai filter.
                </td></tr>`;
        return;
    }

    tbody.innerHTML = data.map(item => {
        // Format tanggal created_at → dd/mm/yyyy
        const tgl = item.created_at
            ? new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
            : '—';

        return `
            <tr>
                <td class="ps-4 text-muted small fw-semibold">#${item.id}</td>
                <td class="fw-semibold text-dark">${esc(item.name)}</td>
                <td class="text-muted small" style="max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                    ${esc(item.description || '—')}
                </td>
                <td class="text-success fw-semibold small">Rp ${Number(item.price).toLocaleString('id-ID')}</td>
                <td>
                    <span class="badge rounded-pill
                        ${item.stock <= 5
                ? 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25'
                : 'bg-success bg-opacity-10 text-success border border-success border-opacity-25'}">
                        <i class="bi bi-${item.stock <= 5 ? 'exclamation-triangle' : 'check-circle'} me-1"></i>
                        ${item.stock} unit
                    </span>
                </td>
                <td class="text-muted small">${tgl}</td>
                <td>
                    <div class="d-flex gap-1">
                        <button class="btn btn-sm btn-outline-primary px-2 py-1" onclick="editData(${item.id})">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger px-2 py-1"
                                onclick="confirmDelete(${item.id}, '${esc(item.name)}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>`;
    }).join('');
}

// ── STATS ──
function updateStats(data) {
    document.getElementById('statTotal').textContent = data.length;
    const totalVal = data.reduce((s, i) => s + (Number(i.price) * Number(i.stock)), 0);
    document.getElementById('statValue').textContent = 'Rp ' + totalVal.toLocaleString('id-ID');
    document.getElementById('statUnits').textContent = data.reduce((s, i) => s + Number(i.stock), 0);
    document.getElementById('statLow').textContent = data.filter(i => i.stock <= 5).length;
}

// ── OPEN MODAL TAMBAH ──
function openModal() {
    document.getElementById('productId').value = '';
    document.getElementById('fieldName').value = '';
    document.getElementById('fieldDesc').value = '';
    document.getElementById('fieldPrice').value = '';
    document.getElementById('fieldStock').value = '';
    document.getElementById('modalTitle').innerHTML =
        '<i class="bi bi-plus-circle text-primary me-2"></i>Tambah Produk';
    productModal.show();
}

// ── EDIT ──
async function editData(id) {
    try {
        const res = await fetch(`${apiUrl}/${id}`, { headers: ajaxHeaders });
        const json = await res.json();
        if (res.status === 404) throw new Error(json.message || 'Produk tidak ditemukan');
        if (!res.ok || !json.success) throw new Error(json.message || `Server error: ${res.status}`);

        const item = json.data;
        document.getElementById('productId').value = item.id;
        document.getElementById('fieldName').value = item.name;
        document.getElementById('fieldDesc').value = item.description || '';
        document.getElementById('fieldPrice').value = item.price;
        document.getElementById('fieldStock').value = item.stock;
        document.getElementById('modalTitle').innerHTML =
            '<i class="bi bi-pencil text-warning me-2"></i>Edit Produk';
        productModal.show();
    } catch (e) {
        showToast('Gagal memuat data: ' + e.message, 'danger');
        console.error('[editData]', e.message);
    }
}

// ── SUBMIT FORM ──
async function submitForm() {
    const id = document.getElementById('productId').value;
    const name = document.getElementById('fieldName').value.trim();
    const desc = document.getElementById('fieldDesc').value.trim();
    const price = document.getElementById('fieldPrice').value;
    const stock = document.getElementById('fieldStock').value;

    if (!name || !price || !stock) {
        showToast('Nama, harga, dan stok wajib diisi!', 'danger');
        return;
    }

    try {
        const body = { name, description: desc, price, stock };
        if (id) body._method = 'PUT';

        const res = await fetch(id ? `${apiUrl}/${id}` : apiUrl, {
            method: 'POST',
            headers: { ...ajaxHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const json = await res.json();

        if (res.status === 422) {
            const firstMsg = Object.values(json.errors || {})[0]?.[0] || json.message || 'Validasi gagal.';
            throw new Error(firstMsg);
        }
        if (!res.ok || !json.success) throw new Error(json.message || `Server error: ${res.status}`);

        productModal.hide();
        showToast(json.message, 'success');
        loadData();
    } catch (e) {
        showToast('Gagal menyimpan: ' + e.message, 'danger');
        console.error('[submitForm]', e.message);
    }
}

// ── CONFIRM DELETE ──
function confirmDelete(id, name) {
    deleteTargetId = id;
    document.getElementById('deleteProductName').textContent = name;
    deleteModal.show();
}

// ── EXECUTE DELETE ──
document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
    try {
        const res = await fetch(`${apiUrl}/${deleteTargetId}`, {
            method: 'POST',
            headers: { ...ajaxHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify({ _method: 'DELETE' })
        });
        const json = await res.json();

        if (res.status === 404) throw new Error(json.message || 'Produk tidak ditemukan');
        if (!res.ok || !json.success) throw new Error(json.message || `Server error: ${res.status}`);

        deleteModal.hide();
        showToast(json.message, 'success');
        deleteTargetId = null;
        loadData();
    } catch (e) {
        showToast('Gagal menghapus: ' + e.message, 'danger');
        console.error('[confirmDelete]', e.message);
    }
});

// ── TOAST ──
function showToast(msg, type = 'success') {
    const el = document.getElementById('mainToast');
    const icon = type === 'success' ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger';
    document.getElementById('toastBody').innerHTML = `<i class="bi ${icon}"></i> ${msg}`;
    el.className = `toast align-items-center shadow border-start border-4 border-${type} bg-white`;
    bsToast.show();
}

// ── ESCAPE HTML ──
function esc(str) {
    return String(str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

loadData();
