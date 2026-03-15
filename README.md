# DUAY IK — Yapay Zeka Destekli İşe Alım Sistemi

Modern, yapay zeka entegreli bir İnsan Kaynakları yönetim uygulaması.

## Özellikler

- **Aday Pipeline** — Kanban tarzı işe alım takibi (Telefon Ön Eleme → Mülakat → Test Sürüşü → Değerlendirme → Onboarding)
- **YZ Araçları** — Claude API ile CV analizi, mülakat sorusu üretme, iş ilanı oluşturma
- **Mülakat Soru Bankası** — Kategorilere göre hazır soru havuzu
- **Test Sürüşü Modülü** — Kahraman Bey, Ofis Temizliği, Döküman vb. uygulama testleri
- **Değerlendirme Cetveli** — 12 faktör üzerinden interaktif puanlama
- **DISC Profil Rehberi** — D/I/S/C kişilik tipleri referansı

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm start
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışır.

## Yapay Zeka (Claude API) Kurulumu

YZ araçlarını kullanmak için Anthropic API anahtarınız gereklidir.

1. [console.anthropic.com](https://console.anthropic.com) adresinden API anahtarı alın
2. Projeye bir proxy/backend ekleyin veya geliştirme ortamında doğrudan kullanın

> **Not:** API anahtarını asla istemci tarafı koduna doğrudan yazmayın. Production'da bir backend proxy kullanın.

### Basit Express Proxy (Opsiyonel)

```bash
npm install express http-proxy-middleware
```

```js
// proxy-server.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use('/api/anthropic', createProxyMiddleware({
  target: 'https://api.anthropic.com',
  changeOrigin: true,
  pathRewrite: { '^/api/anthropic': '' },
  on: {
    proxyReq: (proxyReq) => {
      proxyReq.setHeader('x-api-key', process.env.ANTHROPIC_API_KEY);
      proxyReq.setHeader('anthropic-version', '2023-06-01');
    }
  }
}));

app.listen(3001, () => console.log('Proxy running on port 3001'));
```

## Proje Yapısı

```
duay-ik/
├── public/
│   └── index.html
├── src/
│   ├── App.js          # Ana uygulama (tüm bileşenler)
│   ├── index.js        # React giriş noktası
│   └── index.css       # Global stiller
└── package.json
```

## Teknolojiler

- React 18
- Lucide React (ikonlar)
- Anthropic Claude API (YZ araçları)
- Custom CSS (Tailwind benzeri yardımcı sınıflar)

## Build

```bash
npm run build
```

`build/` klasörü oluşur, herhangi bir statik hosting'e yüklenebilir (Vercel, Netlify, GitHub Pages vb.)

## Lisans

MIT
