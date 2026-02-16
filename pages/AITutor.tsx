
import React, { useState, useRef, useEffect } from 'react';
import { getAITutorResponse, summarizeNotes } from '../services/geminiService';
import { ChatMessage } from '../types';
import { useAppContext } from '../context/AppContext';

const AITutor: React.FC = () => {
  const { t, language } = useAppContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize first message when language changes or on mount
  useEffect(() => {
    if (messages.length === 0) {
        setMessages([{ role: 'model', text: t.aiBotDesc, timestamp: new Date() }]);
    }
  }, [t.aiBotDesc]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getAITutorResponse(input, language);
      setMessages(prev => [...prev, { role: 'model', text: response || 'Error...', timestamp: new Date() }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Error...', timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (content) {
        setIsSummarizing(true);
        setMessages(prev => [...prev, { role: 'user', text: `${t.summarize}: ${file.name}`, timestamp: new Date() }]);
        
        try {
          const summary = await summarizeNotes(content.substring(0, 5000), language);
          setMessages(prev => [...prev, { role: 'model', text: summary || 'Error', timestamp: new Date() }]);
        } catch (error) {
          setMessages(prev => [...prev, { role: 'model', text: 'Error', timestamp: new Date() }]);
        } finally {
          setIsSummarizing(false);
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
      {/* Header */}
      <div className="p-4 bg-indigo-600 dark:bg-indigo-800 text-white flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-xl">🤖</div>
          <div>
            <h2 className="font-bold">EduBot IA</h2>
            <p className="text-xs text-indigo-200">{t.aiBotDesc}</p>
          </div>
        </div>
        <div className="hidden md:block">
          <label className="cursor-pointer bg-indigo-500 hover:bg-indigo-400 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
            {t.summarize}
            <input type="file" className="hidden" accept=".txt,.md" onChange={handleFileUpload} />
          </label>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`
              max-w-[85%] p-4 rounded-2xl shadow-sm
              ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-tl-none'}
            `}>
              <div className="text-sm whitespace-pre-wrap leading-relaxed">
                {msg.text}
              </div>
              <p className={`text-[10px] mt-2 opacity-60 ${msg.role === 'user' ? 'text-right text-indigo-100' : 'text-left text-slate-500'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {(isLoading || isSummarizing) && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl rounded-tl-none flex gap-1">
              <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={t.aiPlaceholder}
            className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-slate-100"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 text-white w-12 h-12 rounded-xl flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md"
          >
            ✈️
          </button>
        </div>
      </div>
    </div>
  );
};

export default AITutor;
