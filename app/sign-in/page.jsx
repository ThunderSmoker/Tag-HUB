import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const DynamicSignIn = dynamic(() => import('@components/SignIn'), {
  ssr: false,
});

const SigninPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <DynamicSignIn />
      </Suspense>
    </div>
  );
};

export default SigninPage;
