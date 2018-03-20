from flask import Flask
from flask_bootstrap import Bootstrap
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
import os


app = Flask(__name__, static_folder = 'dist')
app.config.from_object('config.ProductionConfig')
app.config.from_object('config.DevelopmentConfig')
app.config.from_object('config.Config')


bootstrap = Bootstrap(app)
db = SQLAlchemy(app)
ma = Marshmallow(app)

from app.routes import *
