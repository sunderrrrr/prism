// ==========================================================================
// TELEGRAM CTA — renders the chat list and active conversation from
// TELEGRAM_CHATS (js/telegram-data.js), wires up chat switching, the
// mobile back button, and the message-input-field Telegram redirect.
// ==========================================================================
(function initTelegramCta() {
  "use strict";

  const tgWindow = document.getElementById("tgWindow");
  const chatsEl = document.getElementById("tgChats");
  const messagesEl = document.getElementById("tgMessages");
  const backBtn = document.getElementById("tgBack");
  const inputBar = document.getElementById("tgInputBar");
  const convAvatar = document.getElementById("tgConvAvatar");
  const convName = document.getElementById("tgConvName");

  if (!tgWindow || !chatsEl || typeof TELEGRAM_CHATS === "undefined") return;
  if (!TELEGRAM_CHATS.length) return;

  let activeId = TELEGRAM_CHATS[0].id;

  function renderChatList() {
    chatsEl.innerHTML = TELEGRAM_CHATS.map((chat) => {
      const activeClass = chat.id === activeId ? " is-active" : "";
      const badge =
        chat.unread > 0
          ? `<span class="tg-chat-badge">${chat.unread}</span>`
          : "";
      return `
        <button class="tg-chat-item${activeClass}" data-chat-id="${chat.id}" type="button">
          <span class="tg-chat-avatar" style="--chat-color:${chat.avatarColor}">${chat.avatarLetter}</span>
          <span class="tg-chat-meta">
            <span class="tg-chat-row1">
              <span class="tg-chat-name">${chat.name}</span>
              <span class="tg-chat-time">${chat.time}</span>
            </span>
            <span class="tg-chat-row2">
              <span class="tg-chat-preview">${chat.preview}</span>
              ${badge}
            </span>
          </span>
        </button>
      `;
    }).join("");
  }

  function renderConversation(chat) {
    if (convAvatar) {
      convAvatar.textContent = chat.avatarLetter;
      convAvatar.style.setProperty("--chat-color", chat.avatarColor);
    }
    if (convName) convName.textContent = chat.name;

    if (messagesEl) {
      messagesEl.innerHTML = chat.messages
        .map((m) => {
          const cls = m.from === "me" ? "is-me" : "is-them";
          return `<div class="tg-msg ${cls}">${m.text}</div>`;
        })
        .join("");
      messagesEl.scrollTop = 0;
    }

    renderInputBar(chat);
  }

  function renderInputBar(chat) {
    if (!inputBar) return;

    if (chat.type === "channel") {
      inputBar.innerHTML = `
        <button class="tg-cta-btn" type="button" data-link="${chat.link}">
          ${chat.ctaLabel || "Читать далее"}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      `;
    } else {
      inputBar.innerHTML = `
        <button class="tg-cta-btn" type="button" data-link="${chat.link}">
          Обсудить в Telegram
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      `;
    }
  }

  function setActiveChat(id) {
    const chat = TELEGRAM_CHATS.find((c) => c.id === id);
    if (!chat) return;
    activeId = id;
    renderChatList();
    renderConversation(chat);
  }

  chatsEl.addEventListener("click", (e) => {
    const item = e.target.closest(".tg-chat-item");
    if (!item) return;
    setActiveChat(item.dataset.chatId);
    tgWindow.classList.add("is-conversation-open");
  });

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      tgWindow.classList.remove("is-conversation-open");
    });
  }

  if (inputBar) {
    inputBar.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-link]");
      if (!trigger) return;
      window.open(trigger.dataset.link, "_blank", "noopener");
    });
  }

  renderChatList();
  renderConversation(TELEGRAM_CHATS[0]);
})();
