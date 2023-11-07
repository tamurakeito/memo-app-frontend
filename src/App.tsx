import { BrowserRouter as Router } from "react-router-dom";
import { Toast } from "components/toast";
import { RouteSelector } from "routes";
import "the-new-css-reset/css/reset.css";
import "assets/scss/index.scss";
import { TabContextProvider } from "providers/tab-provider";
import { MemoContextProvider } from "providers/memo-provider";
import { NaviContextProvider } from "providers/navi-provider";
import { MenuContextProvider } from "providers/menu-provider";
import { ToastContextProvider } from "providers/toast-provider";

function App() {
  return (
    <Router>
      <MemoContextProvider>
        <TabContextProvider>
          <NaviContextProvider>
            <MenuContextProvider>
              <ToastContextProvider>
                <RouteSelector />
                <Toast />
              </ToastContextProvider>
            </MenuContextProvider>
          </NaviContextProvider>
        </TabContextProvider>
      </MemoContextProvider>
    </Router>
  );
}

export default App;
