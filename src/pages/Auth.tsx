import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { useAuth } from '@/contexts/AuthContext';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      {isLogin ? (
        <div>
          <LoginForm />
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
            <Button 
              variant="link" 
              onClick={() => setIsLogin(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              Don't have an account? Sign up
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <SignUpForm />
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
            <Button 
              variant="link" 
              onClick={() => setIsLogin(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              Already have an account? Sign in
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;