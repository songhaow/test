from flask import Flask
# CORS python package is standardized code that will allow webpages from other
# domains to access resources of this application server
# - read -- https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
from flask_cors import CORS

app = Flask(__name__)
# By applying CORS to the flask-python application object, we allow (by default)
# all websites domains to access content on this server
CORS(app)

SOURCE_AUDIO_FOLDER = '../souce_audio'


@app.route('/')
def hello():
    return 'Hello World!'

@app.route('/song')
def handle_song():
    """Read the contents of the song file and send it to the webpage /
    javascript that requested it
    """
    content = ''
    with open('source_audio/eyes.m4a', 'rb') as fp:
        content = fp.read()
    return content

if __name__ == '__main__':
    app.run(port=8080)
