from flask import Flask
from flask_cors import CORS
import config

app = Flask(__name__)
app.config.from_object(config)
CORS(app)

if __name__ == '__main__':
    from routes import *
    app.run()
