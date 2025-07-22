from flask import jsonify, url_for

class APIException(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv

def has_no_empty_params(rule):
    defaults = rule.defaults if rule.defaults is not None else ()
    arguments = rule.arguments if rule.arguments is not None else ()
    return len(defaults) >= len(arguments)

def generate_sitemap(app):
    links = ['/admin/']
    for rule in app.url_map.iter_rules():
        if "GET" in rule.methods and has_no_empty_params(rule):
            url = url_for(rule.endpoint, **(rule.defaults or {}))
            if "/admin/" not in url:
                links.append(url)

    links_html = "".join([
        f"<li style='margin-bottom:8px;'><a href='{y}' style='color:#0d6efd; font-size:1rem;'>{y}</a></li>"
        for y in links
    ])

    return f"""
        <div style='text-align:center; font-family:Segoe UI, sans-serif; padding: 2rem; background:#f8f9fa;'>
            <img style='max-height: 100px;' src='https://storage.googleapis.com/breathecode/boilerplates/rigo-baby.jpeg' />
            <h1 style='color:#0d6efd;'>🌟 Welcome to Your Flask API!</h1>
            <p style='color:#333;'>Explore your available endpoints below:</p>
            <ul style='text-align: left; max-width: 500px; margin: 2rem auto; padding-left: 0; list-style: none;'>{links_html}</ul>
            <footer style='margin-top: 2rem; font-size: 0.9rem; color: #666;'>Made with Flask ❤️</footer>
        </div>
    """

