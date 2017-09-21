# import code; code.interact(local=dict(globals(), **locals()))
import json
from django.http import Http404
from django.contrib.auth.models import User
from django.db.models import Sum
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import UserExpenses
from .serializers import UserSerializer, ExpenseSerializer, UserListSerializer
from rest_framework import generics
from rest_framework import mixins
from rest_framework import viewsets
from rest_framework.renderers import TemplateHTMLRenderer, JSONRenderer
from react.render import render_component
import logging

# class UsersList(mixins.ListModelMixin,
#                   mixins.CreateModelMixin,
#                   generics.GenericAPIView):
    
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
#     #permission_classes = [ReadOnly]

    
#     def get_serializer_class(self):
#         if self.request.method == 'GET':
#             serializer_class = UserListSerializer
#         else:
#             serializer_class = UserSerializer
#         return serializer_class


#     def get(self, request, *args, **kwargs):
#         return self.list(request, *args, **kwargs)

#     def post(self, request, *args, **kwargs):
#         return self.create(request, *args, **kwargs)

class UsersList(APIView):
    '''
    List all the users.
    '''
    renderer_classes = [TemplateHTMLRenderer,JSONRenderer]
    template_name = 'test_api/userslist.html'

    def get(self, request, format=None):
        users = User.objects.all()
        serializer = UserListSerializer(users,many=True)
        if request.accepted_renderer.format == 'html':
            users = json.dumps({"users":serializer.data})
            return Response({"users":users})
        return Response(serializer.data)
    
    
    def post(self, request,pk, format=None):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class UserDetail(APIView):
    """
    Retrieve, update or delete a snippet instance.
    """
    renderer_classes = [TemplateHTMLRenderer,JSONRenderer]
    template_name = 'test_api/index.html'
    

    def get_object(self, pk):
        try:
            return User.objects.get(pk=pk)
        except:
            raise Http404

    def get(self, request, pk, format=None):
        users = self.get_object(pk)
        serializer = UserListSerializer(users)
        if request.accepted_renderer.format == 'html':
        # #     return Response({'users':users})
        #     return render(request, self.template_name, {'users':User.objects.all()})     
            users = json.dumps({"users":serializer.data})
            return Response({"users":users})
        #     rendered_html = render_component(
        #     '/js/index.js',
        #     props = {
        #    'id': users.username,
        #    'username': users.username,
        #     })
            # return render(request, self.template_name, {'rendered_html': rendered_html})
        return Response(serializer.data)
    
    
    def post(self, request,pk, format=None):
        
        serializer = ExpenseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def put(self, request, pk, format=None):
        serializer = UserListSerializer(self.get_object(pk), data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        self.get_object(pk).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



class UserExpense(APIView):

    # serializer_class = ExpenseSerializer
    renderer_classes = [TemplateHTMLRenderer,JSONRenderer]
    template_name = 'test_api/users_expenses.html'

    # def get_queryset(self):
    #     #return UserExpenses.objects.filter(user_id=self.request.user.id)
    #     return self.request.user.userexpenses_set.all()


    def get_object(self,user_id,pk):
        try:
            return UserExpenses.objects.filter(user_id=user_id).get(id=pk)
        except:
            raise Http404

    def get(self, request, pk, format=None):
        users = self.get_object(request.user.id, pk)
        serializer = ExpenseSerializer(users)
        if request.accepted_renderer.format == 'html':
            users = json.dumps({"users":serializer.data})
            return Response({"users":users})
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        user = self.get_object(request.user.id, pk)
        serializer = ExpenseSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk, format=None):
        self.get_object(request.user.id, pk).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class AllUserExpense(APIView):

    # serializer_class = ExpenseSerializer

    # def get_queryset(self):
    #     #return UserExpenses.objects.filter(user_id=self.request.user.id)
    #     return self.request.user.userexpenses_set.all()
    renderer_classes = [TemplateHTMLRenderer,JSONRenderer]
    template_name = 'test_api/users_expenses.html'
    
    def get_data(self,user_id):
        users = UserExpenses.objects.filter(user_id=user_id)
        cost = json.dumps({"total_cost":str(users.aggregate(cost=Sum('expense_cost'))['cost'])})
        serializer = ExpenseSerializer(users, many=True)
        users = json.dumps({"users":serializer.data,'total_cost':json.loads(cost)})
        return users

    def get(self, request, format=None):
        if request.accepted_renderer.format == 'html':
            return Response({"users":self.get_data(request.user.id)})
        users = UserExpenses.objects.filter(user_id=request.user.id)
        serializer = ExpenseSerializer(users, many=True)
        cost = json.dumps({"total_cost":str(users.aggregate(cost=Sum('expense_cost'))['cost'])})
        return Response([serializer.data,json.loads(cost)])
    
    def post(self, request, format=None):
        current_user = User.objects.get(id=request.user.id)
        request.data['data']['user_id'] = current_user.id
        serializer = ExpenseSerializer(data=request.data.get('data'))
        # if request.accepted_renderer.format == 'html':
        #     UserExpenses.objects.create(
        #                                 user_id = request.user.id,
        #                                 expense_cost = request.data.get('expense_cost'),
        #                                 expense_type = request.data.get('expense_type'),
        #                                 expense_description = request.data.get('expense_description')
        #                                 )
        #     # request.method = 'GET'
        #     import code; code.interact(local=dict(globals(), **locals()))
        #     return Response({"users":self.get_data(request.user.id)})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    def patch(self, request, format=None):
        user = UserExpenses.objects.get(id=request.data.get('data').get('pk'))
        serializer = ExpenseSerializer(user, data=request.data.get('data'),partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




    def delete(self, request, format=None):
        UserExpenses.objects.filter(user_id=request.user.id,id=request.data.get('pk')).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)