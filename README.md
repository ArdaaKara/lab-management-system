# Computer Lab Management System (CLMS)

> Eğitim kurumlarındaki bilgisayar laboratuvarlarının donanım envanterini ve
> arıza yönetim süreçlerini görsel grid haritası üzerinden yöneten hafif IT bakım sistemi.

---

## İçindekiler

1. [Genel Bakış](#1-genel-bakış)
2. [Mimari](#2-mimari)
3. [Teknoloji Stack](#3-teknoloji-stack)
4. [Kullanıcı Rolleri ve Yetkiler](#4-kullanıcı-rolleri-ve-yetkiler)
5. [Kurulum — Hızlı Başlangıç (Docker)](#5-kurulum--hızlı-başlangıç-docker)
6. [Ortam Değişkenleri](#6-ortam-değişkenleri)
7. [Veritabanı Şeması](#7-veritabanı-şeması)
8. [API Referansı](#8-api-referansı)
9. [Hardware Sync Entegrasyonu (.bat / .sh)](#9-hardware-sync-entegrasyonu-bat--sh)
10. [QR Kod Arıza Bildirimi Akışı](#10-qr-kod-arıza-bildirimi-akışı)
11. [Frontend Geliştirme](#11-frontend-geliştirme)
12. [Backend Geliştirme](#12-backend-geliştirme)
13. [Güvenlik Notları](#13-güvenlik-notları)
14. [Bilinen Kısıtlamalar](#14-bilinen-kısıtlamalar)
15. [Katkıda Bulunma](#15-katkıda-bulunma)
16. [Lisans](#16-lisans)

---

## 1. Genel Bakış

- Projenin amacı ve kapsam tanımı
- Bu sistem ne DEĞİLDİR (NetSupport vb. ile karıştırılmaması için)
- Temel özellikler listesi (Grid harita, arıza akışı, QR form, .bat sync)

## 2. Mimari

- C4 Container diyagramı (PNG / Mermaid embed)
- Katman açıklaması: Browser → Nginx → Spring Boot → PostgreSQL
- .bat script'in sisteme bağlanma noktası
- Polling stratejisi: neden WebSocket değil (bilinçli trade-off)

## 3. Teknoloji Stack

- Backend: Java 21, Spring Boot 3.3, Spring Security 6, JPA, Flyway, MapStruct, ZXing, Bucket4j
- Frontend: React 19, Vite 5, Tailwind CSS, shadcn/ui, Zustand, Chart.js, @dnd-kit
- Altyapı: Docker, docker-compose v2, PostgreSQL 16, Nginx

## 4. Kullanıcı Rolleri ve Yetkiler

- Yetki matrisi tablosu (ADMIN / TEACHER / TECHNICIAN)
- Rol bazlı görünürlük kuralları
- `*` ve `**` dipnot açıklamaları

## 5. Kurulum — Hızlı Başlangıç (Docker)

### Ön gereksinimler
- Docker Engine 24+, docker-compose v2 plugin

### Adımlar
```bash
git clone https://github.com/your-org/clms.git
cd clms
cp .env.example .env
# .env dosyasını düzenle (en az POSTGRES_PASSWORD ve JWT_SECRET)
docker compose up -d
```
- Flyway migration'larının otomatik çalışması
- İlk admin girişi: `admin@lab.local` / `ChangeMe!2024`
- **⚠️ Üretimde ilk girişten sonra şifreyi değiştir**

### Sağlık kontrolü
```bash
docker compose ps
curl http://localhost/actuator/health
```

## 6. Ortam Değişkenleri

| Değişken | Zorunlu | Açıklama | Varsayılan |
|---|---|---|---|
| POSTGRES_PASSWORD | ✅ | DB şifresi | — |
| JWT_SECRET | ✅ | Min 256-bit base64 | — |
| JWT_ACCESS_EXPIRY_MINUTES | | Access token süresi | 15 |
| JWT_REFRESH_EXPIRY_DAYS | | Refresh token süresi | 7 |
| SPRING_PROFILE | | prod / dev / test | prod |
| HOST_HTTP_PORT | | Host HTTP port | 80 |
| HOST_HTTPS_PORT | | Host HTTPS port | 443 |

## 7. Veritabanı Şeması

- Entity-Relationship özeti
- Tablo açıklamaları: users, roles, user_roles, labs, lab_assignments, computers, issues, issue_history, refresh_tokens
- Önemli kısıtlamalar: `UNIQUE(lab_id, grid_row, grid_col)`, `mac_address UNIQUE`, partial index açıklaması
- Flyway migration dosyaları: `V1__init_schema.sql`, `V2__seed_roles_and_admin.sql`
- ⚠️ `issue_history` tablosu hiçbir zaman silinmez — audit trail

## 8. API Referansı

### Genel
- Base URL: `https://your-domain/api/v1`
- Response zarfı formatı: `{success, data, error, timestamp}`
- Authentication: `Authorization: Bearer <accessToken>`

### Auth
- `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`

### Labs
- CRUD endpoint'leri (ADMIN only)
- `POST /labs/{labId}/assign-teacher`

### Computers
- `GET /labs/{labId}/computers` — grid verisi + statüler
- `POST /labs/{labId}/computers` (ADMIN)
- `PUT /computers/{id}` (ADMIN — konum güncelleme)
- `PATCH /computers/{id}/decommission`
- `POST /hardware-sync` — PUBLIC, `X-Lab-Api-Key` header

### Issues
- `POST /computers/{id}/issues` — PUBLIC QR form, rate-limited
- `GET /labs/{labId}/issues?status=&category=&from=&to=`
- `PATCH /issues/{id}/assign`
- `PATCH /issues/{id}/resolve` (TECHNICIAN)
- `PATCH /issues/{id}/approve` (TEACHER)
- `PATCH /issues/{id}/reject` (TEACHER, body: `{reason}`)

### Dashboard & Analytics
- `GET /analytics/labs/{labId}/summary`

## 9. Hardware Sync Entegrasyonu (.bat / .sh)

- Script'in ne yaptığı (WMI / dmidecode ile donanım okuma)
- `X-Lab-Api-Key` header nasıl alınır (ADMIN paneli → Lab detay)
- Örnek Windows batch script (şablon)
- Örnek Linux shell script (şablon)
- Startup script olarak nasıl kaydedilir (Windows: Task Scheduler, Linux: systemd unit)
- ⚠️ Bilinen kısıtlama: `last_seen_at` yalnızca startup'ta güncellenir; "PC çevrimdışı" tespiti bu sistemin scope'u dışındadır

## 10. QR Kod Arıza Bildirimi Akışı

- QR kodunun nerede üretildiği (`GET /computers/{id}/qr-code` → PNG)
- Öğrencinin gördüğü form (auth gerektirmez, anonim)
- Rate limiting: IP başına 1 istek/dakika
- Arıza onay süreci: OPEN → IN_PROGRESS → PENDING_APPROVAL → RESOLVED
- Ret akışı: PENDING_APPROVAL → REJECTED (öğretmen gerekçe girer)

## 11. Frontend Geliştirme

### Klasör yapısı
```
frontend/src/
├── routes/
├── components/
│   ├── grid/
│   ├── issues/
│   └── dashboard/
├── stores/          # Zustand
│   ├── useAuthStore.ts
│   ├── useLabStore.ts
│   ├── useComputerStore.ts
│   └── useIssueStore.ts
├── hooks/
│   └── useInterval.ts   # 10s polling
├── services/        # Axios instance + interceptors
└── lib/
```

### Geliştirme sunucusu
```bash
cd frontend && npm install && npm run dev
```

### Önemli tasarım kararları
- `useComputerStore`: `Map<computerId, ComputerDTO>` — selector pattern ile tek PC güncellemede tüm grid render edilmez
- `React.memo` ile `ComputerCell` sarılması zorunlu
- Axios interceptor: 401 → token refresh → retry. 2. 401 → logout
- `<ErrorBoundary>` her route için zorunlu

## 12. Backend Geliştirme

### Çalıştırma (Docker olmadan)
```bash
# PostgreSQL lokal kurulu olmalı
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

### Paket yapısı
```
src/main/java/com/clms/
├── auth/
├── lab/
├── computer/
├── issue/
├── analytics/
├── common/
│   ├── exception/   # AppException hiyerarşisi
│   ├── dto/         # ApiResponse wrapper
│   └── advice/      # @RestControllerAdvice
└── config/
    ├── SecurityConfig.java
    └── Bucket4jConfig.java
```

### Mimari kurallar özeti
- N+1 sorunu: `@EntityGraph` veya `JOIN FETCH` zorunlu
- Entity → Controller dönüşü yasak; her entity için MapStruct mapper
- Business logic Controller'da olmaz
- SQL injection: yalnızca JPA parametrik sorgular

## 13. Güvenlik Notları

- JWT secret minimum 256 bit (bkz. `.env.example`)
- `lab_api_key` üretimi: `openssl rand -hex 32`
- `refresh_tokens` tablosu rotate-on-use stratejisi (token rotation)
- Bucket4j ile `/computers/{id}/issues` rate limiting (429)
- DB ve backend servisleri Docker `internal` ağında — dışarıya kapalı
- `reporter_ip` GDPR kapsamında değerlendirilebilir — saklama politikası belirlenmelidir
- Production'da TLS zorunlu (Nginx cert mount noktası: `./nginx/certs/`)

## 14. Bilinen Kısıtlamalar

- `last_seen_at` yalnızca PC startup'ında güncellenir; gerçek zamanlı "online/offline" takibi yapılamaz
- Sistem tek kurum içindir; multi-tenant mimari bu versiyonda desteklenmez
- Issue bildirimleri polling (10s) ile güncellenir; WebSocket desteği yoktur
- Grid'e yerleştirilmemiş (NULL konum) PC'ler ADMIN tarafından manuel yerleştirilmelidir

## 15. Katkıda Bulunma

- Branch stratejisi (main / develop / feature/*)
- Commit mesaj formatı (Conventional Commits)
- PR şablonu
- Test gereksinimleri (unit + integration)
- Flyway migration adlandırma kuralı: `V{n}__{açıklama}.sql`

## 16. Lisans

MIT License — ayrıntılar için [LICENSE](./LICENSE) dosyasına bakın.
