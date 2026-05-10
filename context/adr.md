# Architecture Decision Records (ADR)
# Computer Lab Management System (CLMS)

---

## ADR-001: Veritabanı Olarak MySQL 8.0 Seçimi

- **Tarih:** 2025-05
- **Durum:** Kabul Edildi

### Bağlam
Proje başlangıcında PostgreSQL 16 planlanmıştı. Kurumun mevcut sunucu altyapısı ve
IT ekibinin operasyonel deneyimi değerlendirildiğinde MySQL 8.0'ın tercih edilmesi
gerekti. Her iki veritabanı da projenin ihtiyaçlarını karşılayabilecek olgunluktadır.

### Karar
Veritabanı olarak MySQL 8.0 (InnoDB) kullanılmasına karar verildi.

### Sonuçlar
**Olumlu:**
- Kurumun mevcut DBA bilgisi ve yedekleme altyapısıyla uyumlu.
- MySQL 8.0, `JSON` tip desteği, window function'lar ve `CHECK` kısıtları
  ile modern uygulama gereksinimlerini karşılıyor.
- `CHAR(36)` + `DEFAULT (UUID())` ile uygulama katmanına UUID üretimi bırakılmıyor.

**Olumsuz / Trade-off:**
- PostgreSQL'in `MACADDR`, `INET`, `CITEXT`, `JSONB` (index destekli) native tipleri
  kullanılamıyor; bu validasyonlar uygulama katmanına veya `CHECK` kısıtlarına taşındı.
- Partial index desteği yok; `UNIQUE(lab_id, grid_row, grid_col)` kısıtının
  NULL davranışı MySQL semantiğine göre yeniden değerlendirildi
  (NULL != NULL, bu durum lehimize çalışıyor).
- `TIMESTAMPTZ` yerine `DATETIME(6)` kullanılıyor; timezone yönetimi
  JDBC bağlantı dizisindeki `serverTimezone=UTC` ile sağlanıyor.

---

## ADR-002: JWT Access Token + Rotate-on-Use Refresh Token Stratejisi

- **Tarih:** 2025-05
- **Durum:** Kabul Edildi

### Bağlam
Kimlik doğrulama için stateless ve ölçeklenebilir bir çözüm gerekiyordu.
Session tabanlı auth, yatay ölçekleme senaryolarında yapışkan oturum (sticky session)
sorunu yaratır. Aynı zamanda ileride OAuth2/OIDC entegrasyonuna açık bir mimari
hedeflendi.

### Karar
- Access token: 15 dakika ömürlü, imzalı JWT (HS256), sunucuda saklanmıyor.
- Refresh token: 7 gün ömürlü, `refresh_tokens` tablosunda SHA-256 hash'i saklanıyor.
  Her kullanımda yeni token üretilip eskisi revoke ediliyor (rotate-on-use).
- `AuthenticationProvider` soyutlaması kullanılıyor; ileride OIDC provider
  eklenebilir hale getiriliyor.

### Sonuçlar
**Olumlu:**
- Access token stateless; her request'te DB sorgusu gerekmiyor.
- Refresh token rotation, çalınan token'ların tekrar kullanılmasını engeller:
  eski token ile istek gelirse tüm kullanıcı oturumları revoke edilir (token theft detection).
- `AuthenticationProvider` soyutlaması sayesinde Keycloak / Azure AD entegrasyonu
  mevcut güvenlik altyapısını bozmadan eklenebilir.

**Olumsuz / Trade-off:**
- 15 dakikalık access token süresi içinde revoke mümkün değil (blacklist tutulmadığı
  sürece). Güvenlik ihlali durumunda 15 dakika beklenmek zorunda kalınabilir.
  Bu süre kurumun risk toleransıyla orantılı kabul edildi.
- `refresh_tokens` tablosu büyüyebilir; `expires_at < NOW() AND revoked = 1`
  koşulunu temizleyen bir scheduled job eklenmeli (Sohbet 3 kapsamı).

---

## ADR-003: Rate Limiting için Bucket4j (IP Bazlı)

- **Tarih:** 2025-05
- **Durum:** Kabul Edildi

### Bağlam
QR formundan gelen anonim arıza bildirimleri (`POST /computers/{id}/issues`) kötüye
kullanıma açıktır. Harici bir API gateway veya Nginx limit modülü mevcut değil;
uygulama içinde çözüm gerekiyor. Redis gibi harici bir bağımlılık eklenmek istenmiyor.

