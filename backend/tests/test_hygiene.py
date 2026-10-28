def test_hygiene_analysis_image(client, sample_image_bytes):
    response = client.post(
        "/api/hygiene/analyze",
        files={"file": ("kitchen.jpg", sample_image_bytes, "image/jpeg")},
        data={"force_demo": "true"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "overall_hygiene_score" in data
    assert "gloves_observed" in data
    assert "hair_covering_observed" in data
    assert "surface_cleanliness" in data
    assert "cross_contamination_risk" in data
    assert "disclaimer" in data
    assert "certification" in data["disclaimer"].lower() or "regulatory" in data["disclaimer"].lower()
    assert data["is_demo"] is True

    # Test retrieval from database
    rec_id = data["id"]
    get_res = client.get(f"/api/hygiene/{rec_id}")
    assert get_res.status_code == 200
    assert get_res.json()["overall_hygiene_score"] == data["overall_hygiene_score"]
