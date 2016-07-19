import json
from typing import Dict
import uuid

from . import git_api


class TypedJSON(dict):
    # TODO(colin): implement
    pass


class JobSpecType(TypedJSON):
    pass


class JobError(Exception):
    pass


def create(job_spec: JobSpecType) -> str:
    job_id = uuid.uuid4().hex
    git_api.commit_job_spec(job_spec, job_id)
    git_api.push()
    return job_id


def get_all() -> Dict[str, JobSpecType]:
    return {
        job_id: json.loads(job_json)
        for job_id, job_json in git_api.all_jobs().items()}
