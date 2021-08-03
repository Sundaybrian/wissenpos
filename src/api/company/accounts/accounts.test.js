const request = require('supertest');
const app = require('../../../app');
const Account = require('./accounts.model');
const Role = require('../../../utils/role');

// variables
let token1, token2, token3;

beforeAll(function (done) {
  request(app)
    .post('/api/v1/accounts/login')
    .send({
      email: 'sunday@owner.com',
      password: '12345678yh',
    })
    .end(function (err, res) {
      if (err) throw err;
      token1 = res.body.token;

      request(app)
        .post('/api/v1/accounts/login')
        .send({
          email: 'sunday@owner.com',
          password: '12345678yh',
        })
        .end(function (err, res) {
          if (err) throw err;
          token2 = res.body.token;
          request(app)
            .post('/api/v1/accounts/login')
            .send({
              email: 'diff@owner.com',
              password: '12345678yh',
            })
            .end(function (err, res) {
              if (err) throw err;
              token3 = res.body.token;
              done();
            });
        });
    });
});

// create staff account

// post tests
describe('POST /api/v1/company/', () => {
  it('should fail to create a staff account for another', async () => {
    const res = await request(app)
      .post('/api/v1/company/2/accounts')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        company_id: 2,
        user: {
          firstName: 'test',
          lastName: 'staff',
          phoneNumber: '0712345567',
          password: 'localtestuser',
          confirmPassword: 'localtestuser',
          email: 'test@staff.com',
          role: Role.staff,
        },
      })
      .expect('Content-Type', /json/)
      .expect(400);
  });

  it('should create a company staff account', async () => {
    const res = await request(app)
      .post('/api/v1/company/1/accounts')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        company_id: 1,
        user: {
          firstName: 'test',
          lastName: 'staff',
          phoneNumber: '0712345567',
          password: 'localtestuser',
          confirmPassword: 'localtestuser',
          email: 'test@staff.com',
          role: Role.staff,
        },
      })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.firstName).toBe('test');
    expect(res.body.lastName).toBe('staff');
  });
});

// fetch company accounts
describe('GET /api/v1/company/:company_id/accounts', () => {
  it('should fail to fetch company accounts for another company', async () => {
    const res = await request(app)
      .get('/api/v1/company/2/accounts')
      .set('Authorization', `Bearer ${token1}`)
      .expect(401);

    expect(res.body.message).toBe('Unauthorized');
  });

  it('should fetch company accounts', async () => {
    const res = await request(app)
      .get('/api/v1/company/1/accounts')
      .set('Authorization', `Bearer ${token1}`)
      .expect(200);
    console.log(res.body);
    expect(res.body).toBeTruthy();
  });
});
