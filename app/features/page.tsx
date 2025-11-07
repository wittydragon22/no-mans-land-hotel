import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { LogoSVG } from '@/components/logo'
import { 
  Camera, 
  Shield, 
  Key, 
  Smartphone, 
  Zap, 
  Wrench,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react'

const features = [
  {
    icon: <Camera className="h-8 w-8" />,
    title: "AI-Powered Booking",
    description: "Smart room selection with personalized recommendations based on your preferences and stay history.",
    benefits: [
      "Instant availability checking",
      "Personalized room suggestions",
      "Dynamic pricing optimization",
      "Real-time inventory management"
    ]
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Face ID Check-in",
    description: "Secure biometric verification for instant, contactless check-in without front desk interaction.",
    benefits: [
      "Facial recognition technology",
      "Identity document verification",
      "Secure biometric matching",
      "Instant check-in process"
    ]
  },
  {
    icon: <Key className="h-8 w-8" />,
    title: "Digital Keys",
    description: "Rotating QR codes and NFC integration for secure, convenient room access via your mobile device.",
    benefits: [
      "Rotating security tokens",
      "QR code access",
      "NFC mobile pairing",
      "Automatic key expiration"
    ]
  },
  {
    icon: <Smartphone className="h-8 w-8" />,
    title: "Mobile Integration",
    description: "Complete hotel experience in your pocket with our intuitive mobile app and web portal.",
    benefits: [
      "Mobile key wallet",
      "Room service ordering",
      "Elevator access control",
      "Real-time notifications"
    ]
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Energy Insights",
    description: "Real-time energy monitoring and optimization for sustainable hospitality operations.",
    benefits: [
      "Energy consumption tracking",
      "Smart lighting control",
      "Temperature optimization",
      "Sustainability reporting"
    ]
  },
  {
    icon: <Wrench className="h-8 w-8" />,
    title: "Housekeeping Scheduler",
    description: "AI-optimized cleaning and maintenance schedules for efficient hotel operations.",
    benefits: [
      "Automated task scheduling",
      "Maintenance tracking",
      "Quality assurance",
      "Staff optimization"
    ]
  }
]

const stats = [
  { label: "Check-in Time", value: "< 2 min", description: "Average autonomous check-in time" },
  { label: "Guest Satisfaction", value: "98%", description: "Based on 10,000+ reviews" },
  { label: "Energy Savings", value: "35%", description: "Reduction in energy consumption" },
  { label: "Security Incidents", value: "0", description: "Zero security breaches to date" }
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <LogoSVG variant="dark" />
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/features" className="text-primary font-semibold">
                Features
              </Link>
              <Link href="/docs" className="text-gray-600 hover:text-primary transition-colors">
                Docs
              </Link>
              <Link href="/support" className="text-gray-600 hover:text-primary transition-colors">
                Support
              </Link>
              <Link href="/booking">
                <Button className="bg-primary">Book Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold mb-6">
              Revolutionary Hotel Technology
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Experience the future of hospitality with our cutting-edge autonomous hotel system. 
              From AI-powered booking to biometric check-in, we're redefining the guest experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/booking">
                <Button size="lg" className="bg-secondary text-primary hover:bg-secondary/90 text-lg px-8 py-4">
                  Try It Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-lg px-8 py-4">
                Watch Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Core Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the innovative technologies that make our autonomous hotel system 
              the future of hospitality.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="text-secondary mb-4">{feature.icon}</div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose No Man's Land?
              </h2>
              <div className="space-y-6">
                {[
                  {
                    icon: <Star className="h-6 w-6 text-secondary" />,
                    title: "Enhanced Guest Experience",
                    description: "Seamless, contactless experience from booking to checkout with personalized service."
                  },
                  {
                    icon: <Shield className="h-6 w-6 text-secondary" />,
                    title: "Advanced Security",
                    description: "Biometric verification and encrypted digital keys ensure maximum security."
                  },
                  {
                    icon: <Zap className="h-6 w-6 text-secondary" />,
                    title: "Sustainable Operations",
                    description: "AI-optimized energy management and automated systems reduce environmental impact."
                  }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">{benefit.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Ready to Experience the Future?</h3>
                <p className="text-white/90 mb-6">
                  Join thousands of guests who have already experienced the seamless, 
                  autonomous hotel experience.
                </p>
                <div className="space-y-4">
                  <Link href="/booking">
                    <Button size="lg" className="w-full bg-secondary text-primary hover:bg-secondary/90">
                      Book Your Stay
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button variant="outline" size="lg" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                      Create Account
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <LogoSVG variant="dark" showText={true} />
              </div>
              <p className="text-gray-400">
                The future of hospitality is here. Experience seamless, autonomous hotel operations.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/booking" className="hover:text-white transition-colors">Booking</Link></li>
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/support" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/status" className="hover:text-white transition-colors">System Status</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 No Man's Land Automated Hotel. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

