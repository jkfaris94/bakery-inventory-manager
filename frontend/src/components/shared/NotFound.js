import { Link, useLocation } from "react-router-dom";

export default function NotFound() {
  const location = useLocation();

  return (
    <div className="container py-5 text-center">
      <h1 className="display-4">404</h1>
      <p className="lead">
        Sorry, we couldn’t find <code>{location.pathname}</code>.
      </p>
      <Link to="/" className="btn btn-primary">
        Return Home
      </Link>
    </div>
  );
}