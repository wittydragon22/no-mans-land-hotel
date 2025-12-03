'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogoSVG } from '@/components/logo'
import { Navbar } from '@/components/navbar'
import { 
  Target, 
  Users, 
  Award, 
  Zap, 
  Shield, 
  Heart,
  ArrowRight,
  CheckCircle,
  Building2,
  Globe,
  Lightbulb
} from 'lucide-react'

const values = [
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Innovation",
    description: "We're constantly pushing the boundaries of what's possible in hospitality technology, creating solutions that anticipate guest needs."
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Security",
    description: "Your privacy and safety are our top priorities. We use bank-level encryption and industry-leading security practices."
  },
  {
    icon: <Heart className="h-8 w-8" />,
    title: "Guest Experience",
    description: "Every feature we build is designed with the guest in mind, ensuring a seamless, enjoyable, and memorable stay."
  },
  {
    icon: <Globe className="h-8 w-8" />,
    title: "Sustainability",
    description: "We're committed to reducing our environmental impact through smart energy management and sustainable practices."
  }
]

const milestones = [
  {
    year: "2020",
    title: "Foundation",
    description: "No Man's Land Hotel was founded with a vision to revolutionize the hospitality industry through autonomous technology."
  },
  {
    year: "2021",
    title: "First Prototype",
    description: "Launched our first autonomous check-in system, reducing check-in time from 10 minutes to under 2 minutes."
  },
  {
    year: "2022",
    title: "Digital Keys",
    description: "Introduced rotating digital key technology, providing guests with secure, contactless room access."
  },
  {
    year: "2023",
    title: "AI Integration",
    description: "Integrated advanced AI and biometric verification, achieving 98% guest satisfaction rates."
  },
  {
    year: "2024",
    title: "Expansion",
    description: "Expanding to multiple locations while maintaining our commitment to innovation and guest experience."
  }
]

const stats = [
  { label: "Guests Served", value: "50,000+", icon: <Users className="h-6 w-6" /> },
  { label: "Hotels", value: "25+", icon: <Building2 className="h-6 w-6" /> },
  { label: "Countries", value: "12", icon: <Globe className="h-6 w-6" /> },
  { label: "Satisfaction Rate", value: "98%", icon: <Award className="h-6 w-6" /> }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navbar variant="dark" />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">About No Man's Land</h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              We're redefining the future of hospitality through innovative autonomous technology, 
              creating seamless experiences that put guests first.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-secondary text-primary hover:bg-secondary/90 text-lg px-8 py-4">
                <Link href="/booking">
                  Book Your Stay
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-lg px-8 py-4">
                <Link href="/features">
                  Explore Features
                </Link>
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
                <div className="flex justify-center mb-3 text-primary">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-lg font-semibold text-gray-900">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 text-lg">
                <p>
                  No Man's Land Hotel was born from a simple idea: what if checking into a hotel 
                  could be as seamless as unlocking your phone? We envisioned a future where guests 
                  could bypass the front desk entirely, using technology to create a more personalized 
                  and efficient experience.
                </p>
                <p>
                  Since our founding, we've been at the forefront of autonomous hospitality technology. 
                  Our team of engineers, designers, and hospitality experts work tirelessly to create 
                  solutions that not only streamline operations but also enhance the guest experience.
                </p>
                <p>
                  Today, we're proud to serve thousands of guests across multiple locations, 
                  continuously innovating and improving our platform to meet the evolving needs 
                  of modern travelers.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Lightbulb className="h-8 w-8 text-secondary" />
                  <h3 className="text-2xl font-bold">Our Mission</h3>
                </div>
                <p className="text-white/90 text-lg mb-6">
                  To revolutionize the hospitality industry by creating autonomous, 
                  technology-driven experiences that are secure, sustainable, and 
                  centered around guest satisfaction.
                </p>
                <div className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-secondary" />
                  <h4 className="text-xl font-semibold">Our Vision</h4>
                </div>
                <p className="text-white/90 mt-2">
                  To become the global leader in autonomous hotel technology, 
                  setting new standards for guest experience and operational efficiency.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="text-secondary mb-4">{value.icon}</div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Key milestones in our growth and innovation
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/20"></div>
              
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="relative flex items-start gap-6"
                  >
                    {/* Timeline dot */}
                    <div className="relative z-10 flex-shrink-0 w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {milestone.year}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 pt-2">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-xl">{milestone.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-base">
                            {milestone.description}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose No Man's Land?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              What sets us apart in the hospitality industry
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Cutting-Edge Technology",
                description: "We leverage the latest in AI, biometrics, and mobile technology to create unparalleled experiences.",
                icon: <Zap className="h-6 w-6 text-secondary" />
              },
              {
                title: "Unmatched Security",
                description: "Bank-level encryption, rotating digital keys, and comprehensive audit trails ensure your safety.",
                icon: <Shield className="h-6 w-6 text-secondary" />
              },
              {
                title: "Sustainable Operations",
                description: "Our AI-powered energy management reduces environmental impact while maintaining comfort.",
                icon: <Globe className="h-6 w-6 text-secondary" />
              },
              {
                title: "24/7 Support",
                description: "Round-the-clock assistance ensures you're never left without help when you need it.",
                icon: <Users className="h-6 w-6 text-secondary" />
              },
              {
                title: "Proven Track Record",
                description: "98% guest satisfaction rate and zero security incidents demonstrate our commitment to excellence.",
                icon: <Award className="h-6 w-6 text-secondary" />
              },
              {
                title: "Guest-Centered Design",
                description: "Every feature is designed with the guest experience in mind, from booking to checkout.",
                icon: <Heart className="h-6 w-6 text-secondary" />
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      {feature.icon}
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-4">
              Experience the Future of Hospitality
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied guests who have already discovered 
              the convenience and innovation of No Man's Land Hotel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-secondary text-primary hover:bg-secondary/90 text-lg px-8 py-4">
                <Link href="/booking">
                  Book Your Stay
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-lg px-8 py-4">
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </motion.div>
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
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
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

