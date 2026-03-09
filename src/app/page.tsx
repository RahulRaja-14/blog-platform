import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  ArrowRight,
  Zap,
  Shield,
  Users,
  Sparkles,
  FileText,
  MessageSquare,
} from 'lucide-react';

export default async function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-background pt-24 pb-32">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-700">
                <Sparkles className="h-4 w-4" />
                <span>Modern Blogging Platform</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-headline font-black text-foreground leading-[1.1]">
                Your Voice, <span className="text-primary">Amplified.</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                PlatformStream is the next-generation space for professionals to
                share, connect, and grow. Secure, fast, and AI-powered.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="rounded-full px-8 h-14 text-lg font-semibold gap-2 shadow-xl shadow-primary/20"
                  >
                    Get Started Free
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/feed">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full px-8 h-14 text-lg font-semibold"
                  >
                    Explore Feed
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Decorative background elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 pointer-events-none opacity-20 dark:opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-[120px]" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent rounded-full blur-[150px]" />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-card p-8 rounded-2xl shadow-sm space-y-4 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Secure Authentication
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Secure user registration and login with JWTs and guarded routes
                  to protect your content.
                </p>
              </div>
              <div className="bg-card p-8 rounded-2xl shadow-sm space-y-4 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Advanced Content Management
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Create, edit, and delete posts with a private dashboard,
                  custom slugs, and publishing status.
                </p>
              </div>
              <div className="bg-card p-8 rounded-2xl shadow-sm space-y-4 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  AI-Powered Summaries
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Automatically generate SEO-friendly summaries for your blog
                  posts using advanced AI tools.
                </p>
              </div>
              <div className="bg-card p-8 rounded-2xl shadow-sm space-y-4 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Community Engagement
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Build your community with a real-time public feed, likes, and
                  a commenting system.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-background">
        <div className="container mx-auto px-4 text-center space-y-4">
          <p className="text-muted-foreground text-sm">
            © 2024 PlatformStream. Built with passion for creators.
          </p>
        </div>
      </footer>
    </div>
  );
}
