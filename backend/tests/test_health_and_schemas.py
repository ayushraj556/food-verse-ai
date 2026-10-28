def test_health_endpoint(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ("healthy", "degraded")
    assert "version" in data
    assert "is_demo_mode" in data
    assert "active_model" in data
    assert "database_connected" in data
    assert data["database_connected"] is True

def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "Welcome to Food Verse AI" in data["message"]
    assert data["docs_url"] == "/docs"
