"use client";

import { useReducedMotion } from "@/components/utils/animations/use-motion";
import { isMotionReduced } from "@/lib/motion-preference";
import { MOTION } from "@/lib/motion-timing";

import type {
  CSSProperties,
  FormEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowUp, BriefcaseBusiness, Compass, FlaskConical, Hammer, Minus, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MascotBuddy } from "@/components/mascot/mascot-buddy";
import { RobotArt } from "@/components/mascot/robot-art";
import type { TRobotMood } from "@/components/mascot/robot-geometry";
import type {
  IChatCard,
  IChatSectionJump,
  IChatTour,
  TChatStreamEvent,
} from "@/utils/chatbot/types";
import styles from "./pixel-chatbot.module.css";

type Message = {
  id: number;
  role: "assistant" | "user";
  content: string;
  /** Projects, posts or labs Byte pulled up with `show_work`. */
  cards?: IChatCard[];
  /** A homepage section Byte pointed to with `open_section`. */
  section?: IChatSectionJump;
  tourTitle?: string;
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
    cardKinds: { project: "Project", post: "Post", lab: "Lab" },
    goTo: "Go to",
    tour: "Show me around",
    choosePath: "What brings you here?",
    tourIntro: "Pick a path. I’ll guide you through three short stops.",
    next: "Next",
    finish: "Finish tour",
    changePath: "Change path",
    stopTour: "Exit tour",
    step: "Stop",
    of: "of",
    note: "AI CAN MAKE MISTAKES · DO NOT SHARE SENSITIVE INFORMATION",
    privacy: "PRIVACY",
  },
  km: {
    launcher: "ជជែកជាមួយជំនួយការ Pixel របស់ ហែម ឫទ្ធីបណ្ឌិត",
    dragHint: "អូសដើម្បីប្តូរទីតាំង។ ចុចដើម្បីបើកការជជែក។",
    bubble: "សួរខ្ញុំ",
    eyebrow: "AI PORTFOLIO ASSISTANT",
    title: "សួរ Byte",
    status: "ហែម ឫទ្ធីបណ្ឌិត · បច្ចេកវិទ្យា · អាជីវកម្មឌីជីថល",
    greeting:
      "សួស្តី! ខ្ញុំឈ្មោះ Byte។ សួរខ្ញុំអំពី ហែម ឫទ្ធីបណ្ឌិត បច្ចេកវិទ្យា ឬរបៀបដែល Software និង AI អាចជួយអាជីវកម្ម។",
    suggestions: [
      "ហែម ឫទ្ធីបណ្ឌិត បង្កើតអ្វីខ្លះ?",
      "តើ AI អាចជួយអាជីវកម្មខ្ញុំដូចម្តេច?",
      "តើគម្រោងខ្ញុំគួរប្រើបច្ចេកវិទ្យាអ្វី?",
    ],
    placeholder: "សួរសំណួរ...",
    send: "ផ្ញើសារ",
    close: "បង្រួមការជជែក",
    thinking: "Byte កំពុងគិត",
    error: "Byte មិនអាចឆ្លើយបាននៅពេលនេះទេ។ សូមព្យាយាមម្តងទៀត។",
    cardKinds: { project: "គម្រោង", post: "អត្ថបទ", lab: "ពិសោធន៍" },
    goTo: "ទៅកាន់",
    tour: "នាំខ្ញុំមើលគេហទំព័រ",
    choosePath: "តើអ្នកចង់ស្វែងយល់អំពីអ្វី?",
    tourIntro: "ជ្រើសរើសផ្លូវមួយ។ ខ្ញុំនឹងនាំអ្នកឆ្លងកាត់បីជំហានខ្លីៗ។",
    next: "បន្ទាប់",
    finish: "បញ្ចប់ការណែនាំ",
    changePath: "ប្តូរផ្លូវ",
    stopTour: "ចាកចេញពីការណែនាំ",
    step: "ជំហាន",
    of: "នៃ",
    note: "AI អាចឆ្លើយខុស · សូមកុំចែករំលែកព័ត៌មានរសើប",
    privacy: "ឯកជនភាព",
  },
} as const;

const MAX_API_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 1_000;
/** Below this the panel covers the page, so scrolling behind it is pointless. */
const FULLSCREEN_PANEL_WIDTH = 520;

