const getLocalRefreshToken = () => {
    const account = JSON.parse(localStorage.getItem("account"));
    return account?.refreshToken;
  };
  
  const getLocalAccessToken = () => {
    const account = JSON.parse(localStorage.getItem("account"));
    return account?.accessToken;
  };
  
  const updateLocalAccessToken = (token) => {
    let account = JSON.parse(localStorage.getItem("account"));
    account.accessToken = token;
    localStorage.setItem("account", JSON.stringify(account));
  };
  
  const getCurrentAccount = () => {
    return JSON.parse(localStorage.getItem("account"));
  };
  
  const setAccount = (account) => {
    console.log(JSON.stringify(account));
    localStorage.setItem("account", JSON.stringify(account));
  };
  
  const removeAccount = () => {
    localStorage.removeItem("account");
  };
  
  const TokenService = {
    getLocalRefreshToken,
    getLocalAccessToken,
    updateLocalAccessToken,
    getCurrentAccount,
    setAccount,
    removeAccount,
  };
  
  export default TokenService;