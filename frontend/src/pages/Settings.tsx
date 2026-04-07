import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "../components/ui/button";
import { SettingsSidebar } from "../features/settings/components/SettingsSidebar";
import { ProfileForm } from "../features/settings/components/ProfileForm";
import { AppearanceSettings } from "../features/settings/components/AppearanceSettings";

export const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="px-4 md:px-10 py-8 md:py-12 max-w-6xl mx-auto w-full pb-20 fade-in">
      {/* Header */}
      <div className="mb-10 lg:mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-3">Settings</h1>
        <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex-1 max-w-3xl">
          {activeTab === "profile" && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
              <ProfileForm />
              <AppearanceSettings />

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 pt-10 border-t border-border/60">
                <Button variant="outline" size="lg" className="font-bold px-8">
                  Discard changes
                </Button>
                <Button variant="default" size="lg" className="font-bold px-8 shadow-md">
                  Save changes
                </Button>
              </div>
            </div>
          )}

          {activeTab !== "profile" && (
            <div className="py-20 text-center bg-muted/5 border-2 border-dashed border-border/60 rounded-3xl animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                 <ShieldCheck className="w-8 h-8 text-muted-foreground/60" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1 uppercase tracking-wider">Tab Under Development</h3>
              <p className="text-muted-foreground">The settings for this section are coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
