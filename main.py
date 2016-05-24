import os
import numpy as np
import json
from glob import glob
from flask import Flask, request, render_template, send_from_directory

from flask import make_response
from functools import wraps, update_wrapper
from datetime import datetime

def nocache(view):
    @wraps(view)
    def no_cache(*args, **kwargs):
        response = make_response(view(*args, **kwargs))
        response.headers['Last-Modified'] = datetime.now()
        response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '-1'
        return response
        
    return update_wrapper(no_cache, view)

app = Flask(__name__)
MOVIE_DIR = '/auto/k8/robertg/stimuli/shortfilms/'
# MOVIE_DIR2 = '/auto/k1/robertg/Documents/notebooks/soundtrack/movies2'
DATA_DIR = '/auto/k1/robertg/code/moviescoring/data'

def list_directory(d, ext):
	return sorted([f for f in os.listdir(d) if os.path.splitext(f)[-1] in ext])

# @app.route('/data/<path:path>')
def load_timeseries(path):
	f = np.load(os.path.join(DATA_DIR, path))
	return f['time'], f['val']

def pack(times, data):
	return [{'time':t, 'val':d} for t,d in zip(times, data)]

def pack_timeseries(dat): 
	return json.dumps([pack(*d) for d in dat])

@app.route('/')
def index():
	vidpaths = list_directory(MOVIE_DIR, ['.ogv'])
	datpaths = list_directory(DATA_DIR, ['.npz'])
	return render_template('index.html', vidpaths=vidpaths, datpaths=datpaths)

@app.route('/select', methods=['GET', 'POST'])
@nocache
def select():
	if request.method=='POST':

		vidpaths = list_directory(MOVIE_DIR, ['.ogv'])
		datpaths = list_directory(DATA_DIR, ['.npz'])

		data = []
		form = request.form
		for k in request.form:
			if k.startswith('film_'):
				vidpath = vidpaths[int(k.split('film_')[-1])]
			if k.startswith('dataset_'):
				datpath = datpaths[int(k.split('dataset_')[-1])]
				print datpath
				t, dat = load_timeseries(datpath)
				print t[:10], dat[:10]
				data.append([t,dat])

		return render_template('viewer.html', vidpath=vidpath, data=pack_timeseries(data))

@app.route('/video/<path:path>')
def serve_movie(path):
	return send_from_directory(MOVIE_DIR, path)

if __name__=='__main__':
	app.run(debug=True)
