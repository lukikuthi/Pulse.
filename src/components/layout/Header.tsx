import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, User, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { PulseButton } from "@/components/ui/PulseButton";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { user, userName, userAvatar } = useUser();
  const { toast } = useToast();

  const navLinks = [{
    href: "/dashboard",
    label: "Dashboard"
  }, {
    href: "/checkin",
    label: "Check-in"
  }, {
    href: "/timeline",
    label: "Timeline"
  }];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Até breve!",
        description: "Você saiu da sua conta.",
      });
      navigate("/");
    }
  };
  return <motion.header initial={{
    opacity: 0,
    y: -20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5
  }} className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            
            <span className="text-xl md:text-2xl tracking-tight text-foreground font-sans font-light">
              PULSE<span className="text-primary">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => <Link key={link.href} to={link.href} className={cn("px-4 py-2 rounded-full text-sm font-medium transition-all duration-200", isActive(link.href) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary")}>
                {link.label}
              </Link>)}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">
                    {userName}
                  </span>
                </div>
                <PulseButton variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </PulseButton>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <PulseButton variant="ghost" size="sm">
                    Entrar
                  </PulseButton>
                </Link>
                <Link to="/auth?mode=signup">
                  <PulseButton size="sm">
                    Começar
                  </PulseButton>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors">
            {isMenuOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div initial={false} animate={{
      height: isMenuOpen ? "auto" : 0,
      opacity: isMenuOpen ? 1 : 0
    }} transition={{
      duration: 0.2
    }} className="md:hidden overflow-hidden border-t border-border/50">
        <div className="container mx-auto px-4 py-4 space-y-2">
          {navLinks.map(link => <Link key={link.href} to={link.href} onClick={() => setIsMenuOpen(false)} className={cn("block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200", isActive(link.href) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary")}>
              {link.label}
            </Link>)}
          <div className="pt-4 border-t border-border/50 space-y-2">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-secondary">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-foreground font-medium">
                    {userName}
                  </span>
                </div>
                <PulseButton
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </PulseButton>
              </>
            ) : (
              <>
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <PulseButton variant="outline" className="w-full">
                    Entrar
                  </PulseButton>
                </Link>
                <Link to="/auth?mode=signup" onClick={() => setIsMenuOpen(false)}>
                  <PulseButton className="w-full">
                    Começar Agora
                  </PulseButton>
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.header>;
};
export default Header;