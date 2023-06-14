"use client";
import useSWR from 'swr'
import {useState } from "react";
import { useSearchParams } from "next/navigation";

import Profile from "@components/Profile";

const UserProfile = ({ params }) => {
  const searchParams = useSearchParams();
  const userName = searchParams.get("name");

  const [userPosts, setUserPosts] = useState([]);
  const fetcher = (...args) => fetch(...args).then(res => res.json()).then(data => setUserPosts(data))
  const { res, error, isLoading } = useSWR(`/api/users/${params.id}/posts`, fetcher)
  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     const response = await fetch(`/api/users/${params?.id}/posts`);
  //     const data = await response.json();

  //     setUserPosts(data);
  //   };

  //   if (params?.id) fetchPosts();
  // }, [params.id]);

  return (
    <Profile
      name={userName}
      desc={`Welcome to ${userName}'s personalized profile page. Explore ${userName}'s exceptional thoughts and be inspired by the power of their imagination`}
      data={userPosts}
    />
  );
};

export default UserProfile;
