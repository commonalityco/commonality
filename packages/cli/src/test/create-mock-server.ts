import http, { type RequestListener, type Server } from 'node:http';
import { Buffer } from 'node:buffer';
import { parse as parseUrl } from 'node:url';
import { jest } from '@jest/globals';
import type { SnapshotData } from '@commonalityco/types';

export const mockServerSpy = jest.fn();

const mockCommonalityApi: RequestListener = (request, response) => {
	mockServerSpy(request);

	const { url = '/', method } = request;

	const { pathname = '/' } = parseUrl(url, true);

	console.log(`[mock-api-server] ${String(method)} ${String(pathname)}`);

	response.setHeader('content-type', 'application/json');

	if (method === 'POST' && pathname === '/api/cli/publish') {
		const body: Buffer[] = [];

		request
			.on('data', (chunk: Buffer) => {
				body.push(chunk);
			})
			.on('end', () => {
				const parsedBody = JSON.parse(
					Buffer.concat(body).toString()
				) as SnapshotData;

				response.end(
					JSON.stringify({
						url: `https://app.commonality.co/monorepo/root/${parsedBody.branch}`,
					})
				);
				// At this point, `body` has the entire request body stored in it as a string
			});
	} else {
		response.statusCode = 405;
		response.end(JSON.stringify({ code: 'method_not_allowed' }));
	}
};

export const createMockServer = async (): Promise<{
	server: Server;
	url: string;
}> => {
	return new Promise((resolve) => {
		const server = http.createServer(mockCommonalityApi).listen(0, () => {
			const address = server.address();

			if (typeof address !== 'string' && address !== null) {
				const apiUrl = `http://localhost:${address.port}`;

				console.log(`[mock-api-server] Listening on ${apiUrl}`);

				resolve({ server, url: apiUrl });
			}
		});
	});
};
