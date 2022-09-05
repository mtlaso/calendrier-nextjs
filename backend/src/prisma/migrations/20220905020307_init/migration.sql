-- CreateTable
CREATE TABLE "events" (
    "user_id" VARCHAR(40) NOT NULL,
    "event_id" VARCHAR(40) NOT NULL,
    "event_creation_date" TIMESTAMP(6) NOT NULL,
    "event_date" TIMESTAMP(6) NOT NULL,
    "title" VARCHAR(60) NOT NULL,
    "is_completed" BOOLEAN NOT NULL,
    "description" VARCHAR(256) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" VARCHAR(40) NOT NULL,
    "username" VARCHAR(30) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "created_on" TIMESTAMP(6) NOT NULL,
    "last_login" TIMESTAMP(6),

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_password_key" ON "users"("password");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
