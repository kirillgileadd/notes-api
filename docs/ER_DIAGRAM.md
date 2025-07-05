# ER Диаграмма базы данных Notes API

```mermaid
erDiagram
    User {
        int id PK
        string phone UK
        enum role
        datetime createdAt
        datetime updatedAt
    }

    Token {
        int id PK
        string token
        string userAgent
        int userId FK
        datetime createdAt
    }

    Note {
        int id PK
        string title
        string content
        int userId FK
        datetime createdAt
        datetime updatedAt
        boolean archived
        boolean pinned
        string publicToken UK
        datetime deadline
    }

    Tag {
        int id PK
        string name UK
    }

    Comment {
        int id PK
        string content
        int noteId FK
        int userId FK
        datetime createdAt
    }

    Reaction {
        int id PK
        string emoji
        int commentId FK
        int userId FK
        datetime createdAt
    }

    Collaborator {
        int id PK
        int noteId FK
        int userId FK
        datetime createdAt
    }

    SmsCode {
        string phone PK
        string code
    }

    %% Связи
    User ||--o{ Token : "has"
    User ||--o{ Note : "creates"
    User ||--o{ Comment : "writes"
    User ||--o{ Reaction : "adds"
    User ||--o{ Collaborator : "is"

    Note ||--o{ Comment : "has"
    Note ||--o{ Collaborator : "has"
    Note }o--o{ Tag : "has"

    Comment ||--o{ Reaction : "has"

    %% Уникальные ограничения
    Reaction }|--|| User : "unique(commentId, userId, emoji)"
    Collaborator }|--|| User : "unique(noteId, userId)"
```

## Описание сущностей

### User (Пользователь)

- **id**: Уникальный идентификатор пользователя
- **phone**: Номер телефона (уникальный)
- **role**: Роль пользователя (user, admin, manager)
- **createdAt/updatedAt**: Временные метки

### Token (Токен авторизации)

- **id**: Уникальный идентификатор токена
- **token**: JWT токен
- **userAgent**: Информация о браузере
- **userId**: Ссылка на пользователя
- **createdAt**: Время создания токена

### Note (Заметка)

- **id**: Уникальный идентификатор заметки
- **title**: Заголовок заметки
- **content**: Содержимое заметки
- **userId**: Автор заметки
- **archived**: Архивная заметка
- **pinned**: Закрепленная заметка
- **publicToken**: Токен для публичного доступа
- **deadline**: Дедлайн заметки
- **createdAt/updatedAt**: Временные метки

### Tag (Тег)

- **id**: Уникальный идентификатор тега
- **name**: Название тега (уникальное)

### Comment (Комментарий)

- **id**: Уникальный идентификатор комментария
- **content**: Содержимое комментария
- **noteId**: Ссылка на заметку
- **userId**: Автор комментария
- **createdAt**: Время создания

### Reaction (Реакция)

- **id**: Уникальный идентификатор реакции
- **emoji**: Эмодзи реакции
- **commentId**: Ссылка на комментарий
- **userId**: Пользователь, поставивший реакцию
- **createdAt**: Время создания
- **Уникальное ограничение**: (commentId, userId, emoji)

### Collaborator (Коллаборатор)

- **id**: Уникальный идентификатор записи
- **noteId**: Ссылка на заметку
- **userId**: Ссылка на пользователя-коллаборатора
- **createdAt**: Время добавления
- **Уникальное ограничение**: (noteId, userId)

### SmsCode (SMS код)

- **phone**: Номер телефона (PK)
- **code**: Код подтверждения

## Ключевые особенности

1. **Много-ко-многим связи**: Notes ↔ Tags, Notes ↔ Collaborators
2. **Уникальные ограничения**: предотвращают дублирование реакций и коллабораторов
3. **Публичный доступ**: через publicToken в Note
4. **Архивация и закрепление**: булевы поля в Note
5. **Дедлайны**: опциональное поле deadline в Note
6. **Аудит**: временные метки для всех основных сущностей
