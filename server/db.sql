-- Active: 1743102853420@@localhost@5432@hl2
DROP TABLE IF EXISTS mods;

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
  "speedrun_id" integer,
  "email" varchar (255) unique,
  "password" varchar(255) not null,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "votes" (
  "vote_id" SERIAL PRIMARY KEY,
  "difficulty" integer,
  "optimization" integer,
  "enjoyment" integer,
  "user_id" integer,
  "mods_id" integer,
  "value" integer
);

CREATE TABLE "categories" (
  "category_id" SERIAL PRIMARY KEY,
  "name" text
);

CREATE TABLE "world_records" (
  "wr_id" SERIAL PRIMARY KEY,
  "user_id" integer,
  "runner_name" text,
  "category_id" integer,
  "speedrun_id" integer,
  "record_time" integer
);

CREATE TABLE mods (
  mod_id SERIAL PRIMARY KEY,
  mod_name text,
  category_id integer, --> onko turha, yhdellä modillahan on monta kategoriaa?
  download_links text
);

CREATE TABLE mod_category (
  mod_id integer NOT NULL, 
  category_id integer NOT NULL,
  PRIMARY KEY (mod_id, category_id),
  FOREIGN KEY (mod_id) REFERENCES mods(mod_id),
  FOREIGN KEY (category_id) REFERENCES categories(category_id)
);



ALTER TABLE "speedruns" ADD CONSTRAINT "speedruns" FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "votes" ADD CONSTRAINT "votes" FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "votes" ADD CONSTRAINT "votes" FOREIGN KEY ("mods_id") REFERENCES "mods" ("id");

ALTER TABLE "world_records" ADD CONSTRAINT "world_records" FOREIGN KEY ("category_id") REFERENCES "categories" ("id");

ALTER TABLE "world_records" ADD CONSTRAINT "world_records" FOREIGN KEY ("speedrun_id") REFERENCES "speedruns" ("id");

ALTER TABLE "world_records" ADD CONSTRAINT "world_recods" FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "mods" ADD CONSTRAINT "mods" FOREIGN KEY ("category_id") REFERENCES "categories" ("id");