# CanlıTV — Kanal Portalı

Türkiye'deki TV kanallarının **resmi canlı yayınlarına** yönlendiren modern bir web portalı.
Site içerik barındırmaz; her kanal, ilgili yayıncının resmi canlı yayın sayfasına
(veya ücretli kanallarda sağlayıcının abonelik sayfasına) yeni sekmede yönlendirir.

🌐 **Canlı site:** https://fahrettinars.github.io/canlitv/

## Özellikler
- **78 kanal**, 8 kategori (Ulusal, Haber, Ekonomi, Spor, Belgesel, Çocuk, Müzik, Dini)
- Kanal logoları, arama ve kategori filtresi (sayaçlı)
- **Favoriler** — yıldızla, tarayıcı hafızasında (localStorage) saklanır
- **Aydınlık / karanlık tema** düğmesi (tercih hatırlanır)
- **Ücretli kanal işareti** — 🔒 ABONELİK rozeti + "ABONELİK SAYFASI" butonu
- Modernist tasarım: dev tipografi, lime vurgu, kayan şerit, scroll animasyonları
- Tamamen **responsive** (mobil uyumlu), klavye kısayolları (`/` ara, `Esc` temizle)

## Dosya yapısı
```
index.html          Sayfa iskeleti
css/style.css       Tasarım (koyu/aydınlık tema, responsive)
js/channels.js      KANAL LİSTESİ — buradan düzenlenir
js/app.js           Arama, filtre, favoriler, tema, render
assets/favicon.svg  Sekme ikonu
assets/logo.svg     Bağımsız logo
assets/logos/       Elle eklenen kanal logoları
```

## Kanal ekleme / düzenleme
Tüm kanallar `js/channels.js` içindeki `KANALLAR` dizisindedir. Örnek kayıt:
```js
{ ad: "Kanal Adı", kategori: "Haber", logo: L("dosya-tr.png"), url: "https://resmi-canli-yayin" }
```
Logo yardımcıları:
- `L("dosya.png")` → Türkiye logo deposundan
- `G("ulke/dosya.png")` → diğer ülke klasörlerinden (uluslararası kanallar)
- `F("site.com")` → sitenin ikonu (favicon)
- `"assets/logos/ad.png"` → kendi eklediğin yerel logo

Ek alanlar:
- `ucretli: true` → 🔒 ABONELİK rozeti gösterir, buton "ABONELİK SAYFASI" olur
- `zoom: 1.28` → logoyu büyütür / kenar beyazlıklarını kırpar

## Siteyi güncelleme (yayına alma)
Değişiklikten sonra:
```bash
git add . && git commit -m "güncelleme" && git push
```
Push'tan 1-2 dakika sonra canlı site otomatik güncellenir. Tarayıcıda görmek için `Ctrl+F5`.

## Not (telif)
Kanal içerikleri barındırılmaz; yalnızca yayıncıların **resmi** canlı yayın/abonelik
sayfalarına link verilir.
