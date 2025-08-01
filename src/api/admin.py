import os
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from .models import db, User, Favorite

# Optional: Customize Favorite model view if needed
class FavoriteAdmin(ModelView):
    form_columns = ['item_name', 'user']  # Expose item name and related user
    column_list = ['id', 'item_name', 'user']  # Show these columns in admin

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    
    admin = Admin(app, name='Admin', template_mode='bootstrap3')

    # Register models
    admin.add_view(ModelView(User, db.session))
    admin.add_view(FavoriteAdmin(Favorite, db.session))


