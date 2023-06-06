import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { RouteSelector } from "routes";
import "the-new-css-reset/css/reset.css";
import "assets/scss/index.scss";
import { TabContextProvider } from "provider/tab-provider";
import { ListContextProvider } from "provider/list-provider";

function App() {
  return (
    <Router>
      <ListContextProvider>
        <TabContextProvider>
          <Toaster />
          <RouteSelector />
        </TabContextProvider>
      </ListContextProvider>
    </Router>
  );
}

export default App;
