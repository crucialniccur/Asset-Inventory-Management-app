import { Building2, ShieldCheck, Users } from 'lucide-react';
import bgImage from '../assets/man-in-desk-working.jpg';
import { Button } from './ui/button';
import { useLandingNavigation } from '../hooks/use-landing-navigation';

export default function LandingPage() {
  const { goToLogin, goToRegister } = useLandingNavigation();

  return (
      <div
          style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 102, 204, 0.7), rgba(0, 102, 204, 0.7)), url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div className="text-center text-white px-4 max-w-3xl py-16 w-full">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Building2 size={32} />
            <h1 className="text-4xl md:text-6xl font-bold">Asset Management</h1>
          </div>

          <p className="text-lg md:text-xl mb-10">
            Streamline your enterprise asset lifecycle with our comprehensive management platform
            designed for modern organizations.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <Button
              onClick={goToLogin}
              variant="default"
              size="lg"
              className="bg-white text-blue-500 hover:text-blue-600 hover:bg-blue-50 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"

            >
              Access Your Account
            </Button>
            <Button
              onClick={goToRegister}
              variant="outline"
              size="lg"
              className="bg-white text-blue-500 hover:text-blue-600 hover:bg-blue-50 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"

            >
              Admin Registration
            </Button>
          </div>

          <div className="flex justify-center gap-3 text-sm text-white/90">
            <div className="flex items-center gap-1">
              <Building2 size={16} /> Enterprise Ready
            </div>
            <div className="flex items-center gap-1">
              <ShieldCheck size={16} /> Secure & Compliant
            </div>
            <div className="flex items-center gap-1">
              <Users size={16} /> Multi-Role Support
            </div>
          </div>
        </div>
      </div>
  );
}
