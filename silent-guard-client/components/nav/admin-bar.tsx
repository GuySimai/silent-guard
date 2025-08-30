
//General imports
import { Session } from "next-auth";

//My components
import UserProfileAvatar from "./user-profile-avatar";

export default function AdminBar({session}:{session: Session}) {
  return ( <UserProfileAvatar session={session}/> );
}