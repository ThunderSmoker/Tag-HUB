"use client";
import { useRouter } from "next/navigation";
const Home = () => {
  const router = useRouter();
  return (
    <section className="w-full flex-center flex-col">
      <button onClick={()=>{router.push('/home')}} className="outline_btn">hello</button>
    </section>
  );
};

export default Home;
