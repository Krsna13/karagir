-- Seed Script for Auth Users and Artisans
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Cleanup any previous mock attempts to allow clean re-runs
DELETE FROM public.artisans WHERE phone LIKE '9%';
DELETE FROM auth.users WHERE email LIKE '%@karagir.local';

DO $$
DECLARE
  new_user_id uuid;
BEGIN

  -- Artisan: Ramesh Sharma (9876543210)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9876543210@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Ramesh Sharma", "phone": "9876543210"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9876543210@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Ramesh Sharma', '9876543210', '123456', '', 
    ST_GeomFromText('POINT(73.7898 19.9975)', 4326), 'Saharanpur, UP', 'Woodworking'
  );

  -- Artisan: Prakash Suthar (9812345678)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9812345678@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Prakash Suthar", "phone": "9812345678"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9812345678@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Prakash Suthar', '9812345678', '123456', '', 
    ST_GeomFromText('POINT(73.7898 19.9975)', 4326), 'Jodhpur, RJ', 'Mandir Specialist'
  );

  -- Artisan: Vikram Jagtap (9988776655)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9988776655@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Vikram Jagtap", "phone": "9988776655"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9988776655@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Vikram Jagtap', '9988776655', '123456', '', 
    ST_GeomFromText('POINT(73.7898 19.9975)', 4326), 'Nashik, MH', 'Custom Joinery'
  );

  -- Artisan: Mahesh Shinde (9000001001)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9000001001@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Mahesh Shinde", "phone": "9000001001"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9000001001@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Mahesh Shinde', '9000001001', '123456', 'Shinde Wooden Crafts', 
    ST_GeomFromText('POINT(73.795 20.0088)', 4326), 'Near Ramkund, Panchavati, Nashik', 'Wood Carving'
  );

  -- Artisan: Sunita Jadhav (9000001002)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9000001002@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Sunita Jadhav", "phone": "9000001002"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9000001002@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Sunita Jadhav', '9000001002', '123456', 'Sunita Handloom Studio', 
    ST_GeomFromText('POINT(73.794 20.0092)', 4326), 'Kapaleshwar Lane, Panchavati, Nashik', 'Handloom & Textile'
  );

  -- Artisan: Ramesh Patil (9000001003)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9000001003@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Ramesh Patil", "phone": "9000001003"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9000001003@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Ramesh Patil', '9000001003', '123456', 'Godavari Brass Works', 
    ST_GeomFromText('POINT(73.792 20.0065)', 4326), 'Saraf Bazaar, Panchavati, Nashik', 'Brass Craft'
  );

  -- Artisan: Kavita More (9000001004)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9000001004@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Kavita More", "phone": "9000001004"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9000001004@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Kavita More', '9000001004', '123456', 'Kavita Warli Arts', 
    ST_GeomFromText('POINT(73.796 20.012)', 4326), 'Makhmalabad Road, Panchavati, Nashik', 'Tribal Painting'
  );

  -- Artisan: Nitin Wagh (9000001005)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9000001005@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Nitin Wagh", "phone": "9000001005"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9000001005@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Nitin Wagh', '9000001005', '123456', 'Wagh Furniture Art', 
    ST_GeomFromText('POINT(73.798 20.005)', 4326), 'Old Agra Road, Panchavati, Nashik', 'Wooden Furniture'
  );

  -- Artisan: Prakash Kulkarni (9000001101)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9000001101@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Prakash Kulkarni", "phone": "9000001101"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9000001101@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Prakash Kulkarni', '9000001101', '123456', 'Kulkarni Wood Studio', 
    ST_GeomFromText('POINT(73.7654 20.0152)', 4326), 'Gangapur Road, Nashik', 'Custom Furniture'
  );

  -- Artisan: Asha Borse (9000001102)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9000001102@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Asha Borse", "phone": "9000001102"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9000001102@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Asha Borse', '9000001102', '123456', 'Asha Textile Arts', 
    ST_GeomFromText('POINT(73.759 20.018)', 4326), 'Anandvali, Gangapur Road, Nashik', 'Embroidery'
  );

  -- Artisan: Suresh Gaikwad (9000001103)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9000001103@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Suresh Gaikwad", "phone": "9000001103"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9000001103@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Suresh Gaikwad', '9000001103', '123456', 'Gaikwad Stone Craft', 
    ST_GeomFromText('POINT(73.768 20.014)', 4326), 'Near Gangapur Road, Nashik', 'Stone Carving'
  );

  -- Artisan: Meena Chavan (9000001104)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9000001104@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Meena Chavan", "phone": "9000001104"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9000001104@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Meena Chavan', '9000001104', '123456', 'Meena Decor Works', 
    ST_GeomFromText('POINT(73.762 20.0165)', 4326), 'Shanker Nagar, Gangapur Road, Nashik', 'Home Decor'
  );

  -- Artisan: Rahul Pawar (9000001105)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9000001105@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Rahul Pawar", "phone": "9000001105"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9000001105@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Rahul Pawar', '9000001105', '123456', 'Pawar Metal Studio', 
    ST_GeomFromText('POINT(73.755 20.019)', 4326), 'Veer Savarkar Nagar, Nashik', 'Metal Craft'
  );

  -- Artisan: Ajay Deshmukh (9000001201)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9000001201@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Ajay Deshmukh", "phone": "9000001201"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9000001201@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Ajay Deshmukh', '9000001201', '123456', 'Deshmukh Furniture Works', 
    ST_GeomFromText('POINT(73.7745 19.9687)', 4326), 'Indira Nagar, Nashik', 'Furniture'
  );

  -- Artisan: Pooja Mahale (9000001202)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9000001202@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Pooja Mahale", "phone": "9000001202"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9000001202@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Pooja Mahale', '9000001202', '123456', 'Pooja Craft Corner', 
    ST_GeomFromText('POINT(73.772 19.971)', 4326), 'Rajiv Nagar, Indira Nagar, Nashik', 'Handmade Decor'
  );

  -- Artisan: Ganesh Sonawane (9000001203)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9000001203@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Ganesh Sonawane", "phone": "9000001203"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9000001203@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Ganesh Sonawane', '9000001203', '123456', 'Sonawane Wood Art', 
    ST_GeomFromText('POINT(73.778 19.966)', 4326), 'Wadala Road, Indira Nagar, Nashik', 'Wood Carving'
  );

  -- Artisan: Neha Nikam (9000001204)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9000001204@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Neha Nikam", "phone": "9000001204"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9000001204@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Neha Nikam', '9000001204', '123456', 'Neha Handicrafts', 
    ST_GeomFromText('POINT(73.77 19.973)', 4326), 'Lekha Nagar, Indira Nagar, Nashik', 'Textile Craft'
  );

  -- Artisan: Dinesh Bhalerao (9000001205)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9000001205@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Dinesh Bhalerao", "phone": "9000001205"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9000001205@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Dinesh Bhalerao', '9000001205', '123456', 'Bhalerao Metal Craft', 
    ST_GeomFromText('POINT(73.776 19.964)', 4326), 'Cidco Link Road, Indira Nagar, Nashik', 'Metalwork'
  );

  -- Artisan: Vijay Gaikwad (9000001301)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9000001301@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Vijay Gaikwad", "phone": "9000001301"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9000001301@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Vijay Gaikwad', '9000001301', '123456', 'Gaikwad Carpentry Studio', 
    ST_GeomFromText('POINT(73.738 19.995)', 4326), 'Satpur MIDC, Nashik', 'Carpentry'
  );

  -- Artisan: Rekha Shinde (9000001302)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9000001302@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Rekha Shinde", "phone": "9000001302"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9000001302@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Rekha Shinde', '9000001302', '123456', 'Rekha Handmade Studio', 
    ST_GeomFromText('POINT(73.741 19.997)', 4326), 'Satpur Colony, Nashik', 'Handmade Crafts'
  );

  -- Artisan: Santosh Jagtap (9000001303)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9000001303@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Santosh Jagtap", "phone": "9000001303"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9000001303@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Santosh Jagtap', '9000001303', '123456', 'Jagtap Furniture House', 
    ST_GeomFromText('POINT(73.735 19.993)', 4326), 'Trimbak Road, Satpur, Nashik', 'Furniture'
  );

  -- Artisan: Manisha Pawar (9000001304)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9000001304@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Manisha Pawar", "phone": "9000001304"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9000001304@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Manisha Pawar', '9000001304', '123456', 'Pawar Textile Arts', 
    ST_GeomFromText('POINT(73.745 19.998)', 4326), 'Mahatma Nagar Link Road, Satpur, Nashik', 'Textile & Embroidery'
  );

  -- Artisan: Kiran Borse (9000001305)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9000001305@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Kiran Borse", "phone": "9000001305"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9000001305@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Kiran Borse', '9000001305', '123456', 'Borse Wood & Decor', 
    ST_GeomFromText('POINT(73.732 19.991)', 4326), 'Ambad Link Road, Satpur, Nashik', 'Wood Craft'
  );

  -- Artisan: Bharat Thakur (9000001401)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9000001401@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Bharat Thakur", "phone": "9000001401"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9000001401@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Bharat Thakur', '9000001401', '123456', 'Thakur Furniture Works', 
    ST_GeomFromText('POINT(73.834 19.9535)', 4326), 'Anand Nagar, Nashik Road', 'Furniture'
  );

  -- Artisan: Lata Pawar (9000001402)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9000001402@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Lata Pawar", "phone": "9000001402"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9000001402@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Lata Pawar', '9000001402', '123456', 'Lata Craft House', 
    ST_GeomFromText('POINT(73.837 19.956)', 4326), 'Bytco Point, Nashik Road', 'Decorative Crafts'
  );

  -- Artisan: Mohan Shinde (9000001403)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9000001403@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Mohan Shinde", "phone": "9000001403"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9000001403@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Mohan Shinde', '9000001403', '123456', 'Shinde Metal Arts', 
    ST_GeomFromText('POINT(73.831 19.951)', 4326), 'Jail Road, Nashik Road', 'Metal Craft'
  );

  -- Artisan: Archana Wagh (9000001404)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9000001404@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Archana Wagh", "phone": "9000001404"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9000001404@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Archana Wagh', '9000001404', '123456', 'Archana Handloom', 
    ST_GeomFromText('POINT(73.839 19.958)', 4326), 'Upnagar, Nashik Road', 'Handloom'
  );

  -- Artisan: Rohan Jadhav (9000001405)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9000001405@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Rohan Jadhav", "phone": "9000001405"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9000001405@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Rohan Jadhav', '9000001405', '123456', 'Jadhav Wood Studio', 
    ST_GeomFromText('POINT(73.828 19.949)', 4326), 'Deolali Road, Nashik Road', 'Wood Carving'
  );

  -- Artisan: Amol Joshi (9100001001)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9100001001@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Amol Joshi", "phone": "9100001001"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9100001001@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Amol Joshi', '9100001001', '123456', 'Joshi Furniture Studio', 
    ST_GeomFromText('POINT(73.8077 18.5074)', 4326), 'Paud Road, Kothrud, Pune', 'Custom Furniture'
  );

  -- Artisan: Madhuri Kulkarni (9100001002)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9100001002@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Madhuri Kulkarni", "phone": "9100001002"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9100001002@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Madhuri Kulkarni', '9100001002', '123456', 'Madhuri Craft House', 
    ST_GeomFromText('POINT(73.812 18.505)', 4326), 'Karve Road, Kothrud, Pune', 'Textile Craft'
  );

  -- Artisan: Sachin Bhosale (9100001003)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9100001003@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Sachin Bhosale", "phone": "9100001003"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9100001003@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Sachin Bhosale', '9100001003', '123456', 'Bhosale Wood Works', 
    ST_GeomFromText('POINT(73.804 18.509)', 4326), 'Ideal Colony, Kothrud, Pune', 'Wood Carving'
  );

  -- Artisan: Priya Patil (9100001004)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9100001004@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Priya Patil", "phone": "9100001004"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9100001004@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Priya Patil', '9100001004', '123456', 'Priya Handmade Arts', 
    ST_GeomFromText('POINT(73.809 18.506)', 4326), 'Mayur Colony, Kothrud, Pune', 'Handmade Decor'
  );

  -- Artisan: Nilesh More (9100001005)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9100001005@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Nilesh More", "phone": "9100001005"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9100001005@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Nilesh More', '9100001005', '123456', 'More Metal Studio', 
    ST_GeomFromText('POINT(73.801 18.503)', 4326), 'Kothrud Depot Road, Pune', 'Metal Craft'
  );

  -- Artisan: Rohit Pawar (9100001101)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9100001101@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Rohit Pawar", "phone": "9100001101"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9100001101@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Rohit Pawar', '9100001101', '123456', 'Pawar Modern Furniture', 
    ST_GeomFromText('POINT(73.7868 18.559)', 4326), 'Baner Road, Pune', 'Furniture'
  );

  -- Artisan: Sneha Deshmukh (9100001102)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9100001102@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Sneha Deshmukh", "phone": "9100001102"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9100001102@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Sneha Deshmukh', '9100001102', '123456', 'Sneha Craft Studio', 
    ST_GeomFromText('POINT(73.789 18.556)', 4326), 'Pashan Link Road, Baner, Pune', 'Handmade Decor'
  );

  -- Artisan: Vikram Jadhav (9100001103)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9100001103@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Vikram Jadhav", "phone": "9100001103"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9100001103@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Vikram Jadhav', '9100001103', '123456', 'Jadhav Wood & Stone', 
    ST_GeomFromText('POINT(73.781 18.562)', 4326), 'Balewadi High Street, Pune', 'Wood & Stone Craft'
  );

  -- Artisan: Rutuja Shinde (9100001104)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9100001104@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Rutuja Shinde", "phone": "9100001104"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9100001104@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Rutuja Shinde', '9100001104', '123456', 'Rutuja Textile Arts', 
    ST_GeomFromText('POINT(73.784 18.5575)', 4326), 'Baner Gaon, Pune', 'Embroidery'
  );

  -- Artisan: Akash Chavan (9100001105)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9100001105@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Akash Chavan", "phone": "9100001105"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9100001105@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Akash Chavan', '9100001105', '123456', 'Chavan Metal Works', 
    ST_GeomFromText('POINT(73.788 18.564)', 4326), 'Pan Card Club Road, Baner, Pune', 'Metal Craft'
  );

  -- Artisan: Mahendra Pawar (9100001201)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9100001201@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Mahendra Pawar", "phone": "9100001201"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9100001201@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Mahendra Pawar', '9100001201', '123456', 'Pawar Furniture House', 
    ST_GeomFromText('POINT(73.926 18.5089)', 4326), 'Hadapsar Main Road, Pune', 'Furniture'
  );

  -- Artisan: Vaishali More (9100001202)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9100001202@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Vaishali More", "phone": "9100001202"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9100001202@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Vaishali More', '9100001202', '123456', 'Vaishali Handicrafts', 
    ST_GeomFromText('POINT(73.929 18.512)', 4326), 'Magarpatta Road, Hadapsar, Pune', 'Handmade Craft'
  );

  -- Artisan: Sandeep Shinde (9100001203)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9100001203@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Sandeep Shinde", "phone": "9100001203"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9100001203@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Sandeep Shinde', '9100001203', '123456', 'Shinde Wood Art', 
    ST_GeomFromText('POINT(73.923 18.506)', 4326), 'Gadital, Hadapsar, Pune', 'Wood Craft'
  );

  -- Artisan: Komal Jagtap (9100001204)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9100001204@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Komal Jagtap", "phone": "9100001204"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9100001204@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Komal Jagtap', '9100001204', '123456', 'Komal Decor Studio', 
    ST_GeomFromText('POINT(73.933 18.514)', 4326), 'Amanora Road, Hadapsar, Pune', 'Home Decor'
  );

  -- Artisan: Pravin Borse (9100001205)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9100001205@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Pravin Borse", "phone": "9100001205"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9100001205@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Pravin Borse', '9100001205', '123456', 'Borse Metal Craft', 
    ST_GeomFromText('POINT(73.937 18.517)', 4326), 'Kharadi-Hadapsar Road, Pune', 'Metalwork'
  );

  -- Artisan: Sameer Mehta (9100001301)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9100001301@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Sameer Mehta", "phone": "9100001301"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9100001301@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Sameer Mehta', '9100001301', '123456', 'Mehta Artisan Studio', 
    ST_GeomFromText('POINT(73.894 18.5362)', 4326), 'North Main Road, Koregaon Park, Pune', 'Luxury Furniture'
  );

  -- Artisan: Anjali Shah (9100001302)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9100001302@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Anjali Shah", "phone": "9100001302"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9100001302@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Anjali Shah', '9100001302', '123456', 'Anjali Textile Arts', 
    ST_GeomFromText('POINT(73.897 18.538)', 4326), 'Lane 5, Koregaon Park, Pune', 'Textile & Embroidery'
  );

  -- Artisan: Rajesh Agarwal (9100001303)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9100001303@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Rajesh Agarwal", "phone": "9100001303"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9100001303@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Rajesh Agarwal', '9100001303', '123456', 'Agarwal Wood Gallery', 
    ST_GeomFromText('POINT(73.891 18.534)', 4326), 'Lane 7, Koregaon Park, Pune', 'Wood Craft'
  );

  -- Artisan: Nandini Joshi (9100001304)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9100001304@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Nandini Joshi", "phone": "9100001304"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9100001304@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Nandini Joshi', '9100001304', '123456', 'Nandini Handmade Studio', 
    ST_GeomFromText('POINT(73.899 18.539)', 4326), 'South Main Road, Koregaon Park, Pune', 'Decorative Art'
  );

  -- Artisan: Harsh Kulkarni (9100001305)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9100001305@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Harsh Kulkarni", "phone": "9100001305"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9100001305@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Harsh Kulkarni', '9100001305', '123456', 'Kulkarni Brass Works', 
    ST_GeomFromText('POINT(73.893 18.5355)', 4326), 'Lane 3, Koregaon Park, Pune', 'Brass Craft'
  );

  -- Artisan: Deepak Naik (9100001401)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9100001401@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Deepak Naik", "phone": "9100001401"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9100001401@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Deepak Naik', '9100001401', '123456', 'Naik Furniture Works', 
    ST_GeomFromText('POINT(73.8785 18.5135)', 4326), 'Camp, Pune', 'Furniture'
  );

  -- Artisan: Sunil Patil (9100001402)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9100001402@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Sunil Patil", "phone": "9100001402"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9100001402@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Sunil Patil', '9100001402', '123456', 'Patil Wood Studio', 
    ST_GeomFromText('POINT(73.881 18.515)', 4326), 'East Street, Camp, Pune', 'Wood Carving'
  );

  -- Artisan: Alka Joshi (9100001403)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9100001403@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Alka Joshi", "phone": "9100001403"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9100001403@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Alka Joshi', '9100001403', '123456', 'Alka Handicrafts', 
    ST_GeomFromText('POINT(73.876 18.5115)', 4326), 'MG Road, Camp, Pune', 'Handmade Crafts'
  );

  -- Artisan: Manoj Bhosale (9100001404)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9100001404@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Manoj Bhosale", "phone": "9100001404"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9100001404@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Manoj Bhosale', '9100001404', '123456', 'Bhosale Metal Arts', 
    ST_GeomFromText('POINT(73.884 18.5165)', 4326), 'Moledina Road, Camp, Pune', 'Metal Craft'
  );

  -- Artisan: Shweta More (9100001405)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9100001405@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Shweta More", "phone": "9100001405"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9100001405@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Shweta More', '9100001405', '123456', 'Shweta Textile Studio', 
    ST_GeomFromText('POINT(73.873 18.51)', 4326), 'Clover Centre Area, Camp, Pune', 'Textile Art'
  );

  -- Artisan: Arjun Naik (9200001001)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9200001001@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Arjun Naik", "phone": "9200001001"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9200001001@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Arjun Naik', '9200001001', '123456', 'Naik Furniture Studio', 
    ST_GeomFromText('POINT(72.8295 19.0596)', 4326), 'Hill Road, Bandra West, Mumbai', 'Furniture'
  );

  -- Artisan: Kavita Rao (9200001002)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9200001002@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Kavita Rao", "phone": "9200001002"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9200001002@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Kavita Rao', '9200001002', '123456', 'Kavita Craft House', 
    ST_GeomFromText('POINT(72.827 19.063)', 4326), 'Pali Hill, Bandra, Mumbai', 'Textile Craft'
  );

  -- Artisan: Rajendra Patil (9200001003)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9200001003@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Rajendra Patil", "phone": "9200001003"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9200001003@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Rajendra Patil', '9200001003', '123456', 'Patil Wood Arts', 
    ST_GeomFromText('POINT(72.833 19.057)', 4326), 'Linking Road, Bandra, Mumbai', 'Wood Carving'
  );

  -- Artisan: Snehal Joshi (9200001004)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9200001004@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Snehal Joshi", "phone": "9200001004"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9200001004@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Snehal Joshi', '9200001004', '123456', 'Snehal Handmade Studio', 
    ST_GeomFromText('POINT(72.822 19.052)', 4326), 'Bandra Reclamation, Mumbai', 'Handmade Decor'
  );

  -- Artisan: Manish More (9200001005)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9200001005@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Manish More", "phone": "9200001005"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9200001005@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Manish More', '9200001005', '123456', 'More Metal Works', 
    ST_GeomFromText('POINT(72.837 19.068)', 4326), 'Khar Road, Mumbai', 'Metal Craft'
  );

  -- Artisan: Ramesh Yadav (9200001101)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9200001101@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Ramesh Yadav", "phone": "9200001101"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9200001101@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Ramesh Yadav', '9200001101', '123456', 'Yadav Furniture Works', 
    ST_GeomFromText('POINT(72.8697 19.1136)', 4326), 'Andheri West, Mumbai', 'Furniture'
  );

  -- Artisan: Priti Sharma (9200001102)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9200001102@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Priti Sharma", "phone": "9200001102"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9200001102@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Priti Sharma', '9200001102', '123456', 'Priti Handicraft Studio', 
    ST_GeomFromText('POINT(72.826 19.135)', 4326), 'Lokhandwala, Andheri, Mumbai', 'Handmade Crafts'
  );

  -- Artisan: Ashok Jadhav (9200001103)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9200001103@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Ashok Jadhav", "phone": "9200001103"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9200001103@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Ashok Jadhav', '9200001103', '123456', 'Jadhav Wood Works', 
    ST_GeomFromText('POINT(72.875 19.118)', 4326), 'MIDC Andheri, Mumbai', 'Wood Craft'
  );

  -- Artisan: Neelam Verma (9200001104)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9200001104@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Neelam Verma", "phone": "9200001104"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9200001104@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Neelam Verma', '9200001104', '123456', 'Neelam Textile Arts', 
    ST_GeomFromText('POINT(72.823 19.128)', 4326), 'Four Bungalows, Andheri, Mumbai', 'Embroidery'
  );

  -- Artisan: Sameer Khan (9200001105)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9200001105@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Sameer Khan", "phone": "9200001105"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9200001105@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Sameer Khan', '9200001105', '123456', 'Khan Metal Studio', 
    ST_GeomFromText('POINT(72.888 19.108)', 4326), 'Saki Naka, Andheri, Mumbai', 'Metal Craft'
  );

  -- Artisan: Mahesh Sawant (9200001201)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9200001201@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Mahesh Sawant", "phone": "9200001201"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9200001201@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Mahesh Sawant', '9200001201', '123456', 'Sawant Wood Studio', 
    ST_GeomFromText('POINT(72.8478 19.0178)', 4326), 'Dadar West, Mumbai', 'Wood Carving'
  );

  -- Artisan: Aarti Deshpande (9200001202)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9200001202@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Aarti Deshpande", "phone": "9200001202"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9200001202@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Aarti Deshpande', '9200001202', '123456', 'Aarti Handicrafts', 
    ST_GeomFromText('POINT(72.839 19.025)', 4326), 'Shivaji Park, Dadar, Mumbai', 'Handmade Decor'
  );

  -- Artisan: Prakash More (9200001203)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9200001203@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Prakash More", "phone": "9200001203"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9200001203@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Prakash More', '9200001203', '123456', 'More Furniture House', 
    ST_GeomFromText('POINT(72.852 19.019)', 4326), 'Dadar TT Circle, Mumbai', 'Furniture'
  );

  -- Artisan: Sunita Patil (9200001204)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9200001204@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Sunita Patil", "phone": "9200001204"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9200001204@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Sunita Patil', '9200001204', '123456', 'Sunita Textile Arts', 
    ST_GeomFromText('POINT(72.851 19.021)', 4326), 'Hindu Colony, Dadar, Mumbai', 'Textile Craft'
  );

  -- Artisan: Ganesh Shinde (9200001205)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9200001205@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Ganesh Shinde", "phone": "9200001205"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9200001205@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Ganesh Shinde', '9200001205', '123456', 'Shinde Brass Works', 
    ST_GeomFromText('POINT(72.845 19.016)', 4326), 'Dadar East, Mumbai', 'Brass Craft'
  );

  -- Artisan: Rakesh Mehta (9200001301)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9200001301@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Rakesh Mehta", "phone": "9200001301"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9200001301@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Rakesh Mehta', '9200001301', '123456', 'Mehta Artisan Gallery', 
    ST_GeomFromText('POINT(72.8147 18.9067)', 4326), 'Colaba Causeway, Mumbai', 'Luxury Furniture'
  );

  -- Artisan: Farida Shaikh (9200001302)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9200001302@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Farida Shaikh", "phone": "9200001302"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9200001302@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Farida Shaikh', '9200001302', '123456', 'Farida Craft Studio', 
    ST_GeomFromText('POINT(72.817 18.909)', 4326), 'Shahid Bhagat Singh Road, Colaba', 'Textile Art'
  );

  -- Artisan: Vijay Shah (9200001303)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9200001303@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Vijay Shah", "phone": "9200001303"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9200001303@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Vijay Shah', '9200001303', '123456', 'Shah Wood & Decor', 
    ST_GeomFromText('POINT(72.821 18.913)', 4326), 'Fort-Colaba Area, Mumbai', 'Wood Craft'
  );

  -- Artisan: Nisha Kapoor (9200001304)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9200001304@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Nisha Kapoor", "phone": "9200001304"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9200001304@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Nisha Kapoor', '9200001304', '123456', 'Nisha Handmade Arts', 
    ST_GeomFromText('POINT(72.812 18.904)', 4326), 'Strand Road, Colaba, Mumbai', 'Decorative Craft'
  );

  -- Artisan: Rajiv Desai (9200001305)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9200001305@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Rajiv Desai", "phone": "9200001305"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9200001305@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Rajiv Desai', '9200001305', '123456', 'Desai Metal Studio', 
    ST_GeomFromText('POINT(72.809 18.898)', 4326), 'Navy Nagar, Colaba, Mumbai', 'Metal Craft'
  );

  -- Artisan: Suresh Pawar (9200001401)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9200001401@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Suresh Pawar", "phone": "9200001401"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9200001401@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Suresh Pawar', '9200001401', '123456', 'Pawar Furniture Studio', 
    ST_GeomFromText('POINT(72.906 19.1176)', 4326), 'Hiranandani Gardens, Powai', 'Furniture'
  );

  -- Artisan: Meena Joshi (9200001402)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9200001402@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Meena Joshi", "phone": "9200001402"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9200001402@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Meena Joshi', '9200001402', '123456', 'Meena Craft Works', 
    ST_GeomFromText('POINT(72.898 19.111)', 4326), 'Chandivali, Powai, Mumbai', 'Handmade Crafts'
  );

  -- Artisan: Karan Bhosale (9200001403)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9200001403@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Karan Bhosale", "phone": "9200001403"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9200001403@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Karan Bhosale', '9200001403', '123456', 'Bhosale Wood Arts', 
    ST_GeomFromText('POINT(72.912 19.124)', 4326), 'IIT Market Area, Powai', 'Wood Carving'
  );

  -- Artisan: Radhika More (9200001404)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9200001404@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Radhika More", "phone": "9200001404"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9200001404@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Radhika More', '9200001404', '123456', 'Radhika Textile Studio', 
    ST_GeomFromText('POINT(72.901 19.121)', 4326), 'Powai Lake Road, Mumbai', 'Textile Craft'
  );

  -- Artisan: Dhananjay Patil (9200001405)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    '9200001405@karagir.local', crypt('123456', gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Dhananjay Patil", "phone": "9200001405"}',
    now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, '9200001405@karagir.local')::jsonb, 'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.artisans (
    id, name, phone, password_hash, shop_name, location, address, category
  ) VALUES (
    new_user_id, 'Dhananjay Patil', '9200001405', '123456', 'Patil Metal & Brass', 
    ST_GeomFromText('POINT(72.891 19.114)', 4326), 'Saki Vihar Road, Powai', 'Brass & Metal Craft'
  );

END $$;
