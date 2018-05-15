import json
from random import shuffle

import requests
from flask import Flask

app = Flask("loader")


from datetime import timedelta
from flask import make_response, request, current_app
from functools import update_wrapper



def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, basestring):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, basestring):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers

            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator



@app.route('/shmoogle/<query_string>')
@crossdomain(origin='*')
def query_google_api(query_string):
    res = []
    result_keys_mapping = {'htmlSnippet': 'content', 'htmlFormattedUrl': 'url', 'title': 'title',
                           'snippet': 'contentNoFormatting', 'link': 'visibleUrl', 'htmlTitle': 'titleNoFormatting'}

    try:
        for i in range(0, 10):
            r = google_api_query(query_string, i)

            for result in r.get('items', []):
                for key in list(set(result.keys()) - set(result_keys_mapping.keys())):
                    result.pop(key)
                for key, value in result_keys_mapping.iteritems():
                    result[value] = result.pop(key)
            res.extend(r.get('items', []))
        for index, dic in enumerate(res):
            dic['originalIndex'] = index + 1
        shuffle(res)
    except Exception as e:
        print e
        res = []
    return json.dumps(res)



def google_api_query(q_string, num_page):
    import urllib

    start = str(num_page * 10 + 1)
    searchTerm = q_string
    key = 'AIzaSyDXuZHEiucug5UFVrRYUhls26eYQfupCwY'
    cx = '007050846176263573226:le3uufjq018'
    searchUrl = "https://www.googleapis.com/customsearch/v1?q=" + \
        urllib.quote(searchTerm.encode('utf-8')) + "&key=" + key + "&cx=" + cx + "&start=" + start
    r = requests.get(searchUrl)
    response = r.content.decode('utf-8')
    result = json.loads(response)
    return result

