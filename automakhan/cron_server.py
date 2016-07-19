import asyncio
import datetime
import os.path
from typing import Callable
import uuid

import crontab

from . import git_api

Thunk = Callable[[], None]

loop = None  # type: asyncio.BaseEventLoop


def schedule_next_run(job_id):
    job_info = git_api.get_job_file(job_id)
    freq = job_info['frequency']
    if 'after' in freq:
        raise NotImplementedError("Chaining jobs not yet implemented")
    elif 'once' in freq:
        if not git_api.job_runs(job_id):
            schedule_threadsafe(
                0,
                lambda: timer_callback(job_id))
    elif 'cron' in freq:
        delay = crontab.CronTab(freq['cron']).next()
        schedule_threadsafe(delay, lambda: timer_callback(job_id))
    else:
        assert False, ("Expected one of 'after', 'once', or 'cron' "
                       "in job %s" % job_id)


def timer_callback(job_id):
    job_run_id = uuid.uuid4().hex
    job_spec = "TODO"
    git_api.job_run(job_id, job_run_id, job_spec)
    schedule_next_run(job_id)


def _schedule(delay: int, to_run: Thunk):
    loop.call_later(delay + 1, to_run)


def schedule_threadsafe(delay: int, to_run):
    loop.call_soon_threadsafe(_schedule, delay, to_run)


def run():
    global loop
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_forever()


# TODO: ensure this only runs on loop start
def schedule_all():
    for job_id in git_api.all_job_ids():
        schedule_next_run(job_id)
