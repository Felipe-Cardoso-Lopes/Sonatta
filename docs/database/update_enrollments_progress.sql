-- 0002_update_enrollments_progress.sql
-- Validação e garantia de que o campo progress existe na tabela enrollments,
-- com tipo numérico adequado, valor padrão 0 e limitado entre 0 e 100.

-- 1. Garante que a coluna existe e tem o tipo correto com DEFAULT 0
ALTER TABLE enrollments 
ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0;

-- Garante o DEFAULT 0 caso a coluna já existisse sem ele
ALTER TABLE enrollments 
ALTER COLUMN progress SET DEFAULT 0;

-- 2. Adiciona constraint para limitar o valor entre 0 e 100
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'chk_enrollments_progress_range'
        AND table_name = 'enrollments'
    ) THEN
        ALTER TABLE enrollments
        ADD CONSTRAINT chk_enrollments_progress_range CHECK (progress >= 0 AND progress <= 100);
    END IF;
END $$;