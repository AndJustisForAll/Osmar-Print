from flask import render_template, request, redirect, url_for, session, escape, g, flash
from app import app, db
from app.schemas import Users, Products, Inputs, Outputs, UserSchema, ProductSchema, InputsShema, OutputsSchema, inheritanceSchema
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from flask import jsonify, make_response
from flask_bootstrap import Bootstrap

import datetime
import render
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError


@app.route('/signup', methods=["GET", "POST"])
def signup():
    if g.user:
        if g.level == '1':
            if request.method == "POST":
                username = request.form["username"]
                existent_user = Users.query.filter_by(username=username).first()
                if existent_user is None:
                    hashed_pw = generate_password_hash(request.form["password"], method="sha256")
                    new_user = Users(username=request.form["username"], name=request.form["name"],
                    lastname=request.form["lastname"], level=request.form["level"], password=hashed_pw)
                    db.session.add(new_user)
                    db.session.commit()
                    return "You've registered successfully.", 201
                else:
                    return "This user already exists!."
        else:
            return "you don't have authorization to view this module", 401
    else:
        return "You must first login.", 401
    return render_template('signup.html')

#REGISTRO DE PRODUCTOS
@app.route('/register_product', methods=["POST"])
def register_product():
    if g.user and g.level=='1':
        if request.method == "POST":
            new_product = Products(name=request.form["name"], stock=request.form["stock"], reorder=request.form["reorder"])
            db.session.add(new_product)
            db.session.commit()
            return "Your product has been registered succefully.", 201
    else:
        return "you don't have authorization to view this module", 401

@app.route('/login', methods=["POST"])
def login():
    if request.method == "POST":
        user = Users.query.filter_by(username=request.form["username"]).first()
        if user and check_password_hash(user.password, request.form["password"]):
            session["username"] = user.username
            respuesta = {
            'respuesta': 'success',
            'id': user.id_user,
            'username': user.username,
            'level': user.level
            }
            return jsonify(respuesta)
        else:
            respuesta = {'respuesta':'Datos incorrectos'}
            return jsonify(respuesta)
    else:
        return "Method not allowed"

@app.route('/logout')
def logout():
    session.pop("username", None)
    if g.id_user and g.level:
    # del g.id_user
    # del g.level
        g.id_user = None
        g.level = None
        return "Deslogueado"

@app.before_request
def before_request():
    if "username" in session:
        g.user = session["username"]
        users = Users.query.filter_by(username=g.user).first()
        g.id_user = users.id_user
        g.level = users.level
    else:
        g.user = None
        g.id_user = None
        g.level = None

@app.route('/usersByName/<int:page>/<string:name>')
@app.route('/users/<int:page>')
@app.route('/users')
def get_users(page=0, name=""):
    per_page =3
    lista = []
    total = db.session.query(Users).count()
    user_schema = UserSchema(many=True)
    if name:
        users = db.session.query(Users).filter(Users.username.like('%'+ name +'%')).paginate(page,per_page, False)
        lista = listar(users.items)
    elif page:
        users = db.session.query(Users).group_by(Users.id_user).paginate(page,per_page,False)
        lista = listar(users.items)
    else:
        users = db.session.query(Users).group_by(Users.id_user)
        lista = listar(users)

    lista = {'result': lista, 'total': total}

    if g.user:
        if g.level:
            return jsonify(lista)
        else:
            return "you don't have authorization to view this module", 401
    else:
        return "You must first login.", 401

def listar(param):
    lista = []
    for u in param:
        lista.append({'id': u.id_user, 'username': u.username,\
                    'name': u.name, 'lastname': u.lastname, 'level': u.level })
    return lista

@app.route('/inputs_outputs', methods=["POST"])
def register_inputs_outputs():
    if request.method == "POST" and g.level != 1:
        today = str(datetime.datetime.now())
        today = today[0:19]
        if g.level == '2':
            new_action = Inputs(id_productf=request.form["id_product"], quantity=request.form["quantity"], date=today, id_userf=g.id_user)
        elif g.level == '3':
            new_action =  Outputs(id_productf=request.form["id_product"], quantity=request.form["quantity"], date=today, id_userf=g.id_user)
        update_stock(new_action.id_productf, new_action.quantity, g.level)
        db.session.add(new_action)
        db.session.commit()
        return 'ok'

