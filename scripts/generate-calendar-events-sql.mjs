import fs from "node:fs";
import path from "node:path";

const seedPath = path.resolve("../docs/calendar-events-seed-2020-2035.json");
const outPath = path.resolve("../docs/calendar-events-seed-2020-2035.sql");

const j = JSON.parse(fs.readFileSync(seedPath, "utf8"));
const rows = Array.isArray(j?.rows) ? j.rows : [];

const esc = (s) => String(s).replace(/'/g, "''");

const chunkSize = 400;
const chunks = [];

for (let i = 0; i < rows.length; i += chunkSize) {
	const part = rows.slice(i, i + chunkSize);
	const values = part
		.map(
			(r) =>
				`('${r.date}'::date,'${r.type}','${esc(r.name)}','${esc(r.name_norm)}')`
		)
		.join(",\n");
	chunks.push(
		`insert into public.calendar_events (event_date,event_type,name,name_norm) values\n${values};`
	);
}

fs.writeFileSync(outPath, `${chunks.join("\n\n")}\n`);
process.stdout.write(
	JSON.stringify({ seedPath, outPath, rows: rows.length, chunks: chunks.length })
);

