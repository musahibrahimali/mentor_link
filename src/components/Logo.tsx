import Link from 'next/link';
import { Handshake } from 'lucide-react'; // Or a more suitable logo icon

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <Handshake className="h-8 w-8 text-primary transition-transform duration-300 ease-in-out group-hover:rotate-[15deg]" />
      <span className="text-2xl font-headline font-semibold text-primary group-hover:text-accent transition-colors">
        MentorLink
      </span>
    </Link>
  );
}
