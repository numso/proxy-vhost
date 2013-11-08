proxy-vhost
===========

A simple project to proxy domains and subdomains. Domains are hardcoded in while subdomains are read from a couch database.

###To use

1. Edit config/default.js (or create config/production.js)

```
module.exports = {
  port: 80,        // the port you want to run on
  token: 'test',   // the secret token used to refresh your subdomains
  couch: {         // your couch config
    host: 'localhost',
    port: 5984,
    db: 'subdomains'
  },
  domains: [       // a list of domains that your app can proxy to
    'example.com'
  ]
};
```

2. Populate Couch

Each couch record should look like this:
(Note: `host` can be set to any valid host/port. Example: `localhost:4030` or `www.mysite.com` )

```
{
   "_id": "21edda0a414153e1a2e316b41c10cae7",
   "_rev": "1-ed294bcaee93d1ec9ac1e6f439304d22",
   "domain": "example.com",    // the domain you're using
   "sub": "www",               // the subdomain you wish to use
   "host": "localhost:3005"    // the host you're routing to
}
```

You should also add under the design docs for your subdomains database

```
{
   "_id": "_design/_view",
   "_rev": "1-b4518c63183b699ff060ded22fd00c36",
   "language": "javascript",
   "views": {
       "getDomain": {
           "map": "function(doc){emit(doc.domain, doc);}"
       }
   }
}
```

3. Refresh URL

If, while the app is running, you add new subdomains to couch, there is a way to refresh your app.

You just need to make a request (any method will do) to `http://refresh.YOURDOMAIN?token=TOKEN`

For example, if I have the domains my-site.com and example.com, I could do a GET request to either `refresh.example.com?token=TOKEN` or `refresh.my-site.com?token=TOKEN` where TOKEN is the token I set in step 1
