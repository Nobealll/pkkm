// ============================================================
// KONFIGURASI AWAL
// URL endpoint API Laravel untuk resource produk
// ============================================================
const apiUrl = '/api/products';

// Menyimpan semua data produk yang diambil dari server,
// digunakan sebagai sumber data utama untuk filter & render tabel
let allData = [];

// Menyimpan ID produk yang akan dihapus,
// diisi saat pengguna menekan tombol hapus sebelum konfirmasi
let deleteTargetId = null;

// ============================================================
// INISIALISASI KOMPONEN BOOTSTRAP
// Membuat instance modal dan toast agar bisa dikontrol via JS
// ============================================================
const productModal = new bootstrap.Modal(document.getElementById('productModal'));
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
const bsToast = new bootstrap.Toast(document.getElementById('mainToast'), {
    delay: 3000 // Toast otomatis hilang setelah 3 detik
});

// ============================================================
// FUNGSI: loadData()
// Mengambil seluruh data produk dari server via GET /api/products
// Jika berhasil: simpan ke allData, render tabel, dan update statistik
// Jika gagal: tampilkan pesan error lewat toast
// ============================================================
async function loadData() {
    try {
        const res = await fetch(apiUrl);

        // Jika server merespons tapi dengan status error (misal 500),
        // fetch tidak otomatis throw error, jadi kita cek manual
        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        allData = await res.json();
        renderTable(allData);
        updateStats(allData);
    } catch (e) {
        // Error bisa terjadi karena:
        // 1. Server Laravel belum dijalankan (php artisan serve)
        // 2. URL apiUrl salah
        // 3. Tidak ada koneksi jaringan
        showToast('Gagal memuat data. Pastikan server berjalan.', 'danger');
        console.error('[loadData] Error:', e.message);
    }
}

// ============================================================
// FUNGSI: renderTable(data)
// Menerima array produk, lalu menampilkannya sebagai baris-baris
// di dalam elemen <tbody id="tableBody">
// Jika data kosong, tampilkan baris kosong dengan pesan informatif
// ============================================================
function renderTable(data) {
    document.getElementById('tableCount').textContent = data.length + ' produk';
    const tbody = document.getElementById('tableBody');

    if (!data.length) {
        tbody.innerHTML = `
            <tr><td colspan="6" class="text-center py-5 text-muted">
                <i class="bi bi-inbox fs-2 d-block mb-2"></i>
                Belum ada produk. Klik <strong>Tambah Produk</strong> untuk input.
            </td></tr>`;
        return;
    }

    tbody.innerHTML = data.map(item => `
        <tr>
            <td class="ps-4 text-muted small fw-semibold">#${item.id}</td>
            <td class="fw-semibold text-dark">${esc(item.name)}</td>
            <td class="text-muted small" style="max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                ${esc(item.description || '—')}
            </td>
            <td class="text-success fw-semibold small">Rp ${Number(item.price).toLocaleString('id-ID')}</td>
            <td>
                <span class="badge rounded-pill
                    ${item.stock <= 5 ? 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25'
            : 'bg-success bg-opacity-10 text-success border border-success border-opacity-25'}">
                    <i class="bi bi-${item.stock <= 5 ? 'exclamation-triangle' : 'check-circle'} me-1"></i>
                    ${item.stock} unit
                </span>
            </td>
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
        </tr>
    `).join('');
}
// ============================================================
// FUNGSI: updateStats(data)
// Menghitung dan menampilkan 4 angka statistik di bagian atas halaman:
// - Total produk
// - Total nilai stok (harga × jumlah)
// - Total unit stok
// - Produk dengan stok menipis (≤ 5)
// ============================================================
function updateStats(data) {
    document.getElementById('statTotal').textContent = data.length;

    // Hitung total nilai inventori: jumlah (harga × stok) untuk semua produk
    const totalVal = data.reduce((s, i) => s + (Number(i.price) * Number(i.stock)), 0);
    document.getElementById('statValue').textContent = 'Rp ' + totalVal.toLocaleString('id-ID');

    // Hitung total seluruh unit stok yang tersedia
    document.getElementById('statUnits').textContent = data.reduce((s, i) => s + Number(i.stock), 0);

    // Hitung produk dengan stok kritis (stok ≤ 5 dianggap menipis)
    document.getElementById('statLow').textContent = data.filter(i => i.stock <= 5).length;
}

