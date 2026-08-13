from django.urls import path

from . import views

app_name = "goals"

urlpatterns = [
    path("", views.goal_list, name="list"),
    path("create/", views.goal_create, name="create"),
    path("<int:pk>/edit/", views.goal_update, name="update"),
    path("<int:pk>/delete/", views.goal_delete, name="delete"),
    path("<int:pk>/contribute/", views.goal_contribute, name="contribute"),
    path("contribution/<int:pk>/edit/", views.goal_contribution_update, name="contribution_update"),
    path("contribution/<int:pk>/delete/", views.goal_contribution_delete, name="contribution_delete"),
    path("<int:pk>/", views.goal_detail, name="detail"),
]