# WebSocket API для совместного редактирования заметки

## Подключение

- URL: `ws://<host>:<port>` (используется socket.io)
- Авторизация: JWT-токен передаётся в query-параметре `token`

  Пример:

  ```js
  const socket = io("ws://localhost:3000", { query: { token: "JWT_ТОКЕН" } });
  ```

---

## События клиента

### join

Войти в комнату заметки (начать коллаборацию)

- **payload:** `{ noteId: number }`
- **ответ:** событие `users` (см. ниже)

### leave

Покинуть комнату заметки

- **payload:** `{ noteId: number }`

### caret

Обновить позицию caret (каретки/выделения) пользователя

- **payload:** `{ noteId: number, caret: { start: number, end: number } }`

### edit

Отправить изменение текста заметки

- **payload:** `{ noteId: number, content: string }`

---

## События сервера

### users

Список пользователей и их caret в комнате

- **payload:** `[{ userId: number, caret: { start: number, end: number } }]`

### edit

Изменения от других пользователей

- **payload:** `{ userId: number, content: string }`

### error

Ошибка авторизации или доступа

- **payload:** `string`

---

## Пример взаимодействия

```js
// Подключение
const socket = io("ws://localhost:3000", { query: { token: "JWT_ТОКЕН" } });

// Войти в комнату
socket.emit("join", { noteId: 1 });

// Обновить caret
socket.emit("caret", { noteId: 1, caret: { start: 5, end: 5 } });

// Отправить изменение
socket.emit("edit", { noteId: 1, content: "новый текст" });

// Получить список пользователей и их caret
socket.on("users", (users) => {
  /* ... */
});

// Получить изменения от других
socket.on("edit", (data) => {
  /* ... */
});

// Обработка ошибок
socket.on("error", (msg) => {
  alert(msg);
});
```

---

## Примечания

- Только владелец заметки или коллаборатор может подключиться к комнате.
- Все события требуют авторизации через JWT.
- Для отображения caret других пользователей на фронте рекомендуется использовать разные цвета (например, по userId).
