from flask import render_template
from app.routes import app

@app.route('/css')
def css():
    return app.send_static_file('css/Home.css')

@app.route('/home.js')
def webpack():
    return app.send_static_file('js/Home.js')

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/error')
def error():
    return render_template('errorLogin.html')

@app.route('/admin')
def admin():
    return render_template('index.html')

@app.route('/inputs')
def inputs():
    return render_template('index.html')

@app.route('/outputs')
def outputs():
    return render_template('index.html')
