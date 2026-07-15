/*
 * KANAL SAYFASI ÜRETİCİ
 * Her kanal için kanal/<slug>.html üretir + kanallar.html + sitemap.xml.
 * Çalıştır:  node tools/gen-kanal.js
 */
const fs = require("fs");
const path = require("path");
const { KANALLAR } = require("../js/channels.js");

const SITE = "https://canlitvkanallari.site";
const ROOT = path.join(__dirname, "..");
const KANAL_DIR = path.join(ROOT, "kanal");

// ---- Türkçe uyumlu slug ----
function slug(s) {
  const map = { ç:"c", ğ:"g", ı:"i", ö:"o", ş:"s", ü:"u", İ:"i", Ç:"c", Ğ:"g", Ö:"o", Ş:"s", Ü:"u" };
  return s
    .replace(/[çğıöşüİÇĞÖŞÜ]/g, (c) => map[c] || c)
    .toLowerCase()
    .replace(/['".,]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ---- Kanala özel açıklamalar (öne çıkanlar) ----
const OZEL = {
  "TRT 1": "TRT 1, Türkiye'nin köklü ve en çok izlenen ulusal kanallarından biridir. Yerli diziler, filmler, spor karşılaşmaları ve haber programlarıyla her yaştan izleyiciye hitap eder.",
  "atv": "atv; sevilen yerli dizileri, yarışma programları, filmler ve haber bültenleriyle Türkiye'nin en popüler ulusal kanallarındandır.",
  "Kanal D": "Kanal D, iddialı yerli dizileri, magazin ve eğlence programları ile haber yayınlarıyla milyonların tercih ettiği bir ulusal kanaldır.",
  "Show TV": "Show TV, reyting rekorları kıran dizileri, yarışma ve eğlence programlarıyla öne çıkan ulusal bir televizyon kanalıdır.",
  "Star TV": "Star TV, popüler dizileri, filmleri ve eğlence içerikleriyle geniş bir izleyici kitlesine ulaşan ulusal kanaldır.",
  "NOW": "NOW (eski adıyla FOX TV), dizileri, ana haber bülteni ve eğlence programlarıyla dikkat çeken ulusal bir kanaldır.",
  "TV8": "TV8, MasterChef ve Survivor gibi büyük yarışma programlarıyla tanınan, eğlence odaklı ulusal bir kanaldır.",
  "TRT Haber": "TRT Haber, yurt içi ve dünya gündemini son dakika gelişmeleriyle, tarafsız haber anlayışıyla 24 saat kesintisiz ekrana taşır.",
  "NTV": "NTV, güncel haberler, son dakika gelişmeleri ve analiz programlarıyla Türkiye'nin köklü haber kanallarından biridir.",
  "CNN Türk": "CNN Türk, canlı yayın, son dakika haberleri ve gündem programlarıyla güncel gelişmeleri anlık aktaran bir haber kanalıdır.",
  "Habertürk": "Habertürk, siyaset, ekonomi ve dünya gündemini canlı yayın ve tartışma programlarıyla izleyiciye ulaştırır.",
  "beIN Sports 1": "beIN Sports 1, Süper Lig başta olmak üzere Türkiye ve dünyadan en önemli futbol karşılaşmalarını canlı yayınlayan öncü spor kanalıdır. İzlemek için beIN abonelik gerekir.",
  "TRT Spor": "TRT Spor, futbol, basketbol, voleybol ve daha birçok branştan canlı karşılaşmaları ve spor haberlerini ücretsiz ekranlara taşır.",
  "TRT Çocuk": "TRT Çocuk, çocuklara yönelik güvenli, eğitici ve eğlenceli çizgi filmler ile programlar yayınlayan ücretsiz çocuk kanalıdır.",
  "TRT Belgesel": "TRT Belgesel, doğa, tarih, bilim ve kültür konulu nitelikli belgesellerle bilgi dolu bir yayın akışı sunar.",
  "Kral Pop": "Kral Pop, Türkçe pop müziğin en yeni kliplerini ve müzik listelerini ekranlara taşıyan popüler bir müzik kanalıdır.",
  "Diyanet TV": "Diyanet TV, dini sohbetler, Kur'an-ı Kerim tilavetleri ve manevi içerikli programlar yayınlayan bir kanaldır.",
};

// ---- Kategoriye göre şablon açıklama ----
function kategoriMetni(ad, kat, ucretli) {
  const abonelik = ucretli ? ` ${ad} yayınını izlemek için ilgili sağlayıcıya abonelik gerekir.` : "";
  switch (kat) {
    case "Ulusal": return `${ad}, dizi, film, eğlence ve haber programlarıyla yayın yapan ulusal bir televizyon kanalıdır. ${ad} canlı yayınını resmi kaynağından tek tıkla izleyebilirsiniz.`;
    case "Haber": return `${ad}, güncel haberleri, son dakika gelişmelerini ve gündem programlarını canlı olarak ekrana taşıyan bir haber kanalıdır. Gündemi anlık takip etmek için ${ad} canlı yayınını izleyin.`;
    case "Ekonomi": return `${ad}, borsa, döviz, altın ve ekonomi dünyasındaki gelişmeleri canlı olarak aktaran bir ekonomi kanalıdır. Piyasaları anlık takip etmek için ${ad} canlı yayınını izleyin.`;
    case "Spor": return `${ad}, canlı maçlar, karşılaşmalar ve spor haberleriyle dolu bir spor kanalıdır.${abonelik} ${ad} yayınını resmi sayfasından takip edebilirsiniz.`;
    case "Belgesel": return `${ad}, doğa, bilim, tarih ve keşif konulu belgesellerle bilgi dolu içerikler sunan bir kanaldır.${abonelik} ${ad} canlı yayınını izleyin.`;
    case "Çocuk": return `${ad}, çocuklara yönelik çizgi filmler ve eğitici programlar yayınlayan bir çocuk kanalıdır.${abonelik} ${ad} canlı yayınını izleyin.`;
    case "Müzik": return `${ad}, en yeni klipler ve müzik programlarıyla yayın yapan bir müzik kanalıdır. ${ad} canlı yayınını izleyin.`;
    case "Dini": return `${ad}, dini sohbetler, Kur'an-ı Kerim ve manevi içerikli programlar yayınlayan bir kanaldır. ${ad} canlı yayınını izleyin.`;
    default: return `${ad} canlı yayınını resmi kaynağından izleyebilirsiniz.`;
  }
}

function aciklama(k) {
  return OZEL[k.ad] || kategoriMetni(k.ad, k.kategori, k.ucretli);
}

// ---- Logo URL'sini kanal sayfasından erişilebilir yap (alt klasör için ../) ----
function logoUrl(logo) {
  if (!logo) return "";
  if (/^https?:\/\//.test(logo)) return logo;
  return "../" + logo; // assets/logos/... -> ../assets/logos/...
}

// ---- Tek kanal sayfası HTML ----
function kanalSayfasi(k, digerleri) {
  const s = slug(k.ad);
  const desc = aciklama(k);
  const linkVar = k.url && k.url !== "#";
  const btnText = k.ucretli ? (linkVar ? "ABONELİK SAYFASI" : "ABONELİK GEREKLİ") : (linkVar ? "CANLI İZLE" : "LİNK YAKINDA");
  const btnKey = k.ucretli ? (linkVar ? "sub_page" : "sub_required") : (linkVar ? "watch_live" : "link_soon");
  const logo = logoUrl(k.logo);
  const rozet = k.ucretli ? `<span class="paid-tag" style="position:static" data-i18n="paid_tag">🔒 ABONELİK</span>` : "";

  // Aynı kategoriden 6 kanal (iç bağlantı → SEO)
  const benzer = digerleri
    .filter((x) => x.kategori === k.kategori && x.ad !== k.ad)
    .slice(0, 8)
    .map((x) => `<a href="${slug(x.ad)}.html">${x.ad}</a>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${k.ad} Canlı İzle — Kesintisiz Yayın | CanlıTV</title>
  <meta name="description" content="${k.ad} canlı yayın! ${desc.slice(0, 120)}" />
  <link rel="canonical" href="${SITE}/kanal/${s}.html" />
  <link rel="icon" href="../assets/favicon.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../css/style.css" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${k.ad} Canlı İzle | CanlıTV" />
  <meta property="og:description" content="${k.ad} canlı yayınını tek tıkla izle." />
  <meta property="og:url" content="${SITE}/kanal/${s}.html" />
  <meta property="og:image" content="${SITE}/assets/og-image.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="${SITE}/assets/og-image.png" />
  <script>
    if (localStorage.getItem("canlitv_tema") === "light")
      document.documentElement.setAttribute("data-theme", "light");
  </script>
  <script src="../js/i18n.js"></script>
</head>
<body>
  <div class="grain" aria-hidden="true"></div>
  <nav class="nav">
    <a href="../index.html" class="nav-brand">
      <svg class="brand-mark" viewBox="0 0 44 44" fill="none" aria-hidden="true">
        <rect class="bm-box" x="2.5" y="2.5" width="39" height="39" rx="11" stroke-width="2.5" />
        <path class="bm-accent" d="M18 14.5 L30.5 22 L18 29.5 Z" />
        <circle class="bm-accent bm-dot" cx="33.5" cy="11" r="3.6" />
      </svg>
      <span class="brand-word">CANLI<span>TV</span></span>
    </a>
    <div class="nav-right">
      <div class="lang-wrap">
        <svg class="lang-globe" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" />
          <path d="M3 12h18" stroke="currentColor" stroke-width="1.8" />
          <ellipse cx="12" cy="12" rx="4" ry="9" stroke="currentColor" stroke-width="1.8" />
        </svg>
        <select id="langSelect" class="lang-select" aria-label="Dil seç" title="Dil seç"></select>
      </div>
      <a href="../index.html" class="nav-fav" style="text-decoration:none" data-i18n="back_home">← ANA SAYFA</a>
    </div>
  </nav>

  <main class="page kanal-page">
    <div class="kanal-head">
      ${logo ? `<div class="kanal-logo"><img src="${logo}" alt="${k.ad} logo" loading="lazy" /></div>` : ""}
      <div>
        <div class="kanal-cat"><span data-i18n-cat="${k.kategori}">${k.kategori}</span> ${rozet}</div>
        <h1 class="page-title" style="margin-bottom:10px">${k.ad} CANLI İZLE</h1>
      </div>
    </div>
    <div class="page-content">
      <p>${desc}</p>
      <p>
        <a class="watch-big" href="${linkVar ? k.url : "#"}" ${linkVar ? 'target="_blank" rel="noopener noreferrer"' : ""}>
          ▶ <span data-i18n="${btnKey}">${btnText}</span>
        </a>
      </p>
      <p style="color:var(--muted);font-size:0.9rem" data-i18n="kanal_note">
        Not: CanlıTV içerik barındırmaz; "${btnText}" butonu sizi ${k.ad} kanalının resmi
        yayın sayfasına yönlendirir.
      </p>

      ${benzer ? `<h2 data-i18n="similar_channels">Benzer Kanallar</h2><div class="benzer-links">${benzer}</div>` : ""}
    </div>
  </main>

  <footer class="site-footer">
    <div class="foot-big">CANLI<span>TV</span></div>
    <nav class="foot-links">
      <a href="../index.html" data-i18n="nav_home">Ana Sayfa</a>
      <a href="../kanallar.html" data-i18n="nav_guide">Kanal Rehberi</a>
      <a href="../hakkimizda.html" data-i18n="nav_about">Hakkımızda</a>
      <a href="../gizlilik.html" data-i18n="nav_privacy">Gizlilik Politikası</a>
    </nav>
    <p data-i18n="foot_tagline_short">Bu site kanal içeriği barındırmaz; her kanal ilgili yayıncının resmi sayfasına yönlendirir.</p>
  </footer>
</body>
</html>
`;
}

// ---- kanallar.html (rehber / iç bağlantı sayfası) ----
function kanallarSayfasi() {
  const kats = [...new Set(KANALLAR.map((k) => k.kategori))];
  const bloklar = kats.map((kat) => {
    const items = KANALLAR.filter((k) => k.kategori === kat)
      .map((k) => `<li><a href="kanal/${slug(k.ad)}.html">${k.ad} canlı izle</a></li>`)
      .join("");
    return `<h2 data-i18n-cat="${kat}">${kat}</h2><ul class="rehber-list">${items}</ul>`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kanal Rehberi — Tüm Kanallar Canlı İzle | CanlıTV</title>
  <meta name="description" content="Türkiye'deki tüm TV kanallarının canlı yayın sayfaları: haber, spor, ulusal, çocuk, müzik ve daha fazlası." />
  <link rel="canonical" href="${SITE}/kanallar.html" />
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="css/style.css" />
  <script>
    if (localStorage.getItem("canlitv_tema") === "light")
      document.documentElement.setAttribute("data-theme", "light");
  </script>
  <script src="js/i18n.js"></script>
</head>
<body>
  <div class="grain" aria-hidden="true"></div>
  <nav class="nav">
    <a href="index.html" class="nav-brand">
      <svg class="brand-mark" viewBox="0 0 44 44" fill="none" aria-hidden="true">
        <rect class="bm-box" x="2.5" y="2.5" width="39" height="39" rx="11" stroke-width="2.5" />
        <path class="bm-accent" d="M18 14.5 L30.5 22 L18 29.5 Z" />
        <circle class="bm-accent bm-dot" cx="33.5" cy="11" r="3.6" />
      </svg>
      <span class="brand-word">CANLI<span>TV</span></span>
    </a>
    <div class="nav-right">
      <div class="lang-wrap">
        <svg class="lang-globe" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" />
          <path d="M3 12h18" stroke="currentColor" stroke-width="1.8" />
          <ellipse cx="12" cy="12" rx="4" ry="9" stroke="currentColor" stroke-width="1.8" />
        </svg>
        <select id="langSelect" class="lang-select" aria-label="Dil seç" title="Dil seç"></select>
      </div>
      <a href="index.html" class="nav-fav" style="text-decoration:none" data-i18n="back_home">← ANA SAYFA</a>
    </div>
  </nav>
  <main class="page">
    <h1 class="page-title"><span data-i18n="kr_title">KANAL REHBERİ</span><span class="accent">.</span></h1>
    <div class="page-content">
      <p data-i18n="kr_intro">Türkiye'deki tüm TV kanallarının canlı yayın sayfaları kategorilere göre aşağıdadır. İzlemek istediğin kanala tıkla.</p>
      ${bloklar}
    </div>
  </main>
  <footer class="site-footer">
    <div class="foot-big">CANLI<span>TV</span></div>
    <nav class="foot-links">
      <a href="index.html" data-i18n="nav_home">Ana Sayfa</a>
      <a href="kanallar.html" data-i18n="nav_guide">Kanal Rehberi</a>
      <a href="hakkimizda.html" data-i18n="nav_about">Hakkımızda</a>
      <a href="gizlilik.html" data-i18n="nav_privacy">Gizlilik Politikası</a>
    </nav>
    <p data-i18n="foot_tagline_short">Bu site kanal içeriği barındırmaz; her kanal ilgili yayıncının resmi sayfasına yönlendirir.</p>
  </footer>
</body>
</html>
`;
}

// ---- sitemap.xml ----
function sitemapXml() {
  const urls = [
    { u: `${SITE}/`, p: "1.0", f: "weekly" },
    { u: `${SITE}/kanallar.html`, p: "0.9", f: "weekly" },
    { u: `${SITE}/hakkimizda.html`, p: "0.4", f: "monthly" },
    { u: `${SITE}/gizlilik.html`, p: "0.3", f: "yearly" },
    ...KANALLAR.map((k) => ({ u: `${SITE}/kanal/${slug(k.ad)}.html`, p: "0.7", f: "weekly" })),
  ];
  const body = urls
    .map((x) => `  <url>\n    <loc>${x.u}</loc>\n    <changefreq>${x.f}</changefreq>\n    <priority>${x.p}</priority>\n  </url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

// ---- Üret ----
if (!fs.existsSync(KANAL_DIR)) fs.mkdirSync(KANAL_DIR, { recursive: true });
let n = 0;
for (const k of KANALLAR) {
  fs.writeFileSync(path.join(KANAL_DIR, slug(k.ad) + ".html"), kanalSayfasi(k, KANALLAR));
  n++;
}
fs.writeFileSync(path.join(ROOT, "kanallar.html"), kanallarSayfasi());
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemapXml());
console.log(`${n} kanal sayfasi + kanallar.html + sitemap.xml uretildi.`);
