DROP TABLE IF EXISTS "bus_schedules";
DROP TABLE IF EXISTS "bus_routes";
DROP TABLE IF EXISTS "bus_stops";

CREATE TABLE IF NOT EXISTS "bus_schedules" (
    "id" serial PRIMARY KEY,
    "route_name" text NOT NULL,
    "stop_name" text NOT NULL,
    "location" text NOT NULL,
    "arrival_time" text NOT NULL,
    "departure_time" text NOT NULL,
    "sequence" integer NOT NULL,
    "created_at" timestamp NOT NULL DEFAULT now()
); 