// ============================================================
// FUNGSI: filterTable()
// Dipanggil setiap kali pengguna mengetik di kolom pencarian
// Memfilter allData berdasarkan nama atau deskripsi produk
// dan merender ulang tabel dengan hasil yang cocok
// ============================================================
function filterTable() {
    const q = document.getElementById('searchInput').value.toLowerCase();

    // Filter data berdasarkan kecocokan nama atau deskripsi (case-insensitive)
    const filtered = allData.filter(i =>
        i.name.toLowerCase().includes(q) || (i.description || '').toLowerCase().includes(q)
        || String(i.stock).includes(q) //filter berdasarkan stok
    );

    // Tampilkan info jumlah hasil filter di atas tabel
    document.getElementById('tableInfo').textContent =
        q ? `Menampilkan ${filtered.length} dari ${allData.length} produk` : 'Menampilkan semua data';

    renderTable(filtered);
}

// ============================================================
// FUNGSI: openModal()
// Membuka modal form produk dalam mode TAMBAH (bukan edit)
// Mengosongkan semua field form dan mengatur judul modal
// ============================================================
function openModal() {
    // Kosongkan semua field agar tidak ada data lama yang tersisa
    document.getElementById('productId').value = '';
    document.getElementById('fieldName').value = '';
    document.getElementById('fieldDesc').value = '';
    document.getElementById('fieldPrice').value = '';
    document.getElementById('fieldStock').value = '';

    // Set judul modal ke mode "Tambah"
    document.getElementById('modalTitle').innerHTML =
        '<i class="bi bi-plus-circle me-2"></i>Tambah Produk';
    productModal.show();
}

// ============================================================
// FUNGSI: editData(id)
// Mengambil data produk berdasarkan ID dari server via GET /api/products/:id
// lalu mengisi form modal dengan data tersebut untuk mode EDIT
// ============================================================
async function editData(id) {
    try {
        const res = await fetch(`${apiUrl}/${id}`);

        // Jika produk tidak ditemukan di database, Laravel mengembalikan 404
        if (res.status === 404) throw new Error('Produk tidak ditemukan.');

        // Jika ada error server lain (misal 500)
        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        // Isi semua field form dengan data produk yang diterima
        const item = await res.json();
        document.getElementById('productId').value = item.id;
        document.getElementById('fieldName').value = item.name;
        document.getElementById('fieldDesc').value = item.description || '';
        document.getElementById('fieldPrice').value = item.price;
        document.getElementById('fieldStock').value = item.stock;

        // Set judul modal ke mode "Edit"
        document.getElementById('modalTitle').innerHTML =
            '<i class="bi bi-pencil me-2"></i>Edit Produk';
        productModal.show();
    } catch (e) {
        // Error bisa terjadi karena:
        // 1. ID tidak ada di database (404 dari findOrFail)
        // 2. Koneksi ke server terputus
        showToast('Gagal memuat data produk: ' + e.message, 'danger');
        console.error('[editData] Error:', e.message);
    }
}

