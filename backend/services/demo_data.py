"""
Rich, realistic demo datasets for when GEMINI_API_KEY is not configured or offline.
Every response is clearly marked with `is_demo: True` and informative labeling.
"""

from typing import Dict, Any, List

DEMO_FOOD_SAMPLES: List[Dict[str, Any]] = [
    {
        "food_name": "Mediterranean Salmon & Quinoa Superbowl",
        "category": "High Protein & Healthy Fats",
        "detected_items": [
            {
                "name": "Pan-seared Atlantic Salmon fillet",
                "portion": "150g fillet",
                "calories_kcal": 310.0,
                "protein_g": 34.0,
                "carbs_g": 0.0,
                "fat_g": 18.0,
                "fiber_g": 0.0
            },
            {
                "name": "Steamed Tricolor Quinoa",
                "portion": "1/2 cup cooked (95g)",
                "calories_kcal": 115.0,
                "protein_g": 4.2,
                "carbs_g": 20.0,
                "fat_g": 1.8,
                "fiber_g": 2.6
            },
            {
                "name": "Sliced Hass Avocado",
                "portion": "1/4 medium avocado (50g)",
                "calories_kcal": 80.0,
                "protein_g": 1.0,
                "carbs_g": 4.3,
                "fat_g": 7.3,
                "fiber_g": 3.4
            },
            {
                "name": "Baby Spinach & Cherry Tomatoes",
                "portion": "1 cup mixed fresh (80g)",
                "calories_kcal": 25.0,
                "protein_g": 1.5,
                "carbs_g": 5.0,
                "fat_g": 0.3,
                "fiber_g": 1.8
            },
            {
                "name": "Lemon Extra Virgin Olive Oil Drizzle",
                "portion": "1 tsp (5ml)",
                "calories_kcal": 40.0,
                "protein_g": 0.0,
                "carbs_g": 0.0,
                "fat_g": 4.5,
                "fiber_g": 0.0
            }
        ],
        "nutrition_summary": {
            "total_calories_kcal": 570.0,
            "total_protein_g": 40.7,
            "total_carbs_g": 29.3,
            "total_fat_g": 31.6,
            "total_fiber_g": 7.8
        },
        "portion_size": "1 single-serving bowl (approx. 380g total)",
        "confidence_score": 0.94,
        "confidence_note": "Demo profile: High visual clarity with distinct component boundaries.",
        "explanation": "Detected pan-seared salmon served over fluffy tri-color quinoa, accompanied by sliced avocado, fresh halved cherry tomatoes, and dressed greens. Rich in omega-3 fatty acids and complete plant/marine proteins.",
        "dietary_tags": ["High Protein", "Gluten-Free", "Pescatarian", "Omega-3 Rich"]
    },
    {
        "food_name": "Artisan Sourdough Avocado Toast with Poached Egg",
        "category": "Breakfast & Brunch",
        "detected_items": [
            {
                "name": "Toasted Artisan Sourdough slice",
                "portion": "1 thick slice (60g)",
                "calories_kcal": 150.0,
                "protein_g": 5.0,
                "carbs_g": 28.0,
                "fat_g": 1.0,
                "fiber_g": 1.5
            },
            {
                "name": "Mashed Hass Avocado with Lemon",
                "portion": "1/2 avocado (80g)",
                "calories_kcal": 130.0,
                "protein_g": 1.6,
                "carbs_g": 7.0,
                "fat_g": 11.5,
                "fiber_g": 5.5
            },
            {
                "name": "Soft-Poached Farm Egg",
                "portion": "1 large egg (50g)",
                "calories_kcal": 72.0,
                "protein_g": 6.3,
                "carbs_g": 0.4,
                "fat_g": 5.0,
                "fiber_g": 0.0
            },
            {
                "name": "Everything Bagel Seasoning & Chili Flakes",
                "portion": "1/2 tsp",
                "calories_kcal": 10.0,
                "protein_g": 0.3,
                "carbs_g": 0.8,
                "fat_g": 0.5,
                "fiber_g": 0.2
            }
        ],
        "nutrition_summary": {
            "total_calories_kcal": 362.0,
            "total_protein_g": 13.2,
            "total_carbs_g": 36.2,
            "total_fat_g": 18.0,
            "total_fiber_g": 7.2
        },
        "portion_size": "1 loaded open-faced toast slice (approx. 190g)",
        "confidence_score": 0.91,
        "confidence_note": "Demo profile: Clear egg yolk consistency and textured avocado spread.",
        "explanation": "Toasted sourdough bread topped with coarsely crushed seasoned avocado and a runny poached egg, garnished with micro herbs and chili seed flakes.",
        "dietary_tags": ["Vegetarian", "Whole Food", "Heart Healthy"]
    },
    {
        "food_name": "Creamy Chickpea & Spinach Coconut Curry",
        "category": "Vegan & Plant Protein",
        "detected_items": [
            {
                "name": "Simmered Garbanzo Beans (Chickpeas)",
                "portion": "3/4 cup cooked (120g)",
                "calories_kcal": 200.0,
                "protein_g": 10.5,
                "carbs_g": 34.0,
                "fat_g": 3.0,
                "fiber_g": 9.5
            },
            {
                "name": "Light Coconut Cream Sauce & Spices",
                "portion": "1/3 cup sauce (75ml)",
                "calories_kcal": 120.0,
                "protein_g": 1.2,
                "carbs_g": 3.5,
                "fat_g": 11.0,
                "fiber_g": 0.5
            },
            {
                "name": "Wilted Baby Spinach & Tomatoes",
                "portion": "1/2 cup (60g)",
                "calories_kcal": 25.0,
                "protein_g": 1.8,
                "carbs_g": 4.0,
                "fat_g": 0.2,
                "fiber_g": 1.6
            },
            {
                "name": "Steamed Aromatic Basmati Rice",
                "portion": "3/4 cup cooked (115g)",
                "calories_kcal": 160.0,
                "protein_g": 3.3,
                "carbs_g": 36.0,
                "fat_g": 0.4,
                "fiber_g": 0.6
            }
        ],
        "nutrition_summary": {
            "total_calories_kcal": 505.0,
            "total_protein_g": 16.8,
            "total_carbs_g": 77.5,
            "total_fat_g": 14.6,
            "total_fiber_g": 12.2
        },
        "portion_size": "1 plated curry bowl with basmati side (approx. 370g)",
        "confidence_score": 0.89,
        "confidence_note": "Demo profile: Distinct chickpea legume morphology and simmered aromatic curry base.",
        "explanation": "Nutrient-dense vegan curry packed with fiber-rich chickpeas, tender wilted spinach, and warm turmeric ginger aromatics, served with long-grain basmati.",
        "dietary_tags": ["Vegan", "Dairy-Free", "Plant Protein", "High Fiber"]
    }
]

