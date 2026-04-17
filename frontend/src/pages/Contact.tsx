import { useState } from "react"
 import { useRef } from 'react';
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Twitter, BookText,BookAudio } from "lucide-react"

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "kaleb.dereje.0123@gmail.com",
    href: "mailto:kaleb.dereje.0124.com"
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+251901609403",
    href: "tel:+251901609403"
  },
  {
    icon: MapPin,
    title: "Location",
    value: "Addis Ababa, Ethiopia",
    href: "#"
  }
]

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com", label: "instagram" },
  { icon: Facebook, href: "https://facebook.com", label: "facebook" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
]

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData()
    const form = e.target as HTMLFormElement

    // Add form fields
    formData.append('name', (form.elements.namedItem('Name') as HTMLInputElement).value)
    formData.append('email', (form.elements.namedItem('email') as HTMLInputElement).value)
    formData.append('subject', (form.elements.namedItem('subject') as HTMLInputElement).value)
    formData.append('message', (form.elements.namedItem('message') as HTMLTextAreaElement).value)

    // Add files if selected
    if (selectedFile) {
      formData.append('document', selectedFile)
    }
    if (selectedAudio) {
      formData.append('audioNote', selectedAudio)
    }

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message')
      }

      toast({
        title: "Message sent!",
        description: "Thank you for your message. We'll get back to you soon.",
      })
      
      // Reset form
      form.reset()
      setSelectedFile(null)
      setSelectedAudio(null)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  const [selectedFile, setSelectedFile] = useState(null);
const [selectedAudio, setSelectedAudio] = useState(null);

const handleFileChange = (e) => {
  setSelectedFile(e.target.files[0]);
  console.log("File selected:", e.target.files[0].name);
};

const handleAudioChange = (e) => {
  setSelectedAudio(e.target.files[0]);
  console.log("Audio selected:", e.target.files[0].name);
};
const fileInputRef = useRef(null);
const audioInputRef = useRef(null);

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-up">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Get In <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
           We’d Love to Hear From You Share your ideas, recommend a Christian book, or leave a message of encouragement.
            Your thoughts help strengthen this community.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="animate-slide-up">
            <Card className="p-8">
              <h2 className="text-2xl font-semibold mb-6">Send me a message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                
                  <div className="space-y-2">
                    <Label htmlFor="Name"> Name</Label>
                    <Input
                      id="Name"
                      name="Name"
                      placeholder="John Joseph"
                    />
                  </div>
               

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Project Inquiry"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="share us what God put to you..."
                    rows={8}
                    required
                  />
                </div>
                  <div className=" grid grid-cols-1 sm:grid-cols-2 gap-4">
    {/* --- Document Upload --- */}
                      <div>
      <label className="block text-sm font-medium mb-2 ">Upload Book <BookText className="inline"/></label>
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx"
      />
      <Button 
        type="button"
        variant="outline" 
        onClick={() => fileInputRef.current.click()}
        className="hover-glow w-full bg-secondary-foreground text-secondary"
      >
        {selectedFile ? `Selected: ${selectedFile.name}` : "Choose File "}
        
      </Button>
                      </div>

    {/* --- Audio Upload --- */}
                       <div>
      <label className="block text-sm  font-medium mb-2">Upload Audio Book <BookAudio className="inline"/></label>
      <input 
        type="file" 
        className="hidden" 
        ref={audioInputRef}
        onChange={handleAudioChange}
        accept="audio/*" // This limits the picker to audio files
      />
      <Button 
        type="button"
        variant="outline" 
        onClick={() => audioInputRef.current.click()}
        className="hover-glow w-full bg-secondary-foreground text-secondary"
      >
        {selectedAudio ? `Selected: ${selectedAudio.name}` : "Upload Audio"}
        
      </Button>
                       </div>
                    </div>

                
                <Button 
                  type="submit" 
                  className="w-full hover-glow" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="animate-slide-up space-y-8" style={{ animationDelay: "200ms" }}>
            {/* Contact Info Cards */}
            <div className="space-y-4">
              {contactInfo.map((info) => {
                const Icon = info.icon
                return (
                  <Card key={info.title} className="p-6 hover-glow">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{info.title}</h3>
                        {info.href === "#" ? (
                          <p className="text-muted-foreground">{info.value}</p>
                        ) : (
                          <a 
                            href={info.href}
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            {info.value}
                          </a>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>

            {/* Social Links */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Follow me on social media</h3>
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <Button
                      key={social.label}
                      variant="outline"
                      size="icon"
                      asChild
                      className="hover-glow"
                    >
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    </Button>
                  )
                })}
              </div>
            </Card>

            {/* Availability */}
            <Card className="p-6 bg-gradient-hero text-white">
              <h3 className="font-semibold mb-2">Format of Book</h3>
              <p className="opacity-90 mb-4">
               You can upload a textBook(pdf) and/or a audio file. It will be amazing if you add review.
              </p>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm">we'll review and post it.</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}