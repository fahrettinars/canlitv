/*
 * KANAL LİSTESİ
 * -------------
 * Alanlar:
 *   ad       : Kanal adı
 *   kategori : "Ulusal" | "Haber" | "Spor" | "Belgesel" | "Çocuk" | "Müzik" | "Dini" | "Ekonomi"
 *   logo     : Logo dosya adı (LOGO_BASE'e eklenir). Boşsa kanal adının baş harfi gösterilir.
 *   url      : Kanalın RESMİ canlı yayın sayfası. Şu an "#" (yer tutucu) — SEN dolduracaksın.
 *
 * LOGOLAR: tv-logo/tv-logos açık kaynak deposundan çekilir (LOGO_BASE).
 * LİNK EKLEME: İlgili kanalın "#" değerini kanalın resmi canlı yayın linkiyle değiştir.
 */

// Logoların çekildiği açık kaynak depo (tv-logo/tv-logos)
const REPO = "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/";
const LOGO_BASE = REPO + "turkey/";

// L() → Türkiye klasöründen (sadece dosya adı ver). Boş "" ise baş harf rozeti gösterilir.
function L(dosya) { return dosya ? LOGO_BASE + dosya : ""; }
// G() → diğer ülke klasörlerinden (uluslararası kanallar), ör. "united-kingdom/tlc-uk.png"
function G(yol) { return yol ? REPO + yol : ""; }
// F() → depoda logosu olmayan kanallar için sitenin ikonu (Google favicon servisi)
function F(alan) { return alan ? "https://www.google.com/s2/favicons?domain=" + alan + "&sz=128" : ""; }

