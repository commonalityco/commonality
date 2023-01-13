/* eslint-disable @typescript-eslint/naming-convention */
import http, { type RequestListener, type Server } from 'node:http';
import { parse as parseUrl } from 'node:url';
import { jest } from '@jest/globals';

export const mockAuthServerSpy = jest.fn();

export const mockDeviceCodeResponse = jest.fn<
	() => {
		device_code: string;
		user_code: string;
		verification_uri: string;
		verification_uri_complete: string;
		expires_in: number;
		interval: number;
	}
>();

export const mockOAuthTokenResponse = jest.fn<
	() => {
		access_token: string;
		expires_in: number;
		token_type: string;
	}
>();

const mockLoginApi: RequestListener = (request, response) => {
	mockAuthServerSpy(request);

	const { url = '/', method } = request;
	const { pathname = '/' } = parseUrl(url, true);

	console.log(`[mock-auth-server] ${String(method)} ${String(pathname)}`);

	response.setHeader('content-type', 'application/json');

	if (method === 'POST' && pathname === '/oauth/device/code') {
		response.end(JSON.stringify(mockDeviceCodeResponse()));
	} else if (method === 'POST' && pathname === '/oauth/token') {
		response.end(JSON.stringify(mockOAuthTokenResponse()));
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
