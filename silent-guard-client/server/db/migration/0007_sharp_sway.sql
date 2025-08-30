ALTER TABLE "cameras" DROP CONSTRAINT "cameras_id_category_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "cameras" ADD CONSTRAINT "cameras_id_category_categories_id_fk" FOREIGN KEY ("id_category") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;