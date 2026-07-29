from core.security import create_access_token, create_refresh_token, decode_access_token


def test_access_and_refresh_tokens_are_not_interchangeable():
    access = create_access_token(42)
    refresh = create_refresh_token(42)

    assert decode_access_token(access) == 42
    assert decode_access_token(refresh) is None
    assert decode_access_token(refresh, expected_type="refresh") == 42
    assert decode_access_token(access, expected_type="refresh") is None
