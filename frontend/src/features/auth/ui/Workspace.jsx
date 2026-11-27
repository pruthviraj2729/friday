import {
  ArrowUp,
  Check,
  Command,
  Menu,
  MessageSquare,
  Plus,
  Sparkles,
  X,
  LogOut
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { fetchConversations, fetchMessages, streamMessage } from "../../chat/api/chatApi.js";
import { useAuth } from "../hooks/useAuth.js";

const suggestions = [
  "Help me plan a productive week",
  "Explain a tricky idea in simple terms",
  "Give me fresh ideas for a side project"
];

function getConversationTitle(conversation) {
  return conversation.title || "New chat";
}

export default function Workspace() {
  const { user, accessToken, logout } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesRequestRef = useRef(null);
  const textareaRef = useRef(null);

  const loadHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    setError("");
    try {
      const history = await fetchConversations(accessToken);
      setConversations(
        [...history].sort((a, b) => new Date(b.lastUpdate || b.createdAt) - new Date(a.lastUpdate || a.createdAt))
      );
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [accessToken]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function openConversation(conversation) {
    messagesRequestRef.current?.abort();
    const controller = new AbortController();
    messagesRequestRef.current = controller;
    setSelectedConversation(conversation);
    setMessages([]);
    setError("");
    setIsLoadingMessages(true);
    setSidebarOpen(false);

    try {
      const history = await fetchMessages(accessToken, conversation._id, controller.signal);
      setMessages(history.map((message) => ({
        id: message._id,
        role: message.role,
        content: message.content
      })));
    } catch (loadError) {
      if (loadError.name !== "AbortError") setError(loadError.message);
    } finally {
      if (messagesRequestRef.current === controller) {
        messagesRequestRef.current = null;
        setIsLoadingMessages(false);
      }
    }
  }

  function startNewChat() {
    messagesRequestRef.current?.abort();
    messagesRequestRef.current = null;
    setSelectedConversation(null);
    setMessages([]);
    setInput("");
    setError("");
    setIsLoadingMessages(false);
    setSidebarOpen(false);
    textareaRef.current?.focus();
  }

  async function sendMessage(messageText = input) {
    const content = messageText.trim();
    if (!content || isSending) return;

    const conversationAtStart = selectedConversation;
    const userMessage = { id: `user-${Date.now()}`, role: "user", content };
    const assistantId = `assistant-${Date.now()}`;
    setMessages((current) => [
      ...current,
      userMessage,
      { id: assistantId, role: "assistant", content: "" }
    ]);
    setInput("");
    setError("");
    setIsSending(true);

    try {
      await streamMessage(accessToken, {
        content,
        conversationId: conversationAtStart?._id
      }, (event) => {
        if (event.conversationId) {
          const conversation = {
            ...(conversationAtStart || {}),
            _id: event.conversationId,
            title: event.title || "New chat",
            createdAt: conversationAtStart?.createdAt || new Date().toISOString()
          };
          setSelectedConversation(conversation);
          setConversations((current) => [
            conversation,
            ...current.filter((item) => item._id !== conversation._id)
          ]);
        }
        if (typeof event.chunk === "string") {
          setMessages((current) => current.map((message) =>
            message.id === assistantId
              ? { ...message, content: message.content + event.chunk }
              : message
          ));
        }
      });
      await loadHistory();
    } catch (sendError) {
      setError(sendError.message);
      setMessages((current) => current.filter((message) => (
        message.id !== assistantId || message.content
      )));
    } finally {
      setIsSending(false);
    }
  }

  function handleComposerKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  return (
    <main className="chat-shell">
      {sidebarOpen && <button className="chat-backdrop" aria-label="Close chat history" onClick={() => setSidebarOpen(false)} />}
      <aside className={`chat-sidebar ${sidebarOpen ? "chat-sidebar-open" : ""}`}>
        <div className="chat-brand">
          <div className="chat-brand-mark"><Command size={17} strokeWidth={2.2} /></div>
          <span>friday</span>
          <button className="chat-icon-button chat-sidebar-close" aria-label="Close sidebar" onClick={() => setSidebarOpen(false)}><X size={18} /></button>
        </div>
        <button className="chat-new-button" onClick={startNewChat} disabled={isSending}>
          <Plus size={17} /> <span>New chat</span>
          <span className="chat-shortcut">⌘ K</span>
        </button>
        <div className="chat-history">
          <p className="chat-section-label">Your chats</p>
          {isLoadingHistory && conversations.length === 0 && <p className="chat-history-note">Loading chats…</p>}
          {!isLoadingHistory && conversations.length === 0 && <p className="chat-history-note">Your conversations will appear here.</p>}
          {conversations.map((conversation) => (
            <button
              key={conversation._id}
              className={`chat-history-item ${selectedConversation?._id === conversation._id ? "chat-history-item-active" : ""}`}
              onClick={() => openConversation(conversation)}
              disabled={isSending || isLoadingMessages}
              title={getConversationTitle(conversation)}
            >
              <MessageSquare size={15} />
              <span>{getConversationTitle(conversation)}</span>
            </button>
          ))}
        </div>
        <div className="chat-account">
          <div className="chat-avatar">{user?.name?.charAt(0)?.toUpperCase() || "F"}</div>
          <div className="chat-account-info">
            <span>{user?.name || "Friday user"}</span>
            <small>{user?.email}</small>
          </div>
          <button className="chat-icon-button" onClick={logout} title="Sign out" aria-label="Sign out"><LogOut size={17} /></button>
        </div>
      </aside>

      <section className="chat-main">
        <header className="chat-topbar">
          <button className="chat-icon-button chat-menu-button" onClick={() => setSidebarOpen(true)} aria-label="Open chat history"><Menu size={19} /></button>
          <div className="chat-model-label"><span className="chat-status-dot" /> Friday <span className="chat-model-version">Assistant</span></div>
          <div className="chat-topbar-spacer" />
          <div className="chat-topbar-user">{user?.name?.split(" ")[0]}</div>
        </header>

        <div className="chat-content">
          {messages.length === 0 ? (
            <div className="chat-welcome">
              <div className="chat-welcome-icon"><Sparkles size={21} /></div>
              <p className="chat-eyebrow">YOUR THINKING PARTNER</p>
              <h1>{user?.name ? `What’s on your mind, ${user.name.split(" ")[0]}?` : "What’s on your mind?"}</h1>
              <p className="chat-welcome-copy">A clear space to explore an idea, solve a problem, or get something done.</p>
              <div className="chat-suggestions">
                {suggestions.map((suggestion) => (
                  <button key={suggestion} onClick={() => sendMessage(suggestion)} disabled={isSending}>
                    <span>{suggestion}</span><ArrowUp size={15} />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="chat-messages">
              {messages.map((message) => (
                <article key={message.id} className={`chat-message chat-message-${message.role}`}>
                  {message.role === "assistant" && <div className="chat-assistant-mark"><Command size={14} /></div>}
                  <div className="chat-message-content">
                    {message.content || (isSending && message.role === "assistant" ? <span className="chat-typing"><i /><i /><i /></span> : null)}
                  </div>
                </article>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="chat-composer-wrap">
          {error && <p className="chat-error" role="alert">{error}</p>}
          <div className="chat-composer">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleComposerKeyDown}
              placeholder="Message Friday…"
              rows={1}
              aria-label="Message Friday"
              disabled={isSending || isLoadingMessages}
            />
            <button
              className="chat-send-button"
              onClick={() => sendMessage()}
              disabled={!input.trim() || isSending || isLoadingMessages}
              aria-label="Send message"
              title="Send message"
            >
              {isSending ? <span className="chat-send-spinner" /> : <ArrowUp size={18} />}
            </button>
          </div>
          <p className="chat-disclaimer"><Check size={12} /> Friday can make mistakes. Check important information.</p>
        </div>
      </section>
    </main>
  );
}
