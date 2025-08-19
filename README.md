
🎓 Courses Platform API
📌 Overview
ده مشروع Backend Platform للكورسات معمول باستخدام Node.js + Express + PostgreSQL، مع توثيق كامل بالـ Swagger.
المشروع بيقدم API متكاملة لإدارة الكورسات، التصنيفات، المحاضرين، الـ bookings، الـ watchlist، والمراجعات، مع Authentication آمن جدًا.

🚀 Features
Authentication & Security

JWT + Refresh Tokens (stored in cookies).

Google OAuth login.

OTP login (stored in Redis).

Rate limiting على الـ login.

Password hashing + Phone encryption.

Helmet, HPP, CORS.

Courses & Categories

إدارة التصنيفات (Categories) + عدد الكورسات بداخلها.

رفع فيديو تعريفي وPDF للـ course content.

ربط أكثر من Instructor بالكورس.

Transaction: لو Category اتمسحت → الكورسات بتاعتها تتمسح.

Pagination + Search by name/id.

Best courses section.

Instructors

بيانات كاملة وصورة لكل Instructor.

Reviews

يوزر يقدر يعمل Review للكورس.

Bookings

الحجز يبدأ pending.

Admin يقدر يعمل confirm/cancel.

Cron Job لحذف الـ canceled bookings أول كل شهر.

Watchlist

إضافة/إزالة كورسات في watchlist.

عرض كل الكورسات اللي متضافين.

Emails & Notifications

إرسال ايميلات باستخدام OOP structure.

إشعارات بالحجز والتأكيد.

API Documentation

موثق بالكامل باستخدام Swagger UI.

🛠 Tech Stack
Backend: Node.js, Express

Database: PostgreSQL

Caching / OTP: Redis

Security: JWT, bcrypt, crypto, Helmet, HPP

Docs: Swagger

Deployment Ready

⚙ Installation
# Clone repo
git clone https://github.com/Mohamedawad114/courses_project.git

cd courses-platform

# Install dependencies
npm install

# Run dev server
npm run dev
🔑 Environment Variables
PORT=3000
DATABASE_URL=your_postgres_url
JWT_SECRET=your_secret
REFRESH_SECRET=your_refresh_secret
REDIS_URL=your_redis_url
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
EMAIL_USER=xxx
EMAIL_PASS=xxx
📖 API Docs
بعد ما تشغل السيرفر:

http://localhost:3000/api-docs


For contact
gmail: mohamedahmedawad180@gmaiil.com
