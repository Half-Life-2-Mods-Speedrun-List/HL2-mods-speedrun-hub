CREATE TABLE "speedruns" (
  "id" integer PRIMARY KEY,
  "user_id" integer,
  "title" text,
  "category_id" integer,
  "strategies" text
);

CREATE TABLE "users" (
  "id" integer PRIMARY KEY,
  "username" varchar,
  "speedrun_id" integer,
  "email" varchar,
  "password" varchar
);

CREATE TABLE "votes" (
  "id" integer PRIMARY KEY,
  "difficulty" integer,
  "optimization" integer,
  "enjoyment" integer,
  "user_id" integer,
  "mods_id" integer,
  "value" integer
);

CREATE TABLE "categories" (
  "id" integer PRIMARY KEY,
  "name" text
);

CREATE TABLE "world_records" (
  "id" integer PRIMARY KEY,
  "user_id" integer,
  "runner_name" text,
  "category_id" integer,
  "speedrun_id" integer,
  "record_time" integer
);

CREATE TABLE "mods" (
  "id" integer PRIMARY KEY,
  "category_id" integer,
  "download_links" text
);

ALTER TABLE "speedruns" ADD CONSTRAINT "speedruns" FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "votes" ADD CONSTRAINT "votes" FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "votes" ADD CONSTRAINT "votes" FOREIGN KEY ("mods_id") REFERENCES "mods" ("id");

ALTER TABLE "world_records" ADD CONSTRAINT "world_records" FOREIGN KEY ("category_id") REFERENCES "categories" ("id");

ALTER TABLE "world_records" ADD CONSTRAINT "world_records" FOREIGN KEY ("speedrun_id") REFERENCES "speedruns" ("id");

ALTER TABLE "world_records" ADD CONSTRAINT "world_recods" FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "mods" ADD CONSTRAINT "mods" FOREIGN KEY ("category_id") REFERENCES "categories" ("id");