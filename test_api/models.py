from django.db import models
from django.contrib.auth.models import User
from datetime import datetime
# class User(models.Model):
#     user_name = models.CharField(max_length=40)
#     email = models.EmailField()
#     password = models.CharField(max_length=30) 

#     def __str__(self):
#         return str(self.pk)


class UserExpenses(models.Model):
    user_id = models.ForeignKey(User,on_delete = models.CASCADE)
    expense_cost = models.CharField(max_length = 40)
    expense_type = models.CharField(max_length = 40)
    expense_description = models.CharField(max_length = 200)
    expense_datetime = models.DateTimeField(default = datetime.now())