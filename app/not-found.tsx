import Link from "next/link";

export default function NotFound() {
  return (
    <div className="section-pad text-center">
      <div className="container-wide max-w-lg">
        <div className="font-serif text-8xl font-bold text-brand-red mb-4">404</div>
        <h1 className="font-serif text-3xl font-bold text-brand-dark mb-3">Page Not Found</h1>
        <p className="text-gray-500 mb-8">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link href="/" className="btn-primary">Back to Home</Link>
      </div>
    </div>
  );
}
