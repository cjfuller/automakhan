import flask

from . import jobs

_app = flask.Flask('query_server')

# STOPSHIP(colin): csrf protection


@_app.route('/query', methods=['GET'])
def query_entry():
    with open('static/query.html') as f:
        return f.read()


@_app.route('/static/<staticfile>', methods=['GET'])
def static_files(staticfile):
    # TODO(colin): don't serve static files from flask
    return flask.send_from_directory('../static', staticfile)


@_app.route('/register_query', methods=['POST'])
def register_query():
    try:
        job_id = jobs.create(flask.request.json)
    except jobs.JobError as e:
        return (e.message, 400)

    print(job_id)
    return (job_id, 200)


def run():
    _app.run(port=7000)
