import { getCollaboratingWorkspaces, getFolders, getPrivateWorkspaces, getSharedWorkspaces, getUserSubscriptionStatus } from '@/lib/supabase/queries';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react'
import { twMerge } from 'tailwind-merge';
import WorkspaceDropDown from './workspace-dropdown';

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
    const [privateWorkspaces, collaboratingWorkspaces, sharedWorkspaces] = 
      await Promise.all([
        getPrivateWorkspaces(user.id), 
        getCollaboratingWorkspaces(user.id), 
        getSharedWorkspaces(user.id)
      ])
    
  return (
    <aside className={twMerge('hidden sm:flex sm:flex-col w-[280px] shrink-0 p-4 md:gap-4 !justify-between', className)}>
      <div>
        <WorkspaceDropDown 
          privateWorkspaces={privateWorkspaces} 
          collaboratingWorkspaces={collaboratingWorkspaces} 
          sharedWorkspaces={sharedWorkspaces}
          defaultValue={[
            ...privateWorkspaces,
            ...collaboratingWorkspaces,
            ...sharedWorkspaces
          ].find((workspace) => workspace.id === params.workspaceId)}
        />
          
      </div>
    </aside>
  )
}

export default Sidebar