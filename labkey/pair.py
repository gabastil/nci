#!/usr/bin/env python
# -*- encoding: utf-8 -*-
from pprint import PrettyPrinter

def load(file):
    with open(file) as fin:
        return [__.strip() for __ in fin.readlines() if __.strip()][1:]

def clean(func):
    def function(A, B):
        A, B = set(A), set(B)
        return func(A, B)
    return function

@clean
def detect(task_ids, backlog):
    return task_ids.intersection(backlog)

@clean
def no_matches(task_ids, backlog):
    return task_ids.difference(backlog)

if __name__=='__main__':
    # import os

    # print(os.getcwd())
    enhancements = load('labkey/resources/enhancements.txt')
    backlog_complete = load('labkey/resources/backlog_complete.txt')
    backlog_incomplete = load('labkey/resources/backlog_incomplete.txt')

    completed = detect(enhancements, backlog_complete)
    incompleted = detect(enhancements, backlog_incomplete)
    unmatched = (no_matches(enhancements, backlog_incomplete) &
                 no_matches(enhancements, backlog_complete))


    pp = PrettyPrinter(indent=4)
    pp.pprint([int(__) for __ in completed])
    pp.pprint([int(__) for __ in incompleted])
    pp.pprint(list(unmatched))
    print(len(completed | incompleted | unmatched))
