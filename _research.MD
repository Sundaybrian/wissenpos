## postgis and knex

- knex-postgis

## creating a point type

```js

Try this instead:

table.specificType('coordinates', 'POINT').defaultTo(knex.raw('POINT (37.3875, -122.0575)'))

For the SQL types not covered by Knex, you can always use the following format:

table.specificType('column_name', 'TYPE')
```

## create geom

```js
What you can do. Pass your geometry to your API like this

"geom": "Point(-71.064544 44.28787)"
And in your route handler

create(poi) {
  const sql = db.insert({
    place: poi.place,
    comments: poi.comments,
    numbers: poi.numbers,
    geom: st.geomFromText(poi.geom, 4326)
  }).returning('*').into('poi');
  return sql;
}
```
