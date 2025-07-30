export const json = (obj) =>
  JSON.parse(
    JSON.stringify(obj, (_, v) =>
      typeof v === 'bigint' ? Number(v) : v
    )
  );
