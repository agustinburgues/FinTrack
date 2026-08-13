from django.contrib import admin
from .models import Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):

    list_display = (
        'transaction_type',
        'amount',
        'category',
        'user',
        'date',
    )

    list_filter = (
        'transaction_type',
        'category',
    )

    search_fields = (
        'description',
    )

    ordering = (
        '-date',
    )