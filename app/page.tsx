import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Camera, Key, Shield, Smartphone, Zap } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { LogoSVG } from '@/components/logo'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary/80">
      {/* Navigation */}
      <Navbar variant="light" />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              The Future of
              <br />
              <span className="text-secondary">Hotel Experience</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Experience seamless, autonomous check-in with AI-powered booking, 
              facial recognition, and digital keys. No front desk, no waiting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-secondary text-primary hover:bg-secondary/90 text-lg px-8 py-4">
                <Link href="/booking">
                  Book Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-lg px-8 py-4">
                <Link href="/checkin">
                  Check In
                  <Key className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Demo Video/Animation Placeholder */}
          <div className="mt-16 relative">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="aspect-video bg-gradient-to-br from-secondary/20 to-primary/20 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <Camera className="h-16 w-16 text-secondary mx-auto mb-4" />
                  <p className="text-white/80">Autonomous Check-in Demo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Revolutionary Features</h2>
          <p className="text-xl text-white/80">Experience the next generation of hotel technology</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Camera className="h-8 w-8" />,
              title: "AI-Powered Booking",
              description: "Smart room selection with personalized recommendations"
            },
            {
              icon: <Shield className="h-8 w-8" />,
              title: "Face ID Check-in",
              description: "Secure biometric verification for instant access"
            },
            {
              icon: <Key className="h-8 w-8" />,
              title: "Digital Keys",
              description: "QR codes and NFC for seamless room access"
            },
            {
              icon: <Smartphone className="h-8 w-8" />,
              title: "Mobile Integration",
              description: "Complete hotel experience in your pocket"
            },
            {
              icon: <Zap className="h-8 w-8" />,
              title: "Energy Insights",
              description: "Real-time energy monitoring and optimization"
            },
            {
              icon: <Shield className="h-8 w-8" />,
              title: "Housekeeping Scheduler",
              description: "AI-optimized cleaning and maintenance schedules"
            }
          ].map((feature, index) => (
            <div key={index}>
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardHeader>
                  <div className="text-secondary mb-2">{feature.icon}</div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-white/80">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center">
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Experience the Future?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of guests who have already experienced the seamless, 
              autonomous hotel experience.
            </p>
            <Button asChild size="lg" className="bg-secondary text-primary hover:bg-secondary/90 text-lg px-8 py-4">
              <Link href="/booking">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/20 bg-white/5 backdrop-blur-md">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link href="/">
                <LogoSVG variant="light" showText={true} />
              </Link>
            </div>
            <div className="flex space-x-6 text-white/80">
              <Link href="/features" className="hover:text-white transition-colors">Features</Link>
              <Link href="/docs" className="hover:text-white transition-colors">Documentation</Link>
              <Link href="/support" className="hover:text-white transition-colors">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}