import React from 'react';
import { Shield, Heart, Users, Clock, FileText, Smartphone } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const features: Feature[] = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: '안전한 보안',
    description: '의료정보 보호를 위한 최고 수준의 보안',
    color: 'text-blue-600 bg-blue-100',
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: '전문 케어',
    description: '체계적인 요양케어 관리 시스템',
    color: 'text-emerald-600 bg-emerald-100',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: '팀워크',
    description: '효율적인 팀 간 소통과 협업',
    color: 'text-purple-600 bg-purple-100',
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: '실시간 모니터링',
    description: '24시간 실시간 케어 현황 파악',
    color: 'text-orange-600 bg-orange-100',
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: '간편한 기록',
    description: '직관적인 UI로 빠른 기록 작성',
    color: 'text-indigo-600 bg-indigo-100',
  },
  {
    icon: <Smartphone className="w-6 h-6" />,
    title: '모바일 최적화',
    description: '언제 어디서나 편리한 접근',
    color: 'text-pink-600 bg-pink-100',
  },
];

interface AuthFeaturesProps {
  layout?: 'grid' | 'row';
  showAll?: boolean;
}

const AuthFeatures: React.FC<AuthFeaturesProps> = ({ 
  layout = 'row', 
  showAll = false 
}) => {
  const displayFeatures = showAll ? features : features.slice(0, 3);

  if (layout === 'grid') {
    return (
      <div className="mt-8 grid grid-cols-2 gap-4 text-center">
        {displayFeatures.map((feature, index) => (
          <div key={index} className="flex flex-col items-center space-y-2 p-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${feature.color}`}>
              {feature.icon}
            </div>
            <div>
              <span className="text-sm font-medium text-gray-900 block">{feature.title}</span>
              <span className="text-xs text-gray-600">{feature.description}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-3 gap-4 text-center">
      {displayFeatures.map((feature, index) => (
        <div key={index} className="flex flex-col items-center space-y-2 p-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${feature.color}`}>
            {feature.icon}
          </div>
          <span className="text-xs text-gray-600 font-medium">{feature.title}</span>
        </div>
      ))}
    </div>
  );
};

export default AuthFeatures;