import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const DynamicSignUp = dynamic(() => import('@components/SignUp'), {
  ssr: false,
});

const SignUpPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <DynamicSignUp />
      </Suspense>
    </div>
  );
};

export default SignUpPage;