def update_stock(id, stock_aggregated, level):
    product = Products.query.filter_by(id_product=id).first()
    if level == '2':
        product.stock = int(product.stock) + int(stock_aggregated)
    elif level == '3':
        product.stock = int(product.stock) - int(stock_aggregated)

@app.route('/productsByName/<int:page>/<string:name>')
@app.route('/products/<int:page>')
@app.route('/products')
def get_products(page=0, name=""):
    per_page =3 #numero de elementos a mostrar por pagina
    lista = []
    total = db.session.query(Products).count()
    if name:
        for row in db.session.query(Products).filter(Products.name.like('%'+ name +'%')).paginate(page,per_page, False).items:
            lista.append({'id': row.id_product, 'name': row.name, 'reorder': row.reorder, 'stock': row.stock })
    else:
        for row in (db.session.query(Products).order_by(Products.id_product).paginate(page,per_page, False)).items: #retorna false si no encuentra nada
            lista.append({'id': row.id_product, 'name': row.name, 'reorder': row.reorder, 'stock': row.stock })

    lista = {'result': lista, 'total': total}
    if g.user:
        return jsonify(lista)
    else:
        return "You must first login.", 401

@app.route('/view_inputsByDate/<string:date1>/<string:date2>')
@app.route('/view_inputsByProduct/<int:id_product>/<int:page>')
@app.route('/view_inputsByUser/<int:id_user>')
@app.route('/view_inputs/<int:page>') # View_inputs/Numero de pagina
@app.route('/view_inputs')
def view_inputs(page=0, id_product=0, id_user=0, date1="", date2=""):
    per_page =5 #numero de elementos a mostrar por pagina
    total = db.session.query(Inputs).count()
    if id_product:
        query = db.session.query(Inputs, Products, Users).\
                        filter(Inputs.id_productf==Products.id_product,\
                        Inputs.id_userf==Users.id_user).\
                        filter_by(id_productf=id_product).\
                        paginate(page,per_page, False)
        lista = MakeListInputs(query.items,2)
    elif id_user:
        query = db.session.query(Inputs, Products, Users).\
                        filter(Inputs.id_productf==Products.id_product,\
                        Inputs.id_userf==Users.id_user).\
                        filter_by(id_userf=id_user).\
                        order_by(Users.username).\
                        all()
        lista = MakeListInputs(query,2)
    elif date1 and date2:
        query = db.session.query(Inputs, Products, Users).\
                        filter(Inputs.id_productf==Products.id_product,\
                        Inputs.id_userf==Users.id_user,\
                        Inputs.date.between(date1, date2)).\
                        order_by(Users.id_user).\
                        all()
        lista = MakeListInputs(query,2)
    else:
        query = db.session.query(Inputs, Products, Users).\
                        filter(Inputs.id_productf==Products.id_product,\
                        Inputs.id_userf==Users.id_user).\
                        paginate(page,per_page, False)
        lista = MakeListInputs(query.items,2)

    lista = {'result': lista, 'total': total}
    return jsonify(lista)

def MakeListInputs(result, level):
    lista = []
    for i,p,u in result:
        if level == 2:
            lista.append({'id': i.id_input, 'username': u.username,'product': p.name, 'date': str(i.date), 'quantity': i.quantity})
        else:
            lista.append({'id': i.id_output, 'username': u.username,'product': p.name, 'date': str(i.date), 'quantity': i.quantity})
    return lista


@app.route('/view_OutputsByDate/<string:date1>/<string:date2>')
@app.route('/view_OutputsByProduct/<int:id_product>/<int:page>')
@app.route('/view_OutputsByUser/<int:id_user>')
@app.route('/view_outputs/<int:page>')
@app.route('/view_outputs')
def view_outputs(page=0, id_product=0, id_user=0, date1="", date2=""):
    per_page = 5
    lista = []
    total = db.session.query(Outputs).count()
    if id_product:
        query = db.session.query(Outputs, Products, Users).\
                        filter(Outputs.id_productf==Products.id_product,\
                        Outputs.id_userf==Users.id_user).\
                        filter_by(id_productf=id_product).\
                        paginate(page,per_page, False)
        lista = MakeListInputs(query.items,3)
    elif id_user:
        query = db.session.query(Outputs, Products, Users).\
                        filter(Outputs.id_productf==Products.id_product,\
                        Outputs.id_userf==Users.id_user).\
                        filter_by(id_userf=id_user).\
                        order_by(Users.username).\
                        all()
        lista = MakeListInputs(query,3)
    elif date1 and date2:
        query = db.session.query(Outputs, Products, Users).\
                        filter(Outputs.id_productf==Products.id_product,\
                        Outputs.id_userf==Users.id_user,\
                        Outputs.date.between(date1, date2)).\
                        order_by(Users.id_user).\
                        all()
        lista = MakeListInputs(query,3)
    else:
        query = db.session.query(Outputs, Products, Users).\
                        filter(Outputs.id_productf==Products.id_product,\
                       Outputs.id_userf==Users.id_user).\
                        paginate(page,per_page, False)
        lista = MakeListInputs(query.items,3)

    lista = {'result': lista, 'total': total}
    return jsonify(lista)

