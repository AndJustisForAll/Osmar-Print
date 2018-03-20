import os

class Config(object):
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = '123123123'

class ProductionConfig(Config):
    # SECRET_KEY = os.environ["SECRET_KEY"]
    SQLALCHEMY_DATABASE_URI = "postgresql://postgres:123@localhost/imprenta"
    DEBUG = False

class DevelopmentConfig(Config):
    DEBUG = True
