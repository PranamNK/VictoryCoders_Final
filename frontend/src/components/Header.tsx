import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search, Languages, User, LogOut, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { language, toggleLanguage, translate } = useLanguage();
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Get Educated", path: "/education" },
    { name: "Temples", path: "/#temples" },
    { name: "Calendar", path: "/calendar" },
    { name: "Book Travel", path: "/book-travel" },
    { name: "Add Temple Listing", path: "/add-temple" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    // Check if it's a full route (starts with /) or a hash link
    if (path.startsWith("/#")) {
      return location.hash === path.replace("/", "");
    }
    return location.pathname === path;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/98 backdrop-blur-md shadow-sm"
          : "bg-black/40 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 bg-primary rounded-full flex items-center justify-center shadow-lg">
              <span className="text-primary-foreground font-serif text-2xl font-bold">
                ॐ
              </span>
            </div>
            <span className={`font-serif text-2xl font-bold tracking-tight ${isScrolled ? 'text-foreground' : 'text-white'}`}>
              TempleVerse
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg transition-smooth font-medium ${
                  isActive(link.path)
                    ? "bg-primary/20 text-primary"
                    : isScrolled 
                      ? "text-muted-foreground hover:text-foreground hover:bg-muted"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                {translate(link.name)}
              </Link>
            ))}
          </nav>

          {/* Search, Language Toggle and Auth (Desktop) */}
          <div className="hidden md:flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`hover:bg-primary/10 ${isScrolled ? '' : 'text-white hover:bg-white/10'}`}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-2 hover:bg-primary/10 ${isScrolled ? '' : 'text-white hover:bg-white/10'}`}
              onClick={toggleLanguage}
            >
              <Languages className="h-4 w-4" />
              <span className="font-medium">{language === 'en' ? 'ENG' : 'ಕನ್ನಡ'}</span>
            </Button>
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={`flex items-center gap-2 hover:bg-primary/10 ${isScrolled ? '' : 'text-white hover:bg-white/10'}`}
                  >
                    <User className="h-4 w-4" />
                    <span className="font-medium">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <Heart className="mr-2 h-4 w-4" />
                    Favorites
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => { logout(); navigate('/'); }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className={`${isScrolled ? '' : 'text-white hover:bg-white/10'}`}
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/register')}
                  className="bg-primary hover:bg-primary/90"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-smooth ${
              isScrolled 
                ? 'text-foreground hover:bg-muted' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/98 backdrop-blur-lg border-t border-border animate-fade-in">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg transition-smooth font-medium ${
                  isActive(link.path)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {translate(link.name)}
              </Link>
            ))}
            <div className="pt-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={translate("Search temples...")}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={toggleLanguage}
              >
                <Languages className="h-4 w-4" />
                <span>{language === 'en' ? 'Switch to ಕನ್ನಡ' : 'Switch to English'}</span>
              </Button>
              
              {isAuthenticated ? (
                <>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); }}
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                  >
                    Login
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => { navigate('/register'); setIsMobileMenuOpen(false); }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
