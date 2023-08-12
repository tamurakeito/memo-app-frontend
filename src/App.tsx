import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { RouteSelector } from "routes";
import "the-new-css-reset/css/reset.css";
import "assets/scss/index.scss";
import { TabContextProvider } from "providers/tab-provider";
import { ListContextProvider } from "providers/list-provider";
import { NaviContextProvider } from "providers/navi-provider";
import { ShadowContextProvider } from "providers/shadow-provider";
import { MenuContextProvider } from "providers/menu-provider";
import { Menu } from "components/menu";
import { Shadow } from "ui/atoms/shadow";

function App() {
  return (
    <Router>
      <ListContextProvider>
        <TabContextProvider>
          <NaviContextProvider>
            <MenuContextProvider>
              <ShadowContextProvider>
                <RouteSelector />
                {/* <Toaster /> */}
                <Menu />
                <Shadow />
              </ShadowContextProvider>
            </MenuContextProvider>
          </NaviContextProvider>
        </TabContextProvider>
      </ListContextProvider>
    </Router>
  );
}

export default App;
