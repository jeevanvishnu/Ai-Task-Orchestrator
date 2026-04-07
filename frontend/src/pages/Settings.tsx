import React from 'react';

export const Settings = () => {
  return (
    <div className="px-4 md:px-10 py-8 md:py-12 max-w-6xl mx-auto w-full pb-20 fade-in">
      <div className="mb-10 lg:mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-3">Settings</h1>
        <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
          Manage your account preferences and application settings.
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-8 md:p-12 text-center flex flex-col items-center gap-6">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground mb-1">Coming Soon</h3>
          <p className="text-muted-foreground max-w-sm">We're working hard to bring you more customization options. Stay tuned!</p>
        </div>
      </div>
    </div>
  );
};
