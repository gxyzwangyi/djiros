from flask import Flask, request, session, g, redirect, url_for, \
     abort, render_template, flash

app = Flask(__name__)



app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/index')
@app.route('/')
def show_index():
    return render_template('index.html')

@app.route('/doc')
def show_doc():
    return render_template('doc.html')




if __name__ == '__main__':
    app.run()
