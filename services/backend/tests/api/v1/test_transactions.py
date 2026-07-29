import pytest
from fastapi import status

def test_create_transaction(client, auth_headers):
    transaction_data = {
        "title": "Test Transaction",
        "amount": 100.0,
        "type": "expense",
        "category": "Food"
    }

    response = client.post(
        "/api/v1/transactions/",
        json=transaction_data,
        headers=auth_headers
    )

    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["title"] == transaction_data["title"]
    assert data["amount"] == transaction_data["amount"]
    assert "id" in data
    assert "created_at" in data

def test_get_transactions(client, auth_headers):
    # Get all transactions
    response = client.get("/api/v1/transactions/", headers=auth_headers)
    assert response.status_code == status.HTTP_200_OK
    assert isinstance(response.json(), list)
