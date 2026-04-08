from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note, Blog, Comment


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "author"]
        extra_kwargs = {"author": {"read_only": True}}



class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "email"]



# api/serializers.py
from .models import Blog, BlogBlock

class BlogBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogBlock
        fields = ["id", "order", "text", "image"]








class BlogSerializer(serializers.ModelSerializer):
    blocks = BlogBlockSerializer(many=True)
    author = serializers.CharField(source="author.username", read_only=True)
    
    # 🌟 NEW: Automatically count comments for the frontend
    comment_count = serializers.SerializerMethodField()

    class Meta:
        model  = Blog
        fields = [
            "id", "title", "created",
            "tag", "snippet", "image",
            "author", "blocks", 
            "comment_count", # 🌟 Added here
        ]
        read_only_fields = ["author", "created"]

    # 🌟 NEW: The function that calculates the count
    def get_comment_count(self, obj):
        return obj.comments.count()

    # allow POST / PUT with nested blocks
    def create(self, validated_data):
        blocks_data = validated_data.pop("blocks", [])
        blog = Blog.objects.create(author=self.context["request"].user,
                                   **validated_data)
        for idx, blk in enumerate(blocks_data):
            BlogBlock.objects.create(blog=blog, order=idx, **blk)
        return blog

    def update(self, instance, validated_data):
        blocks_data = validated_data.pop("blocks", [])
        # update simple fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # replace blocks (simple strategy)
        instance.blocks.all().delete()
        for idx, blk in enumerate(blocks_data):
            BlogBlock.objects.create(blog=instance, order=idx, **blk)
        return instance





# api/serializers.py
# api/serializers.py
class CommentSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source="author.username", read_only=True)

    class Meta:
        model  = Comment
        fields = ["id", "blog", "author", "guest_name", "text", "created"]
        read_only_fields = ["blog",         # 👈 make DRF ignore this on input
                            "author",
                            "guest_name",
                            "created"]



# serializers.py
from .models import ContactMessage

class ContactMessageSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source="author.username", read_only=True)

    class Meta:
        model = ContactMessage
        fields = ["id", "name", "email", "message", "author", "created"]
        read_only_fields = ["author", "created"]


from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = "__all__"
        
from .models import BookingSnapshot

class BookingSnapshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingSnapshot
        fields = "__all__"
