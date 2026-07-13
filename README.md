# Canlı TV — Kanal Portalı

Tarayıcıdan açılan basit bir **canlı TV portalı**. İçerik barındırmaz; her kanal kartına
tıklandığında o kanalın **kendi resmi canlı yayın sayfası yeni sekmede açılır**. Böylece
telif sorunu oluşmaz.

## Nasıl açılır?
- `index.html` dosyasına çift tıklaman yeterli.
- (İsteğe bağlı) Yerel sunucuyla: bu klasörde `python -m http.server` çalıştırıp
  tarayıcıda `http://localhost:8000` adresini aç.

## Kanal ekleme / düzenleme
Tüm kanallar `js/channels.js` dosyasındaki `KANALLAR` dizisinde tutulur. Yeni kanal eklemek
için diziye bir satır ekle:

```js
{ ad: "Kanal Adı", kategori: "Haber", logo: "", url: "https://kanalin-resmi-canli-sayfasi" }
```

- **ad**: Kartta görünecek kanal adı.
- **kategori**: Örn. `Ulusal`, `Haber`, `Spor`, `Çocuk`, `Müzik`, `Dini`. Yeni bir kategori
  yazarsan üstteki filtre çubuğunda otomatik görünür.
- **logo**: (opsiyonel) Logo resmi URL'si. Boş bırakırsan kanal adının baş harfi renkli bir
  rozet olarak gösterilir.
- **url**: Kanalın **resmi/izinli** canlı yayın sayfasının linki. Tıklanınca burası açılır.

> Not: `channels.js` içindeki başlangıç linkleri örnektir; kendi doğru resmi linklerinle
> güncellemen önerilir.

## Dosyalar
- `index.html` — sayfa iskeleti
- `css/style.css` — koyu tema, responsive tasarım
- `js/channels.js` — kanal listesi (buradan düzenle)
- `js/app.js` — arama, kategori filtresi, kart oluşturma
