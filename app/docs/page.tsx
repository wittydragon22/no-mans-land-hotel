import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { LogoSVG } from '@/components/logo'
import { 
  BookOpen, 
  FileText, 
  Code, 
  Shield, 
  Smartphone,
  ArrowRight,
  Download,
  ExternalLink
} from 'lucide-react'

const documentationSections = [
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: "User Guide",
    description: "Complete guide for guests using the autonomous hotel system",
    items: [
      "Getting Started",
      "Booking Process",
      "Digital Key Usage",
      "Mobile App Guide",
      "Troubleshooting"
    ],
    link: "#"
  },
  {
    icon: <Code className="h-6 w-6" />,
    title: "API Documentation",
    description: "Technical documentation for developers and integrations",
    items: [
      "Authentication",
      "Booking API",
      "Digital Key API",
      "Webhooks",
      "SDK Examples"
    ],
    link: "#"
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Security Guide",
    description: "Security best practices and compliance information",
    items: [
      "Data Protection",
      "Biometric Security",
      "Encryption Standards",
      "Privacy Policy",
      "Compliance"
    ],
    link: "#"
  },
  {
    icon: <Smartphone className="h-6 w-6" />,
    title: "Mobile Integration",
    description: "Guide for mobile app development and integration",
    items: [
      "iOS Integration",
      "Android Integration",
      "NFC Setup",
      "Push Notifications",
      "Deep Linking"
    ],
    link: "#"
  }
]

const quickLinks = [
  {
    title: "Quick Start Guide",
    description: "Get up and running in 5 minutes",
    icon: <ArrowRight className="h-4 w-4" />,
    link: "#"
  },
  {
    title: "API Reference",
    description: "Complete API endpoint documentation",
    icon: <Code className="h-4 w-4" />,
    link: "#"
  },
  {
    title: "SDK Downloads",
    description: "Download SDKs for your platform",
    icon: <Download className="h-4 w-4" />,
    link: "#"
  },
  {
    title: "Status Page",
    description: "Check system status and uptime",
    icon: <ExternalLink className="h-4 w-4" />,
    link: "#"
  }
]

const pdfManuals = [
  {
    title: "Hotel Operator Manual",
    description: "Complete guide for hotel staff and operators",
    size: "2.4 MB",
    pages: "45 pages"
  },
  {
    title: "Technical Implementation Guide",
    description: "Technical documentation for system implementation",
    size: "5.1 MB",
    pages: "78 pages"
  },
  {
    title: "Security & Compliance Guide",
    description: "Security protocols and compliance requirements",
    size: "1.8 MB",
    pages: "32 pages"
  },
  {
    title: "API Integration Examples",
    description: "Code examples and integration patterns",
    size: "3.2 MB",
    pages: "56 pages"
  }
]

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <LogoSVG variant="dark" />
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-primary transition-colors">Home</Link>
              <Link href="/features" className="text-gray-600 hover:text-primary transition-colors">Features</Link>
              <Link href="/docs" className="text-primary font-semibold">Docs</Link>
              <Link href="/support" className="text-gray-600 hover:text-primary transition-colors">Support</Link>
              <Link href="/booking">
                <Button className="bg-primary">Book Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold mb-6">Documentation</h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Everything you need to know about the No Man's Land Automated Hotel System. 
              From user guides to technical documentation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-secondary text-primary hover:bg-secondary/90 text-lg px-8 py-4">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-lg px-8 py-4">
                API Reference
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Quick Links */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Quick Links</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{link.title}</h3>
                      {link.icon}
                    </div>
                    <p className="text-sm text-gray-600">{link.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Documentation Sections */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Documentation Sections</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {documentationSections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      {section.icon}
                      <CardTitle>{section.title}</CardTitle>
                    </div>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" className="w-full">
                      View Documentation
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* PDF Manuals */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Download Manuals</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {pdfManuals.map((manual, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-6 w-6 text-primary" />
                        <div>
                          <CardTitle className="text-lg">{manual.title}</CardTitle>
                          <CardDescription>{manual.description}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{manual.size}</span> • {manual.pages}
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* API Overview */}
        <section className="mt-16">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-white">
            <CardHeader>
              <CardTitle className="text-2xl">API Overview</CardTitle>
              <CardDescription className="text-white/90">
                Integrate with our autonomous hotel system using our RESTful API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Authentication</h4>
                  <p className="text-sm text-white/80 mb-3">
                    JWT-based authentication with role-based access control
                  </p>
                  <code className="text-xs bg-white/20 px-2 py-1 rounded">
                    POST /api/auth/login
                  </code>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Booking Management</h4>
                  <p className="text-sm text-white/80 mb-3">
                    Complete booking lifecycle from search to confirmation
                  </p>
                  <code className="text-xs bg-white/20 px-2 py-1 rounded">
                    POST /api/booking/search
                  </code>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Digital Keys</h4>
                  <p className="text-sm text-white/80 mb-3">
                    Secure key management with rotating tokens
                  </p>
                  <code className="text-xs bg-white/20 px-2 py-1 rounded">
                    GET /api/key/[id]
                  </code>
                </div>
              </div>
              <div className="mt-6">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  View Full API Reference
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

