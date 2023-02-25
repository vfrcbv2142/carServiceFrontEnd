import ApiService from './ApiService';
import TokenService from "./TokenService";
import EventBus from '../common/EventBus';


const signIn = (login, password) => {
    return ApiService.post("/auth/signin", { login, password })
    .then((response) => {
      if (response.data.accessToken) {
        TokenService.setAccount(response.data);
      }
      return response.data;
    });
}

const logOut = () => {
    TokenService.removeAccount();
    }

const signUp = (login, email, password) => {
    return ApiService.post("/auth/signup", { login, email, password });
}

const ifRefreshTokenExpired = (error, navigate) => {
    if (error.response && error.response.status === 403) {
        EventBus.dispatch("logout");
        navigate('/sign-in');
        window.location.reload();
      }
}

const AuthService = {
    signUp,
    logOut,
    signIn,
    ifRefreshTokenExpired
}

export default AuthService