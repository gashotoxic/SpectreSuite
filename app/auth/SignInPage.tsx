import { ClerkProvider, SignIn } from '@clerk/nextjs';

const SignInPage = () => {
  return (
    <ClerkProvider>
      <SignIn />
    </ClerkProvider>
  );
};

export default SignInPage;