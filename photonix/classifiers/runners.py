import os
import re
from uuid import UUID


def get_or_create_tag(library, name, type, source, parent=None):
    # get_or_create is not atomic so an instance could get created by another thread inbetween.
    # This causes an IntegrityError due to the unique_together constraint.
    from django.db import IntegrityError, transaction
    from photonix.photos.models import Tag

    try:
        with transaction.atomic():
            tag, _ = Tag.objects.get_or_create(library=library, name=name, type=type, source=source, parent=parent)
    except IntegrityError:
        tag = Tag.objects.get(library=library, name=name, type=type, source=source, parent=parent)
    return tag


def results_for_model_on_photo(model, photo_id):
    is_photo_instance = False
    photo = None

    if isinstance(photo_id, UUID):
        is_photo_instance = True
    elif isinstance(photo_id, str):
        if re.match(r'\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b', photo_id):  # Is UUID
            is_photo_instance = True
    elif hasattr(photo_id, 'id'):
        photo = photo_id

    # import pdb; pdb.set_trace()

    # Is an individual filename so return the prediction
    if not is_photo_instance:
        return None, model.predict(photo_id)

    # Is a Photo model instance so needs saving
    if not photo:
        # Handle running scripts from command line and Photo IDs
        if not os.environ.get('DJANGO_SETTINGS_MODULE'):
            os.environ.setdefault("DJANGO_SETTINGS_MODULE", "photonix.web.settings")
            import django
            django.setup()

        from photonix.photos.models import Photo
        photo = Photo.objects.get(id=photo_id)

    results = model.predict(photo.base_image_path)

    return is_photo_instance and photo or None, results
