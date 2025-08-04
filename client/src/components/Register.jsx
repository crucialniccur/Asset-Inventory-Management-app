import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const initialValues = {
    name: '',
    email: '',
    password: '',
    department: '',
    role: 'Employee',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    department: Yup.string().required('Department is required'),
    role: Yup.string()
      .oneOf(['Admin', 'Procurement', 'Finance', 'Employee'])
      .required('Role is required'),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors({ email: errorData.error || errorData.message || 'Registration failed' });
        return;
      }

      const data = await response.json();
      console.log('Registration successful:', data);
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ email: 'Something went wrong. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
    <div className="container" style={{ maxWidth: '800px' }}>
      <div className="bg-white p-4 rounded shadow-sm border">
        <div className="text-center mb-4">
          <div className="mx-auto bg-primary rounded d-flex align-items-center justify-content-center mb-3" style={{ width: '56px', height: '56px' }}>
            <i className="bi bi-building text-white fs-4"></i>
        </div>
          <h5 className="mt-3 mb-1">Welcome</h5>
          <p className="text-muted small">Register a new user</p>
        </div>

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <label htmlFor="name">Name</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <i className="bi bi-person"></i>
                  </span>
                  <Field name="name" className="form-control" placeholder="Enter your name" />
                </div>
                <ErrorMessage name="name" component="div" className="text-danger" />
              </div>

              <div className="mb-3">
                <label htmlFor="email">Email</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <Field name="email" type="email" className="form-control" placeholder="Enter your email" />
                </div>
                <ErrorMessage name="email" component="div" className="text-danger" />
              </div>

              <div className="mb-3">
                <label htmlFor="password">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <i className="bi bi-lock"></i>
                  </span>
                  <Field name="password" type="password" className="form-control" placeholder="Enter your password" />
                </div>
                <ErrorMessage name="password" component="div" className="text-danger" />
              </div>

              <div className="mb-3">
                <label htmlFor="department">Department</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <i className="bi bi-building"></i>
                  </span>
                  <Field name="department" className="form-control" placeholder="Enter department" />
                </div>
                <ErrorMessage name="department" component="div" className="text-danger" />
              </div>

              <div className="mb-3">
                <label htmlFor="role">Role</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <i className="bi bi-person-badge"></i>
                  </span>
                  <Field as="select" name="role" className="form-control">
                    <option value="Employee">Employee</option>
                    <option value="Admin">Admin</option>
                    <option value="Procurement">Procurement</option>
                    <option value="Finance">Finance</option>
                  </Field>
                </div>
                <ErrorMessage name="role" component="div" className="text-danger" />
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
            </Form>
          )}
        </Formik>
        </div>
        </div>
      </div>
  );
};

export default Register;
