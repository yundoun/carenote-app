interface UserInfoProps {
  name: string;
  role: string;
  floor: string;
}

export function UserInfo({ name, role, floor }: UserInfoProps) {
  return (
    <div className="ml-3">
      <h1 className="text-lg font-bold">{name}</h1>
      <p className="text-sm text-gray-500">
        {role} | {floor}
      </p>
    </div>
  );
}
