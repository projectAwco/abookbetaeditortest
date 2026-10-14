/* ==========================================================================
   A-Book — Page templates (starter layouts)
   Each template = ready HTML + CSS for a full page.
   ========================================================================== */

(function () {
  'use strict';

  var Abook = (window.Abook = window.Abook || {});

  /* ====================================================================
     Template 1 — Materi
     ==================================================================== */

  var TPL_MATERI_HTML =
    '<article class="tpl-materi">' +
      '<header class="tpl-materi__hero">' +
        '<p class="tpl-materi__eyebrow">Biologi — Kelas X</p>' +
        '<h1 class="tpl-materi__title">Struktur Sel dan Fungsinya</h1>' +
        '<p class="tpl-materi__lead">Sel adalah unit terkecil kehidupan yang menyusun seluruh makhluk hidup, dari bakteri hingga manusia.</p>' +
      '</header>' +
      '<figure class="tpl-materi__figure">' +
        '<div class="tpl-materi__img" role="img" aria-label="Ilustrasi sel hewan"></div>' +
        '<figcaption>Ilustrasi sel hewan beserta organel utamanya.</figcaption>' +
      '</figure>' +
      '<section class="tpl-materi__body">' +
        '<h2 class="tpl-materi__h2">Bagian-bagian penting sel</h2>' +
        '<p class="tpl-materi__p">Setiap sel dilapisi membran selektif yang mengatur keluar-masuknya zat. Di dalamnya terdapat sitoplasma, tempat berbagai organel menjalankan fungsinya. Nukleus menyimpan materi genetik dan menjadi pusat kendali seluruh aktivitas sel.</p>' +
        '<ul class="tpl-materi__list">' +
          '<li><strong>Membran sel</strong> — pelindung sekaligus penyaring zat.</li>' +
          '<li><strong>Sitoplasma</strong> — cairan tempat organel bekerja.</li>' +
          '<li><strong>Nukleus</strong> — pusat informasi genetik.</li>' +
          '<li><strong>Mitokondria</strong> — tempat respirasi menghasilkan energi.</li>' +
          '<li><strong>Ribosom</strong> — tempat sintesis protein.</li>' +
        '</ul>' +
      '</section>' +
    '</article>';

  var TPL_MATERI_CSS =
    '.tpl-materi{max-width:880px;margin:0 auto;padding:64px 32px;color:#F5F5F7;font-family:Inter,sans-serif}' +
    '.tpl-materi__hero{margin-bottom:40px}' +
    '.tpl-materi__eyebrow{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:rgba(245,245,247,.55);margin:0 0 12px}' +
    '.tpl-materi__title{font-size:44px;font-weight:600;letter-spacing:-.03em;line-height:1.1;margin:0 0 16px}' +
    '.tpl-materi__lead{font-size:18px;line-height:1.6;color:rgba(245,245,247,.72);margin:0;max-width:640px}' +
    '.tpl-materi__figure{margin:0 0 40px}' +
    '.tpl-materi__img{aspect-ratio:16/9;border-radius:18px;background:linear-gradient(135deg,rgba(126,231,255,.18),rgba(167,139,250,.18));border:1px solid rgba(255,255,255,.08)}' +
    '.tpl-materi__figure figcaption{margin-top:10px;font-size:12px;color:rgba(245,245,247,.45)}' +
    '.tpl-materi__h2{font-size:22px;font-weight:600;letter-spacing:-.02em;margin:0 0 12px}' +
    '.tpl-materi__p{font-size:15px;line-height:1.7;color:rgba(245,245,247,.72);margin:0 0 20px}' +
    '.tpl-materi__list{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:10px}' +
    '.tpl-materi__list li{position:relative;padding:12px 16px 12px 44px;border-radius:12px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);font-size:14px;line-height:1.5}' +
    '.tpl-materi__list li::before{content:"";position:absolute;left:16px;top:50%;width:8px;height:8px;margin-top:-4px;border-radius:50%;background:linear-gradient(120deg,#7EE7FF,#A78BFA)}' +
    '.tpl-materi__list strong{font-weight:600;color:#F5F5F7}';

  /* ====================================================================
     Template 2 — Slide Deck
     ==================================================================== */

  var TPL_SLIDE_HTML =
    '<section class="tpl-slide" data-slide-index="0">' +
      '<div class="tpl-slide__viewport">' +
        '<div class="tpl-slide__track">' +
          '<article class="tpl-slide__item"><h2>1. Pengantar</h2><p>Selamat datang di materi hari ini.</p></article>' +
          '<article class="tpl-slide__item"><h2>2. Tujuan Pembelajaran</h2><p>Memahami konsep dasar dan penerapannya.</p></article>' +
          '<article class="tpl-slide__item"><h2>3. Materi Inti</h2><p>Penjelasan bertahap dengan contoh nyata.</p></article>' +
          '<article class="tpl-slide__item"><h2>4. Latihan</h2><p>Uji pemahaman dengan soal singkat.</p></article>' +
          '<article class="tpl-slide__item"><h2>5. Diskusi</h2><p>Bahas bersama teman sekelas.</p></article>' +
          '<article class="tpl-slide__item"><h2>6. Rangkuman</h2><p>Poin penting yang perlu diingat.</p></article>' +
        '</div>' +
        '<button class="tpl-slide__nav tpl-slide__nav--prev" aria-label="Slide sebelumnya">‹</button>' +
        '<button class="tpl-slide__nav tpl-slide__nav--next" aria-label="Slide berikutnya">›</button>' +
      '</div>' +
      '<div class="tpl-slide__dots" role="tablist" aria-label="Navigasi slide">' +
        '<button class="tpl-slide__dot is-active" aria-label="Slide 1"></button>' +
        '<button class="tpl-slide__dot" aria-label="Slide 2"></button>' +
        '<button class="tpl-slide__dot" aria-label="Slide 3"></button>' +
        '<button class="tpl-slide__dot" aria-label="Slide 4"></button>' +
        '<button class="tpl-slide__dot" aria-label="Slide 5"></button>' +
        '<button class="tpl-slide__dot" aria-label="Slide 6"></button>' +
      '</div>' +
    '</section>';

  var TPL_SLIDE_CSS =
    '.tpl-slide{max-width:1080px;margin:0 auto;padding:48px 32px;color:#F5F5F7;font-family:Inter,sans-serif}' +
    '.tpl-slide__viewport{position:relative;border-radius:24px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);overflow:hidden}' +
    '.tpl-slide__track{display:flex;transition:transform .5s cubic-bezier(.22,1,.36,1)}' +
    '.tpl-slide__item{flex:0 0 100%;padding:96px 80px;min-height:440px;display:flex;flex-direction:column;justify-content:center}' +
    '.tpl-slide__item h2{font-size:36px;font-weight:600;letter-spacing:-.02em;margin:0 0 16px}' +
    '.tpl-slide__item p{font-size:17px;line-height:1.65;color:rgba(245,245,247,.72);margin:0;max-width:560px}' +
    '.tpl-slide__nav{position:absolute;top:50%;transform:translateY(-50%);width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.05);backdrop-filter:blur(12px);color:#F5F5F7;font-size:20px;cursor:pointer;transition:background .15s,border-color .15s}' +
    '.tpl-slide__nav:hover{background:rgba(255,255,255,.10);border-color:rgba(255,255,255,.20)}' +
    '.tpl-slide__nav--prev{left:16px}' +
    '.tpl-slide__nav--next{right:16px}' +
    '.tpl-slide__dots{display:flex;justify-content:center;gap:8px;margin-top:24px}' +
    '.tpl-slide__dot{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.22);border:0;cursor:pointer;transition:background .15s,transform .15s}' +
    '.tpl-slide__dot.is-active{background:#F5F5F7;transform:scale(1.25)}';

  /* ====================================================================
     Template 3 — Kuis Interaktif
     ==================================================================== */

  var TPL_QUIZ_HTML =
    '<section class="tpl-quiz">' +
      '<header class="tpl-quiz__head">' +
        '<p class="tpl-quiz__eyebrow">Kuis Interaktif</p>' +
        '<h1 class="tpl-quiz__title">Uji Pemahaman</h1>' +
        '<div class="tpl-quiz__progress"><div class="tpl-quiz__progress-bar" style="width:0%"></div></div>' +
        '<p class="tpl-quiz__step">Pertanyaan 1 dari 5</p>' +
      '</header>' +
      '<ol class="tpl-quiz__list">' +
        '<li class="tpl-quiz__q"><h3>Ibu kota Indonesia adalah?</h3><ul class="tpl-quiz__opts"><li>Jakarta</li><li>Bandung</li><li>Surabaya</li><li>Medan</li></ul></li>' +
        '<li class="tpl-quiz__q"><h3>Planet terdekat dengan Matahari?</h3><ul class="tpl-quiz__opts"><li>Venus</li><li>Merkurius</li><li>Bumi</li><li>Mars</li></ul></li>' +
        '<li class="tpl-quiz__q"><h3>Rumus air adalah?</h3><ul class="tpl-quiz__opts"><li>CO₂</li><li>O₂</li><li>H₂O</li><li>NaCl</li></ul></li>' +
        '<li class="tpl-quiz__q"><h3>Siapa proklamator Indonesia?</h3><ul class="tpl-quiz__opts"><li>Soekarno-Hatta</li><li>Sudirman</li><li>Diponegoro</li><li>Habibie</li></ul></li>' +
        '<li class="tpl-quiz__q"><h3>Alat pernapasan utama manusia?</h3><ul class="tpl-quiz__opts"><li>Insang</li><li>Trakea</li><li>Paru-paru</li><li>Kulit</li></ul></li>' +
      '</ol>' +
      '<footer class="tpl-quiz__score"><p>Skor sementara</p><strong>0 / 5</strong></footer>' +
    '</section>';

  var TPL_QUIZ_CSS =
    '.tpl-quiz{max-width:720px;margin:0 auto;padding:56px 32px;color:#F5F5F7;font-family:Inter,sans-serif}' +
    '.tpl-quiz__eyebrow{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:rgba(245,245,247,.55);margin:0 0 8px}' +
    '.tpl-quiz__title{font-size:32px;font-weight:600;letter-spacing:-.02em;margin:0 0 24px}' +
    '.tpl-quiz__progress{height:6px;border-radius:999px;background:rgba(255,255,255,.08);overflow:hidden}' +
    '.tpl-quiz__progress-bar{height:100%;background:linear-gradient(120deg,#7EE7FF,#A78BFA,#F0ABFC);transition:width .4s cubic-bezier(.22,1,.36,1)}' +
    '.tpl-quiz__step{margin:10px 0 32px;font-size:12px;color:rgba(245,245,247,.55)}' +
    '.tpl-quiz__list{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px}' +
    '.tpl-quiz__q{padding:24px;border-radius:16px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08)}' +
    '.tpl-quiz__q h3{font-size:16px;font-weight:600;margin:0 0 14px}' +
    '.tpl-quiz__opts{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:1fr 1fr;gap:8px}' +
    '.tpl-quiz__opts li{padding:10px 14px;border-radius:10px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);font-size:14px;cursor:pointer;transition:background .15s,border-color .15s,transform .15s}' +
    '.tpl-quiz__opts li:hover{background:rgba(255,255,255,.07);border-color:rgba(255,255,255,.18);transform:translateY(-1px)}' +
    '.tpl-quiz__score{margin-top:28px;padding:16px 20px;border-radius:14px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:space-between}' +
    '.tpl-quiz__score p{margin:0;font-size:12px;color:rgba(245,245,247,.55)}' +
    '.tpl-quiz__score strong{font-size:20px;font-weight:600}';

  /* ====================================================================
     Template 4 — Perbandingan
     ==================================================================== */

  var TPL_COMPARE_HTML =
    '<section class="tpl-compare">' +
      '<header class="tpl-compare__head">' +
        '<h1>Perbandingan Konsep</h1>' +
        '<p>Dua pendekatan berdampingan untuk memahami perbedaan inti.</p>' +
      '</header>' +
      '<div class="tpl-compare__cols">' +
        '<article class="tpl-compare__col"><h2>Konsep A</h2><p>Pendekatan klasik yang menekankan struktur dan aturan baku.</p></article>' +
        '<article class="tpl-compare__col tpl-compare__col--alt"><h2>Konsep B</h2><p>Pendekatan modern yang menekankan fleksibilitas dan konteks.</p></article>' +
      '</div>' +
      '<table class="tpl-compare__table">' +
        '<thead><tr><th>Aspek</th><th>Konsep A</th><th>Konsep B</th></tr></thead>' +
        '<tbody>' +
          '<tr><td>Fokus</td><td>Struktur</td><td>Proses</td></tr>' +
          '<tr><td>Metode</td><td>Deduktif</td><td>Induktif</td></tr>' +
          '<tr><td>Hasil</td><td>Seragam</td><td>Bervariasi</td></tr>' +
          '<tr><td>Penerapan</td><td>Terbatas</td><td>Luas</td></tr>' +
        '</tbody>' +
      '</table>' +
      '<div class="tpl-compare__cta"><button class="tpl-compare__btn">Pelajari lebih lanjut</button></div>' +
    '</section>';

  var TPL_COMPARE_CSS =
    '.tpl-compare{max-width:960px;margin:0 auto;padding:56px 32px;color:#F5F5F7;font-family:Inter,sans-serif}' +
    '.tpl-compare__head{text-align:center;margin-bottom:40px}' +
    '.tpl-compare__head h1{font-size:36px;font-weight:600;letter-spacing:-.03em;margin:0 0 12px}' +
    '.tpl-compare__head p{font-size:16px;color:rgba(245,245,247,.55);margin:0}' +
    '.tpl-compare__cols{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px}' +
    '.tpl-compare__col{padding:28px;border-radius:18px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08)}' +
    '.tpl-compare__col--alt{background:linear-gradient(135deg,rgba(167,139,250,.08),rgba(240,171,252,.06));border-color:rgba(255,255,255,.14)}' +
    '.tpl-compare__col h2{font-size:20px;font-weight:600;margin:0 0 10px}' +
    '.tpl-compare__col p{font-size:14px;line-height:1.6;color:rgba(245,245,247,.72);margin:0}' +
    '.tpl-compare__table{width:100%;border-collapse:collapse;border-radius:16px;overflow:hidden;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08)}' +
    '.tpl-compare__table th,.tpl-compare__table td{padding:14px 18px;text-align:left;font-size:14px;border-bottom:1px solid rgba(255,255,255,.06)}' +
    '.tpl-compare__table th{background:rgba(255,255,255,.03);font-weight:600;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:rgba(245,245,247,.55)}' +
    '.tpl-compare__table tr:last-child td{border-bottom:0}' +
    '.tpl-compare__cta{margin-top:32px;text-align:center}' +
    '.tpl-compare__btn{display:inline-flex;align-items:center;gap:8px;padding:0 22px;height:44px;border-radius:999px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);color:#F5F5F7;font-size:14px;font-weight:500;cursor:pointer;transition:transform .15s,border-color .15s,background .15s}' +
    '.tpl-compare__btn:hover{transform:translateY(-1px);border-color:rgba(255,255,255,.28);background:rgba(255,255,255,.10)}';

  /* ====================================================================
     Template 5 — Timeline
     ==================================================================== */

  var TPL_TIMELINE_HTML =
    '<section class="tpl-timeline">' +
      '<header class="tpl-timeline__head">' +
        '<h1>Garis Waktu</h1>' +
        '<p>Lima tonggak penting dalam satu alur cerita.</p>' +
      '</header>' +
      '<ol class="tpl-timeline__list">' +
        '<li class="tpl-timeline__node"><span class="tpl-timeline__dot"></span><div class="tpl-timeline__body"><span class="tpl-timeline__step">Tahap 1</span><h3>Perencanaan</h3><p>Menentukan tujuan, sasaran, dan sumber daya yang dibutuhkan.</p></div></li>' +
        '<li class="tpl-timeline__node"><span class="tpl-timeline__dot"></span><div class="tpl-timeline__body"><span class="tpl-timeline__step">Tahap 2</span><h3>Riset</h3><p>Mengumpulkan data dari sumber primer dan sekunder.</p></div></li>' +
        '<li class="tpl-timeline__node"><span class="tpl-timeline__dot"></span><div class="tpl-timeline__body"><span class="tpl-timeline__step">Tahap 3</span><h3>Analisis</h3><p>Mengolah data menjadi temuan yang bermakna.</p></div></li>' +
        '<li class="tpl-timeline__node"><span class="tpl-timeline__dot"></span><div class="tpl-timeline__body"><span class="tpl-timeline__step">Tahap 4</span><h3>Implementasi</h3><p>Menerapkan solusi di lapangan dan memantau hasilnya.</p></div></li>' +
        '<li class="tpl-timeline__node"><span class="tpl-timeline__dot"></span><div class="tpl-timeline__body"><span class="tpl-timeline__step">Tahap 5</span><h3>Evaluasi</h3><p>Menilai capaian dan menyusun rekomendasi lanjutan.</p></div></li>' +
      '</ol>' +
    '</section>';

  var TPL_TIMELINE_CSS =
    '.tpl-timeline{max-width:720px;margin:0 auto;padding:56px 32px;color:#F5F5F7;font-family:Inter,sans-serif}' +
    '.tpl-timeline__head{text-align:center;margin-bottom:48px}' +
    '.tpl-timeline__head h1{font-size:36px;font-weight:600;letter-spacing:-.03em;margin:0 0 12px}' +
    '.tpl-timeline__head p{font-size:16px;color:rgba(245,245,247,.55);margin:0}' +
    '.tpl-timeline__list{list-style:none;padding:0;margin:0;position:relative}' +
    '.tpl-timeline__list::before{content:"";position:absolute;left:11px;top:8px;bottom:8px;width:1px;background:linear-gradient(180deg,rgba(126,231,255,.4),rgba(167,139,250,.4),rgba(253,230,138,.4))}' +
    '.tpl-timeline__node{position:relative;padding:0 0 28px 44px;display:flex;gap:16px}' +
    '.tpl-timeline__node:last-child{padding-bottom:0}' +
    '.tpl-timeline__dot{position:absolute;left:0;top:6px;width:24px;height:24px;border-radius:50%;background:rgba(10,10,32,.9);border:1px solid rgba(255,255,255,.18);display:inline-flex;align-items:center;justify-content:center}' +
    '.tpl-timeline__dot::after{content:"";width:8px;height:8px;border-radius:50%;background:linear-gradient(120deg,#7EE7FF,#A78BFA)}' +
    '.tpl-timeline__body{padding:16px 20px;border-radius:14px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);flex:1}' +
    '.tpl-timeline__step{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:rgba(245,245,247,.55)}' +
    '.tpl-timeline__body h3{font-size:16px;font-weight:600;margin:4px 0 6px;letter-spacing:-.01em}' +
    '.tpl-timeline__body p{font-size:14px;line-height:1.6;color:rgba(245,245,247,.72);margin:0}';

  /* ====================================================================
     Thumbnail previews — simplified inline divs (not iframes)
     ==================================================================== */

  function thumbMateri() {
    return '<div style="padding:8px;display:flex;flex-direction:column;gap:5px;height:100%;box-sizing:border-box">' +
      '<div style="height:6px;width:38%;border-radius:3px;background:rgba(245,245,247,.55)"></div>' +
      '<div style="height:3px;width:78%;border-radius:3px;background:rgba(245,245,247,.20)"></div>' +
      '<div style="height:26px;border-radius:6px;background:linear-gradient(135deg,rgba(126,231,255,.24),rgba(167,139,250,.24));border:1px solid rgba(255,255,255,.08);margin-top:2px"></div>' +
      '<div style="height:3px;width:88%;border-radius:3px;background:rgba(245,245,247,.16)"></div>' +
      '<div style="height:3px;width:70%;border-radius:3px;background:rgba(245,245,247,.16)"></div>' +
      '<div style="display:flex;gap:4px;margin-top:auto">' +
        '<div style="flex:1;height:4px;border-radius:2px;background:rgba(245,245,247,.14)"></div>' +
        '<div style="flex:1;height:4px;border-radius:2px;background:rgba(245,245,247,.14)"></div>' +
      '</div>' +
    '</div>';
  }

  function thumbSlide() {
    return '<div style="padding:8px;display:flex;flex-direction:column;gap:5px;height:100%;box-sizing:border-box">' +
      '<div style="flex:1;border-radius:6px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);padding:8px;display:flex;flex-direction:column;gap:4px;justify-content:center;position:relative">' +
        '<div style="height:6px;width:52%;border-radius:3px;background:rgba(245,245,247,.55)"></div>' +
        '<div style="height:3px;width:78%;border-radius:3px;background:rgba(245,245,247,.20)"></div>' +
        '<div style="height:3px;width:62%;border-radius:3px;background:rgba(245,245,247,.20)"></div>' +
        '<div style="position:absolute;left:4px;top:50%;transform:translateY(-50%);width:12px;height:12px;border-radius:50%;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.10)"></div>' +
        '<div style="position:absolute;right:4px;top:50%;transform:translateY(-50%);width:12px;height:12px;border-radius:50%;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.10)"></div>' +
      '</div>' +
      '<div style="display:flex;gap:3px;justify-content:center">' +
        '<div style="width:5px;height:5px;border-radius:50%;background:rgba(245,245,247,.55)"></div>' +
        '<div style="width:5px;height:5px;border-radius:50%;background:rgba(245,245,247,.18)"></div>' +
        '<div style="width:5px;height:5px;border-radius:50%;background:rgba(245,245,247,.18)"></div>' +
        '<div style="width:5px;height:5px;border-radius:50%;background:rgba(245,245,247,.18)"></div>' +
      '</div>' +
    '</div>';
  }

  function thumbQuiz() {
    return '<div style="padding:8px;display:flex;flex-direction:column;gap:5px;height:100%;box-sizing:border-box">' +
      '<div style="height:6px;width:44%;border-radius:3px;background:rgba(245,245,247,.55)"></div>' +
      '<div style="height:3px;border-radius:3px;background:rgba(255,255,255,.08);overflow:hidden">' +
        '<div style="height:100%;width:42%;background:linear-gradient(120deg,#7EE7FF,#A78BFA,#F0ABFC)"></div>' +
      '</div>' +
      '<div style="padding:6px;border-radius:5px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);display:flex;flex-direction:column;gap:4px">' +
        '<div style="height:4px;width:80%;border-radius:2px;background:rgba(245,245,247,.28)"></div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:3px">' +
          '<div style="height:8px;border-radius:3px;background:rgba(255,255,255,.06)"></div>' +
          '<div style="height:8px;border-radius:3px;background:rgba(255,255,255,.06)"></div>' +
          '<div style="height:8px;border-radius:3px;background:rgba(255,255,255,.06)"></div>' +
          '<div style="height:8px;border-radius:3px;background:rgba(255,255,255,.06)"></div>' +
        '</div>' +
      '</div>' +
      '<div style="height:12px;border-radius:5px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);margin-top:auto;display:flex;align-items:center;justify-content:space-between;padding:0 6px">' +
        '<div style="width:24%;height:3px;border-radius:2px;background:rgba(245,245,247,.20)"></div>' +
        '<div style="width:14%;height:4px;border-radius:2px;background:rgba(245,245,247,.55)"></div>' +
      '</div>' +
    '</div>';
  }

  function thumbCompare() {
    return '<div style="padding:8px;display:flex;flex-direction:column;gap:5px;height:100%;box-sizing:border-box">' +
      '<div style="height:6px;width:52%;border-radius:3px;background:rgba(245,245,247,.55);align-self:center"></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">' +
        '<div style="height:22px;border-radius:5px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08)"></div>' +
        '<div style="height:22px;border-radius:5px;background:linear-gradient(135deg,rgba(167,139,250,.14),rgba(240,171,252,.10));border:1px solid rgba(255,255,255,.14)"></div>' +
      '</div>' +
      '<div style="flex:1;border-radius:5px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);display:flex;flex-direction:column">' +
        '<div style="height:6px;border-bottom:1px solid rgba(255,255,255,.06)"></div>' +
        '<div style="height:5px;border-bottom:1px solid rgba(255,255,255,.06)"></div>' +
        '<div style="height:5px;border-bottom:1px solid rgba(255,255,255,.06)"></div>' +
        '<div style="height:5px"></div>' +
      '</div>' +
      '<div style="height:9px;width:38%;border-radius:999px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);align-self:center"></div>' +
    '</div>';
  }

  function thumbTimeline() {
    return '<div style="padding:8px;display:flex;flex-direction:column;gap:5px;height:100%;box-sizing:border-box">' +
      '<div style="height:6px;width:44%;border-radius:3px;background:rgba(245,245,247,.55);align-self:center"></div>' +
      '<div style="flex:1;display:flex;flex-direction:column;gap:4px;position:relative;padding-left:12px">' +
        '<div style="position:absolute;left:5px;top:6px;bottom:6px;width:1px;background:linear-gradient(180deg,rgba(126,231,255,.5),rgba(167,139,250,.5),rgba(253,230,138,.5))"></div>' +
        '<div style="display:flex;align-items:center;gap:6px">' +
          '<div style="position:absolute;left:2px;width:7px;height:7px;border-radius:50%;background:linear-gradient(120deg,#7EE7FF,#A78BFA);border:1px solid rgba(255,255,255,.20)"></div>' +
          '<div style="flex:1;height:11px;border-radius:4px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);margin-left:8px"></div>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:6px">' +
          '<div style="position:absolute;left:2px;width:7px;height:7px;border-radius:50%;background:linear-gradient(120deg,#A78BFA,#F0ABFC);border:1px solid rgba(255,255,255,.20)"></div>' +
          '<div style="flex:1;height:11px;border-radius:4px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);margin-left:8px"></div>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:6px">' +
          '<div style="position:absolute;left:2px;width:7px;height:7px;border-radius:50%;background:linear-gradient(120deg,#F0ABFC,#FDE68A);border:1px solid rgba(255,255,255,.20)"></div>' +
          '<div style="flex:1;height:11px;border-radius:4px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);margin-left:8px"></div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  /* ====================================================================
     Template list
     ==================================================================== */

  var TEMPLATES = [
    {
      id: 'materi',
      name: 'Materi',
      icon: 'file-text',
      description: 'Judul, paragraf panjang, gambar, dan daftar poin.',
      thumb: thumbMateri(),
      html: TPL_MATERI_HTML,
      css: TPL_MATERI_CSS
    },
    {
      id: 'slide-deck',
      name: 'Slide Deck',
      icon: 'panels-top-left',
      description: 'Enam slide horizontal dengan navigasi.',
      thumb: thumbSlide(),
      html: TPL_SLIDE_HTML,
      css: TPL_SLIDE_CSS
    },
    {
      id: 'kuis',
      name: 'Kuis Interaktif',
      icon: 'help-circle',
      description: 'Lima pertanyaan pilihan ganda dengan skor.',
      thumb: thumbQuiz(),
      html: TPL_QUIZ_HTML,
      css: TPL_QUIZ_CSS
    },
    {
      id: 'perbandingan',
      name: 'Perbandingan',
      icon: 'columns-2',
      description: 'Dua konsep berdampingan dengan tabel.',
      thumb: thumbCompare(),
      html: TPL_COMPARE_HTML,
      css: TPL_COMPARE_CSS
    },
    {
      id: 'timeline',
      name: 'Timeline',
      icon: 'list-checks',
      description: 'Garis waktu vertikal dengan lima tahap.',
      thumb: thumbTimeline(),
      html: TPL_TIMELINE_HTML,
      css: TPL_TIMELINE_CSS
    }
  ];

  Abook.Templates = {
    list: TEMPLATES,
    get: function (id) {
      for (var i = 0; i < TEMPLATES.length; i++) {
        if (TEMPLATES[i].id === id) return TEMPLATES[i];
      }
      return null;
    }
  };
})();