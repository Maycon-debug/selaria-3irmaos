import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@radix-ui/react-navigation-menu";

<NavigationMenu className="text-neutral-300">
  <NavigationMenuList className="gap-6">
    <NavigationMenuItem>
      <NavigationMenuTrigger className="bg-transparent hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors">
        Home
      </NavigationMenuTrigger>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuTrigger className="bg-transparent hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors">
        Components
      </NavigationMenuTrigger>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuTrigger className="bg-transparent hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors">
        Docs
      </NavigationMenuTrigger>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
