const request = require('supertest');
const app = require('../../../../app');

let token1;

describe('POST /api/v1/company/:company_id/menu/:menu_id/category/', () => {
  beforeEach(function (done) {
    request(app)
      .post('/api/v1/accounts/login')
      .send({
        email: 'sunday@owner.com',
        password: '12345678yh',
      })
      .end(function (err, res) {
        if (err) throw err;
        token1 = res.body.token;
        done();
      });
  });

  it('should fail to creat a category for another company', async () => {
    await request(app)
      .post('/api/v1/company/2/menu/2/category')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        name: 'cat2',
        menu_id: 2,
      })
      .expect(401);
  });

  it('should create a category for your company menu', async () => {
    const res = await request(app)
      .post('/api/v1/company/1/menu/1/category')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        name: 'cat2',
        menu_id: 1,
      })
      .expect(200);

    expect(res.body.name).toBe('cat2');
  });

  it('should fail to create a category with missing field', async () => {
    const res = await request(app)
      .post('/api/v1/company/1/menu/1/category')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        name: 'cat2',
      })
      .expect(500);
  });
});

describe('GET /api/v1/company/:company_id/menu/:menu_id/category/', () => {
  it('should return 404 for a non existent company categories', async () => {
    await request(app).get('/api/v1/company/10/menu/10/category').expect(404);
  });

  it('should return 200 exsting company categories', async () => {
    const res = await request(app).get('/api/v1/company/1/menu/1/category').expect(200);

    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe('GET /api/v1/company/:company_id/menu/:menu_id/category/:id', () => {
  it('should return 404 for a non existent  categories', async () => {
    await request(app).get('/api/v1/company/10/menu/10/category/10').expect(404);
  });

  it('should return 200 for existing company category', async () => {
    const res = await request(app).get('/api/v1/company/1/menu/1/category/2').expect(200);

    expect(res.body.name).toBe('cat2');
  });
});

describe('PATCH /api/v1/company/:company_id/menu/:menu_id/category/:id', () => {
  beforeEach(function (done) {
    request(app)
      .post('/api/v1/accounts/login')
      .send({
        email: 'sunday@owner.com',
        password: '12345678yh',
      })
      .end(function (err, res) {
        if (err) throw err;
        token1 = res.body.token;
        done();
      });
  });

  it('should not update another company category ', async () => {
    await request(app)
      .patch('/api/v1/company/2/menu/10/category/10')
      .set('Authorization', `Bearer ${token1}`)
      .expect(401);
  });

  it('should update category ', async () => {
    const res = await request(app)
      .patch('/api/v1/company/1/menu/1/category/1')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        name: 'catness',
      })
      .expect(200);
  });
});

describe('DELETE /api/v1/company/:company_id/menu/:menu_id/category/:id', () => {
  beforeEach(function (done) {
    request(app)
      .post('/api/v1/accounts/login')
      .send({
        email: 'sunday@owner.com',
        password: '12345678yh',
      })
      .end(function (err, res) {
        if (err) throw err;
        token1 = res.body.token;
        done();
      });
  });

  it('should delete another company category', async () => {
    await request(app)
      .delete('/api/v1/company/2/menu/10/category/10')
      .set('Authorization', `Bearer ${token1}`)
      .expect(401);
  });

  it('should delete a category ', async () => {
    const res = await request(app)
      .delete('/api/v1/company/1/menu/1/category/1')
      .set('Authorization', `Bearer ${token1}`)
      .expect(200);

    expect(res.body.id).toBe(1);
  });
});
