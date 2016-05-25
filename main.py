import os
from glob import glob

import json
import numpy as np

from flask import Flask, request, render_template, send_from_directory

import config

app = Flask(__name__)
app.config.from_object(config)

def list_directory(d, ext):
	return sorted([f for f in os.listdir(d) if os.path.splitext(f)[-1] in ext])

# @app.route('/data/<path:path>')
def load_timeseries(path):
	f = np.load(os.path.join(app.config['DATA_DIR'], path))
	return f['time'], f['val']

def pack_timeseries(times, data):
	return json.dumps([{'time':t, 'val':d} for t,d in zip(times, data)])


@app.route('/')
def index():
	vidpaths = list_directory(app.config['MOVIE_DIR'], ['.ogv'])
	datpaths = list_directory(app.config['DATA_DIR'], ['.npz'])
	return render_template('index.html', vidpaths=vidpaths, datpaths=datpaths)

@app.route('/select', methods=['GET', 'POST'])
def select():
	if request.method=='POST':

		vidpaths = list_directory(app.config['MOVIE_DIR'], ['.ogv'])
		datpaths = list_directory(app.config['DATA_DIR'], ['.npz'])

		vidpath = ''
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

		# return render_template('viewer.html', data=data)
		return render_template('viewer.html', vidpath=vidpath, data=data)

@app.route('/video/<path:path>')
def serve_movie(path):
	return send_from_directory(app.config['MOVIE_DIR'], path)

if __name__=='__main__':
	app.run(debug=True)
