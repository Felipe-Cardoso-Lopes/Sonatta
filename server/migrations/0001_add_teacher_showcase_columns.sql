-- Adiciona as colunas da "vitrine" do professor na tabela users.
-- O código (getPublicProfile, getUserProfile, updateUserProfile) já assume
-- a existência dessas colunas, mas a migração nunca foi aplicada no banco.
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS specialty TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS youtube_intro_url TEXT,
  ADD COLUMN IF NOT EXISTS spotify_artist_url TEXT,
  ADD COLUMN IF NOT EXISTS offers_trial_lesson BOOLEAN NOT NULL DEFAULT false;
