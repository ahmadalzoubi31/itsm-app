import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-6">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-extrabold text-foreground">404</h1>

        <p className="text-lg text-muted-foreground">
          Oops! The page you are looking for doesn’t exist.
        </p>

        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-primary-foreground transition"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
