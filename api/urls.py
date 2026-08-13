from django.urls import path
from . import views
from .views import dashboard_api, login_api, logout_api, csrf, me

urlpatterns = [
    path("csrf/", csrf, name="csrf"),
    path("login/", login_api, name="login_api"),
    path("logout/", logout_api, name="logout_api"),
    path("me/", me, name="me"),
    path("dashboard/", dashboard_api, name="dashboard_api"),

    path("transactions/", views.transactions_api),
    path("transactions/<int:pk>/", views.transaction_detail_api),

    path("categories/", views.categories_api),
    path("categories/<int:pk>/", views.category_detail_api),
    
    path("budgets/", views.budgets_api),
    path("budgets/<int:pk>/", views.budget_detail_api),

    path("goals/", views.goals_api),
    path("goals/<int:pk>/", views.goal_detail_api),
    path("goals/<int:goal_id>/contributions/", views.goal_contributions_api),

    path("profile/", views.profile_api),
    path("password-change/", views.password_change_api),
]