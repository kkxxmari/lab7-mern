// This little home page keeps the greeting from the earlier lab.
// It has no database request, so it can appear straight away.
import { useState } from 'react';

function Content() {
  // Save the date on mount so rerendering does not change the displayed time.
  // The function initializer supplies the date for this mounted page.
  // Keeping it in state means an ordinary render will not advance the clock.
  const [openedAt] = useState(() => new Date());

  return (
    <div>
      <h1>Hello World!</h1>
      {/* Format the stored date using the browser's local time settings.
          There is no timer here, so the displayed time does not tick. */}
      <h2>It is {openedAt.toLocaleTimeString()}.</h2>
    </div>
  );
}

export default Content;
