import { Header } from "@/components/header";

export default async function PublicLayout({
  children
}: {
  children: React.ReactNode;
}) {
    return (
    <>
        <Header />
        {children}
    </>
    );
}


