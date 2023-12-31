"use client";
import useSWR from "swr";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Form from "@components/Form";

const UpdatePrompt = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const promptId = searchParams.get("id");

  const [post, setPost] = useState({ prompt: "", tag: "" });
  const [submitting, setIsSubmitting] = useState(false);

  // useEffect(() => {
  //   const getPromptDetails = async () => {
  //     const response = await fetch(`/api/post/${promptId}`);
  //     const data = await response.json();

  // setPost({
  //   prompt: data.prompt,
  //   tag: data.tag,
  // });
  //   };

  //   if (promptId) getPromptDetails();
  // }, [promptId]);
  const fetcher = (...args) =>
    fetch(...args)
      .then((res) => res.json())
      .then((data) =>
        setPost({
          prompt: data.prompt,
          tag: data.tag,
        })
      );
  const { data, error, isLoading } = useSWR(`/api/post/${promptId}`, fetcher);
  const updatePrompt = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!promptId) return alert("Missing PromptId!");

    try {
      const response = await fetch(`/api/post/${promptId}`, {
        method: "PATCH",
        body: JSON.stringify({
          prompt: post.prompt,
          tag: post.tag,
        }),
      });

      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form
      type="Edit"
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={updatePrompt}
    />
  );
};

export default UpdatePrompt;
