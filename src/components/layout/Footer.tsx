import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 py-8">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p className="font-body">&copy; {new Date().getFullYear()} MentorLink. All rights reserved.</p>
        <div className="mt-4 flex justify-center space-x-4">
          <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          <Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
        </div>
      </div>
    </footer>
  );
}