DEMO_FRESHNESS_SAMPLES: List[Dict[str, Any]] = [
    {
        "item_name": "Fresh Organic Strawberries",
        "freshness_status": "Fresh",
        "confidence_level": "High",
        "visual_indicators": [
            "Bright, uniform ruby red coloration across all outer surfaces",
            "Turgid calyx (green leafy tops) with vivid chlorophyll color and no wilting",
            "Firm seed indentations with no weeping moisture or soft spots",
            "No mycelial fuzz or mold colonies visible in crevices"
        ],
        "safety_guidance": "Appears safe and optimal for immediate consumption or fresh preparation. Wash gently right before eating to prevent early softening.",
        "recommendations": [
            "Keep unwashed in the refrigerator until ready to consume.",
            "Store with a dry paper towel in a breathable container at 1-3°C.",
            "Consume within 3 to 5 days for peak antioxidant and vitamin C potency."
        ],
        "storage_tip": "Do not remove the green stems before storing; keep them intact to preserve internal fruit moisture."
    },
    {
        "item_name": "Ripe Cavendish Bananas",
        "freshness_status": "Moderately Fresh",
        "confidence_level": "High",
        "visual_indicators": [
            "Deep yellow peel with scattered sugar spots (brown speckling)",
            "Stem is turning brown but remains attached and structurally intact",
            "Skin is slightly thinner indicating advanced starch-to-sugar conversion",
            "No liquid leakage or gray rot at the blossom end"
        ],
        "safety_guidance": "Completely safe to consume. Highly sweetened due to natural ripening enzymes. Excellent for smoothies, oatmeal, or baking.",
        "recommendations": [
            "Ideal for banana bread, pancake batter, or freezing for smoothie cubes.",
            "If delaying consumption, peel and freeze in airtight silicone bags.",
            "Consume within 24 to 48 hours before over-softening occurs."
        ],
        "storage_tip": "Wrap the crown stems in foil or separate bananas from bunches to slow down ethylene gas emission."
    },
    {
        "item_name": "Store-bought Sliced Bell Pepper / Produce",
        "freshness_status": "Possibly Spoiled",
        "confidence_level": "Moderate",
        "visual_indicators": [
            "Visible skin wrinkling, dulling of epidermis, and soft collapsing areas",
            "Slight translucent water-soaking spots near sliced edges",
            "Loss of crisp cellular turgor; potential slimy surface film forming",
            "Dark discoloration creeping along internal seed cavity"
        ],
        "safety_guidance": "DO NOT CONSUME raw. Soft rot bacteria and mold hyphae often penetrate deeper than visible on the exterior. Discard to prevent foodborne illness.",
        "recommendations": [
            "Dispose of safely in compost or household waste.",
            "Sanitize any cutting boards or prep surfaces that touched this item.",
            "Inspect neighboring produce in the same crisper drawer for cross-contamination."
        ],
        "storage_tip": "Vegetables with high moisture content should be wrapped in vented produce bags to balance humidity."
    }
]

