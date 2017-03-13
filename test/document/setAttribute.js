'use strict';

describe('setAttribute', function () {
  let db;
  let newDoc = {};
  const array = [1,2,3];

  before(function(){
    return resetDb().then(instance => db = instance);
  });

  before(function() {
    return db.saveDoc('docs', {name:'Foo', score:1}).then(doc => newDoc = doc);
  });

  it('check saved attribute', function() {
    assert.equal(1, newDoc.score);
  });

  it('updates the document', function() {
    return db.docs.setAttribute(newDoc.id, 'vaccinated', true).then(doc => {
      assert.isTrue(doc.vaccinated);
    });
  });

  it.skip('nulls out a field', function() {
    // TODO it's trying to null out the entire body; jsonb_set doesn't seem to respect path
    return db.docs.setAttribute(newDoc.id, 'vaccinated', null).then(doc => {
      assert.isNull(doc.vaccinated);
    });
  });

  it('updates the document when passed array value', function() {
    return db.docs.setAttribute(newDoc.id, 'array', array).then(doc => {
      assert.deepEqual(doc.array, array);
    });
  });

  it('updates the document without replacing existing attributes', function() {
    return db.docs.setAttribute(newDoc.id, 'score', 99).then(doc => {
      assert.equal(doc.score, 99);
      assert.equal(doc.vaccinated, true);
      assert.equal(doc.id, newDoc.id);
      assert.deepEqual(doc.array, array);
    });
  });

  it('escapes values properly', function() {
    return db.docs.setAttribute(newDoc.id, 'field', 'value').then(doc => {
      assert.equal(doc.score, 99);
      assert.equal(doc.vaccinated, true);
      assert.equal(doc.field, 'value');
      assert.equal(doc.id, newDoc.id);
      assert.deepEqual(doc.array, array);
    });
  });

  after(function () {
    return db.docs.destroy({id: newDoc.id});
  });
});