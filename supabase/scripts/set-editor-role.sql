-- Definir role editorial no usuário develop@dev.com
-- Execute no SQL Editor do projeto fewyfqcldelamknckmcx (Portal da Loira)

UPDATE auth.users
SET raw_app_meta_data = jsonb_set(
  coalesce(raw_app_meta_data, '{}'::jsonb),
  '{role}',
  '"editor"'
)
WHERE email = 'develop@dev.com';

-- Conferir resultado (deve retornar {"role": "editor"})
SELECT email, raw_app_meta_data
FROM auth.users
WHERE email = 'develop@dev.com';
