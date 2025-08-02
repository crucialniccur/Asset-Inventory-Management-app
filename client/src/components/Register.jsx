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
    role: 'EMPLOYEE',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Minimum 6 characters').required('Required'),
    department: Yup.string(),
    role: Yup.string().oneOf(['ADMIN', 'PROCUREMENT', 'FINANCE', 'EMPLOYEE']),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors({ email: errorData.message || 'Registration failed' });
        return;
      }

      navigate('/auth/login');
    } catch (error) {
      setErrors({ email: 'Something went wrong' });
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
            <Field name="name" className="form-control" />
            <ErrorMessage name="name" component="div" className="text-danger" />
          </div>

          <div className="mb-3">
            <label htmlFor="email">Email</label>
            <Field name="email" type="email" className="form-control" />
            <ErrorMessage name="email" component="div" className="text-danger" />
          </div>

          <div className="mb-3">
            <label htmlFor="password">Password</label>
            <Field name="password" type="password" className="form-control" />
            <ErrorMessage name="password" component="div" className="text-danger" />
          </div>

          <div className="mb-3">
            <label htmlFor="department">Department</label>
            <Field name="department" className="form-control" />
            <ErrorMessage name="department" component="div" className="text-danger" />
          </div>

          <div className="mb-3">
            <label htmlFor="role">Role</label>
            <Field as="select" name="role" className="form-control">
              <option value="EMPLOYEE">Employee</option>
              <option value="ADMIN">Admin</option>
              <option value="PROCUREMENT">Procurement</option>
              <option value="FINANCE">Finance</option>
            </Field>
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
