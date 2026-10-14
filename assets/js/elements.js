/* ==========================================================================
   A-Book — Element library
   58 element definitions across 8 categories.
   Each: { id, name, category, icon, thumb, defaultHTML, defaultCSS, editableProps }
   ========================================================================== */

(function () {
  'use strict';

  var Abook = (window.Abook = window.Abook || {});

  /* ====================================================================
     Small helpers to build thumbs (compact inline HTML)
     ==================================================================== */

  function tBar(w, h, alpha, radius) {
    return '<div style="width:' + w + ';height:' + h + 'px;border-radius:' + (radius || 3) + 'px;' +
           'background:rgba(245,245,247,' + alpha + ')"></div>';
  }

  function tBox(inner, h) {
    return '<div style="height:' + h + 'px;border-radius:6px;background:rgba(255,255,255,.035);' +
           'border:1px solid rgba(255,255,255,.08);display:flex;align-items:center;' +
           'justify-content:center;color:rgba(245,245,247,.55);font-size:10px;gap:3px">' +
           inner + '</div>';
  }

  function tWrap(inner) {
    return '<div style="padding:6px;display:flex;flex-direction:column;gap:4px;' +
           'width:100%;height:100%;box-sizing:border-box;justify-content:center;align-items:stretch">' +
           inner + '</div>';
  }

  /* ====================================================================
     CATEGORY: text (12)
     ==================================================================== */

  var TEXT = [
    {
      id: 'heading-h1',
      name: 'Heading H1',
      category: 'text',
      icon: 'heading',
      thumb: tWrap(tBar('80%', 10, .70) + tBar('52%', 10, .70)),
      defaultHTML: '<h1 class="ab-h1">Judul Utama</h1>',
      defaultCSS:
        '.ab-h1{margin:0 0 16px;font:600 44px/1.12 Inter,sans-serif;letter-spacing:-.03em;color:#F5F5F7}',
      editableProps: [
        { key: 'text',  label: 'Teks',  type: 'text',  default: 'Judul Utama' },
        { key: 'color', label: 'Warna', type: 'color', default: '#F5F5F7' },
        { key: 'size',  label: 'Ukuran', type: 'number', default: 44 }
      ]
    },
    {
      id: 'heading-h2',
      name: 'Heading H2',
      category: 'text',
      icon: 'heading',
      thumb: tWrap(tBar('66%', 8, .60) + tBar('40%', 8, .60)),
      defaultHTML: '<h2 class="ab-h2">Sub Judul</h2>',
      defaultCSS:
        '.ab-h2{margin:0 0 12px;font:600 30px/1.2 Inter,sans-serif;letter-spacing:-.02em;color:#F5F5F7}',
      editableProps: [
        { key: 'text',  label: 'Teks',  type: 'text',  default: 'Sub Judul' },
        { key: 'color', label: 'Warna', type: 'color', default: '#F5F5F7' }
      ]
    },
    {
      id: 'heading-h3',
      name: 'Heading H3',
      category: 'text',
      icon: 'heading',
      thumb: tWrap(tBar('52%', 6, .55) + tBar('32%', 6, .55)),
      defaultHTML: '<h3 class="ab-h3">Judul Bagian</h3>',
      defaultCSS:
        '.ab-h3{margin:0 0 8px;font:600 20px/1.3 Inter,sans-serif;letter-spacing:-.01em;color:#F5F5F7}',
      editableProps: [
        { key: 'text',  label: 'Teks',  type: 'text',  default: 'Judul Bagian' },
        { key: 'color', label: 'Warna', type: 'color', default: '#F5F5F7' }
      ]
    },
    {
      id: 'paragraph',
      name: 'Paragraf',
      category: 'text',
      icon: 'align-left',
      thumb: tWrap(tBar('100%', 3, .20) + tBar('92%', 3, .20) + tBar('96%', 3, .20) + tBar('68%', 3, .20)),
      defaultHTML:
        '<p class="ab-p">Tulis paragraf penjelasan di sini. Gunakan bahasa yang jelas dan ringkas agar mudah dipahami siswa.</p>',
      defaultCSS:
        '.ab-p{margin:0 0 14px;font:400 15px/1.7 Inter,sans-serif;color:rgba(245,245,247,.78)}',
      editableProps: [
        { key: 'text',  label: 'Teks',  type: 'text',  default: 'Tulis paragraf di sini.' },
        { key: 'color', label: 'Warna', type: 'color', default: 'rgba(245,245,247,.78)' }
      ]
    },
    {
      id: 'lead',
      name: 'Lead Paragraph',
      category: 'text',
      icon: 'align-left',
      thumb: tWrap(tBar('100%', 5, .30) + tBar('88%', 5, .30)),
      defaultHTML:
        '<p class="ab-lead">Kalimat pembuka yang lebih besar untuk menarik perhatian pembaca.</p>',
      defaultCSS:
        '.ab-lead{margin:0 0 20px;font:400 19px/1.55 Inter,sans-serif;color:rgba(245,245,247,.72);letter-spacing:-.005em}',
      editableProps: [
        { key: 'text',  label: 'Teks',  type: 'text',  default: 'Kalimat pembuka.' }
      ]
    },
    {
      id: 'quote',
      name: 'Quote',
      category: 'text',
      icon: 'quote',
      thumb: tWrap(
        '<div style="display:flex;gap:6px;align-items:flex-start">' +
          '<div style="width:2px;height:26px;background:linear-gradient(180deg,#7EE7FF,#A78BFA);border-radius:2px"></div>' +
          '<div style="display:flex;flex-direction:column;gap:3px;flex:1">' +
            tBar('100%', 3, .30) + tBar('82%', 3, .30) + tBar('44%', 3, .18) +
          '</div>' +
        '</div>'
      ),
      defaultHTML:
        '<blockquote class="ab-quote"><p>Belajar adalah harta yang tak akan pernah hilang.</p>' +
        '<cite>— Pepatah</cite></blockquote>',
      defaultCSS:
        '.ab-quote{margin:0 0 20px;padding:16px 20px;border-left:2px solid rgba(167,139,250,.55);' +
        'background:rgba(255,255,255,.035);border-radius:0 12px 12px 0}' +
        '.ab-quote p{margin:0 0 6px;font:400 17px/1.55 Inter,sans-serif;color:#F5F5F7;font-style:italic}' +
        '.ab-quote cite{display:block;font-size:12px;color:rgba(245,245,247,.55);font-style:normal}',
      editableProps: [
        { key: 'text',   label: 'Teks',  type: 'text', default: 'Belajar adalah harta.' },
        { key: 'author', label: 'Sumber', type: 'text', default: '— Pepatah' }
      ]
    },
    {
      id: 'caption',
      name: 'Caption',
      category: 'text',
      icon: 'type',
      thumb: tWrap(tBar('56%', 3, .30)),
      defaultHTML: '<p class="ab-caption">Keterangan gambar atau catatan kecil.</p>',
      defaultCSS:
        '.ab-caption{margin:0 0 10px;font:400 12px/1.5 Inter,sans-serif;color:rgba(245,245,247,.45);letter-spacing:.01em}',
      editableProps: [
        { key: 'text', label: 'Teks', type: 'text', default: 'Keterangan gambar.' }
      ]
    },
    {
      id: 'bullet-list',
      name: 'Bullet List',
      category: 'text',
      icon: 'list',
      thumb: tWrap(
        '<div style="display:flex;flex-direction:column;gap:5px">' +
          '<div style="display:flex;gap:6px;align-items:center"><div style="width:5px;height:5px;border-radius:50%;background:linear-gradient(120deg,#7EE7FF,#A78BFA)"></div>' + tBar('72%', 3, .30) + '</div>' +
          '<div style="display:flex;gap:6px;align-items:center"><div style="width:5px;height:5px;border-radius:50%;background:linear-gradient(120deg,#7EE7FF,#A78BFA)"></div>' + tBar('60%', 3, .30) + '</div>' +
          '<div style="display:flex;gap:6px;align-items:center"><div style="width:5px;height:5px;border-radius:50%;background:linear-gradient(120deg,#7EE7FF,#A78BFA)"></div>' + tBar('80%', 3, .30) + '</div>' +
        '</div>'
      ),
      defaultHTML:
        '<ul class="ab-ul"><li>Poin pertama</li><li>Poin kedua</li><li>Poin ketiga</li></ul>',
      defaultCSS:
        '.ab-ul{margin:0 0 16px;padding:0 0 0 20px;font:400 15px/1.75 Inter,sans-serif;color:rgba(245,245,247,.78)}' +
        '.ab-ul li{margin-bottom:4px}' +
        '.ab-ul li::marker{color:rgba(167,139,250,.85)}',
      editableProps: [
        { key: 'items', label: 'Item (satu per baris)', type: 'text', default: 'Poin pertama\nPoin kedua\nPoin ketiga' }
      ]
    },
    {
      id: 'numbered-list',
      name: 'Numbered List',
      category: 'text',
      icon: 'list-ordered',
      thumb: tWrap(
        '<div style="display:flex;flex-direction:column;gap:5px">' +
          '<div style="display:flex;gap:6px;align-items:center"><span style="font:600 8px Inter,sans-serif;color:rgba(245,245,247,.55)">1</span>' + tBar('72%', 3, .30) + '</div>' +
          '<div style="display:flex;gap:6px;align-items:center"><span style="font:600 8px Inter,sans-serif;color:rgba(245,245,247,.55)">2</span>' + tBar('60%', 3, .30) + '</div>' +
          '<div style="display:flex;gap:6px;align-items:center"><span style="font:600 8px Inter,sans-serif;color:rgba(245,245,247,.55)">3</span>' + tBar('80%', 3, .30) + '</div>' +
        '</div>'
      ),
      defaultHTML:
        '<ol class="ab-ol"><li>Langkah pertama</li><li>Langkah kedua</li><li>Langkah ketiga</li></ol>',
      defaultCSS:
        '.ab-ol{margin:0 0 16px;padding:0 0 0 20px;font:400 15px/1.75 Inter,sans-serif;color:rgba(245,245,247,.78)}' +
        '.ab-ol li{margin-bottom:4px}' +
        '.ab-ol li::marker{color:rgba(126,231,255,.85);font-weight:600}',
      editableProps: [
        { key: 'items', label: 'Langkah (satu per baris)', type: 'text', default: 'Langkah pertama\nLangkah kedua\nLangkah ketiga' }
      ]
    },
    {
      id: 'checklist',
      name: 'Checklist',
      category: 'text',
      icon: 'check-square',
      thumb: tWrap(
        '<div style="display:flex;flex-direction:column;gap:5px">' +
          '<div style="display:flex;gap:6px;align-items:center"><div style="width:8px;height:8px;border-radius:2px;border:1px solid rgba(167,139,250,.75);display:flex;align-items:center;justify-content:center"><div style="width:3px;height:3px;background:#A78BFA;border-radius:1px"></div></div>' + tBar('65%', 3, .30) + '</div>' +
          '<div style="display:flex;gap:6px;align-items:center"><div style="width:8px;height:8px;border-radius:2px;border:1px solid rgba(167,139,250,.75);display:flex;align-items:center;justify-content:center"><div style="width:3px;height:3px;background:#A78BFA;border-radius:1px"></div></div>' + tBar('52%', 3, .30) + '</div>' +
          '<div style="display:flex;gap:6px;align-items:center"><div style="width:8px;height:8px;border-radius:2px;border:1px solid rgba(255,255,255,.18)"></div>' + tBar('70%', 3, .18) + '</div>' +
        '</div>'
      ),
      defaultHTML:
        '<ul class="ab-check"><li class="is-checked">Tugas pertama</li><li class="is-checked">Tugas kedua</li><li>Tugas ketiga</li></ul>',
      defaultCSS:
        '.ab-check{list-style:none;margin:0 0 16px;padding:0;display:flex;flex-direction:column;gap:8px;font:400 15px/1.5 Inter,sans-serif;color:rgba(245,245,247,.78)}' +
        '.ab-check li{position:relative;padding:6px 0 6px 30px}' +
        '.ab-check li::before{content:"";position:absolute;left:0;top:8px;width:16px;height:16px;border-radius:5px;border:1px solid rgba(255,255,255,.20);background:rgba(255,255,255,.03)}' +
        '.ab-check li.is-checked::before{background:linear-gradient(120deg,rgba(126,231,255,.35),rgba(167,139,250,.35));border-color:rgba(255,255,255,.28)}' +
        '.ab-check li.is-checked::after{content:"";position:absolute;left:5px;top:12px;width:6px;height:3px;border-left:2px solid #F5F5F7;border-bottom:2px solid #F5F5F7;transform:rotate(-45deg)}',
      editableProps: [
        { key: 'items', label: 'Item (satu per baris)', type: 'text', default: 'Tugas pertama\nTugas kedua\nTugas ketiga' }
      ]
    },
    {
      id: 'divider',
      name: 'Divider',
      category: 'text',
      icon: 'minus',
      thumb: '<div style="padding:0 6px;display:flex;align-items:center;justify-content:center;height:100%"><div style="width:100%;height:1px;background:linear-gradient(90deg,transparent,rgba(245,245,247,.24),transparent)"></div></div>',
      defaultHTML: '<hr class="ab-hr">',
      defaultCSS:
        '.ab-hr{border:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent);margin:24px 0}',
      editableProps: [
        { key: 'margin', label: 'Jarak (px)', type: 'number', default: 24 }
      ]
    },
    {
      id: 'spacer',
      name: 'Spacer',
      category: 'text',
      icon: 'move-vertical',
      thumb: '<div style="height:100%;display:flex;align-items:center;justify-content:center"><div style="width:1px;height:70%;background:repeating-linear-gradient(180deg,rgba(245,245,247,.30) 0 3px,transparent 3px 6px)"></div></div>',
      defaultHTML: '<div class="ab-spacer" aria-hidden="true"></div>',
      defaultCSS: '.ab-spacer{height:48px}',
      editableProps: [
        { key: 'height', label: 'Tinggi (px)', type: 'number', default: 48 }
      ]
    }
  ];

  /* ====================================================================
     CATEGORY: media (8)
     ==================================================================== */

  var MEDIA = [
    {
      id: 'image',
      name: 'Image',
      category: 'media',
      icon: 'image',
      thumb: '<div style="padding:6px;height:100%;box-sizing:border-box"><div style="width:100%;height:100%;border-radius:6px;background:linear-gradient(135deg,rgba(126,231,255,.18),rgba(167,139,250,.18));border:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;color:rgba(245,245,247,.55);font-size:14px">◇</div></div>',
      defaultHTML: '<img class="ab-img" src="" alt="" width="800" height="450">',
      defaultCSS:
        '.ab-img{display:block;width:100%;height:auto;border-radius:14px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.035)}',
      editableProps: [
        { key: 'src',   label: 'URL gambar', type: 'image', default: '' },
        { key: 'alt',   label: 'Alt text',   type: 'text',  default: '' },
        { key: 'width', label: 'Lebar',      type: 'number', default: 800 }
      ]
    },
    {
      id: 'image-gallery',
      name: 'Image Gallery',
      category: 'media',
      icon: 'images',
      thumb: '<div style="padding:6px;height:100%;box-sizing:border-box;display:grid;grid-template-columns:1fr 1fr 1fr;gap:3px">' +
        '<div style="border-radius:4px;background:linear-gradient(135deg,rgba(126,231,255,.22),rgba(167,139,250,.22))"></div>' +
        '<div style="border-radius:4px;background:linear-gradient(135deg,rgba(167,139,250,.22),rgba(240,171,252,.22))"></div>' +
        '<div style="border-radius:4px;background:linear-gradient(135deg,rgba(240,171,252,.22),rgba(253,230,138,.22))"></div>' +
        '<div style="border-radius:4px;background:linear-gradient(135deg,rgba(253,230,138,.22),rgba(126,231,255,.22))"></div>' +
        '<div style="border-radius:4px;background:linear-gradient(135deg,rgba(126,231,255,.22),rgba(240,171,252,.22))"></div>' +
        '<div style="border-radius:4px;background:linear-gradient(135deg,rgba(167,139,250,.22),rgba(253,230,138,.22))"></div>' +
      '</div>',
      defaultHTML:
        '<div class="ab-gallery"><div class="ab-gallery__cell"></div><div class="ab-gallery__cell"></div><div class="ab-gallery__cell"></div></div>',
      defaultCSS:
        '.ab-gallery{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:0 0 16px}' +
        '.ab-gallery__cell{aspect-ratio:1/1;border-radius:12px;background:linear-gradient(135deg,rgba(126,231,255,.14),rgba(167,139,250,.14));border:1px solid rgba(255,255,255,.08)}',
      editableProps: [
        { key: 'columns', label: 'Kolom', type: 'select', default: '3', options: ['2','3','4'] }
      ]
    },
    {
      id: 'video-embed',
      name: 'Video Embed',
      category: 'media',
      icon: 'video',
      thumb: '<div style="padding:6px;height:100%;box-sizing:border-box"><div style="width:100%;height:100%;border-radius:6px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center"><div style="width:0;height:0;border-left:10px solid rgba(245,245,247,.65);border-top:6px solid transparent;border-bottom:6px solid transparent"></div></div></div>',
      defaultHTML:
        '<div class="ab-video"><iframe src="" title="Video" allowfullscreen></iframe></div>',
      defaultCSS:
        '.ab-video{position:relative;aspect-ratio:16/9;border-radius:14px;overflow:hidden;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.035);margin:0 0 16px}' +
        '.ab-video iframe{width:100%;height:100%;border:0;display:block}',
      editableProps: [
        { key: 'url', label: 'URL embed', type: 'url', default: '' }
      ]
    },
    {
      id: 'audio-player',
      name: 'Audio Player',
      category: 'media',
      icon: 'music',
      thumb: '<div style="padding:6px;height:100%;box-sizing:border-box;display:flex;align-items:center;gap:5px"><div style="width:18px;height:18px;border-radius:50%;background:linear-gradient(120deg,#7EE7FF,#A78BFA);display:flex;align-items:center;justify-content:center"><div style="width:0;height:0;border-left:5px solid rgba(10,10,32,.9);border-top:3px solid transparent;border-bottom:3px solid transparent"></div></div><div style="flex:1;display:flex;flex-direction:column;gap:3px"><div style="height:3px;border-radius:2px;background:rgba(245,245,247,.20);overflow:hidden"><div style="width:35%;height:100%;background:linear-gradient(90deg,#7EE7FF,#A78BFA)"></div></div></div></div>',
      defaultHTML:
        '<div class="ab-audio"><button type="button" class="ab-audio__play" aria-label="Putar">' +
          '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>' +
          '</button><div class="ab-audio__track"><div class="ab-audio__fill"></div></div>' +
          '<span class="ab-audio__time">0:00</span></div>',
      defaultCSS:
        '.ab-audio{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:14px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);margin:0 0 16px}' +
        '.ab-audio__play{width:34px;height:34px;border-radius:50%;border:0;background:linear-gradient(120deg,#7EE7FF,#A78BFA);color:#020012;display:inline-flex;align-items:center;justify-content:center;cursor:pointer}' +
        '.ab-audio__track{flex:1;height:4px;border-radius:999px;background:rgba(255,255,255,.10);overflow:hidden}' +
        '.ab-audio__fill{width:35%;height:100%;background:linear-gradient(90deg,#7EE7FF,#A78BFA);border-radius:999px}' +
        '.ab-audio__time{font-size:12px;color:rgba(245,245,247,.55);font-variant-numeric:tabular-nums}',
      editableProps: [
        { key: 'src', label: 'URL audio', type: 'url', default: '' }
      ]
    },
    {
      id: 'large-icon',
      name: 'Large Icon',
      category: 'media',
      icon: 'icons',
      thumb: '<div style="padding:6px;height:100%;box-sizing:border-box;display:flex;align-items:center;justify-content:center"><div style="width:34px;height:34px;border-radius:10px;background:linear-gradient(120deg,rgba(126,231,255,.30),rgba(167,139,250,.30));border:1px solid rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center"><div style="width:16px;height:16px;border-radius:4px;border:2px solid rgba(245,245,247,.75)"></div></div></div>',
      defaultHTML: '<div class="ab-icon-lg"><i data-lucide="sparkles"></i></div>',
      defaultCSS:
        '.ab-icon-lg{width:96px;height:96px;border-radius:24px;display:inline-flex;align-items:center;justify-content:center;background:linear-gradient(120deg,rgba(126,231,255,.14),rgba(167,139,250,.14));border:1px solid rgba(255,255,255,.10);color:#F5F5F7;font-size:44px}',
      editableProps: [
        { key: 'icon',  label: 'Nama ikon', type: 'text',  default: 'sparkles' },
        { key: 'color', label: 'Warna',     type: 'color', default: '#F5F5F7' },
        { key: 'size',  label: 'Ukuran (px)', type: 'number', default: 96 }
      ]
    },
    {
      id: 'code-block',
      name: 'Code Block',
      category: 'media',
      icon: 'code-2',
      thumb: '<div style="padding:6px;height:100%;box-sizing:border-box"><div style="height:100%;border-radius:6px;background:rgba(0,0,0,.30);border:1px solid rgba(255,255,255,.08);padding:5px;display:flex;flex-direction:column;gap:3px"><div style="display:flex;gap:3px"><div style="width:4px;height:4px;border-radius:50%;background:rgba(255,255,255,.20)"></div><div style="width:4px;height:4px;border-radius:50%;background:rgba(255,255,255,.20)"></div><div style="width:4px;height:4px;border-radius:50%;background:rgba(255,255,255,.20)"></div></div><div style="flex:1;display:flex;flex-direction:column;gap:2px;justify-content:center"><div style="height:2px;width:70%;background:rgba(126,231,255,.55);border-radius:1px"></div><div style="height:2px;width:45%;background:rgba(240,171,252,.55);border-radius:1px"></div><div style="height:2px;width:58%;background:rgba(253,230,138,.55);border-radius:1px"></div></div></div></div>',
      defaultHTML:
        '<div class="ab-code"><div class="ab-code__head"><span class="ab-code__lang">js</span>' +
        '<button type="button" class="ab-code__copy" aria-label="Salin kode">Salin</button></div>' +
        '<pre class="ab-code__pre"><code>const pesan = "Halo dunia";\nconsole.log(pesan);</code></pre></div>',
      defaultCSS:
        '.ab-code{margin:0 0 16px;border-radius:14px;overflow:hidden;background:rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.08)}' +
        '.ab-code__head{display:flex;justify-content:space-between;align-items:center;padding:8px 12px;border-bottom:1px solid rgba(255,255,255,.06);font-size:11px;color:rgba(245,245,247,.55)}' +
        '.ab-code__copy{border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.04);border-radius:6px;padding:3px 8px;font-size:11px;color:rgba(245,245,247,.72);cursor:pointer}' +
        '.ab-code__copy:hover{background:rgba(255,255,255,.08)}' +
        '.ab-code__pre{margin:0;padding:14px 16px;font:500 13px/1.65 "JetBrains Mono",monospace;color:#F5F5F7;overflow-x:auto;white-space:pre}',
      editableProps: [
        { key: 'code',     label: 'Kode',     type: 'text', default: 'const pesan = "Halo dunia";' },
        { key: 'language', label: 'Bahasa',   type: 'text', default: 'js' }
      ]
    },
    {
      id: 'math-formula',
      name: 'Math Formula',
      category: 'media',
      icon: 'sigma',
      thumb: '<div style="height:100%;display:flex;align-items:center;justify-content:center;font:500 16px/1 Inter,serif;color:rgba(245,245,247,.75)">a² + b² = c²</div>',
      defaultHTML: '<div class="ab-math">a² + b² = c²</div>',
      defaultCSS:
        '.ab-math{margin:0 0 16px;padding:18px 20px;text-align:center;font:500 20px/1.4 "Playfair Display",serif;color:#F5F5F7;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);border-radius:14px}',
      editableProps: [
        { key: 'text',  label: 'Rumus',  type: 'text',  default: 'a² + b² = c²' },
        { key: 'color', label: 'Warna',  type: 'color', default: '#F5F5F7' }
      ]
    },
    {
      id: 'table',
      name: 'Table',
      category: 'media',
      icon: 'table',
      thumb: '<div style="padding:6px;height:100%;box-sizing:border-box"><div style="height:100%;border-radius:6px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);display:flex;flex-direction:column;overflow:hidden"><div style="height:6px;background:rgba(255,255,255,.06);border-bottom:1px solid rgba(255,255,255,.06)"></div><div style="flex:1;border-bottom:1px solid rgba(255,255,255,.06)"></div><div style="flex:1;border-bottom:1px solid rgba(255,255,255,.06)"></div><div style="flex:1"></div></div></div>',
      defaultHTML:
        '<table class="ab-table"><thead><tr><th>Kolom 1</th><th>Kolom 2</th><th>Kolom 3</th></tr></thead>' +
        '<tbody><tr><td>Data A</td><td>Data B</td><td>Data C</td></tr>' +
        '<tr><td>Data D</td><td>Data E</td><td>Data F</td></tr></tbody></table>',
      defaultCSS:
        '.ab-table{width:100%;border-collapse:separate;border-spacing:0;border-radius:14px;overflow:hidden;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.035);margin:0 0 16px;font:400 14px Inter,sans-serif;color:rgba(245,245,247,.82)}' +
        '.ab-table th,.ab-table td{padding:12px 16px;text-align:left;border-bottom:1px solid rgba(255,255,255,.06)}' +
        '.ab-table th{background:rgba(255,255,255,.03);font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:rgba(245,245,247,.55)}' +
        '.ab-table tr:last-child td{border-bottom:0}',
      editableProps: [
        { key: 'headers', label: 'Header (pisah dengan |)', type: 'text', default: 'Kolom 1|Kolom 2|Kolom 3' }
      ]
    }
  ];

  /* ====================================================================
     CATEGORY: card (8)
     ==================================================================== */

  var CARD = [
    {
      id: 'card-simple',
      name: 'Card Simple',
      category: 'card',
      icon: 'square',
      thumb: tBox('<span style="font-size:9px">Card</span>', 40),
      defaultHTML:
        '<div class="ab-card-simple"><h3>Judul</h3><p>Deskripsi singkat tentang isi kartu ini.</p></div>',
      defaultCSS:
        '.ab-card-simple{padding:20px;border-radius:16px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);margin:0 0 16px;transition:transform .26s cubic-bezier(.22,1,.36,1),border-color .26s cubic-bezier(.22,1,.36,1)}' +
        '.ab-card-simple:hover{transform:translateY(-2px);border-color:rgba(255,255,255,.18)}' +
        '.ab-card-simple h3{margin:0 0 8px;font:600 16px Inter,sans-serif;color:#F5F5F7;letter-spacing:-.01em}' +
        '.ab-card-simple p{margin:0;font:400 14px/1.6 Inter,sans-serif;color:rgba(245,245,247,.72)}',
      editableProps: [
        { key: 'title', label: 'Judul',     type: 'text', default: 'Judul' },
        { key: 'text',  label: 'Deskripsi', type: 'text', default: 'Deskripsi singkat.' }
      ]
    },
    {
      id: 'card-icon-title',
      name: 'Card Icon + Title',
      category: 'card',
      icon: 'layers',
      thumb: '<div style="padding:6px;height:100%;box-sizing:border-box;display:flex;flex-direction:column;justify-content:center;gap:4px"><div style="width:14px;height:14px;border-radius:5px;background:linear-gradient(120deg,#7EE7FF,#A78BFA)"></div><div style="height:4px;width:60%;background:rgba(245,245,247,.55);border-radius:2px"></div><div style="height:2px;width:82%;background:rgba(245,245,247,.20);border-radius:2px"></div><div style="height:2px;width:66%;background:rgba(245,245,247,.20);border-radius:2px"></div></div>',
      defaultHTML:
        '<div class="ab-card-it"><span class="ab-card-it__icon"><i data-lucide="sparkles"></i></span>' +
        '<h3>Fitur Unggulan</h3><p>Penjelasan singkat tentang fitur ini.</p></div>',
      defaultCSS:
        '.ab-card-it{padding:22px;border-radius:16px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);margin:0 0 16px;transition:transform .26s cubic-bezier(.22,1,.36,1),border-color .26s cubic-bezier(.22,1,.36,1)}' +
        '.ab-card-it:hover{transform:translateY(-2px);border-color:rgba(255,255,255,.18)}' +
        '.ab-card-it__icon{display:inline-flex;width:40px;height:40px;border-radius:12px;background:linear-gradient(120deg,rgba(126,231,255,.18),rgba(167,139,250,.18));border:1px solid rgba(255,255,255,.10);align-items:center;justify-content:center;color:#F5F5F7;font-size:18px;margin-bottom:14px}' +
        '.ab-card-it h3{margin:0 0 6px;font:600 16px Inter,sans-serif;letter-spacing:-.01em}' +
        '.ab-card-it p{margin:0;font:400 14px/1.6 Inter,sans-serif;color:rgba(245,245,247,.72)}',
      editableProps: [
        { key: 'icon',  label: 'Ikon',      type: 'text', default: 'sparkles' },
        { key: 'title', label: 'Judul',     type: 'text', default: 'Fitur Unggulan' },
        { key: 'text',  label: 'Deskripsi', type: 'text', default: 'Penjelasan singkat.' }
      ]
    },
    {
      id: 'card-image-top',
      name: 'Card Image Top',
      category: 'card',
      icon: 'image',
      thumb: '<div style="padding:6px;height:100%;box-sizing:border-box"><div style="height:100%;border-radius:6px;overflow:hidden;border:1px solid rgba(255,255,255,.08);display:flex;flex-direction:column"><div style="height:55%;background:linear-gradient(135deg,rgba(126,231,255,.24),rgba(167,139,250,.24))"></div><div style="flex:1;padding:5px;display:flex;flex-direction:column;gap:3px;justify-content:center"><div style="height:4px;width:60%;background:rgba(245,245,247,.55);border-radius:2px"></div><div style="height:2px;width:80%;background:rgba(245,245,247,.20);border-radius:2px"></div></div></div></div>',
      defaultHTML:
        '<article class="ab-card-img"><div class="ab-card-img__media" role="img" aria-label="Gambar kartu"></div>' +
        '<div class="ab-card-img__body"><h3>Judul Kartu</h3><p>Deskripsi singkat di bawah gambar.</p></div></article>',
      defaultCSS:
        '.ab-card-img{border-radius:16px;overflow:hidden;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);margin:0 0 16px;transition:transform .26s cubic-bezier(.22,1,.36,1),border-color .26s cubic-bezier(.22,1,.36,1)}' +
        '.ab-card-img:hover{transform:translateY(-2px);border-color:rgba(255,255,255,.18)}' +
        '.ab-card-img__media{aspect-ratio:16/10;background:linear-gradient(135deg,rgba(126,231,255,.18),rgba(167,139,250,.18))}' +
        '.ab-card-img__body{padding:18px}' +
        '.ab-card-img__body h3{margin:0 0 6px;font:600 16px Inter,sans-serif;letter-spacing:-.01em}' +
        '.ab-card-img__body p{margin:0;font:400 14px/1.6 Inter,sans-serif;color:rgba(245,245,247,.72)}',
      editableProps: [
        { key: 'image', label: 'URL gambar', type: 'image', default: '' },
        { key: 'title', label: 'Judul',      type: 'text',  default: 'Judul Kartu' },
        { key: 'text',  label: 'Deskripsi',  type: 'text',  default: 'Deskripsi singkat.' }
      ]
    },
    {
      id: 'card-hover-reveal',
      name: 'Card Hover Reveal',
      category: 'card',
      icon: 'mouse-pointer',
      thumb: '<div style="padding:6px;height:100%;box-sizing:border-box;display:flex;align-items:center;justify-content:center"><div style="width:70%;height:60%;border-radius:6px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center;color:rgba(245,245,247,.45);font-size:9px">Hover</div></div>',
      defaultHTML:
        '<div class="ab-card-reveal"><div class="ab-card-reveal__front"><h3>Judul</h3><p>Ringkasan singkat.</p></div>' +
        '<div class="ab-card-reveal__back"><p>Detail muncul saat kursor di atas kartu.</p></div></div>',
      defaultCSS:
        '.ab-card-reveal{position:relative;min-height:200px;border-radius:16px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);overflow:hidden;margin:0 0 16px;transition:border-color .26s cubic-bezier(.22,1,.36,1)}' +
        '.ab-card-reveal:hover{border-color:rgba(255,255,255,.18)}' +
        '.ab-card-reveal__front{padding:22px;transition:opacity .26s cubic-bezier(.22,1,.36,1),transform .26s cubic-bezier(.22,1,.36,1)}' +
        '.ab-card-reveal:hover .ab-card-reveal__front{opacity:0;transform:translateY(-6px)}' +
        '.ab-card-reveal__front h3{margin:0 0 6px;font:600 16px Inter,sans-serif}' +
        '.ab-card-reveal__front p{margin:0;font:400 14px/1.6 Inter,sans-serif;color:rgba(245,245,247,.72)}' +
        '.ab-card-reveal__back{position:absolute;inset:0;padding:22px;display:flex;align-items:center;opacity:0;transform:translateY(8px);transition:opacity .26s cubic-bezier(.22,1,.36,1),transform .26s cubic-bezier(.22,1,.36,1);background:linear-gradient(135deg,rgba(126,231,255,.10),rgba(167,139,250,.10))}' +
        '.ab-card-reveal:hover .ab-card-reveal__back{opacity:1;transform:translateY(0)}' +
        '.ab-card-reveal__back p{margin:0;font:400 14px/1.6 Inter,sans-serif;color:#F5F5F7}',
      editableProps: [
        { key: 'title', label: 'Judul',   type: 'text', default: 'Judul' },
        { key: 'front', label: 'Depan',   type: 'text', default: 'Ringkasan singkat.' },
        { key: 'back',  label: 'Belakang', type: 'text', default: 'Detail saat hover.' }
      ]
    },
    {
      id: 'flip-card',
      name: 'Flip Card',
      category: 'card',
      icon: 'flip-horizontal',
      thumb: '<div style="padding:6px;height:100%;box-sizing:border-box;display:flex;align-items:center;justify-content:center"><div style="width:70%;height:60%;border-radius:6px;background:linear-gradient(135deg,rgba(126,231,255,.16),rgba(167,139,250,.16));border:1px solid rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center;color:rgba(245,245,247,.55);font-size:10px">↻</div></div>',
      defaultHTML:
        '<div class="ab-flip"><div class="ab-flip__inner">' +
        '<div class="ab-flip__face ab-flip__front"><h3>Depan</h3><p>Klik untuk melihat.</p></div>' +
        '<div class="ab-flip__face ab-flip__back"><h3>Belakang</h3><p>Informasi tambahan.</p></div>' +
        '</div></div>',
      defaultCSS:
        '.ab-flip{perspective:1000px;height:220px;margin:0 0 16px;cursor:pointer}' +
        '.ab-flip__inner{position:relative;width:100%;height:100%;transition:transform .6s cubic-bezier(.22,1,.36,1);transform-style:preserve-3d}' +
        '.ab-flip.is-flipped .ab-flip__inner{transform:rotateY(180deg)}' +
        '.ab-flip__face{position:absolute;inset:0;border-radius:16px;backface-visibility:hidden;-webkit-backface-visibility:hidden;padding:22px;display:flex;flex-direction:column;justify-content:center;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08)}' +
        '.ab-flip__back{transform:rotateY(180deg);background:linear-gradient(135deg,rgba(167,139,250,.10),rgba(240,171,252,.10))}' +
        '.ab-flip__face h3{margin:0 0 6px;font:600 16px Inter,sans-serif}' +
        '.ab-flip__face p{margin:0;font:400 14px/1.6 Inter,sans-serif;color:rgba(245,245,247,.72)}',
      editableProps: [
        { key: 'frontTitle', label: 'Judul depan',     type: 'text', default: 'Depan' },
        { key: 'frontText',  label: 'Teks depan',      type: 'text', default: 'Klik untuk melihat.' },
        { key: 'backTitle',  label: 'Judul belakang',  type: 'text', default: 'Belakang' },
        { key: 'backText',   label: 'Teks belakang',   type: 'text', default: 'Informasi tambahan.' }
      ]
    },
    {
      id: 'stat-card',
      name: 'Stat Card',
      category: 'card',
      icon: 'bar-chart-3',
      thumb: '<div style="padding:6px;height:100%;box-sizing:border-box;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:3px"><div style="font:700 18px Inter,sans-serif;color:rgba(245,245,247,.75)">42</div><div style="height:3px;width:50%;background:rgba(245,245,247,.20);border-radius:2px"></div></div>',
      defaultHTML:
        '<div class="ab-stat"><span class="ab-stat__value">42</span><span class="ab-stat__label">Jumlah Siswa</span></div>',
      defaultCSS:
        '.ab-stat{display:inline-flex;flex-direction:column;gap:4px;padding:22px 26px;border-radius:16px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);margin:0 0 16px;transition:transform .26s cubic-bezier(.22,1,.36,1),border-color .26s cubic-bezier(.22,1,.36,1)}' +
        '.ab-stat:hover{transform:translateY(-2px);border-color:rgba(255,255,255,.18)}' +
        '.ab-stat__value{font:600 40px/1 Inter,sans-serif;letter-spacing:-.03em;color:#F5F5F7;font-variant-numeric:tabular-nums}' +
        '.ab-stat__label{font:500 12px Inter,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:rgba(245,245,247,.55)}',
      editableProps: [
        { key: 'value', label: 'Angka', type: 'text', default: '42' },
        { key: 'label', label: 'Label', type: 'text', default: 'Jumlah Siswa' }
      ]
    },
    {
      id: 'profile-card',
      name: 'Profile Card',
      category: 'card',
      icon: 'user',
      thumb: '<div style="padding:6px;height:100%;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px"><div style="width:18px;height:18px;border-radius:50%;background:linear-gradient(120deg,#7EE7FF,#A78BFA)"></div><div style="height:3px;width:46%;background:rgba(245,245,247,.55);border-radius:2px"></div><div style="height:2px;width:60%;background:rgba(245,245,247,.20);border-radius:2px"></div></div>',
      defaultHTML:
        '<div class="ab-profile"><div class="ab-profile__avatar" aria-hidden="true"></div>' +
        '<h3>Nama Lengkap</h3><p class="ab-profile__role">Guru Biologi</p>' +
        '<p class="ab-profile__bio">Sekilas tentang latar belakang dan keahlian.</p></div>',
      defaultCSS:
        '.ab-profile{padding:26px;border-radius:16px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);margin:0 0 16px;text-align:center;transition:transform .26s cubic-bezier(.22,1,.36,1),border-color .26s cubic-bezier(.22,1,.36,1)}' +
        '.ab-profile:hover{transform:translateY(-2px);border-color:rgba(255,255,255,.18)}' +
        '.ab-profile__avatar{width:64px;height:64px;border-radius:50%;background:linear-gradient(120deg,rgba(126,231,255,.35),rgba(167,139,250,.35));border:1px solid rgba(255,255,255,.14);margin:0 auto 14px}' +
        '.ab-profile h3{margin:0 0 4px;font:600 16px Inter,sans-serif;letter-spacing:-.01em}' +
        '.ab-profile__role{margin:0 0 12px;font:500 12px Inter,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:rgba(245,245,247,.55)}' +
        '.ab-profile__bio{margin:0;font:400 13px/1.6 Inter,sans-serif;color:rgba(245,245,247,.72)}',
      editableProps: [
        { key: 'name', label: 'Nama', type: 'text', default: 'Nama Lengkap' },
        { key: 'role', label: 'Peran', type: 'text', default: 'Guru Biologi' },
        { key: 'bio',  label: 'Bio',   type: 'text', default: 'Sekilas tentang latar belakang.' }
      ]
    },
    {
      id: 'timeline-card',
      name: 'Timeline Card',
      category: 'card',
      icon: 'calendar',
      thumb: '<div style="padding:6px;height:100%;box-sizing:border-box;display:flex;gap:5px;align-items:center"><div style="width:2px;height:70%;background:linear-gradient(180deg,#7EE7FF,#A78BFA);border-radius:2px"></div><div style="flex:1;display:flex;flex-direction:column;gap:3px"><div style="height:3px;width:55%;background:rgba(245,245,247,.55);border-radius:2px"></div><div style="height:2px;width:80%;background:rgba(245,245,247,.20);border-radius:2px"></div></div></div>',
      defaultHTML:
        '<article class="ab-tl-card"><time class="ab-tl-card__time">2024</time>' +
        '<h3>Peristiwa Penting</h3><p>Penjelasan singkat tentang peristiwa ini.</p></article>',
      defaultCSS:
        '.ab-tl-card{position:relative;padding:18px 20px 18px 24px;border-radius:14px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);margin:0 0 16px}' +
        '.ab-tl-card::before{content:"";position:absolute;left:0;top:18px;bottom:18px;width:2px;border-radius:2px;background:linear-gradient(180deg,#7EE7FF,#A78BFA)}' +
        '.ab-tl-card__time{display:inline-block;font:500 11px Inter,sans-serif;letter-spacing:.10em;text-transform:uppercase;color:rgba(245,245,247,.55);margin-bottom:6px}' +
        '.ab-tl-card h3{margin:0 0 6px;font:600 15px Inter,sans-serif;letter-spacing:-.01em}' +
        '.ab-tl-card p{margin:0;font:400 13px/1.6 Inter,sans-serif;color:rgba(245,245,247,.72)}',
      editableProps: [
        { key: 'time',  label: 'Waktu',     type: 'text', default: '2024' },
        { key: 'title', label: 'Judul',     type: 'text', default: 'Peristiwa Penting' },
        { key: 'text',  label: 'Deskripsi', type: 'text', default: 'Penjelasan singkat.' }
      ]
    }
  ];

  /* ====================================================================
     CATEGORY: button (8)
     ==================================================================== */

  function btnThumb(extraStyle, label) {
    return '<div style="height:100%;display:flex;align-items:center;justify-content:center;padding:6px"><div style="padding:6px 12px;border-radius:' + (extraStyle.radius || 999) + 'px;font:500 10px Inter,sans-serif;color:' + (extraStyle.color || '#F5F5F7') + ';background:' + (extraStyle.bg || 'rgba(255,255,255,.06)') + ';border:1px solid ' + (extraStyle.border || 'rgba(255,255,255,.14)') + '">' + label + '</div></div>';
  }

  var BUTTON = [
    {
      id: 'btn-primary',
      name: 'Button Primary',
      category: 'button',
      icon: 'square',
      thumb: btnThumb({ bg: 'linear-gradient(120deg,#7EE7FF,#A78BFA)', color: '#020012', border: 'rgba(255,255,255,.10)' }, 'Klik'),
      defaultHTML: '<button type="button" class="ab-btn-primary">Klik di sini</button>',
      defaultCSS:
        '.ab-btn-primary{display:inline-flex;align-items:center;justify-content:center;height:44px;padding:0 22px;border:0;border-radius:999px;background:linear-gradient(120deg,#7EE7FF,#A78BFA,#F0ABFC);color:#020012;font:500 14px Inter,sans-serif;cursor:pointer;position:relative;overflow:hidden;transition:transform .15s cubic-bezier(.22,1,.36,1),filter .15s cubic-bezier(.22,1,.36,1)}' +
        '.ab-btn-primary:hover{transform:translateY(-1px);filter:brightness(1.08)}' +
        '.ab-btn-primary:active{transform:scale(.97)}',
      editableProps: [
        { key: 'text', label: 'Teks', type: 'text', default: 'Klik di sini' }
      ]
    },
    {
      id: 'btn-secondary',
      name: 'Button Secondary',
      category: 'button',
      icon: 'square',
      thumb: btnThumb({}, 'Klik'),
      defaultHTML: '<button type="button" class="ab-btn-secondary">Klik di sini</button>',
      defaultCSS:
        '.ab-btn-secondary{display:inline-flex;align-items:center;justify-content:center;height:44px;padding:0 22px;border:1px solid rgba(255,255,255,.14);border-radius:999px;background:rgba(255,255,255,.06);color:#F5F5F7;font:500 14px Inter,sans-serif;cursor:pointer;position:relative;transition:transform .15s cubic-bezier(.22,1,.36,1),border-color .15s,bbackground .15s}' +
        '.ab-btn-secondary:hover{transform:translateY(-1px);border-color:rgba(255,255,255,.28);background:rgba(255,255,255,.10)}' +
        '.ab-btn-secondary:active{transform:scale(.97)}',
      editableProps: [
        { key: 'text', label: 'Teks', type: 'text', default: 'Klik di sini' }
      ]
    },
    {
      id: 'btn-ghost',
      name: 'Button Ghost',
      category: 'button',
      icon: 'square',
      thumb: btnThumb({ bg: 'transparent', color: 'rgba(245,245,247,.75)', border: 'rgba(255,255,255,.08)' }, 'Klik'),
      defaultHTML: '<button type="button" class="ab-btn-ghost">Klik di sini</button>',
      defaultCSS:
        '.ab-btn-ghost{display:inline-flex;align-items:center;justify-content:center;height:44px;padding:0 18px;border:1px solid transparent;border-radius:999px;background:transparent;color:rgba(245,245,247,.82);font:500 14px Inter,sans-serif;cursor:pointer;transition:background .15s,border-color .15s,color .15s,transform .15s cubic-bezier(.22,1,.36,1)}' +
        '.ab-btn-ghost:hover{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.14);color:#F5F5F7;transform:translateY(-1px)}' +
        '.ab-btn-ghost:active{transform:scale(.97)}',
      editableProps: [
        { key: 'text', label: 'Teks', type: 'text', default: 'Klik di sini' }
      ]
    },
    {
      id: 'btn-icon-only',
      name: 'Button Icon Only',
      category: 'button',
      icon: 'circle',
      thumb: '<div style="height:100%;display:flex;align-items:center;justify-content:center"><div style="width:22px;height:22px;border-radius:50%;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center;color:rgba(245,245,247,.75);font-size:11px">+</div></div>',
      defaultHTML: '<button type="button" class="ab-btn-icon" aria-label="Aksi"><i data-lucide="plus"></i></button>',
      defaultCSS:
        '.ab-btn-icon{width:40px;height:40px;border-radius:50%;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);color:#F5F5F7;font-size:16px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;transition:background .15s,border-color .15s,transform .15s cubic-bezier(.22,1,.36,1)}' +
        '.ab-btn-icon:hover{background:rgba(255,255,255,.10);border-color:rgba(255,255,255,.28);transform:translateY(-1px)}' +
        '.ab-btn-icon:active{transform:scale(.94)}',
      editableProps: [
        { key: 'icon', label: 'Ikon', type: 'text', default: 'plus' }
      ]
    },
    {
      id: 'btn-pill',
      name: 'Button Pill',
      category: 'button',
      icon: 'circle',
      thumb: btnThumb({ radius: 999 }, 'Pill'),
      defaultHTML: '<button type="button" class="ab-btn-pill">Tombol Pill</button>',
      defaultCSS:
        '.ab-btn-pill{display:inline-flex;align-items:center;justify-content:center;height:36px;padding:0 18px;border-radius:999px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04);color:#F5F5F7;font:500 13px Inter,sans-serif;cursor:pointer;letter-spacing:.01em;transition:background .15s,border-color .15s,transform .15s cubic-bezier(.22,1,.36,1)}' +
        '.ab-btn-pill:hover{background:rgba(255,255,255,.09);border-color:rgba(255,255,255,.28);transform:translateY(-1px)}' +
        '.ab-btn-pill:active{transform:scale(.97)}',
      editableProps: [
        { key: 'text', label: 'Teks', type: 'text', default: 'Tombol Pill' }
      ]
    },
    {
      id: 'btn-group',
      name: 'Button Group',
      category: 'button',
      icon: 'square',
      thumb: '<div style="height:100%;display:flex;align-items:center;justify-content:center;gap:3px;padding:6px"><div style="padding:5px 8px;border-radius:999px;font:500 9px Inter,sans-serif;color:#020012;background:linear-gradient(120deg,#7EE7FF,#A78BFA)">A</div><div style="padding:5px 8px;border-radius:999px;font:500 9px Inter,sans-serif;color:rgba(245,245,247,.75);background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14)">B</div></div>',
      defaultHTML:
        '<div class="ab-btn-group">' +
        '<button type="button" class="ab-btn-group__a">Utama</button>' +
        '<button type="button" class="ab-btn-group__b">Sekunder</button></div>',
      defaultCSS:
        '.ab-btn-group{display:inline-flex;gap:8px}' +
        '.ab-btn-group__a,.ab-btn-group__b{height:42px;padding:0 20px;border-radius:999px;font:500 14px Inter,sans-serif;cursor:pointer;transition:transform .15s cubic-bezier(.22,1,.36,1),filter .15s}' +
        '.ab-btn-group__a{border:0;background:linear-gradient(120deg,#7EE7FF,#A78BFA,#F0ABFC);color:#020012}' +
        '.ab-btn-group__b{border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);color:#F5F5F7}' +
        '.ab-btn-group__a:hover,.ab-btn-group__b:hover{transform:translateY(-1px);filter:brightness(1.06)}' +
        '.ab-btn-group__a:active,.ab-btn-group__b:active{transform:scale(.97)}',
      editableProps: [
        { key: 'labelA', label: 'Teks A', type: 'text', default: 'Utama' },
        { key: 'labelB', label: 'Teks B', type: 'text', default: 'Sekunder' }
      ]
    },
    {
      id: 'btn-with-icon',
      name: 'Button with Right Icon',
      category: 'button',
      icon: 'arrow-right',
      thumb: '<div style="height:100%;display:flex;align-items:center;justify-content:center"><div style="padding:6px 10px;border-radius:999px;font:500 10px Inter,sans-serif;color:#F5F5F7;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);display:flex;align-items:center;gap:4px">Lanjut<span style="font-size:11px">→</span></div></div>',
      defaultHTML:
        '<button type="button" class="ab-btn-wi">Lanjut <i data-lucide="arrow-right"></i></button>',
      defaultCSS:
        '.ab-btn-wi{display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 20px;border-radius:999px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);color:#F5F5F7;font:500 14px Inter,sans-serif;cursor:pointer;transition:background .15s,border-color .15s,transform .15s cubic-bezier(.22,1,.36,1)}' +
        '.ab-btn-wi:hover{background:rgba(255,255,255,.10);border-color:rgba(255,255,255,.28);transform:translateY(-1px)}' +
        '.ab-btn-wi:active{transform:scale(.97)}' +
        '.ab-btn-wi .ab-icon{font-size:15px}',
      editableProps: [
        { key: 'text', label: 'Teks', type: 'text', default: 'Lanjut' }
      ]
    },
    {
      id: 'link-arrow',
      name: 'Link Arrow',
      category: 'button',
      icon: 'link',
      thumb: '<div style="height:100%;display:flex;align-items:center;justify-content:center"><div style="font:500 11px Inter,sans-serif;color:rgba(126,231,255,.95);display:flex;align-items:center;gap:3px">Selengkapnya<span>›</span></div></div>',
      defaultHTML:
        '<a href="#" class="ab-link-arrow">Selengkapnya <i data-lucide="chevron-right"></i></a>',
      defaultCSS:
        '.ab-link-arrow{display:inline-flex;align-items:center;gap:4px;color:rgba(126,231,255,.95);font:500 14px Inter,sans-serif;text-decoration:none;transition:gap .15s cubic-bezier(.22,1,.36,1),color .15s}' +
        '.ab-link-arrow:hover{gap:8px;color:#FFFFFF}' +
        '.ab-link-arrow .ab-icon{font-size:15px}',
      editableProps: [
        { key: 'text', label: 'Teks', type: 'text', default: 'Selengkapnya' },
        { key: 'url',  label: 'URL',  type: 'url',  default: '#' }
      ]
    }
  ];

  /* ====================================================================
     CATEGORY: form (7)
     ==================================================================== */

  var FORM = [
    {
      id: 'input-text',
      name: 'Input Text',
      category: 'form',
      icon: 'text-cursor-input',
      thumb: '<div style="padding:6px;height:100%;box-sizing:border-box;display:flex;align-items:center"><div style="width:100%;height:16px;border-radius:5px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.10);padding:0 6px;display:flex;align-items:center"><div style="height:2px;width:36%;background:rgba(245,245,247,.35);border-radius:2px"></div></div></div>',
      defaultHTML:
        '<label class="ab-field-label">Label</label>' +
        '<input type="text" class="ab-input-el" placeholder="Tulis di sini...">',
      defaultCSS:
        '.ab-field-label{display:block;margin:0 0 6px;font:500 12px Inter,sans-serif;color:rgba(245,245,247,.72);letter-spacing:.01em}' +
        '.ab-input-el{width:100%;height:42px;padding:0 14px;border-radius:12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.10);color:#F5F5F7;font:400 14px Inter,sans-serif;transition:border-color .15s,box-shadow .15s}' +
        '.ab-input-el::placeholder{color:rgba(245,245,247,.32)}' +
        '.ab-input-el:focus{outline:none;border-color:rgba(126,231,255,.45);box-shadow:0 0 0 4px rgba(126,231,255,.10)}',
      editableProps: [
        { key: 'label',       label: 'Label',      type: 'text', default: 'Label' },
        { key: 'placeholder', label: 'Placeholder', type: 'text', default: 'Tulis di sini...' }
      ]
    },
    {
      id: 'textarea',
      name: 'Textarea',
      category: 'form',
      icon: 'align-left',
      thumb: '<div style="padding:6px;height:100%;box-sizing:border-box;display:flex;align-items:center"><div style="width:100%;height:100%;border-radius:5px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.10);padding:5px;display:flex;flex-direction:column;gap:2px"><div style="height:2px;width:60%;background:rgba(245,245,247,.30);border-radius:2px"></div><div style="height:2px;width:44%;background:rgba(245,245,247,.30);border-radius:2px"></div></div></div>',
      defaultHTML:
        '<label class="ab-field-label">Pesan</label>' +
        '<textarea class="ab-textarea-el" rows="4" placeholder="Tulis pesan..."></textarea>',
      defaultCSS:
        '.ab-field-label{display:block;margin:0 0 6px;font:500 12px Inter,sans-serif;color:rgba(245,245,247,.72)}' +
        '.ab-textarea-el{width:100%;padding:12px 14px;border-radius:12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.10);color:#F5F5F7;font:400 14px/1.55 Inter,sans-serif;resize:vertical;min-height:96px;transition:border-color .15s,box-shadow .15s}' +
        '.ab-textarea-el::placeholder{color:rgba(245,245,247,.32)}' +
        '.ab-textarea-el:focus{outline:none;border-color:rgba(126,231,255,.45);box-shadow:0 0 0 4px rgba(126,231,255,.10)}',
      editableProps: [
        { key: 'label',       label: 'Label',      type: 'text', default: 'Pesan' },
        { key: 'placeholder', label: 'Placeholder', type: 'text', default: 'Tulis pesan...' },
        { key: 'rows',        label: 'Baris',      type: 'number', default: 4 }
      ]
    },
    {
      id: 'select',
      name: 'Select Dropdown',
      category: 'form',
      icon: 'chevrons-up-down',
      thumb: '<div style="padding:6px;height:100%;box-sizing:border-box;display:flex;align-items:center"><div style="width:100%;height:16px;border-radius:5px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.10);padding:0 6px;display:flex;align-items:center;justify-content:space-between"><div style="height:2px;width:36%;background:rgba(245,245,247,.35);border-radius:2px"></div><div style="font-size:8px;color:rgba(245,245,247,.45)">▾</div></div></div>',
      defaultHTML:
        '<label class="ab-field-label">Pilih</label>' +
        '<select class="ab-select-el"><option>Opsi 1</option><option>Opsi 2</option><option>Opsi 3</option></select>',
      defaultCSS:
        '.ab-field-label{display:block;margin:0 0 6px;font:500 12px Inter,sans-serif;color:rgba(245,245,247,.72)}' +
        '.ab-select-el{width:100%;height:42px;padding:0 14px;border-radius:12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.10);color:#F5F5F7;font:400 14px Inter,sans-serif;cursor:pointer;appearance:none;-webkit-appearance:none;background-image:linear-gradient(45deg,transparent 50%,rgba(245,245,247,.55) 50%),linear-gradient(135deg,rgba(245,245,247,.55) 50%,transparent 50%);background-position:calc(100% - 18px) 50%,calc(100% - 13px) 50%;background-size:5px 5px,5px 5px;background-repeat:no-repeat}' +
        '.ab-select-el:focus{outline:none;border-color:rgba(126,231,255,.45);box-shadow:0 0 0 4px rgba(126,231,255,.10)}',
      editableProps: [
        { key: 'label',   label: 'Label',      type: 'text', default: 'Pilih' },
        { key: 'options', label: 'Opsi (satu per baris)', type: 'text', default: 'Opsi 1\nOpsi 2\nOpsi 3' }
      ]
    },
    {
      id: 'checkbox',
      name: 'Checkbox',
      category: 'form',
      icon: 'check-square',
      thumb: '<div style="padding:6px;height:100%;box-sizing:border-box;display:flex;align-items:center;gap:5px"><div style="width:11px;height:11px;border-radius:3px;background:linear-gradient(120deg,#7EE7FF,#A78BFA);display:flex;align-items:center;justify-content:center"><div style="width:4px;height:2px;border-left:1.5px solid #020012;border-bottom:1.5px solid #020012;transform:rotate(-45deg) translate(0,-1px)"></div></div><div style="height:2px;width:44%;background:rgba(245,245,247,.35);border-radius:2px"></div></div>',
      defaultHTML:
        '<label class="ab-checkbox"><input type="checkbox" checked><span class="ab-checkbox__box"></span><span class="ab-checkbox__label">Saya setuju</span></label>',
      defaultCSS:
        '.ab-checkbox{display:inline-flex;align-items:center;gap:10px;cursor:pointer;font:400 14px Inter,sans-serif;color:#F5F5F7;position:relative;user-select:none}' +
        '.ab-checkbox input{position:absolute;opacity:0;pointer-events:none}' +
        '.ab-checkbox__box{width:18px;height:18px;border-radius:5px;border:1px solid rgba(255,255,255,.20);background:rgba(255,255,255,.03);display:inline-flex;align-items:center;justify-content:center;transition:background .15s,border-color .15s}' +
        '.ab-checkbox input:checked + .ab-checkbox__box{background:linear-gradient(120deg,rgba(126,231,255,.35),rgba(167,139,250,.35));border-color:rgba(255,255,255,.28)}' +
        '.ab-checkbox input:checked + .ab-checkbox__box::after{content:"";width:8px;height:4px;border-left:2px solid #F5F5F7;border-bottom:2px solid #F5F5F7;transform:rotate(-45deg) translate(0,-1px)}' +
        '.ab-checkbox input:focus-visible + .ab-checkbox__box{box-shadow:0 0 0 4px rgba(126,231,255,.18)}',
      editableProps: [
        { key: 'label',   label: 'Label', type: 'text', default: 'Saya setuju' },
        { key: 'checked', label: 'Tercentang', type: 'select', default: 'true', options: ['true', 'false'] }
      ]
    },
    {
      id: 'radio-group',
      name: 'Radio Group',
      category: 'form',
      icon: 'circle-dot',
      thumb: '<div style="padding:6px;height:100%;box-sizing:border-box;display:flex;flex-direction:column;gap:4px;justify-content:center">' +
        '<div style="display:flex;align-items:center;gap:5px"><div style="width:9px;height:9px;border-radius:50%;border:2px solid #A78BFA;background:radial-gradient(circle,#A78BFA 0 30%,transparent 30%)"></div><div style="height:2px;width:44%;background:rgba(245,245,247,.30);border-radius:2px"></div></div>' +
        '<div style="display:flex;align-items:center;gap:5px"><div style="width:9px;height:9px;border-radius:50%;border:1px solid rgba(255,255,255,.22)"></div><div style="height:2px;width:36%;background:rgba(245,245,247,.30);border-radius:2px"></div></div>' +
      '</div>',
      defaultHTML:
        '<fieldset class="ab-radio-group"><legend>Pilih salah satu</legend>' +
        '<label class="ab-radio"><input type="radio" name="grp" checked><span class="ab-radio__dot"></span>Opsi A</label>' +
        '<label class="ab-radio"><input type="radio" name="grp"><span class="ab-radio__dot"></span>Opsi B</label>' +
        '<label class="ab-radio"><input type="radio" name="grp"><span class="ab-radio__dot"></span>Opsi C</label>' +
        '</fieldset>',
      defaultCSS:
        '.ab-radio-group{display:flex;flex-direction:column;gap:10px;border:0;padding:0;margin:0}' +
        '.ab-radio-group legend{font:500 12px Inter,sans-serif;color:rgba(245,245,247,.72);margin-bottom:8px}' +
        '.ab-radio{display:inline-flex;align-items:center;gap:10px;cursor:pointer;font:400 14px Inter,sans-serif;color:#F5F5F7;position:relative;user-select:none}' +
        '.ab-radio input{position:absolute;opacity:0;pointer-events:none}' +
        '.ab-radio__dot{width:18px;height:18px;border-radius:50%;border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.03);display:inline-flex;align-items:center;justify-content:center;transition:border-color .15s}' +
        '.ab-radio input:checked + .ab-radio__dot{border-color:rgba(167,139,250,.75)}' +
        '.ab-radio input:checked + .ab-radio__dot::after{content:"";width:8px;height:8px;border-radius:50%;background:linear-gradient(120deg,#7EE7FF,#A78BFA)}' +
        '.ab-radio input:focus-visible + .ab-radio__dot{box-shadow:0 0 0 4px rgba(126,231,255,.18)}',
      editableProps: [
        { key: 'legend',  label: 'Judul grup', type: 'text', default: 'Pilih salah satu' },
        { key: 'options', label: 'Opsi (satu per baris)', type: 'text', default: 'Opsi A\nOpsi B\nOpsi C' }
      ]
    },
    {
      id: 'range-slider',
      name: 'Range Slider',
      category: 'form',
      icon: 'sliders',
      thumb: '<div style="padding:6px;height:100%;box-sizing:border-box;display:flex;align-items:center"><div style="width:100%;height:3px;border-radius:2px;background:rgba(255,255,255,.10);position:relative"><div style="position:absolute;left:0;top:0;bottom:0;width:52%;background:linear-gradient(90deg,#7EE7FF,#A78BFA);border-radius:2px"></div><div style="position:absolute;left:52%;top:50%;transform:translate(-50%,-50%);width:10px;height:10px;border-radius:50%;background:#F5F5F7;border:2px solid #A78BFA;box-shadow:0 2px 6px rgba(0,0,0,.35)"></div></div></div>',
      defaultHTML:
        '<label class="ab-range-label">Volume</label>' +
        '<input type="range" class="ab-range-el" min="0" max="100" value="50">',
      defaultCSS:
        '.ab-range-label{display:block;margin:0 0 8px;font:500 12px Inter,sans-serif;color:rgba(245,245,247,.72)}' +
        '.ab-range-el{-webkit-appearance:none;appearance:none;width:100%;height:4px;border-radius:999px;background:rgba(255,255,255,.10);outline:none}' +
        '.ab-range-el::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:18px;height:18px;border-radius:50%;background:linear-gradient(120deg,#7EE7FF,#A78BFA);cursor:pointer;border:2px solid rgba(10,10,32,.9);box-shadow:0 2px 8px rgba(0,0,0,.35)}' +
        '.ab-range-el::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:linear-gradient(120deg,#7EE7FF,#A78BFA);cursor:pointer;border:2px solid rgba(10,10,32,.9)}',
      editableProps: [
        { key: 'label', label: 'Label', type: 'text',   default: 'Volume' },
        { key: 'min',   label: 'Min',   type: 'number', default: 0 },
        { key: 'max',   label: 'Max',   type: 'number', default: 100 },
        { key: 'value', label: 'Nilai', type: 'number', default: 50 }
      ]
    },
    {
      id: 'toggle-switch',
      name: 'Toggle Switch',
      category: 'form',
      icon: 'toggle-left',
      thumb: '<div style="padding:6px;height:100%;box-sizing:border-box;display:flex;align-items:center;gap:5px"><div style="width:20px;height:12px;border-radius:999px;background:linear-gradient(120deg,#7EE7FF,#A78BFA);position:relative"><div style="position:absolute;top:1px;right:1px;width:10px;height:10px;border-radius:50%;background:#F5F5F7"></div></div><div style="height:2px;width:40%;background:rgba(245,245,247,.35);border-radius:2px"></div></div>',
      defaultHTML:
        '<label class="ab-toggle"><input type="checkbox" checked><span class="ab-toggle__track"></span><span class="ab-toggle__label">Aktif</span></label>',
      defaultCSS:
        '.ab-toggle{display:inline-flex;align-items:center;gap:10px;cursor:pointer;font:400 14px Inter,sans-serif;color:#F5F5F7;position:relative;user-select:none}' +
        '.ab-toggle input{position:absolute;opacity:0;pointer-events:none}' +
        '.ab-toggle__track{position:relative;width:36px;height:22px;border-radius:999px;background:rgba(255,255,255,.10);transition:background .2s}' +
        '.ab-toggle__track::after{content:"";position:absolute;top:2px;left:2px;width:18px;height:18px;border-radius:50%;background:#F5F5F7;transition:left .2s cubic-bezier(.22,1,.36,1)}' +
        '.ab-toggle input:checked + .ab-toggle__track{background:linear-gradient(120deg,#7EE7FF,#A78BFA)}' +
        '.ab-toggle input:checked + .ab-toggle__track::after{left:16px}' +
        '.ab-toggle input:focus-visible + .ab-toggle__track{box-shadow:0 0 0 4px rgba(126,231,255,.18)}',
      editableProps: [
        { key: 'label',   label: 'Label', type: 'text', default: 'Aktif' },
        { key: 'checked', label: 'Aktif awal', type: 'select', default: 'true', options: ['true','false'] }
      ]
    }
  ];

  /* ====================================================================
     CATEGORY: interactive (9)
     ==================================================================== */

  var INTERACTIVE = [
    {
      id: 'accordion',
      name: 'Accordion',
      category: 'interactive',
      icon: 'list-collapse',
      thumb: '<div style="padding:6px;height:100%;box-sizing:border-box;display:flex;flex-direction:column;gap:3px;justify-content:center">' +
        '<div style="height:12px;border-radius:4px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.10);display:flex;align-items:center;justify-content:space-between;padding:0 6px"><div style="height:2px;width:50%;background:rgba(245,245,247,.40);border-radius:2px"></div><div style="font-size:8px;color:rgba(245,245,247,.45)">▾</div></div>' +
        '<div style="height:9px;border-radius:4px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08)"></div>' +
        '<div style="height:9px;border-radius:4px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08)"></div>' +
      '</div>',
      defaultHTML:
        '<div class="ab-acc">' +
        '<details open><summary>Pertanyaan pertama</summary><div class="ab-acc__body">Jawaban pertama.</div></details>' +
        '<details><summary>Pertanyaan kedua</summary><div class="ab-acc__body">Jawaban kedua.</div></details>' +
        '<details><summary>Pertanyaan ketiga</summary><div class="ab-acc__body">Jawaban ketiga.</div></details>' +
        '</div>',
      defaultCSS:
        '.ab-acc{display:flex;flex-direction:column;gap:8px;margin:0 0 16px}' +
        '.ab-acc details{border-radius:14px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);overflow:hidden;transition:border-color .2s}' +
        '.ab-acc details[open]{border-color:rgba(255,255,255,.18)}' +
        '.ab-acc summary{list-style:none;cursor:pointer;padding:14px 18px;font:500 14px Inter,sans-serif;color:#F5F5F7;display:flex;align-items:center;justify-content:space-between}' +
        '.ab-acc summary::-webkit-details-marker{display:none}' +
        '.ab-acc summary::after{content:"▾";font-size:11px;color:rgba(245,245,247,.55);transition:transform .2s}' +
        '.ab-acc details[open] summary::after{transform:rotate(180deg)}' +
        '.ab-acc__body{padding:0 18px 16px;font:400 14px/1.6 Inter,sans-serif;color:rgba(245,245,247,.72)}',
      editableProps: [
        { key: 'items', label: 'Item (Judul|Isi)', type: 'text', default: 'Pertanyaan pertama|Jawaban pertama.\nPertanyaan kedua|Jawaban kedua.' }
      ]
    },
    {
      id: 'tabs',
      name: 'Tabs',
      category: 'interactive',
      icon: 'panels-top-left',
      thumb: '<div style="padding:6px;height:100%;box-sizing:border-box;display:flex;flex-direction:column;gap:4px"><div style="display:flex;gap:3px"><div style="padding:2px 6px;border-radius:4px;background:rgba(255,255,255,.08);font:500 7px Inter,sans-serif;color:rgba(245,245,247,.75)">Tab A</div><div style="padding:2px 6px;border-radius:4px;font:500 7px Inter,sans-serif;color:rgba(245,245,247,.45)">Tab B</div></div><div style="flex:1;border-radius:4px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08)"></div></div>',
      defaultHTML:
        '<div class="ab-tabs"><div class="ab-tabs__head" role="tablist">' +
        '<button class="ab-tabs__tab is-active" role="tab">Tab 1</button>' +
        '<button class="ab-tabs__tab" role="tab">Tab 2</button>' +
        '<button class="ab-tabs__tab" role="tab">Tab 3</button>' +
        '</div>' +
        '<div class="ab-tabs__body"><div class="ab-tabs__panel is-active" role="tabpanel">Konten untuk tab pertama.</div>' +
        '<div class="ab-tabs__panel" role="tabpanel">Konten tab kedua.</div>' +
        '<div class="ab-tabs__panel" role="tabpanel">Konten tab ketiga.</div></div></div>',
      defaultCSS:
        '.ab-tabs{margin:0 0 16px;border-radius:14px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);overflow:hidden}' +
        '.ab-tabs__head{display:flex;gap:4px;padding:6px;border-bottom:1px solid rgba(255,255,255,.06)}' +
        '.ab-tabs__tab{border:0;background:transparent;color:rgba(245,245,247,.55);font:500 13px Inter,sans-serif;padding:8px 14px;border-radius:8px;cursor:pointer;transition:background .15s,color .15s}' +
        '.ab-tabs__tab:hover{background:rgba(255,255,255,.05);color:#F5F5F7}' +
        '.ab-tabs__tab.is-active{background:rgba(255,255,255,.08);color:#F5F5F7}' +
        '.ab-tabs__body{padding:18px}' +
        '.ab-tabs__panel{display:none;font:400 14px/1.6 Inter,sans-serif;color:rgba(245,245,247,.78)}' +
        '.ab-tabs__panel.is-active{display:block}',
      editableProps: [
        { key: 'tabs', label: 'Tab (Judul|Isi)', type: 'text', default: 'Tab 1|Konten 1\nTab 2|Konten 2\nTab 3|Konten 3' }
      ]
    },
    {
      id: 'modal-trigger',
      name: 'Modal Trigger',
      category: 'interactive',
      icon: 'message-circle',
      thumb: '<div style="height:100%;display:flex;align-items:center;justify-content:center"><div style="padding:5px 10px;border-radius:999px;background:linear-gradient(120deg,#7EE7FF,#A78BFA);font:500 9px Inter,sans-serif;color:#020012">Buka</div></div>',
      defaultHTML:
        '<button type="button" class="ab-modal-trigger" aria-haspopup="dialog">Buka detail</button>' +
        '<div class="ab-modal-el" hidden role="dialog" aria-modal="true">' +
        '<div class="ab-modal-el__card"><h3>Judul Modal</h3><p>Isi modal di sini.</p>' +
        '<button type="button" class="ab-modal-el__close" aria-label="Tutup">Tutup</button></div></div>',
      defaultCSS:
        '.ab-modal-trigger{display:inline-flex;align-items:center;height:42px;padding:0 20px;border:0;border-radius:999px;background:linear-gradient(120deg,#7EE7FF,#A78BFA,#F0ABFC);color:#020012;font:500 14px Inter,sans-serif;cursor:pointer;transition:transform .15s,filter .15s}' +
        '.ab-modal-trigger:hover{transform:translateY(-1px);filter:brightness(1.06)}' +
        '.ab-modal-trigger:active{transform:scale(.97)}' +
        '.ab-modal-el{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(2,0,18,.55);backdrop-filter:blur(8px);z-index:100}' +
        '.ab-modal-el[hidden]{display:none}' +
        '.ab-modal-el__card{max-width:400px;padding:26px;border-radius:20px;background:rgba(10,10,32,.9);border:1px solid rgba(255,255,255,.12);text-align:center}' +
        '.ab-modal-el__card h3{margin:0 0 8px;font:600 18px Inter,sans-serif}' +
        '.ab-modal-el__card p{margin:0 0 16px;font:400 14px/1.6 Inter,sans-serif;color:rgba(245,245,247,.72)}' +
        '.ab-modal-el__close{padding:8px 16px;border-radius:999px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);color:#F5F5F7;font:500 13px Inter,sans-serif;cursor:pointer}',
      editableProps: [
        { key: 'label', label: 'Teks tombol',  type: 'text', default: 'Buka detail' },
        { key: 'title', label: 'Judul modal',  type: 'text', default: 'Judul Modal' },
        { key: 'text',  label: 'Isi modal',    type: 'text', default: 'Isi modal di sini.' }
      ]
    },
    {
      id: 'tooltip-trigger',
      name: 'Tooltip Trigger',
      category: 'interactive',
      icon: 'mouse-pointer',
      thumb: '<div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px"><div style="padding:2px 6px;border-radius:4px;background:rgba(10,10,32,.9);border:1px solid rgba(255,255,255,.10);font:500 7px Inter,sans-serif;color:rgba(245,245,247,.75)">Info</div><div style="width:16px;height:8px;border-radius:4px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14)"></div></div>',
      defaultHTML:
        '<span class="ab-tip"><span class="ab-tip__trigger">Arahkan kursor</span>' +
        '<span class="ab-tip__bubble" role="tooltip">Keterangan tambahan</span></span>',
      defaultCSS:
        '.ab-tip{position:relative;display:inline-block}' +
        '.ab-tip__trigger{padding:6px 12px;border-radius:8px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.10);font:500 13px Inter,sans-serif;color:#F5F5F7;cursor:help}' +
        '.ab-tip__bubble{position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%) translateY(4px);padding:6px 10px;border-radius:8px;background:rgba(10,10,32,.95);border:1px solid rgba(255,255,255,.10);font:400 12px Inter,sans-serif;color:#F5F5F7;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .15s,transform .15s}' +
        '.ab-tip:hover .ab-tip__bubble{opacity:1;transform:translateX(-50%) translateY(0)}',
      editableProps: [
        { key: 'trigger', label: 'Teks pemicu', type: 'text', default: 'Arahkan kursor' },
        { key: 'text',    label: 'Isi tooltip', type: 'text', default: 'Keterangan tambahan' }
      ]
    },
    {
      id: 'hotspot-image',
      name: 'Hotspot Image',
      category: 'interactive',
      icon: 'target',
      thumb: '<div style="padding:6px;height:100%;box-sizing:border-box;position:relative"><div style="width:100%;height:100%;border-radius:6px;background:linear-gradient(135deg,rgba(126,231,255,.16),rgba(167,139,250,.16));border:1px solid rgba(255,255,255,.08)"></div>' +
        '<div style="position:absolute;top:30%;left:32%;width:9px;height:9px;border-radius:50%;background:#7EE7FF;box-shadow:0 0 0 3px rgba(126,231,255,.28)"></div>' +
        '<div style="position:absolute;bottom:28%;right:30%;width:9px;height:9px;border-radius:50%;background:#F0ABFC;box-shadow:0 0 0 3px rgba(240,171,252,.28)"></div>' +
      '</div>',
      defaultHTML:
        '<div class="ab-hotspot"><div class="ab-hotspot__media" role="img" aria-label="Gambar interaktif"></div>' +
        '<button class="ab-hotspot__dot" style="left:30%;top:34%" aria-label="Poin 1" data-tip="Poin pertama"></button>' +
        '<button class="ab-hotspot__dot" style="left:66%;top:62%" aria-label="Poin 2" data-tip="Poin kedua"></button>' +
        '</div>',
      defaultCSS:
        '.ab-hotspot{position:relative;border-radius:14px;overflow:hidden;margin:0 0 16px;border:1px solid rgba(255,255,255,.08);aspect-ratio:16/10;background:rgba(255,255,255,.035)}' +
        '.ab-hotspot__media{position:absolute;inset:0;background:linear-gradient(135deg,rgba(126,231,255,.14),rgba(167,139,250,.14))}' +
        '.ab-hotspot__dot{position:absolute;width:18px;height:18px;border-radius:50%;border:2px solid rgba(10,10,32,.9);background:linear-gradient(120deg,#7EE7FF,#A78BFA);cursor:pointer;transform:translate(-50%,-50%);box-shadow:0 0 0 4px rgba(126,231,255,.20);transition:transform .15s}' +
        '.ab-hotspot__dot:hover{transform:translate(-50%,-50%) scale(1.15)}',
      editableProps: [
        { key: 'image', label: 'URL gambar', type: 'image', default: '' }
      ]
    },
    {
      id: 'drag-drop-answer',
      name: 'Drag-Drop Answer',
      category: 'interactive',
      icon: 'arrow-left-right',
      thumb: '<div style="padding:6px;height:100%;box-sizing:border-box;display:flex;flex-direction:column;gap:3px;justify-content:center">' +
        '<div style="display:flex;gap:4px"><div style="flex:1;height:12px;border-radius:4px;background:rgba(255,255,255,.05);border:1px dashed rgba(255,255,255,.20)"></div><div style="width:22px;height:12px;border-radius:4px;background:linear-gradient(120deg,#7EE7FF,#A78BFA)"></div></div>' +
        '<div style="display:flex;gap:4px"><div style="flex:1;height:12px;border-radius:4px;background:rgba(255,255,255,.05);border:1px dashed rgba(255,255,255,.20)"></div><div style="width:22px;height:12px;border-radius:4px;background:linear-gradient(120deg,#7EE7FF,#A78BFA)"></div></div>' +
      '</div>',
      defaultHTML:
        '<div class="ab-dda"><div class="ab-dda__row"><span class="ab-dda__slot" data-answer="A">Letakkan di sini</span><span class="ab-dda__chip">A</span></div>' +
        '<div class="ab-dda__row"><span class="ab-dda__slot" data-answer="B">Letakkan di sini</span><span class="ab-dda__chip">B</span></div>' +
        '</div>',
      defaultCSS:
        '.ab-dda{display:flex;flex-direction:column;gap:10px;margin:0 0 16px}' +
        '.ab-dda__row{display:flex;align-items:center;gap:10px}' +
        '.ab-dda__slot{flex:1;padding:12px 16px;border-radius:12px;border:1px dashed rgba(255,255,255,.22);background:rgba(255,255,255,.03);font:400 13px Inter,sans-serif;color:rgba(245,245,247,.45);transition:border-color .15s,background .15s}' +
        '.ab-dda__slot.is-over{border-color:rgba(126,231,255,.55);background:rgba(126,231,255,.08)}' +
        '.ab-dda__chip{padding:8px 16px;border-radius:10px;background:linear-gradient(120deg,rgba(126,231,255,.32),rgba(167,139,250,.32));border:1px solid rgba(255,255,255,.14);color:#F5F5F7;font:600 13px Inter,sans-serif;cursor:grab}',
      editableProps: [
        { key: 'pairs', label: 'Pasangan (kiri|kanan)', type: 'text', default: 'Soal A|A\nSoal B|B' }
      ]
    },
    {
      id: 'before-after-slider',
      name: 'Before-After Slider',
      category: 'interactive',
      icon: 'arrow-left-right',
      thumb: '<div style="padding:6px;height:100%;box-sizing:border-box;position:relative"><div style="width:100%;height:100%;border-radius:6px;background:linear-gradient(90deg,rgba(126,231,255,.24) 0 50%,rgba(253,230,138,.24) 50% 100%);border:1px solid rgba(255,255,255,.08)"></div><div style="position:absolute;top:12%;bottom:12%;left:50%;width:2px;background:rgba(245,245,247,.75);transform:translateX(-50%)"></div></div>',
      defaultHTML:
        '<div class="ab-ba"><div class="ab-ba__before"><span>Sebelum</span></div>' +
        '<div class="ab-ba__after"><span>Sesudah</span></div>' +
        '<input type="range" class="ab-ba__range" min="0" max="100" value="50" aria-label="Bandingkan"></div>',
      defaultCSS:
        '.ab-ba{position:relative;border-radius:14px;overflow:hidden;margin:0 0 16px;aspect-ratio:16/9;border:1px solid rgba(255,255,255,.08);user-select:none}' +
        '.ab-ba__before,.ab-ba__after{position:absolute;inset:0;display:flex;align-items:flex-end;padding:14px 18px;color:#F5F5F7;font:500 12px Inter,sans-serif;letter-spacing:.08em;text-transform:uppercase}' +
        '.ab-ba__before{background:linear-gradient(135deg,rgba(126,231,255,.24),rgba(167,139,250,.24))}' +
        '.ab-ba__after{background:linear-gradient(135deg,rgba(240,171,252,.24),rgba(253,230,138,.24));clip-path:inset(0 0 0 50%)}' +
        '.ab-ba__range{position:absolute;inset:0;width:100%;height:100%;margin:0;-webkit-appearance:none;appearance:none;background:transparent;cursor:ew-resize}' +
        '.ab-ba__range::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:2px;height:100%;background:#F5F5F7;border:0;box-shadow:0 0 12px rgba(0,0,0,.35)}' +
        '.ab-ba__range::-moz-range-thumb{width:2px;height:100%;background:#F5F5F7;border:0}',
      editableProps: [
        { key: 'beforeLabel', label: 'Label sebelum', type: 'text', default: 'Sebelum' },
        { key: 'afterLabel',  label: 'Label sesudah', type: 'text', default: 'Sesudah' }
      ]
    },
    {
      id: 'quiz-single',
      name: 'Quiz Single',
      category: 'interactive',
      icon: 'help-circle',
      thumb: '<div style="padding:6px;height:100%;box-sizing:border-box;display:flex;flex-direction:column;gap:3px;justify-content:center">' +
        '<div style="height:3px;width:80%;background:rgba(245,245,247,.55);border-radius:2px"></div>' +
        '<div style="display:flex;align-items:center;gap:4px"><div style="width:8px;height:8px;border-radius:50%;border:1.5px solid #A78BFA;background:radial-gradient(circle,#A78BFA 0 30%,transparent 30%)"></div><div style="height:2px;width:52%;background:rgba(245,245,247,.30);border-radius:2px"></div></div>' +
        '<div style="display:flex;align-items:center;gap:4px"><div style="width:8px;height:8px;border-radius:50%;border:1px solid rgba(255,255,255,.20)"></div><div style="height:2px;width:44%;background:rgba(245,245,247,.30);border-radius:2px"></div></div>' +
      '</div>',
      defaultHTML:
        '<fieldset class="ab-qs"><legend class="ab-qs__q">Pertanyaan pilihan tunggal?</legend>' +
        '<label class="ab-qs__opt"><input type="radio" name="qs" checked><span class="ab-qs__mark"></span>Jawaban A</label>' +
        '<label class="ab-qs__opt"><input type="radio" name="qs"><span class="ab-qs__mark"></span>Jawaban B</label>' +
        '<label class="ab-qs__opt"><input type="radio" name="qs"><span class="ab-qs__mark"></span>Jawaban C</label>' +
        '</fieldset>',
      defaultCSS:
        '.ab-qs{border:0;padding:20px;margin:0 0 16px;border-radius:14px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);display:flex;flex-direction:column;gap:10px}' +
        '.ab-qs__q{font:600 15px Inter,sans-serif;color:#F5F5F7;padding:0;margin:0 0 4px}' +
        '.ab-qs__opt{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);cursor:pointer;font:400 14px Inter,sans-serif;color:#F5F5F7;transition:background .15s,border-color .15s}' +
        '.ab-qs__opt:hover{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.16)}' +
        '.ab-qs__opt input{position:absolute;opacity:0;pointer-events:none}' +
        '.ab-qs__mark{width:16px;height:16px;border-radius:50%;border:1px solid rgba(255,255,255,.22);position:relative;flex-shrink:0}' +
        '.ab-qs__opt input:checked + .ab-qs__mark{border-color:rgba(167,139,250,.75);background:rgba(167,139,250,.15)}' +
        '.ab-qs__opt input:checked + .ab-qs__mark::after{content:"";position:absolute;inset:3px;border-radius:50%;background:linear-gradient(120deg,#7EE7FF,#A78BFA)}',
      editableProps: [
        { key: 'question', label: 'Pertanyaan', type: 'text', default: 'Pertanyaan pilihan tunggal?' },
        { key: 'options',  label: 'Opsi (satu per baris)', type: 'text', default: 'Jawaban A\nJawaban B\nJawaban C' }
      ]
    },
    {
      id: 'quiz-multi',
      name: 'Quiz Multi',
      category: 'interactive',
      icon: 'check-check',
      thumb: '<div style="padding:6px;height:100%;box-sizing:border-box;display:flex;flex-direction:column;gap:3px;justify-content:center">' +
        '<div style="height:3px;width:80%;background:rgba(245,245,247,.55);border-radius:2px"></div>' +
        '<div style="display:flex;align-items:center;gap:4px"><div style="width:8px;height:8px;border-radius:2px;background:linear-gradient(120deg,#7EE7FF,#A78BFA);display:flex;align-items:center;justify-content:center"><div style="width:3px;height:2px;border-left:1px solid #020012;border-bottom:1px solid #020012;transform:rotate(-45deg)"></div></div><div style="height:2px;width:52%;background:rgba(245,245,247,.30);border-radius:2px"></div></div>' +
        '<div style="display:flex;align-items:center;gap:4px"><div style="width:8px;height:8px;border-radius:2px;border:1px solid rgba(255,255,255,.22)"></div><div style="height:2px;width:44%;background:rgba(245,245,247,.30);border-radius:2px"></div></div>' +
      '</div>',
      defaultHTML:
        '<fieldset class="ab-qm"><legend class="ab-qm__q">Pilih semua yang benar.</legend>' +
        '<label class="ab-qm__opt"><input type="checkbox" checked><span class="ab-qm__mark"></span>Pernyataan 1</label>' +
        '<label class="ab-qm__opt"><input type="checkbox"><span class="ab-qm__mark"></span>Pernyataan 2</label>' +
        '<label class="ab-qm__opt"><input type="checkbox" checked><span class="ab-qm__mark"></span>Pernyataan 3</label>' +
        '</fieldset>',
      defaultCSS:
        '.ab-qm{border:0;padding:20px;margin:0 0 16px;border-radius:14px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);display:flex;flex-direction:column;gap:10px}' +
        '.ab-qm__q{font:600 15px Inter,sans-serif;color:#F5F5F7;padding:0;margin:0 0 4px}' +
        '.ab-qm__opt{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);cursor:pointer;font:400 14px Inter,sans-serif;color:#F5F5F7;transition:background .15s,border-color .15s}' +
        '.ab-qm__opt:hover{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.16)}' +
        '.ab-qm__opt input{position:absolute;opacity:0;pointer-events:none}' +
        '.ab-qm__mark{width:16px;height:16px;border-radius:5px;border:1px solid rgba(255,255,255,.22);position:relative;flex-shrink:0}' +
        '.ab-qm__opt input:checked + .ab-qm__mark{background:linear-gradient(120deg,rgba(126,231,255,.35),rgba(167,139,250,.35));border-color:rgba(255,255,255,.28)}' +
        '.ab-qm__opt input:checked + .ab-qm__mark::after{content:"";position:absolute;left:4px;top:5px;width:7px;height:3px;border-left:2px solid #F5F5F7;border-bottom:2px solid #F5F5F7;transform:rotate(-45deg)}',
      editableProps: [
        { key: 'question', label: 'Pertanyaan', type: 'text', default: 'Pilih semua yang benar.' },
        { key: 'options',  label: 'Opsi (satu per baris)', type: 'text', default: 'Pernyataan 1\nPernyataan 2\nPernyataan 3' }
      ]
    }
  ];

  /* ====================================================================
     CATEGORY: layout (4)
     ==================================================================== */

  var LAYOUT = [
    {
      id: 'hero-section',
      name: 'Hero Section',
      category: 'layout',
      icon: 'layout-template',
      thumb: '<div style="padding:6px;height:100%;box-sizing:border-box;display:flex;flex-direction:column;gap:4px;align-items:center;justify-content:center"><div style="height:6px;width:60%;background:rgba(245,245,247,.55);border-radius:3px"></div><div style="height:3px;width:80%;background:rgba(245,245,247,.20);border-radius:2px"></div><div style="height:3px;width:64%;background:rgba(245,245,247,.20);border-radius:2px"></div><div style="margin-top:3px;padding:3px 8px;border-radius:999px;background:linear-gradient(120deg,#7EE7FF,#A78BFA)"></div></div>',
      defaultHTML:
        '<section class="ab-hero-el"><div class="ab-hero-el__inner">' +
        '<p class="ab-hero-el__eyebrow">Selamat Datang</p>' +
        '<h1>Judul Hero</h1><p>Subjudul singkat yang menjelaskan tujuan halaman ini.</p>' +
        '<button class="ab-hero-el__btn">Mulai Sekarang</button>' +
        '</div></section>',
      defaultCSS:
        '.ab-hero-el{padding:80px 32px;text-align:center;border-radius:20px;background:radial-gradient(ellipse at 50% 0%,rgba(126,231,255,.10),transparent 60%),radial-gradient(ellipse at 50% 100%,rgba(167,139,250,.08),transparent 60%);border:1px solid rgba(255,255,255,.08);margin:0 0 16px}' +
        '.ab-hero-el__inner{max-width:640px;margin:0 auto}' +
        '.ab-hero-el__eyebrow{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:rgba(245,245,247,.55);margin:0 0 12px}' +
        '.ab-hero-el h1{font:600 40px/1.15 Inter,sans-serif;letter-spacing:-.03em;color:#F5F5F7;margin:0 0 14px}' +
        '.ab-hero-el p{font:400 16px/1.6 Inter,sans-serif;color:rgba(245,245,247,.72);margin:0 0 24px}' +
        '.ab-hero-el__btn{display:inline-flex;align-items:center;height:46px;padding:0 24px;border:0;border-radius:999px;background:linear-gradient(120deg,#7EE7FF,#A78BFA,#F0ABFC);color:#020012;font:500 14px Inter,sans-serif;cursor:pointer;transition:transform .15s,filter .15s}' +
        '.ab-hero-el__btn:hover{transform:translateY(-1px);filter:brightness(1.06)}' +
        '.ab-hero-el__btn:active{transform:scale(.97)}',
      editableProps: [
        { key: 'eyebrow',  label: 'Eyebrow',  type: 'text', default: 'Selamat Datang' },
        { key: 'title',    label: 'Judul',    type: 'text', default: 'Judul Hero' },
        { key: 'subtitle', label: 'Subjudul', type: 'text', default: 'Subjudul singkat.' },
        { key: 'cta',      label: 'Tombol',   type: 'text', default: 'Mulai Sekarang' }
      ]
    },
    {
      id: 'two-column',
      name: 'Two Column',
      category: 'layout',
      icon: 'columns-2',
      thumb: '<div style="padding:6px;height:100%;box-sizing:border-box;display:grid;grid-template-columns:1fr 1fr;gap:4px"><div style="border-radius:4px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center"><div style="height:2px;width:60%;background:rgba(245,245,247,.30);border-radius:2px"></div></div><div style="border-radius:4px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center"><div style="height:2px;width:60%;background:rgba(245,245,247,.30);border-radius:2px"></div></div></div>',
      defaultHTML:
        '<div class="ab-cols-2">' +
        '<div class="ab-cols-2__col"><h3>Kolom Kiri</h3><p>Isi kolom kiri.</p></div>' +
        '<div class="ab-cols-2__col"><h3>Kolom Kanan</h3><p>Isi kolom kanan.</p></div>' +
        '</div>',
      defaultCSS:
        '.ab-cols-2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:0 0 16px}' +
        '.ab-cols-2__col{padding:22px;border-radius:16px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08)}' +
        '.ab-cols-2__col h3{margin:0 0 8px;font:600 16px Inter,sans-serif;letter-spacing:-.01em}' +
        '.ab-cols-2__col p{margin:0;font:400 14px/1.6 Inter,sans-serif;color:rgba(245,245,247,.72)}',
      editableProps: [
        { key: 'leftTitle',  label: 'Judul kiri', type: 'text', default: 'Kolom Kiri' },
        { key: 'leftText',   label: 'Isi kiri',   type: 'text', default: 'Isi kolom kiri.' },
        { key: 'rightTitle', label: 'Judul kanan', type: 'text', default: 'Kolom Kanan' },
        { key: 'rightText',  label: 'Isi kanan',   type: 'text', default: 'Isi kolom kanan.' }
      ]
    },
    {
      id: 'three-column',
      name: 'Three Column',
      category: 'layout',
      icon: 'columns-3',
      thumb: '<div style="padding:6px;height:100%;box-sizing:border-box;display:grid;grid-template-columns:1fr 1fr 1fr;gap:3px">' +
        '<div style="border-radius:4px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08)"></div>' +
        '<div style="border-radius:4px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08)"></div>' +
        '<div style="border-radius:4px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08)"></div>' +
      '</div>',
      defaultHTML:
        '<div class="ab-cols-3">' +
        '<div class="ab-cols-3__col"><h3>Kolom 1</h3><p>Isi kolom pertama.</p></div>' +
        '<div class="ab-cols-3__col"><h3>Kolom 2</h3><p>Isi kolom kedua.</p></div>' +
        '<div class="ab-cols-3__col"><h3>Kolom 3</h3><p>Isi kolom ketiga.</p></div>' +
        '</div>',
      defaultCSS:
        '.ab-cols-3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:0 0 16px}' +
        '.ab-cols-3__col{padding:20px;border-radius:16px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08)}' +
        '.ab-cols-3__col h3{margin:0 0 6px;font:600 15px Inter,sans-serif}' +
        '.ab-cols-3__col p{margin:0;font:400 13px/1.6 Inter,sans-serif;color:rgba(245,245,247,.72)}',
      editableProps: [
        { key: 'title1', label: 'Judul 1', type: 'text', default: 'Kolom 1' },
        { key: 'title2', label: 'Judul 2', type: 'text', default: 'Kolom 2' },
        { key: 'title3', label: 'Judul 3', type: 'text', default: 'Kolom 3' }
      ]
    },
    {
      id: 'callout',
      name: 'Callout',
      category: 'layout',
      icon: 'alert-circle',
      thumb: '<div style="padding:6px;height:100%;box-sizing:border-box;display:flex;align-items:center"><div style="width:100%;padding:6px;border-radius:6px;background:linear-gradient(135deg,rgba(126,231,255,.12),rgba(167,139,250,.12));border:1px solid rgba(126,231,255,.30);display:flex;gap:5px;align-items:center"><div style="width:10px;height:10px;border-radius:50%;background:rgba(126,231,255,.55)"></div><div style="flex:1;display:flex;flex-direction:column;gap:2px"><div style="height:2px;width:70%;background:rgba(245,245,247,.45);border-radius:2px"></div><div style="height:2px;width:50%;background:rgba(245,245,247,.20);border-radius:2px"></div></div></div></div>',
      defaultHTML:
        '<div class="ab-callout"><span class="ab-callout__icon"><i data-lucide="alert-circle"></i></span>' +
        '<div class="ab-callout__body"><h3>Perhatian</h3><p>Informasi penting yang perlu diperhatikan.</p></div></div>',
      defaultCSS:
        '.ab-callout{display:flex;gap:14px;padding:18px 20px;border-radius:14px;background:linear-gradient(135deg,rgba(126,231,255,.10),rgba(167,139,250,.10));border:1px solid rgba(126,231,255,.30);margin:0 0 16px}' +
        '.ab-callout__icon{width:32px;height:32px;border-radius:10px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.10);display:inline-flex;align-items:center;justify-content:center;color:#F5F5F7;flex-shrink:0}' +
        '.ab-callout__body h3{margin:0 0 4px;font:600 14px Inter,sans-serif;letter-spacing:-.005em}' +
        '.ab-callout__body p{margin:0;font:400 13px/1.55 Inter,sans-serif;color:rgba(245,245,247,.75)}',
      editableProps: [
        { key: 'title', label: 'Judul',  type: 'text', default: 'Perhatian' },
        { key: 'text',  label: 'Isi',    type: 'text', default: 'Informasi penting.' },
        { key: 'tone',  label: 'Nuansa', type: 'select', default: 'info', options: ['info','warning','success'] }
      ]
    }
  ];

  /* ====================================================================
     CATEGORY: navigation (3)
     ==================================================================== */

  var NAVIGATION = [
    {
      id: 'breadcrumb',
      name: 'Breadcrumb',
      category: 'navigation',
      icon: 'navigation',
      thumb: '<div style="padding:6px;height:100%;box-sizing:border-box;display:flex;align-items:center;justify-content:center"><div style="font:500 9px Inter,sans-serif;color:rgba(245,245,247,.55);display:flex;gap:4px;align-items:center">Beranda<span style="opacity:.4">›</span>Materi<span style="opacity:.4">›</span><span style="color:rgba(245,245,247,.90)">Sel</span></div></div>',
      defaultHTML:
        '<nav class="ab-crumb" aria-label="Breadcrumb">' +
        '<a href="#">Beranda</a><span class="ab-crumb__sep">›</span>' +
        '<a href="#">Materi</a><span class="ab-crumb__sep">›</span>' +
        '<span class="ab-crumb__current">Struktur Sel</span></nav>',
      defaultCSS:
        '.ab-crumb{display:flex;flex-wrap:wrap;align-items:center;gap:8px;font:500 13px Inter,sans-serif;margin:0 0 16px}' +
        '.ab-crumb a{color:rgba(245,245,247,.55);text-decoration:none;transition:color .15s}' +
        '.ab-crumb a:hover{color:#F5F5F7}' +
        '.ab-crumb__sep{color:rgba(245,245,247,.32)}' +
        '.ab-crumb__current{color:#F5F5F7}',
      editableProps: [
        { key: 'items', label: 'Item (satu per baris)', type: 'text', default: 'Beranda\nMateri\nStruktur Sel' }
      ]
    },
    {
      id: 'progress-bar',
      name: 'Progress Bar',
      category: 'navigation',
      icon: 'gauge',
      thumb: '<div style="padding:6px;height:100%;box-sizing:border-box;display:flex;flex-direction:column;gap:3px;justify-content:center"><div style="height:5px;border-radius:999px;background:rgba(255,255,255,.08);overflow:hidden"><div style="height:100%;width:62%;background:linear-gradient(90deg,#7EE7FF,#A78BFA,#F0ABFC);border-radius:999px"></div></div><div style="height:2px;width:30%;background:rgba(245,245,247,.30);border-radius:2px"></div></div>',
      defaultHTML:
        '<div class="ab-progress"><div class="ab-progress__track"><div class="ab-progress__fill" style="width:62%"></div></div>' +
        '<p class="ab-progress__label">62% selesai</p></div>',
      defaultCSS:
        '.ab-progress{margin:0 0 16px}' +
        '.ab-progress__track{height:8px;border-radius:999px;background:rgba(255,255,255,.08);overflow:hidden}' +
        '.ab-progress__fill{height:100%;background:linear-gradient(90deg,#7EE7FF,#A78BFA,#F0ABFC);border-radius:999px;transition:width .5s cubic-bezier(.22,1,.36,1)}' +
        '.ab-progress__label{margin:8px 0 0;font:500 12px Inter,sans-serif;color:rgba(245,245,247,.55)}',
      editableProps: [
        { key: 'value', label: 'Nilai (%)', type: 'number', default: 62 }
      ]
    },
    {
      id: 'step-indicator',
      name: 'Step Indicator',
      category: 'navigation',
      icon: 'list-checks',
      thumb: '<div style="padding:6px;height:100%;box-sizing:border-box;display:flex;align-items:center;gap:3px"><div style="width:12px;height:12px;border-radius:50%;background:linear-gradient(120deg,#7EE7FF,#A78BFA);display:flex;align-items:center;justify-content:center;font:700 7px Inter,sans-serif;color:#020012">1</div><div style="flex:1;height:1px;background:rgba(245,245,247,.20)"></div><div style="width:12px;height:12px;border-radius:50%;border:1px solid rgba(255,255,255,.20);display:flex;align-items:center;justify-content:center;font:700 7px Inter,sans-serif;color:rgba(245,245,247,.45)">2</div><div style="flex:1;height:1px;background:rgba(245,245,247,.20)"></div><div style="width:12px;height:12px;border-radius:50%;border:1px solid rgba(255,255,255,.20);display:flex;align-items:center;justify-content:center;font:700 7px Inter,sans-serif;color:rgba(245,245,247,.45)">3</div></div>',
      defaultHTML:
        '<ol class="ab-steps">' +
        '<li class="ab-steps__item is-active"><span class="ab-steps__num">1</span><span class="ab-steps__label">Persiapan</span></li>' +
        '<li class="ab-steps__item"><span class="ab-steps__num">2</span><span class="ab-steps__label">Pelaksanaan</span></li>' +
        '<li class="ab-steps__item"><span class="ab-steps__num">3</span><span class="ab-steps__label">Evaluasi</span></li>' +
        '</ol>',
      defaultCSS:
        '.ab-steps{display:flex;list-style:none;padding:0;margin:0 0 16px;gap:8px;align-items:center}' +
        '.ab-steps__item{display:flex;align-items:center;gap:10px;flex:1;min-width:0}' +
        '.ab-steps__item:not(:last-child)::after{content:"";flex:1;height:1px;background:rgba(255,255,255,.10)}' +
        '.ab-steps__num{width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.14);display:inline-flex;align-items:center;justify-content:center;font:600 12px Inter,sans-serif;color:rgba(245,245,247,.55);flex-shrink:0}' +
        '.ab-steps__item.is-active .ab-steps__num{background:linear-gradient(120deg,#7EE7FF,#A78BFA);color:#020012;border-color:transparent}' +
        '.ab-steps__label{font:500 13px Inter,sans-serif;color:rgba(245,245,247,.55);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
        '.ab-steps__item.is-active .ab-steps__label{color:#F5F5F7}',
      editableProps: [
        { key: 'steps',   label: 'Langkah (satu per baris)', type: 'text', default: 'Persiapan\nPelaksanaan\nEvaluasi' },
        { key: 'current', label: 'Langkah aktif', type: 'number', default: 1 }
      ]
    }
  ];

  /* ====================================================================
     Combine
     ==================================================================== */

  var ALL = []
    .concat(TEXT, MEDIA, CARD, BUTTON, FORM, INTERACTIVE, LAYOUT, NAVIGATION);

  var CATEGORY_META = [
    { key: 'text',        label: 'Teks',       icon: 'type' },
    { key: 'media',       label: 'Media',      icon: 'image' },
    { key: 'card',        label: 'Kartu',      icon: 'square' },
    { key: 'button',      label: 'Tombol',     icon: 'circle' },
    { key: 'form',        label: 'Form',       icon: 'text-cursor-input' },
    { key: 'interactive', label: 'Interaktif', icon: 'target' },
    { key: 'layout',      label: 'Layout',     icon: 'columns-2' },
    { key: 'navigation',  label: 'Navigasi',   icon: 'navigation' }
  ];

  /* ====================================================================
     Shared CSS injected into every preview document before element CSS
     ==================================================================== */

  var SHARED_CSS =
    '.ab-icon{display:inline-flex;align-items:center;justify-content:center;width:1em;height:1em;vertical-align:middle}' +
    '.ab-icon > svg{width:100%;height:100%;display:block}' +
    'img,svg,video,iframe{max-width:100%;display:block}' +
    'button,input,select,textarea{font-family:inherit}' +
    'button{cursor:pointer}' +
    'ul,ol{padding-left:20px}';

  /* ====================================================================
     Public API
     ==================================================================== */

  Abook.Elements = {
    list: ALL,
    categories: CATEGORY_META,
    sharedCSS: SHARED_CSS,
    get: function (id) {
      for (var i = 0; i < ALL.length; i++) {
        if (ALL[i].id === id) return ALL[i];
      }
      return null;
    },
    byCategory: function (key) {
      return ALL.filter(function (el) { return el.category === key; });
    }
  };
})();