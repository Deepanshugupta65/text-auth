import os
import redis

REDIS_HOST = os.getenv("REDIS_HOST", "redis")

redis_client = redis.Redis(
    host=REDIS_HOST,
    port=6379,
    decode_responses=True
)

def clear_task_cache(user_id: int):
    keys = redis_client.scan_iter(match=f"tasks:user={user_id}:*")

    for key in keys:
        redis_client.delete(key)