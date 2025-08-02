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
    role: Yup.string().oneOf(['Admin', 'Procurement', 'Finance', 'Employee']).required('Role is required'),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      // Updated to match your Login component's API endpoint pattern
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
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
      
      // Navigate to login page after successful registration
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ email: 'Something went wrong. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
  <div className="container" style={{ maxWidth: '500px' }}>
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Form className="bg-white p-4 rounded shadow-sm border w-100">
          <div className="mb-3">
            <label htmlFor="name">Name</label>
            <div className="input-group">
              <span className="input-group-text bg-light"><i className="bi bi-person absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i></span>
              <Field name="name" className="form-control" placeholder="Enter your name"/>
            </div>
            <ErrorMessage name="name" component="div" className="text-danger" />
          </div>

          <div className="mb-3">
            <label htmlFor="email">Email</label>
            <div className="input-group">
              <span className="input-group-text bg-light"><i className="bi bi-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i></span>
              <Field name="email" type="email" className="form-control" placeholder="Enter user email"/>
            </div>
            <ErrorMessage name="email" component="div" className="text-danger" />
          </div>

          <div className="mb-3">
            <label htmlFor="password">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light"><i className="bi bi-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i></span>
              <Field name="password" type="password" className="form-control" placeholder="Enter user password"/>
            </div>
            <ErrorMessage name="password" component="div" className="text-danger" />
          </div>

          <div className="mb-3">
            <label htmlFor="department">Department</label>
            <div className="input-group">
              <span className="input-group-text bg-light"><i className="bi bi-building absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i></span>
              <Field name="department" className="form-control" placeholder="Enter Department"/>
            </div>
            <ErrorMessage name="department" component="div" className="text-danger" />
          </div>

          <div className="mb-3">
            <label htmlFor="role">Role</label>
            <div className="input-group">
              <span className="input-group-text bg-light"><i className="bi bi-person-badge absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i></span>
              <Field as="select" name="role" className="form-control" placeholder="Select user role">
                <option value="EMPLOYEE">Employee</option>
                <option value="ADMIN">Admin</option>
                <option value="PROCUREMENT">Procurement</option>
                <option value="FINANCE">Finance</option>
              </Field>
            </div>
            <ErrorMessage name="role" component="div" className="text-danger" />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
            Register
          </button>
        </Form>
      )}
    </Formik>
  </div>
</div>
  );
};

export default Register;