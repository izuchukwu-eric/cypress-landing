'use client'
import { useAppState } from '@/lib/providers/state-provider'
import { workspace } from '@/lib/supabase/supabase.types'
import React, { useEffect, useState } from 'react'
import SelectedWorkspace from './selected-workspace'

interface WorkspaceDropDownProps {
    privateWorkspaces: workspace[] | [],
    sharedWorkspaces: workspace[] | [],
    collaboratingWorkspaces: workspace[] | [],
    defaultValue: workspace | undefined
}

const WorkspaceDropDown:React.FC<WorkspaceDropDownProps> = ({ privateWorkspaces, sharedWorkspaces, collaboratingWorkspaces, defaultValue }) => {
    const { dispatch,  state } = useAppState();
    const [selectedOption, setSelectedOption] = useState(defaultValue);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if(!state.workspaces.length){
            dispatch({ 
                type: "SET_WORKSPACES", 
                payload: {
                    workspaces: [
                        ...privateWorkspaces, 
                        ...sharedWorkspaces, 
                        ...collaboratingWorkspaces
                    ].map((workspace) => ({ ...workspace, folders: []}))
                }
            })
        }

    }, [privateWorkspaces, collaboratingWorkspaces, sharedWorkspaces])

    const handleSelect = (option: workspace) => {
        setSelectedOption(option);
        setIsOpen(false)
    }

  return (
    <div className='relative inline-block text-left'>
        <div>
            <span onClick={() => {setIsOpen(!isOpen)}}>
                {selectedOption ? <SelectedWorkspace workspace={selectedOption} /> : "Select a workspace"}
            </span>
        </div>
    </div>
  )
}

export default WorkspaceDropDown