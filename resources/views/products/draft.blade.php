


<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Products</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
</head>

<body class="bg-light">

    <!-- ── MAIN ── -->
    <div class="container-fluid px-4 py-4">

        <!-- Page Title -->
        <div class="d-flex align-items-center justify-content-between mb-4">
            <div>
                <h5 class="fw-bold mb-0 text-dark">
                    <i class="bi bi-box-seam text-primary me-2"></i>Manajemen Produk
                </h5>
                <small class="text-muted">Kelola seluruh data produk dari sini</small>
            </div>
            <button class="btn btn-primary btn-sm d-flex align-items-center gap-1" onclick="openModal()">
                <i class="bi bi-plus-lg"></i> Tambah Produk
            </button>
        </div>

        <!-- Stat Cards -->
        <div class="row g-3 mb-4">
            <div class="col-6 col-md-3">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body d-flex align-items-center gap-3">
                        <div class="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                            style="width:44px;height:44px;font-size:1.2rem">
                            <i class="bi bi-box-seam"></i>
                        </div>
                        <div>
                            <div class="text-muted"
                                style="font-size:.72rem;text-transform:uppercase;letter-spacing:1px">Total Produk</div>
                            <div class="fw-bold fs-4 lh-1 mt-1" id="statTotal">—</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-6 col-md-3">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body d-flex align-items-center gap-3">
                        <div class="bg-success bg-opacity-10 text-success rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                            style="width:44px;height:44px;font-size:1.2rem">
                            <i class="bi bi-cash-stack"></i>
                        </div>
                        <div>
                            <div class="text-muted"
                                style="font-size:.72rem;text-transform:uppercase;letter-spacing:1px">Total Nilai Stok
                            </div>
                            <div class="fw-bold fs-6 lh-1 mt-1" id="statValue">—</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-6 col-md-3">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body d-flex align-items-center gap-3">
                        <div class="bg-warning bg-opacity-10 text-warning rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                            style="width:44px;height:44px;font-size:1.2rem">
                            <i class="bi bi-archive"></i>
                        </div>
                        <div>
                            <div class="text-muted"
                                style="font-size:.72rem;text-transform:uppercase;letter-spacing:1px">Total Unit</div>
                            <div class="fw-bold fs-4 lh-1 mt-1" id="statUnits">—</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-6 col-md-3">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body d-flex align-items-center gap-3">
                        <div class="bg-danger bg-opacity-10 text-danger rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                            style="width:44px;height:44px;font-size:1.2rem">
                            <i class="bi bi-exclamation-triangle"></i>
                        </div>
                        <div>
                            <div class="text-muted"
                                style="font-size:.72rem;text-transform:uppercase;letter-spacing:1px">Stok Menipis</div>
                            <div class="fw-bold fs-4 lh-1 mt-1" id="statLow">—</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Table Card -->
        <div class="card border-0 shadow-sm">
            <div
                class="card-header bg-white border-bottom d-flex align-items-center justify-content-between flex-wrap gap-2 py-3">
                <span class="fw-semibold text-dark">
                    <i class="bi bi-table text-primary me-1"></i> Daftar Produk
                </span>
                <div class="d-flex align-items-center gap-2">
                    <div class="input-group input-group-sm" style="width:220px">
                        <span class="input-group-text bg-light border-end-0">
                            <i class="bi bi-search text-muted"></i>
                        </span>
                        <input type="text" class="form-control border-start-0 bg-light" id="searchInput"
                            placeholder="Cari produk..." oninput="filterTable()">
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="openModal()">
                        <i class="bi bi-plus-lg me-1"></i>Tambah
                    </button>
                </div>
            </div>

            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="table-light">
                        <tr>
                            <th class="text-muted fw-semibold small text-uppercase ps-4"
                                style="letter-spacing:.6px;width:60px">ID</th>
                            <th class="text-muted fw-semibold small text-uppercase" style="letter-spacing:.6px">Nama
                                Produk</th>
                            <th class="text-muted fw-semibold small text-uppercase" style="letter-spacing:.6px">
                                Deskripsi</th>
                            <th class="text-muted fw-semibold small text-uppercase" style="letter-spacing:.6px">Harga
                            </th>
                            <th class="text-muted fw-semibold small text-uppercase" style="letter-spacing:.6px">Stok
                            </th>
                            <th class="text-muted fw-semibold small text-uppercase"
                                style="letter-spacing:.6px;width:100px">Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="tableBody">
                        <tr>
                            <td colspan="6" class="text-center py-5 text-muted">
                                <i class="bi bi-hourglass-split fs-3 d-block mb-2"></i>
                                Memuat data...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="card-footer bg-white border-top d-flex justify-content-between align-items-center py-2 px-3">
                <small class="text-muted" id="tableInfo">Menampilkan semua data</small>
                <span class="badge bg-secondary rounded-pill" id="tableCount">0 produk</span>
            </div>
        </div>

    </div>


    <!-- ── MODAL TAMBAH / EDIT ── -->
    <div class="modal fade" id="productModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow">
                <div class="modal-header bg-light border-bottom">
                    <h6 class="modal-title fw-bold" id="modalTitle">
                        <i class="bi bi-plus-circle text-primary me-2"></i>Tambah Produk
                    </h6>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4">
                    <input type="hidden" id="productId">
                    <div class="mb-3">
                        <label class="form-label fw-semibold small">Nama Produk <span
                                class="text-danger">*</span></label>
                        <input type="text" id="fieldName" class="form-control form-control-sm"
                            placeholder="Contoh: Laptop ASUS Vivobook">
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-semibold small">Deskripsi</label>
                        <textarea id="fieldDesc" class="form-control form-control-sm" rows="2"
                            placeholder="Deskripsi singkat produk (opsional)"></textarea>
                    </div>
                    <div class="row g-3">
                        <div class="col-6">
                            <label class="form-label fw-semibold small">Harga <span
                                    class="text-danger">*</span></label>
                            <div class="input-group input-group-sm">
                                <span class="input-group-text">Rp</span>
                                <input type="number" id="fieldPrice" class="form-control" placeholder="50000">
                            </div>
                        </div>
                        <div class="col-6">
                            <label class="form-label fw-semibold small">Stok <span
                                    class="text-danger">*</span></label>
                            <div class="input-group input-group-sm">
                                <input type="number" id="fieldStock" class="form-control" placeholder="10">
                                <span class="input-group-text">unit</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer bg-light border-top">
                    <button type="button" class="btn btn-light btn-sm" data-bs-dismiss="modal">Batal</button>
                    <button type="button" class="btn btn-primary btn-sm" onclick="submitForm()">
                        <i class="bi bi-save me-1"></i>Simpan
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- ── MODAL HAPUS ── -->
    <div class="modal fade" id="deleteModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-sm">
            <div class="modal-content border-0 shadow">
                <div class="modal-header bg-danger bg-opacity-10 border-bottom border-danger border-opacity-25">
                    <h6 class="modal-title fw-bold text-danger">
                        <i class="bi bi-trash me-2"></i>Hapus Produk
                    </h6>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body text-center py-4">
                    <i class="bi bi-exclamation-circle text-warning fs-1 d-block mb-3"></i>
                    <p class="mb-1 small">Yakin ingin menghapus produk ini?</p>
                    <strong class="text-danger small" id="deleteProductName"></strong>
                    <p class="text-muted mt-2 mb-0" style="font-size:.75rem">Tindakan ini tidak dapat dibatalkan.</p>
                </div>
                <div class="modal-footer justify-content-center bg-light border-top">
                    <button class="btn btn-light btn-sm" data-bs-dismiss="modal">Batal</button>
                    <button class="btn btn-danger btn-sm" id="confirmDeleteBtn">
                        <i class="bi bi-trash me-1"></i>Hapus
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- ── TOAST ── -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index:9999">
        <div id="mainToast" class="toast align-items-center shadow border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body d-flex align-items-center gap-2" id="toastBody"></div>
                <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="{{ asset('js/products.js') }}"></script>

</body>

</html>