DEMO_HYGIENE_SAMPLES: List[Dict[str, Any]] = [
    {
        "media_type": "image",
        "overall_hygiene_score": "Good",
        "gloves_observed": "Food-grade disposable gloves visible on active food handler",
        "hair_covering_observed": "Fitted hair net / chef cap clearly observable",
        "surface_cleanliness": "Stainless steel prep table appears sanitized and free of standing debris",
        "cross_contamination_risk": "Low visible risk: Raw and cooked food prep areas appear segregated",
        "observations": [
            "Preparation staff wearing clean aprons and protective headwear.",
            "Color-coded prep cutting surface in use with sanitized edge boundaries.",
            "No personal belongings, open beverage cups, or phones on the direct prep line."
        ],
        "concerns": [
            "Ensure glove changes occur strictly between touching raw proteins and ready-to-eat garnishes."
        ],
        "improvements": [
            "Maintain sanitation logbook nearby with recorded sanitizer bucket PPM concentration checks.",
            "Keep clean sanitizing wipe towels in designated sanitizer solution buckets rather than dry on tables."
        ],
        "limitations": "Visual inspection cannot verify micro-pathogen levels, sanitizer chemical concentration, or cooking core temperatures."
    },
    {
        "media_type": "video",
        "overall_hygiene_score": "Moderate Concern",
        "gloves_observed": "Bare hand contact visible during handling of garnishes",
        "hair_covering_observed": "Incomplete hair restraint; hair strands exposed near workstation",
        "surface_cleanliness": "Scattered ingredient residues, crumbs, and damp wiping stains on wooden board",
        "cross_contamination_risk": "Moderate concern: Knife used for poultry sitting adjacent to fresh salad greens",
        "observations": [
            "Hand washing station not immediately utilized prior to direct food handling.",
            "Multiple food items placed close together on a single prep station.",
            "No visible thermometer in use during hot holding prep."
        ],
        "concerns": [
            "Bare hand contact with ready-to-eat food poses norovirus and Staphylococcus risk.",
            "Unsanitized knife proximity could facilitate Salmonella cross-contamination."
        ],
        "improvements": [
            "Enforce strict non-negotiable bare-hand contact policy for ready-to-eat ingredients.",
            "Implement dedicated color-coded cutting boards: Red for raw meat, Green for produce.",
            "Provide easily accessible disposable nitrile gloves and proper hair coverings at the station entrance."
        ],
        "limitations": "Frame sampling only captures sporadic moments; does not evaluate refrigeration compressor temperatures or dishwashing water heat."
    }
]

