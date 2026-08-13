from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404

from .models import Goal, GoalContribution
from .forms import GoalForm, GoalContributionForm


@login_required
def goal_list(request):

    goals = Goal.objects.filter(user=request.user)

    for goal in goals:

        if goal.target_amount > 0:
            goal.percentage = round(
                min(
                    (goal.saved_amount / goal.target_amount) * 100,
                    100
                )
            )
        else:
            goal.percentage = 0

        goal.remaining = goal.target_amount - goal.saved_amount

        if goal.saved_amount >= goal.target_amount:
            goal.status = "Completado"
            goal.status_color = "success"

        elif goal.percentage >= 80:
            goal.status = "Cerca"
            goal.status_color = "warning"

        else:
            goal.status = "En progreso"
            goal.status_color = "primary"

    return render(
        request,
        "goals/list.html",
        {
            "goals": goals,
        },
    )


@login_required
def goal_detail(request, pk):

    goal = get_object_or_404(
        Goal,
        pk=pk,
        user=request.user,
    )

    contributions = goal.contributions.all()

    if goal.target_amount > 0:
        percentage = round(
            min(
                (goal.saved_amount / goal.target_amount) * 100,
                100
            )
        )
    else:
        percentage = 0

    remaining = goal.target_amount - goal.saved_amount

    if goal.saved_amount >= goal.target_amount:
        status = "Completada"
        status_color = "success"

    elif percentage >= 80:
        status = "Cerca del objetivo"
        status_color = "warning"

    else:
        status = "En progreso"
        status_color = "primary"

    return render(
        request,
        "goals/detail.html",
        {
            "goal": goal,
            "contributions": contributions,
            "percentage": percentage,
            "remaining": remaining,
            "status": status,
            "status_color": status_color,
        },
    )


@login_required
def goal_create(request):

    if request.method == "POST":

        form = GoalForm(request.POST)

        if form.is_valid():

            goal = form.save(commit=False)
            goal.user = request.user
            goal.save()

            messages.success(
                request,
                "Meta creada correctamente."
            )

            return redirect("goals:list")

    else:
        form = GoalForm()

    return render(
        request,
        "goals/form.html",
        {
            "form": form,
            "title": "Nueva meta",
        },
    )


@login_required
def goal_update(request, pk):

    goal = get_object_or_404(
        Goal,
        pk=pk,
        user=request.user,
    )

    if request.method == "POST":

        form = GoalForm(
            request.POST,
            instance=goal,
        )

        if form.is_valid():

            form.save()

            messages.success(
                request,
                "Meta actualizada."
            )

            return redirect("goals:list")

    else:

        form = GoalForm(instance=goal)

    return render(
        request,
        "goals/form.html",
        {
            "form": form,
            "title": "Editar meta",
        },
    )


@login_required
def goal_delete(request, pk):

    goal = get_object_or_404(
        Goal,
        pk=pk,
        user=request.user,
    )

    if request.method == "POST":

        goal.delete()

        messages.success(
            request,
            "Meta eliminada."
        )

        return redirect("goals:list")

    return render(
        request,
        "goals/delete.html",
        {
            "goal": goal,
        },
    )

@login_required
def goal_contribute(request, pk):

    goal = get_object_or_404(
        Goal,
        pk=pk,
        user=request.user,
    )

    if request.method == "POST":

        form = GoalContributionForm(request.POST)

        if form.is_valid():

            contribution = form.save(commit=False)
            contribution.goal = goal
            contribution.save()

            goal.update_saved_amount()

            messages.success(
                request,
                "Aporte registrado correctamente."
            )

            return redirect(
                "goals:detail",
                pk=goal.pk,
            )

    else:

        form = GoalContributionForm()

    return render(
        request,
        "goals/contribute.html",
        {
            "goal": goal,
            "form": form,
        },
    )

@login_required
def goal_contribution_update(request, pk):

    contribution = get_object_or_404(
        GoalContribution,
        pk=pk,
        goal__user=request.user,
    )

    goal = contribution.goal

    if request.method == "POST":

        form = GoalContributionForm(
            request.POST,
            instance=contribution,
        )

        if form.is_valid():

            form.save()

            goal.update_saved_amount()

            messages.success(
                request,
                "Aporte actualizado correctamente."
            )

            return redirect(
                "goals:detail",
                pk=goal.pk,
            )

    else:

        form = GoalContributionForm(
            instance=contribution,
        )

    return render(
        request,
        "goals/contribute.html",
        {
            "goal": goal,
            "form": form,
        },
    )

@login_required
def goal_contribution_delete(request, pk):

    contribution = get_object_or_404(
        GoalContribution,
        pk=pk,
        goal__user=request.user,
    )

    goal = contribution.goal

    if request.method == "POST":

        contribution.delete()

        goal.update_saved_amount()

        messages.success(
            request,
            "Aporte eliminado correctamente."
        )

        return redirect(
            "goals:detail",
            pk=goal.pk,
        )

    return render(
        request,
        "goals/contribution_confirm_delete.html",
        {
            "goal": goal,
            "contribution": contribution,
        },
    )

