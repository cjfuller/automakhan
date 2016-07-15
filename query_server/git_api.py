import json
import os.path
import shutil
import subprocess

REPO_CLONE_PATH = os.path.expanduser("~/.automakhan-data")
REPO = 'git@github.com:cjfuller/automakhan-data'

JOBS_DIR = 'jobs'


def git(*args) -> None:
    subprocess.run(['git', '-C', REPO_CLONE_PATH] + list(args))


def setup() -> None:
    if os.path.exists(REPO_CLONE_PATH):
        shutil.rmtree(REPO_CLONE_PATH)
    subprocess.run(["git", "clone", REPO, REPO_CLONE_PATH])


def pull() -> None:
    git('pull')


# TODO(colin): don't use dict type
def commit_job_spec(job_spec: dict, job_id: str) -> None:
    pull()
    subprocess.run(['mkdir', '-p', os.path.join(REPO_CLONE_PATH, JOBS_DIR)])
    job_fn = os.path.join(REPO_CLONE_PATH, JOBS_DIR, job_id)
    with open(job_fn, 'w') as f:
        f.write(json.dumps(job_spec))
    git('add', 'jobs')
    git('commit', '-m', '"Created job %s"' % job_id)


def push() -> None:
    git('push', '-u', 'origin', 'master')


def validate_job():
    pass


setup()
