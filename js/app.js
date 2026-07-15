/*
 * CANLI TV — uygulama mantığı
 * - Kanal ızgarası, kategori filtresi (sayaçlı), arama
 * - Favoriler (localStorage), son kategori hatırlama
 * - Kart tıklanınca resmi link yeni sekmede açılır ("#" ise henüz link yok uyarısı)
 */

(function () {
  "use strict";

  // Çeviri erişimi (i18n.js head'de yüklenir). Emniyet için yedekli.
  const I = window.I18N || { t: function (k) { return k; }, cat: function (k) { return k; }, lang: "tr" };

  const grid = document.getElementById("channelGrid");
  const categoryBar = document.getElementById("categoryBar");
  const searchInput = document.getElementById("searchInput");
  const emptyState = document.getElementById("emptyState");
  const resultCount = document.getElementById("resultCount");
  const sectionTitle = document.getElementById("sectionTitle");
  const totalCount = document.getElementById("totalCount");
  const favCount = document.getElementById("favCount");
  const favShortcut = document.getElementById("favShortcut");
  const searchClear = document.getElementById("searchClear");

  const FAV_KEY = "canlitv_favoriler";
  const CAT_KEY = "canlitv_kategori";
  const THEME_KEY = "canlitv_tema";

  let favoriler = yukleFavoriler();
  let aktifKategori = localStorage.getItem(CAT_KEY) || "Tümü";
  let aramaMetni = "";

  function yukleFavoriler() {
    try { return new Set(JSON.parse(localStorage.getItem(FAV_KEY)) || []); }
    catch (e) { return new Set(); }
  }
  function kaydetFavoriler() {
    localStorage.setItem(FAV_KEY, JSON.stringify(Array.from(favoriler)));
  }

  function renkUret(ad) {
    let hash = 0;
    for (let i = 0; i < ad.length; i++) hash = ad.charCodeAt(i) + ((hash << 5) - hash);
    const h = Math.abs(hash) % 360;
    return `linear-gradient(135deg, hsl(${h} 35% 24%), hsl(${(h + 40) % 360} 35% 14%))`;
  }

  function kategorileriAl() {
    const set = new Set(KANALLAR.map((k) => k.kategori));
    return ["Tümü", "Favoriler", ...Array.from(set)];
  }
  function kategoriSayisi(kat) {
    if (kat === "Tümü") return KANALLAR.length;
    if (kat === "Favoriler") return favoriler.size;
    return KANALLAR.filter((k) => k.kategori === kat).length;
  }

  function favSayacGuncelle() {
    if (favCount) favCount.textContent = favoriler.size;
  }

  function kategorileriCiz() {
    favSayacGuncelle();
    categoryBar.innerHTML = "";
    kategorileriAl().forEach((kat) => {
      const chip = document.createElement("button");
      chip.className = "chip" + (kat === aktifKategori ? " active" : "");
      chip.innerHTML =
        `${kat === "Favoriler" ? "★ " : ""}${I.cat(kat)}<span class="chip-count">${kategoriSayisi(kat)}</span>`;
      chip.addEventListener("click", () => {
        aktifKategori = kat;
        localStorage.setItem(CAT_KEY, kat);
        kategorileriCiz();
        kanallariCiz();
      });
      categoryBar.appendChild(chip);
    });
  }

  function filtrele() {
    const q = aramaMetni.trim().toLowerCase();
    return KANALLAR.filter((k) => {
      let katUyar;
      if (aktifKategori === "Tümü") katUyar = true;
      else if (aktifKategori === "Favoriler") katUyar = favoriler.has(k.ad);
      else katUyar = k.kategori === aktifKategori;
      const aramaUyar = !q || k.ad.toLowerCase().includes(q);
      return katUyar && aramaUyar;
    });
  }

  function kartOlustur(kanal, index) {
    const linkVar = kanal.url && kanal.url !== "#";

    const card = document.createElement("a");
    card.className = "card";
    card.href = kanal.url || "#";
    if (linkVar) {
      card.target = "_blank";
      card.rel = "noopener noreferrer";
    }

    // Üst satır: sıra no + favori
    const top = document.createElement("div");
    top.className = "card-top";

    const idx = document.createElement("span");
    idx.className = "card-index";
    idx.textContent = String(index + 1).padStart(2, "0");

    const fav = document.createElement("button");
    fav.className = "fav-btn" + (favoriler.has(kanal.ad) ? " on" : "");
    fav.type = "button";
    fav.title = "Favori";
    fav.textContent = favoriler.has(kanal.ad) ? "★" : "☆";
    fav.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (favoriler.has(kanal.ad)) favoriler.delete(kanal.ad);
      else favoriler.add(kanal.ad);
      kaydetFavoriler();
      kategorileriCiz();
      kanallariCiz();
    });
    // Sol grup: sıra no + (varsa) ücretli rozeti
    const left = document.createElement("div");
    left.className = "card-top-left";
    left.appendChild(idx);
    if (kanal.ucretli) {
      const pay = document.createElement("span");
      pay.className = "paid-tag";
      pay.textContent = I.t("paid_tag");
      left.appendChild(pay);
    }
    top.append(left, fav);

    // Logo
    const logo = document.createElement("div");
    logo.className = "logo";
    if (kanal.logo) {
      logo.classList.add("has-img");
      // Kendi eklediğin yerel logolar (assets/logos) kutuyu tam doldursun
      if (/^assets\//.test(kanal.logo)) logo.classList.add("user-logo");
      const img = document.createElement("img");
      img.src = kanal.logo;
      img.alt = kanal.ad;
      img.loading = "lazy";
      // İsteğe bağlı: logoyu büyüt / kenar beyazlıklarını kırp (ör. zoom: 1.2)
      if (kanal.zoom) img.style.transform = "scale(" + kanal.zoom + ")";
      img.onerror = function () {
        logo.classList.remove("has-img");
        logo.textContent = kanal.ad.charAt(0).toUpperCase();
        logo.style.background = renkUret(kanal.ad);
      };
      logo.appendChild(img);
    } else {
      logo.textContent = kanal.ad.charAt(0).toUpperCase();
      logo.style.background = renkUret(kanal.ad);
    }

    // Gövde
    const body = document.createElement("div");
    body.className = "card-body";
    const name = document.createElement("div");
    name.className = "name";
    name.textContent = kanal.ad;
    const cat = document.createElement("div");
    cat.className = "cat";
    cat.textContent = kanal.kategori;
    body.append(name, cat);

    const watch = document.createElement("span");
    watch.className = "watch" + (kanal.ucretli ? " watch-paid" : "");
    let watchText;
    if (kanal.ucretli) watchText = linkVar ? I.t("sub_page") : I.t("sub_required");
    else watchText = linkVar ? I.t("watch_live") : I.t("link_soon");
    watch.innerHTML = watchText + ' <span class="arrow">→</span>';

    // Link henüz yoksa boş sekme açma
    if (!linkVar) {
      card.addEventListener("click", (e) => e.preventDefault());
    }

    card.append(top, logo, body, watch);
    return card;
  }

  // Scroll ile beliren kartlar için gözlemci
  let gozlemci = null;
  function revealKur() {
    if (!("IntersectionObserver" in window)) {
      grid.querySelectorAll(".card").forEach((c) => c.classList.add("in"));
      return;
    }
    if (gozlemci) gozlemci.disconnect();
    gozlemci = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); }
        });
      },
      { rootMargin: "0px 0px -30px 0px", threshold: 0.05 }
    );
    grid.querySelectorAll(".card").forEach((c) => gozlemci.observe(c));
  }

  function kanallariCiz() {
    const liste = filtrele();
    grid.innerHTML = "";

    if (sectionTitle) {
      sectionTitle.textContent =
        aktifKategori === "Tümü" ? I.t("section_all") : I.cat(aktifKategori).toUpperCase();
    }
    if (resultCount) resultCount.textContent = liste.length + " " + I.t("channels_word");

    if (liste.length === 0) {
      emptyState.hidden = false;
      emptyState.textContent =
        aktifKategori === "Favoriler" ? I.t("empty_fav") : I.t("empty_search");
      return;
    }
    emptyState.hidden = true;

    const frag = document.createDocumentFragment();
    liste.forEach((k, i) => frag.appendChild(kartOlustur(k, i)));
    grid.appendChild(frag);
    revealKur();
  }

  searchInput.addEventListener("input", function (e) {
    aramaMetni = e.target.value;
    if (searchClear) searchClear.hidden = !aramaMetni;
    kanallariCiz();
  });

  function aramayiTemizle() {
    aramaMetni = "";
    searchInput.value = "";
    if (searchClear) searchClear.hidden = true;
    kanallariCiz();
    searchInput.focus();
  }

  if (searchClear) searchClear.addEventListener("click", aramayiTemizle);

  // Favoriler kısayolu (nav)
  if (favShortcut) {
    favShortcut.addEventListener("click", function () {
      aktifKategori = "Favoriler";
      localStorage.setItem(CAT_KEY, aktifKategori);
      kategorileriCiz();
      kanallariCiz();
      document.querySelector(".cat-wrap").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // Klavye kısayolları: "/" aramaya odaklan, Esc temizle
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    } else if (e.key === "Escape" && document.activeElement === searchInput) {
      aramayiTemizle();
    }
  });

  // Hero sayaç animasyonu (0 → toplam)
  function sayacAnimasyonu(hedef) {
    if (!totalCount) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      totalCount.textContent = hedef;
      return;
    }
    let n = 0;
    const adim = Math.max(1, Math.ceil(hedef / 40));
    const t = setInterval(() => {
      n += adim;
      if (n >= hedef) { n = hedef; clearInterval(t); }
      totalCount.textContent = n;
    }, 24);
  }

  // Kayan şerit içeriğini üret (kesintisiz döngü için 2 kopya)
  function marqueeKur() {
    const track = document.getElementById("marqueeTrack");
    if (!track) return;
    const kats = Array.from(new Set(KANALLAR.map((k) => k.kategori)));
    const parcalar = [KANALLAR.length + " " + I.t("live_channels_suffix"), ...kats.map((k) => I.cat(k))];
    const blok = parcalar
      .map((p) => `<span>${p} <span class="sep">✦</span></span>`)
      .join("");
    track.innerHTML = blok + blok; // iki kopya → sonsuz akış
  }

  // Tema (aydınlık / karanlık)
  function temaUygula(tema) {
    const btn = document.getElementById("themeToggle");
    if (tema === "light") {
      document.documentElement.setAttribute("data-theme", "light");
      if (btn) { btn.textContent = "☀️"; btn.title = "Karanlık temaya geç"; }
    } else {
      document.documentElement.removeAttribute("data-theme");
      if (btn) { btn.textContent = "🌙"; btn.title = "Aydınlık temaya geç"; }
    }
  }
  function temaKur() {
    const kayitli = localStorage.getItem(THEME_KEY) || "dark";
    temaUygula(kayitli);
    const btn = document.getElementById("themeToggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      const yeni =
        document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
      localStorage.setItem(THEME_KEY, yeni);
      temaUygula(yeni);
    });
  }

  // Yukarı çık butonu
  function toTopKur() {
    const btn = document.getElementById("toTop");
    if (!btn) return;
    window.addEventListener("scroll", () => {
      btn.classList.toggle("show", window.scrollY > 500);
    }, { passive: true });
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  // Dil değişince dinamik içeriği yeniden çiz (kategori, ızgara, kayan şerit)
  if (window.I18N) {
    window.I18N.onChange = function () {
      kategorileriCiz();
      kanallariCiz();
      marqueeKur();
    };
  }

  // İlk çizim
  if (!kategorileriAl().includes(aktifKategori)) aktifKategori = "Tümü";
  temaKur();
  marqueeKur();
  toTopKur();
  kategorileriCiz();
  kanallariCiz();
  sayacAnimasyonu(KANALLAR.length);
})();
