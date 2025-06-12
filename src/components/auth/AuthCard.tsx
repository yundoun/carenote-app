import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  headerContent?: React.ReactNode;
  footerContent?: React.ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({
  title,
  description,
  children,
  headerContent,
  footerContent,
}) => {
  return (
    <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-6">
        {headerContent || (
          <>
            <CardTitle className="text-2xl font-semibold text-center text-gray-900">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="text-center text-gray-600">
                {description}
              </CardDescription>
            )}
          </>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {children}
        
        {footerContent && (
          <div className="pt-4 border-t border-gray-100">
            {footerContent}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthCard;