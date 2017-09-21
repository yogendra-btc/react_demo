from django.test import TestCase
from unittest import TestCase
from unittest.mock import patch, Mock
from . import views
from .views import UsersList

class UsersList(TestCase):
    
    @patch(views.UsersList)
    def test_userslist_post(self, MockBlog):
        userslist = MockBlog()

        userslist.post.return_value = [
            {
                'id': 1,
                'email': 'Test Title',
                'password': 'Far out in the uncharted backwaters of the unfashionable end of the western spiral arm of the Galaxy\ lies a small unregarded yellow sun.'
            }
        ]

        response = userslist.post()
        self.assertIsNotNone(response)
        # self.assertIsInstance(response[0], dict)
