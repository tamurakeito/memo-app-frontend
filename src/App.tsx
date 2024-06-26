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
import { ErrorContextProvider } from "providers/error-provider";
import { TaskContextProvider } from "providers/task-provider";

function App() {
  return (
    <Router>
      <MemoContextProvider>
        <TaskContextProvider>
          <TabContextProvider>
            <NaviContextProvider>
              <MenuContextProvider>
                <ToastContextProvider>
                  <ErrorContextProvider>
                    <RouteSelector />
                    <Toast />
                  </ErrorContextProvider>
                </ToastContextProvider>
              </MenuContextProvider>
            </NaviContextProvider>
          </TabContextProvider>
        </TaskContextProvider>
      </MemoContextProvider>
    </Router>
  );
}

export default App;
