import axios from "axios";

const create = async (user) => {
  try {
    let response = await fetch(`${process.env.REACT_APP_API}/api/users/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    console.log("-----sending req to create user -------->");

    return await response.json();
  } catch (err) {
    console.log(`Error sending request to Endpoint to create user`);
    console.log(err);
  }
};

const list = async (signal) => {
  try {
    let response = await fetch(`${process.env.REACT_APP_API}/api/users/`, {
      method: "GET",
      signal: signal,
    });

    return await response.json();
  } catch (err) {
    console.log(`Error sending request to Endpoint to get list of user`);
    console.log(err);
  }
};

const read = async (params, credentials, signal) => {
  try {
    let response = await fetch(
      `${process.env.REACT_APP_API}/api/users/${params.userId}`,
      {
        method: "GET",
        // signal: signal,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${credentials.t}`,
        },
      }
    );

    return await response.json();
  } catch (err) {
    console.log(`Error sending request to Endpoint to read user`);
    console.log(err);
  }
};

const update = async (params, credentials, user) => {
  try {
    let response = await fetch(
      `${process.env.REACT_APP_API}/api/users/${params.userId}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          // "Content-Type": "application/json",
          Authorization: `Bearer ${credentials.t}`,
        },

        body: user,
      }
    );

    return await response.json();
  } catch (err) {
    console.log(`Error sending request to Endpoint to update user`);
    console.log(err);
  }
};

const remove = async (params, credentials) => {
  try {
    let response = await fetch(
      `${process.env.REACT_APP_API}/api/users/${params.userId}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${credentials.t}`,
        },
      }
    );

    return await response.json();
  } catch (err) {
    console.log(`Error sending request to Endpoint to delete user`);
    console.log(err);
  }
};

const stripeUpdate = async (params, credentials, auth_code, signal) => {
  try {
    let response = await fetch(
      `${process.env.REACT_APP_API}/api/stripe_auth/${params.userId}`,
      {
        method: "PUT",
        signal: signal,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${credentials.t}`,
        },
        body: JSON.stringify({ stripe: auth_code }),
      }
    );
    return await response.json();
  } catch (err) {
    console.log(`Error sending request to Endpoint to connect to stripe `);
    console.log(err);
  }
};

const createConnectStripeAccount = async (
  params,
  credentials,
  auth_code,
  signal
) => {
  //let response = await fetch(`${process.env.REACT_APP_API}/create-connect-account`,)
  axios.post(
    `${process.env.REACT_APP_API}/api/stripe_auth/`,
    {},
    {
      headers: {
        authorization: `Bearer ${credentials}`,
      },
    }
  );
};

const getAccountStatus = async (credentials) => {
  axios.post(
    `${process.env.REACT_APP_API}/api/get-account-status`,
    {},
    {
      headers: {
        authorization: `Bearer ${credentials.t}`,
      },
    }
  );
};

export {
  create,
  list,
  read,
  update,
  remove,
  stripeUpdate,
  createConnectStripeAccount,
  getAccountStatus,
};