### Karar
Bucket4j kütüphanesi, `ConcurrentHashMap` backend ile kullanılacak.
IP başına 1 istek/dakika limiti uygulanacak. Limit aşılırsa `429 Too Many Requests`
dönecek. Konfigürasyon `Bucket4jConfig.java` içinde merkezi olarak yönetilecek.

### Sonuçlar
**Olumlu:**
- Sıfır harici bağımlılık; Redis, Memcached gerektirmiyor.
- Token bucket algoritması, anlık spike'lara karşı sliding window'dan daha toleranslı.
- `ConcurrentHashMap` backend thread-safe; tek JVM instance için yeterli.

**Olumsuz / Trade-off:**
- Yatay ölçekleme (multiple backend instance) durumunda her instance kendi bucket'ını
  tutar; dağıtık rate limiting sağlanamaz. Bu sistemin tek instance çalışacağı öngörüldüğünden
  kabul edilebilir. İleride dağıtık ihtiyaç doğarsa Bucket4j'nin Redis backend'i
  kod değişikliği minimumda tutularak eklenebilir.
- IP'nin NAT arkasında olduğu durumlarda (okul ağı) tüm öğrenciler aynı IP'yi
  paylaşabilir. Bu risk kabul edildi; limiti `X-Forwarded-For` header'ına göre
  ayarlamak opsiyonel iyileştirme olarak not edildi.

---

## ADR-004: DTO Dönüşümü için MapStruct (Manuel Mapping Yerine)

- **Tarih:** 2025-05
- **Durum:** Kabul Edildi

### Bağlam
Entity'lerin doğrudan Controller'dan dönülmesi hem güvenlik açığı (istenmeyen
alan ifşası) hem de katman bozulması yaratır. Manuel mapping ise tekrarlı,
hata-prone ve bakımı zor koddur. ModelMapper gibi reflection bazlı çözümler
compile-time güvenliği sunmuyor.

### Karar
Her feature altında `mapper/` paketi oluşturulacak ve MapStruct kullanılacak.
Entity asla Controller'dan dönülmeyecek. Tüm dönüşümler `@Mapper` interface'leri
üzerinden yapılacak.

### Sonuçlar
**Olumlu:**
- Compile-time kod üretimi; runtime reflection yok, performans kaybı yok.
- Eşleşmeyen alanlar için derleme uyarısı alınır; hata erken yakalanır.
- `@Mapping(ignore = true)` ile hassas alanların (password_hash vb.)
  response'a sızması derleme zamanında engellenir.
- IDE refactor desteği çalışır; alan adı değiştiğinde mapper kırılır ve görülür.

