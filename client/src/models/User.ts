interface User {
  _id: string;
  fullName: string;
  email: string;
  isVerified:boolean;
  role: string; //client | admin | owner
  avatar?: string;
}

export default User;