import { User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserProfile } from '../types/my.types';

interface ProfileCardProps {
  userProfile: UserProfile;
  onEditProfile?: () => void;
}

export function ProfileCard({ userProfile, onEditProfile }: ProfileCardProps) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center">
          <Avatar className="h-20 w-20 mr-4">
            <AvatarImage
              src={userProfile.profileImage || '/placeholder.svg'}
              alt={userProfile.name}
            />
            <AvatarFallback>
              <User className="h-10 w-10" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{userProfile.name}</h2>
            <p className="text-gray-500">{userProfile.role}</p>
            <p className="text-gray-500">{userProfile.facility}</p>
            <p className="text-sm text-gray-400 mt-1">
              사번: {userProfile.employeeId} | 가입일: {userProfile.joinDate}
            </p>
          </div>
        </div>

        <Button
          className="w-full mt-4"
          variant="outline"
          onClick={onEditProfile}>
          프로필 수정
        </Button>
      </CardContent>
    </Card>
  );
}
