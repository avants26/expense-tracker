import requests
import json

BASE_URL = "http://localhost:5000/api/expenses"

def test_api():
    print("Testing Backend APIs...")
    
    # 1. Add Expense
    payload = {
        "title": "Backend Test",
        "amount": 123,
        "category": "Other",
        "date": "2026-03-16"
    }
    r = requests.post(BASE_URL, json=payload)
    print(f"POST /api/expenses: {r.status_code}")
    expense_id = r.json()['data']['_id']

    # 2. Get All
    r = requests.get(BASE_URL)
    print(f"GET /api/expenses: {r.status_code}, Count: {r.json()['count']}")

    # 3. Analytics
    endpoints = ["/analytics/daily", "/analytics/weekly", "/analytics/monthly", "/analytics/yearly"]
    for ep in endpoints:
        r = requests.get(BASE_URL + ep)
        print(f"GET {ep}: {r.status_code}")

    # 4. Delete
    r = requests.delete(f"{BASE_URL}/{expense_id}")
    print(f"DELETE /api/expenses/{expense_id}: {r.status_code}")

if __name__ == "__main__":
    try:
        test_api()
        print("\nAll tests passed!")
    except Exception as e:
        print(f"\nTest failed: {e}")
