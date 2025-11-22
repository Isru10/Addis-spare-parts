// src/components/layout/Footer.tsx

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-muted">
      <div className="container py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-2">About</h3>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="#" className="hover:underline">Our Story</Link>
              <Link href="#" className="hover:underline">Careers</Link>
            </nav>
          </div>
          <div>
            <h3 className="font-bold mb-2">Help</h3>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="#" className="hover:underline">Contact Us</Link>
              <Link href="#" className="hover:underline">FAQs</Link>
              <Link href="#" className="hover:underline">Shipping</Link>
            </nav>
          </div>
          <div>
            <h3 className="font-bold mb-2">Services</h3>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="#" className="hover:underline">Part Sourcing</Link>
              <Link href="#" className="hover:underline">Partnerships</Link>
            </nav>
          </div>
          <div>
            <h3 className="font-bold mb-2">Legal</h3>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="#" className="hover:underline">Terms of Service</Link>
              <Link href="#" className="hover:underline">Privacy Policy</Link>
            </nav>
          </div>
        </div>
        <div className="text-center text-sm text-muted-foreground mt-8">
          © {new Date().getFullYear()} Addis Spare Parts. All rights reserved.
        </div>
      </div>
    </footer>
  );
}