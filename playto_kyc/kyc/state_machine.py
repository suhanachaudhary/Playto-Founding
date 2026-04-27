
STATE_TRANSITIONS = {
    "draft": ["submitted"],
    "submitted": ["under_review"],
    "under_review": ["approved", "rejected"],
    "more_info_requested": ["submitted"],
    "approved": [],
    "rejected": []
}



def can_transition(current, new):
    return new in STATE_TRANSITIONS.get(current, [])