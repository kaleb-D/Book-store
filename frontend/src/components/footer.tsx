import {  Twitter, Mail, Facebook, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HashLink } from 'react-router-hash-link';




const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Mail, href: "mailto:christianBooks@gmail.com", label: "Email" },
]

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between gap-5 items-center">
          {/* Logo and Copyright */}
          <div className="mb-4 md:mb-0">
            <div className="text-lg font-bold gradient-text mb-2">
              christian Books
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 All rights reserved.
            </p>
          </div>
          <div className="space-x-2">
            <h3 className="flex flex-col gap-3">
              Quick Links
            </h3>
            <div className="flex flex-col gap-2">
            <HashLink         
  rel="noopener noreferrer"   
  className="hover:text-primary transition-colors"to="/Book">collection of books</HashLink>
            <HashLink 
  rel="noopener noreferrer"   
  className="hover:text-primary transition-colors"  to="/#section-3">Recomendation</HashLink>
            <HashLink          
  rel="noopener noreferrer"   
  className="hover:text-primary transition-colors" to="/About">About Us</HashLink>
            <HashLink            
  rel="noopener noreferrer"   
  className="hover:text-primary transition-colors" to="/Contact">contact us</HashLink>
            </div>
          </div>
          <div className="space-x-2">
            <h3 className="flex flex-col gap-3">
             Usefull Links
            </h3>
            <div className="flex flex-col gap-2">
               <HashLink target="_blank"            
  rel="noopener noreferrer"   
  className="hover:text-primary transition-colors" to="https://www.stjohnswishart.com.au/im-new/who-is-jesus?gad_source=1&gad_campaignid=22462865715&gbraid=0AAAAA9SN1aiC-A6h1whHH18EUoSqA74yq&gclid=Cj0KCQiAhOfLBhCCARIsAJPiopPJZF5E1eBb5ZgiZSZxkgld7fO_4E7yKCkxWeYNT4rnpqayvzmiH1kaAhl4EALw_wcB">History of Jesus</HashLink>
            <HashLink target="_blank"            
  rel="noopener noreferrer"   
  className="hover:text-primary transition-colors" to="https://www.chabad.org/library/article_cdo/aid/520477/jewish/The-Story-of-King-David-in-the-Bible.htm" >History of David</HashLink>
            <HashLink target="_blank"            
  rel="noopener noreferrer"   
  className="hover:text-primary transition-colors" to="https://www.kurtwillems.com/blog/apostle-paul-brief-biography">History of Paul</HashLink>
            <HashLink 
            target="_blank"            
  rel="noopener noreferrer"   
  className="hover:text-primary transition-colors" to="https://www.holyspiritspeaks.org/testimonies/abraham-sacrificing-isaac/?gad_source=1&gad_campaignid=22859166154&gbraid=0AAAAADH3NFsKL5SZhej1agUxaIhNPTWU_&gclid=Cj0KCQiAhOfLBhCCARIsAJPiopPe6sGPFenRRzAqNjgJzx2-hk2STMb6y3ghYkf8ULQqJqaT3xVdgtIaAl3DEALw_wcB">History of Abraham</HashLink>
           
            </div>
          </div>
          {/* Social Links */}
          <div className="flex flex-col gap-4 space-x-2">
          <h1 className="text-center text-lg">Stay connected</h1>
          <div className="flex space-x-2">
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
          </div>
        </div>
      </div>
    </footer>
  )
}