**Olumsuz / Trade-off:**
- İlk kurulum (annotation processor konfigürasyonu) biraz sürtüşme yaratır.
- Lombok ile birlikte kullanımda `annotationProcessorPaths` sırası önemli;
  Lombok'un MapStruct'tan önce işlenmesi gerekir (`pom.xml`'de sıra korunacak).

---

## ADR-005: Lombok + Java Record Hibrit Stratejisi

- **Tarih:** 2025-05
- **Durum:** Kabul Edildi

### Bağlam
Boilerplate azaltmak için iki yaklaşım değerlendirildi: tüm sınıflarda Lombok
kullanmak veya Java 16+ Record'larını tercih etmek. İkisinin de farklı güçlü
olduğu senaryolar var.

### Karar
- **JPA Entity'leri:** `@Data` yerine `@Getter @Setter @NoArgsConstructor`
  kullanılır. `@Data`'nın ürettiği `equals/hashCode` JPA proxy'leriyle
  uyumsuz olabileceğinden kaçınılır.
- **Request/Response DTO'ları:** Immutable ve validation-annotated olanlar
  için `@Builder` + `@Value` (Lombok) tercih edilir.
- **Küçük, immutable veri taşıyıcıları** (`HardwareSpecs`, `TopFaultyComputer`,
  `ApiResponse` gibi): Java Record kullanılır.
- **Config sınıfları:** Lombok `@RequiredArgsConstructor` (constructor injection için).

### Sonuçlar
**Olumlu:**
- Record'lar immutability'yi dil seviyesinde garanti eder; DTO'ların
  yanlışlıkla mutate edilmesi önlenir.
- JPA entity'lerinde `@Data` pitfall'ından kaçınılır.
- Her sınıf tipi için en uygun araç seçilir.

**Olumsuz / Trade-off:**
- Kod tabanında iki farklı stil var; yeni geliştiriciler için kısa bir
  onboarding notu gerekir. Bu, ADR ve README'de belgelenecek.

---

## ADR-006: Spring Data Auditing (@EnableJpaAuditing)

- **Tarih:** 2025-05
- **Durum:** Kabul Edildi

### Bağlam
`created_at` ve `updated_at` alanlarını her `save()` çağrısında elle set etmek
tekrarlı ve atlanmaya açık. MySQL'in `ON UPDATE CURRENT_TIMESTAMP` trigger'ı
DB seviyesinde `updated_at`'i yönetiyor; ancak `created_at` için uygulama
katmanında da bir güvence olması tercih edildi.

### Karar
`@EnableJpaAuditing` aktif edilecek. Entity base class'ı (`BaseEntity`) oluşturulacak:
`@CreatedDate`, `@LastModifiedDate` annotation'ları ile `created_at` / `updated_at`
Spring tarafından otomatik set edilecek. MySQL trigger ikincil güvence olarak kalacak.

### Sonuçlar
**Olumlu:**
- `created_at` / `updated_at` hiçbir Service metodunda elle set edilmez.
- Test ortamında `AuditorAware` mock'lanabilir; tutarlı test yazımı kolaylaşır.
- `BaseEntity`'den kalıtım, tüm entity'lerde audit alanlarının varlığını garanti eder.

**Olumsuz / Trade-off:**
- `@EntityListeners(AuditingEntityListener.class)` her entity'e (veya BaseEntity'e)
  eklenmeli; unutulursa auditing çalışmaz. BaseEntity ile tek noktadan yönetilerek
  bu risk elimine edildi.

---

## ADR-007: UUID Üretimi — DB Default (JPA @GeneratedValue Yerine)

- **Tarih:** 2025-05
- **Durum:** Kabul Edildi

### Bağlam
JPA'nın `@GeneratedValue(strategy = GenerationType.UUID)` ile UUID üretmesi
mümkün; ancak bu durumda her `persist()` öncesinde JPA rastgele UUID üretir ve
entity'nin `id`'si `INSERT` öncesinde belirlenir. Alternatif olarak DB'nin
`DEFAULT (UUID())` ifadesini kullanmak da mümkün.

### Karar
Entity'lerde `@GeneratedValue` kullanılmayacak. `@Column(insertable = false)`
ile `id` alanı JPA tarafından `INSERT` sorgusuna dahil edilmeyecek; DB'nin
`DEFAULT (UUID())` ifadesi devreye girecek. `persist()` sonrası JPA, DB'nin
ürettiği `id`'yi `@GeneratedValue` olmadan `@Id` alanına yansıtmak için
`SELECT LAST_INSERT_ID()` yerine Hibernate'in `RETURNING` mekanizmasını
veya `refresh()` çağrısını kullanacak şekilde konfigüre edilecek.

> **Uygulama notu:** Pratikte en temiz yol entity constructor'ında
> `this.id = UUID.randomUUID().toString()` ile uygulama tarafında
> üretmek ve `@Column(updatable = false)` ile kilitlemektir.
> Bu, DB round-trip'ini de ortadan kaldırır ve test edilebilirliği artırır.
> Bu yaklaşım benimsenecektir.

### Sonuçlar
**Olumlu:**
- `persist()` öncesinde `id` biliniyor; ilişki kurma ve test yazımı kolaylaşıyor.
- DB'ye bağımlılık azalıyor; in-memory test'lerde (H2) ayrı konfigürasyon gerekmez.
- UUID v4 çakışma olasılığı ihmal edilebilir düzeyde.

**Olumsuz / Trade-off:**
- UUID primary key'ler, sıralı `BIGINT`'e göre InnoDB B-tree index'ini
  daha çok fragmente eder. Bu sistemin ölçeğinde (maks birkaç bin satır)
  ölçülebilir bir performans etkisi beklenmemektedir.

---

