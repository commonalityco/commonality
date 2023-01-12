/* eslint-disable @typescript-eslint/naming-convention */
import http, { type RequestListener, type Server } from 'node:http';
import { parse as parseUrl } from 'node:url';
import { jest } from '@jest/globals';

export const mockAuthServerSpy = jest.fn();

const mockLoginApi: RequestListener = (request, response) => {
	mockAuthServerSpy(request);

	const { url = '/', method } = request;
	const { pathname = '/' } = parseUrl(url, true);

	console.log(`[mock-auth-server] ${String(method)} ${String(pathname)}`);

	response.setHeader('content-type', 'application/json');

	if (method === 'POST' && pathname === '/oauth/device/code') {
		response.end(
			JSON.stringify({
				device_code: 'ABC-DEF',
				user_code: '123',
				verification_uri: request.url,
				verification_uri_complete: request.url,
				expires_in: 123,
				interval: 5,
			})
		);
	} else if (method === 'POST' && pathname === '/oauth/token') {
		response.end(
			JSON.stringify({
				access_token: '123',
				expires_in: 123,
				token_type: 'access_token',
			})
		);
	} else {
		response.statusCode = 405;
		response.end(JSON.stringify({ code: 'method_not_allowed' }));
	}
};

export const createMockAuthServer = async (): Promise<{
	server: Server;
	url: string;
}> => {
	return new Promise((resolve) => {
		const server = http.createServer(mockLoginApi).listen(0, () => {
			const address = server.address();

			if (typeof address !== 'string' && address !== null) {
				const loginApiUrl = `http://localhost:${address.port}`;

				console.log(`[mock-auth-server] Listening on ${loginApiUrl}`);

				resolve({ server, url: loginApiUrl });
			}
		});
	});
};
