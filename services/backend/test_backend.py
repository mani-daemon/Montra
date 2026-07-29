import requests

BASE_URL = "http://127.0.0.1:8005/api/v1"

def run_tests():
    print("Testing Registration...")
    email = "test@montra.com"
    password = "password123"
    
    # Ignore 400 if user exists
    requests.post(f"{BASE_URL}/auth/register", json={"email": email, "password": password})
    
    print("Testing Login...")
    resp = requests.post(f"{BASE_URL}/auth/login", data={"username": email, "password": password})
    assert resp.status_code == 200, f"Login failed: {resp.text}"
    token = resp.json()["access_token"]
    
    headers = {"Authorization": f"Bearer {token}"}
    
    print("Testing Create Transaction...")
    resp = requests.post(f"{BASE_URL}/transactions/", json={
        "title": "Groceries",
        "amount_minor": 5000,
        "type": "expense",
        "category": "Food"
    }, headers=headers)
    assert resp.status_code == 201, f"Create transaction failed: {resp.text}"
    
    print("Testing Get Transactions...")
    resp = requests.get(f"{BASE_URL}/transactions/", headers=headers)
    assert resp.status_code == 200, f"Get transactions failed: {resp.text}"
    assert len(resp.json()) > 0
    
    print("Testing Summary...")
    resp = requests.get(f"{BASE_URL}/transactions/summary", headers=headers)
    assert resp.status_code == 200, f"Get summary failed: {resp.text}"
    assert resp.json()["total_expense_minor"] >= 5000
    
    print("ALL TESTS PASSED! ✅")

if __name__ == "__main__":
    run_tests()
