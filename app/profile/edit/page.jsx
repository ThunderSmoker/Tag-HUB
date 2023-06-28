'use client'
import ProfileEdit from '@components/ProfileEdit'
import {useState} from 'react'
import useSWR from 'swr'
import { useSession } from 'next-auth/react'
import { set } from 'mongoose'
const page = () => {
  const { data: session ,status} = useSession();
  const [user, setUser] = useState(null);
  
  const fetcher = (...args) => fetch(...args).then(res => res.json()).then(data => setUser(data))
  const { res, error, isLoading } = useSWR(`/api/users/${session?.user.id}`, fetcher);
    const data={
        id:user?._id,
        email:user?.email,
        username:user?.username,
        image:user?.image,
    }
  return (
    <div>
    
        <ProfileEdit data={data} />
    </div>
  )
}

export default page