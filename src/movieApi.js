// Use one small Axios client for the two pages that talk to Express.
// It carries request settings, not any private database connection details.
import axios from 'axios';

// Share the API address between the GET and POST calls.
// The timeout lets either page report an error if a request stalls.
const movieApi = axios.create({ baseURL: 'http://localhost:4000', timeout: 10000 });

// Named exports let Read and Create import this exact client.
// Both calls then use the same server address and timeout.
export { movieApi };
