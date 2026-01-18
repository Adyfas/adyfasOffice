# Cara Deploy ke Firebase Hosting

## Prerequisites

1. Install Firebase CLI secara global:
```bash
npm install -g firebase-tools
```

2. Login ke Firebase:
```bash
firebase login
```

## Setup Project

1. Buat project Firebase di [Firebase Console](https://console.firebase.google.com/)

2. Inisialisasi Firebase di project ini:
```bash
cd adyfas
firebase init hosting
```

Pilih opsi:
- **What do you want to use as your public directory?** → `build/client`
- **Configure as a single-page app?** → `Yes`
- **Set up automatic builds and deploys with GitHub?** → `No` (atau Yes jika mau)

3. Edit `.firebaserc` dan ganti `your-project-id` dengan Firebase Project ID kamu

## Deploy

### Opsi 1: Deploy langsung (Recommended)
```bash
npm run deploy
```

### Opsi 2: Build dulu, deploy kemudian
```bash
npm run build:firebase
npm run deploy:hosting
```

### Opsi 3: Deploy manual
```bash
npm run build
firebase deploy --only hosting
```

## Catatan Penting

⚠️ **Firebase Hosting hanya support static files**, jadi:
- SSR akan di-disable saat build untuk Firebase
- Aplikasi akan berjalan sebagai SPA (Single Page Application)
- Semua routing akan di-handle di client-side

Jika kamu butuh SSR dengan Firebase, kamu perlu setup Cloud Functions (lebih kompleks).

## Troubleshooting

Jika ada error, pastikan:
1. Firebase CLI sudah terinstall: `firebase --version`
2. Sudah login: `firebase login`
3. Project ID di `.firebaserc` sudah benar
4. Build berhasil: `npm run build`
