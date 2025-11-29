-- DropForeignKey
ALTER TABLE "contacts" DROP CONSTRAINT "contacts_agency_id_fkey";

-- AlterTable
ALTER TABLE "contacts" ALTER COLUMN "first_name" DROP NOT NULL,
ALTER COLUMN "last_name" DROP NOT NULL,
ALTER COLUMN "agency_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "daily_usage" ADD COLUMN     "all_time_viewed_pages" TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "agencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
