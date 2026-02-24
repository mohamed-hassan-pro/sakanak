// Chat Interface Component
// مكون واجهة المحادثة

import { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Phone, 
  MapPin, 
  Calendar, 
  MoreVertical,
  Check,
  CheckCheck,
  Image as ImageIcon,
  Paperclip
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Message, User, Property } from '@/types';

interface ChatInterfaceProps {
  messages: Message[];
  currentUser: User;
  otherUser: User;
  property?: Property;
  onSendMessage: (content: string) => void;
  onRequestVisit?: () => void;
  isLoading?: boolean;
}

export function ChatInterface({
  messages,
  currentUser,
  otherUser,
  property,
  onSendMessage,
  onRequestVisit,
  isLoading = false,
}: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, Message[]>);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={otherUser.avatar} />
            <AvatarFallback className="bg-[#1e3a5f] text-white">
              {otherUser.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h3 className="font-semibold">{otherUser.name}</h3>
            <p className="text-xs text-gray-500">
              {otherUser.role === 'OWNER' ? 'مالك السكن' : 'مغترب'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {property && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRequestVisit}
              className="hidden sm:flex"
            >
              <Calendar className="w-4 h-4 ml-1" />
              حجز معاينة
            </Button>
          )}
          <Button variant="ghost" size="icon">
            <Phone className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Property Info (if exists) */}
      {property && (
        <div className="p-3 bg-gray-50 border-b">
          <div className="flex items-center gap-3">
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">{property.title}</h4>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {property.city}
              </p>
              <p className="text-sm font-semibold text-[#1e3a5f]">
                {property.price.toLocaleString()} ج/{property.priceType === 'per_bed' ? 'سرير' : property.priceType === 'per_room' ? 'غرفة' : 'شقة'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-6">
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date}>
              {/* Date Separator */}
              <div className="flex justify-center mb-4">
                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-500">
                  {formatDate(new Date(date))}
                </span>
              </div>

              {/* Messages for this date */}
              <div className="space-y-3">
                {dateMessages.map((message) => {
                  const isCurrentUser = message.senderId === currentUser.id;
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] ${
                          isCurrentUser ? 'bg-[#1e3a5f] text-white' : 'bg-gray-100'
                        } rounded-2xl px-4 py-2`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div
                          className={`flex items-center justify-end gap-1 mt-1 ${
                            isCurrentUser ? 'text-white/70' : 'text-gray-500'
                          }`}
                        >
                          <span className="text-xs">
                            {formatTime(message.createdAt)}
                          </span>
                          {isCurrentUser && (
                            message.read ? (
                              <CheckCheck className="w-3 h-3" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">ابدأ المحادثة الآن</p>
              <p className="text-sm text-gray-400 mt-1">
                اسأل عن أي تفاصيل تحتاجها عن السكن
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Paperclip className="w-5 h-5 text-gray-500" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <ImageIcon className="w-5 h-5 text-gray-500" />
          </Button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="اكتب رسالتك..."
              className="w-full px-4 py-3 bg-gray-100 rounded-full focus:ring-2 focus:ring-[#1e3a5f] focus:bg-white transition-all"
              disabled={isLoading}
            />
          </div>
          
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim() || isLoading}
            className="bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 rounded-full w-12 h-12 p-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Chat List Component
interface ChatListProps {
  conversations: {
    user: User;
    lastMessage: Message;
    unreadCount: number;
    property?: Property;
  }[];
  selectedUserId?: string;
  onSelect: (userId: string) => void;
}

export function ChatList({ conversations, selectedUserId, onSelect }: ChatListProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return messageDate.toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (diffDays === 1) {
      return 'أمس';
    } else if (diffDays < 7) {
      return messageDate.toLocaleDateString('ar-EG', { weekday: 'long' });
    } else {
      return messageDate.toLocaleDateString('ar-EG', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  return (
    <div className="h-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="font-bold text-lg">المحادثات</h2>
      </div>
      
      <ScrollArea className="h-[calc(100%-60px)]">
        <div className="divide-y">
          {conversations.map((conversation) => {
            const isSelected = selectedUserId === conversation.user.id;
            
            return (
              <button
                key={conversation.user.id}
                onClick={() => onSelect(conversation.user.id)}
                className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors text-right ${
                  isSelected ? 'bg-blue-50 hover:bg-blue-50' : ''
                }`}
              >
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={conversation.user.avatar} />
                    <AvatarFallback className="bg-[#1e3a5f] text-white">
                      {conversation.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium truncate">{conversation.user.name}</h4>
                    <span className="text-xs text-gray-500">
                      {formatTime(conversation.lastMessage.createdAt)}
                    </span>
                  </div>
                  
                  <p className={`text-sm truncate ${
                    conversation.unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-500'
                  }`}>
                    {conversation.lastMessage.content}
                  </p>
                  
                  {conversation.property && (
                    <p className="text-xs text-[#2a9d8f] mt-1 truncate">
                      {conversation.property.title}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
          
          {conversations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">لا توجد محادثات</p>
              <p className="text-sm text-gray-400 mt-1">
                ابحث عن سكن وابدأ محادثة
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
