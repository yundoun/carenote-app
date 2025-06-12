import React, { useState } from 'react';
import { Eye, EyeOff, Heart, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 로그인 로직 구현
    console.log('Login attempt:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmMGY5ZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI0Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>

      <div className="relative w-full max-w-md">
        {/* 로고 및 헤더 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-3xl mb-6 shadow-lg">
            <Heart className="w-10 h-10 text-white" fill="currentColor" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CareNote</h1>
          <p className="text-gray-600 text-lg">요양간호사 전용 케어 관리 시스템</p>
        </div>

        {/* 로그인 카드 */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center text-gray-900">
              로그인
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              안전하고 전문적인 케어 서비스를 시작하세요
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 이메일 입력 */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  이메일 또는 직원번호
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@carenote.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="h-12 text-base bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* 비밀번호 입력 */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  비밀번호
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="비밀번호를 입력하세요"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="h-12 text-base bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* 옵션들 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => handleInputChange('rememberMe', Boolean(checked))}
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-700 cursor-pointer">
                    로그인 정보 기억하기
                  </Label>
                </div>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  비밀번호 찾기
                </button>
              </div>

              {/* 로그인 버튼 */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                로그인
              </Button>
            </form>

            {/* 회원가입 링크 */}
            <div className="pt-4 border-t border-gray-100">
              <div className="text-center text-sm text-gray-600">
                아직 계정이 없으신가요?{' '}
                <button className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                  회원가입
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 하단 특징 */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center space-y-2 p-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs text-gray-600 font-medium">안전한 보안</span>
          </div>
          <div className="flex flex-col items-center space-y-2 p-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-xs text-gray-600 font-medium">전문 케어</span>
          </div>
          <div className="flex flex-col items-center space-y-2 p-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs text-gray-600 font-medium">팀워크</span>
          </div>
        </div>

        {/* 버전 정보 */}
        <div className="text-center mt-6 text-xs text-gray-500">
          CareNote v1.0.0 - 전문 요양케어 솔루션
        </div>
      </div>
    </div>
  );
};

export default LoginPage;