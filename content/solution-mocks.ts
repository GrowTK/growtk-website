/**
 * Sample data for the coded product mocks (components/sections/solutions/product-mock.tsx).
 * These are illustrations of what each system looks like, not client data or
 * results, so every value here is plainly sample content. Keep it short and
 * free of em dashes and en dashes.
 */

export type MockKind = "kb" | "helpdesk" | "qa" | "survey";

export const productMocks = {
  kb: {
    title: "Help center",
    label: "Sample knowledge base search with matching articles",
    placeholder: "Ask anything",
    queries: ["cancel my subscription", "change delivery address", "reset my password"],
    articles: [
      { category: "Billing", title: "How to cancel or pause your plan", read: "2 min read" },
      { category: "Orders", title: "Changing an address after you order", read: "3 min read" },
      { category: "Account", title: "Resetting your password and login", read: "1 min read" },
      { category: "Billing", title: "Refunds: what to expect and when", read: "2 min read" },
    ],
    matchLabel: "match",
    footer: "Same answers power your AI agent",
  },
  helpdesk: {
    title: "Support queue",
    label: "Sample helpdesk queue with tickets from calls, chats and email",
    columns: ["Request", "Status", "Due"],
    tickets: [
      { channel: "phone", subject: "Missed delivery, wants a new slot", status: "AI resolved", due: "Done" },
      { channel: "chat", subject: "Card declined at checkout", status: "AI drafted", due: "4m" },
      { channel: "mail", subject: "Invoice copy for March", status: "AI resolved", due: "Done" },
      { channel: "social", subject: "Item arrived damaged", status: "Escalated", due: "12m" },
      { channel: "phone", subject: "Book a service visit", status: "AI resolved", due: "Done" },
      { channel: "chat", subject: "Upgrade to the yearly plan", status: "Assigned", due: "18m" },
    ],
    statusTone: { "AI resolved": "yellow", "AI drafted": "lilac", Escalated: "peach", Assigned: "neutral" } as Record<string, "yellow" | "lilac" | "peach" | "neutral">,
    footer: "Every channel, one queue",
  },
  qa: {
    title: "Quality scorecard",
    label: "Sample quality scorecard scoring a conversation against five criteria",
    conversation: "Call with a returning customer",
    scoreLabel: "Score",
    criteria: [
      { name: "Greeting and identity check", score: 96 },
      { name: "Accurate answer", score: 88 },
      { name: "Empathy and tone", score: 92 },
      { name: "Resolved on first contact", score: 80 },
      { name: "Policy and compliance", score: 100 },
    ],
    flagTitle: "Coaching queue",
    flags: ["Refund promised without approval", "Hold time over two minutes"],
  },
  survey: {
    title: "Customer feedback",
    label: "Sample survey dashboard with a score chart and incoming responses",
    chartLabel: "How likely are you to recommend us?",
    bars: [2, 1, 2, 3, 4, 6, 9, 14, 22, 30, 26],
    responses: [
      { score: 10, text: "Booked in under a minute, great.", tone: "yellow" },
      { score: 9, text: "Quick answer on chat at night.", tone: "yellow" },
      { score: 4, text: "Waited too long for a callback.", tone: "peach", alert: "Sent to a manager" },
      { score: 8, text: "Helpful, a bit slow on email.", tone: "lilac" },
    ] as { score: number; text: string; tone: "yellow" | "peach" | "lilac"; alert?: string }[],
    footer: "Low scores reach a person the same day",
  },
};
