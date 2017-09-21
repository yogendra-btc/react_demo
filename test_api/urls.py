from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from rest_auth.views import (LoginView, LogoutView, UserDetailsView, PasswordChangeView, PasswordResetView, PasswordResetConfirmView)
from . import views
from rest_framework.authtoken import views as rest_framework_views
from rest_framework import renderers

# user_list = views.UsersList.as_view({
#     'get': 'list',
#     'post': 'create'
# })

# user_detail = views.UsersList.as_view({
#     'get': 'retrieve',
#     'put': 'update',
#     'patch': 'partial_update',
#     'delete': 'destroy'
# })

# user_expense_list = views.UserExpense.as_view({
#     'get': 'list',
#     'post': 'create'
# })

# user_expense_detail = views.AllUserExpense.as_view({
#     'get': 'retrieve',
#     'put': 'update',
#     'patch': 'partial_update',
#     'delete': 'destroy'
# })

# urlpatterns = format_suffix_patterns([
#     url(r'^users/$', user_list, name='user-list'),
#     url(r'^users/(?P<pk>[0-9]+)/$', user_detail, name='user-detail'),
#     url(r'^user_expenses/$', user_expense_list, name='user-expense-list'),
#     url(r'^user_expenses/(?P<pk>[0-9]+)/$', user_expense_detail, name='user-expense-detail'),
# ])

urlpatterns = [
    url(r'^users/$', views.UsersList.as_view()),
    url(r'^users/(?P<pk>[0-9]+)/$', views.UserDetail.as_view()),
    url(r'^users_expenses/(?P<pk>[0-9]+)/$',views.UserExpense.as_view()),
    url(r'^users_expenses/$',views.AllUserExpense.as_view()),
    #url(r'^users_expenses/(?P<pk>[0-9]+)/(?P<userexpense_id>[0-9]+)/$',views.UserExpense.as_view()),
    url(r'^login/$', LoginView.as_view(), name='login'),
    url(r'^logout/$', LogoutView.as_view(), name='rest_logout'),
]

urlpatterns = format_suffix_patterns(urlpatterns)