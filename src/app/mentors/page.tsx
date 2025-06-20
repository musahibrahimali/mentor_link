import { MentorList } from "./MentorList";

export default function MentorsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-4">
          Find Your Mentor
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse our community of experienced mentors ready to guide you. 
          Use the filters to find the perfect match for your goals.
        </p>
      </div>
      <MentorList />
    </div>
  );
}
