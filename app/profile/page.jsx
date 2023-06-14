"use client";
import swal from "sweetalert";
import { useSession } from "next-auth/react";
import { useState } from "react";
import  {useRouter}  from "next/navigation";
import useSWR from 'swr'
import Profile from "@components/Profile";

const MyProfile = () => {
  const { data: session ,status} = useSession();
  const [myPosts, setMyPosts] = useState([]);
  const fetcher = (...args) => fetch(...args).then(res => res.json()).then(data => setMyPosts(data))
  const { res, error, isLoading } = useSWR(`/api/users/${session?.user.id}/posts`, fetcher)
  const router =useRouter()
  // useEffect(() => {
  //   const fetchPosts = async () => {
     
  //     // const userData = {
  //     //   email: session?.user.email,
  //     // };
  //     const response = await fetch(`/api/users/${session?.user.id}/posts`,);
  //     // const response = await fetch(`/api/users/${session?.user.id}/posts`, {
  //     //   method: "POST",
  //     //   headers: {
  //     //     "Content-Type": "application/json",
  //     //   },
  //     //   body: JSON.stringify(userData),
  //     // });
  //     const data = await response.json();

  //     setMyPosts(data);
  //   };

  //   if (session?.user.id) fetchPosts();
  // }, [session?.user.id]);

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };
  const deletepost = async (post) => {
    try {
      await fetch(`/api/prompt/${post._id.toString()}`, {
        method: "DELETE",
      });

      const filteredPosts = myPosts.filter((item) => item._id !== post._id);

      setMyPosts(filteredPosts);
    } catch (error) {
      console.log(error);
    }
  }
  const handleDelete = async (post) => {
    
    swal({
      title: "Confirm Deletion",
      text: "Are you sure you want to delete this prompt?",
      icon: "warning",
      buttons: {
        cancel: {
          text: "Cancel",
          value: false,
          visible: true,
          className: "",
          closeModal: true,
        },
        confirm: {
          text: "Delete",
          value: true,
          visible: true,
          className: "",
          closeModal: true,
        },
      },
    }).then((value) => {
      if (value) {
        // User clicked "Delete"
        // Perform the deletion logic here
      deletepost(post);
      } else {
        // User clicked "Cancel" or closed the modal
        // Do nothing or handle the cancellation
        // ...
      }
    });

    
  };
 if(status === "unauthenticated") router.push("/sign-in");
 else
  return (
    <Profile
      name="My"
      desc="Welcome to your personalized profile page. Share your exceptional thoughts and inspire others with the power of your imagination"
      data={myPosts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfile;
