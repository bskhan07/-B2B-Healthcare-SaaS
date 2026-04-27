import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import "../../../packages/theme/src/globals.css";
import "./styles/globals.css";

import { notificationService } from "./lib/notifications";

notificationService.register();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
