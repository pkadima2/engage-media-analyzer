import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"
import {
  User,
  LogOut,
  Settings,
  CreditCard,
  LayoutDashboard,
  Menu,
} from "lucide-react"
import { supabase } from "@/integrations/supabase/client"

const TopBar = () => {
  const [session, setSession] = useState<any>(null)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  return (
    <header className="fixed top-0 w-full border-b bg-background z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-4 mt-4">
                <Link to="/" className="text-sm font-medium">
                  Home
                </Link>
                <Link to="/pricing" className="text-sm font-medium">
                  Pricing
                </Link>
                <Link to="/features" className="text-sm font-medium">
                  Features
                </Link>
                <Link to="/blog" className="text-sm font-medium">
                  Blog
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex items-center space-x-2">
            <div className="text-[#4461F2]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.0008 3L14.4608 8.34111L20.4848 9.16142L16.2428 13.3169L17.2208 19.3186L12.0008 16.5L6.78084 19.3186L7.75884 13.3169L3.51684 9.16142L9.54084 8.34111L12.0008 3Z" fill="currentColor"/>
              </svg>
            </div>
            <span className="font-semibold text-xl">EngagePerfect</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link to="/pricing" className="text-sm font-medium transition-colors hover:text-primary">
            Pricing
          </Link>
          <Link to="/features" className="text-sm font-medium transition-colors hover:text-primary">
            Features
          </Link>
          <Link to="/blog" className="text-sm font-medium transition-colors hover:text-primary">
            Blog
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={session?.user?.user_metadata?.avatar_url} alt={session?.user?.email} />
                    <AvatarFallback>{session?.user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/pricing" className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Billing</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/auth">Login</Link>
              </Button>
              <Button className="bg-[#4461F2] hover:bg-[#4461F2]/90" asChild>
                <Link to="/auth">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default TopBar