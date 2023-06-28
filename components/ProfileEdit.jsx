"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ref, uploadBytes, getDownloadURL,deleteObject } from "firebase/storage";
import { firebaseStorage } from "@utils/firebase";
import { convertToPNG, resizeImage } from "@utils/Image";
import swal from "sweetalert";
import { useRouter } from "next/navigation";
const ProfileEdit = ({ data }) => {
  const router = useRouter();
  const usernameRegex =
    /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
  const passwordRegex =
    /^(?=.{8,20}$)(?![.])(?!.*[.]{2})[a-zA-Z0-9!@#$%^&*().]+(?<![.])$/;
  const [image, setImage] = useState(null);
  const [preImage, setpreImage] = useState(null);
  const [username, setUsername] = useState("");
  const [errmsg, setErrmsg] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  useEffect(() => {
    if(!image){

      setpreImage(data?.image);
    }
    setUsername(data?.username);
    setEmail(data?.email);
    
  },[data]);
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setpreImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };
  const handleDelete = async (post) => {
    setDeleting(true);
    swal({
      title: "Confirm Deletion",
      text: "Are you sure you want to delete your Account?",
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
    }).then(async (value) => {
      if (value) {
        if ((data?.image).startsWith("https://firebasestorage.googleapis.com/")) {
          const deleteRef = ref(
            firebaseStorage,
            `images/${data.username}_${data.email}`
          );
          deleteObject(deleteRef)
            .then(() => {
              console.log("File deleted successfully");
            })
            .catch((error) => {
              console.log(error);
            });
        }
        const response=await fetch(`/api/users/${data.id}/posts`, {
          method: "DELETE",
        });
        const res=await fetch(`/api/users/${data.id}`, {
          method: "DELETE",
        });
        if (res.status === 200) {
          swal({
            title: "Success",
            text: "Profile deleted successfully",
            icon: "success",
            button: "Ok",
          })
          router.push('/')
        }
        else{
          swal({
            title: "Error",
            text: "Some error occured",
            icon: "error",
            button: "Ok",
          })
        }
      } else {
      }
      setDeleting(false);
    });
  }
  const handleSave = async (event) => {
    setSubmitting(true);
    event.preventDefault();
    if (!username || !email ) {
      setErrmsg("*Please fill atleast username and email fields");
      return;
    }
    if (!username.match(usernameRegex)) {
      setErrmsg(
        "*Username invalid, it should contain 8-20 alphanumeric letters and be unique!"
      );
      return;
    }
    if (password && !password.match(passwordRegex)) {
      setErrmsg(
        "*Password invalid, it should contain at least 8 characters, 1 uppercase letter, 1 lowercase letter and 1 number!"
      );
      return;
    }

    if ((password && confirmPassword)&& (password !== confirmPassword)) {
      setErrmsg("*Passwords do not match");
      return;
    }
    if ((data?.image).startsWith("https://firebasestorage.googleapis.com/")) {
      const deleteRef = ref(
        firebaseStorage,
        `images/${data.username}_${data.email}`
      );
      deleteObject(deleteRef)
        .then(() => {
          console.log("File deleted successfully");
        })
        .catch((error) => {
          console.log(error);
        });
    }
    let downloadURL ="";
    if(image){
    if (image.type !== "image/png") {
      const convertedImage = await convertToPNG(image);
      setImage(convertedImage);
    }
    const resizedImage = await resizeImage(image, 512, 512);
    const fileName = `${username}_${email}`;
    const storageRef = ref(firebaseStorage, `images/${fileName}`);
    const snapshot = await uploadBytes(storageRef, resizedImage);
    downloadURL = await getDownloadURL(snapshot.ref);
    console.log("File available at", downloadURL);
  }
    const res=await fetch(`/api/users/${data.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        username,
        email,
        image:downloadURL,
        password,
      }),
    });
    if (res.status === 200) {
      swal({
        title: "Success",
        text: "Profile updated successfully",
        icon: "success",
        button: "Ok",
      })
      router.push('/')
    }
    else{
        swal({
          title: "Error",
          text: "Some error occured",
          icon: "error",
          button: "Ok",
        })
      
    }
    setSubmitting(false);
  };
  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="w-32 h-32 rounded-full bg-orange-400 relative">
        <label
          style={{ border: "4px solid orange" }}
          htmlFor="photo-upload"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="w-full h-full absolute top-0 left-0 rounded-full bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-500"
        >
          {preImage ? (
            <img
              src={preImage}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          ) : null}

          {isHovered && (
            <div
              style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
              className="bg-white rounded-full w-full h-full flex items-center justify-center transition duration-300 ease-in-out"
            >
              <Image
                src="/assets/images/upload.png"
                width={24}
                height={24}
                alt="Upload"
              />
            </div>
          )}
        </label>

        <input
          id="photo-upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
      <div className="w-72 mt-8">
        <input
          type="text"
          className="w-full px-4 py-2 mb-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="Username"
          value={username}
          onChange={handleUsernameChange}
        />
        <input
          type="email"
          className="w-full px-4 py-2 mb-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="New Email"
          value={email}
          onChange={handleEmailChange}
        />
        <input
          type="password"
          className="w-full px-4 py-2 mb-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="New Password"
          value={password}
          onChange={handlePasswordChange}
        />
        <input
          type="password"
          className="w-full px-4 py-2 mb-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />
        <div className="flex ml-2 my-3 text-red-600">{errmsg}</div>
        <button
          type="button"
          className="w-full py-2 -mt-4 px-4 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-300"
          onClick={handleSave}
        >
          {submitting ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          className="w-full rounded-md mt-4 py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-bold"
          onClick={handleDelete}
        >
          {deleting ? "Deleting..." : "Delete Account"}
        </button>
      </div>
    </div>
  );
};

export default ProfileEdit;
