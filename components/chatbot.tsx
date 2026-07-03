"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import { X, Info, Send, Layers, Bot, User, RotateCcw, ChevronDown, ExternalLink, FileText, Globe, BookOpen } from "lucide-react"
import { BrandStar } from "@/components/brand-star"
import { portal } from "@/lib/mock-data"

/* ── Quellen-Datenbank ───────────────────────────────────────────── */
type Source = {
    title: string
    url: string
    type: "portal" | "docs" | "web"
    snippet: string
}

const SOURCES: Record<string, Source[]> = {
    rechnungen: [
        { title: "MyTruckPoint – Rechnungsübersicht", url: "https://mytruckpoint.mercedes-benz-trucks.com/invoices", type: "portal", snippet: "Alle Rechnungen und Gutschriften Ihrer Flotte auf einen Blick …" },
        { title: "Handbuch: Rechnungen & Belege verwalten", url: "https://docs.mercedes-benz-trucks.com/billing", type: "docs", snippet: "So finden und exportieren Sie Ihre Rechnungen im Portal …" },
        { title: "Mercedes-Benz Trucks – Kundenportal FAQ", url: "https://www.mercedes-benz-trucks.com/support/faq", type: "web", snippet: "Häufige Fragen zur Rechnungsstellung und Zahlungsabwicklung …" },
    ],
    wartung: [
        { title: "Fleetboard – Wartungsplaner", url: "https://mytruckpoint.mercedes-benz-trucks.com/maintenance", type: "portal", snippet: "Übersicht aller geplanten und überfälligen Wartungstermine …" },
        { title: "Wartungsstufen M1–M4 im Überblick", url: "https://docs.mercedes-benz-trucks.com/maintenance-levels", type: "docs", snippet: "Intervalle, Umfang und Empfehlungen für jede Wartungsstufe …" },
    ],
    fahrzeuge: [
        { title: "MyTruckPoint – Fuhrparkübersicht", url: "https://mytruckpoint.mercedes-benz-trucks.com/fleet", type: "portal", snippet: "Echtzeitstatus, Standorte und Auslastung Ihrer gesamten Flotte …" },
        { title: "Fleetboard Telematik – Fahrzeugstatus", url: "https://docs.mercedes-benz-trucks.com/fleetboard/status", type: "docs", snippet: "Statusmeldungen und ihre Bedeutung im Telematik-System …" },
        { title: "Mercedes-Benz Trucks – Konnektivität", url: "https://www.mercedes-benz-trucks.com/connectivity", type: "web", snippet: "So bleiben Sie mit Ihrer Flotte digital verbunden …" },
    ],
    pannen: [
        { title: "Service24h – Aktive Vorgänge", url: "https://mytruckpoint.mercedes-benz-trucks.com/service24h", type: "portal", snippet: "Alle laufenden Pannen- und Servicevorgänge mit Echtzeit-ETA …" },
        { title: "Service24h Handbuch", url: "https://docs.mercedes-benz-trucks.com/service24h", type: "docs", snippet: "Pannenmeldung, Ablauf und Eskalationsstufen erklärt …" },
    ],
    fallback: [
        { title: "MyTruckPoint – Hilfe & Support", url: "https://mytruckpoint.mercedes-benz-trucks.com/help", type: "portal", snippet: "Allgemeine Hilfe und Kontaktmöglichkeiten …" },
    ],
}

const SOURCE_ICONS = {
    portal: FileText,
    docs: BookOpen,
    web: Globe,
}

const SOURCE_LABELS = {
    portal: "Portal",
    docs: "Dokumentation",
    web: "Web",
}

