import { ThemeProvider } from "@mui/styles";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { hot } from "react-hot-loader";
import {
  NavBar,
  Home,
  Profile,
  SignUpUser,
  SignInUser,
  PrivateRoute,
  EditUser,
  SellerShops,
  NewShop,
  AllShops,
  EditShop,
  Shop,
  NewProduct,
  EditProduct,
  Product,
  Cart,
  StripeConnect,
  StripeCallBack,
  Order,
  ShopOrders,
  Loading,
  SearchResults,
} from "./components/allComponents/AllComponents";
import theme from "./theme";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <NavBar />
          <Switch>
            <Route exact path="/loading" component={Loading} />
            {/* <Route exact path="/search-results" component={SearchResults} /> */}

            <Route exact path="/" component={Home} />
            <Route exact path="/signup" component={SignUpUser} />
            <Route exact path="/signin" component={SignInUser} />
            <Route exact path="/user/:userId" component={Profile} />

            <Route exact path="/cart" component={Cart} />
            <Route exact path="/product/:productId" component={Product} />
            <Route exact path="/allshops" component={AllShops} />
            <Route exact path="/shops/:shopId" component={Shop} />

            <Route exact path="/order/:orderId" component={Order} />
            <PrivateRoute
              path="/seller/orders/:shop/:shopId"
              component={ShopOrders}
            />

            <PrivateRoute path="/user/edit/:userId" component={EditUser} />
            <PrivateRoute path="/seller/myshops" component={SellerShops} />
            <PrivateRoute path="/seller/shop/new" component={NewShop} />
            <PrivateRoute
              path="/seller/shop/edit/:shopId"
              component={EditShop}
            />
            <PrivateRoute
              path="/seller/:shopId/products/new"
              component={NewProduct}
            />
            <PrivateRoute
              path="/seller/:shopId/:productId/edit"
              component={EditProduct}
            />

            <Route path="/seller/stripe/connect" component={StripeConnect} />
            <Route path="/stripe/callback" component={StripeCallBack} />
          </Switch>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default hot(module)(App);
