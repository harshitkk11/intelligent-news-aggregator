"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Logo from "./Logo";
import { Book, LogOut, Menu, Sunset, Trees, Zap } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface NavbarProps {
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
}

const NavBar = ({
  menu = [
    { title: "Home", url: "#" },
    {
      title: "Categorties",
      url: "#",
      items: [
        {
          title: "Blog",
          description: "The latest industry news, updates, and info",
          icon: <Book className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Company",
          description: "Our mission is to innovate and empower the world",
          icon: <Trees className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Careers",
          description: "Browse job listing and discover our workspace",
          icon: <Sunset className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Support",
          description:
            "Get in touch with our support team or visit our community forums",
          icon: <Zap className="size-5 shrink-0" />,
          url: "#",
        },
      ],
    },
    {
      title: "Resources",
      url: "#",
      items: [
        {
          title: "Help Center",
          description: "Get all the answers you need right here",
          icon: <Zap className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Contact Us",
          description: "We are here to help you with any questions you have",
          icon: <Sunset className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Status",
          description: "Check the current status of our services and APIs",
          icon: <Trees className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Terms of Service",
          description: "Our terms and conditions for using our services",
          icon: <Book className="size-5 shrink-0" />,
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
    },
  ],
  auth = {
    login: { title: "Login", url: "/login" },
    signup: { title: "Sign up", url: "/signup" },
  },
}: NavbarProps) => {
  const { user, loading, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <section className="p-4">
      {/* Desktop Menu */}
      <nav className="hidden justify-between lg:flex">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Logo width={32} height={32} displayTitle={true} />
          <div className="flex items-center">
            <NavigationMenu>
              <NavigationMenuList>
                {menu.map((item) => renderMenuItem(item))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        {!mounted ? (
          <div className="space-y-2 w-[100px] animate-pulse">
            <Skeleton className="h-8 w-[100px] mx-auto" />
          </div>
        ) : loading ? (
          <div className="space-y-2 w-[100px] animate-pulse">
            <Skeleton className="h-8 w-[100px] mx-auto" />
          </div>
        ) : user ? (
          <Button
            onClick={handleSignOut}
            variant="ghost"
            size="sm"
            className="flex justify-start !px-2 !py-1.5 gap-2 cursor-pointer"
          >
            <LogOut className="!w-5 !h-5" />
            Log out
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <a href={auth.login.url}>{auth.login.title}</a>
            </Button>
            <Button asChild size="sm">
              <a href={auth.signup.url}>{auth.signup.title}</a>
            </Button>
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      <div className="block lg:hidden">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo width={32} height={32} />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>
                  <Logo width={32} height={32} />
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 p-4">
                <Accordion
                  type="single"
                  collapsible
                  className="flex w-full flex-col gap-4"
                >
                  {menu.map((item) => renderMobileMenuItem(item))}
                </Accordion>

                {mounted ? (
                  <div className="space-y-2 w-[100px] animate-pulse">
                    <Skeleton className="h-8 w-[100px] mx-auto" />
                  </div>
                ) : loading ? (
                  <div className="space-y-2 w-full animate-pulse">
                    <Skeleton className="h-8 w-full mx-auto" />
                  </div>
                ) : user ? (
                  <Button
                    onClick={handleSignOut}
                    size="sm"
                    className="w-full flex justify-center !px-2 !py-1.5 gap-2 cursor-pointer"
                  >
                    <LogOut className="!w-5 !h-5" />
                    Log out
                  </Button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Button asChild variant="outline" size="sm">
                      <a href={auth.login.url}>{auth.login.title}</a>
                    </Button>
                    <Button asChild size="sm">
                      <a href={auth.signup.url}>{auth.signup.title}</a>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="md:w-[300px] bg-popover text-popover-foreground">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </a>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <a
      className="flex flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
      href={item.url}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-sm leading-snug text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </a>
  );
};

export default NavBar;
