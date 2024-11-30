import { useAppStore } from "@/store"

export const Profile = () => {

  const {userInfo} = useAppStore();
  return (
    <div>
      Profile
      <div>email:{userInfo.email}</div>
    </div>
  );
}