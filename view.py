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


@app.route('/shmoogle/origin/<query_string>', methods=['GET'])
@crossdomain(origin='*')
def query(query_string):
    res = []
    result_keys = ['content', 'url', 'title', 'contentNoFormatting', 'visibleUrl', 'titleNoFormatting']
    for i in range(1, 6):
        r = _query(query_string, i)
        for result in r['results']:
            for key in list(set(result.keys())-set(result_keys)):
                result.pop(key)
        res.extend(r['results'])

    for index, dic in enumerate(res):
        dic['originalIndex'] = index + 1
    shuffle(res)
    return json.dumps(res)



@app.route('/shmoogle/<query_string>')
@crossdomain(origin='*')
def query_google_api(query_string):
    res = []
    result_keys_mapping = {'htmlSnippet': 'content', 'htmlFormattedUrl': 'url', 'title': 'title',
                           'snippet': 'contentNoFormatting', 'link': 'visibleUrl', 'htmlTitle': 'titleNoFormatting'}

    try:
        for i in range(0, 10):
            r = google_api_query(query_string, i)

            for result in r.get('items', {}):
                for key in list(set(result.keys()) - set(result_keys_mapping.keys())):
                    result.pop(key)
                for key, value in result_keys_mapping.iteritems():
                    result[value] = result.pop(key)
            res.extend(r['items'])

        for index, dic in enumerate(res):
            dic['originalIndex'] = index + 1
        shuffle(res)
    except:
        res = []
    return json.dumps(res)


def _query(q_string, num_page):
    res = requests.get(
        'https://www.googleapis.com/customsearch/v1element?key=AIzaSyCVAXiUzRYsML1Pv6RwSG1gunmMikTzQqY&rsz=20&num=20&start=%s&hl=en&prettyPrint=ture&source=gcsc&gss=.il&sig=584853a42cc2f90f5533642697d97114&cx=018389270637479457292:0wcjrpj6kes&q=%s&sort=&googlehost=www.google.com&oq=%s&callback=google.search.Search.apiary18188' % (
        (int(num_page) - 1) * 20, q_string, q_string)).content

    return eval(res[res.find('(') + 1: res.rfind(')')].replace('\n', ''))


def google_api_query(q_string, num_page):
    import requests
    import json
    import urllib

    start = str(num_page * 10 + 1)
    searchTerm = q_string
    key = 'AIzaSyCTju7iD4QWgF6ROuKnx3V0_3AfOV0DZeQ'
    cx = '007050846176263573226:le3uufjq018'
    searchUrl = "https://www.googleapis.com/customsearch/v1?q=" + \
        urllib.quote(searchTerm.encode('utf-8')) + "&key=" + key + "&cx=" + cx + "&start=" + start
    r = requests.get(searchUrl)
    response = r.content.decode('utf-8')
    result = json.loads(response)
    return result

