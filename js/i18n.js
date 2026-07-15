/*
 * CANLI TV — çoklu dil (i18n)
 * - Tarayıcı/PC diline göre site açılışında dili otomatik seçer
 * - Nav'daki dil seçici ile elle değiştirilebilir (localStorage'da hatırlanır)
 * - Statik metinleri [data-i18n] / [data-i18n-html] / [data-i18n-ph] / [data-i18n-title]
 *   ile çevirir; dinamik metinler için app.js window.I18N.t() kullanır.
 */
(function () {
  "use strict";

  var LANG_KEY = "canlitv_dil";

  // Desteklenen diller (sıra = seçicideki sıra). rtl: sağdan sola yazım.
  var DILLER = [
    { kod: "tr", ad: "Türkçe",   bayrak: "🇹🇷" },
    { kod: "en", ad: "English",  bayrak: "🇬🇧" },
    { kod: "de", ad: "Deutsch",  bayrak: "🇩🇪" },
    { kod: "fr", ad: "Français", bayrak: "🇫🇷" },
    { kod: "ar", ad: "العربية",  bayrak: "🇸🇦", rtl: true },
    { kod: "ru", ad: "Русский",  bayrak: "🇷🇺" }
  ];

  var SOZLUK = {
    tr: {
      doc_title: "CANLI TV — Türkiye'nin Tüm Kanalları Tek Ekranda",
      search_ph: "KANAL ARA",
      favorites: "FAVORİLER",
      lang_label: "Dil seç",
      live_now: "CANLI YAYIN",
      channels_word: "KANAL",
      hero_title_html: "TÜRKİYE'NİN<br />TÜM KANALLARI<span class=\"accent\">.</span>",
      hero_sub_html: "Ulusaldan spora, haberden çocuğa — Türkiye'nin bütün TV kanalları <strong>tek ekranda.</strong> Aradığın kanalı saniyeler içinde bul, tek tıkla <strong>resmi canlı yayınına</strong> git.",
      section_all: "TÜM KANALLAR",
      watch_live: "CANLI İZLE",
      link_soon: "LİNK YAKINDA",
      sub_page: "ABONELİK SAYFASI",
      sub_required: "ABONELİK GEREKLİ",
      paid_tag: "🔒 ABONELİK",
      empty_search: "Aramanıza uygun kanal bulunamadı.",
      empty_fav: "Henüz favori kanalın yok. Kartlardaki ☆ yıldıza tıklayarak ekle.",
      live_channels_suffix: "CANLI KANAL",
      foot_tagline_html: "Bu site kanal içeriği barındırmaz. Her kanal, ilgili yayıncının <strong>resmi canlı yayın sayfasına</strong> yönlendirir.",
      nav_home: "Ana Sayfa",
      nav_guide: "Kanal Rehberi",
      nav_about: "Hakkımızda",
      nav_privacy: "Gizlilik Politikası",
      back_home: "← ANA SAYFA",
      foot_tagline_short: "Bu site kanal içeriği barındırmaz; her kanal ilgili yayıncının resmi sayfasına yönlendirir.",
      ab_title: "HAKKIMIZDA",
      ab_p1_html: "<strong>CanlıTV</strong>, Türkiye'deki televizyon kanallarının <strong>resmi canlı yayınlarına</strong> tek bir ekrandan kolayca ulaşmanı sağlayan bir yönlendirme portalıdır. Amacımız; haberden spora, belgeselden çocuk kanallarına kadar aradığın kanalı saniyeler içinde bulup, tek tıkla resmi yayınına gitmeni sağlamaktır.",
      ab_h_what: "Ne yapıyoruz?",
      ab_p_what_html: "Sitemizde kanalları kategorilere ayırıp logolarıyla listeliyoruz. Bir kanala tıkladığında, o kanalın <strong>kendi resmi canlı yayın sayfası</strong> yeni bir sekmede açılır.",
      ab_h_nohost: "İçerik barındırmıyoruz",
      ab_p_nohost_html: "CanlıTV <strong>hiçbir yayın içeriği barındırmaz, yayınlamaz veya kopyalamaz.</strong> Yalnızca ilgili yayıncının resmi sayfasına bağlantı verir. Tüm yayın hakları ilgili televizyon kanallarına ve yayıncı kuruluşlara aittir.",
      ab_h_paid: "Ücretsiz ve ücretli kanallar",
      ab_p_paid_html: "Kanalların çoğu ücretsiz resmi yayına yönlendirir. Bazı kanallar (ör. beIN Sports, S Sport gibi) abonelik gerektirir; bunları kartlarında <strong>🔒 ABONELİK</strong> etiketiyle belirtiyoruz — bu kanallara tıklandığında ilgili sağlayıcının üyelik sayfası açılır.",
      ab_h_contact: "İletişim",
      ab_p_contact_html: "Öneri, düzeltme veya kaldırma talepleri için bize ulaşabilirsin: <a href=\"mailto:fahrettinyedek7@gmail.com\">fahrettinyedek7@gmail.com</a>",
      pr_title: "GİZLİLİK POLİTİKASI",
      pr_p1_html: "Bu gizlilik politikası, <strong>canlitvkanallari.site</strong> (CanlıTV) sitesini ziyaret ettiğinde verilerinin nasıl işlendiğini açıklar. Sitemizi kullanarak bu politikayı kabul etmiş olursun.",
      pr_h_nodata: "Kişisel veri toplamıyoruz",
      pr_p_nodata_html: "CanlıTV statik bir sitedir; sunucularında <strong>ad, e-posta, telefon gibi kişisel verileri toplamaz, saklamaz veya satmaz.</strong> Üyelik veya giriş sistemi yoktur.",
      pr_h_ls: "Tarayıcı hafızası (localStorage)",
      pr_p_ls_html: "Favori kanalların, tema ve dil tercihin yalnızca <strong>senin tarayıcında</strong> saklanır. Bu bilgiler bize veya üçüncü taraflara gönderilmez; istediğin zaman tarayıcı verilerini temizleyerek silebilirsin.",
      pr_h_cookies: "Çerezler ve reklamlar",
      pr_p_cookies_html: "Sitemizde üçüncü taraf reklam ağları (örneğin <strong>Adsterra</strong>) yer alır. Bu ağlar; reklamları göstermek ve performanslarını ölçmek için <strong>çerezler</strong> veya benzer teknolojiler kullanabilir. Bu çerezler reklam sağlayıcısı tarafından yönetilir ve onların gizlilik politikalarına tabidir.",
      pr_p_cookies2: "Reklam çerezlerini tarayıcı ayarlarından sınırlayabilir veya engelleyebilirsin. Dilersen bir reklam engelleyici de kullanabilirsin.",
      pr_h_ext: "Dış bağlantılar",
      pr_p_ext_html: "Bir kanala tıkladığında, ilgili yayıncının <strong>kendi web sitesine</strong> yönlendirilirsin. Bu sitelerin içeriğinden ve gizlilik uygulamalarından CanlıTV sorumlu değildir; her sitenin kendi gizlilik politikası geçerlidir.",
      pr_h_copy: "İçerik ve telif",
      pr_p_copy: "CanlıTV hiçbir yayın içeriği barındırmaz; yalnızca resmi kaynaklara bağlantı verir. Tüm haklar ilgili yayıncı kuruluşlara aittir.",
      pr_h_changes: "Değişiklikler",
      pr_p_changes: "Bu politika zaman zaman güncellenebilir. Güncel sürüm her zaman bu sayfada yayınlanır.",
      pr_h_contact: "İletişim",
      pr_p_contact_html: "Sorularınız için: <a href=\"mailto:fahrettinyedek7@gmail.com\">fahrettinyedek7@gmail.com</a>",
      kr_title: "KANAL REHBERİ",
      kr_intro: "Türkiye'deki tüm TV kanallarının canlı yayın sayfaları kategorilere göre aşağıdadır. İzlemek istediğin kanala tıkla.",
      similar_channels: "Benzer Kanallar",
      kanal_note: "Not: CanlıTV içerik barındırmaz; buton sizi ilgili kanalın resmi yayın sayfasına yönlendirir.",
      cat: { "Tümü": "TÜMÜ", "Favoriler": "FAVORİLER", "Ulusal": "ULUSAL", "Haber": "HABER", "Ekonomi": "EKONOMİ", "Spor": "SPOR", "Belgesel": "BELGESEL", "Çocuk": "ÇOCUK", "Müzik": "MÜZİK", "Dini": "DİNİ", "Sinema": "SİNEMA" }
    },
    en: {
      doc_title: "LIVE TV — All Turkish TV Channels on One Screen",
      search_ph: "SEARCH CHANNEL",
      favorites: "FAVORITES",
      lang_label: "Select language",
      live_now: "LIVE",
      channels_word: "CHANNELS",
      hero_title_html: "ALL TURKISH<br />TV CHANNELS<span class=\"accent\">.</span>",
      hero_sub_html: "From national to sports, news to kids — all of Turkey's TV channels <strong>on one screen.</strong> Find your channel in seconds and jump straight to its <strong>official live stream</strong> with one click.",
      section_all: "ALL CHANNELS",
      watch_live: "WATCH LIVE",
      link_soon: "LINK SOON",
      sub_page: "SUBSCRIPTION",
      sub_required: "SUBSCRIPTION",
      paid_tag: "🔒 PAID",
      empty_search: "No channels match your search.",
      empty_fav: "You have no favorites yet. Tap the ☆ star on a channel to add it.",
      live_channels_suffix: "LIVE CHANNELS",
      foot_tagline_html: "This site hosts no channel content. Each channel links to the broadcaster's <strong>official live stream page.</strong>",
      nav_home: "Home",
      nav_guide: "Channel Guide",
      nav_about: "About",
      nav_privacy: "Privacy Policy",
      back_home: "← HOME",
      foot_tagline_short: "This site hosts no channel content; each channel links to the broadcaster's official page.",
      ab_title: "ABOUT US",
      ab_p1_html: "<strong>CanlıTV</strong> is a directory portal that lets you reach the <strong>official live streams</strong> of Turkey's TV channels from a single screen. Our goal is to help you find the channel you want in seconds — from news to sports, documentaries to kids' channels — and jump to its official stream with one click.",
      ab_h_what: "What we do",
      ab_p_what_html: "We group channels by category and list them with their logos. When you click a channel, that channel's <strong>own official live stream page</strong> opens in a new tab.",
      ab_h_nohost: "We host no content",
      ab_p_nohost_html: "CanlıTV <strong>hosts, broadcasts and copies no stream content.</strong> It only links to the broadcaster's official page. All broadcasting rights belong to the respective TV channels and broadcasters.",
      ab_h_paid: "Free and paid channels",
      ab_p_paid_html: "Most channels link to a free official stream. Some channels (e.g. beIN Sports, S Sport) require a subscription; we mark these with a <strong>🔒 PAID</strong> tag on their cards — clicking them opens the provider's subscription page.",
      ab_h_contact: "Contact",
      ab_p_contact_html: "For suggestions, corrections or removal requests, reach us at: <a href=\"mailto:fahrettinyedek7@gmail.com\">fahrettinyedek7@gmail.com</a>",
      pr_title: "PRIVACY POLICY",
      pr_p1_html: "This privacy policy explains how your data is handled when you visit <strong>canlitvkanallari.site</strong> (CanlıTV). By using our site you accept this policy.",
      pr_h_nodata: "We collect no personal data",
      pr_p_nodata_html: "CanlıTV is a static site; on its servers it <strong>does not collect, store or sell personal data such as name, email or phone.</strong> There is no membership or login system.",
      pr_h_ls: "Browser storage (localStorage)",
      pr_p_ls_html: "Your favorite channels and your theme and language preferences are stored only <strong>in your own browser.</strong> This information is not sent to us or third parties; you can delete it anytime by clearing your browser data.",
      pr_h_cookies: "Cookies and ads",
      pr_p_cookies_html: "Our site includes third-party ad networks (e.g. <strong>Adsterra</strong>). These networks may use <strong>cookies</strong> or similar technologies to display ads and measure their performance. These cookies are managed by the ad provider and subject to their privacy policies.",
      pr_p_cookies2: "You can limit or block ad cookies in your browser settings. You may also use an ad blocker if you wish.",
      pr_h_ext: "External links",
      pr_p_ext_html: "When you click a channel, you are redirected to the broadcaster's <strong>own website.</strong> CanlıTV is not responsible for the content or privacy practices of those sites; each site's own privacy policy applies.",
      pr_h_copy: "Content and copyright",
      pr_p_copy: "CanlıTV hosts no stream content; it only links to official sources. All rights belong to the respective broadcasters.",
      pr_h_changes: "Changes",
      pr_p_changes: "This policy may be updated from time to time. The current version is always published on this page.",
      pr_h_contact: "Contact",
      pr_p_contact_html: "For questions: <a href=\"mailto:fahrettinyedek7@gmail.com\">fahrettinyedek7@gmail.com</a>",
      kr_title: "CHANNEL GUIDE",
      kr_intro: "Live stream pages for all TV channels in Turkey are listed below by category. Click the channel you want to watch.",
      similar_channels: "Similar Channels",
      kanal_note: "Note: CanlıTV hosts no content; the button redirects you to the channel's official broadcast page.",
      cat: { "Tümü": "ALL", "Favoriler": "FAVORITES", "Ulusal": "NATIONAL", "Haber": "NEWS", "Ekonomi": "ECONOMY", "Spor": "SPORTS", "Belgesel": "DOCUMENTARY", "Çocuk": "KIDS", "Müzik": "MUSIC", "Dini": "RELIGIOUS", "Sinema": "CINEMA" }
    },
    de: {
      doc_title: "LIVE TV — Alle türkischen TV-Sender auf einem Bildschirm",
      search_ph: "SENDER SUCHEN",
      favorites: "FAVORITEN",
      lang_label: "Sprache wählen",
      live_now: "LIVE",
      channels_word: "SENDER",
      hero_title_html: "ALLE TÜRKISCHEN<br />TV-SENDER<span class=\"accent\">.</span>",
      hero_sub_html: "Von national bis Sport, Nachrichten bis Kinder — alle türkischen TV-Sender <strong>auf einem Bildschirm.</strong> Finde deinen Sender in Sekunden und gelange mit einem Klick zum <strong>offiziellen Livestream.</strong>",
      section_all: "ALLE SENDER",
      watch_live: "LIVE ANSEHEN",
      link_soon: "LINK BALD",
      sub_page: "ABO-SEITE",
      sub_required: "ABO NÖTIG",
      paid_tag: "🔒 ABO",
      empty_search: "Keine Sender für deine Suche gefunden.",
      empty_fav: "Noch keine Favoriten. Tippe auf den ☆ Stern eines Senders, um ihn hinzuzufügen.",
      live_channels_suffix: "LIVE-SENDER",
      foot_tagline_html: "Diese Seite hostet keine Sendeinhalte. Jeder Sender verweist auf die <strong>offizielle Livestream-Seite</strong> des Anbieters.",
      nav_home: "Startseite",
      nav_guide: "Senderführer",
      nav_about: "Über uns",
      nav_privacy: "Datenschutz",
      back_home: "← STARTSEITE",
      foot_tagline_short: "Diese Seite hostet keine Sendeinhalte; jeder Sender verweist auf die offizielle Seite des Anbieters.",
      ab_title: "ÜBER UNS",
      ab_p1_html: "<strong>CanlıTV</strong> ist ein Verzeichnis-Portal, mit dem du die <strong>offiziellen Livestreams</strong> der türkischen TV-Sender von einem einzigen Bildschirm aus erreichst. Unser Ziel: den gesuchten Sender in Sekunden zu finden — von Nachrichten bis Sport, von Doku bis Kinder — und mit einem Klick zum offiziellen Stream zu gelangen.",
      ab_h_what: "Was wir tun",
      ab_p_what_html: "Wir ordnen Sender nach Kategorien und listen sie mit ihren Logos. Wenn du auf einen Sender klickst, öffnet sich dessen <strong>eigene offizielle Livestream-Seite</strong> in einem neuen Tab.",
      ab_h_nohost: "Wir hosten keine Inhalte",
      ab_p_nohost_html: "CanlıTV <strong>hostet, sendet oder kopiert keine Streaminhalte.</strong> Es verlinkt nur auf die offizielle Seite des Anbieters. Alle Senderechte liegen bei den jeweiligen TV-Sendern und Anbietern.",
      ab_h_paid: "Kostenlose und kostenpflichtige Sender",
      ab_p_paid_html: "Die meisten Sender verweisen auf einen kostenlosen offiziellen Stream. Einige Sender (z. B. beIN Sports, S Sport) erfordern ein Abo; diese kennzeichnen wir mit einem <strong>🔒 ABO</strong>-Tag auf ihren Karten — ein Klick öffnet die Abo-Seite des Anbieters.",
      ab_h_contact: "Kontakt",
      ab_p_contact_html: "Für Vorschläge, Korrekturen oder Löschanfragen erreichst du uns unter: <a href=\"mailto:fahrettinyedek7@gmail.com\">fahrettinyedek7@gmail.com</a>",
      pr_title: "DATENSCHUTZ",
      pr_p1_html: "Diese Datenschutzerklärung erläutert, wie deine Daten verarbeitet werden, wenn du <strong>canlitvkanallari.site</strong> (CanlıTV) besuchst. Durch die Nutzung unserer Seite akzeptierst du diese Erklärung.",
      pr_h_nodata: "Wir erheben keine personenbezogenen Daten",
      pr_p_nodata_html: "CanlıTV ist eine statische Seite; auf ihren Servern <strong>werden keine personenbezogenen Daten wie Name, E-Mail oder Telefon erhoben, gespeichert oder verkauft.</strong> Es gibt kein Mitglieds- oder Login-System.",
      pr_h_ls: "Browser-Speicher (localStorage)",
      pr_p_ls_html: "Deine Lieblingssender sowie deine Theme- und Sprachauswahl werden nur <strong>in deinem eigenen Browser</strong> gespeichert. Diese Daten werden nicht an uns oder Dritte gesendet; du kannst sie jederzeit durch Löschen deiner Browserdaten entfernen.",
      pr_h_cookies: "Cookies und Werbung",
      pr_p_cookies_html: "Unsere Seite bindet Werbenetzwerke von Drittanbietern ein (z. B. <strong>Adsterra</strong>). Diese Netzwerke können <strong>Cookies</strong> oder ähnliche Technologien verwenden, um Werbung anzuzeigen und deren Leistung zu messen. Diese Cookies werden vom Werbeanbieter verwaltet und unterliegen dessen Datenschutzrichtlinien.",
      pr_p_cookies2: "Du kannst Werbe-Cookies in deinen Browsereinstellungen einschränken oder blockieren. Bei Bedarf kannst du auch einen Adblocker verwenden.",
      pr_h_ext: "Externe Links",
      pr_p_ext_html: "Wenn du auf einen Sender klickst, wirst du auf die <strong>eigene Website</strong> des Anbieters weitergeleitet. CanlıTV ist nicht für Inhalte oder Datenschutzpraktiken dieser Seiten verantwortlich; es gilt die jeweilige Datenschutzerklärung.",
      pr_h_copy: "Inhalt und Urheberrecht",
      pr_p_copy: "CanlıTV hostet keine Streaminhalte; es verlinkt nur auf offizielle Quellen. Alle Rechte liegen bei den jeweiligen Anbietern.",
      pr_h_changes: "Änderungen",
      pr_p_changes: "Diese Erklärung kann von Zeit zu Zeit aktualisiert werden. Die aktuelle Version wird stets auf dieser Seite veröffentlicht.",
      pr_h_contact: "Kontakt",
      pr_p_contact_html: "Bei Fragen: <a href=\"mailto:fahrettinyedek7@gmail.com\">fahrettinyedek7@gmail.com</a>",
      kr_title: "SENDERFÜHRER",
      kr_intro: "Die Livestream-Seiten aller TV-Sender in der Türkei sind unten nach Kategorie aufgelistet. Klicke auf den Sender, den du sehen möchtest.",
      similar_channels: "Ähnliche Sender",
      kanal_note: "Hinweis: CanlıTV hostet keine Inhalte; die Schaltfläche leitet dich zur offiziellen Sendeseite des Senders weiter.",
      cat: { "Tümü": "ALLE", "Favoriler": "FAVORITEN", "Ulusal": "NATIONAL", "Haber": "NACHRICHTEN", "Ekonomi": "WIRTSCHAFT", "Spor": "SPORT", "Belgesel": "DOKU", "Çocuk": "KINDER", "Müzik": "MUSIK", "Dini": "RELIGIÖS", "Sinema": "KINO" }
    },
    fr: {
      doc_title: "TV EN DIRECT — Toutes les chaînes TV turques sur un écran",
      search_ph: "RECHERCHER",
      favorites: "FAVORIS",
      lang_label: "Choisir la langue",
      live_now: "EN DIRECT",
      channels_word: "CHAÎNES",
      hero_title_html: "TOUTES LES CHAÎNES<br />TV TURQUES<span class=\"accent\">.</span>",
      hero_sub_html: "Du national au sport, des infos aux enfants — toutes les chaînes TV turques <strong>sur un seul écran.</strong> Trouve ta chaîne en quelques secondes et accède à son <strong>direct officiel</strong> en un clic.",
      section_all: "TOUTES LES CHAÎNES",
      watch_live: "REGARDER",
      link_soon: "LIEN BIENTÔT",
      sub_page: "ABONNEMENT",
      sub_required: "ABONNEMENT",
      paid_tag: "🔒 PAYANT",
      empty_search: "Aucune chaîne ne correspond à votre recherche.",
      empty_fav: "Aucun favori pour l'instant. Touchez l'étoile ☆ d'une chaîne pour l'ajouter.",
      live_channels_suffix: "CHAÎNES EN DIRECT",
      foot_tagline_html: "Ce site n'héberge aucun contenu. Chaque chaîne renvoie vers la <strong>page de direct officielle</strong> du diffuseur.",
      nav_home: "Accueil",
      nav_guide: "Guide des chaînes",
      nav_about: "À propos",
      nav_privacy: "Confidentialité",
      back_home: "← ACCUEIL",
      foot_tagline_short: "Ce site n'héberge aucun contenu ; chaque chaîne renvoie vers la page officielle du diffuseur.",
      ab_title: "À PROPOS",
      ab_p1_html: "<strong>CanlıTV</strong> est un portail-annuaire qui te permet d'accéder aux <strong>directs officiels</strong> des chaînes TV turques depuis un seul écran. Notre but : t'aider à trouver la chaîne recherchée en quelques secondes — des infos au sport, des documentaires aux enfants — et accéder à son direct officiel en un clic.",
      ab_h_what: "Ce que nous faisons",
      ab_p_what_html: "Nous classons les chaînes par catégorie et les listons avec leurs logos. Quand tu cliques sur une chaîne, sa <strong>propre page de direct officielle</strong> s'ouvre dans un nouvel onglet.",
      ab_h_nohost: "Nous n'hébergeons aucun contenu",
      ab_p_nohost_html: "CanlıTV <strong>n'héberge, ne diffuse ni ne copie aucun contenu.</strong> Il renvoie uniquement vers la page officielle du diffuseur. Tous les droits de diffusion appartiennent aux chaînes et diffuseurs concernés.",
      ab_h_paid: "Chaînes gratuites et payantes",
      ab_p_paid_html: "La plupart des chaînes renvoient vers un direct officiel gratuit. Certaines chaînes (ex. beIN Sports, S Sport) nécessitent un abonnement ; nous les signalons par une étiquette <strong>🔒 PAYANT</strong> sur leurs cartes — un clic ouvre la page d'abonnement du fournisseur.",
      ab_h_contact: "Contact",
      ab_p_contact_html: "Pour toute suggestion, correction ou demande de retrait, contacte-nous : <a href=\"mailto:fahrettinyedek7@gmail.com\">fahrettinyedek7@gmail.com</a>",
      pr_title: "CONFIDENTIALITÉ",
      pr_p1_html: "Cette politique de confidentialité explique comment tes données sont traitées lorsque tu visites <strong>canlitvkanallari.site</strong> (CanlıTV). En utilisant notre site, tu acceptes cette politique.",
      pr_h_nodata: "Nous ne collectons aucune donnée personnelle",
      pr_p_nodata_html: "CanlıTV est un site statique ; sur ses serveurs, il <strong>ne collecte, ne stocke ni ne vend de données personnelles telles que nom, e-mail ou téléphone.</strong> Il n'y a ni compte ni système de connexion.",
      pr_h_ls: "Stockage du navigateur (localStorage)",
      pr_p_ls_html: "Tes chaînes favorites ainsi que tes préférences de thème et de langue sont stockées uniquement <strong>dans ton propre navigateur.</strong> Ces informations ne sont pas envoyées à nous ni à des tiers ; tu peux les supprimer à tout moment en effaçant les données de ton navigateur.",
      pr_h_cookies: "Cookies et publicités",
      pr_p_cookies_html: "Notre site intègre des régies publicitaires tierces (ex. <strong>Adsterra</strong>). Ces réseaux peuvent utiliser des <strong>cookies</strong> ou technologies similaires pour afficher des annonces et mesurer leurs performances. Ces cookies sont gérés par le fournisseur de publicité et soumis à ses politiques de confidentialité.",
      pr_p_cookies2: "Tu peux limiter ou bloquer les cookies publicitaires dans les paramètres de ton navigateur. Tu peux aussi utiliser un bloqueur de publicités si tu le souhaites.",
      pr_h_ext: "Liens externes",
      pr_p_ext_html: "Quand tu cliques sur une chaîne, tu es redirigé vers le <strong>site du diffuseur.</strong> CanlıTV n'est pas responsable du contenu ni des pratiques de confidentialité de ces sites ; la politique de confidentialité de chaque site s'applique.",
      pr_h_copy: "Contenu et droits d'auteur",
      pr_p_copy: "CanlıTV n'héberge aucun contenu ; il renvoie uniquement vers des sources officielles. Tous les droits appartiennent aux diffuseurs concernés.",
      pr_h_changes: "Modifications",
      pr_p_changes: "Cette politique peut être mise à jour de temps à autre. La version en vigueur est toujours publiée sur cette page.",
      pr_h_contact: "Contact",
      pr_p_contact_html: "Pour toute question : <a href=\"mailto:fahrettinyedek7@gmail.com\">fahrettinyedek7@gmail.com</a>",
      kr_title: "GUIDE DES CHAÎNES",
      kr_intro: "Les pages de direct de toutes les chaînes TV en Turquie sont listées ci-dessous par catégorie. Clique sur la chaîne que tu veux regarder.",
      similar_channels: "Chaînes similaires",
      kanal_note: "Note : CanlıTV n'héberge aucun contenu ; le bouton vous redirige vers la page de diffusion officielle de la chaîne.",
      cat: { "Tümü": "TOUT", "Favoriler": "FAVORIS", "Ulusal": "NATIONAL", "Haber": "ACTUALITÉS", "Ekonomi": "ÉCONOMIE", "Spor": "SPORT", "Belgesel": "DOCUMENTAIRE", "Çocuk": "ENFANTS", "Müzik": "MUSIQUE", "Dini": "RELIGIEUX", "Sinema": "CINÉMA" }
    },
    ar: {
      doc_title: "بث مباشر — كل القنوات التلفزيونية التركية في شاشة واحدة",
      search_ph: "ابحث عن قناة",
      favorites: "المفضلة",
      lang_label: "اختر اللغة",
      live_now: "بث مباشر",
      channels_word: "قناة",
      hero_title_html: "كل القنوات<br />التلفزيونية التركية<span class=\"accent\">.</span>",
      hero_sub_html: "من الوطنية إلى الرياضة، ومن الأخبار إلى الأطفال — كل القنوات التلفزيونية التركية <strong>في شاشة واحدة.</strong> اعثر على قناتك في ثوانٍ وانتقل إلى <strong>بثها المباشر الرسمي</strong> بنقرة واحدة.",
      section_all: "كل القنوات",
      watch_live: "شاهد مباشر",
      link_soon: "الرابط قريباً",
      sub_page: "صفحة الاشتراك",
      sub_required: "يتطلب اشتراك",
      paid_tag: "🔒 مدفوع",
      empty_search: "لا توجد قنوات مطابقة لبحثك.",
      empty_fav: "لا توجد قنوات مفضلة بعد. اضغط على النجمة ☆ لإضافة قناة.",
      live_channels_suffix: "قناة مباشرة",
      foot_tagline_html: "هذا الموقع لا يستضيف أي محتوى. كل قناة تحيل إلى <strong>صفحة البث المباشر الرسمية</strong> للجهة الناشرة.",
      nav_home: "الرئيسية",
      nav_guide: "دليل القنوات",
      nav_about: "من نحن",
      nav_privacy: "سياسة الخصوصية",
      back_home: "الرئيسية →",
      foot_tagline_short: "هذا الموقع لا يستضيف أي محتوى؛ كل قناة تحيل إلى الصفحة الرسمية للجهة الناشرة.",
      ab_title: "من نحن",
      ab_p1_html: "<strong>CanlıTV</strong> هو بوابة دليل تتيح لك الوصول إلى <strong>البث المباشر الرسمي</strong> للقنوات التلفزيونية التركية من شاشة واحدة. هدفنا أن تجد القناة التي تريدها في ثوانٍ — من الأخبار إلى الرياضة، ومن الوثائقيات إلى قنوات الأطفال — وأن تنتقل إلى بثها الرسمي بنقرة واحدة.",
      ab_h_what: "ماذا نفعل؟",
      ab_p_what_html: "نصنّف القنوات حسب الفئات ونعرضها مع شعاراتها. عند النقر على قناة، تُفتح <strong>صفحة البث المباشر الرسمية الخاصة بها</strong> في تبويب جديد.",
      ab_h_nohost: "لا نستضيف أي محتوى",
      ab_p_nohost_html: "CanlıTV <strong>لا يستضيف ولا يبثّ ولا ينسخ أي محتوى.</strong> بل يحيل فقط إلى الصفحة الرسمية للجهة الناشرة. جميع حقوق البث تعود للقنوات والجهات الناشرة المعنية.",
      ab_h_paid: "القنوات المجانية والمدفوعة",
      ab_p_paid_html: "معظم القنوات تحيل إلى بث رسمي مجاني. بعض القنوات (مثل beIN Sports وS Sport) تتطلب اشتراكًا؛ نميّزها بشارة <strong>🔒 مدفوع</strong> على بطاقاتها — وعند النقر عليها تُفتح صفحة اشتراك المزوّد.",
      ab_h_contact: "تواصل معنا",
      ab_p_contact_html: "للاقتراحات أو التصحيحات أو طلبات الإزالة، تواصل معنا عبر: <a href=\"mailto:fahrettinyedek7@gmail.com\">fahrettinyedek7@gmail.com</a>",
      pr_title: "سياسة الخصوصية",
      pr_p1_html: "توضّح سياسة الخصوصية هذه كيفية معالجة بياناتك عند زيارتك لموقع <strong>canlitvkanallari.site</strong> (CanlıTV). باستخدامك لموقعنا فإنك توافق على هذه السياسة.",
      pr_h_nodata: "لا نجمع أي بيانات شخصية",
      pr_p_nodata_html: "CanlıTV موقع ثابت؛ فهو <strong>لا يجمع ولا يخزّن ولا يبيع بيانات شخصية</strong> مثل الاسم أو البريد أو الهاتف على خوادمه. ولا يوجد نظام عضوية أو تسجيل دخول.",
      pr_h_ls: "ذاكرة المتصفح (localStorage)",
      pr_p_ls_html: "تُحفظ قنواتك المفضلة وتفضيلات المظهر واللغة <strong>في متصفحك فقط.</strong> لا تُرسل هذه المعلومات إلينا أو إلى أطراف ثالثة؛ ويمكنك حذفها في أي وقت بمسح بيانات المتصفح.",
      pr_h_cookies: "ملفات تعريف الارتباط والإعلانات",
      pr_p_cookies_html: "يتضمّن موقعنا شبكات إعلانية تابعة لجهات خارجية (مثل <strong>Adsterra</strong>). قد تستخدم هذه الشبكات <strong>ملفات تعريف الارتباط</strong> أو تقنيات مشابهة لعرض الإعلانات وقياس أدائها. تُدار هذه الملفات من قبل مزوّد الإعلانات وتخضع لسياسات الخصوصية الخاصة به.",
      pr_p_cookies2: "يمكنك تقييد أو حظر ملفات تعريف الارتباط الإعلانية من إعدادات متصفحك. ويمكنك أيضًا استخدام مانع إعلانات إذا رغبت.",
      pr_h_ext: "الروابط الخارجية",
      pr_p_ext_html: "عند النقر على قناة، يتم توجيهك إلى <strong>الموقع الخاص بالجهة الناشرة.</strong> ولا يتحمّل CanlıTV مسؤولية محتوى تلك المواقع أو ممارسات الخصوصية فيها؛ إذ تسري سياسة الخصوصية الخاصة بكل موقع.",
      pr_h_copy: "المحتوى وحقوق النشر",
      pr_p_copy: "CanlıTV لا يستضيف أي محتوى؛ بل يحيل فقط إلى المصادر الرسمية. جميع الحقوق تعود للجهات الناشرة المعنية.",
      pr_h_changes: "التغييرات",
      pr_p_changes: "قد يتم تحديث هذه السياسة من حين لآخر. وتُنشر النسخة الحالية دائمًا على هذه الصفحة.",
      pr_h_contact: "تواصل معنا",
      pr_p_contact_html: "للاستفسارات: <a href=\"mailto:fahrettinyedek7@gmail.com\">fahrettinyedek7@gmail.com</a>",
      kr_title: "دليل القنوات",
      kr_intro: "صفحات البث المباشر لجميع القنوات التلفزيونية في تركيا مرتبة أدناه حسب الفئة. انقر على القناة التي تريد مشاهدتها.",
      similar_channels: "قنوات مشابهة",
      kanal_note: "ملاحظة: CanlıTV لا يستضيف أي محتوى؛ يوجّهك الزر إلى صفحة البث الرسمية للقناة.",
      cat: { "Tümü": "الكل", "Favoriler": "المفضلة", "Ulusal": "وطني", "Haber": "أخبار", "Ekonomi": "اقتصاد", "Spor": "رياضة", "Belgesel": "وثائقي", "Çocuk": "أطفال", "Müzik": "موسيقى", "Dini": "ديني", "Sinema": "سينما" }
    },
    ru: {
      doc_title: "ЖИВОЕ ТВ — Все турецкие телеканалы на одном экране",
      search_ph: "ПОИСК КАНАЛА",
      favorites: "ИЗБРАННОЕ",
      lang_label: "Выбрать язык",
      live_now: "В ЭФИРЕ",
      channels_word: "КАНАЛОВ",
      hero_title_html: "ВСЕ ТУРЕЦКИЕ<br />ТЕЛЕКАНАЛЫ<span class=\"accent\">.</span>",
      hero_sub_html: "От национальных до спортивных, от новостей до детских — все турецкие телеканалы <strong>на одном экране.</strong> Найдите канал за секунды и одним кликом перейдите к его <strong>официальной трансляции.</strong>",
      section_all: "ВСЕ КАНАЛЫ",
      watch_live: "СМОТРЕТЬ",
      link_soon: "СКОРО",
      sub_page: "ПОДПИСКА",
      sub_required: "НУЖНА ПОДПИСКА",
      paid_tag: "🔒 ПЛАТНО",
      empty_search: "Каналы по вашему запросу не найдены.",
      empty_fav: "У вас пока нет избранного. Нажмите звезду ☆ на канале, чтобы добавить.",
      live_channels_suffix: "КАНАЛОВ В ЭФИРЕ",
      foot_tagline_html: "Сайт не размещает контент каналов. Каждый канал ведёт на <strong>официальную страницу трансляции</strong> вещателя.",
      nav_home: "Главная",
      nav_guide: "Гид по каналам",
      nav_about: "О нас",
      nav_privacy: "Конфиденциальность",
      back_home: "← ГЛАВНАЯ",
      foot_tagline_short: "Сайт не размещает контент каналов; каждый канал ведёт на официальную страницу вещателя.",
      ab_title: "О НАС",
      ab_p1_html: "<strong>CanlıTV</strong> — это портал-каталог, позволяющий с одного экрана перейти к <strong>официальным трансляциям</strong> турецких телеканалов. Наша цель — помочь найти нужный канал за секунды: от новостей до спорта, от документальных до детских — и одним кликом перейти к его официальной трансляции.",
      ab_h_what: "Что мы делаем",
      ab_p_what_html: "Мы группируем каналы по категориям и показываем их с логотипами. При клике по каналу его <strong>официальная страница трансляции</strong> открывается в новой вкладке.",
      ab_h_nohost: "Мы не размещаем контент",
      ab_p_nohost_html: "CanlıTV <strong>не размещает, не транслирует и не копирует контент.</strong> Он лишь ссылается на официальную страницу вещателя. Все права на вещание принадлежат соответствующим телеканалам и вещателям.",
      ab_h_paid: "Бесплатные и платные каналы",
      ab_p_paid_html: "Большинство каналов ведут на бесплатную официальную трансляцию. Некоторые каналы (например, beIN Sports, S Sport) требуют подписки; мы отмечаем их значком <strong>🔒 ПЛАТНО</strong> на карточках — по клику открывается страница подписки провайдера.",
      ab_h_contact: "Контакты",
      ab_p_contact_html: "По вопросам, исправлениям или запросам на удаление пишите нам: <a href=\"mailto:fahrettinyedek7@gmail.com\">fahrettinyedek7@gmail.com</a>",
      pr_title: "КОНФИДЕНЦИАЛЬНОСТЬ",
      pr_p1_html: "Эта политика конфиденциальности объясняет, как обрабатываются ваши данные при посещении <strong>canlitvkanallari.site</strong> (CanlıTV). Используя сайт, вы принимаете эту политику.",
      pr_h_nodata: "Мы не собираем персональные данные",
      pr_p_nodata_html: "CanlıTV — статический сайт; на его серверах <strong>не собираются, не хранятся и не продаются персональные данные</strong>, такие как имя, e-mail или телефон. Регистрации и входа нет.",
      pr_h_ls: "Хранилище браузера (localStorage)",
      pr_p_ls_html: "Ваши избранные каналы, а также выбор темы и языка сохраняются только <strong>в вашем браузере.</strong> Эти данные не отправляются нам или третьим лицам; вы можете удалить их в любой момент, очистив данные браузера.",
      pr_h_cookies: "Файлы cookie и реклама",
      pr_p_cookies_html: "На сайте есть сторонние рекламные сети (например, <strong>Adsterra</strong>). Эти сети могут использовать <strong>файлы cookie</strong> или похожие технологии для показа рекламы и оценки её эффективности. Эти файлы управляются рекламным провайдером и подчиняются его политике конфиденциальности.",
      pr_p_cookies2: "Вы можете ограничить или заблокировать рекламные cookie в настройках браузера. При желании можно использовать блокировщик рекламы.",
      pr_h_ext: "Внешние ссылки",
      pr_p_ext_html: "При клике по каналу вы перенаправляетесь на <strong>сайт вещателя.</strong> CanlıTV не отвечает за содержание или практику конфиденциальности этих сайтов; действует политика конфиденциальности каждого сайта.",
      pr_h_copy: "Контент и авторские права",
      pr_p_copy: "CanlıTV не размещает контент; он лишь ссылается на официальные источники. Все права принадлежат соответствующим вещателям.",
      pr_h_changes: "Изменения",
      pr_p_changes: "Эта политика может время от времени обновляться. Актуальная версия всегда публикуется на этой странице.",
      pr_h_contact: "Контакты",
      pr_p_contact_html: "По вопросам: <a href=\"mailto:fahrettinyedek7@gmail.com\">fahrettinyedek7@gmail.com</a>",
      kr_title: "ГИД ПО КАНАЛАМ",
      kr_intro: "Страницы трансляций всех телеканалов Турции перечислены ниже по категориям. Нажмите на канал, который хотите смотреть.",
      similar_channels: "Похожие каналы",
      kanal_note: "Примечание: CanlıTV не размещает контент; кнопка перенаправляет вас на официальную страницу трансляции канала.",
      cat: { "Tümü": "ВСЕ", "Favoriler": "ИЗБРАННОЕ", "Ulusal": "НАЦИОНАЛЬНЫЕ", "Haber": "НОВОСТИ", "Ekonomi": "ЭКОНОМИКА", "Spor": "СПОРТ", "Belgesel": "ДОКУМЕНТАЛЬНЫЕ", "Çocuk": "ДЕТСКИЕ", "Müzik": "МУЗЫКА", "Dini": "РЕЛИГИОЗНЫЕ", "Sinema": "КИНО" }
    }
  };

  function bul(kod) {
    for (var i = 0; i < DILLER.length; i++) if (DILLER[i].kod === kod) return DILLER[i];
    return null;
  }

  // Kayıtlı dil → yoksa tarayıcı/PC dili → yoksa Türkçe
  function diliBelirle() {
    var kayitli = null;
    try { kayitli = localStorage.getItem(LANG_KEY); } catch (e) {}
    if (kayitli && SOZLUK[kayitli]) return kayitli;
    var adaylar = navigator.languages || [navigator.language || navigator.userLanguage || "tr"];
    for (var i = 0; i < adaylar.length; i++) {
      var k = String(adaylar[i]).slice(0, 2).toLowerCase();
      if (SOZLUK[k]) return k;
    }
    return "tr";
  }

  var aktifDil = diliBelirle();

  function t(anahtar) {
    var s = SOZLUK[aktifDil];
    if (s && s[anahtar] != null) return s[anahtar];
    return (SOZLUK.tr[anahtar] != null) ? SOZLUK.tr[anahtar] : anahtar;
  }
  function cat(katKey) {
    var s = SOZLUK[aktifDil];
    if (s && s.cat && s.cat[katKey] != null) return s.cat[katKey];
    return (SOZLUK.tr.cat[katKey] != null) ? SOZLUK.tr.cat[katKey] : katKey;
  }

  // <html lang/dir> ve sekme başlığını hemen ayarla (RTL titremesini önler)
  function belgeyiAyarla() {
    var d = bul(aktifDil);
    document.documentElement.setAttribute("lang", aktifDil);
    document.documentElement.setAttribute("dir", (d && d.rtl) ? "rtl" : "ltr");
    document.title = t("doc_title");
  }

  // [data-i18n*] işaretli statik düğümleri çevir
  function statikMetinleriUygula() {
    var els = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < els.length; i++) els[i].textContent = t(els[i].getAttribute("data-i18n"));

    els = document.querySelectorAll("[data-i18n-html]");
    for (i = 0; i < els.length; i++) els[i].innerHTML = t(els[i].getAttribute("data-i18n-html"));

    els = document.querySelectorAll("[data-i18n-cat]");
    for (i = 0; i < els.length; i++) els[i].textContent = cat(els[i].getAttribute("data-i18n-cat"));

    els = document.querySelectorAll("[data-i18n-ph]");
    for (i = 0; i < els.length; i++) els[i].setAttribute("placeholder", t(els[i].getAttribute("data-i18n-ph")));

    els = document.querySelectorAll("[data-i18n-title]");
    for (i = 0; i < els.length; i++) {
      var v = t(els[i].getAttribute("data-i18n-title"));
      els[i].setAttribute("title", v);
      els[i].setAttribute("aria-label", v);
    }
  }

  // Nav'daki dil seçiciyi kur
  function seciciyiKur() {
    var sec = document.getElementById("langSelect");
    if (!sec) return;
    if (!sec.options.length) {
      for (var i = 0; i < DILLER.length; i++) {
        var o = document.createElement("option");
        o.value = DILLER[i].kod;
        o.textContent = DILLER[i].ad;
        sec.appendChild(o);
      }
      sec.addEventListener("change", function () { API.set(sec.value); });
    }
    sec.value = aktifDil;
    sec.setAttribute("aria-label", t("lang_label"));
    sec.setAttribute("title", t("lang_label"));
  }

  function uygula() {
    belgeyiAyarla();
    statikMetinleriUygula();
    seciciyiKur();
    if (typeof API.onChange === "function") API.onChange();
  }

  var API = {
    lang: aktifDil,
    diller: DILLER,
    t: t,
    cat: cat,
    onChange: null,
    set: function (kod) {
      if (!SOZLUK[kod] || kod === aktifDil) return;
      aktifDil = kod;
      API.lang = kod;
      try { localStorage.setItem(LANG_KEY, kod); } catch (e) {}
      uygula();
    },
    apply: uygula
  };

  window.I18N = API;

  // <html lang/dir> + başlığı en erken anda ayarla; DOM hazır olunca tümünü uygula
  belgeyiAyarla();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", uygula);
  } else {
    uygula();
  }
})();
