"use client";

import type {
  CSSProperties,
  FormEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUp, Minus } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MascotBuddy } from "@/components/mascot/mascot-buddy";
import { RobotArt } from "@/components/mascot/robot-art";
import styles from "./pixel-chatbot.module.css";

type Message = {
  id: number;
  role: "assistant" | "user";
  content: string;
};

type Position = { x: number; y: number };

type Dock = {
  horizontal: "left" | "right";
  vertical: "top" | "bottom";
};

type DragState = {
  pointerId: number;
  startPointerX: number;
  startPointerY: number;
  startX: number;
  startY: number;
  width: number;
  height: number;
  moved: boolean;
  cleanup?: () => void;
};

const copy = {
  en: {
    launcher: "Chat with Bondeth's pixel assistant",
    dragHint: "Drag to reposition. Click to open the chat.",
    bubble: "Ask me",
    eyebrow: "AI PORTFOLIO ASSISTANT",
    title: "Ask Byte",
    status: "Bondeth · Technology · Digital Business",
    greeting:
      "Hey! I’m Byte. Ask me about Bondeth, technology, or how software and AI can support a business.",
    suggestions: [
      "What does Bondeth build?",
      "How can AI help my business?",
      "What technology should my project use?",
    ],
    placeholder: "Ask a question...",
    send: "Send message",
    close: "Minimize chat",
    thinking: "Byte is thinking",
    error: "Byte couldn’t answer right now. Please try again.",
    note: "AI CAN MAKE MISTAKES · DO NOT SHARE SENSITIVE INFORMATION",
    privacy: "PRIVACY",
  },
  km: {
    launcher: "ជជែកជាមួយជំនួយការ Pixel របស់ Bondeth",
    dragHint: "អូសដើម្បីប្តូរទីតាំង។ ចុចដើម្បីបើកការជជែក។",
    bubble: "សួរខ្ញុំ",
    eyebrow: "AI PORTFOLIO ASSISTANT",
    title: "សួរ Byte",
    status: "Bondeth · បច្ចេកវិទ្យា · អាជីវកម្មឌីជីថល",
    greeting:
      "សួស្តី! ខ្ញុំឈ្មោះ Byte។ សួរខ្ញុំអំពី Bondeth បច្ចេកវិទ្យា ឬរបៀបដែល Software និង AI អាចជួយអាជីវកម្ម។",
    suggestions: [
      "Bondeth បង្កើតអ្វីខ្លះ?",
      "តើ AI អាចជួយអាជីវកម្មខ្ញុំដូចម្តេច?",
      "តើគម្រោងខ្ញុំគួរប្រើបច្ចេកវិទ្យាអ្វី?",
    ],
    placeholder: "សួរសំណួរ...",
    send: "ផ្ញើសារ",
    close: "បង្រួមការជជែក",
    thinking: "Byte កំពុងគិត",
    error: "Byte មិនអាចឆ្លើយបាននៅពេលនេះទេ។ សូមព្យាយាមម្តងទៀត។",
    note: "AI អាចឆ្លើយខុស · សូមកុំចែករំលែកព័ត៌មានរសើប",
    privacy: "ឯកជនភាព",
  },
} as const;

const MAX_API_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 1_000;

function calculateDocking(
  x: number,
  y: number,
  width: number,
  height: number,
  viewportWidth: number,
  viewportHeight: number,
): { dock: Dock; shift: Position } {
  const dock: Dock = {
    horizontal: x + width / 2 < viewportWidth / 2 ? "left" : "right",
    vertical: y + height / 2 < viewportHeight / 2 ? "top" : "bottom",
  };

  if (viewportWidth <= 520) return { dock, shift: { x: 0, y: 0 } };

  const margin = 12;
  const panelWidth = Math.min(388, viewportWidth - 32);
  const panelHeight = Math.min(540, viewportHeight - 112);
  const naturalLeft = dock.horizontal === "left" ? x : x + width - panelWidth;
  const naturalTop = dock.vertical === "top" ? y : y + height - panelHeight;
  const naturalRight = naturalLeft + panelWidth;
  const naturalBottom = naturalTop + panelHeight;
  const shiftX =
    naturalLeft < margin
      ? margin - naturalLeft
      : naturalRight > viewportWidth - margin
        ? viewportWidth - margin - naturalRight
        : 0;
  const shiftY =
    naturalTop < margin
      ? margin - naturalTop
      : naturalBottom > viewportHeight - margin
        ? viewportHeight - margin - naturalBottom
        : 0;

  return { dock, shift: { x: shiftX, y: shiftY } };
}

