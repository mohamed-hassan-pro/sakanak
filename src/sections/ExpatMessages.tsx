// Expat Messages Page
// صفحة المحادثات للمغتربين

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChatInterface, ChatList } from '@/components/chat-interface/ChatInterface';
import { useAuthStore, useMessagesStore } from '@/lib/store';
import { seedMessages, seedOwners, seedProperties } from '@/lib/seed-data';
import type { Message, User, Property } from '@/types';

export function ExpatMessages() {
  const { user } = useAuthStore();
  const { messages, setMessages, addMessage, activeConversation } = useMessagesStore();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(activeConversation || null);
  const [conversations, setConversations] = useState<any[]>([]);

  useEffect(() => {
    // تحميل الرسائل من البيانات التجريبية
    const mockMessages = seedMessages.map((m) => ({
      ...m,
      createdAt: new Date(m.createdAt),
    })) as Message[];
    setMessages(mockMessages);
  }, []);

  useEffect(() => {
    // تجميع المحادثات
    const userMessages = messages.filter(
      (m) => m.senderId === user?.id || m.receiverId === user?.id
    );

    const groupedByUser = userMessages.reduce((acc, message) => {
      const otherUserId =
        message.senderId === user?.id ? message.receiverId : message.senderId;

      if (!acc[otherUserId]) {
        acc[otherUserId] = {
          messages: [],
          lastMessage: message,
          unreadCount: 0,
        };
      }

      acc[otherUserId].messages.push(message);

      if (message.receiverId === user?.id && !message.read) {
        acc[otherUserId].unreadCount++;
      }

      if (new Date(message.createdAt) > new Date(acc[otherUserId].lastMessage.createdAt)) {
        acc[otherUserId].lastMessage = message;
      }

      return acc;
    }, {} as Record<string, { messages: Message[]; lastMessage: Message; unreadCount: number }>);

    // تحويل لـ array مع بيانات المستخدمين
    const conversationsArray = Object.entries(groupedByUser).map(
      ([userId, data]) => {
        const otherUser = seedOwners.find((o) => o.id === userId) || {
          id: userId,
          name: 'مالك تجريبي',
          email: 'owner@test.com',
          role: 'OWNER',
        };

        const property = seedProperties.find((p) =>
          data.messages.some((m) => m.propertyId === p.id)
        );

        return {
          user: otherUser as User,
          lastMessage: data.lastMessage,
          unreadCount: data.unreadCount,
          property: property as Property,
        };
      }
    );

    setConversations(conversationsArray);

    // اختيار المحادثة النشطة إذا كانت موجودة، وإلا أول محادثة
    if (activeConversation) {
      setSelectedUserId(activeConversation);
    } else if (conversationsArray.length > 0 && !selectedUserId) {
      setSelectedUserId(conversationsArray[0].user.id);
    }
  }, [messages, user, activeConversation]);

  if (conversations.length === 0) {
    return (
      <div className="h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center p-8 text-center">
        <Card className="max-w-md p-8 flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <MessageSquare className="w-10 h-10 text-[#1e3a5f] opacity-40" />
          </div>
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">لا توجد محادثات</h2>
          <p className="text-gray-500 mb-8">
            ابدأ بالبحث عن سكن وتواصل مع الملاك للحصول على مزيد من المعلومات أو حجز معاينة.
          </p>
          <Link to="/dashboard/expat/search">
            <Button className="bg-[#1e3a5f] hover:bg-[#1e3a5f]/90">
              استكشف السكنات المتاحة
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const selectedConversation = conversations.find(
    (c) => c.user.id === selectedUserId
  );

  const conversationMessages = selectedUserId
    ? messages.filter(
      (m) =>
        (m.senderId === user?.id && m.receiverId === selectedUserId) ||
        (m.senderId === selectedUserId && m.receiverId === user?.id)
    )
    : [];

  const handleSendMessage = (content: string) => {
    if (!selectedUserId || !user) return;

    const newMessage: Message = {
      id: 'msg-' + Date.now(),
      content,
      senderId: user.id,
      receiverId: selectedUserId,
      propertyId: selectedConversation?.property?.id || '',
      createdAt: new Date(),
      read: false,
    };

    addMessage(newMessage);
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-full">
        <div className="grid md:grid-cols-3 gap-6 h-full">
          {/* Chat List */}
          <div className="hidden md:block h-full">
            <ChatList
              conversations={conversations}
              selectedUserId={selectedUserId || undefined}
              onSelect={setSelectedUserId}
            />
          </div>

          {/* Chat Interface */}
          <div className="md:col-span-2 h-full">
            {selectedConversation ? (
              <ChatInterface
                messages={conversationMessages}
                currentUser={user!}
                otherUser={selectedConversation.user}
                property={selectedConversation.property}
                onSendMessage={handleSendMessage}
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-white rounded-lg shadow-lg">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-10 h-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    اختار محادثة
                  </h3>
                  <p className="text-gray-500">
                    اختار محادثة من القائمة عشان تبدأ التواصل
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
