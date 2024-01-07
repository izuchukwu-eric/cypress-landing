'use server'
import { validate } from "uuid";
import db from "./db"
import { Folder, Subscription, workspace } from "./supabase.types";
import { files, folders, users, workspaces } from "../../../migrations/schema";
import { and, eq, notExists } from "drizzle-orm";
import { collaborators } from "./schema";

export const createWorkspace = async (workspace: workspace) => {
    try {
      const response = await db.insert(workspaces).values(workspace);
      return { data: null, error: null };
    } catch (error) {
      console.log(error);
      return { data: null, error: 'Error' };
    }
};

export const getUserSubscriptionStatus = async (userId: string) => {
    try {
        const data = await db.query.subscriptions.findFirst({
            where: (s, { eq }) => eq(s.userId, userId)
        });

        if(data) return { data: data as Subscription, error: null }

        else return { data: null, error: null }
    } catch (error) {
        console.log(error)
        return { data: null, error: `Error ${error}` }   
    }
}

export const getFolders = async (workspaceId: string) => {
  const isValid = validate(workspaceId);
  if (!isValid) return { data: null, error: 'Error' };
  try {
    const results = (await db
      .select()
      .from(folders)
      .orderBy(folders.createdAt)
      .where(eq(folders.workspaceId, workspaceId))) as Folder[] | []
    return { data: results, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: 'Error' };
  }
}

export const getFiles = async (folderId: string) => {
    const isValid = validate(folderId);
    if (!isValid) return { data: null, error: 'Error' };
    try {
      const results = (await db
        .select()
        .from(files)
        .orderBy(files.createdAt)
        .where(eq(files.folderId, folderId))) as File[] | [];
      return { data: results, error: null };
    } catch (error) {
      console.log(error);
      return { data: null, error: 'Error' };
    }
};

export const getPrivateWorkspaces = async (userId: string) => {
  if(!userId) return []

  const privateWorkspaces = await db.select({
    id: workspaces.id,
    createdAt: workspaces.createdAt,
    workspaceOwner: workspaces.workspaceOwner,
    title: workspaces.title,
    iconId: workspaces.iconId,
    data: workspaces.data,
    inTrash: workspaces.inTrash,
    logo: workspaces.logo,
  })
  .from(workspaces)
  .where(
    and(notExists(
      db
      .select()
      .from(collaborators)
      .where(eq(collaborators.workspacesId, workspaces.id)),
    ),
      eq(workspaces.workspaceOwner, userId)
  )) as workspace[]

  return privateWorkspaces;
}

export const getCollaboratingWorkspaces = async (userId: string) => {
  if(!userId) return []

  const collaboratingWorkspaces = await db.select({
    id: workspaces.id,
    createdAt: workspaces.createdAt,
    workspaceOwner: workspaces.workspaceOwner,
    title: workspaces.title,
    iconId: workspaces.iconId,
    data: workspaces.data,
    inTrash: workspaces.inTrash,
    logo: workspaces.logo,
    bannerUrl: workspaces.bannerUrl
  })
  .from(users)
  .innerJoin(collaborators, eq(users.id, collaborators.userId))
  .innerJoin(workspaces, eq(collaborators.workspacesId, workspaces.id))
  .where(eq(users.id, userId)) as workspace[]

  return collaboratingWorkspaces;
}