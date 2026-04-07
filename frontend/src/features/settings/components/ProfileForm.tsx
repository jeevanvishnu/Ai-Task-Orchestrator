import { Button } from "../../../components/ui/button";

export const ProfileForm = () => {
  return (
    <section>
      <h2 className="text-xl font-bold text-foreground mb-6">Profile Information</h2>
      
      <div className="flex items-center gap-6 mb-8 p-1">
        <div className="relative group">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
            alt="Profile"
            className="w-24 h-24 rounded-2xl object-cover border-4 border-card shadow-lg ring-1 ring-border transition-transform group-hover:scale-[1.02]"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="default" size="default" className="font-bold">
             Upload new
          </Button>
          <Button variant="outline" size="default" className="font-bold">
             Remove avatar
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground ml-1 text-muted-foreground/90">Full Name</label>
          <input
            type="text"
            defaultValue="Sarah Jenkins"
            className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-medium"
          />
          <p className="text-[11px] text-muted-foreground ml-1">This is the name that will be displayed on your profile and tasks.</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground ml-1 text-muted-foreground/90">Email Address</label>
          <input
            type="email"
            defaultValue="sarah.jenkins@example.com"
            className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-medium"
          />
          <p className="text-[11px] text-muted-foreground ml-1 underline underline-offset-4 decoration-border/60">We will use this email for account recovery and notifications.</p>
        </div>
      </div>
    </section>
  );
};
