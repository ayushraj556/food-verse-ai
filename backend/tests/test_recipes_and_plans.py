def test_recipe_generation_and_crud(client):
    req_payload = {
        "ingredients": ["tofu", "broccoli", "garlic", "soy sauce"],
        "diet_preference": "Vegetarian",
        "cuisine": "Asian",
        "max_time_min": 25,
        "allergies": ["peanuts"],
        "servings": 2
    }
    response = client.post("/api/recipes/generate?force_demo=true", json=req_payload)
    assert response.status_code == 200
    data = response.json()
    assert "recipe_name" in data
    assert len(data["ingredients"]) > 0
    assert len(data["instructions"]) > 0
    assert "estimated_nutrition" in data
    assert data["is_demo"] is True

    rec_id = data["id"]
    # List recipes
    list_res = client.get("/api/recipes")
    assert list_res.status_code == 200
    assert any(r["id"] == rec_id for r in list_res.json())

    # Delete recipe
    del_res = client.delete(f"/api/recipes/{rec_id}")
    assert del_res.status_code == 200
    assert del_res.json()["status"] == "success"

def test_meal_plan_crud(client):
    plan_req = {
        "title": "College Athlete High Protein Plan",
        "diet_preference": "Non-Vegetarian",
        "target_goal": "High Protein",
        "allergies": ["Shellfish"],
        "daily_schedule": ["Breakfast", "Lunch", "Dinner", "Snack"],
        "cooking_time_pref": "Quick & Easy"
    }
    # 1. Generate & Create
    create_res = client.post("/api/meal-plans/generate?force_demo=true", json=plan_req)
    assert create_res.status_code == 200
    plan_data = create_res.json()
    assert "id" in plan_data
    assert "plan_data" in plan_data
    plan_id = plan_data["id"]

    # 2. Read
    get_res = client.get(f"/api/meal-plans/{plan_id}")
    assert get_res.status_code == 200
    assert get_res.json()["title"] == plan_data["title"]

    # 3. Update
    update_res = client.put(f"/api/meal-plans/{plan_id}", json={
        "title": "Updated Athlete Nutrition Plan",
        "notes": "Added post-workout whey shake recommendation"
    })
    assert update_res.status_code == 200
    assert update_res.json()["title"] == "Updated Athlete Nutrition Plan"

    # 4. List
    list_res = client.get("/api/meal-plans")
    assert list_res.status_code == 200
    assert any(p["id"] == plan_id for p in list_res.json())

    # 5. Delete
    del_res = client.delete(f"/api/meal-plans/{plan_id}")
    assert del_res.status_code == 200
    assert del_res.json()["status"] == "success"

def test_stats_and_exports(client):
    # Fetch stats
    stats_res = client.get("/api/stats")
    assert stats_res.status_code == 200
    stats = stats_res.json()
    assert "total_analyses" in stats
    assert "avg_calories_kcal" in stats

    # Fetch CSV export
    csv_res = client.get("/api/export/csv")
    assert csv_res.status_code == 200
    assert "text/csv" in csv_res.headers["content-type"]
    assert "Record ID" in csv_res.text

    # Fetch JSON export
    json_res = client.get("/api/export/json")
    assert json_res.status_code == 200
    assert "application/json" in json_res.headers["content-type"]