/** Same-tab navigation for the site's own pages; new tab for everything else. */
function isInternalHref(href: string | undefined): href is string {
  return Boolean(href && href.startsWith("/") && !href.startsWith("//"));
}

/** Yields each event of the route's newline-delimited JSON stream. */
async function* readChatEvents(body: ReadableStream<Uint8Array>) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let newline = buffer.indexOf("\n");
      while (newline !== -1) {
        const line = buffer.slice(0, newline).trim();
        buffer = buffer.slice(newline + 1);
        newline = buffer.indexOf("\n");
        if (line) yield JSON.parse(line) as TChatStreamEvent;
      }
    }
  } finally {
    reader.releaseLock();
  }
}

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
  tours,
  initialOpen = false,
}: {
  lang: string;
  tours: IChatTour[];
  initialOpen?: boolean;
}) {
  const text = lang === "km" ? copy.km : copy.en;
  const locale = lang === "km" ? "km" : "en";
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "assistant", content: text.greeting },
  ]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [choosingTour, setChoosingTour] = useState(false);
  const [activeTour, setActiveTour] = useState<{ tour: IChatTour; step: number } | null>(null);
  const tourChoiceRef = useRef<HTMLButtonElement>(null);
  const tourNextRef = useRef<HTMLButtonElement>(null);
  const tourPickerRef = useRef<HTMLElement>(null);
  const tourStopRef = useRef<HTMLDivElement>(null);
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
  // Byte's face follows the request: thinking until the first token, talking
  // while it streams, a beat of delight when he pulls up cards, then idle.
  const reduceMotion = useReducedMotion();
  const [reaction, setReaction] = useState<TRobotMood | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const reactionTimer = useRef<number | undefined>(undefined);
  const requestController = useRef<AbortController | null>(null);

  useEffect(
    () => () => {
      window.clearTimeout(reactionTimer.current);
      requestController.current?.abort();
    },
    [],
  );

  const react = (mood: TRobotMood, duration = MOTION.reaction) => {
    if (isMotionReduced()) return;
    setReaction(mood);
    window.clearTimeout(reactionTimer.current);
    reactionTimer.current = window.setTimeout(() => setReaction(null), duration);
  };
  const headerMood: TRobotMood =
    (reduceMotion ? null : reaction) ?? (isStreaming ? "load" : isSending ? "think" : "idle");

  useEffect(() => {
    if (!isOpen) return;

    const focusTimer = window.setTimeout(() => {
      (tourChoiceRef.current ?? tourNextRef.current ?? inputRef.current)?.focus({ preventScroll: true });
    }, 180);
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
    if (!messageList) return;
    const stop = choosingTour ? tourPickerRef.current : activeTour ? tourStopRef.current : null;
    messageList.scrollTop = stop
      ? stop.getBoundingClientRect().top - messageList.getBoundingClientRect().top + messageList.scrollTop
      : messageList.scrollHeight;
  }, [activeTour, choosingTour, error, isOpen, isSending, messages]);

  useEffect(() => {
    if (!isOpen) return;
    if (choosingTour) tourChoiceRef.current?.focus({ preventScroll: true });
    else if (activeTour) tourNextRef.current?.focus({ preventScroll: true });
  }, [activeTour, choosingTour, isOpen]);

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
      // The greeting is local copy, and a cards-only turn has no text to send.
      .filter((message) => message.id !== 1 && message.content.trim())
      .slice(-(MAX_API_MESSAGES - 1))
      .map(({ role, content: messageContent }) => ({
        role,
        content: messageContent,
      }));

    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setError("");
    setChoosingTour(false);
    setActiveTour(null);
    setIsSending(true);
    sendInFlight.current = true;

    const controller = new AbortController();
    requestController.current = controller;
    const answerId = nextMessageId.current++;
    let answerStarted = false;
    let pendingText = "";
    let frame = 0;

    // The provider sends a token every few milliseconds; painting each one would
    // re-parse the markdown hundreds of times. Coalesce them per frame.
    const updateAnswer = (patch: (message: Message) => Message) => {
      if (!answerStarted) {
        answerStarted = true;
        setMessages((current) => [
          ...current,
          patch({ id: answerId, role: "assistant", content: "" }),
        ]);
        return;
      }
      setMessages((current) =>
        current.map((message) => (message.id === answerId ? patch(message) : message)),
      );
    };
    const flushText = () => {
      frame = 0;
      if (!pendingText) return;
      const chunk = pendingText;
      pendingText = "";
      updateAnswer((message) => ({ ...message, content: message.content + chunk }));
    };

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lang: locale,
          messages: [...conversation, { role: "user", content: question }],
        }),
        signal: controller.signal,
      });

      const isStream = response.headers
        .get("Content-Type")
        ?.includes("application/x-ndjson");
      if (!response.ok || !isStream || !response.body) {
        const data = (await response.json().catch(() => ({}))) as { error?: unknown };
        throw new Error(typeof data.error === "string" ? data.error : "Invalid response");
      }

      let streamError = "";
      for await (const event of readChatEvents(response.body)) {
        if (event.type === "text") {
          setIsStreaming(true);
          pendingText += event.delta;
          if (!frame) frame = window.requestAnimationFrame(flushText);
        } else if (event.type === "cards") {
          updateAnswer((message) => ({
            ...message,
            cards: [...(message.cards ?? []), ...event.cards],
          }));
          react("happy");
        } else if (event.type === "section") {
          const { section, label, href } = event;
          updateAnswer((message) => ({ ...message, section: { section, label, href } }));
          react("wink");
          jumpToSection(section, false);
        } else if (event.type === "error") {
          streamError = event.message;
        }
      }

      window.cancelAnimationFrame(frame);
      flushText();
      if (streamError) throw new Error(streamError);
      if (!answerStarted) throw new Error("Invalid response");
      react("happy");
    } catch (requestError) {
      window.cancelAnimationFrame(frame);
      flushText();
      if (controller.signal.aborted) return;
      setError(
        requestError instanceof Error && requestError.message !== "Invalid response"
          ? requestError.message
          : text.error,
      );
    } finally {
      if (requestController.current === controller) requestController.current = null;
      sendInFlight.current = false;
      setIsSending(false);
      setIsStreaming(false);
    }
  };

  /**
   * Scroll the homepage to a section. Automatic jumps only happen when the
   * page is visible beside the panel; a tap on the chip always goes, closing
   * a full-screen panel first so the visitor actually sees where they landed.
   */
  const jumpToSection = (section: string, fromClick: boolean) => {
    const onHomepage = pathname === `/${locale}` || pathname === `/${locale}/`;
    const panelCoversPage = window.innerWidth <= FULLSCREEN_PANEL_WIDTH;
    if (!onHomepage) return false;
    if (!fromClick && panelCoversPage) return false;

    const target = document.getElementById(section);
    if (!target) return false;

    if (fromClick && panelCoversPage) setIsOpen(false);
    const reduceMotion = isMotionReduced();
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    window.history.replaceState(null, "", `#${section}`);
    return true;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(draft);
  };

  const openTourPicker = () => {
    if (sendInFlight.current) return;
    setActiveTour(null);
    setChoosingTour(true);
    setError("");
    react("wave");
  };

  const showTourStep = (tour: IChatTour, stepIndex: number) => {
    if (sendInFlight.current) return;
    const step = tour.steps[stepIndex];
    if (!step) return;
    const choice: Message | null = stepIndex === 0
      ? { id: nextMessageId.current++, role: "user", content: tour.label }
      : null;
    const answer: Message = {
      id: nextMessageId.current++,
      role: "assistant",
      content: step.content,
      cards: step.cards,
      section: step.section,
      tourTitle: step.title,
    };
    setMessages((current) => [...current, ...(choice ? [choice] : []), answer]);
    setChoosingTour(false);
    setActiveTour({ tour, step: stepIndex });
    setError("");
    react(step.cards?.length ? "happy" : "wink");
    jumpToSection(step.section.section, false);
  };

  const endTour = () => {
    setActiveTour(null);
    setChoosingTour(false);
    inputRef.current?.focus();
  };

  const closePanelOnMobile = () => {
    if (window.innerWidth <= FULLSCREEN_PANEL_WIDTH) setIsOpen(false);
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
              mood={headerMood}
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

        <div className={styles.tourToolbar}>
          <button type="button" onClick={openTourPicker} disabled={isSending}>
            <Compass aria-hidden="true" />
            {text.tour}
            <ArrowRight aria-hidden="true" />
          </button>
        </div>

        <div
          ref={messagesRef}
          className={styles.messages}
          aria-live="polite"
          aria-busy={isStreaming}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              ref={message.tourTitle && message.id === messages.at(-1)?.id ? tourStopRef : undefined}
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
                <div className={styles.botStack}>
                  {message.tourTitle && <strong className={styles.tourStopTitle}>{message.tourTitle}</strong>}
                  {/* Arrival order: tool results land before the reply that
                      introduces them, so they render first too. */}
                  {message.cards && message.cards.length > 0 && (
                    <ul className={styles.cards}>
                      {message.cards.map((card) => (
                        <li key={card.href}>
                          <Link href={card.href} className={styles.card} onClick={closePanelOnMobile}>
                            <span className={styles.cardKind}>
                              {text.cardKinds[card.kind]}
                              {card.meta && <span> · {card.meta}</span>}
                            </span>
                            <strong className={styles.cardTitle}>{card.title}</strong>
                            {card.description && (
                              <span className={styles.cardDescription}>
                                {card.description}
                              </span>
                            )}
                            <ArrowRight aria-hidden="true" className={styles.cardArrow} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}

                  {message.section && (
                    <Link
                      href={message.section.href}
                      className={styles.sectionJump}
                      onClick={(event) => {
                        if (jumpToSection(message.section!.section, true)) {
                          event.preventDefault();
                        } else closePanelOnMobile();
                      }}
                    >
                      {text.goTo} {message.section.label}
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  )}

                  {message.content && (
                    <div className={styles.botMessage}>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: ({ href, children }) =>
                            isInternalHref(href) ? (
                              <Link href={href} onClick={closePanelOnMobile}>{children}</Link>
                            ) : (
                              <a href={href} target="_blank" rel="noopener noreferrer">
                                {children}
                              </a>
                            ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              ) : (
                <p className={styles.userMessage}>{message.content}</p>
              )}
            </div>
          ))}

          {messages.length === 1 && !choosingTour && (
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

          {choosingTour && (
            <section ref={tourPickerRef} className={styles.tourPicker} aria-labelledby="byte-tour-heading">
              <h2 id="byte-tour-heading">{text.choosePath}</h2>
              <p>{text.tourIntro}</p>
              <div className={styles.tourChoices}>
                {tours.map((tour, index) => {
                  const Icon = tour.id === "hiring" ? BriefcaseBusiness : tour.id === "product" ? Hammer : FlaskConical;
                  return (
                    <button
                      key={tour.id}
                      ref={index === 0 ? tourChoiceRef : undefined}
                      type="button"
                      disabled={isSending}
                      onClick={() => showTourStep(tour, 0)}
                    >
                      <Icon aria-hidden="true" />
                      <span><strong>{tour.label}</strong><span>{tour.description}</span></span>
                      <ArrowRight aria-hidden="true" />
                    </button>
                  );
                })}
              </div>
              <button type="button" className={styles.tourTextButton} onClick={endTour}>{text.stopTour}</button>
            </section>
          )}

          {isSending && messages.at(-1)?.role === "user" && (
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

        {activeTour && (
          <nav className={styles.tourControls} aria-label={text.tour}>
            <div className={styles.tourProgress}>
              <span>{activeTour.tour.label} · {text.step} {activeTour.step + 1} {text.of} {activeTour.tour.steps.length}</span>
              <button type="button" onClick={endTour} aria-label={text.stopTour}><X aria-hidden="true" /></button>
            </div>
            <div className={styles.tourActions}>
              <button type="button" className={styles.tourTextButton} onClick={openTourPicker}>{text.changePath}</button>
              <button
                ref={tourNextRef}
                type="button"
                className={styles.tourNext}
                onClick={() => activeTour.step + 1 < activeTour.tour.steps.length
                  ? showTourStep(activeTour.tour, activeTour.step + 1)
                  : endTour()}
              >
                {activeTour.step + 1 < activeTour.tour.steps.length
                  ? `${text.next}: ${activeTour.tour.steps[activeTour.step + 1].title}`
                  : text.finish}
                <ArrowRight aria-hidden="true" />
              </button>
            </div>
          </nav>
        )}

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
