import React from 'react';
import { Compass, Heart, MessageCircle, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/explore', label: '探索', icon: Compass },
  { to: '/apply', label: '领养', icon: Heart },
  { to: '/messages', label: '消息', icon: MessageCircle },
  { to: '/profile', label: '我的', icon: User },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-3xl bg-[#f8f9fa]/85 px-4 pb-6 pt-3 shadow-[0px_-4px_24px_rgba(4,25,32,0.04)] backdrop-blur-xl">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          end={tab.to === '/explore'}
          to={tab.to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 rounded-2xl px-4 py-2 transition-all active:scale-90 ${
              isActive ? 'bg-[#396569]/10 font-bold text-[#396569]' : 'text-gray-400'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <tab.icon className={`h-6 w-6 ${isActive ? 'fill-current' : ''}`} />
              <span className="text-[10px]">{tab.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
