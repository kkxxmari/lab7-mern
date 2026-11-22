// This simple heading is kept from the earlier component exercise.
// App currently uses Content for Home, so Header is available but not routed.
function Header() {
  // Keep the original heading component from the previous exercise.
  return (
    <header>
      {/* JSX lets this reusable function describe its own HTML heading. */}
      <h1>My Header in another component</h1>
    </header>
  );
}

export default Header;
