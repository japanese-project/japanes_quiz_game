-- seed-local.sql

-- --- CLEANUP ---
DELETE FROM choices;
DELETE FROM questions;
DELETE FROM quiz_attempts;
DELETE FROM quizzes;
DELETE FROM session;
DELETE FROM users;
DELETE FROM categories;
DELETE FROM levels;

-- --- LEVELS ---
INSERT INTO levels (name, sort_order) VALUES
  ('N4', 4),
  ('N3', 3);

-- --- CATEGORIES ---
INSERT INTO categories (name) VALUES
  ('Vocabulary'),
  ('Grammar'),
  ('Kanji'),
  ('Listening');

-- --- USERS ---
INSERT INTO users (id, username) VALUES
  ('u1', 'alice'),
  ('u2', 'bob'),
  ('u3', 'charlie'),
  ('u4', 'diana'),
  ('u5', 'eric'),
  ('u6', 'fiona'),
  ('u7', 'george'),
  ('u8', 'hannah'),
  ('u9', 'ian'),
  ('u10', 'julia');

-- --- QUIZZES ---
-- Note: category_id and level_id must match the auto IDs inserted above.
-- Assuming Vocabulary = 1, Grammar = 2, Kanji = 3, Listening = 4
-- Assuming N4 = 1, N3 = 2
INSERT INTO quizzes (id, title, category_id, level_id, description) VALUES
  ('q1', 'Basic vocab quiz', 1, 1, 'Practice common words'),
  ('q2', 'Grammar practice set', 2, 2, 'Test grammar knowledge'),
  ('q3', 'Kanji recognition test', 3, 1, 'Identify simple kanji'),
  ('q4', 'Listening comprehension drill', 4, 2, 'Short listening tasks'),
  ('q5', 'Mixed practice quiz', 1, 2, 'Mixed content');

-- --- QUESTIONS ---
INSERT INTO questions (id, quiz_id, prompt, order_index, explanation, translation, image, source_id) VALUES
  ('ques1', 'q1', 'What is the meaning of "inu"?', 0, 'Inu means dog', 'dog', NULL, 'N4-V-001'),
  ('ques2', 'q1', 'Choose the correct particle for "watashi __ gakusei desu".', 1, 'The correct particle is "wa"', 'I am a student', NULL, 'N4-G-001'),
  ('ques3', 'q1', 'Which kanji means "tree"?', 2, 'The kanji 木 means tree', 'tree', NULL, 'N4-K-001');

-- --- CHOICES ---
INSERT INTO choices (id, question_id, text, is_correct) VALUES
  ('ch1', 'ques1', 'dog', 1),
  ('ch2', 'ques1', 'cat', 0),
  ('ch3', 'ques1', 'bird', 0),
  ('ch4', 'ques1', 'fish', 0),

  ('ch5', 'ques2', 'wa', 1),
  ('ch6', 'ques2', 'ga', 0),
  ('ch7', 'ques2', 'no', 0),
  ('ch8', 'ques2', 'de', 0),

  ('ch9', 'ques3', '木', 1),
  ('ch10', 'ques3', '水', 0),
  ('ch11', 'ques3', '火', 0),
  ('ch12', 'ques3', '山', 0);

-- --- QUIZ ATTEMPTS ---
INSERT INTO quiz_attempts (id, user_id, quiz_id, score, correct_count, total_questions, completed_at) VALUES
  ('a1', 'u1', 'q1', 67, 2, 3, strftime('%s','now')),
  ('a2', 'u2', 'q1', 33, 1, 3, strftime('%s','now')),
  ('a3', 'u3', 'q2', 100, 3, 3, strftime('%s','now')),
  ('a4', 'u4', 'q3', 0, 0, 3, strftime('%s','now')),
  ('a5', 'u5', 'q4', 67, 2, 3, strftime('%s','now'));

-- --- SESSION ---
INSERT INTO session (id, user_id, expires_at, created_at) VALUES
  ('s1', 'u1', strftime('%s','now','+7 days'), strftime('%s','now')),
  ('s2', 'u2', strftime('%s','now','+7 days'), strftime('%s','now'));

-- Seed command
-- pnpm wrangler d1 execute DB --local --file=./scripts/seed-local.sql
