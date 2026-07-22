// ==========================================================================
// TELEGRAM CTA DATA — edit chat names, previews, messages, and links here.
//
// `type`: "channel" shows a full-width "Read more" button in place of a
// text input (channels are broadcast-only, like real Telegram). "person"
// keeps the normal message input row.
//
// `link` is where the user is sent when they click the channel's button
// or the person chat's input field. Placeholder links all point to
// @rosewood_str — swap in the real per-chat links when ready.
// ==========================================================================

const TELEGRAM_CHATS = [
  {
    id: "news",
    type: "channel",
    name: "Prism News",
    avatarLetter: "P",
    avatarColor: "#6fa1d3",
    preview: "Новый кейс уже в портфолио 🚀",
    time: "12:04",
    unread: 3,
    link: "https://t.me/rosewood_str",
    ctaLabel: "Читать далее",
    messages: [
      { from: "them", text: "Всем привет! Собрали апдейты команды за неделю." },
      {
        from: "them",
        text: "Новый кейс уже в портфолио — залетайте посмотреть.",
      },
    ],
  },
  {
    id: "production",
    type: "channel",
    name: "Prism Production Cases",
    avatarLetter: "PC",
    avatarColor: "#6fa1d3",
    preview: "Ролик для клиента набрал 2М просмотров",
    time: "10:47",
    unread: 1,
    link: "https://t.me/rosewood_str",
    ctaLabel: "Читать далее",
    messages: [
      {
        from: "them",
        text: "Свежий кейс: ролик для клиента набрал 2М просмотров за 5 дней.",
      },
      { from: "them", text: "Разбор монтажа и сценария — в следующем посте." },
    ],
  },
  {
    id: "sites",
    type: "channel",
    name: "Prism Site Cases",
    avatarLetter: "S",
    avatarColor: "#6fa1d3",
    preview: "Лендинг поднял конверсию на 34%",
    time: "09:12",
    unread: 0,
    link: "https://t.me/rosewood_str",
    ctaLabel: "Читать далее",
    messages: [
      {
        from: "them",
        text: "Кейс: новый лендинг поднял конверсию в заявки на 34%.",
      },
      { from: "them", text: "До/после и метрики — смотрите в закрепе канала." },
    ],
  },
  {
    id: "jacob",
    type: "person",
    name: "CEO Jacob",
    avatarLetter: "J",
    avatarColor: "#6fa1d3",
    preview: "Давайте обсудим ваш проект",
    time: "08:30",
    unread: 0,
    link: "https://t.me/rosewood_str",
    messages: [
      { from: "them", text: "Привет! Я Джейкоб, руковожу Prism." },
      {
        from: "them",
        text: "Расскажите о задаче — предложу трек и стоимость лично.",
      },
      { from: "me", text: "Отлично, напишу детали" },
    ],
  },
];
