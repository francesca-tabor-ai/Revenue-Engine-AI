import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { ArrowRight, Zap, TrendingUp, Brain, MessageSquare, BarChart3, Flame, Activity } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  if (isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-accent" />
            <span className="text-xl font-bold text-foreground">Revenue Engine AI</span>
          </div>
          <Button asChild>
            <a href={getLoginUrl()}>Sign In</a>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
            Your Autonomous Revenue Partner
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Go from product to first revenue in 30 days using AI-powered outreach, positioning refinement, and adaptive optimization. Built for B2B founders who want to sell, not just build.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild className="text-base">
              <a href={getLoginUrl()}>
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container py-20">
        <h2 className="text-3xl font-bold text-foreground mb-12">Powerful Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* ICP Architect */}
          <div className="border border-border rounded-lg p-6 bg-card hover:border-accent transition-colors">
            <Brain className="h-8 w-8 text-accent mb-4" />
            <h3 className="font-semibold text-foreground mb-2">ICP Architect</h3>
            <p className="text-sm text-muted-foreground">
              Define your ideal customer profile and craft compelling value propositions through AI-powered questioning.
            </p>
          </div>

          {/* Outreach Execution */}
          <div className="border border-border rounded-lg p-6 bg-card hover:border-accent transition-colors">
            <MessageSquare className="h-8 w-8 text-accent mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Outreach Engine</h3>
            <p className="text-sm text-muted-foreground">
              Generate personalized messages across email, LinkedIn, and Twitter with intelligent follow-up cadences.
            </p>
          </div>

          {/* Reply Intelligence */}
          <div className="border border-border rounded-lg p-6 bg-card hover:border-accent transition-colors">
            <Zap className="h-8 w-8 text-accent mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Reply Intelligence</h3>
            <p className="text-sm text-muted-foreground">
              AI classifies responses and suggests context-aware follow-ups to maximize conversion rates.
            </p>
          </div>

          {/* Revenue Dashboard */}
          <div className="border border-border rounded-lg p-6 bg-card hover:border-accent transition-colors">
            <BarChart3 className="h-8 w-8 text-accent mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Revenue Dashboard</h3>
            <p className="text-sm text-muted-foreground">
              Track outreach volume, reply rates, conversions, and revenue with AI-powered optimization suggestions.
            </p>
          </div>

          {/* Revenue Sprint */}
          <div className="border border-border rounded-lg p-6 bg-card hover:border-accent transition-colors">
            <Flame className="h-8 w-8 text-accent mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Revenue Sprint</h3>
            <p className="text-sm text-muted-foreground">
              7-day intensive campaigns with daily goals, progress tracking, and accountability features.
            </p>
          </div>

          {/* Authority Builder */}
          <div className="border border-border rounded-lg p-6 bg-card hover:border-accent transition-colors">
            <TrendingUp className="h-8 w-8 text-accent mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Authority Builder</h3>
            <p className="text-sm text-muted-foreground">
              Generate thought leadership content, articles, and social media posts aligned with your ICP.
            </p>
          </div>

          {/* Behaviour Monitor */}
          <div className="border border-border rounded-lg p-6 bg-card hover:border-accent transition-colors">
            <Activity className="h-8 w-8 text-accent mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Behaviour Monitor</h3>
            <p className="text-sm text-muted-foreground">
              AI coaching system that tracks activity patterns and sends proactive nudges to maintain momentum.
            </p>
          </div>

          {/* Analytics */}
          <div className="border border-border rounded-lg p-6 bg-card hover:border-accent transition-colors">
            <BarChart3 className="h-8 w-8 text-accent mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Analytics & A/B Testing</h3>
            <p className="text-sm text-muted-foreground">
              Track engagement metrics, test messaging variations, and identify high-performing patterns.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to accelerate your revenue?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join founders who are using AI to go from product to first revenue in 30 days.
          </p>
          <Button size="lg" asChild>
            <a href={getLoginUrl()}>
              Start Your Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-20">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          <p>© 2026 Revenue Engine AI. Built for ambitious founders.</p>
        </div>
      </footer>
    </div>
  );
}
