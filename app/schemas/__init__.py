from datetime import datetime
from app import db, ma

class Users(db.Model):
    id_user = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(50), nullable=False)
    lastname = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(128), nullable=False)
    level = db.Column(db.Enum('1','2','3', name='myenum')) 
    id_inputs = db.relationship('Inputs', backref='users', lazy=True)
    id_outputs = db.relationship('Outputs', backref='users', lazy=True)

class Products(db.Model):
    id_product= db.Column(db.BigInteger, primary_key= True, autoincrement=True)
    name = db.Column(db.String(25), nullable=False)
    stock = db.Column(db.Integer, nullable=False)
    reorder = db.Column(db.Integer, nullable=False)
    inputs = db.relationship('Inputs', backref='products', lazy=True)
    outputs = db.relationship('Outputs', backref='products', lazy=True)

class Inputs(db.Model):
    id_input = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    id_productf = db.Column(db.BigInteger, db.ForeignKey('products.id_product'), nullable=False)
    quantity = db.Column(db.Integer, default=1)
    date = db.Column(db.DateTime, nullable=False, default=datetime.now())
    id_userf = db.Column(db.BigInteger, db.ForeignKey('users.id_user'), nullable=False)

class Outputs(db.Model):
    id_output = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    id_productf = db.Column(db.BigInteger, db.ForeignKey('products.id_product'), nullable=False)
    quantity = db.Column(db.Integer, default=1)
    date = db.Column(db.DateTime, nullable=False, default=datetime.now())
    id_userf = db.Column(db.BigInteger, db.ForeignKey('users.id_user'), nullable=False)

class UserSchema(ma.ModelSchema):
    class Meta:
        model = Users

class ProductSchema(ma.ModelSchema):
    class Meta:
        model = Products

class InputsShema(ma.ModelSchema):
    class Meta:
        model = Inputs

class OutputsSchema(ma.ModelSchema):
    class Meta:
        model = Inputs

class inheritanceSchema(UserSchema, InputsShema, ProductSchema, OutputsSchema):
    pass