
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Loader2, MapPin, BedDouble, Bath, Square, CalendarCheck, CheckCircle, User, Phone, Calendar, Clock, ExternalLink, Sparkles, BrainCircuit } from 'lucide-react';
import { createChatSession } from '../services/geminiService';
import { Chat } from '@google/genai';
import { useAppContext } from '../App';
import { BookingStatus, ChatMessage, Property } from '../types';
import { useNavigate } from 'react-router-dom';

// --- Sub-component: Chat Property Card ---
const ChatPropertyCard: React.FC<{ property: Property; onBook: () => void }> = ({ property, onBook }) => {
  const navigate = useNavigate();
  const { toggleChat } = useAppContext();

  const handleCardClick = () => {
    toggleChat(false); // Close chat to let user see the page
    navigate(`/property/${property.id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 min-w-[240px] max-w-[260px] flex-shrink-0 snap-center mx-1 my-2 cursor-pointer group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="relative h-32">
        <img src={property.imageUrl} alt={property.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition"></div>
        <div className="absolute top-2 right-2 bg-nile-900/90 text-gold-400 text-[10px] font-bold px-2 py-1 rounded-full">
          {property.type}
        </div>
        <div className="absolute bottom-2 left-2 bg-white/90 text-nile-900 text-xs font-bold px-2 py-0.5 rounded shadow-sm">
          {property.price.toLocaleString()} ج.م
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition duration-300">
           <div className="bg-white/90 p-1.5 rounded-full text-nile-900 shadow-lg">
             <ExternalLink size={16} />
           </div>
        </div>
      </div>
      <div className="p-3">
        <h4 className="font-bold text-nile-900 text-sm mb-1 line-clamp-1 group-hover:text-gold-600 transition-colors">{property.title}</h4>
        <div className="flex items-center text-[10px] text-gray-500 mb-2">
          <MapPin size={10} className="ml-1" /> {property.location}
        </div>
        
        <div className="flex justify-between items-center bg-gray-50 p-1.5 rounded-lg mb-3">
          <div className="flex flex-col items-center">
            <Square size={12} className="text-nile-400 mb-0.5" />
            <span className="text-[10px] font-bold">{property.area}</span>
          </div>
          <div className="w-px h-6 bg-gray-200"></div>
          <div className="flex flex-col items-center">
            <BedDouble size={12} className="text-nile-400 mb-0.5" />
            <span className="text-[10px] font-bold">{property.bedrooms}</span>
          </div>
          <div className="w-px h-6 bg-gray-200"></div>
          <div className="flex flex-col items-center">
            <Bath size={12} className="text-nile-400 mb-0.5" />
            <span className="text-[10px] font-bold">{property.bathrooms}</span>
          </div>
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation(); // Prevent navigation when clicking book
            onBook();
          }}
          className="w-full bg-gold-500 hover:bg-gold-600 text-nile-900 text-xs font-bold py-2 rounded-lg transition flex items-center justify-center gap-1 shadow-md hover:shadow-lg"
        >
          <CalendarCheck size={12} /> طلب معاينة
        </button>
      </div>
    </div>
  );
};

// --- Sub-component: Inline Chat Booking Form ---
const ChatBookingForm: React.FC<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', date: '', time: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    onSubmit(formData);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex flex-col items-center text-center animate-fade-in-up">
        <CheckCircle className="text-green-500 mb-2" size={32} />
        <h4 className="text-nile-900 font-bold text-sm">تم استلام طلبك بنجاح</h4>
        <p className="text-gray-500 text-xs">سيتم التواصل معك لتأكيد الموعد قريباً.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 space-y-3 min-w-[250px] animate-fade-in-up">
      <h4 className="font-bold text-nile-900 text-sm flex items-center gap-2 border-b pb-2">
        <CalendarCheck size={16} className="text-gold-500" /> تسجيل حجز معاينة
      </h4>
      
      <div className="space-y-2">
        <div className="relative">
           <User size={14} className="absolute right-3 top-2.5 text-gray-400" />
           <input required placeholder="الاسم" className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2 pr-9 pl-3 text-xs focus:ring-1 focus:ring-gold-400 outline-none" 
             value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        </div>
        <div className="relative">
           <Phone size={14} className="absolute right-3 top-2.5 text-gray-400" />
           <input required placeholder="رقم الهاتف" type="tel" className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2 pr-9 pl-3 text-xs focus:ring-1 focus:ring-gold-400 outline-none" 
             value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
        </div>
        <div className="flex gap-2">
           <div className="relative flex-1">
              <Calendar size={14} className="absolute right-2 top-2.5 text-gray-400" />
              <input required type="date" className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2 pr-7 pl-1 text-[10px] focus:ring-1 focus:ring-gold-400 outline-none" 
                value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
           </div>
           <div className="relative flex-1">
              <Clock size={14} className="absolute right-2 top-2.5 text-gray-400" />
              <input required type="time" className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2 pr-7 pl-1 text-[10px] focus:ring-1 focus:ring-gold-400 outline-none" 
                value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
           </div>
        </div>
      </div>
      <button type="submit" className="w-full bg-nile-900 text-gold-400 text-xs font-bold py-2 rounded-lg hover:bg-nile-800 transition">تأكيد الحجز</button>
    </form>
  );
};

export const ChatBot: React.FC = () => {
  const { isChatOpen, toggleChat, addBooking, properties } = useAppContext();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', type: 'text', text: 'أهلاً بحضرتك يا فندم في النيل للعقارات 🌹. أنا مساعدك الشخصي، ممكن أساعدك إزاي النهاردة؟' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<Chat | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  // Re-initialize chat if properties change
  useEffect(() => {
    chatSessionRef.current = createChatSession(properties);
  }, [properties]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isChatOpen]);

  // Initial greeting trigger to start the interactive flow
  useEffect(() => {
    if (isChatOpen && messages.length === 1 && chatSessionRef.current) {
        // Trigger the AI to start the flow immediately
        handleSend("ابدأ", true); 
    }
  }, [isChatOpen]);

  const handleSend = async (userMsg: string, hidden: boolean = false) => {
    if (!userMsg.trim() || !chatSessionRef.current) return;

    if (!hidden) {
        setInput('');
        setMessages(prev => [...prev, { role: 'user', type: 'text', text: userMsg }]);
    }
    
    setLoading(true);

    try {
      let result = await chatSessionRef.current.sendMessage({ message: userMsg });
      
      // Handle Function Calls loop
      while (result.functionCalls && result.functionCalls.length > 0) {
        const functionCall = result.functionCalls[0];
        let functionResponseData: any = { result: "Success" };
        let uiMessage: ChatMessage | null = null;

        // 1. RECOMMEND PROPERTIES
        if (functionCall.name === 'recommend_properties') {
            const args: any = functionCall.args;
            const recommendedIds = args.propertyIds || [];
            const recommendedProps = properties.filter(p => recommendedIds.includes(p.id));
            
            if (recommendedProps.length > 0) {
                // Determine which one is primary for potential booking
                setSelectedPropertyId(recommendedProps[0].id);
                uiMessage = { role: 'model', type: 'card', data: recommendedProps };
            } else {
                 uiMessage = { role: 'model', type: 'text', text: 'للأسف يا فندم مفيش وحدات بالمواصفات دي حالياً، لكن عندنا حاجات تانية مميزة.' };
            }
        } 
        
        // 2. ASK MULTIPLE CHOICE (Buttons)
        else if (functionCall.name === 'ask_multiple_choice') {
            const args: any = functionCall.args;
            uiMessage = { 
                role: 'model', 
                type: 'options', 
                text: args.question,
                data: args.options 
            };
        }

        // 3. SHOW BOOKING FORM
        else if (functionCall.name === 'show_booking_form') {
            const args: any = functionCall.args;
            if (args.propertyId) setSelectedPropertyId(args.propertyId);
            uiMessage = { role: 'model', type: 'form', data: { propertyId: args.propertyId || selectedPropertyId } };
        }

        // Add UI message if generated
        if (uiMessage) {
             setMessages(prev => [...prev, uiMessage!]);
        }

        // Send tool response back to Gemini
        const toolResponse = {
             functionResponse: {
               name: functionCall.name,
               response: functionResponseData,
               id: functionCall.id
             }
        };
        result = await chatSessionRef.current.sendMessage({ message: [toolResponse] });
      }

      // Display Final Text Response if present (and not just a tool call)
      const text = result.text;
      if (text) {
        setMessages(prev => [...prev, { role: 'model', type: 'text', text: text }]);
      }

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', type: 'text', text: 'عذراً، حدث خطأ بسيط. هل يمكنك المحاولة مرة أخرى؟' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = (option: string) => {
    handleSend(option);
  };

  const handleBookingSubmit = (formData: any) => {
    const property = properties.find(p => p.id === selectedPropertyId) || properties[0];
    addBooking({
        propertyId: property.id,
        propertyTitle: property.title,
        customerName: formData.name,
        customerPhone: formData.phone,
        date: formData.date,
        time: formData.time,
        status: BookingStatus.PENDING,
        createdAt: Date.now()
    });
    // We don't need to send anything to Gemini, the UI handles the success state locally in the sub-component
  };

  const handleQuickBook = (prop: Property) => {
    setSelectedPropertyId(prop.id);
    handleSend("أرغب في حجز معاينة لهذا العقار");
  };

  return (
    <>
      {/* Floating Trigger Button Container */}
      <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-start gap-2 ${isChatOpen ? 'hidden' : 'flex'}`}>
         
         {/* Speech Bubble */}
         <div className="bg-white text-nile-900 px-5 py-3 rounded-2xl rounded-br-none shadow-xl border border-gold-100 mb-1 animate-fade-in-up origin-bottom-right max-w-[200px] text-center relative group cursor-pointer" onClick={() => toggleChat(true)}>
           <span className="text-xs font-bold block leading-relaxed">
             أنا مستشارك الذكي 🤖
             <br/>
             تحب أساعدك؟
           </span>
           {/* Triangle Tail */}
           <div className="absolute -bottom-2 right-5 w-4 h-4 bg-white transform rotate-45 border-b border-r border-gold-100"></div>
         </div>

         {/* Robot Button */}
         <button
            onClick={() => toggleChat(true)}
            className="bg-nile-900 text-gold-400 p-4 rounded-full shadow-2xl hover:shadow-gold-500/30 transition transform hover:scale-110 group border-2 border-gold-500 relative"
          >
            <div className="absolute inset-0 bg-gold-400/20 rounded-full animate-pulse-slow"></div>
            {/* Robot Face Icon */}
            <Bot size={32} strokeWidth={1.5} className="relative z-10" />
          </button>
      </div>

      {isChatOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-3xl shadow-2xl z-50 flex flex-col border border-gray-200 overflow-hidden animate-fade-in-up">
          {/* Chat Header */}
          <div className="bg-nile-900 p-4 flex justify-between items-center text-white shadow-md">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-full backdrop-blur-sm relative">
                <Bot size={24} className="text-gold-400" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-nile-900 rounded-full"></span>
              </div>
              <div>
                <h3 className="font-bold text-base">مساعدك العقاري</h3>
                <span className="text-[10px] text-gray-300 block">متصل الآن</span>
              </div>
            </div>
            <button onClick={() => toggleChat(false)} className="text-white/60 hover:text-white transition">
              <X size={20} />
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-grow p-4 overflow-y-auto bg-gray-50 space-y-4 scrollbar-thin scrollbar-thumb-nile-100">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-start' : 'items-end'}`}>
                
                {/* Text Message */}
                {msg.text && (
                  <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm mb-2 ${
                    msg.role === 'user' 
                      ? 'bg-nile-900 text-white rounded-tr-none self-start' 
                      : 'bg-white text-gray-800 rounded-tl-none border border-gray-200 self-end'
                  }`}>
                    {msg.text}
                  </div>
                )}

                {/* Option Buttons */}
                {msg.type === 'options' && msg.data && (
                    <div className="flex flex-wrap gap-2 justify-end max-w-[90%] mb-2">
                        {(msg.data as string[]).map((opt, i) => (
                            <button 
                                key={i}
                                onClick={() => handleOptionClick(opt)}
                                className="bg-white border border-gold-500/50 text-nile-900 text-xs font-bold px-4 py-2 rounded-full hover:bg-gold-500 hover:text-white transition shadow-sm"
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                )}

                {/* Property Cards */}
                {msg.type === 'card' && msg.data && (
                  <div className="w-full overflow-x-auto pb-2 flex gap-2 snap-x px-1 no-scrollbar direction-rtl mb-2">
                     {(msg.data as Property[]).map(prop => (
                        <ChatPropertyCard 
                          key={prop.id} 
                          property={prop} 
                          onBook={() => handleQuickBook(prop)} 
                        />
                     ))}
                  </div>
                )}

                {/* Booking Form */}
                {msg.type === 'form' && (
                    <div className="w-full max-w-[85%] self-end mb-2">
                        <ChatBookingForm onSubmit={handleBookingSubmit} />
                    </div>
                )}

              </div>
            ))}
            
            {loading && (
              <div className="flex justify-end">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-2">
                  <Loader2 className="animate-spin text-gold-500" size={16} />
                  <span className="text-xs text-gray-400">جاري الكتابة...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="اكتب ردك..."
              className="flex-grow bg-gray-100 text-nile-900 placeholder-gray-400 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/50 transition border border-transparent focus:border-gold-400"
            />
            <button 
              onClick={() => handleSend(input)}
              disabled={loading || !input.trim()}
              className="bg-nile-900 text-gold-500 p-3 rounded-full hover:bg-nile-800 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md transform active:scale-95"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
