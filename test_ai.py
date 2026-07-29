import requests
import json

base_url = 'http://127.0.0.1:8000/api/v1'

def test():
    # 1. Login to get token
    try:
        login_res = requests.post(f"{base_url}/auth/login", data={"username": "test@example.com", "password": "password123"})
        token = login_res.json().get('access_token')
        if not token:
            print("Login failed, maybe need to create user:")
            print(login_res.json())
            
            # create user
            reg_res = requests.post(f"{base_url}/auth/register", json={"email": "test@example.com", "password": "password123", "full_name": "Test User"})
            print(f"Register: {reg_res.json()}")
            
            login_res = requests.post(f"{base_url}/auth/login", data={"username": "test@example.com", "password": "password123"})
            token = login_res.json().get('access_token')
            if not token:
                print("Failed again.")
                return
    except Exception as e:
        print(f"Auth error: {e}")
        return

    # 2. Test chat endpoint
    headers = {"Authorization": f"Bearer {token}"}
    chat_res = requests.post(f"{base_url}/ai/assistant/chat", json={"message": "Salam"}, headers=headers)
    print(f"Chat status: {chat_res.status_code}")
    print(f"Chat response: {chat_res.text}")

if __name__ == "__main__":
    test()
