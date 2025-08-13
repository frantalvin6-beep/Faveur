
import { Package2 } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Package2 className="h-6 w-6" />
            <span className="sr-only">S.G.ENIA 2.0</span>
             <span className="font-bold">S.G.ENIA 2.0</span>
          </Link>
        </nav>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <div className="ml-auto">
                 <Link href="/" passHref>
                    <Button variant="outline">Portail de Connexion</Button>
                </Link>
            </div>
        </div>
      </header>
       <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        {children}
      </main>
      <footer className="flex items-center justify-center p-4 border-t">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} S.G.ENIA 2.0. Tous droits réservés.
        </p>
      </footer>
    </div>
  );
}
