CREATE TABLE quote_requests (
  id            TEXT PRIMARY KEY,
  reference     TEXT NOT NULL UNIQUE,
  created_at    TEXT NOT NULL,
  customer_type TEXT NOT NULL CHECK (customer_type IN ('organisation','household')),
  service       TEXT NOT NULL,
  scope         TEXT,
  frequency     TEXT,
  neighbourhood TEXT NOT NULL,
  landmark      TEXT,
  latitude      REAL,
  longitude     REAL,
  plus_code     TEXT,
  name          TEXT NOT NULL,
  phone         TEXT NOT NULL,
  organisation  TEXT,
  email         TEXT,
  po_reference  TEXT,
  status        TEXT NOT NULL DEFAULT 'new'
                CHECK (status IN ('new','contacted','quoted','won','lost','spam')),
  notify_status TEXT NOT NULL DEFAULT 'pending'
                CHECK (notify_status IN ('pending','sent','failed')),
  notify_tries  INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX quote_requests_created ON quote_requests (created_at DESC);
CREATE INDEX quote_requests_notify ON quote_requests (notify_status);