const KANALLAR = [
  // ================= ULUSAL / GENEL =================
  { ad: "TRT 1",        kategori: "Ulusal", logo: L("trt-1-tr.png"),    url: "https://www.tabii.com/tr/watch/live/trt1?trackId=150002" },
  { ad: "TRT 2",        kategori: "Ulusal", logo: L("trt-2-tr.png"),    url: "https://www.tabii.com/watch/live/trt2?trackId=150007" },
  { ad: "atv",          kategori: "Ulusal", logo: L("atv-tr.png"),      url: "https://www.atv.com.tr/canli-yayin" },
  { ad: "Kanal D",      kategori: "Ulusal", logo: L("kanal-d-tr.png"),  url: "https://www.kanald.com.tr/canli-yayin" },
  { ad: "Show TV",      kategori: "Ulusal", logo: L("show-tr.png"),     url: "https://www.showtv.com.tr/canli-yayin" },
  { ad: "Star TV",      kategori: "Ulusal", logo: L("star-tv-tr.png"),  url: "https://www.startv.com.tr/canli-yayin" },
  { ad: "NOW",          kategori: "Ulusal", logo: L("now-tr.png"),      url: "https://www.nowtv.com.tr/canli-yayin" },
  { ad: "TV8",          kategori: "Ulusal", logo: L("tv8-tr.png"),      url: "https://www.tv8.com.tr/canli-yayin" },
  { ad: "TV8,5",        kategori: "Ulusal", logo: L("tv85-tr.png"),     url: "https://www.tv8bucuk.com/tv8-5-canli-yayin" },
  { ad: "Kanal 7",      kategori: "Ulusal", logo: L("kanal-7-tr.png"),  url: "https://www.kanal7.com/canli-izle" },
  { ad: "Beyaz TV",     kategori: "Ulusal", logo: L("beyaz-tv-tr.png"), url: "https://beyaztv.com.tr/canli-yayin" },
  { ad: "TV 360",       kategori: "Ulusal", logo: L("360-tr.png"),      url: "https://www.tv360.com.tr/canli-yayin" },
  { ad: "teve2",        kategori: "Ulusal", logo: L("teve2-tr.png"),    url: "https://www.tv2.com.tr/canli-yayin" },
  { ad: "Show Max",     kategori: "Ulusal", logo: L("show-max-tr.png"), url: "https://www.showmax.com.tr/canliyayin" },
  { ad: "Euro D",       kategori: "Ulusal", logo: L("euro-d-tr.png"),   url: "https://www.eurod.net.tr/canli-yayin" },
  { ad: "Euro Star",    kategori: "Ulusal", logo: L("euro-star-tr.png"),url: "https://www.eurostartv.com.tr/canli-izle" },

  // ================= HABER =================
  { ad: "TRT Haber",    kategori: "Haber", logo: L("trt-haber-tr.png"),   url: "https://www.trthaber.com/canli-yayin.html" },
  { ad: "NTV",          kategori: "Haber", logo: L("ntv-tr.png"),         url: "https://www.ntv.com.tr/canli-yayin" },
  { ad: "CNN Türk",     kategori: "Haber", logo: L("cnn-turk-tr.png"),    url: "https://www.cnnturk.com/canli-yayin" },
  { ad: "Habertürk",    kategori: "Haber", logo: L("haberturk-tr.png"),   url: "https://www.haberturk.com/canli-yayin" },
  { ad: "A Haber",      kategori: "Haber", logo: L("a-haber-tr.png"),     url: "https://www.ahaber.com.tr/video/canli-yayin" },
  { ad: "TGRT Haber",   kategori: "Haber", logo: L("tgrt-haber-tr.png"),  url: "https://www.tgrthaber.com/canli-yayin" },
  { ad: "Halk TV",      kategori: "Haber", logo: L("halk-tv-tr.png"),     url: "https://halktv.com.tr/canli-yayin" },
  { ad: "Sözcü TV",     kategori: "Haber", logo: "assets/logos/sozcu-tv.jpg",   url: "https://www.sozcu.com.tr/sozcu-televizyonu-canli-yayin" },
  { ad: "Tele1",        kategori: "Haber", logo: L("tele1-tr.png"),       url: "https://www.tele1.com.tr/canli-yayin" },
  { ad: "KRT TV",       kategori: "Haber", logo: L("krt-tr.png"),         url: "https://www.krttv.com.tr/canli-yayin" },
  { ad: "Ulusal Kanal", kategori: "Haber", logo: L("ulusal-tv-tr.png"),   url: "https://www.ulusal.com.tr/canli-yayin" },
  { ad: "24 TV",        kategori: "Haber", logo: L("24-tr.png"),          url: "https://www.24tv.com.tr/canli-yayin" },
  { ad: "Haber Global", kategori: "Haber", logo: L("haber-global-tr.png"),url: "https://haberglobal.com.tr/canli-yayin" },
  { ad: "TV100",        kategori: "Haber", logo: L("tv100-tr.png"),       url: "https://tv100.com/canli-izle" },
  { ad: "Ekol TV",      kategori: "Haber", logo: "assets/logos/ekol-tv.jpg",    url: "https://www.ekoltv.com.tr/canli-yayin" },
  { ad: "TRT World",    kategori: "Haber", logo: L("trt-world-tr.png"),   url: "https://www.trtworld.com/live" },
  { ad: "Anadolu Ajansı", kategori: "Haber", logo: "assets/logos/anadolu-ajansi.png", url: "https://www.aa.com.tr/tr/canli-yayin" },

  // ================= EKONOMI =================
  { ad: "Bloomberg HT", kategori: "Ekonomi", logo: L("bloomberg-ht-tr.png"), url: "https://www.bloomberght.com/canli-yayin" },
  { ad: "A Para",       kategori: "Ekonomi", logo: L("a-para-tr.png"),       url: "https://www.apara.com.tr/canli-yayin" },
  { ad: "Ekotürk",      kategori: "Ekonomi", logo: L("ekoturk-tr.png"),      url: "https://ekoturk.com/canli-yayin" },

  // ================= SPOR =================
  { ad: "TRT Spor",         kategori: "Spor", logo: L("trt-spor-tr.png"),         url: "https://www.trtspor.com.tr/canli-yayin-izle/trt-spor/" },
  { ad: "TRT Spor Yıldız",  kategori: "Spor", logo: L("trt-spor-yildiz-tr.png"),  url: "https://www.trtspor.com.tr/canli-yayin-izle/trt-spor-yildiz/" },
  { ad: "A Spor",           kategori: "Spor", logo: L("a-spor-tr.png"),           url: "https://www.aspor.com.tr/canli-yayin" },
  { ad: "beIN Sports 1",    kategori: "Spor", logo: L("bein-hd-tr.png"),          url: "https://www.beinsports.com.tr" , ucretli: true },
  { ad: "beIN Sports 2",    kategori: "Spor", logo: L("bein-hd-tr.png"),          url: "https://www.beinsports.com.tr" , ucretli: true },
  { ad: "beIN Sports 3",    kategori: "Spor", logo: L("bein-hd-tr.png"),          url: "https://www.beinsports.com.tr" , ucretli: true },
  { ad: "beIN Sports 4",    kategori: "Spor", logo: L("bein-hd-tr.png"),          url: "https://www.beinsports.com.tr" , ucretli: true },
  { ad: "beIN Sports 5",    kategori: "Spor", logo: L("bein-hd-tr.png"),          url: "https://www.beinsports.com.tr" , ucretli: true },
  { ad: "beIN Sports Haber", kategori: "Spor", logo: L("bein-sports-haber-tr.png"), url: "https://www.beinsports.com.tr" , ucretli: true },
  { ad: "S Sport",          kategori: "Spor", logo: L("s-sport-tr.png"),          url: "https://www.ssportplus.com" , ucretli: true },
  { ad: "S Sport 2",        kategori: "Spor", logo: L("s-sport-2-tr.png"),        url: "https://www.ssportplus.com" , ucretli: true },
  { ad: "Spor Smart",       kategori: "Spor", logo: L("spor-smart-hd-tr.png"),    url: "https://www.sporekrani.com/home/channel/spor-smart" , ucretli: true },
  { ad: "Spor Smart 2",     kategori: "Spor", logo: L("spor-smart-hd-tr.png"),    url: "https://www.sporekrani.com" , ucretli: true },
  { ad: "Tabii Spor",       kategori: "Spor", logo: "assets/logos/tabii-spor.jpg",  url: "https://tvplus.com.tr/canli-tv/tabii-spor--4399", zoom: 1.28, ucretli: true },
  { ad: "Eurosport 1",      kategori: "Spor", logo: G("united-kingdom/eurosport-1-uk.png"), url: "https://www.eurosport.com" , ucretli: true },
  { ad: "Eurosport 2",      kategori: "Spor", logo: G("united-kingdom/eurosport-2-uk.png"), url: "https://www.eurosport.com" , ucretli: true },

  // ================= BELGESEL =================
  { ad: "TRT Belgesel",        kategori: "Belgesel", logo: L("trt-belgesel-tr.png"), url: "https://www.trtbelgesel.com.tr/canli-izle" },
  { ad: "National Geographic", kategori: "Belgesel", logo: G("united-kingdom/national-geographic-uk.png"),      url: "https://tvplus.com.tr/canli-tv/national-geographic-hd--2799", ucretli: true },
  { ad: "Nat Geo Wild",        kategori: "Belgesel", logo: G("united-kingdom/national-geographic-wild-uk.png"), url: "https://tvplus.com.tr/canli-tv/national-geographic-wild-hd--139", ucretli: true },
  { ad: "Discovery Channel",   kategori: "Belgesel", logo: G("germany/discovery-channel-de.png"),               url: "https://www.discoverychannel.com.tr/" },
  { ad: "DMAX",                kategori: "Belgesel", logo: G("germany/dmax-de.png"),                             url: "https://www.dmax.com.tr/canli-izle" },
  { ad: "TLC",                 kategori: "Belgesel", logo: G("united-kingdom/tlc-uk.png"),                      url: "https://www.tlctv.com.tr/canli-izle" },

  // ================= ÇOCUK =================
  { ad: "TRT Çocuk",          kategori: "Çocuk", logo: L("trt-cocuk-tr.png"),     url: "https://www.trtcocuk.net.tr/canli-yayin" },
  { ad: "TRT EBA TV İlkokul", kategori: "Çocuk", logo: L("eba-tv-ilkokul-tr.png"),url: "https://www.trtizle.com/canli/tv/trt-eba-tv-ilkokul" },
  { ad: "Minika Çocuk",       kategori: "Çocuk", logo: L("minika-cocuk-tr.png"),  url: "https://www.minikacocuk.com.tr/canli-yayin" },
  { ad: "Minika Go",          kategori: "Çocuk", logo: L("minika-go-tr.png"),     url: "https://www.minikago.com.tr/canli-yayin" },
  { ad: "Cartoon Network",    kategori: "Çocuk", logo: G("united-kingdom/cartoon-network-uk.png"), url: "https://tvplus.com.tr/canli-tv/yayin-akisi/cartoon-network--20", ucretli: true },
  { ad: "Nickelodeon",        kategori: "Çocuk", logo: G("united-kingdom/nickelodeon-uk.png"),     url: "https://tvplus.com.tr/canli-tv/yayin-akisi/nickelodeon--4487", ucretli: true },
  { ad: "Yumurcak TV",        kategori: "Çocuk", logo: "assets/logos/yumurcak-tv.jpg", url: "https://www.yumurcaktv.com.tr/canli-yayin" },

  // ================= MÜZIK =================
  { ad: "TRT Müzik",       kategori: "Müzik", logo: L("trt-muzik-tr.png"), url: "https://www.trtdinle.com/canli/trt-muzik" },
  { ad: "TRT Nağme",       kategori: "Müzik", logo: "assets/logos/trt-nagme.png", url: "https://www.trtdinle.com/canli/trt-nagme" },
  { ad: "Kral Pop",        kategori: "Müzik", logo: L("kral-pop-tr.png"),  url: "https://www.kralmuzik.com.tr/tv/kral-pop-tv" },
  { ad: "Number One",      kategori: "Müzik", logo: L("nr1-tr.png"),       url: "https://www.numberone.com.tr/canli-yayin" },
  { ad: "Number One Türk", kategori: "Müzik", logo: L("nr1-turk-tr.png"),  url: "https://www.numberone.com.tr/number-one-turk-canli-yayin" },
  { ad: "PowerTürk TV",    kategori: "Müzik", logo: L("powerturk-tr.png"), url: "https://www.powerturk.com.tr/tv" },
  { ad: "Dream TV",        kategori: "Müzik", logo: "assets/logos/dream-tv.jpg", url: "https://www.dreamtv.com.tr/canli-yayin" },
  { ad: "Dream Türk",      kategori: "Müzik", logo: L("dream-turk-tr.png"),url: "https://www.dreamturk.com.tr/canli-yayin" },

  // ================= DINI =================
  { ad: "Diyanet TV",     kategori: "Dini", logo: L("diyanet-tv-tr.png"),   url: "https://www.diyanet.tv/canli-yayin" },
  { ad: "Diyanet Kur'an", kategori: "Dini", logo: L("diyanet-tv-tr.png"),   url: "https://kuran.diyanet.tv/canli-yayin" },
  { ad: "TV 5",           kategori: "Dini", logo: L("tv5-tr.png"),          url: "https://www.tv5.com.tr/canli-yayin" },
  { ad: "Semerkand TV",   kategori: "Dini", logo: L("semerkand-tv-tr.png"), url: "https://www.semerkandtv.com.tr/canli-yayin" },
  { ad: "Hilal TV",       kategori: "Dini", logo: "assets/logos/hilal-tv.jpg", url: "https://www.youtube.com/@HILALTV-OFFICIAL/live" },
];
