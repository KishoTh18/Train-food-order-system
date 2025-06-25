import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, User, Menu, Train } from "lucide-react";
import { Cart } from "./cart";

export function Navigation() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { getTotalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const totalItems = getTotalItems();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navLinks = [
    { href: "#menu", label: "Menu" },
    { href: "#schedule", label: "Train Schedule" },
    { href: "#routes", label: "Routes" },
  ];

  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <div className="flex items-center">
                  <Train className="h-8 w-8 mr-2" style={{ color: '#B91C1C' }} />
                  <div>
                    <h1 className="text-2xl font-bold font-sans" style={{ color: '#B91C1C' }}>
                      Heat<span style={{ color: '#EA580C' }}>&</span>Eat
                    </h1>
                    <p className="text-xs text-gray-500">Train Food Delivery</p>
                  </div>
                </div>
              </Link>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navLinks.map((link) => (
                  link.href.startsWith('/') ? (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      onMouseEnter={(e) => e.currentTarget.style.color = '#B91C1C'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      key={link.href}
                      href={link.href}
                      className="text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      onMouseEnter={(e) => e.currentTarget.style.color = '#B91C1C'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
                    >
                      {link.label}
                    </a>
                  )
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="relative p-2"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span 
                    className="absolute -top-2 -right-2 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    style={{ backgroundColor: '#B91C1C' }}
                  >
                    {totalItems}
                  </span>
                )}
              </Button>
              
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700 hidden sm:block">
                    {user.username}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Link href="/auth">
                  <Button 
                    className="text-white hover:opacity-90"
                    style={{ backgroundColor: '#B91C1C' }}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
              )}
              
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col space-y-4 mt-8">
                    {navLinks.map((link) => (
                      link.href.startsWith('/') ? (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="text-gray-700 px-3 py-2 rounded-md font-medium"
                          onMouseEnter={(e) => e.currentTarget.style.color = '#B91C1C'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <a
                          key={link.href}
                          href={link.href}
                          className="text-gray-700 px-3 py-2 rounded-md font-medium"
                          onMouseEnter={(e) => e.currentTarget.style.color = '#B91C1C'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {link.label}
                        </a>
                      )
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
