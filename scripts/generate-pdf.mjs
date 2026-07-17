import fs from 'fs';
import puppeteer from 'puppeteer';
import { parseArgs } from 'util';

const { values: options } = parseArgs({
	options: {
		path: { type: 'string' },
		out: { type: 'string' },
	},
});

const browser = await puppeteer.launch();
const page = await browser.newPage();

await page.goto(`file://${options.path}`, {
	waitUntil: 'networkidle2',
});

const pdf = await page.pdf({
	format: 'A4',
	// We need this for list item markers that use background-color
	printBackground: true,
	// Tagged PDF exposes a structure tree for accessibility tools and some ATS parsers
	tagged: true,
});

fs.writeFileSync(options.out, pdf);

await browser.close();
