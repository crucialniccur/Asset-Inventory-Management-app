import { Building2, ShieldCheck, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/man-in-desk-working.jpg';
import { Button } from './ui/button';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div
        className="flex-1 bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 102, 204, 0.7), rgba(0, 102, 204, 0.7)), url(${bgImage})`,
        }}
      >
        <div className="text-center text-white px-4 max-w-3xl py-16 w-full">
          {/* Title */}
          <div className="flex justify-center items-center gap-2 mb-4">
            <Building2 size={32} />
            <h1 className="text-4xl md:text-6xl font-bold">Asset Management</h1>
          </div>

          {/* Subtitle */}
          <p className="text-lg md:text-xl mb-10">
            Streamline your enterprise asset lifecycle with our comprehensive management platform
            designed for modern organizations.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <Button
              onClick={() => navigate('/auth/login')}
              variant="default"
              size="lg"
              className="rounded-full px-6"
            >
              Access Your Account
            </Button>
              
            <Button
              onClick={() => navigate('/auth/register')}
              variant="outline"
              size="lg"
              className="rounded-full px-6"
            >
              Admin Registration
            </Button>
          </div>



          {/* Features Row */}
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

    </div>
  );
}
