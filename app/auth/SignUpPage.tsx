import { ClerkProvider, SignUp } from '@clerk/nextjs';

const SignUpPage = () => {
  return (
    <ClerkProvider>
      <SignUp />
    </ClerkProvider>
  );
};

export default SignUpPage;