import { Header } from "@/components/header";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@radix-ui/react-navigation-menu";

export default async function PublicLayout({
  children
}: {
  children: React.ReactNode;
}) {
    const menuItems = [
        {
            title: "Item One",
            href: "/item-one"
        },
        {
            title: "Item Two",
            href: "/item-two"
        }
    ];

    return (
    <>
        <Header />
        {children}
    </>
    );
}


