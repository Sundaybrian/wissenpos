const request = require('supertest');
const app = require('../../../../../app');

let token1;
// api/v1/company/:company_id/menu/:menu_id/category/:category_id/item

describe('POST /api/v1/company/:company_id/menu/:menu_id/category/:category_id/item', () => {
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

  it('should fail to create a category item for another company', async () => {
    await request(app)
      .post('/api/v1/company/2/menu/2/category/2/item')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        name: 'Beef matumbo',
        price: 200,
        quantity: 100,
        description: 'sweet beef matumbo',
        image_url: 'https://i.pinimg.com/736x/bf/6d/ff/bf6dff9d4f719e650beb1488208ba39d.jpg',
        category_id: 2,
      })
      .expect(401);
  });

  it('should create a category item for your company menu', async () => {
    const res = await request(app)
      .post('/api/v1/company/1/menu/1/category/1/item')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        name: 'Beef matumbo',
        price: 200,
        quantity: 100,
        description: 'sweet beef matumbo',
        image_url: 'https://i.pinimg.com/736x/bf/6d/ff/bf6dff9d4f719e650beb1488208ba39d.jpg',
        category_id: 1,
      })
      .expect(201);

    expect(res.body.name).toBe('Beef matumbo');
  });

  it('should fail to create a category item for your company menu with missing field', async () => {
    const res = await request(app)
      .post('/api/v1/company/1/menu/1/category/1/item')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        name: 'Beef matumbo',
        price: 200,
        quantity: 100,
        description: 'sweet beef matumbo',
        image_url: 'https://i.pinimg.com/736x/bf/6d/ff/bf6dff9d4f719e650beb1488208ba39d.jpg',
      })
      .expect(500);

    // expect(res.body.name).toBe("Beef matumbo");
  });
});

describe('GET/api/v1/company/:company_id/menu/:menu_id/category/:category_id/item', () => {
  it('should return 404 for a non existent item', async () => {
    await request(app).get('/api/v1/company/2/menu/2/category/2/item/102').expect(404);
  });

  it('should return 200 for an existing item', async () => {
    const res = await request(app).get('/api/v1/company/1/menu/1/category/1/item/1').expect(200);

    expect(res.body.name).toBe('Beef matumbo seed');
  });
});

describe('Patch /api/v1/company/:company_id/menu/:menu_id/category/:category_id/item/:id', () => {
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

  it('should fail to update a category item for another company', async () => {
    await request(app)
      .patch('/api/v1/company/2/menu/2/category/2/item/2')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        name: 'Beef matumbo',
        price: 200,
        quantity: 100,
        description: 'sweet beef matumbo',
        image_url: 'https://i.pinimg.com/736x/bf/6d/ff/bf6dff9d4f719e650beb1488208ba39d.jpg',
        category_id: 2,
      })
      .expect(401);
  });

  it('should update a category item for your company menu', async () => {
    const res = await request(app)
      .patch('/api/v1/company/1/menu/1/category/1/item/1')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        name: 'Beef matumbo updated',
        price: 2000,
        quantity: 10,
        description: 'sweet beef matumbo updated',
      })
      .expect(200);

    expect(res.body.name).toBe('Beef matumbo updated');
    expect(res.body.id).toBe(1);
  });

  it('should not updated 404 for a non existent item menu', async () => {
    const res = await request(app)
      .patch('/api/v1/company/1/menu/1/category/1/item/102')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        name: 'Beef matumbo updated',
        price: 2000,
        quantity: 10,
        description: 'sweet beef matumbo updated',
      })
      .expect(404);
  });
});

describe('DELETE /api/v1/company/:company_id/menu/:menu_id/category/:category_id/item/:id', () => {
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

  it('should fail to delete a category item for another company', async () => {
    await request(app)
      .delete('/api/v1/company/2/menu/2/category/2/item/2')
      .set('Authorization', `Bearer ${token1}`)
      .expect(401);
  });

  it('should delete a category item for your company menu', async () => {
    const res = await request(app)
      .delete('/api/v1/company/1/menu/1/category/1/item/1')
      .set('Authorization', `Bearer ${token1}`)
      .expect(200);

    expect(res.body.message).toBe('Item deleted successfully');
    expect(res.body.id).toBe(1);
  });
});