## ADR-008: HardwareSpecs Typed Record (Map\<String, Object\> Yerine)

- **Tarih:** 2025-05
- **Durum:** Kabul Edildi

### Bağlam
`hardware_specs` alanı DB'de `JSON` tipinde tutuluyor. Bu veriyi Java tarafında
`Map<String, Object>` veya ham `JsonNode` olarak işlemek mümkün; ancak tip güvenliği
ve IDE desteği zayıf kalıyor. DTO katmanında `HardwareSpecs` adlı bir Record
tanımlanması değerlendirildi.

### Karar
`HardwareSpecs` adlı bir Java Record oluşturulacak:
```java
public record HardwareSpecs(String cpu, Integer ramGb, Integer diskGb, String os) {}
```
JPA entity'sinde `@Convert` ile `AttributeConverter<HardwareSpecs, String>` (JSON
serialize/deserialize) veya `@JdbcTypeCode(SqlTypes.JSON)` (Hibernate 6) kullanılacak.
MapStruct mapper bu Record'u DTO'ya dönüştürecek.

### Sonuçlar
**Olumlu:**
- `specs.cpu()` gibi type-safe erişim; `map.get("cpu")` cast hatası yok.
- Swagger/OpenAPI şeması otomatik olarak `HardwareSpecs` nesnesini belgeler.
- Yeni alan eklenmesi derleme zamanında tüm kullanım noktalarını kırar; eksik
  kalma riski önlenir.
- Validation annotation'ları Record bileşenlerine eklenebilir.

**Olumsuz / Trade-off:**
- DB'deki JSON şeması değişirse (ör. yeni alan eklenmesi) Record güncellenmeli;
  ancak bu bir avantaj olarak da değerlendirilebilir (breaking change görünür hale gelir).
- Bilinmeyen / dinamik alanlar için esneklik kaybı var. Donanım envanteri için
  alan seti sabit kabul edildiğinden bu trade-off kabul edildi.

---

## ADR-009: Soft Delete — `is_active` Flag + Decommission Durumu

- **Tarih:** 2025-05
- **Durum:** Kabul Edildi

### Bağlam
Bir bilgisayar fiziksel olarak kaldırıldığında DB'den silinmesi durumunda
o PC'ye ait `issues` ve `issue_history` kayıtları referans bütünlüğü nedeniyle
ya silinmek ya da orphan kalmak zorunda kalacak. Her iki seçenek de audit trail
açısından kabul edilemez.

### Karar
Hard delete kullanılmayacak. İki katmanlı soft delete stratejisi uygulanacak:

1. `computers.is_active = false`: PC sistemden görünmez hale gelir ama kayıt kalır.
2. `computers.status = DECOMMISSIONED`: PC'nin hizmet dışı bırakıldığını semantik
   olarak belirtir. Bu durum `PATCH /computers/{id}/decommission` endpoint'i ile
   set edilir ve aynı anda `is_active = false` yapılır.

`IssueRepository` ve `ComputerRepository`'deki tüm sorgular varsayılan olarak
`WHERE is_active = true` filtresi içerecek; Spring Data `@Query` veya
`@FilterDef` (Hibernate Filter) ile uygulanacak.

### Sonuçlar
**Olumlu:**
- `issue_history` audit trail hiçbir zaman bozulmaz.
- Yanlışlıkla decommission edilen PC geri alınabilir (`is_active = true`).
- Tarihi raporlama için tüm PC verisi erişilebilir kalır.

**Olumsuz / Trade-off:**
- Tüm sorgulara `is_active` filtresi eklenmesi zorunlu; unutulursa decommission
  edilmiş PC'ler ekrana sızabilir. `@Where(clause = "is_active = true")`
  Hibernate annotation'ı entity seviyesinde eklenerek bu risk azaltılacak.

---

## ADR-010: MySQL JSON (PostgreSQL JSONB Yerine)

- **Tarih:** 2025-05
- **Durum:** Kabul Edildi

### Bağlam
`hardware_specs` alanı için esnek bir yapı gerekiyordu. PostgreSQL'in `JSONB` tipi
binary depolama, GIN index ve JSON operatörleri sunar. MySQL 8.0'ın `JSON` tipi
ise metin tabanlı depolama yapar; JSON path expression desteği var ama JSONB
kadar olgun değil.

