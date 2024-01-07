import { getFolders, getUserSubscriptionStatus } from '@/lib/supabase/queries';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react'

interface SidebarProps {
    params: { workspaceId: string };
    className?: string
}

const Sidebar:React.FC<SidebarProps> = async ({ params, className }) => {
    const supabase = createServerComponentClient({ cookies })

    //check for user
    const {
        data: { user }
    } = await supabase.auth.getUser()

    if(!user) return

    //check for subscription status
    const { data: subscriptionData, error: subscriptionError } = await getUserSubscriptionStatus(user?.id)

    //get access to folders for sidebar
    const { data: workspaceFolderData, error: foldersError } = await getFolders(params.workspaceId)

    //error
    // if(subscriptionError || foldersError) redirect('/dashboard');

    //get all the diff workspaces: private, collaborating, shared
  return (
    <div>Sidebar</div>
  )
}

export default Sidebar