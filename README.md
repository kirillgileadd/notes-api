# 📝 Notes API

Современное веб-приложение для создания, редактирования и совместной работы с заметками в реальном времени.

[![NestJS](https://img.shields.io/badge/NestJS-10.0-red.svg)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-blue.svg)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-blue.svg)](https://www.postgresql.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--time-green.svg)](https://socket.io/)

## ✨ Возможности

- 🔐 **SMS аутентификация** - Регистрация и вход по номеру телефона
- 📝 **Управление заметками** - Создание, редактирование, архивирование
- 🏷️ **Тегирование** - Организация заметок по категориям
- 💬 **Комментарии и реакции** - Обсуждение заметок с эмодзи-реакциями
- 👥 **Совместная работа** - Редактирование в реальном времени с WebSocket
- 📅 **Дедлайны** - Установка сроков выполнения для заметок
- 🔗 **Публичные ссылки** - Делитесь заметками без регистрации
- 📱 **Адаптивный дизайн** - Работает на всех устройствах

## 🚀 Быстрый старт

### Требования

- Node.js 18+
- PostgreSQL 12+
- Docker (опционально)

### Установка

```bash
# Клонирование репозитория
git clone <repository-url>
cd notes-api

# Установка зависимостей
npm install

# Настройка переменных окружения
cp .env.example .env
```

### Настройка базы данных

```bash
# Запуск PostgreSQL через Docker
docker-compose up -d

# Применение миграций
npm run prisma:migrate

# Заполнение тестовыми данными (опционально)
npm run prisma:seed
```

### Запуск

```bash
# Режим разработки
npm run start:dev

# Продакшн режим
npm run start:prod
```

Приложение будет доступно по адресу: http://localhost:3000

## 📚 Документация

- [📊 ER Диаграмма](./docs/ER_DIAGRAM.md) - Структура базы данных
- [🎯 Техническое задание](./docs/FRONTEND_TECHNICAL_SPECIFICATION.md) - Use cases для фронтенда
- [🔌 WebSocket API](./docs/WEBSOCKET_API.md) - Real-time функции
- [📋 Резюме проекта](./docs/PROJECT_SUMMARY.md) - Обзор возможностей
- [🔗 Swagger UI](http://localhost:3000/api) - Интерактивная документация API

## 🛠️ API Endpoints

### Аутентификация

```http
POST /auth/send-sms     # Отправка SMS кода
POST /auth/login        # Вход по SMS коду
POST /auth/refresh      # Обновление токена
```

### Заметки

```http
GET    /notes                    # Список заметок
GET    /notes/archived          # Архивные заметки
POST   /notes                   # Создание заметки
GET    /notes/:id               # Получение заметки
PATCH  /notes/:id               # Обновление заметки
DELETE /notes/:id               # Удаление заметки
POST   /notes/:id/pin           # Закрепление
POST   /notes/:id/archive       # Архивирование
POST   /notes/:id/deadline      # Установка дедлайна
POST   /notes/:id/share         # Публичная ссылка
GET    /notes/public/:token     # Публичная заметка
```

### Теги

```http
GET    /tags           # Список тегов
POST   /tags           # Создание тега
PATCH  /tags/:id       # Обновление тега
DELETE /tags/:id       # Удаление тега
```

### Комментарии

```http
GET    /notes/:noteId/comments           # Список комментариев
POST   /notes/:noteId/comments           # Создание комментария
PATCH  /notes/:noteId/comments/:id       # Обновление комментария
DELETE /notes/:noteId/comments/:id       # Удаление комментария
```

## 🔌 WebSocket Events

### Подключение

```javascript
const socket = io("http://localhost:3000", {
  query: { token: "your-jwt-token" },
});
```

### События

```javascript
// Присоединение к заметке
socket.emit("join", { noteId: 123 });

// Обновление курсора
socket.emit("caret", {
  noteId: 123,
  caret: { start: 10, end: 15 },
});

// Отправка изменений
socket.emit("edit", {
  noteId: 123,
  content: "новый текст",
});

// Получение списка пользователей
socket.on("users", (users) => {
  console.log("Пользователи в комнате:", users);
});

// Получение изменений от других
socket.on("edit", ({ userId, content }) => {
  console.log("Изменение от пользователя:", userId, content);
});
```

## 🏗️ Архитектура

```
src/
├── auth/           # Аутентификация и авторизация
├── notes/          # Управление заметками
├── tags/           # Управление тегами
├── comments/       # Комментарии
├── reactions/      # Реакции на комментарии
├── prisma/         # База данных и миграции
└── main.ts         # Точка входа
```

## 🛡️ Безопасность

- JWT токены с автоматическим обновлением
- Валидация всех входных данных
- Проверка прав доступа к заметкам
- Защита от SQL инъекций через Prisma
- CORS настройки для WebSocket

## 📊 База данных

- **PostgreSQL** - Основная база данных
- **Prisma ORM** - Типобезопасный доступ к данным
- **Миграции** - Автоматическое управление схемой
- **Связи** - Многие-ко-многим для тегов и коллабораторов

## 🧪 Тестирование

```bash
# Unit тесты
npm run test

# E2E тесты
npm run test:e2e

# Покрытие кода
npm run test:cov
```

## 🐳 Docker

```bash
# Сборка образа
docker build -t notes-api .

# Запуск контейнера
docker run -p 3000:3000 notes-api

# Docker Compose (база данных + приложение)
docker-compose up -d
```

## 📦 Переменные окружения

```env
# База данных
DATABASE_URL="postgresql://user:password@localhost:5432/notes_db"

# JWT
JWT_SECRET="your-super-secret-key"
JWT_EXPIRES_IN="7d"

# SMS API (опционально)
SMS_API_KEY="your-sms-api-key"
SMS_API_URL="https://api.sms-provider.com"

# Приложение
PORT=3000
NODE_ENV=development
```

## 🤝 Совместная работа

1. Форкните репозиторий
2. Создайте ветку для новой функции (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add amazing feature'`)
4. Отправьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📝 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 📞 Поддержка

- 📧 Email: support@notes-api.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/notes-api/issues)
- 📖 Документация: [docs/](./docs/)

---

⭐ Если проект вам понравился, поставьте звездочку!