DEMO_RECIPES: List[Dict[str, Any]] = [
    {
        "recipe_name": "Crispy Pan-Seared Tofu & Broccoli Sesame Bowl",
        "cuisine": "Asian Fusion",
        "diet_type": "Vegetarian / Vegan",
        "prep_time_min": 12,
        "cook_time_min": 15,
        "servings": 2,
        "ingredients": [
            "200g firm tofu, pressed and cubed",
            "1.5 cups fresh broccoli florets",
            "1 medium bell pepper, sliced into matchsticks",
            "1 tbsp soy sauce or tamari (gluten-free if needed)",
            "1 tbsp toasted sesame oil",
            "1 tbsp cornstarch (for extra crispiness)",
            "2 cloves garlic, finely minced",
            "1 tsp grated ginger root",
            "1 tsp white sesame seeds and sliced scallions for garnish"
        ],
        "instructions": [
            "Pat tofu cubes dry with a paper towel and toss in a bowl with cornstarch until evenly dusted.",
            "Heat half of the sesame oil in a skillet over medium-high heat. Add tofu cubes and sear for 7-8 minutes, rotating until all sides are golden brown and crisp. Transfer to a plate.",
            "In the same skillet, add the remaining oil, minced garlic, and ginger. Sauté for 30 seconds until fragrant.",
            "Toss in the broccoli florets and bell peppers with 2 tbsp of water. Cover skillet with a lid to steam-cook for 3 minutes until tender-crisp.",
            "Pour in soy sauce, return crispy tofu to the skillet, and toss everything together for 1-2 minutes until thoroughly glazed.",
            "Serve immediately over brown rice or noodles, topped with toasted sesame seeds and scallions."
        ],
        "estimated_nutrition": {
            "calories_per_serving_kcal": 320.0,
            "protein_g": 18.5,
            "carbs_g": 22.0,
            "fat_g": 17.0
        },
        "safety_notes": [
            "Allergy Alert: Contains soy and sesame. Substitute tamari with coconut aminos if soy-allergic.",
            "Ensure tofu is cooked through to reach an internal temperature of at least 74°C (165°F)."
        ]
    },
    {
        "recipe_name": "Lemon Herb Grilled Chicken Breast with Roasted Asparagus",
        "cuisine": "Mediterranean",
        "diet_type": "Non-Vegetarian",
        "prep_time_min": 15,
        "cook_time_min": 18,
        "servings": 2,
        "ingredients": [
            "2 skinless, boneless chicken breasts (approx. 180g each)",
            "1 bunch fresh green asparagus, woody ends trimmed",
            "2 tbsp extra virgin olive oil",
            "Zest and juice of 1 fresh organic lemon",
            "2 cloves garlic, crushed",
            "1 tsp dried oregano and 1/2 tsp dried thyme",
            "1/2 tsp sea salt and freshly cracked black pepper"
        ],
        "instructions": [
            "Pound chicken breasts gently between parchment sheets to an even 1/2-inch thickness for uniform cooking.",
            "In a shallow dish, combine olive oil, lemon juice, lemon zest, garlic, oregano, thyme, salt, and pepper.",
            "Coat chicken breasts and asparagus in the marinade. Let rest for 10 minutes.",
            "Preheat a grill pan or cast-iron skillet over medium-high heat until hot.",
            "Cook chicken breasts undisturbed for 5-6 minutes on the first side. Flip and cook for another 5 minutes until internal thermometer reads 74°C (165°F).",
            "Add asparagus spears to the skillet edges during the last 5 minutes of chicken cooking, rolling occasionally until charred and tender.",
            "Let the chicken rest for 3 minutes on a cutting board before slicing against the grain. Serve with roasted asparagus."
        ],
        "estimated_nutrition": {
            "calories_per_serving_kcal": 380.0,
            "protein_g": 46.0,
            "carbs_g": 6.5,
            "fat_g": 18.0
        },
        "safety_notes": [
            "Always wash hands and prep tools after handling raw poultry.",
            "Verify internal chicken core temperature reaches at least 74°C (165°F) with a digital food thermometer."
        ]
    }
]

