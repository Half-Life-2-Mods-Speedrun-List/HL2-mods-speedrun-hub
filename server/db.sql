-- Active: 1743102853420@@localhost@5432@hl2
DROP TABLE IF EXISTS mods;
DROP TABLE IF EXISTS categories;

CREATE TABLE "speedruns" (
  "speedrun_id" SERIAL PRIMARY KEY,
  "user_id" integer,
  "title" text,
  "category_id" integer,
  "strategies" text
);

CREATE TABLE "users" (
  "user_id" SERIAL PRIMARY KEY,
  "username" varchar(100) unique not null,
  "speedrun_id" integer, --> this is not needed here, since user can have multiple runs and they are stored to speedrun table
  "email" varchar (255) unique,
  "password" varchar(255) not null,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "votes" (
  "vote_id" SERIAL PRIMARY KEY,
  "difficulty" integer,
  "optimization" integer,
  "enjoyment" integer,
  "user_id" integer, ---> is this necessary? votes should be anonymous, and can unregistered user vote too?
  "mods_id" integer, --> should this be category_id?
  "value" integer ---> what is purpose of this?
);

CREATE TABLE "categories" (
  "category_id" SERIAL PRIMARY KEY,
  "category_name" text,
  "user_id" integer REFERENCES users(user_id)
);

CREATE TABLE "world_records" (
  "wr_id" SERIAL PRIMARY KEY,
  "user_id" integer,  
  "runner_name" text,
  "category_id" integer,
  "speedrun_id" integer, --> this is not necessary since there's only one speedrun per category visible?
  "record_time" varchar(12),
  "record_date" date
);

CREATE TABLE mods (
  mod_id SERIAL PRIMARY KEY,
  mod_name text,
  download_links text,
  user_id INTEGER,
  FOREIGN KEY (user_id) REFERENCES "users"("user_id")

);

CREATE TABLE mod_category (
  mod_id integer NOT NULL, 
  category_id integer NOT NULL,
  PRIMARY KEY (mod_id, category_id),
  FOREIGN KEY (mod_id) REFERENCES mods(mod_id),
  FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

CREATE TABLE resource_links (
  resource_id integer SERIAL PRIMARY KEY, 
  mod_id integer NOT NULL,
  rtsl text,
  moddb text,
  steam text,
  extra1 text,
  extra2 text,
  extra3 text,
  src text,
  FOREIGN KEY (mod_id) REFERENCES mods(mod_id),
);


ALTER TABLE "speedruns" ADD CONSTRAINT "speedruns" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id");

ALTER TABLE "votes" ADD CONSTRAINT "votes" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id");

ALTER TABLE "votes" ADD CONSTRAINT "votes" FOREIGN KEY ("mods_id") REFERENCES "mods" ("mod_id");

ALTER TABLE "world_records" ADD CONSTRAINT "world_records" FOREIGN KEY ("category_id") REFERENCES "categories" ("category_id");

ALTER TABLE "world_records" ADD CONSTRAINT "world_records" FOREIGN KEY ("speedrun_id") REFERENCES "speedruns" ("speedrun_id");

ALTER TABLE "world_records" ADD CONSTRAINT "world_recods" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id");

ALTER TABLE "mods" ADD CONSTRAINT "user_id" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id");

ALTER TABLE "world_records" ALTER COLUMN "record_time" TYPE VARCHAR(12);

ALTER TABLE "world_records" ADD COLUMN "record_date" DATE;

ALTER TABLE "categories" ADD COLUMN "wr_video" text;
ALTER TABLE "categories" ADD CONSTRAINT "user_id" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id");
