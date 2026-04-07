import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center flex-col items-center">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 mb-4">
                <span className="text-primary-foreground font-bold text-2xl">A</span>
            </div>
          <h2 className="text-center text-3xl font-extrabold text-foreground tracking-tight">
            {title}
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-8 px-4 shadow-xl shadow-shadow-color/5 sm:rounded-2xl sm:px-10 border border-border">
          {children}
        </div>
      </div>
    </div>
  );
};
