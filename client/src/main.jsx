import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'; // ⬅️ import this
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';
import store from './redux/store'; // ⬅️ make sure this path points to your store

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>   {/* ⬅️ wrap App with Provider */}
      <App />
    </Provider>
  </StrictMode>
);
# Final formatting update
