const signin = async (user) => {
  try {
    let response = await fetch(`${process.env.REACT_APP_API}/auth/signin`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(user),
    });
    return await response.json();
  } catch (err) {
    console.log(`Can't Sign in user`);
    console.log(err);
  }
};

const signout = async () => {
  try {
    let response = await fetch(`${process.env.REACT_APP_API}/auth/signout`, {
      method: "GET",
    });
    return await response.json();
  } catch (err) {
    console.log(`Can't Sign out user`);
    console.log(err);
  }
};

export { signin, signout };
