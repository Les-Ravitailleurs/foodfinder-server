const { GoogleSpreadsheet } = require("google-spreadsheet");

const ServiceDonation = require("../../service/donation");

const getLandingData = async (req, res) => {
  const donatorCount = await ServiceDonation.getDonatorCount();
  const doc = new GoogleSpreadsheet(
    "1S0m44Zs6lEqzp5M5Z3CmAXE9WUuy7AATbqbtZyKvw1Y"
  );
  await doc.useServiceAccountAuth({
    client_email: "les-ravitailleurs@les-ravitailleurs.iam.gserviceaccount.com",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQDgvxAy5bU8RWmc\nhO9vMfPLWa2ZLsLRb7W+/7O8YD8rR2K8myHd8d2/zakuC8ZyMjuY/lxvELqsBwl6\nkH0Te1bpofGguZagKGJJTGXz1jkaqeFZO5NKLzxLzJoRxpuaygPXVDxzG88Jl4a1\n2TgecCsdFYL9PXXbOGlT3ZZ0NpIMFxEhBaFcmy7IEwi0aZenyuY9im70+/fMqZkV\n3fpJb+D4u+QWNo+SkWFnHRG+jeZQWsE6K8CDovtW7B8TNy+sF9C4z9dwTej8cVnl\nk2shyq34mwubjsWvO+UlO5LevAzJDdUKKMXK2I0UNVW7/Xdmoby/qwf9a+2LgUvk\ng1A9ZuxVAgMBAAECgf8rv7A84s+Pa/OjBD2XkkxiyTzXFMMtAbyJ8ZHgmYZdEQhS\nA+C+fivW/7HEb4ZcXxWQMp4hAKCrMV4m/aQF/CcZqOyK3Or1QjyKXX97ImL7TcEQ\nHbNjks5UnaoKy8kpLdSRlf7ZFBC5TUXBIFz25TQp9TC1GxcAwCUWA4xwvYQF1hpE\nEgzWHTsNXNxKVD9CHBh6daLuHjnsElkU7VIg3t0aT/N/sQb0hTtr0NxVz9veNYkx\nCIsX0dy6DnXPUs25DHegYZfGqiF9WPeQ1jAwkkmcdMVyrsnJWpknJTQNpRUqNc8/\nms8pm17m7aTbguAJgEHyYWUhzgS86B5iAB9sA+cCgYEA9AyaD7iyHtR1Dvkz1qYy\nWFweiDykcY3cOxbA3Kh375oAthT/okPhS8a0YV8XIc7BUpCMYIOodPtSyPPkhmrk\n9/aHJqPn8H7+LIqoNOwCcGvNYk4hqYGiurpebuEJvPQwq1KNPc9ckm54xT5u9R3L\n+niijicTvguF3Gi4C5qqj8sCgYEA68B7EbDD5tsp+4Nwo3J96C8NIYHzZzdHRTwz\n4I4BZs381DgiPr91wgUxTSKk3GlG4DCLVROEmc+aFphM8O/Da/q23jmGIMt5ZJi3\nZE79cNblYeAR/zm2Av9x/93w+J8hygliufsPEpMTqLVEib3ppkqa1xj081j7UOLH\n0JfAsF8CgYA23fZs/msdP0qp+SDMa0T6VIuQuYGG/gu7RRxK/50nQwpR5VqrknM+\nZAf9tDExKpiQBWtp72+aDT7Javu/tJyRmt07tLHagdKHFQ1ICJ9rwvDD3yj2QOzi\n6i984h8cWhHvEnoqoUoAqdGBFs4/UVmgkCqLpwFrQo/vw6NNCJK8DQKBgQClp/wS\ngzY06r3GWSb2AwaL9zvv1qOVXJd9A/+kA8TiW04URVly5BA4BHQPMo/LvUIrWJEf\nd/aOKf2pcN1n0+Jq5qJG5v7j3nZvhIwhNQwLlUVbkBq1T/UgiCSv2WFxIkiY8h1o\neAywTZ7bxnvhmgwraHMDQCsnL9hwjto/LdMdWwKBgEGlFxKOpFPUJhbjYF9dO8DR\nwEw5yfWbuPUmq8nuthg7u1+ICcN7XkETKhHsvmoRRWyIVTOFeEtEgq0cwv7Cxtgl\nSllxRWGZkBaP6D+MF7goqpMl1AwszFF1FjO7usi0wx9JmhPilwxYVzOngiLP3Itm\nVM5nj+SbF7i1/ZgZWhlY\n-----END PRIVATE KEY-----\n",
  });
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  let mealCount = 0;
  let chefCount = 0;
  let benevoleCount = 0;
  for (const i in rows) {
    const row = rows[i];
    const name = row.NOM_VARIABLE;
    const value = row.VALEUR;

    if (name === "Repas") {
      mealCount = value;
    }
    if (name === "Chefs") {
      chefCount = value;
    }
    if (name === "Bénévoles") {
      benevoleCount = value;
    }
  }
  const sheet2 = doc.sheetsByIndex[1];
  const rows2 = await sheet2.getRows();
  const partenaires = [];
  for (const i in rows2) {
    const row = rows2[i];
    const name = row.NAME;
    const url = row.WEBSITE;

    if (name) {
      partenaires.push({ name, url });
    }
  }
  res.send({ donatorCount, mealCount, chefCount, benevoleCount, partenaires });
};

module.exports = { getLandingData };
