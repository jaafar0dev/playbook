import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Users, Target, Zap, BarChart3, Shield, Clock, MessageSquare, Wallet } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: 'landing' | 'login' | 'signup') => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-violet-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PB</span>
              </div>
              <span className="font-semibold text-xl">Playbook</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => onNavigate('login')}>
                Log in
              </Button>
              <Button onClick={() => onNavigate('signup')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Now accepting new founders
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-8">
            The exact <span className="gradient-text">process</span> &{' '}
            <span className="gradient-text">growth</span> playbook to build
            <br className="hidden sm:block" /> and scale your business.
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Follow a step-by-step roadmap trusted by thousands of successful founders. 
            Execute tasks, collaborate with your team, and prove real progress through validated milestones.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="h-14 px-8 text-lg"
              onClick={() => onNavigate('signup')}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="h-14 px-8 text-lg"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </div>
          
          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10K+', label: 'Founders Helped' },
              { value: '$500M+', label: 'Funding Raised' },
              { value: '85%', label: 'Success Rate' },
              { value: '4.9/5', label: 'User Rating' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How Playbook Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A proven system that guides you through every step of building a successful business
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Follow the Roadmap',
                description: 'Access structured playbooks designed by successful founders and industry experts. Each phase builds on the last.',
                icon: Target,
              },
              {
                step: '02',
                title: 'Execute & Submit',
                description: 'Complete tasks with detailed instructions, upload proof of work, and track your progress in real-time.',
                icon: CheckCircle,
              },
              {
                step: '03',
                title: 'Get Validated',
                description: 'Receive feedback from experienced admins. Approved tasks unlock the next phase of your journey.',
                icon: Zap,
              },
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 card-hover">
                <div className="text-5xl font-bold text-blue-100 mb-4">{item.step}</div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                  <item.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A complete toolkit designed for modern founders and their teams
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: 'Structured Roadmaps',
                description: 'Step-by-step playbooks from idea to scale, with clear milestones and deliverables.',
              },
              {
                icon: Users,
                title: 'Team Collaboration',
                description: 'Invite team members, assign roles, and work together seamlessly in one workspace.',
              },
              {
                icon: CheckCircle,
                title: 'Task Validation',
                description: 'Submit proof of work and get approved by experienced admins before progressing.',
              },
              {
                icon: Clock,
                title: 'Time Tracking',
                description: 'Clock in/out, track hours, and get automatic task scheduling based on availability.',
              },
              {
                icon: MessageSquare,
                title: 'Team Chat',
                description: 'Built-in messaging for discussions, file sharing, and real-time collaboration.',
              },
              {
                icon: Wallet,
                title: 'Referral Rewards',
                description: 'Earn wallet credits for every founder you refer to the platform.',
              },
              {
                icon: BarChart3,
                title: 'Progress Analytics',
                description: 'Track your journey with detailed progress bars, stats, and insights.',
              },
              {
                icon: Shield,
                title: 'Admin Oversight',
                description: 'Quality assurance through expert review of all task submissions.',
              },
              {
                icon: Zap,
                title: 'Smart Scheduling',
                description: 'Tasks automatically scheduled to fit your available work hours.',
              },
            ].map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 card-hover">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-4 shadow-sm">
                  <feature.icon className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Loved by Founders Worldwide
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              See what entrepreneurs are saying about their Playbook experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Playbook gave us the structure we desperately needed. We went from idea to first customers in 8 weeks.",
                author: "Marcus Chen",
                role: "CEO, TechFlow",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
              },
              {
                quote: "The validation process is game-changing. Having experts review our work kept us accountable and on track.",
                author: "Sarah Williams",
                role: "Founder, GreenStart",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
              },
              {
                quote: "Our team productivity increased 3x after joining. The roadmap removed all guesswork from our strategy.",
                author: "David Park",
                role: "CTO, DataSync",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-800 rounded-2xl p-8">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full bg-gray-700"
                  />
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 to-violet-600 rounded-3xl p-12 text-center text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Build Your Business?
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto">
              Join thousands of founders following the proven path to startup success. 
              Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                variant="secondary"
                className="h-14 px-8 text-lg"
                onClick={() => onNavigate('signup')}
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <p className="text-sm text-blue-200 mt-6">
              No credit card required. Free to get started.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-violet-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PB</span>
              </div>
              <span className="font-semibold text-xl">Playbook</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900">Privacy</a>
              <a href="#" className="hover:text-gray-900">Terms</a>
              <a href="#" className="hover:text-gray-900">Support</a>
            </div>
            <div className="text-sm text-gray-500">
              © 2024 Playbook. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
