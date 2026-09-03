# Gym Evolution - المساعد الرياضي المتكامل والتغذية الذكية

نموذج أولي تفاعلي عالي الدقة (High-fidelity Prototype) لمنصة إدارة اللياقة البدنية والتمارين اليومية وتتبع التطور الجسدي والتغذية، مصمم بالهوية البصرية العصرية **"Calm White Aesthetic"** المستوحاة من فلسفة Apple وStripe في بساطة ونقاء واجهة المستخدم.

---

## 🏗️ هيكلية المشروع التقنية (File Architecture)

تم تطوير التطبيق باتباع مبادئ **Clean Architecture** (العمارة النظيفة) للفصل بين الكينونات الحيوية (Entities)، ومنطق معالجة البيانات، وطبقة تخزين البيانات، والواجهة الرسومية (UI):

```text
c:/Users/MASTER/Documents/GYM/
├── index.html                       # الهيكل الأساسي للصفحة (HTML5 SPA Wrapper)
├── css/
│   └── styles.css                   # دليل التصميم (Style Guide) والمكونات الرسومية
└── js/
    ├── app.js                       # منظم التطبيق الرئيسي ومحرك التنقل (SPA Router)
    ├── domain/                      # طبقة كينونات العمل وحسابات اللياقة والتغذية (Domain Layer)
    │   ├── bmr.js                   # منطق ومعادلات Mifflin-St Jeor لـ BMR/TDEE والماكروز
    │   └── models.js                # تعريف الكلاسات وبنية البيانات الأساسية (User, Meal, Workout, Exercise, Metric)
    ├── data/                        # طبقة استرجاع وحفظ البيانات (Data Access Layer)
    │   ├── dbSchema.js              # توثيق مخطط قاعدة البيانات العلائقية (Relational SQL Schema)
    │   └── localRepository.js       # مستودع بيانات LocalStorage التفاعلي مع بذر بيانات عينة (Seed Data)
    └── ui/                          # طبقة عرض واجهات المستخدم التفاعلية (Presentation Layer)
        ├── dashboard.js             # محرك لوحة التحكم الرئيسية والملخصات اليومية
        ├── nutrition.js             # صفحة إدارة السعرات وقائمة الوجبات اليومية
        ├── workout.js               # واجهة مخطط التمارين وبناء الجلسات والعدات
        ├── evolution.js             # واجهة رصد التطور البدني ومحرك الرسوم البيانية SVG التفاعلية
        └── notifier.js              # نظام الإشعارات والتنبيهات المخصص (Custom Toast Notifier)
```

---

## 🧮 المعادلات الحيوية المستخدمة (Nutrition Engine)

يستخدم التطبيق معادلة **Mifflin-St Jeor** الشهيرة لحساب معدل الأيض الأساسي (BMR) لكونها الأدق علمياً:

- **للرجال:** 
  $$\text{BMR} = 10 \times \text{الوزن (كجم)} + 6.25 \times \text{الطول (سم)} - 5 \times \text{العمر (سنوات)} + 5$$
- **للنساء:** 
  $$\text{BMR} = 10 \times \text{الوزن (كجم)} + 6.25 \times \text{الطول (سم)} - 5 \times \text{العمر (سنوات)} - 161$$

### حساب الاحتياج اليومي TDEE:
يتم ضرب الـ BMR في معامل النشاط المختار:
- خامل جداً: $\text{BMR} \times 1.2$
- نشاط خفيف: $\text{BMR} \times 1.375$
- نشاط متوسط: $\text{BMR} \times 1.55$
- نشاط عالٍ: $\text{BMR} \times 1.725$
- نشاط فائق: $\text{BMR} \times 1.9$

### تقسيم المغذيات الكبرى (Macros Splits):
1. **البروتين:** يتم تخصيص 2 جرام لكل كيلوجرام من وزن الجسم ($2.0 \text{g/kg}$)، ويسهم بـ 4 سعرات حرارية لكل جرام.
2. **الدهون الصحية:** يتم تخصيص 25% من إجمالي السعرات المستهدفة، وتسهم بـ 9 سعرات حرارية لكل جرام.
3. **الكربوهيدرات:** يتم استهلاك السعرات المتبقية وتوزيعها على الكربوهيدرات، وتسهم بـ 4 سعرات حرارية لكل جرام.

---

## 🗄️ مخطط قاعدة البيانات العلائقية (SQL Schema)

لقراءة الكود البرمجي التفصيلي لمخطط الجداول والروابط ومؤشرات الأداء، يرجى الاطلاع على الملف [dbSchema.js](file:///c:/Users/MASTER/Documents/GYM/js/data/dbSchema.js).

```mermaid
erDiagram
    USERS ||--oQ DAILY_LOGS : logs
    USERS ||--oQ WORKOUTS : performs
    USERS ||--oQ EVOLUTION_METRICS : records
    DAILY_LOGS ||--oQ MEALS : contains
    WORKOUTS ||--oQ EXERCISES : includes
    EXERCISES ||--oQ EXERCISE_SETS : details

    USERS {
        string id PK
        string name
        string gender
        int age
        decimal weight_kg
        decimal height_cm
        string activity_level
        string goal
        int custom_calories
    }
    DAILY_LOGS {
        string id PK
        string user_id FK
        date log_date
        int target_calories
    }
    MEALS {
        string id PK
        string daily_log_id FK
        string name
        int calories
        int protein_g
        int carbs_g
        int fat_g
    }
    WORKOUTS {
        string id PK
        string user_id FK
        string name
        boolean completed
        timestamp session_date
    }
    EXERCISES {
        string id PK
        string workout_id FK
        string name
        int sort_order
    }
    EXERCISE_SETS {
        int id PK
        string exercise_id FK
        int set_number
        decimal weight_kg
        int reps
        boolean completed
    }
    EVOLUTION_METRICS {
        string id PK
        string user_id FK
        decimal weight_kg
        decimal body_fat_percentage
        decimal waist_cm
        timestamp logged_at
    }
```

---

## 🚀 كيفية تشغيل واختبار التطبيق محلياً

بما أن التطبيق مكتوب بنظام **ES Modules** لتنظيم الكود (Import/Export)، يتطلب تشغيل الملفات خادماً محلياً (Local Web Server) لتفادي قيود الحماية لبروتوكول `file://` في المتصفحات.

يمكنك تشغيله بثوانٍ معدودة باستخدام إحدى الطرق التالية:

### 1. باستخدام Node.js (Vite / Servor):
قم بفتح نافذة الأوامر Terminal في مجلد المشروع، وشغل الأمر التالي:
```bash
npx -y serve
```
أو
```bash
npx -y http-server
```
ثم افتح الرابط المذكور في المتصفح (مثال: `http://localhost:8080` أو `http://localhost:3000`).

### 2. باستخدام VS Code (ملحق Live Server):
إذا كنت تستخدم محرر VS Code، يمكنك ببساطة النقر بزر الفأرة الأيمن على ملف `index.html` واختيار **Open with Live Server**.
