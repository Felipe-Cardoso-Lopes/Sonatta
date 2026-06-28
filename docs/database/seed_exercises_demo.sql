-- docs/database/seed_exercises_demo.sql
-- Script de demonstração para a Feature 32
-- INSTRUÇÃO IMPORTANTE: Troque o valor '1' abaixo pelo ID do curso (course_id) 
-- que você está testando no seu ambiente local (tabela courses).

DO $$ 
DECLARE
    -- Mude aqui o ID do curso para o qual deseja inserir os exercícios
    TARGET_COURSE_ID INTEGER := 1; 
BEGIN
    INSERT INTO exercises (course_id, title, type, description, order_index)
    VALUES 
        (TARGET_COURSE_ID, 'Reconhecimento do Instrumento', 'Teoria', 'Descreva em poucas palavras quais são as 3 partes principais do seu instrumento.', 1),
        (TARGET_COURSE_ID, 'Escala Maior - Exercício de Digitação', 'Técnica', 'Descreva como você posicionou seus dedos para tocar a primeira escala maior ensinada na aula. Sentiu alguma dificuldade?', 2),
        (TARGET_COURSE_ID, 'Primeira Melodia - "Parabéns pra Você"', 'Prática', 'Tente tocar a melodia inicial da música ensinada e escreva aqui quantas tentativas foram necessárias até você se sentir confortável.', 3);
END $$;
