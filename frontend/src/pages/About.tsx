import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User2, Leaf, BookOpen, ShieldCheck, HandHeart  } from "lucide-react"

const skills = [
  { category: "Faith First", icon: BookOpen },
  { category: "Service Over Profit", icon: HandHeart},
  { category: "Integrity", icon: ShieldCheck},
  { category: "Community", icon: User2 },
  { category: "Stewardship", icon: Leaf }
]

const services = [
  {
    
    description: "A growing collection of Christian books and resources.",
  },
  {
  
    description: "Categories for all ages: children, youth, adults, and leaders.",
  },
  {
  
    description: "Online reading without payment or subscription.",
  },
]

export default function About() {
  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-up">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            About <span className="gradient-text">US</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We are a group of Christian youth united by a shared calling: to spread the Word of God through accessible Christian literature.
          </p>
        </div>

        {/* Bio Section */}
        <div className="mb-16 animate-slide-up">
          <Card className="p-8 hover-glow">
            <h2 className="text-2xl font-semibold mb-4">Our story</h2>
            <div className="text-muted-foreground leading-relaxed space-y-4">
              <p>
              We are a group of Christian youth united by a shared calling to serve God through knowledge, faith, and community. This platform was born from a simple yet powerful idea: to use technology to spread Christian teachings and make faith-based books accessible to everyone. 
              </p>
              <p>
                What started as a small vision has grown into a mission-driven initiative dedicated to serving believers, seekers, and communities without expecting anything in return.
              </p>

            </div>
          </Card>
        </div>
<div className="mb-16 animate-slide-up">
          <Card className="p-8 hover-glow">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <div className="text-muted-foreground leading-relaxed space-y-4">
              <p>
               Our mission is to provide free and open access to Christian books that nurture spiritual growth, deepen biblical understanding, and encourage a Christ-centered life.
              </p>
              <p>
                We believe that no one should be prevented from learning, reading, or growing in faith because of financial limitations or lack of access. Through this platform, we aim to share God’s Word and Christian wisdom freely and responsibly.
              </p>
            </div>
          </Card>
        </div>
        {/* Skills Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our <span className="gradient-text">value</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skillGroup, index) => {
              const Icon = skillGroup.icon
              return (
                <Card key={skillGroup.category} className="p-6 hover-glow animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex items-center mb-4">
                    <Icon className="h-6 w-6 text-primary mr-2" />
                    <h3 className="text-lg font-semibold">{skillGroup.category}</h3>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* What I Can Do */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
           What we <span className="gradient-text">offer</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={service.description} className="p-6 hover-glow animate-slide-up" style={{ animationDelay: `${index * 200}ms` }}>
                <p className="text-muted-foreground">{service.description}</p>
              </Card>
            ))}
          </div>
        </div>
        <div className="mb-16 animate-slide-up">
          <Card className="p-8 hover-glow">
            <h2 className="text-2xl font-semibold mb-4">Our vission</h2>
            <div className="text-muted-foreground leading-relaxed space-y-4">
              <p>
           Our vision is to faithfully use the tools God has given us to spread Christian teachings beyond boundaries. We aspire to create a trusted space where believers and seekers can grow in faith through free access to Christian books, and to one day extend this mission into a physical Christian book store that continues to serve communities with integrity and love.
              </p>
              <p>
               We desire to foster a culture of learning, service, and unity, using this platform as a stepping stone toward a physical Christian book store that reflects the same Christ-centered values.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}