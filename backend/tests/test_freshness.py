def test_freshness_analysis_valid(client, sample_png_bytes):
    response = client.post(
        "/api/freshness/analyze",
        files={"file": ("fruit.png", sample_png_bytes, "image/png")},
        data={"force_demo": "true"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "freshness_status" in data
    assert data["freshness_status"] in ("Fresh", "Moderately Fresh", "Possibly Spoiled")
    assert "safety_guidance" in data
    assert "disclaimer" in data
    assert "microbiological" in data["disclaimer"].lower() or "bacteria" in data["disclaimer"].lower() or "screening" in data["disclaimer"].lower()
    assert data["is_demo"] is True

    # Test retrieval from database
    rec_id = data["id"]
    get_res = client.get(f"/api/freshness/{rec_id}")
    assert get_res.status_code == 200
    assert get_res.json()["freshness_status"] == data["freshness_status"]
