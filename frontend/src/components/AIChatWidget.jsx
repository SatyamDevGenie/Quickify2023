import { useState, useRef, useEffect } from 'react';
import { HiChatAlt2, HiX } from 'react-icons/hi';
import { toast } from 'react-toastify';
import api from '../lib/api';

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I’m your shopping assistant. Ask me for product recommendations, budget picks, or what’s best for a specific use.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (open && listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [open, messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: text }]);
    setLoading(true);
    try {
      const { data } = await api.post('/ai/chat', { message: text });
      setMessages((m) => [...m, { role: 'assistant', content: data.reply || 'No response.' }]);
    } catch (err) {
      toast.error('AI assistant is unavailable. Try again later.');
      setMessages((m) => [...m, { role: 'assistant', content: 'Sorry, I couldn’t process that. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-primary-500 text-white shadow-lg transition hover:bg-primary-600"
        aria-label="Open AI assistant"
      >
        {open ? <HiX className="h-6 w-6" /> : <HiChatAlt2 className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-[9998] flex w-[340px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:w-[380px]">
          <div className="border-b border-slate-200 bg-primary-500 px-4 py-3 text-white">
            <p className="font-semibold">Shopping Assistant</p>
            <p className="text-xs opacity-90">Powered by AI · Ask for recommendations</p>
          </div>
          <div
            ref={listRef}
            className="flex max-h-[320px] flex-col gap-3 overflow-y-auto p-3"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm ${
                  msg.role === 'user'
                    ? 'ml-auto bg-primary-500 text-white'
                    : 'mr-auto bg-slate-100 text-slate-800'
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="mr-auto rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-500">
                Thinking…
              </div>
            )}
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            className="flex gap-2 border-t border-slate-200 p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for product suggestions…"
              className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-xl bg-primary-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-600 disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
