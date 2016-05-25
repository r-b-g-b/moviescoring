import os
import numpy as np
import json
from glob import glob
from flask import Flask, request, render_template, send_from_directory

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

def pack_timeseries(times, data):
	return json.dumps([{'time':t, 'val':d} for t,d in zip(times, data)])


@app.route('/')
def index():
	vidpaths = list_directory(MOVIE_DIR, ['.ogv'])
	datpaths = list_directory(DATA_DIR, ['.npz'])
	return render_template('index.html', vidpaths=vidpaths, datpaths=datpaths)

@app.route('/select', methods=['GET', 'POST'])
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
				data.append({'name':datpath, 'data':pack_timeseries(t,dat)})

		return render_template('viewer.html', vidpath=vidpath, data=data)

@app.route('/video/<path:path>')
def serve_movie(path):
	return send_from_directory(MOVIE_DIR, path)

if __name__=='__main__':
	app.run(debug=True)
