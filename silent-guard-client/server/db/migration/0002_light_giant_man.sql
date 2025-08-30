CREATE TABLE "cameras" (
	"id" text PRIMARY KEY NOT NULL,
	"id_category" text NOT NULL,
	"connection_url" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"color" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cameras" ADD CONSTRAINT "cameras_id_category_categories_id_fk" FOREIGN KEY ("id_category") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;