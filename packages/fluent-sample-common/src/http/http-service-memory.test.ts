import { describe, expect, it } from "vitest";
import { HttpRequestBuilder } from "./http-request";
import { HttpResponseBuilder } from "./http-response";
import { HttpServiceMemory } from "./http-service-memory";

describe("HttpServiceMemory", () => {
  const createService = () => new HttpServiceMemory();

  it("should return a 404 rejected promise if a route is not set", async () => {
    // Arrange.
    const service = createService();
    const request = new HttpRequestBuilder()
      .get()
      .url("https://local.gaf.energy")
      .build();

    // Act.
    const actual = service.request(request);

    // Assert.
    await expect(actual).rejects.toEqual(
      expect.objectContaining({ status: 404 }),
    );
  });

  it("should return a 404 rejected promise if a route is not set with an associated method", async () => {
    // Arrange.
    const service = createService();
    const request = new HttpRequestBuilder()
      .get()
      .url("https://local.gaf.energy")
      .build();
    const response = () =>
      new HttpResponseBuilder().status(200).data("OK").build();

    // Act.
    service.set("patch", request.url, response);
    const actual = service.request(request);

    // Assert.
    await expect(actual).rejects.toEqual(
      expect.objectContaining({ status: 404 }),
    );
  });

  it("should return a rejected promise if the status code is a client error", async () => {
    // Arrange.
    const service = createService();
    const response = new HttpResponseBuilder()
      .data({ message: "You messed up" })
      .status(400)
      .build();
    const request = new HttpRequestBuilder()
      .url("https://gaf.energy")
      .post({ field: "bad-data" })
      .build();

    // Act.
    service.set(request.method, request.url, response);
    const actual = service.request(request);

    // Assert.
    await expect(actual).rejects.toEqual(response);
  });

  it("should return a rejected promise if the status code is a server error", async () => {
    // Arrange.
    const service = createService();
    const response = new HttpResponseBuilder()
      .data({ message: "I messed up" })
      .status(500)
      .build();
    const request = new HttpRequestBuilder()
      .url("https://gaf.energy")
      .delete()
      .build();

    // Act.
    service.set(request.method, request.url, response);
    const actual = service.request(request);

    // Assert.
    await expect(actual).rejects.toEqual(response);
  });

  it("should return the mapped url to result", async () => {
    // Arrange.
    const service = createService();
    const request = new HttpRequestBuilder()
      .get()
      .url("https://local.gaf.energy")
      .build();
    const response = new HttpResponseBuilder()
      .status(200)
      .data({ field: "looks-good" })
      .build();

    // Act.
    service.set(request.method, request.url, () => Promise.resolve(response));
    const actual = await service.request(request);

    // Assert.
    expect(actual).toEqual(response);
  });
});
