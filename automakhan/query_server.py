import datetime
import json
import threading

import flask

from . import jobs
from . import git_api
from . import cron_server as cron

app = flask.Flask('automakhan')


@app.route('/query', methods=['GET'])
def query_entry():
    with open('static/query.html') as f:
        return f.read()


@app.route('/static/<staticfile>', methods=['GET'])
def static_files(staticfile):
    # TODO(colin): don't serve static files from flask
    return flask.send_from_directory('../static', staticfile)


@app.route('/register_query', methods=['POST'])
def register_query():
    try:
        job_id = jobs.create(flask.request.json)
    except jobs.JobError as e:
        return (e.message, 400)

    cron.schedule_next_run(job_id)

    return (job_id, 200)


@app.route('/list_jobs', methods=['GET'])
def list_jobs():
    all_jobs = jobs.get_all()
    # TODO: figure out how to use a template loader.
    with open('static/query_list.html') as f:
        template_str = f.read().strip()
        return flask.render_template_string(
            template_str,
            job_data=all_jobs)


@app.before_first_request
def do_git_setup():
    git_api.setup()
    threading.Thread(target=cron.run).start()
    import time
    time.sleep(0.1)
    cron.schedule_all()


def run():
    app.run(port=7000)