// ============================================================
// FUNGSI: submitForm()
// Mengirim data form ke server untuk TAMBAH (POST) atau EDIT (PUT)
// Ditentukan oleh ada tidaknya nilai di field hidden #productId
// ============================================================
async function submitForm() {
    // Ambil semua nilai dari field form
    const id = document.getElementById('productId').value;
    const name = document.getElementById('fieldName').value.trim();
    const desc = document.getElementById('fieldDesc').value.trim();
    const price = document.getElementById('fieldPrice').value;
    const stock = document.getElementById('fieldStock').value;

    // Validasi sisi client sebelum kirim ke server,
    // mencegah request sia-sia jika field wajib masih kosong
    if (!name || !price || !stock) {
        showToast('Nama, harga, dan stok wajib diisi!', 'danger');
        return;
    }

    try {
        // Jika ada ID → mode edit (PUT ke /api/products/:id)
        // Jika tidak ada ID → mode tambah (POST ke /api/products)
        const res = await fetch(id ? `${apiUrl}/${id}` : apiUrl, {
            method: id ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                // CSRF token wajib ada untuk POST/PUT/DELETE di Laravel,
                // tanpa ini akan muncul error 419 (Page Expired)
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
            },
            body: JSON.stringify({
                name,
                description: desc,
                price,
                stock
            })
        });

        // Jika validasi Laravel gagal, server mengembalikan 422
        // beserta pesan error dari $request->validate()
        if (res.status === 422) {
            const err = await res.json();
            // Ambil pesan error pertama dari response Laravel
            const firstMsg = Object.values(err.errors || {})[0]?.[0] || 'Validasi gagal.';
            throw new Error(firstMsg);
        }

        // Tangani error lain selain 422
        if (!res.ok) throw new Error((await res.json()).message || `Server error: ${res.status}`);

        // Jika berhasil: tutup modal, tampilkan notifikasi, dan reload data tabel
        productModal.hide();
        showToast(id ? 'Data berhasil diubah!' : 'Produk berhasil ditambahkan!', 'success');
        loadData();
    } catch (e) {
        // Error bisa terjadi karena:
        // 1. Validasi Laravel gagal (422) — nama duplikat, format salah, dll
        // 2. CSRF token tidak ada atau kedaluwarsa (419)
        // 3. Koneksi terputus saat menyimpan
        showToast('Gagal menyimpan: ' + e.message, 'danger');
        console.error('[submitForm] Error:', e.message);
    }
}

// ============================================================
// FUNGSI: confirmDelete(id, name)
// Menyimpan ID produk yang akan dihapus ke deleteTargetId,
// lalu menampilkan nama produk di modal konfirmasi sebelum benar-benar dihapus
// ============================================================
function confirmDelete(id, name) {
    deleteTargetId = id;
    document.getElementById('deleteProductName').textContent = name;
    deleteModal.show();
}

// ============================================================
// EVENT: Tombol Konfirmasi Hapus (#confirmDeleteBtn)
// Dipanggil saat pengguna menekan "Ya, Hapus" di dalam modal konfirmasi
// Mengirim request DELETE ke server dengan ID yang tersimpan di deleteTargetId
// ============================================================
document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
    try {
        const res = await fetch(`${apiUrl}/${deleteTargetId}`, {
            method: 'DELETE',
            headers: {
                // CSRF token tetap wajib untuk request DELETE di Laravel
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
            }
        });

        // Jika data sudah terlanjur dihapus dari tempat lain, server akan 404
        if (res.status === 404) throw new Error('Produk sudah tidak ada di database.');

        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        // Jika berhasil: tutup modal, tampilkan notifikasi, reset target, reload data
        deleteModal.hide();
        showToast('Produk berhasil dihapus!', 'success');
        deleteTargetId = null;
        loadData();
    } catch (e) {
        // Error bisa terjadi karena:
        // 1. ID tidak ditemukan di database (sudah dihapus sebelumnya)
        // 2. CSRF token kedaluwarsa (419)
        // 3. Koneksi terputus saat proses hapus
        showToast('Gagal menghapus: ' + e.message, 'danger');
        console.error('[confirmDelete] Error:', e.message);
    }
});

// ============================================================
// FUNGSI: showToast(msg, type)
// Menampilkan notifikasi toast Bootstrap di sudut layar
// Parameter:
//   msg  → pesan yang ditampilkan
//   type → 'success' (hijau) atau 'danger' (merah)
// ============================================================
function showToast(msg, type = 'success') {
    const el = document.getElementById('mainToast');

    // Pilih ikon sesuai tipe notifikasi
    const icon = type === 'success' ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger';
    document.getElementById('toastBody').innerHTML = `<i class="bi ${icon} me-2"></i>${msg}`;

    // Ubah warna border toast sesuai tipe (success/danger)
    el.className = `toast align-items-center shadow border-start border-4 border-${type} bg-white`;
    bsToast.show();
}

// ============================================================
// FUNGSI: esc(str)
// Sanitasi string untuk mencegah serangan XSS (Cross-Site Scripting)
// Mengubah karakter HTML berbahaya menjadi HTML entity yang aman
// sebelum string ditampilkan ke dalam innerHTML tabel
// Contoh: <script> → &lt;script&gt;
// ============================================================
function esc(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// ============================================================
// INISIALISASI HALAMAN
// Panggil loadData() saat halaman pertama kali dimuat
// agar tabel langsung terisi dengan data dari server
// ============================================================
loadData();