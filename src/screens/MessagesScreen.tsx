import React from 'react';
import { Search, Bell, Heart, MessageSquare } from 'lucide-react';
import { MESSAGES } from '../constants';
import { motion } from 'motion/react';

export default function MessagesScreen() {
  return (
    <div className="pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#f8f9fa]/80 backdrop-blur-xl px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#041920]" />
          <span className="font-headline font-bold text-xl text-[#041920] tracking-tight">消息</span>
        </div>
        <button className="p-2 hover:bg-black/5 rounded-full transition-colors">
          <Search className="w-6 h-6 text-[#041920]" />
        </button>
      </header>

      <main className="px-6 mt-4">
        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索对话或联系人..."
            className="w-full bg-[#f3f4f5] border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-[#396569]/20 placeholder:text-gray-400 font-medium transition-all outline-none"
          />
        </div>

        {/* Quick Actions */}
        <section className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-white p-5 rounded-3xl flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#396569]/10 flex items-center justify-center">
              <Bell className="w-6 h-6 text-[#396569] fill-[#396569]/20" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-[#041920] text-sm">系统通知</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">2条新公告</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-3xl flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer shadow-sm">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <Heart className="w-6 h-6 text-orange-500 fill-orange-500/20" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-[#041920] text-sm">活动提醒</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">即将开始的领养日</p>
            </div>
          </div>
        </section>

        {/* Chat List */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline text-2xl font-bold tracking-tight text-[#041920]">最近消息</h2>
            <span className="text-[12px] font-bold text-[#396569] px-3 py-1 bg-[#396569]/10 rounded-full">3条未读</span>
          </div>
          <div className="space-y-2">
            {MESSAGES.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-4 p-4 -mx-4 rounded-3xl cursor-pointer transition-all ${msg.unreadCount > 0 ? 'bg-[#f3f4f5]' : 'hover:bg-[#f3f4f5]'}`}
              >
                <div className="relative">
                  {msg.avatarUrl ? (
                    <img 
                      src={msg.avatarUrl} 
                      alt={msg.senderName} 
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[#1a2e35] flex items-center justify-center text-white">
                      <span className="text-xl">🐾</span>
                    </div>
                  )}
                  {msg.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#396569] border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-headline font-bold text-[#041920] truncate">{msg.senderName}</h4>
                    <span className={`text-[10px] font-medium ${msg.unreadCount > 0 ? 'text-[#396569]' : 'text-gray-400'}`}>{msg.time}</span>
                  </div>
                  <p className={`text-sm truncate ${msg.unreadCount > 0 ? 'text-[#041920] font-bold' : 'text-gray-500'}`}>
                    {msg.lastMessage}
                  </p>
                </div>
                {msg.unreadCount > 0 && (
                  <div className="w-5 h-5 bg-[#396569] text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                    {msg.unreadCount}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
