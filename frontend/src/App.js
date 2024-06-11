import logo from "./logo.svg";
import "./App.css";
import React, { useState } from "react";
import StripeCheckout from "react-stripe-checkout";
function App() {
  const [product, setProduct] = useState({
    name: "React by Facebook",
    price: 25,
    product_by: "NODE",
  });

  const makePayment = (token) => {
    const body = {
      token,
      product,
    };
    const headers = {
      "Content-type": "application/json",
    };

    return fetch("https://8ae0-219-91-170-81.ngrok-free.app/payment", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    })
      .then((response) => {
        console.log("RESPONSE", response);
        const { status } = response;
        console.log("status", status)
      })
      .catch(error => console.log(error));
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <a
          className="App-link"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <StripeCheckout
          stripeKey={process.env.REACT_APP_KEY}
          token={makePayment}
          name="Buy react"
          amount={product.price * 100}
          billingAddress
          shippingAddress
        >
          <button className="btn-large red">BUY REACT-JS COURSE</button>
        </StripeCheckout>
      </header>
    </div>
  );
}

export default App;