#UPDATES
@app.route('/update_user',  methods=['POST']) #SE VA A MEJORAR
def update_user():
    if request.method == "POST":
        updating = Users.query.filter_by(id_user=request.form['id']).first()
        updating.username = request.form['username']
        updating.name = request.form['name']
        updating.lastname = request.form['lastname']
        updating.password = generate_password_hash(request.form['password'], method="sha256")
        updating.level = request.form['level']
        db.session.add(updating)
        db.session.commit()
        return 'The user has been updated succesfully!.'
    return "Ooops, something was wrong :s."

@app.route('/update_product',  methods=['POST']) # SE VA A MEJORAR
def update_product():
    if request.method == "POST":
        updating = Products.query.filter_by(id_product=request.form['id']).first()
        updating.name = request.form['name']
        updating.stock = request.form['stock']
        updating.reorder = request.form['reorder']
        db.session.add(updating)
        db.session.commit()
        return 'The user has been updated succesfully!.'
    return "Ooops, something was wrong :s."

@app.route('/update_input',  methods=['POST'])
def update_input():
    if request.method == "POST":
        updating = Inputs.query.filter_by(id_input=request.form['id']).first()
        updating.id_productf = request.form['id_product']
        updating.quantity = request.form['quantity']
        updating.date = request.form['date']
        updating.id_userf = request.form['id_user']
        db.session.add(updating)
        db.session.commit()
        return 'The user has been updated succesfully!.'
    return "Ooops, something was wrong :s."

@app.route('/update_output',  methods=['POST'])
def update_output():
    if request.method == "POST":
        updating = Outputs.query.filter_by(id_output=request.form['id']).first()
        updating.id_productf = request.form['id_product']
        updating.quantity = request.form['quantity']
        updating.date = request.form['date']
        updating.id_userf = request.form['id_user']
        db.session.add(updating)
        db.session.commit()
        return 'The user has been updated succesfully!.'
    return "Ooops, something was wrong :s."

#DELETES
@app.route('/delete_user/<int:id>', methods=['POST', 'GET'])
def delete_user(id):
    if g.user and g.level=='1':
        try:
            deleting_user = Users.query.filter_by(id_user=id).first()
            db.session.delete(deleting_user)
            db.session.commit()
            return "The user has been deleted succesfully."
        except IntegrityError as e:
            return "Oops! something was wrong :o {}".format(e.message)
    else:
        return "you don't have authorization to view this module"

@app.route('/delete_product/<int:id>', methods=['POST','GET'])
def delete_product(id):
    if g.user and g.level=='1':
        try:
            deleting_product = Products.query.filter_by(id_product=id).first()
            db.session.delete(deleting_product)
            db.session.commit()
            return "Your product has been deleted succesfully.",200
        except IntegrityError as e:
            return "Oops! something was wrong :o {}".format(e.message), 400
    else:
        return "you don't have authorization to view this module"

@app.route('/delete_input/<int:id>', methods=['POST','GET'])
def delete_input(id):
    if g.user and g.level=='1':
        deleting_input = Inputs.query.filter_by(id_input=id).first()
        db.session.delete(deleting_input)
        db.session.commit()
        return "Your input has been deleted succesfully."
    else:
        return "you don't have authorization to view this module"

@app.route('/delete_output/<int:id>', methods=['POST','GET'])
def delete_output(id):
    if g.user and g.level=='1':
        deleting_output = Outputs.query.filter_by(id_output=id).first()
        db.session.delete(deleting_output)
        respuesta = db.session.commit()
        return "Your output has been deleted succesfully."
    else:
        return "you don't have authorization to view this module"