DEMO_MEAL_PLANS: Dict[str, Any] = {
    "Balanced Nutrition": {
        "title": "7-Day Balanced Mediterranean Energy Plan",
        "diet_preference": "Balanced / Flexitarian",
        "target_goal": "Balanced Nutrition & Sustained Vitality",
        "allergies": ["None specified"],
        "daily_schedule": ["Breakfast", "Lunch", "Dinner", "Snack"],
        "plan_data": {
            "Monday": {
                "day": "Monday",
                "breakfast": {
                    "name": "Greek Yogurt Parfait with Blueberries & Chia",
                    "description": "Thick Greek yogurt layered with wild blueberries, raw chia seeds, and raw honey drizzle.",
                    "estimated_calories_kcal": 340.0,
                    "protein_g": 22.0,
                    "carbs_g": 40.0,
                    "fat_g": 8.0
                },
                "lunch": {
                    "name": "Quinoa, Chickpea & Feta Mediterranean Salad",
                    "description": "Fluffy quinoa tossed with cucumber, cherry tomatoes, Kalamata olives, and crumbly feta.",
                    "estimated_calories_kcal": 490.0,
                    "protein_g": 16.0,
                    "carbs_g": 62.0,
                    "fat_g": 19.0
                },
                "dinner": {
                    "name": "Herb-Crusted Baked Salmon with Steamed Greens",
                    "description": "Wild Alaskan salmon baked with dill, garlic, lemon, and steamed asparagus spears.",
                    "estimated_calories_kcal": 550.0,
                    "protein_g": 42.0,
                    "carbs_g": 12.0,
                    "fat_g": 36.0
                },
                "snack": {
                    "name": "Handful of Raw Walnuts & Green Apple Slices",
                    "description": "Omega-3 rich walnuts paired with crisp crisp Granny Smith apple.",
                    "estimated_calories_kcal": 210.0,
                    "protein_g": 4.5,
                    "carbs_g": 22.0,
                    "fat_g": 14.0
                },
                "daily_calories_kcal": 1590.0,
                "daily_protein_g": 84.5
            },
            "Tuesday": {
                "day": "Tuesday",
                "breakfast": {
                    "name": "Rolled Oats with Almond Butter & Sliced Banana",
                    "description": "Creamy steel-cut or rolled oats cooked in almond milk with natural almond butter.",
                    "estimated_calories_kcal": 380.0,
                    "protein_g": 12.0,
                    "carbs_g": 54.0,
                    "fat_g": 14.0
                },
                "lunch": {
                    "name": "Grilled Lemon Herb Chicken & Avocado Wrap",
                    "description": "Whole wheat tortilla filled with grilled chicken, avocado, spinach, and garlic yogurt spread.",
                    "estimated_calories_kcal": 510.0,
                    "protein_g": 38.0,
                    "carbs_g": 44.0,
                    "fat_g": 20.0
                },
                "dinner": {
                    "name": "Tuscan White Bean & Kale Stew with Sourdough",
                    "description": "Slow-cooked cannellini beans, tender lacinato kale, and fire-roasted tomatoes.",
                    "estimated_calories_kcal": 460.0,
                    "protein_g": 18.0,
                    "carbs_g": 72.0,
                    "fat_g": 10.0
                },
                "snack": {
                    "name": "Carrot & Cucumber Batons with Roasted Garlic Hummus",
                    "description": "Crunchy fresh garden vegetable crudités with creamy tahini chickpea hummus.",
                    "estimated_calories_kcal": 180.0,
                    "protein_g": 5.0,
                    "carbs_g": 20.0,
                    "fat_g": 9.0
                },
                "daily_calories_kcal": 1530.0,
                "daily_protein_g": 73.0
            },
            "Wednesday": {
                "day": "Wednesday",
                "breakfast": {
                    "name": "Vegetable Frittata with Spinach & Goat Cheese",
                    "description": "Pasture-raised eggs baked with baby spinach, sweet red onions, and soft goat cheese.",
                    "estimated_calories_kcal": 320.0,
                    "protein_g": 21.0,
                    "carbs_g": 8.0,
                    "fat_g": 22.0
                },
                "lunch": {
                    "name": "Lentil & Roasted Sweet Potato Power Bowl",
                    "description": "French green lentils, spiced roasted sweet potato cubes, and tahini lemon dressing.",
                    "estimated_calories_kcal": 480.0,
                    "protein_g": 19.0,
                    "carbs_g": 74.0,
                    "fat_g": 12.0
                },
                "dinner": {
                    "name": "Pan-Seared Cod with Lemon Caper Sauce & Broccoli",
                    "description": "Flaky white Pacific cod fillet lightly seared with olive oil, capers, and char-grilled broccoli.",
                    "estimated_calories_kcal": 440.0,
                    "protein_g": 38.0,
                    "carbs_g": 16.0,
                    "fat_g": 24.0
                },
                "snack": {
                    "name": "Cottage Cheese with Sliced Strawberries",
                    "description": "Slow-digesting casein-rich low fat cottage cheese topped with fresh strawberries.",
                    "estimated_calories_kcal": 170.0,
                    "protein_g": 20.0,
                    "carbs_g": 15.0,
                    "fat_g": 2.5
                },
                "daily_calories_kcal": 1410.0,
                "daily_protein_g": 98.0
            },
            "Thursday": {
                "day": "Thursday",
                "breakfast": {
                    "name": "Green Superfood Smoothie with Plant Protein",
                    "description": "Blended spinach, frozen mango, flax seeds, unsweetened almond milk, and vanilla plant protein.",
                    "estimated_calories_kcal": 330.0,
                    "protein_g": 24.0,
                    "carbs_g": 38.0,
                    "fat_g": 7.0
                },
                "lunch": {
                    "name": "Mediterranean Turkey & Brown Rice Stuffed Bell Peppers",
                    "description": "Roasted bell peppers filled with lean ground turkey, brown rice, herbs, and marinara.",
                    "estimated_calories_kcal": 490.0,
                    "protein_g": 35.0,
                    "carbs_g": 48.0,
                    "fat_g": 16.0
                },
                "dinner": {
                    "name": "Crispy Tofu Stir-Fry with Bok Choy & Edamame",
                    "description": "Wok-seared sesame ginger tofu tossed with crisp baby bok choy and shelled edamame.",
                    "estimated_calories_kcal": 450.0,
                    "protein_g": 26.0,
                    "carbs_g": 34.0,
                    "fat_g": 22.0
                },
                "snack": {
                    "name": "Roasted Salted Edamame",
                    "description": "Crispy dry-roasted green soybeans for sustained fiber and protein.",
                    "estimated_calories_kcal": 150.0,
                    "protein_g": 14.0,
                    "carbs_g": 9.0,
                    "fat_g": 5.0
                },
                "daily_calories_kcal": 1420.0,
                "daily_protein_g": 99.0
            },
            "Friday": {
                "day": "Friday",
                "breakfast": {
                    "name": "Avocado Toast on Sprouted Grain with Poached Egg",
                    "description": "Ezekiel bread with mashed lime avocado, chili flakes, and a pasture-raised egg.",
                    "estimated_calories_kcal": 360.0,
                    "protein_g": 15.0,
                    "carbs_g": 32.0,
                    "fat_g": 19.0
                },
                "lunch": {
                    "name": "Wild Salmon & Farro Harvest Salad",
                    "description": "Ancient grain farro tossed with smoked or grilled salmon, arugula, and lemon vinaigrette.",
                    "estimated_calories_kcal": 520.0,
                    "protein_g": 36.0,
                    "carbs_g": 48.0,
                    "fat_g": 20.0
                },
                "dinner": {
                    "name": "Homemade Margherita Pizza on Cauliflower Crust",
                    "description": "Crisp cauliflower crust with San Marzano tomato sauce, fresh mozzarella, and torn basil.",
                    "estimated_calories_kcal": 480.0,
                    "protein_g": 24.0,
                    "carbs_g": 36.0,
                    "fat_g": 26.0
                },
                "snack": {
                    "name": "Dark Chocolate Square (85%) & Raw Almonds",
                    "description": "Antioxidant flavanol-rich dark chocolate with crunchy California almonds.",
                    "estimated_calories_kcal": 190.0,
                    "protein_g": 4.0,
                    "carbs_g": 11.0,
                    "fat_g": 16.0
                },
                "daily_calories_kcal": 1550.0,
                "daily_protein_g": 79.0
            },
            "Saturday": {
                "day": "Saturday",
                "breakfast": {
                    "name": "Protein Oat Banana Pancakes with Berry Compote",
                    "description": "3-ingredient blender pancakes made with rolled oats, eggs, and ripe banana.",
                    "estimated_calories_kcal": 390.0,
                    "protein_g": 20.0,
                    "carbs_g": 56.0,
                    "fat_g": 8.0
                },
                "lunch": {
                    "name": "Grilled Vegetable & Halloumi Skewers with Pita",
                    "description": "Zucchini, bell peppers, red onion, and squeaky grilled halloumi cheese.",
                    "estimated_calories_kcal": 470.0,
                    "protein_g": 22.0,
                    "carbs_g": 42.0,
                    "fat_g": 24.0
                },
                "dinner": {
                    "name": "Garlic Butter Prawns with Zucchini Noodles & Tomatoes",
                    "description": "Succulent shrimp sautéed with minced garlic, cherry tomatoes, and spiralized zoodles.",
                    "estimated_calories_kcal": 420.0,
                    "protein_g": 36.0,
                    "carbs_g": 14.0,
                    "fat_g": 24.0
                },
                "snack": {
                    "name": "Spiced Air-Popped Popcorn with Nutritional Yeast",
                    "description": "Light whole-grain popcorn sprinkled with savory B-vitamin rich yeast.",
                    "estimated_calories_kcal": 140.0,
                    "protein_g": 5.0,
                    "carbs_g": 24.0,
                    "fat_g": 2.5
                },
                "daily_calories_kcal": 1420.0,
                "daily_protein_g": 83.0
            },
            "Sunday": {
                "day": "Sunday",
                "breakfast": {
                    "name": "Classic Shakshuka with Feta & Crusty Bread",
                    "description": "Eggs poached gently in a spiced tomato, red pepper, and cumin sauce.",
                    "estimated_calories_kcal": 410.0,
                    "protein_g": 19.0,
                    "carbs_g": 44.0,
                    "fat_g": 18.0
                },
                "lunch": {
                    "name": "Hearty Lentil Soup with Baby Spinach",
                    "description": "Warming brown lentil soup simmered with carrots, celery, bay leaves, and baby spinach.",
                    "estimated_calories_kcal": 440.0,
                    "protein_g": 22.0,
                    "carbs_g": 66.0,
                    "fat_g": 8.0
                },
                "dinner": {
                    "name": "Roasted Chicken Thigh with Sweet Potato & Green Beans",
                    "description": "Crispy skin-on roast chicken thigh with caramelized sweet potatoes and French green beans.",
                    "estimated_calories_kcal": 530.0,
                    "protein_g": 40.0,
                    "carbs_g": 38.0,
                    "fat_g": 24.0
                },
                "snack": {
                    "name": "Mixed Berries with Coconut Milk Swirl",
                    "description": "Raspberries, blackberries, and blueberries with a spoonful of creamy coconut milk.",
                    "estimated_calories_kcal": 150.0,
                    "protein_g": 2.0,
                    "carbs_g": 22.0,
                    "fat_g": 6.0
                },
                "daily_calories_kcal": 1530.0,
                "daily_protein_g": 83.0
            }
        }
    }
}
