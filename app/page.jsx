'use client'

import Feed from "@components/Feed";

const Home = () => (
  <section className='w-full flex-center flex-col'>
    <h1 className='head_text text-center'>
      Discover & Share
      <br className='max-md:hidden' />
      <span className='orange_gradient text-center'>Mind Trembling Thoughts</span>
    </h1>
    <p className='desc text-center'>
      TagHUB is an open-source Thoughhts Sharing Platform for modern world to
      discover, create and share creative thoughts
    </p>

    <Feed />
  </section>
);

export default Home;
