import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { post } from '../lib/api';

const AddUser = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    role: Yup.string().required('Role is required'),
    department: Yup.string().required('Department is required')
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await post('/auth/register', values);

      if (response.success) {
        alert('User created successfully!');
        navigate('/users');
      } else {
        setError(response.message || 'Failed to create user');
      }
    } catch (err) {
      setError('An error occurred while creating the user');
      console.error('Error creating user:', err);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Add New User</h4>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <Formik
                initialValues={{
                  name: '',
                  email: '',
                  password: '',
                  role: '',
                  department: ''
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Full Name</label>
                      <Field
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Enter full name"
                      />
                      <ErrorMessage name="name" component="div" className="text-danger small" />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email</label>
                      <Field
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="Enter email address"
                      />
                      <ErrorMessage name="email" component="div" className="text-danger small" />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Password</label>
                      <Field
                        type="password"
                        name="password"
                        className="form-control"
                        placeholder="Enter password"
                      />
                      <ErrorMessage name="password" component="div" className="text-danger small" />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="role" className="form-label">Role</label>
                      <Field as="select" name="role" className="form-select">
                        <option value="">Select a role</option>
                        <option value="Admin">Admin</option>
                        <option value="Finance">Finance</option>
                        <option value="Procurement">Procurement</option>
                        <option value="Employee">Employee</option>
                      </Field>
                      <ErrorMessage name="role" component="div" className="text-danger small" />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="department" className="form-label">Department</label>
                      <Field
                        type="text"
                        name="department"
                        className="form-control"
                        placeholder="Enter department"
                      />
                      <ErrorMessage name="department" component="div" className="text-danger small" />
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting || isLoading}
                      >
                        {isLoading ? 'Creating...' : 'Create User'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate('/users')}
                      >
                        Cancel
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
