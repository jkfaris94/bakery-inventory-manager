import { Link, useLocation } from "react-router-dom";

export default function NotFound() {
  const location = useLocation();

  return (
    <div className="container py-5 text-center">
      <div className="home-hero">
        <h1 className="display-4">404</h1>
        <p className="lead">
          Sorry, we couldn't find <code>{location.pathname}</code>.
        </p>
        <p className="text-muted mb-4">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary btn-lg">
          Return Home
        </Link>
      </div>
    </div>
  );
}