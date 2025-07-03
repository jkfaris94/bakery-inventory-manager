export default function Footer() {
  return (
    <footer className="site-footer" style={{ borderTop: "1px solid #ddd" }}>
        <nav>
            <a href="/">Home</a>
            <a href="/ingredients" style={{ margin: "0 1rem" }}>Ingredients</a>
            <a href="/recipes">Recipes</a>
        </nav>
        <small>© 2025 created by jkfaris94.</small>
    </footer>
  );
}
