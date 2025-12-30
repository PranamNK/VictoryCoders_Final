import { Link, useLocation } from "react-router-dom";
import { Heart, Facebook, Twitter, Instagram, Mail, Flame } from "lucide-react";
import diyaImage from "@/assets/diya-lamp.jpg";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const isCalendarPage = location.pathname === '/calendar';

  return (
    <footer className={`${isCalendarPage ? 'bg-[hsl(var(--deep-coffee))] text-[hsl(var(--parchment-bg))] border-t-4 border-[hsl(var(--saffron-gold))]' : 'bg-gradient-to-b from-muted/30 to-muted border-t border-border'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!isCalendarPage && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-serif text-xl font-bold">
                    ॐ
                  </span>
                </div>
                <span className="font-serif text-2xl font-bold text-foreground">
                  TempleVerse
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Discover, learn, and experience the sacred heritage of Tulunadu's coastal temples.
              </p>
              {/* Diya Image */}
              <div className="relative w-16 h-16 opacity-80">
                <img
                  src={diyaImage}
                  alt="Diya lamp"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-serif text-lg font-bold mb-4 text-foreground">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/education" className="text-muted-foreground hover:text-primary transition-colors">
                    Get Educated
                  </Link>
                </li>
                <li>
                  <Link to="/#temples" className="text-muted-foreground hover:text-primary transition-colors">
                    Temples
                  </Link>
                </li>
                <li>
                  <Link to="/calendar" className="text-muted-foreground hover:text-primary transition-colors">
                    Calendar
                  </Link>
                </li>
                <li>
                  <Link to="/book-travel" className="text-muted-foreground hover:text-primary transition-colors">
                    Book Travel
                  </Link>
                </li>
              </ul>
            </div>

            {/* Regions */}
            <div>
              <h3 className="font-serif text-lg font-bold mb-4 text-foreground">
                Regions
              </h3>
              <ul className="space-y-2">
                <li className="text-muted-foreground">Mangalore Temples</li>
                <li className="text-muted-foreground">Udupi Temples</li>
                <li className="text-muted-foreground">Kundapura Temples</li>
                <li className="text-muted-foreground">Coastal Karnataka</li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h3 className="font-serif text-lg font-bold mb-4 text-foreground">
                Connect With Us
              </h3>
              <div className="flex gap-3 mb-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="#contact"
                  className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
              <p className="text-sm text-muted-foreground">
                Follow us for temple updates and spiritual insights
              </p>
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        <div className={`pt-8 border-t ${isCalendarPage ? 'border-[hsl(var(--saffron-gold))/20]' : 'border-border'}`}>
          {isCalendarPage && (
            <div className="flex justify-center mb-6">
              <Flame className="h-6 w-6 text-[hsl(var(--saffron-gold))] opacity-80" />
            </div>
          )}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className={`text-sm text-center md:text-left ${isCalendarPage ? 'text-[hsl(var(--parchment-bg))/50]' : 'text-muted-foreground'}`}>
              © {currentYear} TempleVerse — Discover | Learn | Experience Tulunadu's Sacred Heritage
            </p>
            <div className={`flex items-center gap-1 text-sm ${isCalendarPage ? 'text-[hsl(var(--parchment-bg))/50]' : 'text-muted-foreground'}`}>
              <span>Made with</span>
              <Heart className="h-4 w-4 text-primary fill-primary" />
              <span>for preserving our temples</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
