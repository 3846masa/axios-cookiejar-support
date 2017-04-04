'use strict';

const assert = require('power-assert');
const nock = require('nock');
const tough = require('tough-cookie');
const cookie = require('cookie');
const decache = require('decache');
const axiosCookieJarSupport = require('../');

let axios;
beforeEach(() => {
  decache('axios');
  axios = require('axios');
  axios.defaults.validateStatus = () => true;
});

describe('axiosCookieJarSupport', () => {
  it('should enable default axios instance to support cookiejar', () => {
    axiosCookieJarSupport(axios);
    assert.ok(axios);
  });

  it('should enable created axios instance to support cookiejar', () => {
    const instance = axios.create();
    axiosCookieJarSupport(instance);
    assert.ok(instance);
  });
});

describe('axios', () => {
  let cookieJar;
  beforeEach(() => {
    axiosCookieJarSupport(axios);
    cookieJar = new tough.CookieJar();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it('should receive response', (done) => {
    nock('http://example.com')
      .get('/')
      .reply(200);

    axios.get('http://example.com')
      .then((res) => {
        assert.strictEqual(res.status, 200);
      })
      .then(done).catch(done);
  });

  context('when response has redirect', () => {
    let nockHost;
    beforeEach(() => {
      nockHost = nock('http://example.com');
    });

    it('should not redirect if config.maxRedirects = 0', (done) => {
      nockHost.get('/').reply(302, null, {
        'Location': 'http://example.com/redirect'
      });

      axios.get('http://example.com', { maxRedirects: 0 })
        .then((res) => {
          assert.strictEqual(res.status, 302);
        })
        .then(done).catch(done);
    });

    it('should redirect 30X response', (done) => {
      nockHost.post('/').reply(302, null, {
        'Location': 'http://example.com/redirect'
      });
      nockHost.get('/redirect').reply(200);

      axios.post('http://example.com')
        .then((res) => {
          assert.strictEqual(res.status, 200);
        })
        .then(done).catch(done);
    });

    it('should redirect many times 30X response', (done) => {
      nockHost.post('/').reply(302, null, {
        'Location': 'http://example.com/redirect/01'
      });
      nockHost.get('/redirect/01').reply(302, null, {
        'Location': 'http://example.com/redirect/02'
      });
      nockHost.get('/redirect/02').reply(200);

      axios.post('http://example.com')
        .then((res) => {
          assert.strictEqual(res.status, 200);
        })
        .then(done).catch(done);
    });

    it('should redirect 307 response', (done) => {
      nockHost.post('/').reply(307, null, {
        'Location': 'http://example.com/redirect'
      });
      nockHost.post('/redirect').reply(200);

      axios.post('http://example.com')
        .then((res) => {
          assert.strictEqual(res.status, 200);
        })
        .then(done).catch(done);
    });
  });

  context('when hasn\'t defaults.jar', () => {
    context('and hasn\'t config.jar', () => {
      it('should not create cookiejar', (done) => {
        nock('http://example.com')
          .get('/')
          .reply(200);

        axios.get('http://example.com')
          .then((res) => {
            assert.ok(!res.config.jar);
          })
          .then(done).catch(done);
      });
    });

    context('and has config.jar', () => {
      it('should create cookiejar if config.jar = true', (done) => {
        nock('http://example.com')
          .get('/')
          .reply(200);

        axios.get('http://example.com', { jar: true })
          .then((res) => {
            assert.ok(res.config.jar);
            assert.notStrictEqual(res.config.jar, true);
            assert.strictEqual(res.config.jar.constructor, tough.CookieJar);
          })
          .then(done).catch(done);
      });

      it('should not create cookiejar if cookie.jar = false', (done) => {
        nock('http://example.com')
          .get('/')
          .reply(200);

        axios.get('http://example.com', { jar: false })
          .then((res) => {
            assert.ok(!res.config.jar);
          })
          .then(done).catch(done);
      });

      it('should use config.jar if config.jar = CookieJar', (done) => {
        nock('http://example.com')
          .get('/')
          .reply(200);

        axios.get('http://example.com', { jar: cookieJar })
          .then((res) => {
            assert.strictEqual(res.config.jar, cookieJar);
          })
          .then(done).catch(done);
      });
    });
  });

  context('when has defaults.jar', () => {
    beforeEach(() => {
      axios.defaults.jar = cookieJar;
    });

    context('and hasn\'t config.jar', () => {
      it('should create cookiejar if defaults.jar = true', (done) => {
        nock('http://example.com')
          .get('/')
          .reply(200);

        axios.defaults.jar = true;
        axios.get('http://example.com')
          .then((res) => {
            assert.ok(res.config.jar);
            assert.notStrictEqual(res.config.jar, true);
            assert.strictEqual(res.config.jar.constructor, tough.CookieJar);

            assert.ok(axios.defaults.jar);
            assert.notStrictEqual(axios.defaults.jar, true);
            assert.strictEqual(axios.defaults.jar.constructor, tough.CookieJar);
          })
          .then(done).catch(done);
      });

      it('should use defaults.jar if defaults.jar = CookieJar', (done) => {
        nock('http://example.com')
          .get('/')
          .reply(200);

        axios.get('http://example.com')
          .then((res) => {
            assert.strictEqual(res.config.jar, cookieJar);
            assert.strictEqual(res.config.jar, axios.defaults.jar);
          })
          .then(done).catch(done);
      });
    });

    context('and has config.jar', () => {
      it('should create cookiejar if defaults.jar = true && config.jar = true', (done) => {
        nock('http://example.com')
          .get('/')
          .reply(200);

        axios.defaults.jar = true;
        axios.get('http://example.com', { jar: true })
          .then((res) => {
            assert.ok(res.config.jar);
            assert.notStrictEqual(res.config.jar, true);
            assert.strictEqual(res.config.jar.constructor, tough.CookieJar);

            assert.ok(axios.defaults.jar);
            assert.notStrictEqual(axios.defaults.jar, true);
            assert.strictEqual(axios.defaults.jar.constructor, tough.CookieJar);
          })
          .then(done).catch(done);
      });

      it('should use defaults.jar if config.jar = true', (done) => {
        nock('http://example.com')
          .get('/')
          .reply(200);

        axios.get('http://example.com', { jar: true })
          .then((res) => {
            assert.strictEqual(res.config.jar, axios.defaults.jar);
          })
          .then(done).catch(done);
      });

      it('should not create cookiejar if config.jar = false', (done) => {
        nock('http://example.com')
          .get('/')
          .reply(200);

        axios.get('http://example.com', { jar: false })
          .then((res) => {
            assert.ok(!res.config.jar);
          })
          .then(done).catch(done);
      });

      it('should use config.jar if config.jar = CookieJar', (done) => {
        const anotherCookieJar = new tough.CookieJar();
        nock('http://example.com')
          .get('/')
          .reply(200);

        axios.get('http://example.com', { jar: anotherCookieJar })
          .then((res) => {
            assert.notStrictEqual(res.config.jar, axios.defaults.jar);
          })
          .then(done).catch(done);
      });
    });
  });

  context('when has cookiejar', () => {
    let originalCookie;
    beforeEach(() => {
      axios.defaults.jar = cookieJar;
      originalCookie = new tough.Cookie({
        key: 'test',
        value: 'value'
      });
    });

    it('should store cookie', (done) => {
      nock('http://example.com')
        .get('/')
        .reply(200, null, {
          'Set-Cookie': originalCookie.toString()
        });

      axios.get('http://example.com')
        .then((res) => {
          const receivedCookies = res.config.jar.getCookiesSync('http://example.com');
          assert.strictEqual(receivedCookies.length, 1);
          assert.strictEqual(receivedCookies[0].key, originalCookie.key);
          assert.strictEqual(receivedCookies[0].value, originalCookie.value);
        })
        .then(done).catch(done);
    });

    it('should send cookie if withCredentials = true', (done) => {
      cookieJar.setCookieSync(originalCookie, 'http://example.com');

      nock('http://example.com')
        .matchHeader('cookie', (value) => {
          assert.ok(value);
          const receivedCookie = cookie.parse(value);
          assert.ok(originalCookie.key in receivedCookie);
          assert.strictEqual(receivedCookie[originalCookie.key], originalCookie.value);
          return true;
        })
        .get('/')
        .reply(200);

      axios.get('http://example.com', { withCredentials: true })
        .then((res) => {
          assert.strictEqual(res.status, 200);
        }).then(done).catch(done);
    });

    it('should not send cookie if withCredentials = false', (done) => {
      cookieJar.setCookieSync(originalCookie, 'http://example.com');

      nock('http://example.com')
        .matchHeader('cookie', (value) => {
          assert.ok(!value);
          return true;
        })
        .get('/')
        .reply(200);

      axios.get('http://example.com', { withCredentials: false })
        .then((res) => {
          assert.strictEqual(res.status, 200);
        }).then(done).catch(done);
    });

    it('should send all cookies if set headers[\'Cookie\']', (done) => {
      cookieJar.setCookieSync(originalCookie, 'http://example.com');

      nock('http://example.com')
        .matchHeader('cookie', (value) => {
          assert.ok(value);
          const receivedCookie = cookie.parse(value);
          assert.ok(originalCookie.key in receivedCookie);
          assert.strictEqual(receivedCookie[originalCookie.key], originalCookie.value);
          assert.ok('from' in receivedCookie);
          assert.strictEqual(receivedCookie['from'], 'string');
          return true;
        })
        .get('/')
        .reply(200);

      axios.get('http://example.com', {
        headers: { 'Cookie': 'from=string' },
        withCredentials: true
      })
        .then((res) => {
          assert.strictEqual(res.status, 200);
        }).then(done).catch(done);
    });
  });
});
