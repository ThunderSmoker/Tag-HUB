import Link from "next/link";
import PromptCard from "./PromptCard";

const Profile = ({ name, desc, data, handleEdit, handleDelete }) => {
  return (
    <section className="w-full">
      <div className="flex">

      <h1 className="head_text text-left">
        <span className="blue_gradient">{name} Profile</span>
      </h1>
      <Link href='/profile/edit'>
        <button className="outline_btn h-6 mt-11 ml-2">Edit Profile</button>
      </Link>
      </div>
      <p className="desc text-left">{desc}</p>
      {data.length === 0 && name==='My'? (
        <div className="desc text-left flex flex-col"><p className="desc ">Create Your first Thought Now!</p><Link href='/create-post'><button className="black_btn text-left w-20 mt-2">Create</button></Link></div>
      ) : (
        <div className="mt-10 prompt_layout">
          {data.map((post) => (
            <PromptCard
              key={post._id}
              post={post}
              handleEdit={() => handleEdit && handleEdit(post)}
              handleDelete={() => handleDelete && handleDelete(post)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Profile;
