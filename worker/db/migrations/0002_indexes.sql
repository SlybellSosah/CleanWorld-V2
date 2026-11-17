CREATE INDEX IF NOT EXISTS quote_requests_notify_queue ON quote_requests (notify_status, notify_tries, created_at ASC);
CREATE INDEX IF NOT EXISTS quote_requests_status_created ON quote_requests (status, created_at DESC);
