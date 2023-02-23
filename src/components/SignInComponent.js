import React from "react";
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AuthService from "../services/AuthService";


const SignInComponent = () => {
    
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    const navigate = useNavigate();
    const formik = useFormik({
      initialValues: {
        login: '',
        password: '',
        message: ''
      },
      validationSchema: Yup.object({
          login: Yup.string().min(3).max(20).required('Required'),
          password: Yup.string().min(6).max(40).matches('^(((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))',
            'Password must containt letters and digits').required('Required')
      }),
      onSubmit: values => {
        login(values.login, values.password);
      },
    });

    const login = async (login, password) => {

        AuthService.signIn(login, password).then(
          () => {
            navigate("/home");
            window.location.reload();
          },
          (error) => {
            const resMessage =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();

              formik.setFieldValue('message', resMessage);
          }
        );
        await sleep(500);
        formik.setSubmitting(false);
    };

    return (
      <div className="col-md-12">
        <div className="card card-container">
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />

          <form onSubmit={formik.handleSubmit}>
            <div className="form-group">
              <label htmlFor="login">Login</label>
              <input
                type="text"
                className="form-control"
                name="login"
                value={formik.values.login}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.login && formik.errors.login ? (
                                <div className="alert alert-danger" >{formik.errors.login}</div>
                                ) : null}

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.password && formik.errors.password ? (
                                <div className="alert alert-danger" >{formik.errors.password}</div>
                                ) : null}

            <div className="form-group">
              <button className="btn btn-primary btn-block" type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting && (
                  <span className="spinner-border spinner-border-sm mr-2"></span>
                )}
                <span>Sign In</span>
              </button>
            </div>

            {formik.values.message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {formik.values.message}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    );
};

export default SignInComponent;