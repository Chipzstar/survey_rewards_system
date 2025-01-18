import { SignIn, useUser } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';

export default async function Login() {
  const user = await currentUser();

  if (!user) {
    return <SignIn afterSignOutUrl='/' />;
  }

  return <div>Welcome!</div>;
}
