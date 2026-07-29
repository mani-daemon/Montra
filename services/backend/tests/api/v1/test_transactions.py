import pytest
from fastapi import status

def test_create_transaction(client, auth_headers):
    transaction_data = {
        "title": "Test Transaction",
        "amount_minor": 10_025,
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
    assert data["amount_minor"] == transaction_data["amount_minor"]
    assert "id" in data
    assert "created_at" in data

def test_get_transactions(client, auth_headers):
    # Get all transactions
    response = client.get("/api/v1/transactions/", headers=auth_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, dict)
    assert "items" in data
    assert "total" in data
    assert isinstance(data["items"], list)


def test_summary_uses_minor_units_without_rounding(client, auth_headers):
    for transaction in (
        {"title": "Salary", "amount_minor": 250_000, "type": "income", "category": "Salary"},
        {"title": "Coffee", "amount_minor": 475, "type": "expense", "category": "Food"},
    ):
        response = client.post("/api/v1/transactions/", json=transaction, headers=auth_headers)
        assert response.status_code == status.HTTP_201_CREATED

    summary = client.get("/api/v1/transactions/summary", headers=auth_headers).json()
    assert summary == {
        "balance_minor": 249_525,
        "total_income_minor": 250_000,
        "total_expense_minor": 475,
    }
