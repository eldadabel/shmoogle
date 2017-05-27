import sys
import os
import logging

from google.appengine.ext import vendor

def add_lib_path():
    lib_directory = os.path.dirname(__file__) + "/lib"
    logging.info("importing lib %s" % (lib_directory))
    vendor.add(lib_directory)
    sys.path.insert(0, lib_directory)

add_lib_path()

from requests_toolbelt.adapters import appengine
appengine.monkeypatch()
