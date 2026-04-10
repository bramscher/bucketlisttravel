-- ============================================================
-- Seed Data: World Destinations
-- ============================================================

insert into public.destinations (name, region, country, tagline, description, image_url, cost_level, safety_rating, return_potential, best_months, avg_daily_budget, ideal_stay_duration, highlights, vibes) values

-- ASIA PACIFIC
('Kyoto, Japan', 'Asia Pacific', 'Japan',
 'Where ancient temples meet cherry blossoms',
 'Wander through thousands of vermillion torii gates at Fushimi Inari, experience a traditional tea ceremony in a 400-year-old teahouse, and watch geishas glide through the lantern-lit streets of Gion at dusk.',
 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
 3, 5, 5, 'Mar–May, Oct–Nov', '$150–250', '10–14 days',
 '{"Fushimi Inari Shrine","Arashiyama Bamboo Grove","Traditional Ryokans","Kaiseki Dining"}',
 '{"Culture","Romance","Food"}'),

('Bali, Indonesia', 'Asia Pacific', 'Indonesia',
 'Spiritual island paradise of rice terraces and temples',
 'Wake up to misty rice terraces in Ubud, chase waterfalls through lush jungle, surf world-class breaks in Uluwatu, and end each day watching the sun melt into the Indian Ocean from a clifftop temple.',
 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
 2, 4, 5, 'Apr–Oct', '$80–150', '14–21 days',
 '{"Tegallalang Rice Terraces","Uluwatu Temple Sunset","Ubud Monkey Forest","Mount Batur Sunrise Trek"}',
 '{"Nature","Adventure","Romance"}'),

('Queenstown, New Zealand', 'Asia Pacific', 'New Zealand',
 'The adventure capital at the edge of the world',
 'Bungee jump where it all began, jet boat through narrow canyons, hike the Routeburn Track through primordial beech forest, and cruise Milford Sound past waterfalls cascading from mist-shrouded peaks.',
 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&q=80',
 4, 5, 5, 'Dec–Mar', '$180–300', '10–14 days',
 '{"Milford Sound Cruise","Routeburn Track","Bungee at Kawarau Bridge","Wanaka & Lake Views"}',
 '{"Adventure","Nature","Romance"}'),

-- THAILAND
('Chiang Mai, Thailand', 'Thailand', 'Thailand',
 'Golden temples, night markets, and mountain mist',
 'Explore over 300 glittering temples, haggle for handmade treasures at the Sunday Walking Street, take a Thai cooking class surrounded by lemongrass gardens, and trek to hill tribe villages in the misty mountains.',
 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&q=80',
 1, 4, 5, 'Nov–Mar', '$40–80', '7–14 days',
 '{"Doi Suthep Temple","Sunday Night Market","Thai Cooking Class","Elephant Nature Park"}',
 '{"Culture","Food","Adventure"}'),

('Krabi & Islands, Thailand', 'Thailand', 'Thailand',
 'Emerald waters framed by ancient limestone karsts',
 'Kayak through mangrove-draped lagoons, snorkel in crystal-clear water over coral gardens, rock climb the iconic limestone cliffs of Railay Beach, and island-hop to hidden coves only reachable by longtail boat.',
 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80',
 2, 4, 4, 'Nov–Apr', '$60–120', '7–10 days',
 '{"Railay Beach","Phi Phi Islands","Four Islands Tour","Tiger Cave Temple"}',
 '{"Adventure","Nature","Romance"}'),

-- PATAGONIA
('Torres del Paine, Chile', 'Patagonia', 'Chile',
 'Where granite towers pierce the Patagonian sky',
 'Trek the legendary W Circuit past glaciers that calve into turquoise lakes, watch guanacos graze beneath jagged granite spires, and fall asleep to howling wind in a mountain refugio under the southern stars.',
 'https://images.unsplash.com/photo-1531761535209-180857e963b9?w=800&q=80',
 4, 4, 3, 'Oct–Apr', '$180–300', '7–10 days',
 '{"W Trek Circuit","Grey Glacier","Base of the Towers Sunrise","Lago Pehoé Views"}',
 '{"Adventure","Nature"}'),

('El Chaltén, Argentina', 'Patagonia', 'Argentina',
 'Argentina''s trekking capital beneath Fitz Roy',
 'Hike through lenga forests painted autumn gold to witness the jagged silhouette of Mount Fitz Roy glowing pink at sunrise, then warm up with Malbec and wood-fired lamb in this tiny, charming mountain village.',
 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=800&q=80',
 3, 4, 3, 'Nov–Mar', '$120–200', '5–7 days',
 '{"Laguna de los Tres","Fitz Roy Sunrise","Viedma Glacier Trek","Patagonian Lamb Asado"}',
 '{"Adventure","Nature","Food"}'),

-- AFRICA
('Serengeti & Ngorongoro, Tanzania', 'Africa', 'Tanzania',
 'The greatest wildlife spectacle on Earth',
 'Witness two million wildebeest thunder across the plains during the Great Migration, lock eyes with a lion at dawn from your safari vehicle, and descend into the Ngorongoro Crater — a natural Eden teeming with life.',
 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80',
 4, 4, 4, 'Jun–Oct', '$250–500', '7–10 days',
 '{"Great Migration","Ngorongoro Crater","Big Five Safari","Masai Village Visit"}',
 '{"Adventure","Nature","Culture"}'),

('Cape Town, South Africa', 'Africa', 'South Africa',
 'Where mountains meet ocean and cultures collide',
 'Ride the cable car up Table Mountain for 360° views that steal your breath, drive the coast to the Cape of Good Hope, sip world-class wine in Stellenbosch, and explore the colorful Bo-Kaap neighborhood''s cobblestone streets.',
 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80',
 2, 3, 5, 'Oct–Apr', '$100–180', '10–14 days',
 '{"Table Mountain","Cape of Good Hope","Stellenbosch Wine Route","Bo-Kaap Neighborhood"}',
 '{"Culture","Nature","Food","Romance"}'),

('Marrakech, Morocco', 'Africa', 'Morocco',
 'A sensory labyrinth of spice, color, and starlight',
 'Get gloriously lost in the medina''s maze of souks overflowing with spices, leather, and lanterns. Sip mint tea on a riad rooftop as the call to prayer echoes at sunset, then escape to the Sahara for a night under infinite stars.',
 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&q=80',
 2, 3, 4, 'Mar–May, Sep–Nov', '$80–150', '5–7 days',
 '{"Jemaa el-Fnaa Square","Majorelle Garden","Sahara Desert Camp","Traditional Hammam"}',
 '{"Culture","Food","Romance"}');
