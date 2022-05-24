-- App work
ALTER TABLE "App"
RENAME TO "Resource";
ALTER TABLE "Resource" RENAME CONSTRAINT  "App_pkey" TO "Resource_pkey";
ALTER TABLE "Resource" RENAME CONSTRAINT  "App_workspaceId_fkey" TO "Resource_workspaceId_fkey";
ALTER TABLE "Resource" RENAME CONSTRAINT  "App_projectId_fkey" TO "Resource_projectId_fkey";
ALTER TABLE "Resource" RENAME INDEX  "App.workspaceId_name_unique" TO "Resource.workspaceId_name_unique";

-- GitRepository work
ALTER TABLE "GitRepository"
RENAME "appId" TO "resource";
ALTER TABLE "GitRepository" RENAME CONSTRAINT  "GitRepository_appId_fkey" TO "GitRepository_resource_fkey";

-- ALTER TABLE "Entity"
-- RENAME "app" TO "resource";



-- AppRoles



-- /*
--   Warnings:

--   - You are about to drop the `App` table. If the table is not empty, all the data it contains will be lost.

-- */
-- -- DropForeignKey
-- ALTER TABLE "App" DROP CONSTRAINT "App_projectId_fkey";

-- -- DropForeignKey
-- ALTER TABLE "App" DROP CONSTRAINT "App_workspaceId_fkey";

-- -- DropForeignKey
-- ALTER TABLE "AppRole" DROP CONSTRAINT "AppRole_appId_fkey";

-- -- DropForeignKey
-- ALTER TABLE "Block" DROP CONSTRAINT "Block_appId_fkey";

-- -- DropForeignKey
-- ALTER TABLE "Build" DROP CONSTRAINT "Build_appId_fkey";

-- -- DropForeignKey
-- ALTER TABLE "Commit" DROP CONSTRAINT "Commit_appId_fkey";

-- -- DropForeignKey
-- ALTER TABLE "Entity" DROP CONSTRAINT "Entity_appId_fkey";

-- -- DropForeignKey
-- ALTER TABLE "Environment" DROP CONSTRAINT "Environment_appId_fkey";

-- -- DropForeignKey
-- ALTER TABLE "GitRepository" DROP CONSTRAINT "GitRepository_appId_fkey";



-- -- CreateTable
-- CREATE TABLE "Resource" (
--     "id" TEXT NOT NULL,
--     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     "updatedAt" TIMESTAMP(3) NOT NULL,
--     "workspaceId" TEXT NOT NULL,
--     "name" TEXT NOT NULL,
--     "description" TEXT NOT NULL,
--     "color" TEXT NOT NULL DEFAULT E'#20A4F3',
--     "githubLastSync" TIMESTAMP(3),
--     "githubLastMessage" TEXT,
--     "deletedAt" TIMESTAMP(3),
--     "projectId" TEXT,

--     CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
-- );

-- -- CreateIndex
-- CREATE UNIQUE INDEX "App.workspaceId_name_unique" ON "Resource"("workspaceId", "name");

-- -- AddForeignKey
-- ALTER TABLE "GitRepository" ADD CONSTRAINT "GitRepository_appId_fkey" FOREIGN KEY ("appId") REFERENCES "Resource"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "Resource" ADD CONSTRAINT "Resource_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "Resource" ADD CONSTRAINT "Resource_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "AppRole" ADD CONSTRAINT "AppRole_appId_fkey" FOREIGN KEY ("appId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "Commit" ADD CONSTRAINT "Commit_appId_fkey" FOREIGN KEY ("appId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "Entity" ADD CONSTRAINT "Entity_appId_fkey" FOREIGN KEY ("appId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "Block" ADD CONSTRAINT "Block_appId_fkey" FOREIGN KEY ("appId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "Build" ADD CONSTRAINT "Build_appId_fkey" FOREIGN KEY ("appId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "Environment" ADD CONSTRAINT "Environment_appId_fkey" FOREIGN KEY ("appId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;