/* ── suggestion cards mit vorgefertigten Antworten ───────────────── */
const suggestions = [
    {
        image: "/chatbot/rechnung-chatbot.jpg",
        text: "Wo finde ich die Rechnungen von April?",
        sourceKey: "rechnungen",
        answerImages: ["/chatbot/answers/answer-rechnung.jpg"],
        answer: `Deine Rechnungen findest du unter **Einkauf → Bestellungen & Rechnungen**.\n\nFür April 2026 liegen folgende Rechnungen vor:\n\n• **RE-2026-0389** – Wartung Stufe M2, B-MT 1041 – 1.840,00 €\n• **RE-2026-0391** – Bremsbeläge VA, B-MT 2077 – 624,50 €\n• **RE-2026-0417** – Fleetboard Telematik Abo (8 Fz.) – 392,00 €\n\nDu kannst jede Rechnung als PDF herunterladen oder direkt per E-Mail an deine Buchhaltung weiterleiten. Soll ich eine bestimmte Rechnung öffnen?`,
    },
    {
        image: "/chatbot/wartung-chatbot.jpg",
        text: "Welche Wartungen sind fällig oder überfällig?",
        sourceKey: "wartung",
        answerImages: ["/chatbot/answers/answer-wartung1.jpg", "/chatbot/answers/answer-wartung2.jpg"],
        answer: `Aktuell gibt es **2 anstehende Wartungen**, davon **1 überfällig**:\n\n🔴 **B-MT 2077** (Arocs 3251) – Wartung Stufe M3 **überfällig seit 18.06.2026**\nDas Fahrzeug steht bereits in der Werkstatt. Empfehlung: Termin priorisieren.\n\n🟡 **B-MT 1041** (Actros L 1853) – Nächste Wartung am **12.08.2026**\nNoch 41 Tage. Soll ich direkt einen Werkstatttermin buchen?\n\nAlle weiteren Fahrzeuge sind im grünen Bereich. Die nächste Fälligkeit danach ist B-MT 1042 am 03.09.2026.`,
    },
    {
        image: "/chatbot/flotte-chatbot.jpg",
        text: "Wie viele Fahrzeuge sind aktuell im Einsatz?",
        sourceKey: "fahrzeuge",
        answerImages: ["/chatbot/answers/answer-flotte1.jpg", "/chatbot/answers/answer-flotte2.jpg"],
        answer: `Von deinen **8 Fahrzeugen** sind aktuell:\n\n🟢 **5 im Einsatz** – B-MT 1041, 1042, 2078, 3100, 3101\n🟡 **1 in der Werkstatt** – B-MT 2077 (Getriebe-Warnung)\n🔴 **1 mit Panne** – B-MT 1099 (Kühlmittelverlust, Techniker unterwegs, ETA 25 min)\n⚪ **1 bereit** – B-MT 2200 (steht am Depot, einsatzfähig)\n\nDie aktuelle Flottenauslastung liegt bei **62,5 %**. Soll ich dir die Kartenansicht mit allen Positionen öffnen?`,
    },
    {
        image: "/chatbot/abschleppen-chatbot.jpg",
        text: "Gibt es aktuell offene Pannen oder Probleme?",
        sourceKey: "pannen",
        answerImages: ["/chatbot/answers/answer-panne.jpg"],
        answer: `Ja, es gibt **1 offene Pannenmeldung**:\n\n🔴 **Vorgang S-2214** – B-MT 1099 (Actros L 1848)\n• Problem: Kühlmittelverlust\n• Standort: A565, km 12,4 bei Bonn\n• Fahrer: R. Klein\n• Status: **Techniker unterwegs** – ETA ca. 25 Minuten\n\nAußerdem:\n🟡 **B-MT 2077** steht in der Werkstatt (Getriebe-Warnung, Vorgang S-2201)\n\nSoll ich den Fahrer von B-MT 1099 kontaktieren oder eine Ersatzfahrzeug-Disposition starten?`,
    },
]

/* ── source chips ───────────────────────────────────────────────── */
const sourceChips = [
    { icon: Layers, label: "Quellen", count: 3 },
]

type ChatMessageItem = {
    id: string
    role: "user" | "bot"
    text: string
    animate?: boolean
    sourceKey?: string
    answerImages?: string[]
}

const createMessageId = () => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID()
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