export default function PixelChatbot({
  lang,
  initialOpen = false,
}: {
  lang: string;
  initialOpen?: boolean;
}) {
  const text = lang === "km" ? copy.km : copy.en;
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "assistant", content: text.greeting },
  ]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [position, setPosition] = useState<Position | null>(null);
  const [dock, setDock] = useState<Dock>({ horizontal: "right", vertical: "bottom" });
  const [panelShift, setPanelShift] = useState<Position>({ x: 0, y: 0 });
  const chatbotRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const nextMessageId = useRef(2);
  const dragState = useRef<DragState | null>(null);
  const suppressClick = useRef(false);
  const sendInFlight = useRef(false);
  // Byte brightens for a moment in the header when an answer lands.
  const [celebrating, setCelebrating] = useState(false);
  const celebrateTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(celebrateTimer.current), []);

  useEffect(() => {
    if (!isOpen) return;

    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 180);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    return () => dragState.current?.cleanup?.();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const messageList = messagesRef.current;
    if (messageList) messageList.scrollTop = messageList.scrollHeight;
  }, [error, isOpen, isSending, messages]);

  useEffect(() => {
    if (!position) return;

    const keepInViewport = () => {
      const rect = chatbotRef.current?.getBoundingClientRect();
      const width = rect?.width ?? 78;
      const height = rect?.height ?? 82;
      const margin = 12;
      const nextPosition = {
        x: Math.min(Math.max(position.x, margin), window.innerWidth - width - margin),
        y: Math.min(Math.max(position.y, margin), window.innerHeight - height - margin),
      };
      const docking = calculateDocking(
        nextPosition.x,
        nextPosition.y,
        width,
        height,
        window.innerWidth,
        window.innerHeight,
      );

      setPosition(nextPosition);
      setDock(docking.dock);
      setPanelShift(docking.shift);
    };

    window.addEventListener("resize", keepInViewport);
    return () => window.removeEventListener("resize", keepInViewport);
  }, [position]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0 || event.pointerType === "mouse") return;

    const rect = chatbotRef.current?.getBoundingClientRect();
    if (!rect) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    suppressClick.current = false;
    dragState.current = {
      pointerId: event.pointerId,
      startPointerX: event.clientX,
      startPointerY: event.clientY,
      startX: rect.left,
      startY: rect.top,
      width: rect.width,
      height: rect.height,
      moved: false,
    };
  };

  const updateDocking = (x: number, y: number, width: number, height: number) => {
    const docking = calculateDocking(
      x,
      y,
      width,
      height,
      window.innerWidth,
      window.innerHeight,
    );

    setDock(docking.dock);
    setPanelShift(docking.shift);
  };

  const moveDraggedBot = (clientX: number, clientY: number, drag: DragState) => {
    const deltaX = clientX - drag.startPointerX;
    const deltaY = clientY - drag.startPointerY;

    if (!drag.moved && Math.hypot(deltaX, deltaY) < 5) return false;
    drag.moved = true;

    const margin = 12;
    const x = Math.min(
      Math.max(drag.startX + deltaX, margin),
      window.innerWidth - drag.width - margin,
    );
    const y = Math.min(
      Math.max(drag.startY + deltaY, margin),
      window.innerHeight - drag.height - margin,
    );

    setPosition({ x, y });
    updateDocking(x, y, drag.width, drag.height);

    return true;
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    if (moveDraggedBot(event.clientX, event.clientY, drag)) {
      event.preventDefault();
    }
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    suppressClick.current = drag.moved;
    dragState.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleMouseDown = (event: ReactMouseEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;

    const rect = chatbotRef.current?.getBoundingClientRect();
    if (!rect) return;

    suppressClick.current = false;
    const drag: DragState = {
      pointerId: -2,
      startPointerX: event.clientX,
      startPointerY: event.clientY,
      startX: rect.left,
      startY: rect.top,
      width: rect.width,
      height: rect.height,
      moved: false,
    };

    const stopTracking = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    const onMouseMove = (nativeEvent: MouseEvent) => {
      if (moveDraggedBot(nativeEvent.clientX, nativeEvent.clientY, drag)) {
        nativeEvent.preventDefault();
      }
    };
    const onMouseUp = () => {
      suppressClick.current = drag.moved;
      if (dragState.current === drag) dragState.current = null;
      stopTracking();
    };

    drag.cleanup = stopTracking;
    dragState.current = drag;
    window.addEventListener("mousemove", onMouseMove, { passive: false });
    window.addEventListener("mouseup", onMouseUp, { once: true });
  };

  const sendMessage = async (content: string) => {
    const question = content.trim();
    if (!question || sendInFlight.current) return;

    const userId = nextMessageId.current++;
    const userMessage: Message = { id: userId, role: "user", content: question };
    const conversation = messages
      .filter((message) => message.id !== 1)
      .slice(-(MAX_API_MESSAGES - 1))
      .map(({ role, content: messageContent }) => ({
        role,
        content: messageContent,
      }));

    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setError("");
    setIsSending(true);
    sendInFlight.current = true;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lang: lang === "km" ? "km" : "en",
          messages: [...conversation, { role: "user", content: question }],
        }),
      });
      const data = (await response.json()) as { message?: unknown; error?: unknown };

      if (!response.ok || typeof data.message !== "string" || !data.message.trim()) {
        throw new Error(typeof data.error === "string" ? data.error : "Invalid response");
      }

      const answer = data.message.trim();
      setCelebrating(true);
      window.clearTimeout(celebrateTimer.current);
      celebrateTimer.current = window.setTimeout(() => setCelebrating(false), 1_600);
      setMessages((current) => [
        ...current,
        {
          id: nextMessageId.current++,
          role: "assistant",
          content: answer,
        },
      ]);
    } catch (requestError) {
      setError(
        requestError instanceof Error && requestError.message !== "Invalid response"
          ? requestError.message
          : text.error,
      );
    } finally {
      sendInFlight.current = false;
      setIsSending(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(draft);
  };

  const handleLauncherClick = () => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }

    setIsOpen((current) => !current);
  };

  const positionStyle: CSSProperties | undefined = position
    ? ({
        left: position.x,
        top: position.y,
        right: "auto",
        bottom: "auto",
        "--panel-shift-x": `${panelShift.x}px`,
        "--panel-shift-y": `${panelShift.y}px`,
      } as CSSProperties)
    : undefined;

  return (
    <aside
      ref={chatbotRef}
      className={styles.chatbot}
      style={positionStyle}
      aria-label={text.launcher}
    >
      <span id="pixel-chat-drag-hint" className="sr-only">
        {text.dragHint}
      </span>
      <section
        id="pixel-chat-panel"
        className={`${styles.panel} ${isOpen ? styles.panelOpen : ""} ${
          dock.horizontal === "left" ? styles.panelDockLeft : ""
        } ${dock.vertical === "top" ? styles.panelDockTop : ""}`}
        aria-hidden={!isOpen}
        aria-label={text.title}
        inert={!isOpen}
      >
        <header className={styles.header}>
          <span className={styles.avatar}>
            <RobotArt
              mood={isSending ? "think" : celebrating ? "happy" : "idle"}
              float
              className={styles.avatarRobot}
            />
          </span>
          <span className={styles.headerCopy}>
            <span className={styles.eyebrow}>{text.eyebrow}</span>
            <strong>{text.title}</strong>
            <span className={styles.status}>
              <i aria-hidden="true" /> {text.status}
            </span>
          </span>
          <button
            type="button"
            className={styles.minimize}
            aria-label={text.close}
            onClick={() => setIsOpen(false)}
          >
            <Minus aria-hidden="true" />
          </button>
        </header>

        <div ref={messagesRef} className={styles.messages} aria-live="polite">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.messageRow} ${
                message.role === "user" ? styles.messageRowUser : ""
              }`}
            >
              {message.role === "assistant" && (
                <span className={styles.botAvatar}>
                  <RobotArt variant="head" className={styles.headIcon} />
                </span>
              )}
              {message.role === "assistant" ? (
                <div className={styles.botMessage}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({ href, children }) => (
                        <a href={href} target="_blank" rel="noopener noreferrer">
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className={styles.userMessage}>{message.content}</p>
              )}
            </div>
          ))}

          {messages.length === 1 && (
            <div className={styles.suggestions}>
              {text.suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  disabled={isSending}
                  onClick={() => void sendMessage(suggestion)}
                >
                  <RobotArt variant="head" className={styles.headIconSmall} />
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {isSending && (
            <div className={styles.messageRow} aria-label={text.thinking}>
              <span className={styles.botAvatar}>
                <RobotArt variant="head" mood="think" className={styles.headIcon} />
              </span>
              <span className={styles.typingIndicator} aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            </div>
          )}

          {error && (
            <p className={styles.chatError} role="alert">
              {error}
            </p>
          )}
        </div>

        <form className={styles.composer} onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="pixel-chat-input">
            {text.placeholder}
          </label>
          <input
            ref={inputRef}
            id="pixel-chat-input"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={text.placeholder}
            autoComplete="off"
            maxLength={MAX_MESSAGE_LENGTH}
            disabled={isSending}
          />
          <button
            type="submit"
            aria-label={text.send}
            disabled={!draft.trim() || isSending}
          >
            <ArrowUp aria-hidden="true" />
          </button>
        </form>
        <p className={styles.previewNote}>
          {text.note} · <Link href={`/${lang === "km" ? "km" : "en"}/privacy`}>{text.privacy}</Link>
        </p>
      </section>

      <button
        type="button"
        className={`${styles.launcher} ${isOpen ? styles.launcherOpen : ""}`}
        aria-label={text.launcher}
        aria-describedby="pixel-chat-drag-hint"
        aria-expanded={isOpen}
        aria-controls="pixel-chat-panel"
        onClick={handleLauncherClick}
        onMouseDown={handleMouseDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
      >
        <span className={styles.launcherGlow} />
        <MascotBuddy
          lang={lang}
          bubble={text.bubble}
          bubbleClassName={styles.speechBubble}
          className={styles.buddy}
          mood={isSending ? "think" : undefined}
          quips={!isOpen}
        />
        <span className={styles.launcherStatus} aria-hidden="true" />
      </button>
    </aside>
  );
}
