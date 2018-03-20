from app import app, db, bootstrap

if __name__ == "__main__":
    db.create_all()
    app.run()
