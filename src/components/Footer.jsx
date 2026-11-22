// A shared footer keeps the author information in one place.
// It is outside Routes in App, so every page keeps the same signature.
function Footer() {
  // Share the same author information without repeating it in each page.
  return (
    <footer className="page-footer">
      {/* Match the content width used by the navigation and page layout. */}
      <div className="container">
        <small>Mariia Chalyk | Data Representation &amp; Querying | Lab 7</small>
      </div>
    </footer>
  );
}

export default Footer;
