import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../../components/ui/button";
import { updateUserSettings } from "../../../../app/features/authSlice";
import type { RootState, AppDispatch } from "../../../../app/store";
import { toast } from "sonner";

export const ProfileForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || ""
  });

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(updateUserSettings(formData)).unwrap();
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error || "Failed to update profile");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <section>
        <h2 className="text-xl font-bold text-foreground mb-6">Profile Information</h2>

        <div className="flex items-center gap-6 mb-8 p-1">
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center text-4xl font-bold text-primary border-4 border-card shadow-lg ring-1 ring-border transition-transform group-hover:scale-[1.02]">
              {user?.name?.[0].toUpperCase() || "?"}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <p className="text-sm text-muted-foreground">Profile pictures are coming soon.</p>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground ml-1 text-muted-foreground/90">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-medium"
              placeholder="Your Name"
            />
            <p className="text-[11px] text-muted-foreground ml-1">This is the name that will be displayed on your profile and tasks.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground ml-1 text-muted-foreground/90">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-medium"
              placeholder="your.email@example.com"
            />
            <p className="text-[11px] text-muted-foreground ml-1 underline underline-offset-4 decoration-border/60">We will use this email for account recovery and notifications.</p>
          </div>
        </div>
      </section>

      {/* Action Buttons Integrated into Form */}
      <div className="flex items-center justify-end gap-4 pt-10 border-t border-border/60">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="font-bold px-8"
          onClick={() => user && setFormData({ name: user.name, email: user.email })}
        >
          Discard changes
        </Button>
        <Button
          type="submit"
          variant="default"
          size="lg"
          className="font-bold px-8 shadow-md"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
};
