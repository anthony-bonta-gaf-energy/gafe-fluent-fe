// @vitest-environment node
import { http, HttpResponse } from "msw";

import { setupServer, SetupServerApi } from "msw/node";
import { v4 } from "uuid";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { HttpRequestBuilder } from "./http-request.mjs";
import { createDefaultHttpService } from "./http-service-axios.mjs";

describe("HttpServiceAxios", () => {
  const domain = "https://mock.gaf.energy";
  const id = v4();
  const filter = "qp";
  const name = "Bruce Wayne";
  const success = { id, name };
  const noData = { message: "Data not found" };
  const failure = { message: "Something went wrong" };

  let server: SetupServerApi;

  const getService = () => {
    return createDefaultHttpService();
  };

  beforeAll(() => {
    server = setupServer(
      http.get(`${domain}/api/success?filter=${filter}`, () =>
        HttpResponse.json(success, { status: 200 }),
      ),
      http.get(`${domain}/api/success/${id}`, () =>
        HttpResponse.json(success, { status: 200 }),
      ),
      http.get(`${domain}/api/failure/client`, () =>
        HttpResponse.json(noData, { status: 404 }),
      ),
      http.get(`${domain}/api/failure/server`, () =>
        HttpResponse.json(failure, { status: 500 }),
      ),

      http.post(`${domain}/api/success`, async (r) => {
        const response = await r.request.json();

        return HttpResponse.json(response, { status: 201 });
      }),

      http.get(`${domain}/api/failure/internal`, () => {
        throw new Error(failure.message);
      }),
    );
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  describe("Success", () => {
    it("should return a response with the data", async () => {
      // Arrange.
      const url = `${domain}/api/success/${id}`;
      const request = new HttpRequestBuilder().get().url(url).build();
      const service = getService();

      // Act.
      const response = await service.request(request);
      const actual = response.data;

      // Assert.
      expect(actual).toEqual(success);
    });

    it("should return a response with filtered data", async () => {
      // Arrange.
      const url = `${domain}/api/success`;
      const request = new HttpRequestBuilder()
        .get()
        .url(url)
        .params({ filter })
        .build();
      const service = getService();

      // Act.
      const response = await service.request(request);
      const actual = response.data;

      // Assert.
      expect(actual).toEqual(success);
    });

    it("should map the status code", async () => {
      // Arrange.
      const url = `${domain}/api/success`;
      const expected = 201;
      const request = new HttpRequestBuilder()
        .post(JSON.stringify(success))
        .url(url)
        .build();
      const service = getService();

      // Act.
      const { status: actual } = await service.request(request);

      // Assert.
      expect(actual).toEqual(expected);
    });
  });

  describe("Error", () => {
    describe("Endpoint not found", () => {
      it("should return a rejected promise if the endpoint cannot be hit", async () => {
        // Arrange.
        const url = `${domain}/api/does-not-exist`;
        const request = new HttpRequestBuilder().get().url(url).build();
        const service = getService();
        const expected = { status: 404, data: { message: expect.any(String) } };

        // Act.
        const actual = service.request(request);

        // Assert.
        await expect(actual).rejects.toEqual(expected);
      });
    });

    describe("Client Error", () => {
      it("should return a rejected promise with the data as the error if an error code is returned", async () => {
        // Arrange.
        const url = `${domain}/api/failure/client`;
        const request = new HttpRequestBuilder().get().url(url).build();
        const service = getService();
        const expected = { status: 404, data: noData };

        // Act.
        const actual = service.request(request);

        // Assert.
        await expect(actual).rejects.toEqual(expected);
      });
    });

    describe("Server Error", () => {
      it("should return a rejected promise with the data as the error if an error code is returned", async () => {
        // Arrange.
        const url = `${domain}/api/failure/server`;
        const request = new HttpRequestBuilder().get().url(url).build();
        const service = getService();
        const expected = { status: 500, data: failure };

        // Act.
        const actual = service.request(request);

        // Assert.
        await expect(actual).rejects.toEqual(expected);
      });
    });

    describe("Internal Error", () => {
      it("should return a rejected promise with the message of the error that occurred", async () => {
        // Arrange.
        const url = `${domain}/api/failure/internal`;
        const request = new HttpRequestBuilder().get().url(url).build();
        const service = getService();
        const expected = {
          status: 500,
          data: expect.objectContaining({ message: failure.message }),
        };

        // Act.
        const actual = service.request(request);

        // Assert.
        await expect(actual).rejects.toEqual(expected);
      });
    });
  });
});
