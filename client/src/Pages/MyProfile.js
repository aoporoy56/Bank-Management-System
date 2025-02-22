import React from 'react'
import SearchAccount from '../Components/SearchAccount'
import { useUser } from '../Context/UserProvider';
import AccountPreview from '../Components/AccountPreview';

export default function MyProfile() {
    const { user } = useUser();
  return (
    <AccountPreview accountNo={user} />
  )
}
