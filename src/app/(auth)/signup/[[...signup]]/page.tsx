import { SignUp } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';

export default async function Signup() {
  const user = await currentUser();

  if (!user) {
    return <SignUp />;
  }

  return <div>Welcome!</div>;
}
