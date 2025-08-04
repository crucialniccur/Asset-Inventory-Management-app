import { useNavigate } from 'react-router-dom';

/**
 * Custom hook for navigating from the landing page
 */
export function useLandingNavigation() {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/login');
  };

  const goToRegister = () => {
    navigate('/register');
  };

  return {
    goToLogin,
    goToRegister,
  };
}
