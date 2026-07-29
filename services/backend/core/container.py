from dependency_injector import containers, providers
from core.database import engine, SessionLocal
from repositories.user_repository import UserRepository
from repositories.transaction_repository import TransactionRepository
from services.auth_service import AuthService
from services.transaction_service import TransactionService
from services.ai_service import AIService

class Container(containers.DeclarativeContainer):
    wiring_config = containers.WiringConfiguration(
        modules=[
            "api.v1.routers.auth",
            "api.v1.routers.transactions",
            "api.v1.routers.ai",
        ]
    )

    db = providers.Factory(SessionLocal)

    user_repo = providers.Factory(UserRepository)
    transaction_repo = providers.Factory(TransactionRepository)

    auth_service = providers.Factory(
        AuthService,
        repo=user_repo,
    )

    transaction_service = providers.Factory(
        TransactionService,
        repo=transaction_repo,
    )

    ai_service = providers.Factory(
        AIService,
        repo=transaction_repo,
    )
