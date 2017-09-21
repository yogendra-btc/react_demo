from rest_framework import serializers
from .models import UserExpenses
from rest_framework.validators import UniqueValidator
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    
    email = serializers.EmailField(
            required=True,
            validators=[UniqueValidator(queryset=User.objects.all())]
            )
    username = serializers.CharField(
            validators=[UniqueValidator(queryset=User.objects.all())]
            )
    password = serializers.CharField(min_length=8)

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], validated_data['email'],
             validated_data['password'])
        
        print("User created")
        return user

    class Meta:
        model = User
        fields = ('id', 'username','email','password')


class UserListSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ('id', 'username','email')


class ExpenseSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = UserExpenses
        fields = ('id','user_id','expense_cost','expense_type','expense_description','expense_datetime')

    