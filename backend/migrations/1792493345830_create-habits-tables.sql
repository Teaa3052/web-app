-- Up Migration
CREATE TABLE habits (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, 
    frequency VARCHAR(10) NOT NULL CHECK ( frequency IN ('daily', 'weekly', 'monthly')),
    archived_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX habits_user_id_idx ON habits (user_id);

CREATE TABLE habit_logs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    habit_id BIGINT NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(habit_id, log_date)
);


-- Down Migration
DROP TABLE habit_logs;
DROP TABLE habits;