# 🔌 WebSocket API для совместного редактирования заметок

## 📡 Подключение

### Базовое подключение

```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  query: { token: "your-jwt-token" },
  transports: ["websocket", "polling"],
});
```

### Параметры подключения

- **URL**: `ws://<host>:<port>` (используется Socket.IO)
- **Авторизация**: JWT-токен передаётся в query-параметре `token`
- **Транспорт**: WebSocket с fallback на polling

### Обработка событий подключения

```javascript
socket.on("connect", () => {
  console.log("Подключено к серверу");
});

socket.on("disconnect", () => {
  console.log("Отключено от сервера");
});

socket.on("connect_error", (error) => {
  console.error("Ошибка подключения:", error);
});
```

---

## 📤 События клиента (отправка)

### `join` - Войти в комнату заметки

Начать совместное редактирование заметки.

```javascript
socket.emit("join", { noteId: 123 });
```

**Payload:**

```typescript
{
  noteId: number; // ID заметки для совместного редактирования
}
```

**Результат:**

- При успехе: получаете событие `users` со списком участников
- При ошибке: получаете событие `error` с сообщением

### `leave` - Покинуть комнату заметки

Завершить совместное редактирование.

```javascript
socket.emit("leave", { noteId: 123 });
```

**Payload:**

```typescript
{
  noteId: number; // ID заметки
}
```

### `caret` - Обновить позицию курсора

Отправить текущую позицию курсора/выделения.

```javascript
socket.emit("caret", {
  noteId: 123,
  caret: { start: 10, end: 15 },
});
```

**Payload:**

```typescript
{
  noteId: number,
  caret: {
    start: number,  // Начальная позиция курсора
    end: number     // Конечная позиция курсора (для выделения)
  }
}
```

### `edit` - Отправить изменения текста

Отправить изменения содержимого заметки.

```javascript
socket.emit("edit", {
  noteId: 123,
  content: "новый текст заметки",
});
```

**Payload:**

```typescript
{
  noteId: number,
  content: string  // Новое содержимое заметки
}
```

---

## 📥 События сервера (получение)

### `users` - Список участников

Получение списка всех пользователей в комнате с их позициями курсоров.

```javascript
socket.on("users", (users) => {
  console.log("Участники в комнате:", users);
  // Обновить UI с курсорами других пользователей
});
```

**Payload:**

```typescript
Array<{
  userId: number;
  caret: {
    start: number;
    end: number;
  };
}>;
```

### `edit` - Изменения от других пользователей

Получение изменений от других участников.

```javascript
socket.on("edit", (data) => {
  console.log("Изменение от пользователя:", data.userId);
  console.log("Новое содержимое:", data.content);
  // Применить изменения к локальному редактору
});
```

**Payload:**

```typescript
{
  userId: number,   // ID пользователя, который внес изменения
  content: string   // Новое содержимое заметки
}
```

### `error` - Ошибки

Получение ошибок авторизации или доступа.

```javascript
socket.on("error", (message) => {
  console.error("Ошибка WebSocket:", message);
  // Показать пользователю сообщение об ошибке
});
```

**Payload:**

```typescript
string; // Сообщение об ошибке
```

### `auth` - Статус авторизации

Подтверждение успешной авторизации.

```javascript
socket.on("auth", (message) => {
  console.log("Статус авторизации:", message);
});
```

**Payload:**

```typescript
string; // "Авторизация успешна" или "Нет токена"
```

---

## 🎯 Полный пример использования

```javascript
import { io } from "socket.io-client";

class NotesCollaboration {
  constructor(token) {
    this.socket = io("http://localhost:3000", {
      query: { token },
      transports: ["websocket", "polling"],
    });

    this.setupEventHandlers();
  }

  setupEventHandlers() {
    // Подключение
    this.socket.on("connect", () => {
      console.log("✅ Подключено к серверу");
    });

    this.socket.on("disconnect", () => {
      console.log("❌ Отключено от сервера");
    });

    // Авторизация
    this.socket.on("auth", (message) => {
      console.log("🔐", message);
    });

    // Участники
    this.socket.on("users", (users) => {
      console.log("👥 Участники:", users);
      this.updateUserCursors(users);
    });

    // Изменения
    this.socket.on("edit", ({ userId, content }) => {
      console.log("✏️ Изменение от пользователя", userId);
      this.applyRemoteChanges(content);
    });

    // Ошибки
    this.socket.on("error", (message) => {
      console.error("🚨 Ошибка:", message);
      this.showError(message);
    });
  }

  // Присоединиться к заметке
  joinNote(noteId) {
    this.socket.emit("join", { noteId });
  }

  // Покинуть заметку
  leaveNote(noteId) {
    this.socket.emit("leave", { noteId });
  }

  // Обновить позицию курсора
  updateCaret(noteId, start, end) {
    this.socket.emit("caret", {
      noteId,
      caret: { start, end },
    });
  }

  // Отправить изменения
  sendEdit(noteId, content) {
    this.socket.emit("edit", { noteId, content });
  }

  // Отключиться
  disconnect() {
    this.socket.disconnect();
  }

  // UI методы (реализуются на фронтенде)
  updateUserCursors(users) {
    // Обновить курсоры других пользователей в редакторе
  }

  applyRemoteChanges(content) {
    // Применить изменения от других пользователей
  }

  showError(message) {
    // Показать ошибку пользователю
  }
}

// Использование
const collaboration = new NotesCollaboration("your-jwt-token");

// Присоединиться к заметке
collaboration.joinNote(123);

// При изменении курсора в редакторе
editor.onCursorChange((start, end) => {
  collaboration.updateCaret(123, start, end);
});

// При изменении текста
editor.onContentChange((content) => {
  collaboration.sendEdit(123, content);
});
```

