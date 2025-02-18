-- Seed data for stars
INSERT INTO stars (id, full_name, slug, profile_image_url, star_type, current_project, birth_date, birth_place, education, biography, is_featured, is_trending, is_rising, is_influential, filmography)
VALUES 
  (
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    'Burak Özçivit',
    'burak-ozcivit',
    '/img/actor/burak-ozcivit.jpg',
    'actor',
    'Kuruluş Osman',
    '1984-12-24',
    'Istanbul, Turkey',
    'Marmara University',
    'Burak Özçivit is a Turkish actor and model, best known for his roles in historical dramas.',
    true,
    true,
    false,
    true,
    '[{"title": "Kuruluş Osman", "role": "Osman Bey", "year": 2019, "streaming_on": "ATV"}, {"title": "Diriliş: Ertuğrul", "role": "Osman Bey", "year": 2018}]'::jsonb
  ),
  (
    'f47ac10b-58cc-4372-a567-0e02b2c3d480',
    'Çağatay Ulusoy',
    'cagatay-ulusoy',
    '/img/actor/cagatay-ulusoy.jpg',
    'actor',
    'Yalı Çapkını',
    '1990-09-23',
    'Istanbul, Turkey',
    'Istanbul University',
    'Çağatay Ulusoy is a Turkish actor and model who rose to prominence with his role in Medcezir.',
    true,
    true,
    true,
    true,
    '[{"title": "Yalı Çapkını", "role": "Ferit", "year": 2023}, {"title": "Medcezir", "role": "Yaman Koper", "year": 2013}]'::jsonb
  );

-- Insert social media links
INSERT INTO social_media (star_id, platform, url)
VALUES 
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'instagram', 'https://instagram.com/burakozcivit'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'twitter', 'https://twitter.com/burakozcivit'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d480', 'instagram', 'https://instagram.com/cagatayulusoy'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d480', 'twitter', 'https://twitter.com/cagatayulusoy'); 