import io

def test_analyze_food_valid_image(client, sample_image_bytes):
    response = client.post(
        "/api/food/analyze",
        files={"file": ("plate.jpg", sample_image_bytes, "image/jpeg")},
        data={"force_demo": "true"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "food_name" in data
    assert "nutrition_summary" in data
    assert "total_calories_kcal" in data["nutrition_summary"]
    assert data["nutrition_summary"]["total_calories_kcal"] > 0
    assert "detected_items" in data
    assert len(data["detected_items"]) > 0
    assert "disclaimer" in data
    assert "approximate" in data["disclaimer"].lower()
    assert data["is_demo"] is True

    # Test retrieval from database by returned id
    rec_id = data["id"]
    get_res = client.get(f"/api/food/{rec_id}")
    assert get_res.status_code == 200
    get_data = get_res.json()
    assert get_data["food_name"] == data["food_name"]
    assert get_data["id"] == rec_id

def test_analyze_food_invalid_mime_type(client):
    fake_txt = b"This is not a food image file."
    response = client.post(
        "/api/food/analyze",
        files={"file": ("notes.txt", fake_txt, "text/plain")}
    )
    assert response.status_code == 400
    assert "Invalid file type" in response.json()["detail"]

def test_analyze_food_empty_file(client):
    empty_bytes = b""
    response = client.post(
        "/api/food/analyze",
        files={"file": ("empty.jpg", empty_bytes, "image/jpeg")}
    )
    assert response.status_code == 400
    assert "empty" in response.json()["detail"].lower()