### Karar
MySQL `JSON` tipi kullanılacak. `hardware_specs` üzerinde JSON path sorgusu
(`JSON_EXTRACT`) çalıştırılmayacak; tüm filtreleme uygulama katmanında yapılacak.
Bu alan yalnızca `HardwareSpecs` Record'una deserialize edilerek okunacak.

### Sonuçlar
**Olumlu:**
- MySQL `JSON` tipi, geçersiz JSON'ın kaydedilmesini DB seviyesinde engeller.
- `hardware_specs` üzerinde sorgulama gereksinimi yok; sadece oku/yaz.
  Bu kullanım için `JSON` tipi yeterli.

**Olumsuz / Trade-off:**
- İleride donanım özelliklerine göre filtreleme/sıralama gerekirse
  (ör. "RAM >= 16 GB olan PC'leri listele") `JSON_EXTRACT` kullanılması
  veya ayrı kolonlara taşınması gerekecek. Bu ihtiyaç şu an yok;
  gerekirse `V3` migration ile genişletilebilir.

---

## ADR-011: Frontend — Feature-Based Klasör Yapısı

- **Tarih:** 2025-05
- **Durum:** Kabul Edildi

### Bağlam
Frontend klasör yapısı için iki ana yaklaşım değerlendirildi:
- **Type-based:** `components/`, `hooks/`, `services/` (tüm hook'lar bir arada)
- **Feature-based:** `routes/grid/`, `components/grid/`, her feature kendi
  alt klasöründe

### Karar
Hibrit feature-based yapı benimsendi: `components/`, `hooks/`, `services/`
ana klasörleri korundu; bunların altındaki dosyalar feature'a göre gruplandı.
`routes/` klasörü sayfa bileşenlerini feature'a göre organize etti.

### Sonuçlar
**Olumlu:**
- Bir feature üzerinde çalışırken ilgili dosyalar birbirine yakın;
  `grid/` için `routes/grid/`, `components/grid/`, `stores/useComputerStore.ts`.
- Yeni feature eklemek için mevcut yapıya yeni klasör açmak yeterli.
- Code splitting (React.lazy + Suspense) route bazında doğal hale gelir.

**Olumsuz / Trade-off:**
- Paylaşılan bileşenler için `components/common/` sınırı belirsizleşebilir.
  Kural: iki veya daha fazla feature kullanan bileşen `common/`'a taşınır.

---

## ADR-012: Global State için Zustand (Redux Yerine)

- **Tarih:** 2025-05
- **Durum:** Kabul Edildi

### Bağlam
Frontend state yönetimi için Redux Toolkit, Zustand ve React Query/Context API
değerlendirildi. Redux Toolkit olgun ve yaygın; ancak bu projenin ölçeği için
boilerplate maliyeti yüksek. React Query server state için uygun ama client
state (auth, seçili lab) için ayrı bir çözüm gerektiriyor.

### Karar
Zustand kullanılacak. Store'lar feature bazında bölünecek:
- `useAuthStore`: user, accessToken, login/logout
- `useLabStore`: selectedLabId, labList
- `useComputerStore`: `Map<computerId, ComputerDTO>` — selector pattern
- `useIssueStore`: issues listesi, pending approvals

`useComputerStore`'da `Map<computerId, ComputerDTO>` yapısı kullanılacak;
tek bir PC güncellemesinde `useStore(state => state.computers.get(id))`
selector'ı yalnızca o PC'nin `ComputerCell` bileşenini re-render edecek.

### Sonuçlar
**Olumlu:**
- Sıfır boilerplate: action, reducer, selector ayrımı yok.
- Selector pattern ile `React.memo` kombinasyonu, grid'deki
  tekil PC güncellemelerinde tüm grid'in yeniden render edilmesini önler.
- Devtools desteği var (Zustand devtools middleware).
- Bundle size: ~3 KB (Redux Toolkit ~12 KB).

**Olumsuz / Trade-off:**
- Redux'un `immer` entegrasyonu kadar olgun bir immutability garantisi yok;
  state mutation'ına karşı dikkatli olunmalı. Store içinde spread operatörü
  zorunlu kılınacak (lint kuralı eklenecek).
- Ekip Redux'a alışkınsa geçiş eğrisi var; ancak Zustand API'si daha basit
  olduğundan bu süre kısa.
