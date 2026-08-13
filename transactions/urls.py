from django.urls import path

from . import views

urlpatterns = [

    path(
        "",
        views.transaction_list,
        name="transaction_list"
    ),

    path(
        "new/",
        views.transaction_create,
        name="transaction_create"
    ),

    path(
        "<int:pk>/edit/",
        views.transaction_update,
        name="transaction_update"
    ),

    path(
        "<int:pk>/delete/",
        views.transaction_delete,
        name="transaction_delete"
    ),

    path(
        "dashboard/",
        views.dashboard,
        name="dashboard"
    ),

    path(
        "export/csv/",
        views.export_transactions_csv,
        name="export_transactions_csv"
    ),

]