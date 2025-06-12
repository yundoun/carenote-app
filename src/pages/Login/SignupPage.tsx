import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, Heart, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SignupPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    // 1단계: 기본 정보
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    // 2단계: 직무 정보
    employeeNumber: '',
    department: '',
    floor: '',
    unit: '',
    role: '',
    phoneNumber: '',
    
    // 3단계: 약관 동의
    agreements: {
      termsOfService: false,
      privacyPolicy: false,
      marketingConsent: false,
    },
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.startsWith('agreements.')) {
      const agreementField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        agreements: {
          ...prev.agreements,
          [agreementField]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // TODO: 회원가입 로직 구현
      console.log('Signup attempt:', formData);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStep1Valid = formData.name && formData.email && formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
  const isStep2Valid = formData.employeeNumber && formData.department && formData.role && formData.phoneNumber;
  const isStep3Valid = formData.agreements.termsOfService && formData.agreements.privacyPolicy;

  const renderProgressBar = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
              currentStep >= step 
                ? 'bg-blue-600 border-blue-600 text-white' 
                : 'bg-white border-gray-300 text-gray-400'
            }`}>
              {currentStep > step ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <span className="font-semibold">{step}</span>
              )}
            </div>
            {step < 3 && (
              <div className={`w-16 h-1 rounded transition-all duration-300 ${
                currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
          이름 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="홍길동"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="h-12 text-base bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          이메일 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="hongkildong@carenote.com"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className="h-12 text-base bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          비밀번호 <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="8자리 이상 영문, 숫자 포함"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="h-12 text-base bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
          비밀번호 확인 <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="비밀번호를 다시 입력하세요"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className="h-12 text-base bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-12"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
          <div className="flex items-center space-x-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>비밀번호가 일치하지 않습니다</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="employeeNumber" className="text-sm font-medium text-gray-700">
            직원번호 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="employeeNumber"
            type="text"
            placeholder="EMP001"
            value={formData.employeeNumber}
            onChange={(e) => handleInputChange('employeeNumber', e.target.value)}
            className="h-12 text-base bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role" className="text-sm font-medium text-gray-700">
            직무 <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
            <SelectTrigger className="h-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="직무 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CAREGIVER">요양보호사</SelectItem>
              <SelectItem value="NURSE">간호사</SelectItem>
              <SelectItem value="SOCIAL_WORKER">사회복지사</SelectItem>
              <SelectItem value="PHYSICAL_THERAPIST">물리치료사</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="department" className="text-sm font-medium text-gray-700">
          소속 부서 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="department"
          type="text"
          placeholder="예: 3층 A유닛"
          value={formData.department}
          onChange={(e) => handleInputChange('department', e.target.value)}
          className="h-12 text-base bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="floor" className="text-sm font-medium text-gray-700">
            근무 층수
          </Label>
          <Select value={formData.floor} onValueChange={(value) => handleInputChange('floor', value)}>
            <SelectTrigger className="h-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="층 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1층</SelectItem>
              <SelectItem value="2">2층</SelectItem>
              <SelectItem value="3">3층</SelectItem>
              <SelectItem value="4">4층</SelectItem>
              <SelectItem value="5">5층</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit" className="text-sm font-medium text-gray-700">
            유닛
          </Label>
          <Select value={formData.unit} onValueChange={(value) => handleInputChange('unit', value)}>
            <SelectTrigger className="h-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="유닛 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">A유닛</SelectItem>
              <SelectItem value="B">B유닛</SelectItem>
              <SelectItem value="C">C유닛</SelectItem>
              <SelectItem value="D">D유닛</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
          전화번호 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="phoneNumber"
          type="tel"
          placeholder="010-1234-5678"
          value={formData.phoneNumber}
          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
          className="h-12 text-base bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
          <Checkbox
            id="termsOfService"
            checked={formData.agreements.termsOfService}
            onCheckedChange={(checked) => handleInputChange('agreements.termsOfService', Boolean(checked))}
            className="mt-1"
          />
          <div className="flex-1">
            <Label htmlFor="termsOfService" className="text-sm font-medium text-gray-900 cursor-pointer">
              이용약관 동의 <span className="text-red-500">*</span>
            </Label>
            <p className="text-xs text-gray-600 mt-1">
              케어노트 서비스 이용을 위한 필수 약관입니다.
            </p>
            <button className="text-xs text-blue-600 hover:text-blue-700 underline mt-1">
              약관 전문 보기
            </button>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
          <Checkbox
            id="privacyPolicy"
            checked={formData.agreements.privacyPolicy}
            onCheckedChange={(checked) => handleInputChange('agreements.privacyPolicy', Boolean(checked))}
            className="mt-1"
          />
          <div className="flex-1">
            <Label htmlFor="privacyPolicy" className="text-sm font-medium text-gray-900 cursor-pointer">
              개인정보처리방침 동의 <span className="text-red-500">*</span>
            </Label>
            <p className="text-xs text-gray-600 mt-1">
              개인정보 수집 및 이용에 대한 필수 동의사항입니다.
            </p>
            <button className="text-xs text-blue-600 hover:text-blue-700 underline mt-1">
              방침 전문 보기
            </button>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
          <Checkbox
            id="marketingConsent"
            checked={formData.agreements.marketingConsent}
            onCheckedChange={(checked) => handleInputChange('agreements.marketingConsent', Boolean(checked))}
            className="mt-1"
          />
          <div className="flex-1">
            <Label htmlFor="marketingConsent" className="text-sm font-medium text-gray-900 cursor-pointer">
              마케팅 정보 수신 동의 (선택)
            </Label>
            <p className="text-xs text-gray-600 mt-1">
              새로운 기능, 교육자료 등의 유용한 정보를 받아보실 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Heart className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">환영합니다!</span>
        </div>
        <p className="text-sm text-blue-700 mt-2">
          케어노트와 함께 더 나은 요양서비스를 제공하고, 전문성을 키워나가세요.
        </p>
      </div>
    </div>
  );

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return '기본 정보 입력';
      case 2: return '직무 정보 입력';
      case 3: return '약관 동의';
      default: return '';
    }
  };

  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1: return isStep1Valid;
      case 2: return isStep2Valid;
      case 3: return isStep3Valid;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmMGY5ZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI0Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>

      <div className="relative w-full max-w-lg">
        {/* 헤더 */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-3xl mb-4 shadow-lg">
            <Heart className="w-8 h-8 text-white" fill="currentColor" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">CareNote 회원가입</h1>
          <p className="text-gray-600">전문 요양서비스 팀에 합류하세요</p>
        </div>

        {/* 진행 상태 바 */}
        {renderProgressBar()}

        {/* 회원가입 카드 */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center justify-between">
              {currentStep > 1 && (
                <button
                  onClick={goBack}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">이전</span>
                </button>
              )}
              <div className="flex-1">
                <CardTitle className="text-xl font-semibold text-center text-gray-900">
                  {getStepTitle()}
                </CardTitle>
                <CardDescription className="text-center text-gray-600 text-sm">
                  {currentStep}/3 단계
                </CardDescription>
              </div>
              {currentStep > 1 && <div className="w-12"></div>}
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}

              <Button 
                type="submit" 
                disabled={!isCurrentStepValid()}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none"
              >
                {currentStep === 3 ? '회원가입 완료' : '다음 단계'}
              </Button>
            </form>

            {/* 로그인 링크 */}
            <div className="pt-4 border-t border-gray-100 mt-6">
              <div className="text-center text-sm text-gray-600">
                이미 계정이 있으신가요?{' '}
                <button className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                  로그인
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 버전 정보 */}
        <div className="text-center mt-6 text-xs text-gray-500">
          CareNote v1.0.0 - 전문 요양케어 솔루션
        </div>
      </div>
    </div>
  );
};

export default SignupPage;