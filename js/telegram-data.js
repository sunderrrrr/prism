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
    name: "Prism Channel",
    avatarImage: "assets/avatars/logo.jpg",
    avatarColor: "#6fa1d3",
    preview: "Новый кейс уже в портфолио 🚀",
    time: "12:04",
    unread: 3,
    subscribers: 12450,
    link: "https://t.me/rosewood_str",
    ctaLabel: "Читать далее",
    messages: [
      {
        from: "them",
        text: "Уведомления о скидках, полезная информация и новости собраны тут. Мы делимся бесплатным материалом и разбираем ошибки в ведении бизнеса",
      },
      {
        from: "them",
        text: "Для перехода в наш Telegram канал используйте кнопку ниже",
      },
    ],
  },
  {
    id: "production",
    type: "channel",
    name: "Prism Reels",
    avatarImage: "assets/avatars/reels.png",
    avatarColor: "#6fa1d3",
    preview: "Ролик для клиента набрал 2М просмотров",
    time: "10:47",
    unread: 1,
    subscribers: 8700,
    link: "https://t.me/rosewood_str",
    ctaLabel: "Читать далее",
    messages: [
      {
        from: "them",
        text: "В данном канале собраны наши лучшие кейсы из сферы рилсмейкинга",
      },
      {
        from: "them",
        text: "Чтобы увидеть кейсы, перейдите в Telegram по кнопке ниже",
      },
    ],
  },
  {
    id: "sites",
    type: "channel",
    name: "Prism Sites",
    avatarImage: "assets/avatars/site.png",
    avatarColor: "#6fa1d3",
    preview: "Лендинг поднял конверсию на 34%",
    time: "09:12",
    unread: 0,
    subscribers: 5600,
    link: "https://t.me/rosewood_str",
    ctaLabel: "Читать далее",
    messages: [
      {
        from: "them",
        text: "В данном канале собраны наши лучшие кейсы из сферы создания сайтов",
      },
      {
        from: "them",
        text: "Чтобы увидеть кейсы, перейдите в Telegram по кнопке ниже",
      },
    ],
  },
  {
    id: "jacob",
    type: "person",
    name: "Якуб Эльдарович",
    avatarImage: "assets/avatars/jacob.jpg",
    avatarColor: "#6fa1d3",
    preview: "Давайте обсудим ваш проект",
    time: "08:30",
    unread: 0,
    link: "https://t.me/rosewood_str",
    messages: [
      { from: "them", text: "Я владелец агентства." },
      {
        from: "them",
        text: "Обращайтесь ко мне с любым вопросом и предложением, я отвечаю всем",
      },
      {
        from: "them",
        text: "Напишите мне кодовое слово 'РАЗБОР' и получите бесплатный созвон с личной консультацией",
      },
      {
        from: "them",
        text: "Для перехода на мой Telegram используйте кнопку ниже",
      },
    ],
  },
];