---

## 🔧 Интеграция с популярными редакторами

### Monaco Editor (VS Code)

```javascript
// Создание редактора
const editor = monaco.editor.create(document.getElementById("editor"), {
  value: initialContent,
  language: "markdown",
});

// Отслеживание изменений курсора
editor.onDidChangeCursorPosition((e) => {
  const position = e.position;
  const offset = editor.getModel().getOffsetAt(position);
  collaboration.updateCaret(noteId, offset, offset);
});

// Отслеживание изменений содержимого
editor.onDidChangeModelContent((e) => {
  const content = editor.getValue();
  collaboration.sendEdit(noteId, content);
});
```

### CodeMirror

```javascript
const editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
  mode: "markdown",
  lineNumbers: true,
});

// Отслеживание изменений курсора
editor.on("cursorActivity", () => {
  const cursor = editor.getCursor();
  const offset = editor.indexFromPos(cursor);
  collaboration.updateCaret(noteId, offset, offset);
});

// Отслеживание изменений содержимого
editor.on("change", () => {
  const content = editor.getValue();
  collaboration.sendEdit(noteId, content);
});
```

### Quill Editor

```javascript
const quill = new Quill("#editor", {
  theme: "snow",
  modules: {
    toolbar: true,
  },
});

// Отслеживание изменений курсора
quill.on("selection-change", (range) => {
  if (range) {
    collaboration.updateCaret(noteId, range.index, range.index + range.length);
  }
});

// Отслеживание изменений содержимого
quill.on("text-change", () => {
  const content = quill.root.innerHTML;
  collaboration.sendEdit(noteId, content);
});
```

---

## 🛡️ Безопасность и ограничения

### Права доступа

- ✅ **Владелец заметки** - полный доступ к совместному редактированию
- ✅ **Коллаборатор** - полный доступ к совместному редактированию
- ❌ **Обычный пользователь** - доступ запрещен

### Проверки на сервере

- Валидация JWT токена при подключении
- Проверка прав доступа к заметке при присоединении к комнате
- Автоматическое отключение при потере прав доступа

### Рекомендации по безопасности

```javascript
// Всегда проверяйте токен перед подключением
if (!isValidToken(token)) {
  throw new Error("Недействительный токен");
}

// Обрабатывайте ошибки авторизации
socket.on("error", (message) => {
  if (message.includes("Нет доступа")) {
    // Перенаправить на страницу входа
    window.location.href = "/login";
  }
});
```

---

## 🎨 Рекомендации по UI/UX

### Отображение курсоров

```javascript
// Рекомендуемые цвета для курсоров пользователей
const userColors = {
  1: "#FF6B6B", // Красный
  2: "#4ECDC4", // Бирюзовый
  3: "#45B7D1", // Синий
  4: "#96CEB4", // Зеленый
  5: "#FFEAA7", // Желтый
  6: "#DDA0DD", // Фиолетовый
  7: "#98D8C8", // Мятный
  8: "#F7DC6F", // Золотой
};

function getCursorColor(userId) {
  return userColors[userId] || "#999999";
}
```

### Индикаторы состояния

```javascript
// Показывать индикатор "Пользователь печатает..."
let typingTimeout;

function showTypingIndicator(userId) {
  clearTimeout(typingTimeout);
  document.getElementById("typing-indicator").style.display = "block";

  typingTimeout = setTimeout(() => {
    document.getElementById("typing-indicator").style.display = "none";
  }, 3000);
}

// При получении изменений
socket.on("edit", ({ userId }) => {
  showTypingIndicator(userId);
});
```

---

## 🐛 Отладка

### Включение логирования

```javascript
const socket = io("http://localhost:3000", {
  query: { token: "your-jwt-token" },
  debug: true, // Включает подробное логирование
});
```

### Проверка состояния соединения

```javascript
console.log("Подключен:", socket.connected);
console.log("ID сокета:", socket.id);
console.log("Транспорт:", socket.io.engine.transport.name);
```

### Мониторинг событий

```javascript
// Логирование всех событий
const originalEmit = socket.emit;
socket.emit = function (event, ...args) {
  console.log("📤 Отправка:", event, args);
  return originalEmit.apply(this, [event, ...args]);
};

socket.onAny((event, ...args) => {
  console.log("📥 Получение:", event, args);
});
```

---

## 📚 Дополнительные ресурсы

- [Socket.IO документация](https://socket.io/docs/)
- [NestJS WebSockets](https://docs.nestjs.com/websockets/gateways)
- [Примеры интеграции с редакторами](./examples/)
- [Troubleshooting guide](./troubleshooting.md)
