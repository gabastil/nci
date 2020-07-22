#!/usr/bin/env python
# -*- encoding: utf-8 -*-
from pprint import PrettyPrinter

def load(file):
    with open(file) as fin:
        return [__.strip() for __ in fin.readlines() if __.strip()]

def detect(task_ids, backlog):
    A, B = set(task_ids), set(backlog)
    return A.intersection(B)

if __name__=='__main__':
    # Check 'Completed' Task IDs
    enhancements = 'resources/enhancements.txt'
    backlog_complete = 'resources/backlog_complete.txt'
    backlog_incomplete = 'resources/backlog_incomplete.txt'

    completed = detect(enhancements, backlog_complete)
    incompleted = detect(enhancements, backlog_incomplete)


    pp = PrettyPrinter(indent=4)
    pp.pprint(f'Completed {completed}')
    pp.pprint(f'Incomplete {incompleted}')
