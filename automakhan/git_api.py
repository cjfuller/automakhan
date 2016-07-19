import json
import os.path
import shutil
import subprocess
import threading
from typing import Any, Dict, List

REPO_CLONE_PATH = os.path.expanduser("~/.automakhan-data")
REPO = 'git@github.com:cjfuller/automakhan-data'

JOBS_DIR = 'jobs'
JOB_RUN_DIR = 'job_runs'

_GIT_OP_LOCK = threading.RLock()


def atomic(fn):
    def new_fn(*args, **kwargs):
        with _GIT_OP_LOCK:
            fn(*args, **kwargs)
    return new_fn


def git(*args) -> None:
    subprocess.run(['git', '-C', REPO_CLONE_PATH] + list(args))


def setup() -> None:
    if os.path.exists(REPO_CLONE_PATH):
        shutil.rmtree(REPO_CLONE_PATH)
    subprocess.run(["git", "clone", REPO, REPO_CLONE_PATH])


def pull() -> None:
    git('pull')


# TODO(colin): don't use dict type
@atomic
def commit_job_spec(job_spec: dict, job_id: str) -> None:
    pull()
    subprocess.run(['mkdir', '-p', jobs_dir()])
    job_fn = os.path.join(jobs_dir(), job_id)
    with open(job_fn, 'w') as f:
        f.write(json.dumps(job_spec))
    git('add', 'jobs')
    git('commit', '-m', '"Created job %s"' % job_id)


def push() -> None:
    git('push', '-u', 'origin', 'master')


def validate_job():
    pass


def jobs_dir() -> str:
    return os.path.join(REPO_CLONE_PATH, JOBS_DIR)


def slurp_file(fn: str) -> str:
    with open(fn) as f:
        return f.read()


def all_jobs() -> Dict[str, str]:
    pull()
    return {
        job_id: slurp_file(os.path.join(jobs_dir(), job_id))
        for job_id in all_job_ids()
    }


def all_job_ids() -> List[str]:
    pull()
    result = []  # type: List[str]
    for (path, dirs, files) in os.walk(jobs_dir()):
        assert len(dirs) == 0, "Wasn't expecting subdirectories"
        result += [job_id for job_id in files]
    return result


# TODO: correct return type
def get_job_file(job_id: str) -> Dict[str, Any]:
    #pull()
    return json.loads(all_jobs()[job_id])


def job_runs(job_id: str) -> List[str]:
    #pull()
    job_run_dir = os.path.join(REPO_CLONE_PATH, JOB_RUN_DIR, job_id)
    if not os.path.exists(job_run_dir):
        return []
    result = []  # type: List[str]
    for (path, dirs, files) in os.walk(job_run_dir):
        assert len(dirs) == 0, "Wasn't expecting subdirectories"
        result += [job_id for job_id in files]
    return result


@atomic
def job_run(job_id: str, job_run_id: str, job_run_spec: str) -> None:
    pull()
    job_run_dir = os.path.join(REPO_CLONE_PATH, JOB_RUN_DIR, job_id)
    os.makedirs(job_run_dir)
    with open(os.path.join(job_run_dir, job_run_id), 'w') as f:
        f.write(job_run_spec)
    git("add", job_run_dir)
    git("commit", "-m", "Created job run %s" % job_run_id)
    push()