/* ── typing animation hook ───────────────────────────────────────── */
function useTypingEffect(text: string, speed = 12, enabled = true) {
    const [displayed, setDisplayed] = useState(enabled ? "" : text)
    const [done, setDone] = useState(!enabled)

    useEffect(() => {
        if (!enabled) {
            setDisplayed(text)
            setDone(true)
            return
        }

        setDisplayed("")
        setDone(false)

        let i = 0
        const interval = setInterval(() => {
            i++
            setDisplayed(text.slice(0, i))

            if (i >= text.length) {
                clearInterval(interval)
                setDone(true)
            }
        }, speed)

        return () => clearInterval(interval)
    }, [text, speed, enabled])

    return { displayed, done }
}

/* ── sources panel ───────────────────────────────────────────────── */
function SourcesPanel({ sourceKey }: { sourceKey: string }) {
    const [expanded, setExpanded] = useState(false)
    const sources = SOURCES[sourceKey] || SOURCES.fallback

    return (
        <div className="mt-2 ml-11">
            <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/50 transition-colors hover:border-white/20 hover:text-white/70"
            >
                <Layers className="size-3.5" />
                {sources.length} Quellen
                <ChevronDown className={`size-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
            </button>

            {expanded && (
                <div className="mt-2 space-y-1.5">
                    {sources.map((src, i) => {
                        const Icon = SOURCE_ICONS[src.type]

                        return (
                            <a
                                key={i}
                                href={src.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex gap-3 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 transition-colors hover:border-white/15 hover:bg-white/[0.06]"
                            >
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-white/[0.06]">
                                    <Icon className="size-4 text-white/40" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-medium text-white/80 group-hover:text-white truncate">
                                            {src.title}
                                        </span>
                                        <ExternalLink className="size-3 shrink-0 text-white/30 group-hover:text-white/50" />
                                    </div>

                                    <div className="mt-0.5 text-[11px] text-white/35 truncate">
                                        {src.snippet}
                                    </div>

                                    <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-white/40">
                                        <Icon className="size-2.5" />
                                        {SOURCE_LABELS[src.type]}
                                    </div>
                                </div>
                            </a>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

/* ── chat bubble ─────────────────────────────────────────────────── */
function ChatMessage({
                         role,
                         text,
                         animate = false,
                         sourceKey,
                         answerImages,
                         onAnimationDone,
                     }: {
    role: "user" | "bot"
    text: string
    animate?: boolean
    sourceKey?: string
    answerImages?: string[]
    onAnimationDone?: () => void
}) {
    const isBot = role === "bot"
    const shouldAnimate = isBot && animate
    const { displayed, done } = useTypingEffect(text, 12, shouldAnimate)
    const content = isBot ? displayed : text
    const hasReportedDoneRef = useRef(false)

    useEffect(() => {
        hasReportedDoneRef.current = false
    }, [text, animate])

    useEffect(() => {
        if (shouldAnimate && done && !hasReportedDoneRef.current) {
            hasReportedDoneRef.current = true
            onAnimationDone?.()
        }
    }, [shouldAnimate, done, onAnimationDone])

    const renderText = (raw: string) => {
        return raw.split("\n").map((line, i) => {
            const html = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")

            if (
                html.startsWith("• ") ||
                html.startsWith("🟢") ||
                html.startsWith("🟡") ||
                html.startsWith("🔴") ||
                html.startsWith("⚪")
            ) {
                return (
                    <div
                        key={i}
                        className="pl-1 py-0.5"
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                )
            }

            if (html.trim() === "") return <div key={i} className="h-2" />

            return <div key={i} dangerouslySetInnerHTML={{ __html: html }} />
        })
    }

    return (
        <div>
            <div className={`flex gap-3 ${isBot ? "" : "flex-row-reverse"}`}>
                <div
                    className={`mt-1 flex size-8 shrink-0 items-center justify-center rounded-full ${
                        isBot ? "bg-white/10" : "bg-sky-600/30"
                    }`}
                >
                    {isBot ? (
                        <Bot className="size-4 text-white/70" />
                    ) : (
                        <User className="size-4 text-sky-400" />
                    )}
                </div>

                <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        isBot ? "bg-white/[0.06] text-white/90" : "bg-sky-600/20 text-white"
                    }`}
                >
                    {renderText(content)}

                    {shouldAnimate && !done && (
                        <span className="inline-block w-1.5 h-4 bg-white/60 animate-pulse ml-0.5 align-text-bottom" />
                    )}
                </div>
            </div>

            {/* ── Antwort-Bilder ── */}
            {isBot && done && answerImages && answerImages.length > 0 && (
                <div className="mt-2 ml-11 flex gap-2 flex-wrap">
                    {answerImages.map((src, i) => (
                        <div key={i} className="overflow-hidden rounded-xl border border-white/10 max-w-sm">
                            <Image
                                src={src}
                                alt={`Antwort-Bild ${i + 1}`}
                                width={600}
                                height={400}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* ── Quellen ── */}
            {isBot && done && sourceKey && <SourcesPanel sourceKey={sourceKey} />}
        </div>
    )
}

/* ── info tooltip ────────────────────────────────────────────────── */
function InfoTooltip() {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open) return

        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }

        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [open])

    return (
        <div className="relative inline-flex" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="inline-flex items-center justify-center rounded-full text-white/40 transition-colors hover:text-white/70"
                aria-label="Info"
            >
                <Info className="size-4" />
            </button>

            {open && (
                <div className="absolute left-1/2 top-full z-50 mt-2 w-72 -translate-x-1/2 rounded-xl border border-white/10 bg-[#1e1e1e] px-4 py-3 shadow-2xl">
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 size-3 rotate-45 border-l border-t border-white/10 bg-[#1e1e1e]" />

                    <div className="relative text-sm leading-relaxed text-white/70">
                        <strong className="text-white/90">Demo-Modus:</strong> Dies ist ein Prototyp
                        mit vorgefertigten Antworten und simulierten Daten. In der Vollversion
                        antwortet die KI in Echtzeit auf Basis deiner Flotten- und Portaldaten.
                    </div>

                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="mt-2 text-xs text-sky-400 transition-colors hover:text-sky-300"
                    >
                        Verstanden
                    </button>
                </div>
            )}
        </div>
    )
}

/* ── main component ──────────────────────────────────────────────── */
interface AiChatPanelProps {
    open: boolean
    onClose: () => void
}

export function AiChatPanel({ open, onClose }: AiChatPanelProps) {
    const [query, setQuery] = useState("")
    const [infoBannerVisible, setInfoBannerVisible] = useState(true)
    const [messages, setMessages] = useState<ChatMessageItem[]>([])
    const [isTyping, setIsTyping] = useState(false)

    const inputRef = useRef<HTMLInputElement>(null)
    const chatEndRef = useRef<HTMLDivElement>(null)
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const openRef = useRef(open)

    const hasMessages = messages.length > 0

    useEffect(() => {
        openRef.current = open

        if (!open) {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.animate ? { ...msg, animate: false } : msg
                )
            )
        }
    }, [open])

    useEffect(() => {
        if (!open) return

        const originalBodyOverflow = document.body.style.overflow
        const originalHtmlOverflow = document.documentElement.style.overflow

        document.body.style.overflow = "hidden"
        document.documentElement.style.overflow = "hidden"

        return () => {
            document.body.style.overflow = originalBodyOverflow
            document.documentElement.style.overflow = originalHtmlOverflow
        }
    }, [open])

    useEffect(() => {
        if (!open) return

        const timeout = setTimeout(() => {
            inputRef.current?.focus()
        }, 200)

        return () => clearTimeout(timeout)
    }, [open])

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current)
            }
        }
    }, [])

    const getAnswer = (q: string): { answer: string; sourceKey: string; answerImages?: string[] } => {
        const match = suggestions.find((s) => s.text === q)

        if (match) {
            return {
                answer: match.answer,
                sourceKey: match.sourceKey,
                answerImages: match.answerImages,
            }
        }

        return {
            answer: `Danke für deine Frage! In der Vollversion von MyTruckPoint würde ich dir hier eine KI-gestützte Antwort auf Basis deiner Flottendaten geben.\n\nFür diese Demo stehen dir die vier vorgeschlagenen Fragen zur Verfügung. Probiere eine davon aus!`,
            sourceKey: "fallback",
        }
    }

    const markAnimationDone = useCallback((id: string) => {
        setMessages((prev) =>
            prev.map((msg) =>
                msg.id === id ? { ...msg, animate: false } : msg
            )
        )
    }, [])

    const handleSend = (text?: string) => {
        const msg = (text || query).trim()
        if (!msg || isTyping) return

        setMessages((prev) => [
            ...prev,
            {
                id: createMessageId(),
                role: "user",
                text: msg,
                animate: false,
            },
        ])

        setQuery("")
        setIsTyping(true)

        typingTimeoutRef.current = setTimeout(() => {
            const { answer, sourceKey, answerImages } = getAnswer(msg)

            setMessages((prev) => [
                ...prev,
                {
                    id: createMessageId(),
                    role: "bot",
                    text: answer,
                    animate: openRef.current,
                    sourceKey,
                    answerImages,
                },
            ])

            setIsTyping(false)
            typingTimeoutRef.current = null
        }, 800)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleReset = () => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
            typingTimeoutRef.current = null
        }

        setMessages([])
        setQuery("")
        setIsTyping(false)
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex h-dvh flex-col overflow-hidden bg-[#0d0d0d]">
            {/* ── decorative background image ───────────────────────────── */}
            <div
                className="pointer-events-none absolute inset-0 z-0"
                style={{
                    backgroundImage: `url("/chatbot/mercedes-bg.png")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            />

            {/* ── header bar ─────────────────────────────────────────────── */}
            <header className="relative z-10 flex h-12 shrink-0 items-center justify-between border-b border-white/10 px-5">
                <span className="text-sm font-bold tracking-wide text-white">
                    T-Systems Demo
                </span>

                <div className="flex items-center gap-2">
                    {hasMessages && (
                        <button
                            type="button"
                            onClick={handleReset}
                            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                        >
                            <RotateCcw className="size-3.5" />
                            Neuer Chat
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex size-8 items-center justify-center rounded-md text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        aria-label="Schließen"
                    >
                        <X className="size-5" />
                    </button>
                </div>
            </header>

            {/* ── scrollable body ────────────────────────────────────────── */}
            <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto">
                <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 py-10 sm:px-8 lg:px-12">
                    {!hasMessages ? (
                        <>
                            {/* greeting */}
                            <div className="flex flex-col items-center gap-3 text-center">
                                <BrandStar className="size-10 text-white" />

                                <h1 className="text-2xl font-semibold text-white sm:text-3xl">
                                    Hallo {portal.user.name.split(" ")[0]}!
                                </h1>

                                <div className="flex items-center gap-1.5 text-sm text-white/60">
                                    Wie kann ich dir heute helfen?
                                    <InfoTooltip />
                                </div>
                            </div>

                            {/* suggestion heading */}
                            <h2 className="mt-12 text-lg font-semibold text-white sm:text-xl">
                                Beispiele für Fragen, bei denen ich dir weiterhelfen kann
                            </h2>

                            {/* suggestion cards */}
                            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {suggestions.map((s, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => handleSend(s.text)}
                                        className="group flex flex-col overflow-hidden rounded-xl text-left transition-colors hover:bg-white/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                    >
                                        <div className="aspect-[5/3] w-full overflow-hidden rounded-xl bg-white/[0.06]">
                                            <Image
                                                src={s.image}
                                                alt={s.text}
                                                width={400}
                                                height={300}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>

                                        <div className="px-1 pb-3 pt-3 text-[15.5px] leading-snug text-white/80 group-hover:text-white">
                                            {s.text}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {messages.map((msg) => (
                                <ChatMessage
                                    key={msg.id}
                                    role={msg.role}
                                    text={msg.text}
                                    animate={msg.animate}
                                    sourceKey={msg.sourceKey}
                                    answerImages={msg.answerImages}
                                    onAnimationDone={() => markAnimationDone(msg.id)}
                                />
                            ))}

                            {isTyping && (
                                <div className="flex gap-3">
                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                                        <Bot className="size-4 text-white/70" />
                                    </div>

                                    <div className="rounded-2xl bg-white/[0.06] px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <span
                                                className="size-1.5 rounded-full bg-white/40 animate-bounce"
                                                style={{ animationDelay: "0ms" }}
                                            />
                                            <span
                                                className="size-1.5 rounded-full bg-white/40 animate-bounce"
                                                style={{ animationDelay: "150ms" }}
                                            />
                                            <span
                                                className="size-1.5 rounded-full bg-white/40 animate-bounce"
                                                style={{ animationDelay: "300ms" }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={chatEndRef} />
                        </div>
                    )}

                    <div className="flex-1" />

                </div>
            </div>

            {/* ── bottom area ───────────────────────────────────────────── */}
            <div className="relative z-10 shrink-0 px-5 pb-5 sm:px-8 lg:px-12">
                <div className="mx-auto max-w-5xl">

                    {/* ── Folgefragen (fixiert über Input) ── */}
                    {hasMessages && !isTyping && (
                        <div className="mb-3 flex flex-wrap gap-2">
                            {suggestions
                                .filter((s) => !messages.some((m) => m.text === s.text))
                                .map((s, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => handleSend(s.text)}
                                        className="rounded-full border border-white/15 px-3.5 py-2 text-xs text-white/60 transition-colors hover:border-white/30 hover:text-white"
                                    >
                                        {s.text}
                                    </button>
                                ))}
                        </div>
                    )}
                    {infoBannerVisible && !hasMessages && (
                        <div className="mb-3 flex items-start gap-2 rounded-md bg-white/[0.04] px-4 py-2.5 text-sm text-white/60">
                            <Info className="mt-0.5 size-4 shrink-0 text-sky-400" />

                            <div className="flex-1">
                                Deine Antwortqualität hängt von den genutzten Datenquellen ab.
                                Passe diese unter &quot;Quellen&quot; an.
                            </div>

                            <button
                                type="button"
                                onClick={() => setInfoBannerVisible(false)}
                                className="shrink-0 text-white/40 transition-colors hover:text-white"
                                aria-label="Banner schließen"
                            >
                                <X className="size-4" />
                            </button>
                        </div>
                    )}

                    <div className="flex flex-col gap-2.5 rounded-xl bg-[#2a2a2a] px-4 py-3">
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={
                                hasMessages
                                    ? "Weitere Frage stellen …"
                                    : "Frage mich alles über Technik, Ausstattungen, Modelle und mehr."
                            }
                            className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                        />

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {sourceChips.map((chip) => (
                                    <button
                                        key={chip.label}
                                        type="button"
                                        className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1 text-xs text-white/70 transition-colors hover:border-white/30 hover:text-white"
                                    >
                                        <chip.icon className="size-3.5" />
                                        {chip.label}
                                        <span className="inline-flex size-4 items-center justify-center rounded-full bg-white/15 text-[10px] font-bold leading-none">
                                            {chip.count}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <button
                                type="button"
                                disabled={!query.trim() || isTyping}
                                onClick={() => handleSend()}
                                className="inline-flex size-8 items-center justify-center rounded-lg bg-white/10 text-white/60 transition-colors hover:bg-white/20 hover:text-white disabled:opacity-30 disabled:hover:bg-white/10"
                                aria-label="Nachricht senden"
                            >
                                <Send className="size-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}