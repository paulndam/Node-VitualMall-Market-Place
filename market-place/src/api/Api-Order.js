const create = async (params, credentials, order, token) => {
  try {
    let response = await fetch(
      `${process.env.REACT_APP_API}/api/orders/${params.userId}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + credentials.t,
        },
        body: JSON.stringify({ order: order, token: token }),
      }
    );

    return await response.json();
  } catch (err) {
    console.log(`---error sending req to backend to  create order ---`);
    console.log(err);
  }
};

const listByShop = async (params, credentials, signal) => {
  try {
    let response = await fetch(
      `${process.env.REACT_APP_API}/api/orders/shop/${params.shopId}`,
      {
        method: "GET",
        signal: signal,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${credentials.t}`,
        },
      }
    );

    return await response.json();
  } catch (err) {
    console.log(`---error sending req to backend to  list order of a shop ---`);
    console.log(err);
  }
};

const update = async (params, credentials, product) => {
  try {
    let response = await fetch(
      `${process.env.REACT_APP_API}/api/order/status/${params.shopId}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${credentials.t}`,
        },
        body: JSON.stringify(product),
      }
    );
    return await response.json();
  } catch (err) {
    console.log(`---error sending req to backend to  update order  ---`);
    console.log(err);
  }
};

const cancelProduct = async (params, credentials, product) => {
  try {
    let response = await fetch(
      `${process.env.REACT_APP_API}/api/order/${params.shopId}/cancel/${params.productId}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${credentials.t}`,
        },
        body: JSON.stringify(product),
      }
    );
    return await response.json();
  } catch (err) {
    console.log(`---error sending req to backend to  cancel order  ---`);
    console.log(err);
  }
};

const processCharge = async (params, credentials, product) => {
  try {
    let response = await fetch(
      `${process.env.REACT_APP_API}/api/order/${params.orderId}/charge/${params.userId}/${params.shopId}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${credentials.t}`,
        },
        body: JSON.stringify(product),
      }
    );
    return await response.json();
  } catch (err) {
    console.log(
      `---error sending req to backend to  process order charge  ---`
    );
    console.log(err);
  }
};

const getStatusValues = async (signal) => {
  try {
    let response = await fetch(
      `${process.env.REACT_APP_API}/api/order/status_values`,
      {
        method: "GET",
        signal: signal,
      }
    );
    return await response.json();
  } catch (err) {
    console.log(
      `---error sending req to backend to  get order status value  ---`
    );
    console.log(err);
  }
};

const listByUser = async (params, credentials, signal) => {
  try {
    let response = await fetch(
      `${process.env.REACT_APP_API}/api/orders/user/${params.userId}`,
      {
        method: "GET",
        signal: signal,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${credentials.t}`,
        },
      }
    );
    return await response.json();
  } catch (err) {
    console.log(
      `---error sending req to backend to  get list  orders of user  ---`
    );
    console.log(err);
  }
};

const read = async (params, credentials, signal) => {
  try {
    let response = await fetch(
      `${process.env.REACT_APP_API}/api/order/${params.orderId}`,
      {
        method: "GET",
        signal: signal,
      }
    );
    return await response.json();
  } catch (err) {
    console.log(`---error sending req to backend to  get read  order  ---`);
    console.log(err);
  }
};

export {
  create,
  listByShop,
  update,
  cancelProduct,
  processCharge,
  getStatusValues,
  listByUser,
  read,
};
